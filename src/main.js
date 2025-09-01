import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { Notify, Quasar } from "quasar";
import "quasar/src/css/index.sass";
import { createApp } from "vue";
import App from "./App.vue";
import router from './router';

import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

// Importar tema CSS global
import "./assets/acampja-theme.css";

// Configuração do Quasar
const quasarConfig = {
  plugins: {
    Notify
  }
}

const app = createApp(App);
const pinia = createPinia();

// Adicionar plugin de persistência
pinia.use(piniaPluginPersistedstate);

// Aplicar plugins na ordem correta
app.use(pinia);
app.use(router);
app.use(Quasar, quasarConfig);

// Montar a aplicação
app.mount("#app");

// Inicializar autenticação após montar
setTimeout(async () => {
  const { useAuthStore } = await import('./stores/auth');
  const authStore = useAuthStore();
  await authStore.initAuth();
}, 100);