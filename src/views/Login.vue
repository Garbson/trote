<template>
  <q-layout class="layout">
    <q-page-container>
      <q-page class="login-page">
        <!-- Logo/Título -->
        <div class="game-logo">
          <q-icon name="auto_awesome" size="60px" color="amber" />
          <h1 class="game-title">ARCA DE NOÉ</h1>
          <p class="game-subtitle">Coleção de Animais Lendários</p>
        </div>

        <!-- Card de Login -->
        <q-card class="login-card">
          <q-card-section class="card-header">
            <div class="text-h5 text-center">🚢 Entrar na Arca</div>
          </q-card-section>

          <q-card-section class="card-content">
            <q-form @submit.prevent="handleLogin" class="login-form">
              <q-input
                v-model="email"
                label="Email"
                type="email"
                outlined
                color="primary"
                class="input-field"
                :rules="[(val) => !!val || 'Email é obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input
                v-model="password"
                label="Senha"
                type="password"
                outlined
                color="primary"
                class="input-field"
                :rules="[(val) => !!val || 'Senha é obrigatória']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>

              <div class="button-container">
                <q-btn
                  label="Entrar"
                  type="submit"
                  color="primary"
                  size="lg"
                  class="login-btn"
                  :loading="authStore.loading"
                  :disable="!email || !password"
                />

                <div class="divider">
                  <span>ou</span>
                </div>

                <q-btn
                  size="lg"
                  class="google-btn"
                  :loading="authStore.googleLoading"
                  @click="handleGoogleLogin"
                  no-caps
                >
                  <div class="google-btn-content">
                    <svg class="google-logo" viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span class="google-btn-text">Entrar com Google</span>
                  </div>
                </q-btn>

                <q-btn
                  label="Criar Conta"
                  color="secondary"
                  size="lg"
                  outline
                  class="register-btn"
                  @click="goToCadastro"
                />
              </div>
            </q-form>
          </q-card-section>

          <!-- Footer do card -->
          <q-card-section class="card-footer">
            <div class="game-stats">
              <div class="stat-item">
                <q-icon name="people" color="blue" />
                <span>{{ estatisticas.jogadores }}+ Colecionadores</span>
              </div>
              <div class="stat-item">
                <q-icon name="collections" color="purple" />
                <span>{{ estatisticas.cartas }} Cartas Únicas</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useCartasStore } from "@/stores/cartas";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

// Stores e router
const authStore = useAuthStore();
const cartasStore = useCartasStore();
const router = useRouter();

// Estado reativo
const email = ref("");
const password = ref("");
const estatisticas = ref({
  jogadores: 150,
  cartas: 28,
});

// Methods
const handleLogin = async () => {
  const resultado = await authStore.signIn(email.value, password.value);

  if (resultado.data && !resultado.error) {
    const redirectTo = router.currentRoute.value.query.redirect || "/home";
    router.push(redirectTo);
  }
};

const handleGoogleLogin = async () => {
  await authStore.signInWithGoogle();
};

const goToCadastro = () => {
  router.push("/cadastro");
};

const openInstagram = () => {
  window.open("https://www.instagram.com/dev_garbson/", "_blank");
};

// Lifecycle
onMounted(async () => {
  // Buscar estatísticas gerais se disponível
  await cartasStore.fetchCartas();
  estatisticas.value.cartas = cartasStore.cartasDisponiveis.length;
});
</script>

