import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import "./assets/main.css";

const app = createApp(App);
app.use(Toast, {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: 'Vue-Toastification__bounce',
});
const pinia = createPinia();
app.use(pinia);

app.use(router);
app.mount('#app');


