import axios from '@/api';
import { Res } from '.';

interface ReqCreateRoomParam {
  roomName: string;
  banVideo: boolean;
  banAudio: boolean;
  banScreen: boolean;
  banChat: boolean;
}
interface ReqCreateRoomRes {
  roomId: string;
}
export async function reqCreateRoom(
  params: ReqCreateRoomParam
): Promise<Res<ReqCreateRoomRes>> {
  return await axios.post('/room/create', params);
}

export async function reqJoinRoom(
  roomNumber: string
): Promise<Res<ReqCreateRoomRes>> {
  return await axios.post('/room/join', { roomNumber });
}
