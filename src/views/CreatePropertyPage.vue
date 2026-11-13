<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/services/api';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';
import { 
  Building2, 
  UploadCloud, 
  X, 
  Loader2, 
  PlusCircle, 
  MapPin, 
  DollarSign, 
  BedDouble, 
  Maximize2 
} from '@lucide/vue';

const router = useRouter();
const { isAuthenticated } = useAuth();
const toast = useToast();

const categories = ref([]);
const loadingCategories = ref(true);
const submitting = ref(false);
const error = ref(null);

const form = ref({
  category_id: '',
  title: '',
  description: '',
  price: '',
  city: 'Aşgabat',
  address: '',
  rooms: '',
  area: '',
});

const selectedFiles = ref([]);
const previewUrls = ref([]);

const cities = [
  'Aşgabat',
  'Arkadag',
  'Mary',
  'Türkmenabat',
  'Daşoguz',
  'Balkanabat',
  'Türkmenbaşy',
  'Änew',
  'Baýramaly',
  'Tejen',
];

async function loadCategories() {
  loadingCategories.value = true;
  try {
    const res = await api.getCategories();
    categories.value = res.categories || [];
    if (categories.value.length > 0 && !form.value.category_id) {
      form.value.category_id = categories.value[0].id;
    }
  } catch (err) {
    console.error('Kategoriýalar ýüklenmedi:', err);
  } finally {
    loadingCategories.value = false;
  }
}

function handleFileChange(e) {
  const files = Array.from(e.target.files || []);
  if (selectedFiles.value.length + files.length > 10) {
    toast.error('Iň köp 10 sany surat ýükläp bilersiňiz');
    return;
  }

  files.forEach(file => {
    selectedFiles.value.push(file);
    previewUrls.value.push(URL.createObjectURL(file));
  });
}

function removeImage(index) {
  URL.revokeObjectURL(previewUrls.value[index]);
  previewUrls.value.splice(index, 1);
  selectedFiles.value.splice(index, 1);
}

async function handleSubmit() {
  if (!isAuthenticated.value) {
    toast.error('Emläk goşmak üçin ilki ulgama girmeli!');
    router.push('/login');
    return;
  }

  error.value = null;
  submitting.value = true;

  try {
    const formData = new FormData();
    formData.append('category_id', form.value.category_id);
    formData.append('title', form.value.title);
    formData.append('description', form.value.description);
    formData.append('price', form.value.price);
    formData.append('city', form.value.city);
    formData.append('address', form.value.address);

    if (form.value.rooms) formData.append('rooms', form.value.rooms);
    if (form.value.area) formData.append('area', form.value.area);

    selectedFiles.value.forEach((file) => {
      formData.append('images[]', file);
    });

    const res = await api.createProperty(formData);
    toast.success(res.message || 'Emläk üstünlikli döredildi!');
    router.push('/properties');
  } catch (err) {
    error.value = err.message || 'Emläk goşmakda ýalňyşlyk ýüze çykdy';
    toast.error(error.value);
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  if (!isAuthenticated.value) {
    toast.info('Emläk goşmak üçin ulgama giriň');
    router.push('/login');
    return;
  }
  loadCategories();
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Header -->
    <div class="text-center max-w-xl mx-auto space-y-2">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
        <PlusCircle class="w-3.5 h-3.5" />
        {{ $t('createProperty.badge') }}
      </div>
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">
        {{ $t('createProperty.title') }}
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ $t('createProperty.desc') }}
      </p>
    </div>

    <!-- Error Alert -->
    <div v-if="error" class="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm">
      {{ error }}
    </div>

    <!-- Main Form Card -->
    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10 shadow-sm space-y-8">
      <!-- Section 1: Esasy maglumatlar -->
      <div class="space-y-4">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-700">
          {{ $t('createProperty.section1') }}
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Title -->
          <div class="sm:col-span-2">
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {{ $t('createProperty.titleLabel') }}
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              :placeholder="$t('createProperty.titlePlaceholder')"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <!-- Category -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {{ $t('createProperty.categoryLabel') }}
            </label>
            <div class="relative">
              <Building2 class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                v-model="form.category_id"
                required
                class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ $tc(cat) }}
                </option>
              </select>
            </div>
          </div>

          <!-- Price -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {{ $t('createProperty.priceLabel') }}
            </label>
            <div class="relative">
              <DollarSign class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="form.price"
                type="number"
                min="0"
                step="any"
                required
                placeholder="450000"
                class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <!-- Rooms -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {{ $t('createProperty.roomsLabel') }}
            </label>
            <div class="relative">
              <BedDouble class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="form.rooms"
                type="number"
                min="0"
                placeholder="3"
                class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <!-- Area -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {{ $t('createProperty.areaLabel') }}
            </label>
            <div class="relative">
              <Maximize2 class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                v-model="form.area"
                type="number"
                min="0"
                step="any"
                placeholder="85.5"
                class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Ýerleşýän ýeri -->
      <div class="space-y-4">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-700">
          {{ $t('createProperty.section2') }}
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- City -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {{ $t('createProperty.cityLabel') }}
            </label>
            <div class="relative">
              <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                v-model="form.city"
                required
                class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option v-for="c in cities" :key="c" :value="c">{{ $tCity(c) }}</option>
              </select>
            </div>
          </div>

          <!-- Address -->
          <div>
            <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              {{ $t('createProperty.addressLabel') }}
            </label>
            <input
              v-model="form.address"
              type="text"
              required
              :placeholder="$t('createProperty.addressPlaceholder')"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <!-- Section 3: Düşündiriş -->
      <div class="space-y-4">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-700">
          {{ $t('createProperty.section3') }}
        </h2>

        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {{ $t('createProperty.descLabel') }}
          </label>
          <textarea
            v-model="form.description"
            required
            rows="5"
            :placeholder="$t('createProperty.descPlaceholder')"
            class="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          ></textarea>
        </div>
      </div>

      <!-- Section 4: Suratlary ýüklemek -->
      <div class="space-y-4">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-100 dark:border-gray-700">
          {{ $t('createProperty.section4') }}
        </h2>

        <!-- Upload box -->
        <label class="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-650 rounded-2xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-gray-900/40 transition">
          <UploadCloud class="w-10 h-10 text-emerald-600 mb-2" />
          <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ $t('createProperty.uploadText') }}</span>
          <span class="text-xs text-gray-500 mt-1">{{ $t('createProperty.uploadMax') }}</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/jpg"
            @change="handleFileChange"
            class="hidden"
          />
        </label>

        <!-- Previews -->
        <div v-if="previewUrls.length > 0" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-3">
          <div
            v-for="(url, idx) in previewUrls"
            :key="idx"
            class="relative aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group"
          >
            <img :src="url" class="w-full h-full object-cover" />
            <span v-if="idx === 0" class="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-600 text-white font-bold">
              {{ $t('createProperty.mainImage') }}
            </span>
            <button
              type="button"
              @click="removeImage(idx)"
              class="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition opacity-80 group-hover:opacity-100 cursor-pointer"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="pt-4 flex items-center justify-end gap-4">
        <button
          type="button"
          @click="router.back()"
          class="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          type="submit"
          :disabled="submitting"
          class="inline-flex items-center gap-2 px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition disabled:opacity-60 cursor-pointer"
        >
          <Loader2 v-if="submitting" class="w-4 h-4 animate-spin" />
          <PlusCircle v-else class="w-4 h-4" />
          {{ submitting ? $t('createProperty.submitting') : $t('createProperty.submitBtn') }}
        </button>
      </div>
    </form>
  </div>
</template>
