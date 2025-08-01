<template>
  <q-layout view="hHh lpR fFf" class="clash-layout">
    <!-- Header responsivo -->
    <q-header elevated class="clash-header" v-if="authStore.isAuthenticated">
      <q-toolbar>
        <!-- Logo -->
        <q-icon name="shield" size="md" color="amber" />
        <q-toolbar-title class="header-title clash-title">
          BIXO ROYALE
        </q-toolbar-title>

        <!-- Botões desktop -->
        <div class="desktop-actions">
          <q-btn
            v-if="isAdmin"
            flat
            round
            icon="admin_panel_settings"
            @click="$router.push('/admin')"
            class="desktop-btn"
            size="md"
          >
            <q-tooltip>Painel Admin</q-tooltip>
          </q-btn>

          <q-btn
            flat
            label="Adicionar Código"
            icon="add"
            @click="openCodeDialog"
            :loading="cartasStore.loadingObter"
            class="desktop-btn"
          />

          <q-btn
            flat
            label="Ranking"
            icon="emoji_events"
            @click="$router.push('/ranking')"
            class="desktop-btn"
          />

          <q-btn
            flat
            round
            icon="logout"
            @click="logout"
            class="desktop-btn logout-desktop"
            size="md"
          >
            <q-tooltip>Sair</q-tooltip>
          </q-btn>
        </div>

        <!-- Menu hambúrguer mobile -->
        <q-btn
          flat
          round
          icon="menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="mobile-menu-btn"
          size="md"
        />
      </q-toolbar>
    </q-header>

    <!-- Menu mobile slide -->
    <q-drawer
      v-model="mobileMenuOpen"
      side="right"
      overlay
      behavior="mobile"
      :width="280"
      class="mobile-drawer"
      v-if="authStore.isAuthenticated"
    >
      <div class="mobile-menu">
        <!-- Header do menu -->
        <div class="mobile-menu-header">
          <q-avatar size="60px" class="user-avatar">
            <q-icon name="person" size="35px" />
          </q-avatar>
          <div class="user-info">
            <div class="user-name">
              {{ authStore.user?.nome || "Colecionador" }}
            </div>
            <div class="user-level">Nível {{ authStore.user?.nivel || 1 }}</div>
          </div>
        </div>

        <!-- Stats rápidas -->
        <div class="mobile-stats">
          <div class="mobile-stat">
            <q-icon name="stars" color="amber" />
            <span>{{ authStore.user?.pontos_totais || 0 }} pts</span>
          </div>
          <div class="mobile-stat">
            <q-icon name="collections" color="blue" />
            <span
              >{{ cartasStore.estatisticas.total_cartas }}/{{
                cartasStore.estatisticas.total_disponiveis
              }}</span
            >
          </div>
        </div>

        <!-- Menu items -->
        <q-list class="menu-list">
          <q-item
            clickable
            v-ripple
            @click="openCodeDialog"
            class="menu-item primary-item"
          >
            <q-item-section avatar>
              <q-icon name="add_circle" color="primary" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Adicionar Código</q-item-label>
              <q-item-label caption>Digite o código da carta</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-spinner v-if="cartasStore.loadingObter" size="sm" />
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="$router.push('/ranking')"
            class="menu-item"
          >
            <q-item-section avatar>
              <q-icon name="emoji_events" color="orange" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Ranking</q-item-label>
              <q-item-label caption>Ver posição no ranking</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="arrow_forward_ios" size="sm" />
            </q-item-section>
          </q-item>

          <q-item
            v-if="isAdmin"
            clickable
            v-ripple
            @click="$router.push('/admin')"
            class="menu-item"
          >
            <q-item-section avatar>
              <q-icon name="admin_panel_settings" color="purple" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Painel Admin</q-item-label>
              <q-item-label caption>Administrar sistema</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="arrow_forward_ios" size="sm" />
            </q-item-section>
          </q-item>

          <q-separator class="menu-separator" />

          <q-item
            clickable
            v-ripple
            @click="logout"
            class="menu-item logout-item"
          >
            <q-item-section avatar>
              <q-icon name="logout" color="negative" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Sair</q-item-label>
              <q-item-label caption>Fazer logout</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page class="page">
        <q-page-container class="page-container">
          <!-- Partículas decorativas -->
          <div class="clash-particles"></div>

          <!-- Mensagem de boas-vindas APENAS para visitantes -->
          <div
            v-if="!authStore.isAuthenticated"
            class="welcome-message clash-card"
          >
            <div class="welcome-header">
              <q-icon
                name="auto_awesome"
                size="60px"
                color="amber"
                class="clash-pulse"
              />
              <h2 class="epic-title">Bem-vindo à Arena BIXO ROYALE!</h2>
              <div class="subtitle-container">
                <p class="epic-subtitle">
                  🎯 Coleção Épica de Calouros Lendários 🏆
                </p>
              </div>
            </div>

            <div class="epic-message-container">
              <div class="typed-message" v-html="typedMessage"></div>

              <div class="battle-cry">
                <div class="cry-line">⚔️ EXPLORE O CAMPUS ⚔️</div>
                <div class="cry-line">🔥 COLETE OS CÓDIGOS 🔥</div>
                <div class="cry-line">👑 TORNE-SE LENDÁRIO 👑</div>
              </div>
            </div>

            <!-- Marketing do Instagram -->
            <div class="creator-section">
              <div class="creator-header">
                <q-icon name="palette" color="pink" size="md" />
                <span class="creator-title">Criado por</span>
              </div>
              <q-btn flat no-caps class="instagram-btn" @click="openInstagram">
                <q-icon name="photo_camera" size="sm" />
                <span>@dev_garbson</span>
                <q-icon name="open_in_new" size="xs" />
              </q-btn>
            </div>

            <!-- CTA para entrar -->
            <div class="cta-section">
              <q-btn
                label="Entrar na Arena"
                color="primary"
                size="xl"
                class="clash-btn clash-btn-primary cta-btn"
                @click="$router.push('/login')"
              />
            </div>
          </div>

          <!-- Dashboard APENAS para usuários logados -->
          <div v-if="authStore.isAuthenticated" class="user-dashboard">
            <div class="dashboard-header">
              <h3 class="dashboard-title">🏆 Sua Arena</h3>
              <p class="welcome-back">
                Bem-vindo de volta,
                {{ authStore.user?.nome || "Colecionador" }}!
              </p>
            </div>

            <div class="stats-container">
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
          <div v-if="authStore.isAuthenticated" class="cards-grid">
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
        </q-page-container>
      </q-page>
    </q-page-container>

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
import { checkAdminAccess } from "../admin";

