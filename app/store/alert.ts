import { defineStore } from 'pinia';
import { ref } from 'vue';

type AlertType = 'info' | 'success' | 'warning' | 'error';

export const useAlertStore = defineStore('alert', () => {
  const alertType = ref<AlertType>('info');
  const alertText = ref('');
  const alertShow = ref(false);

  return { alertType, alertText, alertShow };
});

let hideAlertTimer: any = null;
export function alert(type: AlertType, text: string, timeout: number = 2000) {
  const alertStore = useAlertStore();
  alertStore.alertType = type;
  alertStore.alertText = text;
  alertStore.alertShow = true;
  if (hideAlertTimer) {
    clearTimeout(hideAlertTimer);
  }
  hideAlertTimer = setTimeout(() => {
    alertStore.alertShow = false;
  }, timeout);
}
