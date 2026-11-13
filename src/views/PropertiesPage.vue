<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/services/api';
import PropertyCard from '@/components/common/PropertyCard.vue';
import PropertyFilter from '@/components/common/PropertyFilter.vue';
import { Building2, ChevronLeft, ChevronRight, Loader2 } from '@lucide/vue';

const route = useRoute();
const router = useRouter();

const properties = ref([]);
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0,
});
const loading = ref(false);

const filters = ref({
  city: route.query.city || '',
  category_id: route.query.category_id || '',
  min_price: route.query.min_price || '',
  max_price: route.query.max_price || '',
  rooms: route.query.rooms || '',
  page: Number(route.query.page) || 1,
});

async function fetchProperties() {
  loading.value = true;
  try {
    const params = {
      ...filters.value,
    };
    const res = await api.getProperties(params);
    if (res && res.data) {
      properties.value = res.data;
      pagination.value = {
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
        total: res.total || 0,
      };
    } else if (Array.isArray(res)) {
      properties.value = res;
      pagination.value = {
        current_page: 1,
        last_page: 1,
        total: res.length,
      };
    }
  } catch (err) {
    console.error('Emläkleri ýüklemekde ýalňyşlyk:', err);
    properties.value = [];
  } finally {
    loading.value = false;
  }
}

function handleFilterSearch(updatedFilters) {
  filters.value = {
    ...filters.value,
    ...updatedFilters,
    page: 1, // Reset to first page on filter change
  };
  syncQueryAndFetch();
}

function handleReset() {
  filters.value = {
    city: '',
    category_id: '',
    min_price: '',
    max_price: '',
    rooms: '',
    page: 1,
  };
  syncQueryAndFetch();
}

function changePage(newPage) {
  if (newPage < 1 || newPage > pagination.value.last_page) return;
  filters.value.page = newPage;
  syncQueryAndFetch();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function syncQueryAndFetch() {
  const query = {};
  Object.entries(filters.value).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) {
      query[k] = v;
    }
  });

  router.push({ query });
  fetchProperties();
}

// Watch route changes from browser navigation
watch(
  () => route.query,
  (newQuery) => {
    filters.value.city = newQuery.city || '';
    filters.value.category_id = newQuery.category_id || '';
    filters.value.min_price = newQuery.min_price || '';
    filters.value.max_price = newQuery.max_price || '';
    filters.value.rooms = newQuery.rooms || '';
    filters.value.page = Number(newQuery.page) || 1;
    fetchProperties();
  }
);

onMounted(() => {
  fetchProperties();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">
        {{ $t('properties.title') }}
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {{ $t('properties.desc') }}
      </p>
    </div>

    <!-- Filter Component -->
    <PropertyFilter
      v-model="filters"
      @search="handleFilterSearch"
      @reset="handleReset"
    />

    <!-- Results count bar -->
    <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
      <span>
        {{ $t('properties.foundCount', { count: pagination.total }) }}
      </span>
      <span v-if="loading" class="inline-flex items-center gap-1.5 text-xs text-emerald-600">
        <Loader2 class="w-3.5 h-3.5 animate-spin" /> {{ $t('common.loading') }}
      </span>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 space-y-3 animate-pulse">
        <div class="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Properties Grid -->
    <div v-else-if="properties.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <PropertyCard
        v-for="property in properties"
        :key="property.id"
        :property="property"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-800 p-8">
      <Building2 class="w-14 h-14 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ $t('properties.notFound') }}</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
        {{ $t('properties.notFoundDesc') }}
      </p>
      <button
        @click="handleReset"
        class="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition cursor-pointer"
      >
        {{ $t('properties.resetFilter') }}
      </button>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination.last_page > 1"
      class="flex items-center justify-center gap-2 pt-6"
    >
      <button
        @click="changePage(pagination.current_page - 1)"
        :disabled="pagination.current_page === 1"
        class="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>

      <div class="flex items-center gap-1">
        <button
          v-for="p in pagination.last_page"
          :key="p"
          @click="changePage(p)"
          class="w-10 h-10 rounded-xl text-sm font-semibold transition"
          :class="
            p === pagination.current_page
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          "
        >
          {{ p }}
        </button>
      </div>

      <button
        @click="changePage(pagination.current_page + 1)"
        :disabled="pagination.current_page === pagination.last_page"
        class="p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>
