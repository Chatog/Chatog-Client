import { socketRequest } from '@/socket';
import { ChatMsg } from '@/store/chat';
import { Res } from '.';

export async function reqChatSend(msg: ChatMsg): Promise<Res<void>> {
  return socketRequest('/chat/send', msg);
}
