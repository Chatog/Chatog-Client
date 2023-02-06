import axios from '@/api';
import { socketRequest } from '@/socket';
import { Res } from '.';

/**
 * http api
 */
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
): Promise<Res<string>> {
  return await axios.post('/room/create', params);
}

export interface ReqJoinRoomParam {
  nickname: string;
  roomNumber: string;
}
export async function reqJoinRoom(
  params: ReqJoinRoomParam
): Promise<Res<string>> {
  return await axios.post('/room/join', params);
}

/**
 * socket api
 */
export interface RoomInfo {
  roomId: string;
  roomName: string;
  roomStartTime: number;
  roomOwnerId: string;
}
export async function reqGetRoomInfo(): Promise<Res<RoomInfo>> {
  return socketRequest('/room/info');
}

export interface RoomMemberVO {
  memberId: string;
  nickname: string;
  banVideo: boolean;
  banAudio: boolean;
  banScreen: boolean;
  isRoomOwner: boolean;
}
export async function reqGetRoomMembers(): Promise<Res<RoomMemberVO[]>> {
  return socketRequest('/room/members');
}

export async function reqQuitRoom(): Promise<Res<void>> {
  return socketRequest('/room/quit');
}
