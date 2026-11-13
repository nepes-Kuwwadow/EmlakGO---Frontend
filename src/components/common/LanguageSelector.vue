<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from '@/i18n';
import FlagIcon from '@/components/common/FlagIcon.vue';
import { Check, ChevronDown } from '@lucide/vue';

const { locale, setLocale, availableLocales } = useI18n();

const isOpen = ref(false);
const dropdownRef = ref(null);

function selectLang(code) {
  setLocale(code);
  isOpen.value = false;
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const currentItem = () => availableLocales.find(l => l.code === locale.value) || availableLocales[0];
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      type="button"
      @click="isOpen = !isOpen"
      class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:bg-emerald-50/40 dark:hover:bg-gray-700/60 transition shadow-xs text-xs font-semibold cursor-pointer active:scale-95"
      :title="currentItem().label"
    >
      <FlagIcon :code="currentItem().code" />
      <span class="font-bold tracking-wide uppercase">{{ currentItem().short }}</span>
      <ChevronDown class="w-3.5 h-3.5 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/90 dark:border-gray-700 shadow-xl shadow-gray-900/10 dark:shadow-black/50 py-1.5 z-50 backdrop-blur-md transition-all animate-in fade-in duration-150"
    >
      <div class="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700/70">
        {{ $t('') || 'Dil / Language' }}
      </div>

      <div class="p-1.5 space-y-0.5">
        <button
          v-for="item in availableLocales"
          :key="item.code"
          type="button"
          @click="selectLang(item.code)"
          class="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          :class="locale === item.code
            ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/80 hover:text-gray-900 dark:hover:text-white'"
        >
          <div class="flex items-center gap-2.5">
            <FlagIcon :code="item.code" />
            <span>{{ item.label }}</span>
          </div>
          <Check v-if="locale === item.code" class="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        </button>
      </div>
    </div>
  </div>
</template>
