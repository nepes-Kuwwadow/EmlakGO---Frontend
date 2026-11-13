<script setup>
import { ref, onMounted } from 'vue';
import { api } from '@/services/api';
import { Search, RotateCcw, Filter, MapPin, Building, DollarSign } from '@lucide/vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      city: '',
      category_id: '',
      min_price: '',
      max_price: '',
      rooms: '',
    }),
  },
  showLayoutToggle: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'search', 'reset']);

const categories = ref([]);
const loadingCategories = ref(false);

const cities = [
  'Aşgabat',
  'Arkadag',
  'Mary',
  'Türkmenabat',
  'Daşoguz',
  'Balkanabat',
  'Türkmenbaşy',
  'Änew',
];

const roomsList = [
  { label: 'Ählisi', value: '' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5+', value: '5' },
];

async function loadCategories() {
  loadingCategories.value = true;
  try {
    const res = await api.getCategories();
    categories.value = res.categories || [];
  } catch (err) {
    console.error('Kategoriýalary ýüklemekde ýalňyşlyk:', err);
  } finally {
    loadingCategories.value = false;
  }
}

function updateField(key, value) {
  const updated = { ...props.modelValue, [key]: value };
  emit('update:modelValue', updated);
  emit('search', updated);
}

function handleReset() {
  const resetState = {
    city: '',
    category_id: '',
    min_price: '',
    max_price: '',
    rooms: '',
  };
  emit('update:modelValue', resetState);
  emit('reset');
  emit('search', resetState);
}

onMounted(() => {
  loadCategories();
});
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm space-y-4">
    <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/60 pb-3">
      <div class="flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-base">
        <Filter class="w-4 h-4 text-emerald-600" />
        <span>{{ $t('filter.title') }}</span>
      </div>
      <button
        @click="handleReset"
        type="button"
        class="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 transition cursor-pointer"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        {{ $t('filter.reset') }}
      </button>
    </div>

    <!-- Filter Inputs Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Şäher -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          {{ $t('filter.city') }}
        </label>
        <div class="relative">
          <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            :value="modelValue.city"
            @change="updateField('city', $event.target.value)"
            class="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition cursor-pointer"
          >
            <option class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white" value="">{{ $t('filter.allCities') }}</option>
            <option class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white" v-for="c in cities" :key="c" :value="c">{{ $tCity(c) }}</option>
          </select>
        </div>
      </div>

      <!-- Kategoriýa -->
      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          {{ $t('filter.category') }}
        </label>
        <div class="relative">
          <Building class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            :value="modelValue.category_id"
            @change="updateField('category_id', $event.target.value)"
            class="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition cursor-pointer"
          >
            <option class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white" value="">{{ $t('filter.allCategories') }}</option>
            <option class="bg-white text-gray-900 dark:bg-gray-900 dark:text-white" v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ $tc(cat) }} ({{ cat.properties_count ?? 0 }})
            </option>
          </select>
        </div>
      </div>

      <!-- Baha Aralygy (Min - Max) -->
      <div class="sm:col-span-2 grid grid-cols-2 gap-2">
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {{ $t('filter.minPrice') }}
          </label>
          <div class="relative">
            <DollarSign class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              :placeholder="$t('filter.minPricePlaceholder')"
              :value="modelValue.min_price"
              @input="updateField('min_price', $event.target.value)"
              class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
            />
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {{ $t('filter.maxPrice') }}
          </label>
          <div class="relative">
            <DollarSign class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              :placeholder="$t('filter.maxPricePlaceholder')"
              :value="modelValue.max_price"
              @input="updateField('max_price', $event.target.value)"
              class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Otag sany selector -->
    <div class="pt-2 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ $t('filter.rooms') }}:</span>
        <div class="inline-flex rounded-xl bg-gray-100 dark:bg-gray-900 p-1">
          <button
            v-for="r in roomsList"
            :key="r.value"
            type="button"
            @click="updateField('rooms', r.value)"
            class="px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer"
            :class="
              String(modelValue.rooms) === String(r.value)
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            "
          >
            {{ r.value === '' ? $t('filter.allRooms') : r.label }}
          </button>
        </div>
      </div>

      <button
        @click="$emit('search', modelValue)"
        type="button"
        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition shadow-sm cursor-pointer"
      >
        <Search class="w-4 h-4" />
        {{ $t('filter.search') }}
      </button>
    </div>
  </div>
</template>
