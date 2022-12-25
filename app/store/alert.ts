import { defineStore } from 'pinia';
import { ref } from 'vue';

type AlertType = 'info' | 'success' | 'warning' | 'error';

let hideAlertTimer: any = null;

export const useAlertStore = defineStore('alert', () => {
  const alertType = ref<AlertType>('info');
  const alertText = ref('');
  const alertShow = ref(false);

  function alert(type: AlertType, text: string, timeout: number = 2000) {
    alertType.value = type;
    alertText.value = text;
    alertShow.value = true;
    if (hideAlertTimer) {
      clearTimeout(hideAlertTimer);
    }
    hideAlertTimer = setTimeout(() => {
      alertShow.value = false;
    }, timeout);
  }

  return { alertType, alertText, alertShow, alert };
});
