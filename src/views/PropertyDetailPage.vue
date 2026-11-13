<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { api, formatPrice, resolveImageUrl } from '@/services/api';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';
import { 
  Heart, 
  MapPin, 
  BedDouble, 
  Maximize2, 
  Building, 
  ArrowLeft, 
  User as UserIcon, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  Loader2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Camera,
  MessageSquare,
  Star,
  Trash2
} from '@lucide/vue';

const route = useRoute();
const router = useRouter();
const { user, isAuthenticated } = useAuth();
const toast = useToast();

const property = ref(null);
const loading = ref(true);
const activeImageIndex = ref(0);
const isFavorited = ref(false);
const defaultImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80';

function handleImageError(e) {
  e.target.src = defaultImage;
}

function prevImage() {
  if (images.value.length === 0) return;
  activeImageIndex.value = (activeImageIndex.value - 1 + images.value.length) % images.value.length;
}

function nextImage() {
  if (images.value.length === 0) return;
  activeImageIndex.value = (activeImageIndex.value + 1) % images.value.length;
}

// Inquiry form
const inquiryForm = ref({
  name: user.value?.name || '',
  email: user.value?.email || '',
  phone: user.value?.phone || '',
  message: '',
});
const sendingInquiry = ref(false);
const inquirySuccess = ref(false);

// Comment state
const comments = ref([]);
const loadingComments = ref(false);
const submittingComment = ref(false);
const commentForm = ref({
  name: user.value?.name || '',
  comment: '',
  rating: 5,
});

// Reply state
const replyingTo = ref(null); // { id, name }
const submittingReply = ref(false);
const replyText = ref('');

async function loadComments() {
  if (!property.value?.id) return;
  loadingComments.value = true;
  try {
    const res = await api.getComments(property.value.id);
    comments.value = res.comments || [];
  } catch (err) {
    console.error('Teswirleri ýüklemekde ýalňyşlyk:', err);
  } finally {
    loadingComments.value = false;
  }
}

async function handleAddComment() {
  if (!commentForm.value.comment.trim()) {
    toast.error('Teswiriňizi ýazyň');
    return;
  }
  if (!isAuthenticated.value && !commentForm.value.name.trim()) {
    toast.error('Adyňyzy giriziň');
    return;
  }

  submittingComment.value = true;
  try {
    const res = await api.addComment(property.value.id, {
      name: isAuthenticated.value ? user.value.name : commentForm.value.name,
      comment: commentForm.value.comment,
      rating: commentForm.value.rating,
    });
    toast.success(res.message || 'Teswiriňiz goşuldy!');
    commentForm.value.comment = '';
    commentForm.value.rating = 5;
    await loadComments();
  } catch (err) {
    toast.error(err.message || 'Teswir goşup bolmady');
  } finally {
    submittingComment.value = false;
  }
}

async function handleDeleteComment(commentId) {
  if (!confirm('Bu teswiri hakykatdan hem pozmak isleýärsiňizmi?')) return;
  try {
    await api.deleteComment(commentId);
    toast.success('Teswir pozuldy');
    comments.value = comments.value.filter(c => c.id !== commentId);
  } catch (err) {
    toast.error(err.message || 'Teswiri pozup bolmady');
  }
}

