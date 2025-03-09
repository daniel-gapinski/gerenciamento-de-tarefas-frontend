<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();


onMounted(() => {
  authStore.checkAuth();
});

</script>

<template>
  <router-view></router-view>
</template>
