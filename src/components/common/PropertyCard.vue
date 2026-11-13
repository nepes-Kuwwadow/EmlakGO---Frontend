<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { formatPrice, resolveImageUrl, api } from '@/services/api';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';
import { 
  Heart, 
  MapPin, 
  BedDouble, 
  Maximize2, 
  Building
} from '@lucide/vue';

const props = defineProps({
  property: {
    type: Object,
    required: true,
  },
  isFavoritedInitial: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['favorited-changed']);

const router = useRouter();
const { isAuthenticated } = useAuth();
const toast = useToast();

const isFavorited = ref(props.isFavoritedInitial);
const toggling = ref(false);

const primaryImage = computedPropertyImage();

function computedPropertyImage() {
  if (props.property.primary_image?.image_path) {
    return resolveImageUrl(props.property.primary_image.image_path);
  }
  if (props.property.images && props.property.images.length > 0) {
    return resolveImageUrl(props.property.images[0].image_path);
  }
  return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
}

async function handleFavorite(e) {
  e.preventDefault();
  e.stopPropagation();

  if (!isAuthenticated.value) {
    toast.info('Halananlara goşmak üçin ulgama giriň');
    router.push('/login');
    return;
  }

  if (toggling.value) return;
  toggling.value = true;

  try {
    const res = await api.toggleFavorite(props.property.id);
    isFavorited.value = res.is_favorited;
    toast.success(res.message);
    emit('favorited-changed', { id: props.property.id, isFavorited: res.is_favorited });
  } catch (err) {
    toast.error(err.message || 'Halananlar ýagdaýy üýtgedilmedi');
  } finally {
    toggling.value = false;
  }
}
</script>

<template>
  <div class="group relative flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-700/70 hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300">
    <!-- Image & Badge Container -->
    <div class="relative w-full aspect-[4/3] bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <img
        :src="primaryImage"
        :alt="property.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        @error="$event.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'"
      />
      
      <!-- Category Badge -->
      <div class="absolute top-3 left-3">
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-gray-900/90 text-emerald-700 dark:text-emerald-400 backdrop-blur-md shadow-sm">
          <Building class="w-3 h-3" />
          {{ property.category ? $tc(property.category) : ($t('nav.properties') || 'Emläk') }}
        </span>
      </div>

      <!-- Favorite Button -->
      <button
        @click="handleFavorite"
        :disabled="toggling"
        type="button"
        :title="$t('card.addFavorite')"
        class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 active:scale-90 transition-all shadow-sm cursor-pointer"
      >
        <Heart
          class="w-4 h-4 transition-colors"
          :class="{ 'fill-rose-500 text-rose-500': isFavorited }"
        />
      </button>

      <!-- Price overlay badge on image -->
      <div class="absolute bottom-3 left-3">
        <div class="px-3 py-1.5 rounded-xl bg-gray-950/75 backdrop-blur-md text-white font-bold text-base shadow">
          {{ formatPrice(property.price) }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex-1 flex flex-col justify-between">
      <div>
        <!-- City / Address -->
        <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1.5">
          <MapPin class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span class="truncate">{{ $tCity(property.city) }}<span v-if="property.address">, {{ property.address }}</span></span>
        </div>

        <!-- Title -->
        <h3 class="text-base font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {{ property.title }}
        </h3>

        <!-- Description preview -->
        <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
          {{ property.description }}
        </p>
      </div>

      <!-- Meta stats (rooms, area) -->
      <div class="pt-3 mt-3 border-t border-gray-100 dark:border-gray-750 flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
        <div class="flex items-center gap-4">
          <div v-if="property.rooms" class="flex items-center gap-1" :title="$t('property.rooms')">
            <BedDouble class="w-4 h-4 text-emerald-600" />
            <span>{{ property.rooms }} {{ $t('common.roomsUnit') }}</span>
          </div>
          <div v-if="property.area" class="flex items-center gap-1" :title="$t('property.area')">
            <Maximize2 class="w-4 h-4 text-emerald-600" />
            <span>{{ property.area }} {{ $t('common.areaUnit') }}</span>
          </div>
        </div>

        <RouterLink
          :to="`/properties/${property.id}`"
          class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          {{ $t('card.details') }} →
        </RouterLink>
      </div>
    </div>
  </div>
</template>
