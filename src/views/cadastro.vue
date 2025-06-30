<template>
  <q-layout class="layout">
    <q-page-container>
      <q-page class="cadastro-page">
        <!-- Logo/Título -->
        <div class="game-logo">
          <q-icon name="shield" size="60px" color="amber" />
          <h1 class="game-title">BIXO ROYALE</h1>
          <p class="game-subtitle">Junte-se à Arena</p>
        </div>

        <!-- Card de Cadastro -->
        <q-card class="cadastro-card">
          <q-card-section class="card-header">
            <div class="text-h5 text-center">🏆 Criar Conta</div>
            <p class="header-subtitle">Torne-se um Colecionador Lendário</p>
          </q-card-section>

          <q-card-section class="card-content">
            <q-form @submit.prevent="handleCadastro" class="cadastro-form">
              <q-input
                v-model="nome"
                label="Nome de Guerreiro"
                outlined
                color="primary"
                class="input-field"
                :rules="[
                  (val) => !!val || 'Nome é obrigatório',
                  (val) =>
                    val.length >= 2 || 'Nome deve ter pelo menos 2 caracteres',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input
                v-model="email"
                label="Email"
                type="email"
                outlined
                color="primary"
                class="input-field"
                :rules="[
                  (val) => !!val || 'Email é obrigatório',
                  (val) => isValidEmail(val) || 'Email inválido',
                ]"
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
                :rules="[
                  (val) => !!val || 'Senha é obrigatória',
                  (val) =>
                    val.length >= 6 || 'Senha deve ter pelo menos 6 caracteres',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
              </q-input>

              <q-input
                v-model="confirmPassword"
                label="Confirmar Senha"
                type="password"
                outlined
                color="primary"
                class="input-field"
                :rules="[
                  (val) => !!val || 'Confirmação é obrigatória',
                  (val) => val === password || 'Senhas não coincidem',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="lock_outline" />
                </template>
              </q-input>

              <!-- Termos e condições -->
              <q-checkbox
                v-model="aceitaTermos"
                label="Aceito os termos e condições da Arena"
                color="primary"
                class="terms-checkbox"
              />

              <div class="button-container">
                <q-btn
                  label="Criar Conta"
                  type="submit"
                  color="primary"
                  size="lg"
                  class="cadastro-btn"
                  :loading="authStore.loading"
                  :disable="!isFormValid"
                />

                <q-btn
                  label="Já tenho conta"
                  color="secondary"
                  size="lg"
                  outline
                  class="login-btn"
                  @click="goToLogin"
                />
              </div>
            </q-form>
          </q-card-section>

          <!-- Benefícios -->
          <q-card-section class="card-footer">
            <div class="benefits-title">🎁 Benefícios de Colecionador:</div>
            <div class="benefits-list">
              <div class="benefit-item">
                <q-icon name="collections" color="purple" />
                <span>Colecione cartas únicas dos calouros</span>
              </div>
              <div class="benefit-item">
                <q-icon name="emoji_events" color="amber" />
                <span>Participe do ranking global</span>
              </div>
              <div class="benefit-item">
                <q-icon name="stars" color="blue" />
                <span>Ganhe pontos e suba de nível</span>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Botão voltar -->
        <q-btn
          flat
          label="Voltar ao Início"
          color="white"
          class="back-btn"
          @click="$router.push('/')"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

// Stores e router
const authStore = useAuthStore();
const router = useRouter();

// Estado reativo
const nome = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const aceitaTermos = ref(false);

// Computed
const isFormValid = computed(() => {
  return (
    nome.value.length >= 2 &&
    isValidEmail(email.value) &&
    password.value.length >= 6 &&
    password.value === confirmPassword.value &&
    aceitaTermos.value
  );
});

// Methods
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleCadastro = async () => {
  if (!isFormValid.value) return;

  const resultado = await authStore.signUp(
    email.value,
    password.value,
    nome.value
  );

  if (resultado.data && !resultado.error) {
    // Redirecionar para login ou home dependendo da confirmação de email
    router.push("/login");
  }
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.layout {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
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
      circle at 30% 20%,
      rgba(255, 107, 53, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 70% 80%,
      rgba(102, 126, 234, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 20% 70%,
      rgba(240, 147, 251, 0.08) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.cadastro-page {
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
  animation: bounce 2s ease-in-out infinite;
}

.game-title {
  font-family: "Press Start 2P", cursive;
  font-size: 2.5rem;
  color: #ffd700;
  text-shadow: 2px 2px 0px #ff6b35, 4px 4px 0px #764ba2,
    6px 6px 10px rgba(0, 0, 0, 0.3);
  margin: 10px 0 5px 0;
  letter-spacing: 3px;
}

.game-subtitle {
  color: #f8f9fa;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.cadastro-card {
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 3px solid #667eea;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(102, 126, 234, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #ff6b35 0%, #f093fb 100%);
  color: white;
  text-align: center;
  padding: 25px 20px;
  margin: 0;
}

.header-subtitle {
  margin: 8px 0 0 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.card-content {
  padding: 30px;
}

.cadastro-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-field {
  font-size: 1rem;
}

.input-field :deep(.q-field__control) {
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.input-field :deep(.q-field__control):hover {
  border-color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.terms-checkbox {
  margin-top: 10px;
  font-size: 0.9rem;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.cadastro-btn,
.login-btn {
  border-radius: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.cadastro-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.cadastro-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.login-btn {
  border: 2px solid #f093fb;
  color: #f093fb;
}

.login-btn:hover {
  background: #f093fb;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(240, 147, 251, 0.4);
}

.card-footer {
  background: rgba(248, 250, 252, 0.8);
  padding: 25px;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
}

.benefits-title {
  font-weight: bold;
  font-size: 1rem;
  color: #374151;
  margin-bottom: 15px;
  text-align: center;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 12px 24px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@media (max-width: 600px) {
  .game-title {
    font-size: 1.8rem;
    letter-spacing: 2px;
  }

  .cadastro-card {
    margin: 0 10px;
  }

  .benefits-list {
    gap: 10px;
  }

  .card-content {
    padding: 20px;
  }
}
</style>
