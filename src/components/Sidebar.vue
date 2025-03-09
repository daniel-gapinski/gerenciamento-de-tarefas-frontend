<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import Container from './Container.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  try {
    await authStore.logout();
    console.log('Logout realizado com sucesso');
    router.push("/login");
  } catch (error) {
    console.error("Erro ao fazer logout", error);
    alert('Erro ao sair da conta');
  }
};

</script>

<template>
    <header class="bg-gradient-to-r from-purple-500 to-purple-700 mb-3 p-4 flex min-h-22 justify-between items-center w-full shadow-lg">
    <Container>
      <div class="w-full flex justify-between items-center gap-3">
        <h2 class="text-white text-2xl font-semibold">Gerenciador <span class="text-green-300">de Tarefas</span></h2>
        <button @click="handleLogout" class="text-white hover:text-red-300 hover:scale-110 transition-all cursor-pointer text-lg font-semibold">Sair</button>
      </div>
    </Container>
  </header>
</template>
