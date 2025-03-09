<script setup lang="ts">
import ButtonFields from '@/components/ButtonFields.vue';
import InputField from '@/components/InputField.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useToast } from 'vue-toastification';

const toast = useToast();

const email = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);
    router.push("/");
  } catch (error) {
    toast.error("erro ao fazer login");
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
    <div class="w-full max-w-lg p-10 bg-white mx-4 rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold text-center text-purple-700 mb-6">Gerenciador de Tarefas</h2>
      <form @submit.prevent="handleLogin">
        <InputField
          id="email"
          label="Email"
          type="email"
          v-model="email"
          placeholder="Digite seu email"
          required
        />
        <InputField
          id="password"
          label="Senha"
          type="password"
          v-model="password"
          placeholder="Digite sua senha"
          required
        />
        <ButtonFields
          type="submit"
          label="Entrar"
          color="blue"
          class="w-full mt-6 py-3 text-white bg-blue-500 hover:bg-blue-600 transition-all rounded-lg"
        />
      </form>
      <div class="flex flex-row items-center justify-center mt-4 gap-2">
        <p class="text-sm text-gray-600">Não possui conta? </p>
        <a class="cursor-pointer block text-sm text-purple-500 hover:scale-105 hover:text-purple-600 transition-all" href="/register">Cadastre-se</a>
      </div>
    </div>
  </div>
</template>
