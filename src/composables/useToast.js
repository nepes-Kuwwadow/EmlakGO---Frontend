import { ref } from 'vue';

const toasts = ref([]);
let toastId = 0;

export function useToast() {
  function show(message, type = 'success', duration = 3500) {
    const id = ++toastId;
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      remove(id);
    }, duration);
  }

  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }

  return {
    toasts,
    show,
    success: (msg, dur) => show(msg, 'success', dur),
    error: (msg, dur) => show(msg, 'error', dur),
    info: (msg, dur) => show(msg, 'info', dur),
    remove,
  };
}
