<template>
  <q-layout view="hHh lpR fFf" class="acampja-layout">
    <!-- Header Component -->
    <AppHeader
      :mobile-menu-open="mobileMenuOpen"
      @toggle-mobile-menu="mobileMenuOpen = !mobileMenuOpen"
      @open-code-dialog="openCodeDialog"
      @logout="logout"
      @ver-perfil="verPerfil"
      @ver-colecao="verColetao"
    />

    <!-- Mobile Menu Component -->
    <MobileMenu
      v-model:is-open="mobileMenuOpen"
      @open-code-dialog="openCodeDialog"
      @logout="logout"
    />

    <q-page-container>
      <q-page class="page">
        <q-page-container class="page-container">
          <!-- Welcome Section Component -->
          <WelcomeSection />

          <!-- Cards Section Component (apenas para usuários autenticados) -->
          <CardsSection
            v-if="authStore.isAuthenticated"
            :active-carta="activeCarta"
          />

          <!-- Footer Component -->
          <AppFooter />
        </q-page-container>
      </q-page>
    </q-page-container>

    <!-- Dialog para adicionar código -->
    <q-dialog v-model="codeDialog">
      <q-card class="code-dialog acampja-card">
        <q-card-section class="dialog-header">
          <div class="text-h6 acampja-subtitle">🔮 Digite o Código Mágico</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="inputCode"
            label="Código da Carta"
            outlined
            color="primary"
            class="acampja-input"
            @keyup.enter="aplicarCodigo"
          >
            <template v-slot:prepend>
              <q-icon name="key" color="amber" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn
            label="Confirmar"
            color="primary"
            class="acampja-btn acampja-btn-primary"
            @click="aplicarCodigo"
            :loading="cartasStore.loadingObter"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/AppHeader.vue";
import CardsSection from "@/components/CardsSection.vue";
import MobileMenu from "@/components/MobileMenu.vue";
import WelcomeSection from "@/components/WelcomeSection.vue";
import { useAuthStore } from "@/stores/auth";
import { useCartasStore } from "@/stores/cartas";
import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

// Stores e router
const authStore = useAuthStore();
const cartasStore = useCartasStore();
const router = useRouter();
const $q = useQuasar();

// Estado local
const codeDialog = ref(false);
const inputCode = ref("");
const activeCarta = ref(null);
const mobileMenuOpen = ref(false);

// Methods
const openCodeDialog = () => {
  codeDialog.value = true;
  inputCode.value = "";
  mobileMenuOpen.value = false; // Fechar menu mobile
};

const aplicarCodigo = async () => {
  if (!inputCode.value.trim()) return;

  const resultado = await cartasStore.obterCartaPorCodigo(
    inputCode.value.trim()
  );

  if (resultado.success) {
    codeDialog.value = false;
    inputCode.value = "";

    // Animação da carta
    activeCarta.value = resultado.carta.id;
    scrollToCarta(resultado.carta.id);

    setTimeout(() => {
      activeCarta.value = null;
    }, 4000);
  }
};

const scrollToCarta = (cartaId) => {
  setTimeout(() => {
    const element = document.getElementById("carta-" + cartaId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
};

const logout = async () => {
  mobileMenuOpen.value = false; // Fechar menu mobile
  await authStore.signOut();
  router.push("/login");
};

const verPerfil = () => {
  mobileMenuOpen.value = false;
  $q.notify({
    type: "info",
    message: "Funcionalidade em desenvolvimento",
    caption: "Em breve você poderá editar seu perfil!",
  });
};

const verColetao = () => {
  mobileMenuOpen.value = false;
  // Scroll para a seção de cartas
  const cardsSection = document.querySelector(".cards-section");
  if (cardsSection) {
    cardsSection.scrollIntoView({ behavior: "smooth" });
  }
};

// Lifecycle
onMounted(async () => {
  console.log("🏠 Home montado - Estado auth:", authStore.isAuthenticated);
  console.log("🏠 Auth inicializado:", authStore.initialized);

  // Aguardar inicialização da autenticação se necessário
  if (!authStore.initialized) {
    console.log("⏳ Aguardando inicialização da autenticação...");

    // Aguardar até 5 segundos pela inicialização
    const maxWait = 5000;
    const startTime = Date.now();

    while (!authStore.initialized && Date.now() - startTime < maxWait) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log("✅ Autenticação inicializada:", authStore.initialized);
  }

  // Sempre carregar cartas disponíveis primeiro
  await cartasStore.fetchCartas();
  console.log("📦 Cartas disponíveis carregadas:", cartasStore.cartas.length);

  // Carregar cartas do usuário com retry
  if (authStore.isAuthenticated) {
    await loadUserCardsWithRetry();
  }
});

// Função para carregar cartas do usuário com retry
const loadUserCardsWithRetry = async (maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Tentativa ${attempt} de carregar cartas do usuário...`);
      await cartasStore.fetchCartasUsuario();

      console.log(
        "✅ Cartas do usuário carregadas:",
        cartasStore.cartasUsuario.length
      );
      console.log("📊 Estatísticas:", cartasStore.estatisticas);

      return; // Sucesso - sair da função
    } catch (error) {
      console.error(`❌ Erro na tentativa ${attempt}:`, error);

      if (attempt < maxRetries) {
        // Aguardar antes da próxima tentativa
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      } else {
        console.error(
          "❌ Falha ao carregar cartas do usuário após todas as tentativas"
        );
      }
    }
  }
};
</script>

<style scoped>
@import "@/assets/acampja-theme.css";

.acampja-layout {
  background: var(--cr-bg-primary);
  min-height: 100vh;
  position: relative;
}

.page-container {
  padding: 20px;
  position: relative;
}

/* ===== DIALOG DE CÓDIGO ===== */
.code-dialog {
  min-width: 350px;
  background: var(--cr-bg-card);
  border: var(--cr-border-card);
}

.dialog-header {
  background: var(--cr-bg-secondary);
  color: white;
  text-align: center;
  margin: 0;
}

/* ===== INPUTS ACAMPJA ===== */
.acampja-input {
  border-radius: 12px;
  border: 2px solid var(--acampja-primary);
  background: rgba(255, 255, 255, 0.95);
  transition: all 0.3s ease;
}

.acampja-input:focus {
  border-color: var(--cr-gold);
  box-shadow: 0 0 0 3px rgba(241, 196, 15, 0.2);
  transform: translateY(-1px);
}

/* ===== OVERLAY PARA ANIMAÇÕES ===== */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(46, 204, 113, 0.8);
  backdrop-filter: blur(5px);
  z-index: 999;
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 768px) {
  .page-container {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 10px;
  }

  .code-dialog {
    min-width: 90vw;
  }
}
</style>
