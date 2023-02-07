import { defineStore } from 'pinia';
import { ref } from 'vue';
import { selfMemberId } from './room';

export enum ChatMsgState {
  SENDING,
  SUCCESS,
  FAIL
}
export interface ChatMsg {
  msgId: string;
  text: string;
  state: ChatMsgState;
  time: number;
  sender: {
    memberId: string;
    nickname: string;
  };
  localId: string;
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMsg[]>([]);

  function addLocalSendingMessage(text: string): ChatMsg {
    const time = Date.now();
    const localMsgId = 'msg-local-' + time;
    const locaMsg = {
      msgId: localMsgId,
      text,
      state: ChatMsgState.SENDING,
      time,
      sender: {
        memberId: selfMemberId(),
        nickname: 'Me'
      },
      localId: localMsgId
    };
    messages.value.push(locaMsg);
    return locaMsg;
  }

  return {
    messages,
    addLocalSendingMessage
  };
});
