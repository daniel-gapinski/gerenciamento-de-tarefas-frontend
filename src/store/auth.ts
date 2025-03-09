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
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
        const { token, name, email: userEmail, id } = response.data;

        if (!token || !id || !name || !userEmail) {
          throw new Error("Falha ao autenticar.");
        }

        setCookie(null, '@app.token', token, { maxAge: 30 * 24 * 60 * 60, path: '/' });

        this.$patch({
          token,
          user: { id, name, email: userEmail },
          isAuthenticated: true,
        });

        router.push("/");

      } catch (error) {}
    },

    async logout() {
      destroyCookie(null, '@app.token');

      this.$patch({
        token: null,
        user: null,
        isAuthenticated: false,
      });

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
    isUserAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
  },
});
