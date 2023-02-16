import { defineStore } from 'pinia';
import { ref, nextTick } from 'vue';
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
    updateMessages([...messages.value, locaMsg]);
    return locaMsg;
  }

  function updateMessages(msgs: ChatMsg[]) {
    messages.value = msgs;
    // after messages update, scroll message list to the bottom
    nextTick(() => {
      messageListScrollToBottom();
    });
  }

  return {
    messages,
    updateMessages,
    addLocalSendingMessage
  };
});

export function messageListScrollToBottom() {
  const el = document.getElementById('MessageList');
  if (!el) {
    console.warn('[messageListScrollToBottom] no #MessageList');
    return;
  }
  const scrollHeight = el.scrollHeight;
  el.scroll({
    top: scrollHeight,
    behavior: 'smooth'
  });
}
