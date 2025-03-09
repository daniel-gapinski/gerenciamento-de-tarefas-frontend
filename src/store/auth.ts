import { defineStore } from "pinia";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import axios from "axios";
import router from "@/router";

interface User {
  id: string;
  name: string;
  email: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    isAuthenticated: false,
    user: null as User | null,
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await axios.post('http://localhost:3000/login', { email, password });
        const { token, name, email: userEmail, id } = response.data;

        console.log('Resposta do servidor:', response.data);

        if (!token || !id || !name || !userEmail) {
          throw new Error("Falha ao autenticar.");
        }

        // Armazena o token nos cookies
        setCookie(null, '@app.token', token, { maxAge: 30 * 24 * 60 * 60, path: '/' });

        // Atualiza o estado usando $patch
        this.$patch({
          token,
          user: { id, name, email: userEmail },
          isAuthenticated: true,
        });

        console.log('Login bem-sucedido:', this.isAuthenticated);

        // 🔹 Teste se a navegação está funcionando
        console.log("Redirecionando para a página inicial...");
        router.push("/");

      } catch (error) {
        console.error('Falha na autenticação:', error);
      }
    },

    async logout() {
      destroyCookie(null, '@app.token');

      this.$patch({
        token: null,
        user: null,
        isAuthenticated: false,
      });

      console.log('Usuário deslogado.');

      router.push("/login");
    },

    checkAuth() {
      const token = this.getTokenFromCookie();

      if (token) {
        this.$patch({
          token,
          isAuthenticated: true,
        });
      } else {
        this.$patch({
          isAuthenticated: false,
          token: null,
          user: null,
        });
      }
    },

    getTokenFromCookie() {
      const cookies = parseCookies();
      return cookies['@app.token'] || null;
    },
  },

  getters: {
    getToken: (state) => state.token,
    isUserAuthenticated: (state) => state.isAuthenticated, // Renomeado para evitar conflito
    getUser: (state) => state.user,
  },
});
