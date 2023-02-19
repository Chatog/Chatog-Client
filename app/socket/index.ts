import { Res, ResCode } from '@/api';
import { configureWindow } from '@/modules/electron/api';
import router from '@/plugins/vue-router';
import { alert } from '@/store/alert';
import { hideLoading, showLoading } from '@/store/loading';
import { IS_ELECTRON } from '@/utils/common';
import { io, Socket } from 'socket.io-client';
import { registerSyncHandlers } from './sync';

let socket: Socket | null = null;

/**
 * create socket
 * @param url socket server url
 * @param memberId member to connect socket
 */
export function initSocket(url: string, memberId: string): Promise<Socket> {
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
      resolve(socket!);
    });

    socket.on('disconnect', () => {
      console.log('[socket/index.ts] socket disconnected');
      if (IS_ELECTRON) {
        configureWindow('home');
      }
      router.push('/home');
    });

    registerSyncHandlers(socket);
  });
}

export function socketRequest<P, R>(
  eventName: string,
  params?: P,
  showloading = true
): Promise<Res<R>> {
  return new Promise((resolve, reject) => {
    if (!socket) {
      throw new Error('[socket/index.ts] socket not valid');
    }
    console.debug('[socketRequest] send:', eventName, params);
    if (showloading) showLoading();
    socket.emit(eventName, params, (res: Res<R>) => {
      console.debug('[socketRequest] recv:', eventName, res);
      if (showloading) hideLoading();
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

export function closeSocket() {
  socket?.close();
}
