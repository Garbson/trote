<template>
  <q-layout class="landing-layout">
    <q-page-container>
      <q-page class="landing-page">
        <!-- Hero Section Simplificado -->
        <div class="hero-section">
          <div class="game-logo">
            <q-icon name="auto_awesome" size="80px" color="amber" />
            <h1 class="game-title">ARCA DE NOÉ</h1>
            <p class="game-subtitle">Coleção de Animais Lendários</p>
          </div>

          <!-- Botões de Ação -->
          <div class="action-buttons">
            <q-btn
              label="Entrar"
              size="lg"
              class="action-btn login-btn"
              @click="$router.push('/login')"
            />
            <q-btn
              label="Criar Conta"
              size="lg"
              class="action-btn signup-btn"
              @click="$router.push('/cadastro')"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Esta é a landing page pública
</script>

<style scoped>
.landing-layout {
  background: linear-gradient(
    135deg,
    var(--arca-wood) 0%,
    var(--arca-gold) 50%,
    var(--arca-green) 100%
  );
  min-height: 100vh;
}

.landing-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.hero-section {
  text-align: center;
  max-width: 500px;
}

.game-logo {
  margin-bottom: 40px;
  animation: float 3s ease-in-out infinite;
}

.game-title {
  font-family: "Press Start 2P", cursive;
  font-size: 2.5rem;
  color: #ffd700;
  text-shadow: 2px 2px 0px #ff6b35, 4px 4px 0px #d63031,
    6px 6px 10px rgba(0, 0, 0, 0.3);
  margin: 20px 0 10px 0;
  letter-spacing: 3px;
}

.game-subtitle {
  color: #f8f9fa;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 50px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.action-btn {
  border-radius: 25px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 15px 40px;
  transition: all 0.3s ease;
  width: 250px;
}

.login-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
}

.signup-btn {
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  border: none;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

@keyframes float {
  0%, 100% {
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

  .action-btn {
    width: 200px;
  }
}
</style>