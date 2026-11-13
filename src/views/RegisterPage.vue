<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useToast } from '@/composables/useToast';
import { Building2, User, Mail, Lock, Phone, Loader2, ArrowRight } from '@lucide/vue';

const router = useRouter();
const { register, loading, error } = useAuth();
const toast = useToast();

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
});

async function handleSubmit() {
  if (form.value.password !== form.value.password_confirmation) {
    toast.error('Parollar gabat gelenok!');
    return;
  }

  try {
    await register(form.value);
    toast.success('Hasap üstünlikli döredildi!');
    router.push('/');
  } catch (err) {
    // Handled in useAuth
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-200/40 dark:shadow-none">
      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <Building2 class="w-6 h-6" />
        </div>
        <h2 class="text-2xl font-extrabold text-gray-900 dark:text-white">
          {{ $t('auth.registerTitle') }}
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ $t('auth.registerDesc') }}
        </p>
      </div>

      <!-- Error -->
      <div v-if="error" class="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-medium">
        {{ error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {{ $t('auth.name') }}
          </label>
          <div class="relative">
            <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="form.name"
              type="text"
              required
              :placeholder="$t('auth.namePlaceholder')"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {{ $t('auth.email') }}
          </label>
          <div class="relative">
            <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="form.email"
              type="email"
              required
              :placeholder="$t('auth.emailPlaceholder')"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {{ $t('auth.phone') }}
          </label>
          <div class="relative">
            <Phone class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="form.phone"
              type="text"
              :placeholder="$t('auth.phonePlaceholder')"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {{ $t('auth.minChars') }}
          </label>
          <div class="relative">
            <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="form.password"
              type="password"
              required
              minlength="8"
              placeholder="••••••••"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
            {{ $t('auth.passwordConfirm') }}
          </label>
          <div class="relative">
            <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="form.password_confirmation"
              type="password"
              required
              placeholder="••••••••"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-650 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition disabled:opacity-60 cursor-pointer"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <span v-else>{{ $t('auth.registerBtn') }}</span>
        </button>
      </form>

      <!-- Footer link -->
      <div class="text-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
        {{ $t('auth.haveAccount') }}
        <RouterLink
          to="/login"
          class="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 ml-1"
        >
          {{ $t('auth.signInLink') }} <ArrowRight class="w-3 h-3" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
