<script setup>
import { onMounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';
import { User, Mail, Phone, Shield, PlusCircle, Heart, LogOut, ExternalLink } from '@lucide/vue';

const router = useRouter();
const { user, isAuthenticated, logout, fetchUser } = useAuth();
const toast = useToast();

async function handleLogout() {
  await logout();
  toast.info('Ulgamdan çykyldy');
  router.push('/');
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }
  await fetchUser();
});
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10 shadow-sm space-y-8">
      <!-- Profile Header -->
      <div class="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-700 text-center sm:text-left">
        <div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-emerald-500/20">
          {{ user?.name ? user.name[0].toUpperCase() : 'U' }}
        </div>
        <div class="space-y-1">
          <div class="flex items-center justify-center sm:justify-start gap-2">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ user?.name || $t('common.user') }}
            </h1>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 capitalize">
              {{ user?.role === 'admin' ? $t('common.admin') : $t('common.user') }}
            </span>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ $t('profile.memberSubtitle') }}
          </p>
        </div>
      </div>

      <!-- User Details Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700/80 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <User class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ $t('profile.fullName') }}</div>
            <div class="text-sm font-bold text-gray-900 dark:text-white">{{ user?.name }}</div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700/80 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Mail class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ $t('profile.email') }}</div>
            <div class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ user?.email }}</div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700/80 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Phone class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ $t('profile.phone') }}</div>
            <div class="text-sm font-bold text-gray-900 dark:text-white">{{ user?.phone || $t('profile.notSpecified') }}</div>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700/80 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Shield class="w-5 h-5" />
          </div>
          <div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ $t('profile.roleLabel') }}</div>
            <div class="text-sm font-bold text-gray-900 dark:text-white capitalize">
              {{ user?.role === 'admin' ? $t('common.admin') : $t('common.user') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-700">
        <div class="flex flex-wrap items-center gap-3">
          <RouterLink
            to="/properties/create"
            class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm"
          >
            <PlusCircle class="w-4 h-4" />
            {{ $t('profile.addProperty') }}
          </RouterLink>
          <RouterLink
            to="/favorites"
            class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold text-sm transition"
          >
            <Heart class="w-4 h-4 text-rose-500" />
            {{ $t('profile.myFavorites') }}
          </RouterLink>
          <a
            href="http://localhost:8000/admin"
            target="_blank"
            class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm transition shadow-sm"
          >
            <Shield class="w-4 h-4" />
            {{ user?.role === 'admin' ? $t('profile.adminPanel') : $t('profile.userPanel') }}
            <ExternalLink class="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

        <button
          @click="handleLogout"
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 font-semibold text-sm transition cursor-pointer"
        >
          <LogOut class="w-4 h-4" />
          {{ $t('profile.logout') }}
        </button>
      </div>
    </div>
  </div>
</template>
