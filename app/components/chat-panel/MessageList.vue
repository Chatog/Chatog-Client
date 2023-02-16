<template>
  <div id="MessageList" class="message-list">
    <div
      class="message"
      v-for="msg of messages"
      :key="'msg-' + msg.msgId"
      :class="{ me: isMine(msg) }"
    >
      <v-avatar color="#fff" :size="32">{{
        msg.sender.nickname.substring(0, 1)
      }}</v-avatar>
      <div class="message__right">
        <div class="message__nickname mb-1">{{ msg.sender.nickname }}</div>
        <div class="message__text">{{ msg.text }}</div>
      </div>
      <div class="message__sending" v-show="msg.state === ChatMsgState.SENDING">
        <v-progress-circular
          indeterminate
          color="#fff"
          size="14"
          width="2"
        ></v-progress-circular>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChatMsg, ChatMsgState } from '@/store/chat';
import { selfMemberId } from '@/store/room';
import { toRefs } from 'vue';

const props = defineProps<{
  messages: ChatMsg[];
}>();

const { messages } = toRefs(props);

function isMine(msg: ChatMsg) {
  return msg.sender.memberId === selfMemberId();
}
</script>

<style scoped>
.message-list {
  height: 100%;
  width: 100%;
  overflow: scroll;
  position: absolute;
}
.message {
  display: flex;
  flex-direction: row;
  padding: 4px 0;
}
.message .v-avatar {
  user-select: none;
}
.message__right {
  margin-left: 6px;
  /* raise a little */
  position: relative;
  bottom: 6px;
}
.message__nickname {
  color: #fff;
  font-size: 12px;
  font-weight: 300;
  user-select: none;
}
.message__text {
  background-color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  word-break: break-all;
}
.message__sending {
  margin-top: auto;
}
.me {
  flex-direction: row-reverse;
}
.me .message__right {
  margin-right: 6px;
}
.me .message__nickname {
  text-align: right;
}
/* hide scroll bar */
::-webkit-scrollbar {
  width: 0;
}
</style>