function startReply(comment) {
  replyingTo.value = { id: comment.id, name: comment.name };
  replyText.value = '';
  // scroll to reply box
  setTimeout(() => {
    document.getElementById(`reply-box-${comment.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById(`reply-input-${comment.id}`)?.focus();
  }, 50);
}

function cancelReply() {
  replyingTo.value = null;
  replyText.value = '';
}

async function handleSubmitReply(commentId) {
  if (!replyText.value.trim()) {
    toast.error('Jogabyňyzy ýazyň');
    return;
  }
  if (!isAuthenticated.value && !commentForm.value.name.trim()) {
    toast.error('Adyňyzy giriziň');
    return;
  }
  submittingReply.value = true;
  try {
    const res = await api.replyComment(property.value.id, commentId, {
      comment: replyText.value,
      name: isAuthenticated.value ? user.value.name : commentForm.value.name,
    });
    toast.success(res.message || 'Jogabyňyz goşuldy!');
    // Add reply locally
    const parent = comments.value.find(c => c.id === commentId);
    if (parent) {
      if (!parent.replies) parent.replies = [];
      parent.replies.push(res.comment);
    }
    cancelReply();
  } catch (err) {
    toast.error(err.message || 'Jogap iberip bolmady');
  } finally {
    submittingReply.value = false;
  }
}

const images = computed(() => {
  if (!property.value) return [];
  if (property.value.images && property.value.images.length > 0) {
    return property.value.images.map(img => resolveImageUrl(img.image_path));
  }
  if (property.value.primary_image) {
    return [resolveImageUrl(property.value.primary_image.image_path)];
  }
  return ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];
});

async function loadProperty() {
  loading.value = true;
  try {
    const res = await api.getProperty(route.params.id);
    property.value = res.property || res;
    // Set default user info if logged in
    if (user.value) {
      if (!inquiryForm.value.name) inquiryForm.value.name = user.value.name;
      if (!inquiryForm.value.email) inquiryForm.value.email = user.value.email;
      if (!inquiryForm.value.phone && user.value.phone) inquiryForm.value.phone = user.value.phone;
    }
    await loadComments();
  } catch (err) {
    toast.error(err.message || 'Emläk tapylmady');
    router.push('/properties');
  } finally {
    loading.value = false;
  }
}

async function handleToggleFavorite() {
  if (!isAuthenticated.value) {
    toast.info('Halananlara goşmak üçin ulgama giriň');
    router.push('/login');
    return;
  }
  try {
    const res = await api.toggleFavorite(property.value.id);
    isFavorited.value = res.is_favorited;
    toast.success(res.message);
  } catch (err) {
    toast.error(err.message || 'Ýalňyşlyk ýüze çykdy');
  }
}

async function handleSendInquiry() {
  if (!inquiryForm.value.name || !inquiryForm.value.email || !inquiryForm.value.message) {
    toast.error('Gerekli öýjükleri dolduryň (Ady, Email, Hat)');
    return;
  }

  sendingInquiry.value = true;
  try {
    const res = await api.sendInquiry(property.value.id, inquiryForm.value);
    inquirySuccess.value = true;
    toast.success(res.message || 'Soragyňyz üstünlikli iberildi!');
    inquiryForm.value.message = '';
  } catch (err) {
    toast.error(err.message || 'Sorag ibermekde ýalňyşlyk ýüze çykdy');
  } finally {
    sendingInquiry.value = false;
  }
}

onMounted(() => {
  loadProperty();
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Back Button -->
    <RouterLink
      to="/properties"
      class="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
    >
      <ArrowLeft class="w-4 h-4" />
      {{ $t('property.back') }}
    </RouterLink>

    <!-- Loading Spinner -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24 gap-3 text-emerald-600">
      <Loader2 class="w-8 h-8 animate-spin" />
      <span class="text-sm font-medium">{{ $t('property.loading') }}</span>
    </div>

    <!-- Main Content -->
    <div v-else-if="property" class="space-y-8">
      <!-- Title & Price Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
              {{ property.category ? $tc(property.category) : ($t('nav.properties') || 'Emläk') }}
            </span>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300">
              {{ property.status === 'active' ? $t('property.activeStatus') : property.status }}
            </span>
          </div>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            {{ property.title }}
          </h1>
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
            <MapPin class="w-4 h-4 text-emerald-600" />
            <span>{{ property.city }}</span>
            <span v-if="property.address">• {{ property.address }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="text-right">
            <span class="text-xs text-gray-500 block">{{ $t('property.priceLabel') }}</span>
            <span class="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {{ formatPrice(property.price) }}
            </span>
          </div>

          <button
            @click="handleToggleFavorite"
            class="p-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:text-rose-600 dark:hover:text-rose-400 transition shadow-sm cursor-pointer"
            :title="$t('card.addFavorite')"
          >
            <Heart class="w-6 h-6" :class="{ 'fill-rose-500 text-rose-500': isFavorited }" />
          </button>
        </div>
      </div>

      <!-- Image Gallery (Laýyk we ykjam dizaýn) -->
      <div class="space-y-3">
        <!-- Main Image with fixed elegant height -->
        <div class="relative w-full h-72 sm:h-96 md:h-[420px] bg-gray-100 dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg group flex items-center justify-center">
          <img
            :src="images[activeImageIndex] || defaultImage"
            :alt="property.title"
            @error="handleImageError"
            class="w-full h-full object-contain transition-all duration-300"
          />

          <!-- Gradient overlay on bottom for contrast -->
          <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>

          <!-- Prev Button -->
          <button
            v-if="images.length > 1"
            type="button"
            @click="prevImage"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition shadow-md active:scale-95"
            title="Öňki surat"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>

          <!-- Next Button -->
          <button
            v-if="images.length > 1"
            type="button"
            @click="nextImage"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-md transition shadow-md active:scale-95"
            title="Indiki surat"
          >
            <ChevronRight class="w-5 h-5" />
          </button>

          <!-- Image counter badge -->
          <div class="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
            <Camera class="w-3.5 h-3.5 text-emerald-400" />
            <span>{{ activeImageIndex + 1 }} / {{ images.length }}</span>
          </div>
        </div>

        <!-- Thumbnails Strip -->
        <div v-if="images.length > 1" class="flex items-center gap-2.5 overflow-x-auto py-1">
          <button
            v-for="(img, idx) in images"
            :key="idx"
            @click="activeImageIndex = idx"
            type="button"
            class="w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition cursor-pointer"
            :class="activeImageIndex === idx ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/40 scale-102' : 'border-transparent opacity-60 hover:opacity-100'"
          >
            <img :src="img" @error="handleImageError" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Main Grid: Info + Contact Form -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left 2 Cols: Specs & Description -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Key Features Grid -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h2 class="text-base font-bold text-gray-900 dark:text-white mb-4">
              {{ $t('property.keyFeatures') }}
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700/80">
                <div class="flex items-center gap-2 text-emerald-600 mb-1">
                  <BedDouble class="w-5 h-5" />
                  <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ $t('property.rooms') }}</span>
                </div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ property.rooms ? `${property.rooms} ${$t('common.roomsUnit')}` : $t('property.notSpecified') }}
                </div>
              </div>

              <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700/80">
                <div class="flex items-center gap-2 text-emerald-600 mb-1">
                  <Maximize2 class="w-5 h-5" />
                  <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ $t('property.area') }}</span>
                </div>
                <div class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ property.area ? `${property.area} ${$t('common.areaUnit')}` : $t('property.notSpecified') }}
                </div>
              </div>

              <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700/80">
                <div class="flex items-center gap-2 text-emerald-600 mb-1">
                  <Building class="w-5 h-5" />
                  <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ $t('property.type') }}</span>
                </div>
                <div class="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {{ property.category ? $tc(property.category) : $t('nav.properties') }}
                </div>
              </div>

              <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700/80">
                <div class="flex items-center gap-2 text-emerald-600 mb-1">
                  <MapPin class="w-5 h-5" />
                  <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">{{ $t('property.city') }}</span>
                </div>
                <div class="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {{ $tCity(property.city) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm space-y-4">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ $t('property.detailsTitle') }}
            </h2>
            <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {{ property.description }}
            </p>
          </div>

          <!-- Comments & Reviews Section -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm space-y-6">
            <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/60 pb-4">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <MessageSquare class="w-5 h-5" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ $t('property.commentsTitle') }}
                  </h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ $t('property.totalComments', { count: comments.length }) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Add Comment Form -->
            <form @submit.prevent="handleAddComment" class="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200/70 dark:border-gray-700/60 space-y-4">
              <h4 class="text-sm font-bold text-gray-900 dark:text-white">
                {{ $t('property.writeComment') }}
              </h4>

              <!-- Rating Selection -->
              <div>
                <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">
                  {{ $t('property.ratingLabel') }}
                </label>
                <div class="flex items-center gap-2">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    @click="commentForm.rating = star"
                    class="p-1 hover:scale-110 transition cursor-pointer text-xl"
                  >
                    <span :class="star <= commentForm.rating ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'">
                      ★
                    </span>
                  </button>
                  <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-1">
                    {{ commentForm.rating }} / 5
                  </span>
                </div>
              </div>

              <!-- Name for guests -->
              <div v-if="!isAuthenticated">
                <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {{ $t('property.yourName') }}
                </label>
                <input
                  v-model="commentForm.name"
                  type="text"
                  required
                  :placeholder="$t('property.namePlaceholder')"
                  class="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <!-- Comment Text -->
              <div>
                <label class="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  {{ $t('property.yourComment') }}
                </label>
                <textarea
                  v-model="commentForm.comment"
                  required
                  rows="3"
                  :placeholder="$t('property.commentPlaceholder')"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                ></textarea>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="submittingComment"
                  class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  <Loader2 v-if="submittingComment" class="w-4 h-4 animate-spin" />
                  <Send v-else class="w-4 h-4" />
                  {{ $t('property.sendComment') }}
                </button>
              </div>
            </form>

            <!-- Comments List -->
            <div class="space-y-3">
              <div v-if="loadingComments" class="py-8 text-center text-gray-400">
                <Loader2 class="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                <span class="text-sm">{{ $t('common.loading') }}</span>
              </div>

              <div v-else-if="comments.length === 0" class="py-10 text-center">
                <div class="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare class="w-7 h-7 text-gray-300 dark:text-gray-600" />
                </div>
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('property.noComments') }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ $t('property.firstComment') }}</p>
              </div>

              <div
                v-for="c in comments"
                :key="c.id"
                class="group relative p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all duration-200"
              >
                <!-- Top row: avatar + name + stars -->
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <!-- Avatar -->
                    <div
                      class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm uppercase shadow-sm"
                      :class="c.user?.role === 'admin'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300'"
                    >
                      {{ c.name ? c.name[0] : 'U' }}
                    </div>

                    <!-- Name + badge + date -->
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="font-bold text-sm text-gray-900 dark:text-white leading-tight">{{ c.name }}</span>
                        <span
                          v-if="c.user?.role === 'admin'"
                          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                        >
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                          {{ $t('common.admin') }}
                        </span>
                      </div>
                      <div class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {{ new Date(c.created_at).toLocaleDateString() }}
                      </div>
                    </div>
                  </div>

                  <!-- Right: stars + delete -->
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <div class="flex items-center gap-0.5">
                      <span
                        v-for="s in 5"
                        :key="s"
                        class="text-base leading-none"
                        :class="s <= (c.rating || 5) ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'"
                      >★</span>
                    </div>
                    <button
                      v-if="user && (user.id === c.user_id || user.role === 'admin')"
                      @click="handleDeleteComment(c.id)"
                      class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-all p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                      :title="$t('common.delete')"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <!-- Comment text -->
                <p class="mt-3 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed pl-[52px]">
                  {{ c.comment }}
                </p>

                <!-- Reply button -->
                <div class="pl-[52px] mt-2 flex items-center gap-3">
                  <button
                    @click="replyingTo?.id === c.id ? cancelReply() : startReply(c)"
                    type="button"
                    class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition cursor-pointer"
                  >
                    <MessageSquare class="w-3.5 h-3.5" />
                    {{ replyingTo?.id === c.id ? $t('common.cancel') : $t('property.reply') }}
                  </button>
                  <span v-if="c.replies?.length" class="text-xs text-gray-400 dark:text-gray-500">
                    {{ $t('property.repliesCount', { count: c.replies.length }) }}
                  </span>
                </div>

                <!-- Reply input box -->
                <div
                  v-if="replyingTo?.id === c.id"
                  :id="`reply-box-${c.id}`"
                  class="mt-3 ml-[52px] p-3 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-emerald-200 dark:border-emerald-800/50"
                >
                  <div class="flex items-start gap-2">
                    <div class="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-center uppercase flex-shrink-0 mt-0.5">
                      {{ (user?.name || commentForm.name || '?')[0] }}
                    </div>
                    <div class="flex-1 space-y-2">
                      <div v-if="!isAuthenticated" class="">
                        <input
                          v-model="commentForm.name"
                          type="text"
                          :placeholder="$t('property.namePlaceholder')"
                          class="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        />
                      </div>
                      <textarea
                        :id="`reply-input-${c.id}`"
                        v-model="replyText"
                        rows="2"
                        :placeholder="$t('property.replyPlaceholder', { name: c.name })"
                        class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                      ></textarea>
                      <div class="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          @click="cancelReply"
                          class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >{{ $t('common.cancel') }}</button>
                        <button
                          type="button"
                          @click="handleSubmitReply(c.id)"
                          :disabled="submittingReply"
                          class="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition disabled:opacity-60 cursor-pointer"
                        >
                          <Loader2 v-if="submittingReply" class="w-3 h-3 animate-spin" />
                          <Send v-else class="w-3 h-3" />
                          {{ $t('property.sendComment') }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Existing replies -->
                <div v-if="c.replies?.length" class="mt-3 ml-[52px] space-y-2">
                  <div
                    v-for="reply in c.replies"
                    :key="reply.id"
                    class="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/40"
                  >
                    <div
                      class="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-[11px] uppercase"
                      :class="reply.user?.role === 'admin'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'"
                    >
                      {{ reply.name ? reply.name[0] : 'U' }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="font-semibold text-xs text-gray-900 dark:text-white">{{ reply.name }}</span>
                        <span
                          v-if="reply.user?.role === 'admin'"
                          class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                        >
                          <span class="w-1 h-1 rounded-full bg-emerald-500 inline-block"></span>
                          {{ $t('common.admin') }}
                        </span>
                        <span class="text-[10px] text-gray-400 dark:text-gray-500">
                          {{ new Date(reply.created_at).toLocaleDateString() }}
                        </span>
                      </div>
                      <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{{ reply.comment }}</p>
                    </div>
                    <button
                      v-if="user && (user.id === reply.user_id || user.role === 'admin')"
                      @click="handleDeleteComment(reply.id); c.replies = c.replies.filter(r => r.id !== reply.id)"
                      class="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition p-1 flex-shrink-0 cursor-pointer"
                      :title="$t('common.delete')"
                    >
                      <Trash2 class="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Col: Owner Card & Inquiry Form -->
        <div class="space-y-6">
          <!-- Owner Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm space-y-4">
            <h3 class="text-base font-bold text-gray-900 dark:text-white">
              {{ $t('property.ownerTitle') }}
            </h3>
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg uppercase">
                {{ property.user?.name ? property.user.name[0] : 'E' }}
              </div>
              <div>
                <div class="font-bold text-gray-900 dark:text-white">
                  {{ property.user?.name || $t('property.ownerTitle') }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ property.user?.role === 'admin' ? $t('property.membershipAdmin') : $t('property.membershipUser') }}
                </div>
              </div>
            </div>

            <div v-if="property.user?.phone" class="pt-2">
              <a
                :href="`tel:${property.user.phone}`"
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm"
              >
                <Phone class="w-4 h-4" />
                {{ property.user.phone }}
              </a>
            </div>
          </div>

          <!-- Inquiry Form Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm space-y-4">
            <div class="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-base">
              <Mail class="w-5 h-5 text-emerald-600" />
              <span>{{ $t('property.contactTitle') }}</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ $t('property.contactDesc') }}
            </p>

            <div v-if="inquirySuccess" class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs space-y-2">
              <div class="flex items-center gap-2 font-bold">
                <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                {{ $t('property.inquirySuccess') }}
              </div>
              <p>{{ $t('property.inquirySuccessDesc') }}</p>
              <button
                @click="inquirySuccess = false"
                class="underline text-emerald-600 font-semibold cursor-pointer"
              >
                {{ $t('property.sendAnother') }}
              </button>
            </div>

            <form v-else @submit.prevent="handleSendInquiry" class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {{ $t('property.fullName') }}
                </label>
                <input
                  v-model="inquiryForm.name"
                  type="text"
                  required
                  :placeholder="$t('property.fullNamePlaceholder')"
                  class="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {{ $t('property.email') }}
                </label>
                <input
                  v-model="inquiryForm.email"
                  type="email"
                  required
                  :placeholder="$t('property.emailPlaceholder')"
                  class="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {{ $t('property.phone') }}
                </label>
                <input
                  v-model="inquiryForm.phone"
                  type="text"
                  :placeholder="$t('property.phonePlaceholder')"
                  class="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {{ $t('property.message') }}
                </label>
                <textarea
                  v-model="inquiryForm.message"
                  required
                  rows="3"
                  :placeholder="$t('property.messagePlaceholder')"
                  class="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="sendingInquiry"
                class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-sm transition shadow-sm disabled:opacity-60 cursor-pointer"
              >
                <Loader2 v-if="sendingInquiry" class="w-4 h-4 animate-spin" />
                <Send v-else class="w-4 h-4" />
                {{ $t('property.sendInquiry') }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
