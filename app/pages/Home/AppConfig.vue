<template>
  <div class="home-form-page">
    <div class="text-h5 home-form-page__title">CHANGE APP CONFIG</div>
    <div class="home-form-page__form">
      <div>
        <v-text-field
          label="default nickname"
          variant="outlined"
          v-model="dnn"
        ></v-text-field>
        <v-text-field
          readonly
          label="records save path"
          variant="outlined"
          v-model="rsp"
          append-inner-icon="mdi-folder"
          @click:append-inner="selectRSP"
        >
        </v-text-field>
      </div>
    </div>
    <v-btn variant="flat" color="primary" @click="confirm">Confirm</v-btn>
    <v-btn variant="tonal" @click="$router.back()">Back</v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defaultNickname, recordsSavePath } from '@/utils/storage';
import { alert } from '@/store/alert';

const rsp = ref(recordsSavePath());

async function selectRSP() {
  const newRSP = await window.ELECTRON_API?.selectPath(
    rsp.value,
    'select the new records save path'
  );
  if (newRSP) {
    rsp.value = newRSP;
  }
}

const dnn = ref(defaultNickname());

function confirm() {
  if (!dnn.value) {
    alert('warning', 'default nick name cannot be empty');
    return;
  }
  try {
    recordsSavePath(rsp.value);
    defaultNickname(dnn.value);
    alert('success', 'change applied');
  } catch (e) {
    console.error(e);
    alert('error', 'change failed');
  }
}
</script>
