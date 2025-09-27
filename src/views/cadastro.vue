<template>
  <q-layout class="layout">
    <q-page-container>
      <q-page class="cadastro-page">
        <!-- Logo/Título -->
        <div class="game-logo">
          <q-icon name="shield" size="60px" color="amber" />
          <h1 class="game-title">ARCA DE NOÉ</h1>
          <p class="game-subtitle">Junte-se à Arca</p>
        </div>

        <!-- Card de Cadastro -->
        <q-card class="cadastro-card">
          <q-card-section class="card-header">
            <div class="text-h5 text-center">🏆 Criar Conta</div>
            <p class="header-subtitle">Torne-se um Colecionador da Arca</p>
          </q-card-section>

          <q-card-section class="card-content">
            <q-form @submit.prevent="handleCadastro" class="cadastro-form">
              <q-input
                v-model="nome"
                label="Nome de Explorador"
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
                label="Aceito os termos e condições da Arca"
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

                <div class="divider">
                  <span>ou</span>
                </div>

                <q-btn
                  size="lg"
                  class="google-btn"
                  :loading="authStore.googleLoading"
                  @click="handleGoogleSignup"
                  no-caps
                >
                  <div class="google-btn-content">
                    <svg class="google-logo" viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span class="google-btn-text">Cadastrar com Google</span>
                  </div>
                </q-btn>

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
            <div class="benefits-title">
              🐾 Benefícios de Colecionador da Arca:
            </div>
            <div class="benefits-list">
              <div class="benefit-item">
                <q-icon name="collections" color="purple" />
                <span>Colecione cartas únicas dos animais</span>
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

const handleGoogleSignup = async () => {
  const result = await authStore.signInWithGoogle();

  // Se o cadastro/login Google foi bem-sucedido, redirecionar
  if (result && !result.error) {
    // Aguardar um momento para garantir que o auth state foi atualizado
    setTimeout(() => {
      if (authStore.isAuthenticated) {
        router.push('/');
      }
    }, 500);
  }
};

const goToLogin = () => {
  router.push("/login");
};
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
  background: linear-gradient(135deg, var(--arca-wood), var(--arca-gold));
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
  background: linear-gradient(135deg, var(--arca-wood), var(--arca-gold));
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
