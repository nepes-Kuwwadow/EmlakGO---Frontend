<script setup>
import { useToast } from '@/composables/useToast';
import { CheckCircle2, AlertCircle, Info, X } from '@lucide/vue';

const { toasts, remove } = useToast();
</script>

<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
    <transition-group
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-lg border text-sm font-medium transition-all"
        :class="{
          'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-200': toast.type === 'success',
          'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/80 dark:border-rose-800 dark:text-rose-200': toast.type === 'error',
          'bg-cyan-50 border-cyan-200 text-cyan-800 dark:bg-cyan-950/80 dark:border-cyan-800 dark:text-cyan-200': toast.type === 'info',
        }"
      >
        <div class="flex items-center gap-2.5">
          <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
          <AlertCircle v-else-if="toast.type === 'error'" class="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
          <Info v-else class="w-5 h-5 flex-shrink-0 text-cyan-600 dark:text-cyan-400" />
          <span>{{ toast.message }}</span>
        </div>
        <button
          @click="remove(toast.id)"
          class="opacity-70 hover:opacity-100 p-1 rounded-lg transition-opacity"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </transition-group>
  </div>
</template>
