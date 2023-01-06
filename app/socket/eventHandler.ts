import { Socket } from 'socket.io-client';

export type Callback = (v: any) => void;

export type EventHandler<T> = (
  socket: Socket,
  data: T,
  callback: Callback
) => void;

const eventHandlers: Map<string, EventHandler<any>> = new Map();

export function registerEventHandler(
  eventName: string,
  handler: EventHandler<any>
) {
  eventHandlers.set(eventName, handler);
}

export function setSocketHandlers(socket: Socket) {
  for (const eventName of eventHandlers.keys()) {
    const handler = eventHandlers.get(eventName)!;
    socket.on(eventName, (data, callback) => {
      handler(socket, data, callback);
    });
  }
}
