<template>
  <div class="welcome-section">
    <!-- Partículas decorativas -->
    <div class="acampja-particles"></div>

    <!-- Mensagem de boas-vindas APENAS para visitantes -->
    <div v-if="!authStore.isAuthenticated" class="welcome-message acampja-card">
      <div class="welcome-header">
        <q-icon
          name="sailing"
          size="60px"
          color="brown"
          class="acampja-pulse"
        />
        <h2 class="epic-title">Bem-vindo à Arca de Noé!</h2>
        <div class="subtitle-container">
          <p class="epic-subtitle">🦁 Coleção Épica dos Animais da Arca 🐘</p>
        </div>
      </div>

      <div class="epic-message-container">
        <div class="typed-message" v-html="typedMessage"></div>

        <div class="battle-cry">
          <div class="cry-line">� EMBARQUE NA ARCA �</div>
          <div class="cry-line">🦁 COLETE OS ANIMAIS 🐘</div>
          <div class="cry-line">👑 ENCONTRE OS LENDÁRIOS 👑</div>
        </div>
      </div>

      <!-- Marketing expandido do Dev_garbson -->
      <div class="creator-section enhanced">
        <div class="creator-card">
          <div class="creator-header">
            <q-avatar size="50px" class="dev-avatar">
              <q-icon name="code" size="24px" color="white" />
            </q-avatar>
            <div class="creator-info">
              <div class="creator-title">Desenvolvido por</div>
              <div class="creator-name">@dev_garbson</div>
            </div>
          </div>

          <div class="creator-stats">
            <div class="stat-badge">
              <q-icon name="engineering" size="sm" />
              <span>Full Stack Developer</span>
            </div>
            <div class="stat-badge">
              <q-icon name="code" size="sm" />
              <span>Vue.js Expert</span>
            </div>
          </div>

          <div class="creator-actions">
            <q-btn
              color="green"
              icon="chat"
              label="Falar no WhatsApp"
              @click="openWhatsApp"
              class="whatsapp-btn-enhanced"
              glossy
            >
              <q-icon name="open_in_new" size="xs" />
            </q-btn>
          </div>
        </div>
      </div>

      <!-- CTA para entrar -->
      <div class="cta-section">
        <q-btn
          label="Entrar na Arca"
          color="primary"
          size="xl"
          class="acampja-btn acampja-btn-primary cta-btn"
          @click="$router.push('/login')"
        />
      </div>
    </div>

    <!-- Dashboard APENAS para usuários logados -->
    <div v-if="authStore.isAuthenticated" class="user-dashboard">
      <div class="dashboard-header">
        <h3 class="dashboard-title">🏕️ Sua Arca</h3>
        <p class="welcome-back">
          Bem-vindo de volta, {{ authStore.user?.nome || "Acampista" }}!
        </p>
      </div>

      <div class="stats-container">
        <div class="stat-item acampja-badge rarity-rare">
          <q-icon name="stars" size="md" />
          <span>{{ authStore.user?.pontos_totais || 0 }} pontos</span>
        </div>
        <div class="stat-item acampja-badge rarity-epic">
          <q-icon name="trending_up" size="md" />
          <span>Nível {{ authStore.user?.nivel || 1 }}</span>
        </div>
        <div class="stat-item acampja-badge rarity-legendary">
          <q-icon name="collections" size="md" />
          <span
            >{{ cartasStore.estatisticas.total_cartas }}/{{
              cartasStore.estatisticas.total_disponiveis
            }}</span
          >
        </div>
        <div class="stat-item acampja-badge rarity-common">
          <q-icon name="percent" size="md" />
          <span>{{ cartasStore.estatisticas.percentual_completo }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
const typedMessage = ref("");

// Mensagem de boas-vindas para visitantes
const message = `
🚢 <strong>COMO FUNCIONA A ARCA DE NOÉ:</strong><br>
• Cada carta representa um animal único da Arca com características especiais<br>
• Encontre os acampistas no acampamento e veja a <span style="color: #F1C40F;">placa no peito</span> deles<br>
• Digite o código da placa em "Adicionar Código" para obter o animal<br>
• Acumule pontos e suba no ranking da arca<br><br>

🦁 <strong>MISSÕES DA ARCA:</strong><br>
• Colete todos os animais da arca, dos comuns aos lendários<br>
• Explore o acampamento em busca dos códigos dos animais<br>
• Encontre os animais lendários escondidos (apenas códigos especiais)<br>
• Compete com outros no ranking da Arca de Noé<br><br>

🐘 <strong>DICAS DE COLETA:</strong><br>
• Animais lendários valem mais pontos e são mais raros<br>
• Os códigos estão nas <span style="color: #E67E22;">placas que os acampistas usam no peito</span><br>
• Cada animal tem um código único - colete todos!<br>
• Mantenha-se ativo para encontrar todos os animais da arca
`;

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

const openWhatsApp = () => {
  window.open("https://wa.me/5568992490198", "_blank");
};

const mostrarCreditos = () => {
  $q.dialog({
    title: "🚢 Sobre a Arca de Noé - ACAMPJA 2025",
    message: `
      <div style="text-align: center; padding: 20px;">
        <div style="margin-bottom: 20px;">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24'%3E%3Cpath fill='%23228B22' d='M14.6 16.6l4.6-4.6l-4.6-4.6L16 6l6 6l-6 6l-1.4-1.4zm-5.2 0L4.8 12l4.6-4.6L8 6l-6 6l6 6l1.4-1.4z'/%3E%3C/svg%3E" alt="Code Icon">
        </div>
        
        <h4 style="color: #228B22; margin: 10px 0;">Sistema desenvolvido por</h4>
        <h3 style="color: #8B4513; margin: 5px 0;">@dev_garbson</h3>
        
        <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <p><strong>� Tema: Arca de Noé</strong></p>
          <p>Colete animais, encontre os lendários escondidos!</p>
          <p><strong>🛠️ Tecnologias:</strong> Vue.js 3 • Quasar • Supabase</p>
        </div>
        
        <div style="margin: 20px 0;">
          <p>💼 <strong>Full Stack Developer</strong></p>
          <p>🎯 Especialista em Vue.js e sistemas web modernos</p>
          <p>❤️ Apaixonado por criar experiências incríveis</p>
        </div>
        
        <div style="margin-top: 25px;">
          <p style="color: #6c757d; font-size: 0.9rem;">
            Desenvolvido com muito ❤️ e ☕<br>
            Quer um sistema como este? Entre em contato!
          </p>
        </div>
      </div>
    `,
    html: true,
    ok: {
      label: "Falar no WhatsApp",
      color: "green",
    },
    cancel: {
      label: "Fechar",
      flat: true,
    },
  }).onOk(() => {
    openWhatsApp();
  });
};

// Lifecycle
onMounted(() => {
  // Só executa a animação de digitação para visitantes
  if (!authStore.isAuthenticated) {
    typeMessage();
  }
});
</script>

<style scoped>
.welcome-section {
  position: relative;
}

/* ===== PARTÍCULAS DECORATIVAS ===== */
.acampja-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.acampja-particles::before,
.acampja-particles::after {
  content: "⭐";
  position: absolute;
  color: var(--cr-gold);
  font-size: 20px;
  animation: float-particles 8s ease-in-out infinite;
}

.acampja-particles::before {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.acampja-particles::after {
  top: 60%;
  right: 15%;
  animation-delay: 4s;
}

@keyframes float-particles {
  0%,
  100% {
    transform: translateY(0px) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
}

/* ===== WELCOME MESSAGE ===== */
.welcome-message {
  margin-bottom: 30px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--arca-wood), var(--arca-gold));
  border: 4px solid var(--arca-gold);
  animation: epic-border-glow 3s ease-in-out infinite;
  color: white;
}

@keyframes epic-border-glow {
  0%,
  100% {
    border-color: var(--arca-gold);
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
  font-family: "Fredoka One", sans-serif;
  font-size: 1.8rem;
  color: var(--cr-gold);
  text-shadow: 2px 2px 0px var(--acampja-secondary), 4px 4px 0px var(--cr-red),
    6px 6px 10px rgba(0, 0, 0, 0.8);
  margin: 0;
  letter-spacing: 1px;
  animation: epic-title-pulse 2s ease-in-out infinite;
  line-height: 1.3;
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
  background: linear-gradient(
    45deg,
    var(--acampja-secondary),
    var(--acampja-accent)
  );
  padding: 15px 25px;
  border-radius: 20px;
  border: 2px solid var(--cr-gold);
  animation: subtitle-float 3s ease-in-out infinite;
}

.epic-subtitle {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 1px;
  font-weight: 600;
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
  border: 2px solid rgba(241, 196, 15, 0.3);
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
  font-family: "Fredoka One", sans-serif;
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

/* ===== CREATOR SECTION ===== */
.creator-section.enhanced {
  margin: 30px 0;
}

.creator-card {
  background: linear-gradient(
    135deg,
    var(--acampja-primary),
    var(--acampja-secondary)
  );
  border-radius: 16px;
  padding: 24px;
  color: white;
  box-shadow: 0 8px 32px rgba(46, 204, 113, 0.3);
  transform: perspective(1000px) rotateX(2deg);
}

.creator-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.dev-avatar {
  background: linear-gradient(135deg, var(--cr-gold), var(--acampja-yellow));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.creator-info {
  flex: 1;
}

.creator-title {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 4px;
}

.creator-name {
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--cr-gold);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.creator-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.85rem;
  backdrop-filter: blur(10px);
}

.creator-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.whatsapp-btn-enhanced {
  background: linear-gradient(135deg, #25d366, #128c7e);
  border: none;
  border-radius: 8px;
  font-weight: bold;
  flex: 1;
  min-width: 200px;
  color: white;
}

.love-btn {
  border: 2px solid #ff4081;
  border-radius: 8px;
  color: #ff4081;
}

.love-btn:hover {
  background: rgba(255, 64, 129, 0.1);
}

/* ===== CTA SECTION ===== */
.cta-section {
  margin-top: 30px;
  text-align: center;
}

.cta-btn {
  padding: 15px 40px;
  font-size: 1.1rem;
  border-radius: 25px;
  background: linear-gradient(
    135deg,
    var(--acampja-primary),
    var(--acampja-secondary)
  );
  box-shadow: 0 8px 25px rgba(46, 204, 113, 0.4);
  transition: all 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 35px rgba(46, 204, 113, 0.6);
}

/* ===== USER DASHBOARD ===== */
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

/* ===== BADGES ACAMPJA ===== */
.acampja-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ===== BOTÕES ACAMPJA ===== */
.acampja-btn {
  border-radius: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  border: none;
  position: relative;
  overflow: hidden;
}

.acampja-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.acampja-btn:hover::before {
  left: 100%;
}

.acampja-btn-primary {
  background: linear-gradient(
    135deg,
    var(--acampja-primary),
    var(--acampja-secondary)
  );
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.4);
}

.acampja-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(46, 204, 113, 0.6);
}

/* ===== CARDS ACAMPJA ===== */
.acampja-card {
  background: rgba(255, 255, 255, 0.1);
  border: var(--cr-border-card);
  border-radius: var(--cr-border-radius);
  box-shadow: var(--cr-shadow-card);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
}

.acampja-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--acampja-primary),
    var(--acampja-secondary),
    var(--acampja-accent)
  );
  z-index: 1;
}

.acampja-pulse {
  animation: acampja-pulse 2s ease-in-out infinite;
}

@keyframes acampja-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 768px) {
  .welcome-message {
    padding: 20px;
  }

  .epic-title {
    font-size: 1.4rem;
  }

  .epic-subtitle {
    font-size: 0.9rem;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .creator-actions {
    flex-direction: column;
  }

  .whatsapp-btn-enhanced {
    min-width: auto;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .welcome-header {
    flex-direction: column;
    text-align: center;
  }

  .creator-card {
    padding: 16px;
  }

  .creator-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .creator-stats {
    flex-direction: column;
    gap: 8px;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>
