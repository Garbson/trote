<template>
  <q-layout view="hHh lpR fFf" class="clash-layout">
    <q-page-container>
      <q-page class="page">
        <q-page-container class="page-container">
          <!-- Partículas decorativas -->
          <div class="clash-particles"></div>

          <!-- Mensagem de boas-vindas -->
          <div class="welcome-message clash-card">
            <div class="welcome-header">
              <q-icon
                name="auto_awesome"
                size="40px"
                color="amber"
                class="clash-pulse"
              />
              <h2 class="clash-title">Bem-vindo à Arena BIXO ROYALE!</h2>
            </div>
            <p v-html="typedMessage" class="welcome-text"></p>

            <!-- Estatísticas do usuário -->
            <div v-if="authStore.isAuthenticated" class="stats-container">
              <div class="stat-item clash-badge rarity-rare">
                <q-icon name="stars" size="md" />
                <span>{{ authStore.user?.pontos_totais || 0 }} pontos</span>
              </div>
              <div class="stat-item clash-badge rarity-epic">
                <q-icon name="trending_up" size="md" />
                <span>Nível {{ authStore.user?.nivel || 1 }}</span>
              </div>
              <div class="stat-item clash-badge rarity-legendary">
                <q-icon name="collections" size="md" />
                <span
                  >{{ cartasStore.estatisticas.total_cartas }}/{{
                    cartasStore.estatisticas.total_disponiveis
                  }}</span
                >
              </div>
              <div class="stat-item clash-badge rarity-common">
                <q-icon name="percent" size="md" />
                <span>{{ cartasStore.estatisticas.percentual_completo }}%</span>
              </div>
            </div>
          </div>

          <!-- Barra de progresso da coleção -->
          <div v-if="authStore.isAuthenticated" class="progress-section">
            <div class="progress-header">
              <span class="progress-label clash-subtitle"
                >Progresso da Coleção</span
              >
              <span class="progress-percentage"
                >{{ cartasStore.estatisticas.percentual_completo }}%</span
              >
            </div>
            <div class="clash-progress">
              <div
                class="clash-progress-bar"
                :style="{
                  width: cartasStore.estatisticas.percentual_completo + '%',
                }"
              ></div>
            </div>
          </div>

          <!-- Grid de cartas -->
          <div class="cards-grid">
            <PokemonCard
              v-for="carta in cartasOrdenadas"
              :key="carta.id"
              :id="'carta-' + carta.id"
              :pokemon="mapearCartaParaPokemon(carta)"
              :class="[
                'card-item clash-card-hover',
                {
                  acquired: cartasStore.verificarCartaObtida(carta.id),
                  rotate: carta.rotate,
                  'active-rotate': activeCarta === carta.id,
                },
              ]"
            />
          </div>

          <div v-if="cartasStore.loading" class="loading-container">
            <q-spinner-dots size="50px" color="amber" />
            <p class="clash-subtitle">Carregando cartas da arena...</p>
          </div>
        </q-page-container>
      </q-page>
    </q-page-container>

    <q-footer elevated class="clash-footer">
      <q-toolbar class="footer-toolbar">
        <div class="footer-logo">
          <q-icon name="shield" size="md" color="amber" />
          <span class="footer-title clash-title">BIXO ROYALE</span>
        </div>

        <div class="footer-actions">
          <q-btn
            v-if="!authStore.isAuthenticated"
            label="Entrar na Arena"
            color="primary"
            class="clash-btn clash-btn-primary"
            @click="$router.push('/login')"
          />
          <div v-else class="action-buttons">
            <q-btn
              label="Adicionar Código"
              color="legendary"
              class="clash-btn clash-btn-legendary"
              @click="openCodeDialog"
              :loading="cartasStore.loadingObter"
            >
              <q-icon name="add" left />
            </q-btn>
            <q-btn
              label="Ranking"
              color="secondary"
              class="clash-btn clash-btn-secondary"
              @click="$router.push('/ranking')"
            >
              <q-icon name="emoji_events" left />
            </q-btn>
            <q-btn
              flat
              round
              icon="logout"
              color="white"
              @click="logout"
              class="logout-btn"
              size="md"
            />
          </div>
        </div>
      </q-toolbar>
    </q-footer>

    <!-- Overlay para animação -->
    <div v-if="activeCarta" class="overlay"></div>

    <!-- Dialog para adicionar código -->
    <q-dialog v-model="codeDialog">
      <q-card class="code-dialog clash-card">
        <q-card-section class="dialog-header">
          <div class="text-h6 clash-subtitle">🔮 Digite o Código Mágico</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="inputCode"
            label="Código da Carta"
            outlined
            color="primary"
            class="clash-input"
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
            class="clash-btn clash-btn-primary"
            @click="aplicarCodigo"
            :loading="cartasStore.loadingObter"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import PokemonCard from "@/components/PokemonCard.vue";
import { useAuthStore } from "@/stores/auth";
import { useCartasStore } from "@/stores/cartas";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

// Stores e router
const authStore = useAuthStore();
const cartasStore = useCartasStore();
const router = useRouter();

// Estado local
const codeDialog = ref(false);
const inputCode = ref("");
const activeCarta = ref(null);
const typedMessage = ref("");