<style scoped>
.layout {
  background: linear-gradient(
    135deg,
    var(--arca-wood) 0%,
    var(--arca-gold) 50%,
    var(--arca-green) 100%
  );
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.layout::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 80%,
      rgba(255, 215, 0, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(138, 43, 226, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 40% 40%,
      rgba(255, 105, 180, 0.05) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  gap: 30px;
}

.game-logo {
  text-align: center;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.game-title {
  font-family: "Press Start 2P", cursive;
  font-size: 2.5rem;
  color: #ffd700;
  text-shadow: 2px 2px 0px #ff6b35, 4px 4px 0px #d63031,
    6px 6px 10px rgba(0, 0, 0, 0.3);
  margin: 10px 0 5px 0;
  letter-spacing: 3px;
}

.game-subtitle {
  color: #a8dadc;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 3px solid #ffd700;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 215, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, var(--arca-wood), var(--arca-gold));
  color: white;
  text-align: center;
  padding: 20px;
  margin: 0;
}

.card-content {
  padding: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-field {
  font-size: 1rem;
}

.input-field :deep(.q-field__control) {
  border-radius: 12px;
  border: 2px solid #e0e7ff;
  transition: all 0.3s ease;
}

.input-field :deep(.q-field__control):hover {
  border-color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
}

.login-btn,
.register-btn {
  border-radius: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.login-btn {
  background: linear-gradient(135deg, var(--arca-wood), var(--arca-gold));
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.register-btn {
  border: 2px solid #ff6b35;
  color: #ff6b35;
}

.register-btn:hover {
  background: #ff6b35;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
}

.divider {
  position: relative;
  text-align: center;
  margin: 16px 0;
}

.divider span {
  background: white;
  padding: 0 16px;
  color: #7f8c8d;
  font-size: 0.9rem;
  position: relative;
  z-index: 1;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e0e7ff;
  z-index: 0;
}

.google-btn {
  background: white;
  border: 1px solid #dadce0;
  border-radius: 8px;
  color: #3c4043;
  font-family: 'Google Sans', 'Roboto', Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 48px;
  letter-spacing: 0.25px;
  outline: none;
  padding: 0 16px;
  position: relative;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  width: 100%;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.30), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  transition: all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.google-btn:hover {
  background: #f8f9fa;
  border-color: #d2e3fc;
  box-shadow: 0 1px 3px 0 rgba(60, 64, 67, 0.30), 0 4px 8px 3px rgba(60, 64, 67, 0.15);
}

.google-btn:active {
  background: #f1f3f4;
  border-color: #c8e7ff;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.30), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
}

.google-btn-content {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 12px;
  width: 100%;
}

.google-logo {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.google-btn-text {
  color: #3c4043;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.25px;
  line-height: 20px;
}

.card-footer {
  background: rgba(248, 250, 252, 0.8);
  padding: 20px;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
}

.game-stats {
  display: flex;
  justify-content: space-around;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.creator-marketing {
  background: linear-gradient(
    135deg,
    rgba(138, 43, 226, 0.9),
    rgba(255, 20, 147, 0.9)
  );
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 3px solid #ff1493;
  padding: 25px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(255, 20, 147, 0.3);
  animation: glow 3s ease-in-out infinite;
  max-width: 400px;
  width: 100%;
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 15px 35px rgba(255, 20, 147, 0.3);
  }
  50% {
    box-shadow: 0 15px 35px rgba(255, 20, 147, 0.6);
  }
}

.marketing-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.marketing-title {
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.instagram-marketing-btn {
  background: linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045);
  color: white;
  border-radius: 25px;
  padding: 15px 20px;
  font-weight: bold;
  gap: 12px;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 15px;
}

.instagram-marketing-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(131, 58, 180, 0.5);
}

.dev-avatar {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: 2px solid white;
}

.dev-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
}

.dev-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
}

.dev-role {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.marketing-text {
  color: white;
  font-size: 0.95rem;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  font-weight: 500;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 600px) {
  .game-title {
    font-size: 1.8rem;
    letter-spacing: 2px;
  }

  .login-card {
    margin: 0 10px;
  }

  .game-stats {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .creator-marketing {
    margin: 0 10px;
  }

  .instagram-marketing-btn {
    padding: 12px 16px;
    gap: 10px;
  }

  .dev-name {
    font-size: 1rem;
  }

  .dev-role {
    font-size: 0.8rem;
  }
}
</style>
