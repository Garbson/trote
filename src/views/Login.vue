<template>
  <q-layout class="layout">
    <q-page-container>
      <q-page class="login-page">
        <!-- Logo/Título -->
        <div class="game-logo">
          <q-icon name="auto_awesome" size="60px" color="amber" />
          <h1 class="game-title">BIXO ROYALE</h1>
          <p class="game-subtitle">Coleção de Calouros</p>
        </div>

        <!-- Card de Login -->
        <q-card class="login-card">
          <q-card-section class="card-header">
            <div class="text-h5 text-center">⚔️ Entrar na Arena</div>
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

        <!-- Botão para jogar como visitante -->
        <q-btn
          flat
          label="Explorar como Visitante"
          color="white"
          class="guest-btn"
          @click="continuarComoVisitante"
        />
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
    const redirectTo = router.currentRoute.value.query.redirect || "/";
    router.push(redirectTo);
  }
};

const goToCadastro = () => {
  router.push("/cadastro");
};

const continuarComoVisitante = () => {
  router.push("/");
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
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4a90e2 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.guest-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 12px 24px;
  transition: all 0.3s ease;
}

.guest-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
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
}
</style>
