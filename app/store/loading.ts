import { defineStore } from 'pinia';
import { ref } from 'vue';

const DEFAULT_LOADING_TEXT = 'Loading......';

export const useLoadingStore = defineStore('loading', () => {
  const loadingShow = ref(false);
  const loadingText = ref(DEFAULT_LOADING_TEXT);

  return { loadingShow, loadingText };
});

export function showLoading(text: string = DEFAULT_LOADING_TEXT) {
  const loadingStore = useLoadingStore();
  loadingStore.loadingText = text;
  loadingStore.loadingShow = true;
}

export function hideLoading() {
  const loadingStore = useLoadingStore();
  loadingStore.loadingShow = false;
}
