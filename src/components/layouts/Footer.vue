<script setup>
import { Building2, Phone, Mail, MapPin } from '@lucide/vue';
import { RouterLink } from 'vue-router';
</script>

<template>
  <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 mt-16 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and info -->
        <div class="space-y-4 md:col-span-1">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
              <Building2 class="w-5 h-5" />
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Emläk<span class="text-emerald-500">GO</span>
            </span>
          </div>
          <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            {{ $t('footer.desc') }}
          </p>
        </div>

        <!-- Links 1 -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            {{ $t('footer.pages') }}
          </h3>
          <ul class="space-y-2.5 text-sm">
            <li>
              <RouterLink to="/" class="hover:text-emerald-600 transition">{{ $t('nav.home') }}</RouterLink>
            </li>
            <li>
              <RouterLink to="/properties" class="hover:text-emerald-600 transition">{{ $t('nav.properties') }}</RouterLink>
            </li>
            <li>
              <RouterLink to="/properties/create" class="hover:text-emerald-600 transition">{{ $t('nav.addProperty') }}</RouterLink>
            </li>
            <li>
              <RouterLink to="/favorites" class="hover:text-emerald-600 transition">{{ $t('nav.favorites') }}</RouterLink>
            </li>
          </ul>
        </div>

        <!-- Links 2: Şäherler -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            {{ $t('footer.popularCities') }}
          </h3>
          <ul class="space-y-2.5 text-sm">
            <li>
              <RouterLink to="/properties?city=Aşgabat" class="hover:text-emerald-600 transition">{{ $tCity('Aşgabat') }}</RouterLink>
            </li>
            <li>
              <RouterLink to="/properties?city=Mary" class="hover:text-emerald-600 transition">{{ $tCity('Mary') }}</RouterLink>
            </li>
            <li>
              <RouterLink to="/properties?city=Türkmenabat" class="hover:text-emerald-600 transition">{{ $tCity('Türkmenabat') }}</RouterLink>
            </li>
            <li>
              <RouterLink to="/properties?city=Daşoguz" class="hover:text-emerald-600 transition">{{ $tCity('Daşoguz') }}</RouterLink>
            </li>
            <li>
              <RouterLink to="/properties?city=Balkanabat" class="hover:text-emerald-600 transition">{{ $tCity('Balkanabat') }}</RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact info -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            {{ $t('footer.contact') }}
          </h3>
          <ul class="space-y-3 text-sm">
            <li class="flex items-center gap-2.5">
              <Phone class="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>+993 (12) 00-00-00</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Mail class="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>info@emlakgo.tm</span>
            </li>
            <li class="flex items-center gap-2.5">
              <MapPin class="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{{ $t('footer.addressVal') }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>© 2026 EmläkGO. {{ $t('footer.rights') }}</p>
        <p>{{ $t('footer.platformFor') }}</p>
      </div>
    </div>
  </footer>
</template>
