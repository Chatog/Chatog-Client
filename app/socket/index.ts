import { Res, ResCode } from '@/api';
import { alert } from '@/store/alert';
import { hideLoading, showLoading } from '@/store/loading';
import { io, Socket } from 'socket.io-client';
import { setSocketHandlers } from './eventHandler';

let socket: Socket | null = null;

/**
 * create socket
 * @param url socket server url
 * @param memberId member to connect socket
 */
export function initSocket(url: string, memberId: string): Promise<void> {
  // @TODO: url for dev
  socket = io(url, {
    auth: {
      memberId
    }
  });

  return new Promise((resolve, reject) => {
    if (!socket) {
      reject();
      return;
    }

    socket.on('connect', () => {
      console.log('[socket/index.ts] socket connected');
      resolve();
    });

    socket.on('disconnect', () => {
      console.log('[socket/index.ts] socket disconnected');
      // @TODO: do some clean jobs
    });

    setSocketHandlers(socket);
  });
}

export function socketRequest<P, R>(
  eventName: string,
  params?: P
): Promise<Res<R>> {
  return new Promise((resolve, reject) => {
    if (!socket) {
      throw new Error('[socket/index.ts] socket not valid');
    }

    showLoading();
    socket.emit(eventName, params, (res: Res<R>) => {
      hideLoading();
      if (res.code === ResCode.ERROR_MSG) {
        alert('error', res.msg);
        throw new Error(
          `[socket/index.ts] socket request error: ${eventName} ${JSON.stringify(
            params
          )}`
        );
      }
      resolve(res);
    });
  });
}
