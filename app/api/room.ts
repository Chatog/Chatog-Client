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
export interface ReqCreateRoomRes {
  roomId: string;
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

export interface ReqGetRoomInfoParam {
  roomId: string;
}
export interface RoomInfo {
  roomId: string;
  roomName: string;
  roomStartTime: number;
}
export async function reqGetRoomInfo(
  params: ReqGetRoomInfoParam
): Promise<Res<RoomInfo>> {
  return await axios.get('/room/info', { params });
}

export interface ReqGetRoomMembersParam {
  roomId: string;
}
export interface RoomMemberVO {
  memberId: string;
  nickname: string;
  banVideo: boolean;
  banAudio: boolean;
  banScreen: boolean;
  isRoomOwner: boolean;
}
export async function reqGetRoomMembers(
  params: ReqGetRoomMembersParam
): Promise<Res<RoomMemberVO[]>> {
  return await axios.get('/room/members', { params });
}
