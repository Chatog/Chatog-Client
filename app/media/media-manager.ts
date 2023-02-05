import { Res, ResCode } from '@/api';
import * as mediasoup from 'mediasoup-client';
import {
  Transport,
  Producer,
  Consumer,
  Device,
  RtpCapabilities,
  TransportOptions,
  ProducerOptions,
  ConsumerOptions
} from 'mediasoup-client/lib/types';
import { Socket } from 'socket.io-client';

/**
 * types
 */
export enum SignalingEvent {
  joinRouter = 'joinRouter',
  getRouterCapabilities = 'getRouterCapabilities',
  createTransport = 'createTransport',
  connectTransport = 'connectTransport',
  createProducer = 'createProducer',
  createConsumer = 'createConsumer',
  resumeConsumer = 'resumeConsumer',
  closeProducer = 'closeProducer',
  closeConsumer = 'closeConsumer'
}

export type ServerConsumerOptions = {
  producerId: string;
  rtpCapabilities: RtpCapabilities;
  paused?: boolean;
  appData?: Record<string, unknown>;
};

/**
 * class
 */
export class MediaManagerClient {
  private _debug: boolean;

  private _device: Device;
  private _sendTransport: Transport | null = null;
  private _recvTransport: Transport | null = null;
  private _producers: Map<string, Producer> = new Map();
  private _consumers: Map<string, Consumer> = new Map();

  private _signalingClient?: Socket;

  constructor(debug = true) {
    this._debug = debug;
    // init multi-platform adapter
    this._device = new mediasoup.Device();
  }

  private socketRequest<T>(event: string, payload?: any): Promise<T> {
    console.debug('[media-manager] send:', event, payload);
    return new Promise((resolve, reject) => {
      if (!this._signalingClient) {
        reject('[media-manager] not init');
        return;
      }
      // reject after 10 seconds
      const timer = setTimeout(() => {
        reject('[media-manager] time out');
      }, 10 * 1000);

      this._signalingClient.emit(
        'MediaManager.' + event,
        payload,
        (res: Res<T>) => {
          console.debug('[media-manager] recv:', event, res);
          clearTimeout(timer);
          if (res.code === ResCode.SUCCESS) {
            resolve(res.data);
          } else {
            reject(res.msg);
          }
        }
      );
    });
  }

  private initSignaling(socket: Socket) {
    // clean media transports when signaling disconnects
    socket.on('disconnect', () => {
      if (this._sendTransport) {
        this._sendTransport.close();
        this._sendTransport = null;
      }
      if (this._recvTransport) {
        this._recvTransport.close();
        this._recvTransport = null;
      }
    });
  }

  private async createSendTransport() {
    // ask server to create transport
    const transportOptions = await this.socketRequest<TransportOptions>(
      SignalingEvent.createTransport,
      {
        type: 'send'
      }
    );
    this._sendTransport = this._device.createSendTransport(transportOptions);
    // ask server to connect
    this._sendTransport.on(
      'connect',
      ({ dtlsParameters }, callback, errback) => {
        this.socketRequest(SignalingEvent.connectTransport, {
          transportId: this._sendTransport?.id,
          dtlsParameters
        })
          .then(callback)
          .catch(errback);
      }
    );
    // ask server to create producer
    this._sendTransport.on(
      'produce',
      async ({ kind, rtpParameters, appData }, callback, errback) => {
        try {
          const producerId = await this.socketRequest<string>(
            SignalingEvent.createProducer,
            {
              transportId: this._sendTransport?.id,
              kind,
              rtpParameters,
              appData
            }
          );
          callback({ id: producerId });
        } catch (e: any) {
          errback(e);
        }
      }
    );
    this._debug && console.debug('[media-manager] send transport created');
  }

  private async createRecvTransport() {
    // ask server to create transport
    const transportOptions = await this.socketRequest<TransportOptions>(
      SignalingEvent.createTransport,
      {
        type: 'recv'
      }
    );
    this._recvTransport = this._device.createRecvTransport(transportOptions);
    // ask server to connect
    this._recvTransport.on(
      'connect',
      ({ dtlsParameters }, callback, errback) => {
        this.socketRequest(SignalingEvent.connectTransport, {
          transportId: this._recvTransport?.id,
          dtlsParameters
        })
          .then(callback)
          .catch(errback);
      }
    );
    this._debug && console.debug('[media-manager] recv transport created');
  }

  init(signalingClient: Socket) {
    this._signalingClient = signalingClient;
    this.initSignaling(signalingClient);
  }

  async joinRouter(routerId: string) {
    const routerRtpCapabilities = await this.socketRequest<RtpCapabilities>(
      SignalingEvent.getRouterCapabilities,
      routerId
    );
    // negotiate with server capavilities
    await this._device.load({ routerRtpCapabilities });

    await this.socketRequest(SignalingEvent.joinRouter, {
      routerId,
      device: this._device.handlerName,
      rtpCapabilities: this._device.rtpCapabilities
    });
  }

  async pubMedia(
    track: MediaStreamTrack,
    options?: ProducerOptions
  ): Promise<string> {
    // ensure _sendTransport
    if (!this._sendTransport) {
      await this.createSendTransport();
    }
    // create client-side producer
    const producer = await this._sendTransport?.produce({
      ...options,
      track
    });
    if (!producer) throw new Error('[media-manager] create producer failed');
    this._producers.set(producer.id, producer);
    producer.on('transportclose', () => {
      this._producers.delete(producer.id);
    });

    return producer.id;
  }

  async subMedia(
    mediaId: string,
    options?: ServerConsumerOptions
  ): Promise<MediaStreamTrack> {
    // ensure _recvTransport
    if (!this._recvTransport) {
      await this.createRecvTransport();
    }
    // create server-side consumer
    const consumerOptions = await this.socketRequest<ConsumerOptions>(
      SignalingEvent.createConsumer,
      {
        ...options,
        producerId: mediaId
      }
    );
    // create client-side consumer
    const consumer = await this._recvTransport?.consume(consumerOptions);
    if (!consumer) throw new Error('[media-manager] create consumer failed');
    this._consumers.set(consumer.id, consumer);
    consumer.on('transportclose', () => {
      this._consumers.delete(consumer.id);
    });
    // after consumer created, resume server-side consumer
    await this.socketRequest(SignalingEvent.resumeConsumer, consumer.id);

    return consumer.track;
  }

  async unpubMedia(mediaId: string) {
    if (this._producers.has(mediaId)) {
      const producer = this._producers.get(mediaId)!;
      producer.close();
      await this.socketRequest(SignalingEvent.closeProducer, producer.id);
      this._producers.delete(producer.id);
      return;
    }
    if (this._consumers.has(mediaId)) {
      const consumer = this._consumers.get(mediaId)!;
      consumer.close();
      await this.socketRequest(SignalingEvent.closeConsumer, consumer.id);
      this._consumers.delete(consumer.id);
      return;
    }
  }

  async getMediaStats(mediaId: string): Promise<RTCStatsReport> {
    let producerOrConsumer: Producer | Consumer | undefined;
    producerOrConsumer = this._producers.get(mediaId);
    if (!producerOrConsumer) producerOrConsumer = this._consumers.get(mediaId);
    return producerOrConsumer
      ? producerOrConsumer.getStats()
      : Promise.reject('[media-manager] cannot find media');
  }
}
