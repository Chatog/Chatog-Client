<template>
  <div>
    <v-dialog v-model="screenSourceDialogShow" width="600" persistent>
      <v-card>
        <v-card-title>Screen Sharing</v-card-title>
        <div class="screen-list__scroll">
          <div class="screen-list">
            <div
              class="screen-item"
              v-for="screen of screens"
              :key="'screen@' + screen.sourceId"
              @click="chooseScreen(screen.sourceId)"
              :class="
                screen.sourceId === chosedScreen ? 'screen-item__chosed' : ''
              "
            >
              <img class="screen-item__thumbnail" :src="screen.thumbnail" />
              <div class="screen-item__name">{{ screen.name }}</div>
            </div>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#666" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="confirmScreen">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useScreenSourceDiaogStore } from '@/store/screen-source-dialog';
import { storeToRefs } from 'pinia';

const ScreenSourceDialogStore = useScreenSourceDiaogStore();
const { screenSourceDialogShow, screens, chosedScreen } = storeToRefs(
  ScreenSourceDialogStore
);

function chooseScreen(screenId: string) {
  chosedScreen.value = screenId;
}

function closeDialog() {
  ScreenSourceDialogStore.screenReject('[ScreenSourceDialog] user cancel');
}

function confirmScreen() {
  ScreenSourceDialogStore.screenResolve(chosedScreen.value);
}
</script>

<style scoped>
.screen-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 20px;

  position: relative;
  width: 600px;
}
.screen-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
  height: 192px;
  padding: 16px;
  padding-bottom: 8px;
  border-radius: 4px;
}
.screen-item:hover {
  cursor: pointer;
  background-color: #e0e0e0;
}
.screen-item__name {
  width: 248px;
  height: 20px;
  line-height: 20px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;

  font-size: 14px;
  text-align: center;

  margin-top: 8px;
}
.screen-item__thumbnail {
  width: 248px;
  height: 140px;
  flex: 1;
}
.screen-item__chosed {
  background-color: #bdbdbd !important;
}
.screen-list__scroll {
  width: 600px;
  height: 384px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
