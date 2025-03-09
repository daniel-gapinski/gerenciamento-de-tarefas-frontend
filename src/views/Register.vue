<script setup lang="ts">
import ButtonFields from '@/components/ButtonFields.vue';
import InputField from '@/components/InputField.vue';
import { ref } from 'vue';
import { setupAPIClient } from '@/utils/api';
import { useRouter } from 'vue-router';

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');

const handleRegister = async () => {
  const userData = {
    name: name.value,
    email: email.value,
    password: password.value,
  };

  const api = setupAPIClient();
  try {
    const response = await api.post('/register', userData);
    console.log('Usuário registrado com sucesso:', response.data);
    router.push("/login");
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500">
    <div class="w-full max-w-lg p-10 bg-white mx-4 rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold text-center text-purple-700 mb-6">Cadastre-se</h2>
      <form @submit.prevent="handleRegister">
        <InputField
          id="name"
          label="Nome"
          type="text"
          v-model="name"
          placeholder="Seu nome"
          required
        />

        <InputField
          id="email"
          label="Email"
          type="email"
          v-model="email"
          placeholder="Seu email"
          required
        />

        <InputField
          id="password"
          label="Senha"
          type="password"
          v-model="password"
          placeholder="Sua senha"
          required
        />

        <ButtonFields
          type="submit"
          label="Registrar"
          color="blue"
          @click="handleRegister"
          class="w-full mt-6 py-3 text-white bg-blue-500 hover:bg-blue-600 transition-all rounded-lg"
        />
      </form>

      <div class="flex flex-row items-center justify-center mt-4 gap-2">
        <p class="text-sm text-gray-600">Já possui conta? </p>
        <a class="block text-sm text-purple-500 hover:scale-105 hover:text-purple-600 transition-all" href="/login">Entrar</a>
      </div>
    </div>
  </div>
</template>