// Mensagem de boas-vindas
const message = `⚔️ Seja bem-vindo à Arena BIXO ROYALE! Aqui você pode colecionar cartas épicas dos calouros mais lendários. Cada carta tem um código único que desbloqueará poderes especiais! Use "Adicionar código" para obter novas cartas e subir no ranking. Prepare-se para a batalha! 🏆`;

// Computed
const cartasOrdenadas = computed(() => {
  const cartas = cartasStore.cartasDisponiveis;
  return cartas.slice().sort((a, b) => {
    const aObtida = cartasStore.verificarCartaObtida(a.id);
    const bObtida = cartasStore.verificarCartaObtida(b.id);
    // Ordenar por: obtidas primeiro, depois por raridade
    if (aObtida !== bObtida) return bObtida - aObtida;
    const raridades = { comum: 1, raro: 2, epico: 3, lendario: 4 };
    return (raridades[b.raridade] || 0) - (raridades[a.raridade] || 0);
  });
});

// Methods
const typeMessage = () => {
  let i = 0;
  const speed = 30;
  const type = () => {
    if (i < message.length) {
      typedMessage.value += message.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  };
  type();
};

const mapearCartaParaPokemon = (carta) => {
  return {
    id: carta.id,
    name: carta.nome,
    acao: `${carta.curso} - ${carta.ano_ingresso}`,
    image: carta.foto_url || "/img/default-avatar.jpg",
    acquired: cartasStore.verificarCartaObtida(carta.id),
    code: carta.codigo_unico,
    raridade: carta.raridade,
    pontos: carta.pontos_valor,
  };
};

const openCodeDialog = () => {
  codeDialog.value = true;
  inputCode.value = "";
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
  await authStore.signOut();
  router.push("/login");
};

// Lifecycle
onMounted(async () => {
  typeMessage();

  // Carregar dados
  await cartasStore.fetchCartas();

  if (authStore.isAuthenticated) {
    await cartasStore.fetchCartasUsuario();
  }
});
</script>

<style scoped>
@import "@/assets/clash-royale-theme.css";

.clash-layout {
  background: var(--cr-bg-primary);
  min-height: 100vh;
  position: relative;
}

.page-container {
  padding: 20px;
  position: relative;
}

.welcome-message {
  margin-bottom: 30px;
  padding: 30px;
  position: relative;
  overflow: hidden;
}

.welcome-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  justify-content: center;
}

.welcome-header h2 {
  margin: 0;
  color: var(--cr-gold);
  font-size: 1.8rem;
}

.welcome-text {
  color: var(--cr-blue-dark);
  font-size: 1rem;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 20px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 25px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 0.9rem;
  font-weight: bold;
  justify-content: center;
}

.progress-section {
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-label {
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
}

.progress-percentage {
  color: var(--cr-gold);
  font-size: 1.2rem;
  font-weight: bold;
}

.clash-progress {
  height: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  overflow: hidden;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}

.card-item {
  transition: all 0.3s ease;
}

.card-item.active-rotate {
  z-index: 1000;
  transform: scale(1.1);
  animation: clash-bounce 4s ease-in-out;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 60px;
  color: white;
}

.clash-footer {
  background: linear-gradient(135deg, var(--cr-blue-dark), var(--cr-purple));
  border-top: 3px solid var(--cr-gold);
}

.footer-toolbar {
  padding: 12px 20px;
  min-height: 70px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-title {
  color: var(--cr-gold);
  font-size: 1.2rem;
  margin: 0;
}

.footer-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 60, 114, 0.8);
  backdrop-filter: blur(5px);
  z-index: 999;
}

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

/* Responsividade */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .welcome-header {
    flex-direction: column;
    text-align: center;
  }

  .welcome-header h2 {
    font-size: 1.4rem;
  }

  .footer-toolbar {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .action-buttons .clash-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 15px;
  }

  .welcome-message {
    padding: 20px;
  }

  .progress-section {
    padding: 15px;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }
}

/* Animações personalizadas */
@keyframes card-reveal {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card-item {
  animation: card-reveal 0.6s ease-out;
}

.card-item:nth-child(1) {
  animation-delay: 0.1s;
}
.card-item:nth-child(2) {
  animation-delay: 0.2s;
}
.card-item:nth-child(3) {
  animation-delay: 0.3s;
}
.card-item:nth-child(4) {
  animation-delay: 0.4s;
}
.card-item:nth-child(5) {
  animation-delay: 0.5s;
}
.card-item:nth-child(6) {
  animation-delay: 0.6s;
}

/* Efeitos especiais para cartas obtidas */
.card-item.acquired {
  position: relative;
}

.card-item.acquired::after {
  content: "✨";
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 24px;
  animation: sparkle 2s ease-in-out infinite;
  z-index: 10;
}

@keyframes sparkle {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.3) rotate(180deg);
    opacity: 1;
  }
}

/* Themes para diferentes raridades */
.card-item[data-rarity="lendario"] {
  box-shadow: 0 0 30px rgba(255, 149, 0, 0.3);
}

.card-item[data-rarity="epico"] {
  box-shadow: 0 0 20px rgba(156, 39, 176, 0.3);
}

.card-item[data-rarity="raro"] {
  box-shadow: 0 0 15px rgba(74, 144, 226, 0.3);
}
</style>
