import { createPinia } from "pinia";
import { Quasar } from "quasar";
import "quasar/src/css/index.sass";
import { createApp } from "vue";
import App from "./App.vue";
import router from './router';

import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

// Configuração do Quasar
const quasarConfig = {
  plugins: {
    Notify: {}
  }
}

const app = createApp(App);
const pinia = createPinia();

// Aplicar plugins na ordem correta
app.use(pinia);
app.use(router);
app.use(Quasar, quasarConfig);

app.mount("#app");