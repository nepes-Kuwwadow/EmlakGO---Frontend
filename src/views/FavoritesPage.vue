<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { api } from '@/services/api';
import { useAuth } from '@/composables/useAuth';
import PropertyCard from '@/components/common/PropertyCard.vue';
import { Heart, Loader2, ArrowRight } from '@lucide/vue';

const { isAuthenticated } = useAuth();

const favorites = ref([]);
const loading = ref(true);

async function loadFavorites() {
  if (!isAuthenticated.value) {
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const res = await api.getFavorites();
    const data = res.data || (Array.isArray(res) ? res : []);
    // Map favorites to property objects
    favorites.value = data.map(fav => fav.property).filter(Boolean);
  } catch (err) {
    console.error('Halananlary ýüklemekde ýalňyşlyk:', err);
  } finally {
    loading.value = false;
  }
}

function handleFavoriteChanged({ id, isFavorited }) {
  if (!isFavorited) {
    favorites.value = favorites.value.filter(p => p.id !== id);
  }
}

onMounted(() => {
  loadFavorites();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center">
        <Heart class="w-5 h-5 fill-rose-500" />
      </div>
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">
          {{ $t('favorites.title') }}
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('favorites.desc') }}
        </p>
      </div>
    </div>

    <!-- If not authenticated -->
    <div v-if="!isAuthenticated" class="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 space-y-4">
      <Heart class="w-16 h-16 text-rose-300 dark:text-rose-700 mx-auto" />
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">
        {{ $t('favorites.title') }}
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        {{ $t('favorites.emptyDesc') }}
      </p>
      <div class="pt-2">
        <RouterLink
          to="/login"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition"
        >
          {{ $t('nav.login') }} <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-else-if="loading" class="flex flex-col items-center justify-center py-20 gap-3 text-emerald-600">
      <Loader2 class="w-8 h-8 animate-spin" />
      <span class="text-sm font-medium">{{ $t('common.loading') }}</span>
    </div>

    <!-- Grid -->
    <div v-else-if="favorites.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <PropertyCard
        v-for="prop in favorites"
        :key="prop.id"
        :property="prop"
        :is-favorited-initial="true"
        @favorited-changed="handleFavoriteChanged"
      />
    </div>

    <!-- Empty -->
    <div v-else class="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 space-y-3">
      <Heart class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
      <h3 class="text-lg font-bold text-gray-900 dark:text-white">
        {{ $t('favorites.emptyTitle') }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
        {{ $t('favorites.emptyDesc') }}
      </p>
      <RouterLink
        to="/properties"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition mt-2"
      >
        {{ $t('favorites.browseBtn') }}
      </RouterLink>
    </div>
  </div>
</template>
