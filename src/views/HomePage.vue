<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { api } from '@/services/api';
import PropertyCard from '@/components/common/PropertyCard.vue';
import { 
  Search, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  ArrowRight,
  Home,
  CheckCircle2,
  DollarSign
} from '@lucide/vue';

const router = useRouter();

const categories = ref([]);
const featuredProperties = ref([]);
const loading = ref(true);

const searchCity = ref('');
const searchCategory = ref('');
const searchRooms = ref('');

const cities = [
  'Aşgabat',
  'Arkadag',
  'Mary',
  'Türkmenabat',
  'Daşoguz',
  'Balkanabat',
  'Türkmenbaşy',
];

async function loadData() {
  loading.value = true;
  try {
    const [catRes, propRes] = await Promise.all([
      api.getCategories().catch(() => ({ categories: [] })),
      api.getProperties({ page: 1 }).catch(() => ({ data: [] })),
    ]);

    categories.value = catRes.categories || [];
    featuredProperties.value = propRes.data || (Array.isArray(propRes) ? propRes : []);
  } catch (err) {
    console.error('Maglumat ýüklemekde ýalňyşlyk:', err);
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  const query = {};
  if (searchCity.value) query.city = searchCity.value;
  if (searchCategory.value) query.category_id = searchCategory.value;
  if (searchRooms.value) query.rooms = searchRooms.value;

  router.push({
    path: '/properties',
    query,
  });
}

function selectCategory(catId) {
  router.push({
    path: '/properties',
    query: { category_id: catId },
  });
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="space-y-16 sm:space-y-24">
    <!-- Hero Section -->
    <section class="relative pt-8 sm:pt-14 pb-12 overflow-hidden">
      <!-- Background Ambient Glow -->
      <div class="absolute inset-0 -z-10 flex items-center justify-center">
        <div class="w-[600px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div class="w-[450px] h-[300px] bg-teal-500/10 dark:bg-teal-500/5 blur-[100px] rounded-full pointer-events-none -translate-x-40"></div>
      </div>

      <div class="max-w-5xl mx-auto px-4 text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles class="w-3.5 h-3.5 text-emerald-500" />
          {{ $t('home.badge') }}
        </div>

        <!-- Main Headline -->
        <h1 class="text-4xl sm:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight sm:leading-tight">
          {{ $t('home.heroTitle1') }}
          <span class="block bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            {{ $t('home.heroTitle2') }}
          </span>
        </h1>

        <p class="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {{ $t('home.heroDesc') }}
        </p>

        <!-- Quick Search Bar Card -->
        <div class="mt-8 sm:mt-10 max-w-4xl mx-auto bg-white dark:bg-gray-800/90 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/40 dark:shadow-none">
          <form @submit.prevent="handleSearch" class="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
            <!-- City -->
            <div class="p-2 sm:border-r border-gray-100 dark:border-gray-700">
              <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                {{ $t('home.searchCity') }}
              </label>
              <div class="relative">
                <MapPin class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                <select
                  v-model="searchCity"
                  class="w-full pl-8 pr-2 py-1.5 bg-transparent font-medium text-sm text-gray-900 dark:text-white outline-none cursor-pointer"
                >
                  <option class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" value="">{{ $t('home.allCities') }}</option>
                  <option class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" v-for="c in cities" :key="c" :value="c">{{ $tCity(c) }}</option>
                </select>
              </div>
            </div>

            <!-- Category -->
            <div class="p-2 sm:border-r border-gray-100 dark:border-gray-700">
              <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                {{ $t('home.searchCategory') }}
              </label>
              <div class="relative">
                <Building2 class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                <select
                  v-model="searchCategory"
                  class="w-full pl-8 pr-2 py-1.5 bg-transparent font-medium text-sm text-gray-900 dark:text-white outline-none cursor-pointer"
                >
                  <option class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" value="">{{ $t('home.allCategories') }}</option>
                  <option class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" v-for="cat in categories" :key="cat.id" :value="cat.id">{{ $tc(cat) }}</option>
                </select>
              </div>
            </div>

            <!-- Rooms -->
            <div class="p-2">
              <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                {{ $t('home.searchRooms') }}
              </label>
              <div class="relative">
                <Home class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                <select
                  v-model="searchRooms"
                  class="w-full pl-8 pr-2 py-1.5 bg-transparent font-medium text-sm text-gray-900 dark:text-white outline-none cursor-pointer"
                >
                  <option class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" value="">{{ $t('home.allRooms') }}</option>
                  <option class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" value="1">1 {{ $t('common.roomsUnit') }}</option>
                  <option class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" value="2">2 {{ $t('common.roomsUnit') }}</option>
                  <option class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" value="3">3 {{ $t('common.roomsUnit') }}</option>
                  <option class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" value="4">4 {{ $t('common.roomsUnit') }}</option>
                  <option class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white" value="5">5+ {{ $t('common.roomsUnit') }}</option>
                </select>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex items-center">
              <button
                type="submit"
                class="w-full h-full min-h-[48px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Search class="w-4 h-4" />
                {{ $t('home.searchBtn') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Categories Showcase -->
    <section v-if="categories.length > 0" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {{ $t('home.browseCategories') }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ $t('home.browseCategoriesSub') }}
          </p>
        </div>
        <RouterLink
          to="/properties"
          class="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1"
        >
          {{ $t('home.allCategoriesLink') }} <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectCategory(cat.id)"
          class="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition text-left group flex flex-col justify-between cursor-pointer"
        >
          <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
            <Building2 class="w-5 h-5" />
          </div>
          <div>
            <div class="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-emerald-600 transition">
              {{ $tc(cat) }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ $t('home.listingsCount', { count: cat.properties_count ?? 0 }) }}
            </div>
          </div>
        </button>
      </div>
    </section>

    <!-- Latest Properties Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-end justify-between mb-8">
        <div>
          <div class="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Sparkles class="w-3.5 h-3.5" />
            {{ $t('home.latestBadge') }}
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {{ $t('home.latestTitle') }}
          </h2>
        </div>
        <RouterLink
          to="/properties"
          class="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1"
        >
          {{ $t('home.allListingsLink') }} <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 space-y-3 animate-pulse">
          <div class="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Properties list -->
      <div v-else-if="featuredProperties.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PropertyCard
          v-for="property in featuredProperties.slice(0, 6)"
          :key="property.id"
          :property="property"
        />
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-800">
        <Building2 class="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('home.noListings') }}</h3>
        <p class="text-sm text-gray-500 mt-1 mb-4">{{ $t('home.noListingsSub') }}</p>
        <RouterLink
          to="/properties/create"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow hover:bg-emerald-700 transition"
        >
          {{ $t('nav.addProperty') }}
        </RouterLink>
      </div>
    </section>

    <!-- Why Choose EmlakGO Features Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {{ $t('home.whyUsTitle') }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {{ $t('home.whyUsDesc') }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ $t('home.feature1Title') }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {{ $t('home.feature1Desc') }}
          </p>
        </div>

        <div class="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Clock class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ $t('home.feature2Title') }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {{ $t('home.feature2Desc') }}
          </p>
        </div>

        <div class="p-6 rounded-3xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <DollarSign class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ $t('home.feature3Title') }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {{ $t('home.feature3Desc') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Call to Action Banner -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 p-8 sm:p-14 text-white shadow-xl">
        <div class="relative z-10 max-w-2xl space-y-4">
          <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {{ $t('home.ctaTitle') }}
          </h2>
          <p class="text-emerald-100 text-sm sm:text-base leading-relaxed">
            {{ $t('home.ctaDesc') }}
          </p>
          <div class="pt-2 flex flex-wrap gap-3">
            <RouterLink
              to="/properties/create"
              class="px-6 py-3 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 font-bold text-sm shadow transition"
            >
              {{ $t('home.ctaPost') }}
            </RouterLink>
            <RouterLink
              to="/register"
              class="px-6 py-3 rounded-xl bg-emerald-600/40 border border-white/20 text-white hover:bg-emerald-600/60 font-semibold text-sm transition"
            >
              {{ $t('home.ctaRegister') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
