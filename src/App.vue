<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import Navbar from '@/components/layouts/Navbar.vue';
import Footer from '@/components/layouts/Footer.vue';
import ToastContainer from '@/components/common/ToastContainer.vue';
import { useAuth } from '@/composables/useAuth';

const { fetchUser, token } = useAuth();

onMounted(async () => {
  if (token.value) {
    await fetchUser();
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors font-sans antialiased">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content Area -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Toast Notifications -->
    <ToastContainer />
  </div>
</template>

<style>
/* Custom subtle scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #334155;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
