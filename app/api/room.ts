import axios from '@/api';
import { Res } from '.';

export interface ReqCreateRoomParam {
  nickname: string;
  roomName: string;
  banVideo: boolean;
  banAudio: boolean;
  banScreen: boolean;
  banChat: boolean;
}
export async function reqCreateRoom(
  params: ReqCreateRoomParam
): Promise<Res<RoomInfo>> {
  return await axios.post('/room/create', params);
}

export interface ReqJoinRoomParam {
  nickname: string;
  roomNumber: string;
}
export async function reqJoinRoom(
  params: ReqJoinRoomParam
): Promise<Res<RoomInfo>> {
  return await axios.post('/room/join', params);
}

export interface RoomInfo {
  roomId: string;
  roomName: string;
  roomStartTime: number;
}
export async function reqGetRoomInfo(roomId: string): Promise<Res<RoomInfo>> {
  return await axios.get('/room/info', { params: { roomId } });
}

export interface RoomMember {
  memberId: string;
  nickname: string;
  banVideo: boolean;
  banAudio: boolean;
  banScreen: boolean;
  isRoomOwner: boolean;
}
export async function reqGetRoomMembers(
  roomId: string
): Promise<Res<RoomMember[]>> {
  return await axios.get('/room/members', { params: { roomId } });
}

export async function reqQuitRoom(roomId: string): Promise<Res<void>> {
  return await axios.post('/room/quit', { roomId });
}