// Stores e router
const authStore = useAuthStore();
const cartasStore = useCartasStore();
const router = useRouter();

// Estado local
const codeDialog = ref(false);
const inputCode = ref("");
const activeCarta = ref(null);
const typedMessage = ref("");
const mobileMenuOpen = ref(false);

// Mensagem de boas-vindas para visitantes
const message = `
🎯 <strong>COMO FUNCIONA A ARENA:</strong><br>
• Cada carta representa um calouro único com poderes especiais<br>
• Encontre os calouros no campus e veja a <span style="color: #ffd700;">placa no peito</span> deles<br>
• Digite o código da placa em "Adicionar Código" para obter a carta<br>
• Acumule pontos e suba no ranking da arena<br><br>

🏆 <strong>MISSÕES ÉPICAS:</strong><br>
• Colete todas as cartas raras e lendárias<br>
• Explore o campus em busca dos calouros com placas<br>
• Desbloqueie cartas especiais com códigos únicos<br>
• Compete com outros jogadores no ranking<br><br>

⚡ <strong>DICAS DE BATALHA:</strong><br>
• Cartas lendárias valem mais pontos<br>
• Os códigos estão nas <span style="color: #ff6b35;">placas que os calouros usam no peito</span><br>
• Cada calouro tem um código único - não perca nenhum!<br>
• Mantenha-se ativo para encontrar todos os calouros
`;

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

const isAdmin = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user) return false;
  return checkAdminAccess(authStore.user);
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
    image: carta.foto_url || "/img/default-avatar.jpg",
    acquired: cartasStore.verificarCartaObtida(carta.id),
    code: carta.codigo_unico,
    raridade: carta.raridade,
    pontos: carta.pontos_valor,
    curso: carta.descricao || "Calouro da Arena",
  };
};

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

const openInstagram = () => {
  window.open("https://www.instagram.com/dev_garbson/", "_blank");
};

