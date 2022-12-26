import axios from '@/api';
import { Res } from '.';

interface ReqCreateRoomParam {
  nickname: string;
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

interface ReqJoinRoomParam {
  nickname: string;
  roomNumber: string;
}
export async function reqJoinRoom(
  params: ReqJoinRoomParam
): Promise<Res<ReqCreateRoomRes>> {
  return await axios.post('/room/join', params);
}
