<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';
import ToggleDarkMode from '@/components/common/ToggleDarkMode.vue';
import LanguageSelector from '@/components/common/LanguageSelector.vue';
import { 
  Building2, 
  PlusCircle, 
  Heart, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  Compass,
  Home
} from '@lucide/vue';

const router = useRouter();
const { user, isAuthenticated, logout } = useAuth();
const toast = useToast();
const mobileOpen = ref(false);

async function handleLogout() {
  await logout();
  toast.info('Ulgamdan çykyldy');
  router.push('/');
}

function closeMobile() {
  mobileOpen.value = false;
}
</script>

<template>
  <header class="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-gray-200 dark:border-gray-800 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        <!-- Brand Logo -->
        <RouterLink to="/" class="flex items-center gap-2.5 group" @click="closeMobile">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Building2 class="w-5 h-5" />
          </div>
          <div>
            <span class="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Emläk<span class="text-emerald-500 dark:text-emerald-400">GO</span>
            </span>
            <span class="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 -mt-1">
              {{ $t('nav.brandSub') }}
            </span>
          </div>
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-1 font-medium text-sm text-gray-600 dark:text-gray-300">
          <RouterLink
            to="/"
            class="px-3.5 py-2 rounded-lg hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-gray-800/80 transition-colors flex items-center gap-1.5"
            active-class="text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-gray-800 font-semibold"
          >
            <Home class="w-4 h-4" />
            {{ $t('nav.home') }}
          </RouterLink>

          <RouterLink
            to="/properties"
            class="px-3.5 py-2 rounded-lg hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-gray-800/80 transition-colors flex items-center gap-1.5"
            active-class="text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-gray-800 font-semibold"
          >
            <Compass class="w-4 h-4" />
            {{ $t('nav.properties') }}
          </RouterLink>

          <RouterLink
            to="/favorites"
            class="px-3.5 py-2 rounded-lg hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-gray-800/80 transition-colors flex items-center gap-1.5"
            active-class="text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-gray-800 font-semibold"
          >
            <Heart class="w-4 h-4" />
            {{ $t('nav.favorites') }}
          </RouterLink>
        </nav>

        <!-- Right Side: Language + Dark Mode + Add Property + Auth -->
        <div class="hidden md:flex items-center gap-2.5">
          <LanguageSelector />
          <ToggleDarkMode />

          <RouterLink
            to="/properties/create"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-sm shadow-emerald-600/30 transition-all ml-1"
          >
            <PlusCircle class="w-4 h-4" />
            {{ $t('nav.addProperty') }}
          </RouterLink>

          <!-- Auth state -->
          <template v-if="isAuthenticated">
            <div class="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
              <RouterLink
                to="/profile"
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <div class="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs uppercase">
                  {{ user?.name ? user.name[0] : 'U' }}
                </div>
                <span class="max-w-[120px] truncate">{{ user?.name || $t('common.user') }}</span>
              </RouterLink>
              <button
                @click="handleLogout"
                :title="$t('nav.logout')"
                class="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
              >
                <LogOut class="w-4 h-4" />
              </button>
            </div>
          </template>
          <template v-else>
            <div class="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
              <RouterLink
                to="/login"
                class="px-3.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 transition"
              >
                {{ $t('nav.login') }}
              </RouterLink>
              <RouterLink
                to="/register"
                class="px-3.5 py-2 text-sm font-medium rounded-xl border border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
              >
                {{ $t('nav.register') }}
              </RouterLink>
            </div>
          </template>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <div class="flex items-center gap-2 md:hidden">
          <LanguageSelector />
          <ToggleDarkMode />
          <button
            @click="mobileOpen = !mobileOpen"
            class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <Menu v-if="!mobileOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div
      v-if="mobileOpen"
      class="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 pt-3 pb-6 space-y-3"
    >
      <div class="flex flex-col gap-1">
        <RouterLink
          to="/"
          @click="closeMobile"
          class="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Home class="w-4 h-4 text-emerald-600" />
          {{ $t('nav.home') }}
        </RouterLink>
        <RouterLink
          to="/properties"
          @click="closeMobile"
          class="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Compass class="w-4 h-4 text-emerald-600" />
          {{ $t('nav.properties') }}
        </RouterLink>
        <RouterLink
          to="/favorites"
          @click="closeMobile"
          class="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Heart class="w-4 h-4 text-emerald-600" />
          {{ $t('nav.favorites') }}
        </RouterLink>
        <RouterLink
          to="/properties/create"
          @click="closeMobile"
          class="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
        >
          <PlusCircle class="w-4 h-4" />
          {{ $t('nav.addProperty') }}
        </RouterLink>
      </div>

      <div class="pt-3 border-t border-gray-200 dark:border-gray-800">
        <template v-if="isAuthenticated">
          <RouterLink
            to="/profile"
            @click="closeMobile"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 mb-2"
          >
            <UserIcon class="w-4 h-4 text-emerald-600" />
            {{ $t('nav.profile') }}: {{ user?.name }}
          </RouterLink>
          <button
            @click="handleLogout(); closeMobile()"
            class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 transition cursor-pointer"
          >
            <LogOut class="w-4 h-4" />
            {{ $t('nav.logout') }}
          </button>
        </template>
        <template v-else>
          <div class="grid grid-cols-2 gap-2">
            <RouterLink
              to="/login"
              @click="closeMobile"
              class="text-center px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            >
              {{ $t('nav.login') }}
            </RouterLink>
            <RouterLink
              to="/register"
              @click="closeMobile"
              class="text-center px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 text-white"
            >
              {{ $t('nav.register') }}
            </RouterLink>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>