// Lifecycle
onMounted(async () => {

  // Só executa a animação de digitação para visitantes
  if (!authStore.isAuthenticated) {
    typeMessage();
  }

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

/* ===== HEADER RESPONSIVO ===== */
.clash-header {
  background: linear-gradient(135deg, var(--cr-blue-dark), var(--cr-purple));
  border-bottom: 3px solid var(--cr-gold);
}

.header-title {
  color: var(--cr-gold);
  font-size: 1.2rem;
  margin-left: 12px;
}

/* Botões desktop - visíveis apenas em desktop */
.desktop-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.desktop-btn {
  color: white;
  transition: all 0.3s ease;
}

.desktop-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.logout-desktop {
  background: rgba(239, 35, 60, 0.2);
  margin-left: 8px;
}

/* Menu hambúrguer - visível apenas em mobile */
.mobile-menu-btn {
  color: white;
  display: none;
}

/* ===== MENU MOBILE ===== */
.mobile-drawer {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}

.mobile-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: rgb(208, 208, 208);
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}

.mobile-menu-header {
  padding: 30px 20px 20px 20px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-avatar {
  background: linear-gradient(135deg, var(--cr-gold), #ffa000);
  color: white;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 4px;
}

.user-level {
  font-size: 0.9rem;
  opacity: 0.8;
}

.mobile-stats {
  padding: 15px 20px;
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
}

.menu-list {
  flex: 1;
  padding: 10px 0;
}

.menu-item {
  margin: 4px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.primary-item {
  background: rgba(74, 144, 226, 0.2);
  border: 1px solid rgba(74, 144, 226, 0.3);
}

.logout-item {
  background: rgba(239, 35, 60, 0.2);
  border: 1px solid rgba(239, 35, 60, 0.3);
}

.menu-label {
  font-weight: 600;
  font-size: 1rem;
}

.menu-separator {
  margin: 15px 20px;
  background: rgba(255, 255, 255, 0.2);
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 768px) {
  /* Esconder botões desktop */
  .desktop-actions {
    display: none;
  }

  /* Mostrar menu hambúrguer */
  .mobile-menu-btn {
    display: block;
  }

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

  .epic-title {
    font-size: 1.6rem;
  }

  .epic-subtitle {
    font-size: 0.8rem;
  }
}

@media (min-width: 769px) {
  /* Em desktop, sempre esconder o drawer mobile */
  .mobile-drawer {
    display: none !important;
  }
}

/* ===== RESTO DOS ESTILOS (mantidos iguais) ===== */
.page-container {
  padding: 20px;
  position: relative;
}

.welcome-message {
  margin-bottom: 30px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.9),
    rgba(30, 60, 114, 0.8)
  );
  border: 4px solid var(--cr-gold);
  animation: epic-border-glow 3s ease-in-out infinite;
}

@keyframes epic-border-glow {
  0%,
  100% {
    border-color: var(--cr-gold);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% {
    border-color: #fff;
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
  }
}

.welcome-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  text-align: center;
}

.epic-title {
  font-family: "Press Start 2P", cursive;
  font-size: 2.2rem;
  color: var(--cr-gold);
  text-shadow: 2px 2px 0px #ff6b35, 4px 4px 0px #d63031,
    6px 6px 10px rgba(0, 0, 0, 0.8);
  margin: 0;
  letter-spacing: 2px;
  animation: epic-title-pulse 2s ease-in-out infinite;
  line-height: 1.2;
}

@keyframes epic-title-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.subtitle-container {
  background: linear-gradient(45deg, #ff6b35, #f093fb);
  padding: 15px 25px;
  border-radius: 20px;
  border: 2px solid var(--cr-gold);
  animation: subtitle-float 3s ease-in-out infinite;
}

.epic-subtitle {
  font-family: "Press Start 2P", cursive;
  font-size: 1rem;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 1px;
}

@keyframes subtitle-float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

.epic-message-container {
  background: rgba(0, 0, 0, 0.6);
  padding: 25px;
  border-radius: 15px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  margin-bottom: 25px;
}

.typed-message {
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.8;
  text-align: left;
  margin-bottom: 20px;
  font-weight: 500;
}

.battle-cry {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid var(--cr-gold);
}

.cry-line {
  font-family: "Press Start 2P", cursive;
  font-size: 0.9rem;
  color: var(--cr-gold);
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  animation: cry-glow 2s ease-in-out infinite;
  letter-spacing: 1px;
}

.cry-line:nth-child(1) {
  animation-delay: 0s;
}
.cry-line:nth-child(2) {
  animation-delay: 0.5s;
}
.cry-line:nth-child(3) {
  animation-delay: 1s;
}

@keyframes cry-glow {
  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

.creator-section {
  background: linear-gradient(
    135deg,
    rgba(138, 43, 226, 0.8),
    rgba(255, 20, 147, 0.8)
  );
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #ff1493;
  text-align: center;
  margin-top: 20px;
}

.creator-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
}

.creator-title {
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
}

.instagram-btn {
  background: linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045);
  color: white;
  border-radius: 20px;
  padding: 10px 20px;
  font-weight: bold;
  gap: 8px;
  transition: all 0.3s ease;
}

.instagram-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(131, 58, 180, 0.4);
}

.cta-section {
  margin-top: 30px;
  text-align: center;
}

.cta-btn {
  padding: 15px 40px;
  font-size: 1.1rem;
  border-radius: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
}

.user-dashboard {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  border: 2px solid var(--cr-gold);
}

.dashboard-header {
  text-align: center;
  margin-bottom: 20px;
}

.dashboard-title {
  color: var(--cr-gold);
  font-size: 1.5rem;
  margin: 0 0 5px 0;
}

.welcome-back {
  color: white;
  margin: 0;
  font-size: 1.1rem;
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

  .mobile-menu-header {
    padding: 20px 15px 15px 15px;
  }

  .user-name {
    font-size: 1rem;
  }

  .mobile-stats {
    padding: 12px 15px;
  }

  .mobile-stat {
    font-size: 0.85rem;
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

/* Animação do drawer mobile */
.mobile-drawer {
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
}

/* Efeito hover nos itens do menu mobile */
.menu-item {
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.menu-item:hover {
  border-left-color: var(--cr-gold);
  transform: translateX(5px);
}

.primary-item:hover {
  border-left-color: #4a90e2;
}

.logout-item:hover {
  border-left-color: #ef233c;
}

/* Melhorar visualização das stats mobile */
.mobile-stat q-icon {
  font-size: 1.2rem;
}

/* Animação de abertura do menu */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.mobile-drawer .q-drawer__content {
  animation: slideInRight 0.3s ease-out;
}
</style>
