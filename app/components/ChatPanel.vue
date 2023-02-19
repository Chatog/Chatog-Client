<template>
  <div class="chat-panel">
    <div class="chat-panel__title">
      <div>Text Chat</div>
      <v-icon
        icon="mdi-close"
        color="#fff"
        @click="
          () => {
            chatPanelShow = false;
          }
        "
      ></v-icon>
    </div>
    <v-divider color="#FFF" class="my-2" thickness="2"></v-divider>
    <div class="chat-panel__main">
      <MessageList :messages="messages"></MessageList>
    </div>
    <div class="chat-panel__actions">
      <v-textarea
        class="mr-2"
        v-model="inputMsg"
        variant="solo"
        rows="1"
        bgColor="#FFF"
        color="#000"
        no-resize
        hide-details
        density="compact"
      ></v-textarea>
      <v-btn class="send-btn" color="primary" size="small" @click="sendMsg">
        <v-icon class="ml-1" icon="mdi-send" size="24"></v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MessageList from '@/components/chat-panel/MessageList.vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '@/store/chat';
import { reqChatSend } from '@/api/chat';
import { useUIStore } from '@/store/ui';

const ChatStore = useChatStore();
const { messages } = storeToRefs(ChatStore);
const { chatPanelShow } = storeToRefs(useUIStore());

const inputMsg = ref('');

function sendMsg() {
  if (!inputMsg.value) return;
  const msg = ChatStore.addLocalSendingMessage(inputMsg.value);
  // dont care about return or not
  // sync msg will handle message state
  reqChatSend(msg);

  inputMsg.value = '';
}
</script>

<style scoped>
.chat-panel {
  width: 300px;
  height: 100%;
  background-color: #141414;

  display: flex;
  flex-direction: column;
  padding: 16px 16px;
}
.chat-panel__title {
  color: #fff;
  font-weight: 300;
  user-select: none;
  display: flex;
  flex-direction: row;
}
.chat-panel__title i {
  margin-left: auto;
}
.chat-panel__main {
  flex: 1;
  position: relative;
}
.chat-panel__actions {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.send-btn {
  height: 100%;
}
</style>
