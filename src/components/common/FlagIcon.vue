<script setup>
defineProps({
  code: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <!-- Turkmenistan -->
  <svg
    v-if="code === 'tk'"
    viewBox="0 0 36 24"
    class="w-5 h-3.5 rounded-xs overflow-hidden shadow-xs border border-black/10 inline-block align-middle flex-shrink-0"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="36" height="24" fill="#009959" />
    <rect x="4" width="6" height="24" fill="#C4151C" />
    <circle cx="7" cy="4.5" r="1.3" fill="#FACC15" />
    <circle cx="7" cy="9" r="1.3" fill="#FACC15" />
    <circle cx="7" cy="13.5" r="1.3" fill="#FACC15" />
    <circle cx="7" cy="18" r="1.3" fill="#FACC15" />
    <!-- White Crescent and 5 Stars -->
    <circle cx="15.5" cy="7.5" r="3.6" fill="#FFFFFF" />
    <circle cx="17.2" cy="7.5" r="3.2" fill="#009959" />
    <circle cx="18.5" cy="5.2" r="0.65" fill="#FFFFFF" />
    <circle cx="20.5" cy="6.2" r="0.65" fill="#FFFFFF" />
    <circle cx="21" cy="8.2" r="0.65" fill="#FFFFFF" />
    <circle cx="19.8" cy="10.2" r="0.65" fill="#FFFFFF" />
    <circle cx="17.8" cy="10.9" r="0.65" fill="#FFFFFF" />
  </svg>

  <!-- United Kingdom / English -->
  <svg
    v-else-if="code === 'en'"
    viewBox="0 0 36 24"
    class="w-5 h-3.5 rounded-xs overflow-hidden shadow-xs border border-black/10 inline-block align-middle flex-shrink-0"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="36" height="24" fill="#012169" />
    <path d="M0 0L36 24M36 0L0 24" stroke="#FFFFFF" stroke-width="4.5" />
    <path d="M0 0L36 24M36 0L0 24" stroke="#C8102E" stroke-width="2.2" />
    <path d="M18 0V24M0 12H36" stroke="#FFFFFF" stroke-width="6.5" />
    <path d="M18 0V24M0 12H36" stroke="#C8102E" stroke-width="3.8" />
  </svg>

  <!-- Russia -->
  <svg
    v-else-if="code === 'ru'"
    viewBox="0 0 36 24"
    class="w-5 h-3.5 rounded-xs overflow-hidden shadow-xs border border-black/10 inline-block align-middle flex-shrink-0"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="36" height="8" fill="#FFFFFF" />
    <rect y="8" width="36" height="8" fill="#0039A6" />
    <rect y="16" width="36" height="8" fill="#D52B1E" />
  </svg>

  <!-- Germany -->
  <svg
    v-else-if="code === 'de'"
    viewBox="0 0 36 24"
    class="w-5 h-3.5 rounded-xs overflow-hidden shadow-xs border border-black/10 inline-block align-middle flex-shrink-0"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="36" height="8" fill="#18181B" />
    <rect y="8" width="36" height="8" fill="#DC2626" />
    <rect y="16" width="36" height="8" fill="#FACC15" />
  </svg>

  <!-- Fallback -->
  <span v-else class="text-xs font-bold uppercase">{{ code }}</span>
</template>
