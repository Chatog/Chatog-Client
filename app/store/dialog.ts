import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDialogStore = defineStore('dialog', () => {
  const dialogShow = ref(false);
  const dialogTitle = ref('');
  const dialogText = ref('');
  const dialogResolve = ref<(v: undefined) => void>(() => {});
  const dialogReject = ref(() => {});

  return { dialogShow, dialogTitle, dialogText, dialogResolve, dialogReject };
});

export function showDialog(content: string): Promise<undefined> {
  const dialogStore = useDialogStore();
  return new Promise((resolve, reject) => {
    dialogStore.dialogTitle = 'ATTENTION';
    dialogStore.dialogText = content;
    dialogStore.dialogResolve = resolve;
    dialogStore.dialogReject = reject;
    dialogStore.dialogShow = true;
  });
}
