<template>
  <div>
    <v-dialog v-model="recordDialogShow" width="60%" max-width="360" persistent>
      <v-card>
        <v-card-title>Record Options</v-card-title>
        <div class="select-group">
          <v-select
            v-model="videoToRecord"
            label="select video"
            :disabled="videoItems.length === 0"
            :items="videoItems"
            item-title="label"
            item-value="value"
          ></v-select>
          <v-select
            v-model="audioToRecord"
            label="select audio"
            :disabled="audioItems.length === 0"
            :items="audioItems"
            item-title="label"
            item-value="value"
          ></v-select>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#666" @click="recordDialogShow = false">Cancel</v-btn>
          <v-btn color="primary" @click="startRecord">Start Record</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import MediaManager from '@/media';
import { useMediaStore } from '@/store/media';
import { useUIStore } from '@/store/ui';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import RecordAgent from '@/modules/record-agent';
import { alert } from '@/store/alert';

const { recordDialogShow } = storeToRefs(useUIStore());
const { localMic, localCameraMedia, localScreenMedia, isRecording } =
  storeToRefs(useMediaStore());

interface SelectItem {
  label: string;
  value: string;
}
const audioToRecord = ref<SelectItem>({
  label: '',
  value: ''
});
const audioItems = computed(() => {
  const ret: SelectItem[] = [];
  if (localMic.value !== '')
    ret.push({
      label: 'Microphone',
      value: localMic.value
    });
  // side effect
  if (ret.length > 0) {
    audioToRecord.value = ret[0];
  }
  return ret;
});

const videoToRecord = ref<SelectItem>({
  label: '',
  value: ''
});
const videoItems = computed(() => {
  const ret: SelectItem[] = [];
  if (localCameraMedia.value?.videoId)
    ret.push({
      label: 'Camera',
      value: localCameraMedia.value?.videoId
    });
  if (localScreenMedia.value?.videoId)
    ret.push({
      label: 'Screen Sharing',
      value: localScreenMedia.value?.videoId
    });
  // side effect
  if (ret.length > 0) {
    videoToRecord.value = ret[0];
  }
  return ret;
});

function startRecord() {
  const tracks: MediaStreamTrack[] = [];
  if (audioToRecord.value.value !== '') {
    const audioTrack = MediaManager.getMediaTrack(audioToRecord.value.value);

    audioTrack && tracks.push(audioTrack);
  }
  if (videoToRecord.value.value !== '') {
    const videoTrack = MediaManager.getMediaTrack(videoToRecord.value.value);

    videoTrack && tracks.push(videoTrack);
  }
  const recordMediaStream = new MediaStream(tracks);

  RecordAgent.startRecord(recordMediaStream, '');

  isRecording.value = RecordAgent.isRecording();
  recordDialogShow.value = false;
  alert('success', 'recording start');
}
</script>

<style scoped>
.select-group {
  margin: 0 16px;
  margin-top: 16px;
}
</style>
