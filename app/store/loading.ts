import { defineStore } from 'pinia';
import { ref } from 'vue';

const DEFAULT_LOADING_TEXT = 'Loading......';

export const useLoadingStore = defineStore('loading', () => {
  const loadingShow = ref(false);
  const loadingText = ref(DEFAULT_LOADING_TEXT);

  function showLoading(text: string = DEFAULT_LOADING_TEXT) {
    loadingText.value = text;
    loadingShow.value = true;
  }

  function hideLoading() {
    loadingShow.value = false;
  }

  return { loadingShow, loadingText, showLoading, hideLoading };
});
