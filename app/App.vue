<template>
  <v-app>
    <v-main>
      <v-btn @click="to('/')">HOME</v-btn>
      <v-btn @click="to('/about')">ABOUT</v-btn>
      <router-view></router-view>

      <v-btn @click="() => ICounter.inc()">Counter: {{ ICounter.count }}</v-btn>

      <div v-if="!users.length">loading...</div>
      <div v-for="u of users">{{ u.uname }}[{{ u.uid }}]</div>

      <v-btn @click="() => openStats()">Open Stats</v-btn>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCounterStore } from '@/store/counter';
import { onMounted, Ref, ref } from 'vue';
import axios from 'axios';
import { isElectron } from '@/utils/common';

const router = useRouter();
function to(path: string) {
  router.push({ path });
}

const ICounter = useCounterStore();

interface UserInfo {
  uid: number;
  uname: string;
}
const users: Ref<UserInfo[]> = ref([]);
onMounted(() => {
  axios
    .get('/api/users')
    .then((res) => {
      console.log('response:', res);
      users.value = res.data.data as UserInfo[];
    })
    .catch((err) => console.error(err));
});

function openStats() {
  if (!isElectron()) {
    console.warn('not in electron');
    return;
  }
  window.ELECTRON_API?.openStats();
}
</script>
