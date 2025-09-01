<template>
  <q-card
    :class="[
      'acampja-card-container',
      { acquired },
      pokemon.raridade,
      {
        unlocking: isUnlocking,
        'just-unlocked': justUnlocked,
      },
    ]"
  >
    <!-- Efeito de desbloqueio -->
    <div v-if="isUnlocking" class="unlock-animation">
      <div class="unlock-flash"></div>
      <div class="unlock-particles">
        <div
          v-for="i in 12"
          :key="i"
          class="particle"
          :style="getParticleStyle(i)"
        ></div>
      </div>
      <div class="unlock-text">
        <div class="unlock-message">CARTA DESBLOQUEADA!</div>
        <div class="unlock-rarity">
          {{ formatarRaridade(pokemon.raridade) }}
        </div>
      </div>
    </div>

    <!-- Brilho da raridade - APENAS se obtida -->
    <div
      v-if="acquired && pokemon.raridade"
      :class="['rarity-glow', pokemon.raridade]"
    ></div>

    <!-- Header da carta -->
    <q-card-section class="card-header">
      <!-- Nome só aparece se a carta foi obtida -->
      <div class="card-title acampja-subtitle">
        {{ acquired ? pokemon.name : "???" }}
      </div>

      <!-- Badge de raridade só aparece se obtida -->
      <div
        v-if="acquired && pokemon.raridade"
        :class="['raridade-badge', 'rarity-' + pokemon.raridade]"
      >
        {{ formatarRaridade(pokemon.raridade) }}
      </div>

      <!-- Hint de raridade para cartas não obtidas -->
      <div v-if="!acquired && pokemon.raridade" class="mystery-rarity-badge">
        <div :class="['rarity-dot-badge', pokemon.raridade]"></div>
      </div>
    </q-card-section>

    <!-- Container da imagem -->
    <div class="card-image-container">
      <!-- Imagem real - APENAS se carta foi obtida -->
      <q-img
        v-if="acquired"
        :src="pokemon.image"
        class="card-image"
        :loading="false"
        fit="cover"
      >
        <template v-slot:error>
          <div class="image-placeholder">
            <q-icon name="person" size="60px" color="grey-5" />
          </div>
        </template>
      </q-img>

      <!-- Overlay misteriosa - APENAS se não obtida -->
      <div v-if="!acquired" class="mystery-overlay">
        <div class="mystery-content">
          <q-icon
            name="help_outline"
            size="80px"
            color="white"
            class="acampja-pulse"
          />
          <div class="mystery-text">Carta Misteriosa</div>
          <div class="mystery-subtitle">Digite o código para revelar</div>
        </div>
      </div>

      <!-- Indicador de pontos - APENAS se obtida -->
      <div v-if="acquired" class="level-indicator">
        <q-icon name="star" size="sm" />
        <span>{{ pokemon.pontos || 10 }}</span>
      </div>
    </div>

    <!-- Footer da carta -->
    <q-card-section class="card-footer">
      <!-- Informações completas - APENAS se obtida -->
      <div v-if="acquired" class="card-info">
        <div class="info-row">
          <div class="info-item">
            <q-icon name="school" size="sm" color="primary" />
            <span class="info-label">Descrição:</span>
            <span class="info-value">{{ pokemon.curso || "Acampista da Arena" }}</span>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-chip">
            <q-icon name="stars" size="sm" />
            <span>{{ pokemon.pontos || 10 }} pts</span>
          </div>
          <div class="stat-chip rarity-chip" :class="pokemon.raridade">
            <q-icon name="diamond" size="sm" />
            <span>{{ formatarRaridade(pokemon.raridade) }}</span>
          </div>
        </div>
      </div>

      <!-- Footer misteriosa - APENAS se não obtida -->
      <div v-else class="mystery-footer">
        <div class="unlock-instruction">
          <div class="instruction-icon">
            <q-icon name="qr_code" size="lg" color="gold" />
          </div>
          <div class="instruction-content">
            <div class="instruction-title">Como desbloquear:</div>
            <div class="instruction-text">
              Encontre o calouro no campus e digite o código da placa
            </div>
          </div>
        </div>

        <div class="rarity-info">
          <div :class="['rarity-indicator', pokemon.raridade]"></div>
          <span>{{ formatarRaridade(pokemon.raridade) }}</span>
        </div>
      </div>
    </q-card-section>

    <!-- Efeitos especiais para carta lendária - APENAS se obtida -->
    <div
      v-if="acquired && pokemon.raridade === 'lendario'"
      class="legendary-effects"
    >
      <div class="legendary-sparkle"></div>
      <div class="legendary-ring"></div>
    </div>
  </q-card>
</template>

<script setup>
import { computed, ref, watch } from "vue";

// Props
const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
});

// Emits
const emit = defineEmits(["carta-desbloqueada"]);

// Estado da animação
const isUnlocking = ref(false);
const justUnlocked = ref(false);

// Computed
const acquired = computed(() => props.pokemon.acquired || false);

// Watch para detectar quando a carta é desbloqueada
watch(acquired, (newValue, oldValue) => {
  if (!oldValue && newValue) {
    // Carta foi desbloqueada!
    playUnlockAnimation();
  }
});

// Methods
const formatarRaridade = (raridade) => {
  const raridades = {
    comum: "Comum",
    raro: "Raro",
    epico: "Épico",
    lendario: "Lendário",
  };
  return raridades[raridade] || raridade;
};

const getRaridadeColor = (raridade) => {
  const cores = {
    comum: "grey-6",
    raro: "blue",
    epico: "purple",
    lendario: "orange",
  };
  return cores[raridade] || "grey";
};

const playUnlockAnimation = () => {

  isUnlocking.value = true;

  // Emitir evento para o componente pai
  emit("carta-desbloqueada", props.pokemon.id);

  // Duração da animação principal
  setTimeout(() => {
    isUnlocking.value = false;
    justUnlocked.value = true;

    // Remover efeito de "recém desbloqueada" após um tempo
    setTimeout(() => {
      justUnlocked.value = false;
    }, 2000);
  }, 3000);
};

const getParticleStyle = (index) => {
  const angle = (360 / 12) * index;
  const radius = 100 + (index % 3) * 20;

  return {
    "--angle": `${angle}deg`,
    "--radius": `${radius}px`,
    "--delay": `${index * 0.1}s`,
    "--color": getParticleColor(props.pokemon.raridade),
  };
};

const getParticleColor = (raridade) => {
  const colors = {
    comum: "#a8a8a8",
    raro: "#4a90e2",
    epico: "#9c27b0",
    lendario: "#ff9500",
  };
  return colors[raridade] || "#4a90e2";
};

// Método público para trigger manual (se necessário)
const triggerUnlock = () => {
  playUnlockAnimation();
};

defineExpose({
  triggerUnlock,
});
</script>

<style scoped>
/* ===== ESTRUTURA PRINCIPAL ===== */
.acampja-card-container {
  height: 680px; /* Altura fixa para todos os cards */
  display: flex;
  flex-direction: column;
  background: var(--cr-bg-card);
  border-radius: 16px;
  transition: all 0.4s ease;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  border: 3px solid transparent;
  backdrop-filter: blur(10px);
}

/* ===== BACKGROUNDS POR RARIDADE (CARDS DESBLOQUEADOS) ===== */
.acampja-card-container.acquired.comum {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(168, 168, 168, 0.1)
  );
}

.acampja-card-container.acquired.raro {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(74, 144, 226, 0.15)
  );
}

.acampja-card-container.acquired.epico {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(156, 39, 176, 0.15)
  );
}

.acampja-card-container.acquired.lendario {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(255, 149, 0, 0.2)
  );
}

/* ===== BORDAS DE RARIDADE ===== */
.acampja-card-container.comum {
  border-color: var(--cr-common);
  box-shadow: 0 4px 20px rgba(168, 168, 168, 0.985);
}

.acampja-card-container.raro {
  border-color: var(--cr-rare);
  box-shadow: 0 4px 20px rgb(74, 145, 226);
}

.acampja-card-container.epico {
  border-color: var(--cr-epic);
  box-shadow: 0 4px 20px rgba(95, 14, 109, 0.787);
}

.acampja-card-container.epico {
  border-color: var(--cr-epic);
  box-shadow: 0 4px 20px rgba(95, 14, 109, 0.787);
}

.acampja-card-container.lendario {
  border-color: var(--cr-legendary);
  box-shadow: 0 4px 25px rgba(255, 149, 0, 0.787);
  animation: legendary-border-glow 3s ease-in-out infinite;
}

@keyframes legendary-border-glow {
  0%,
  100% {
    box-shadow: 0 4px 25px rgba(255, 149, 0, 0.4);
  }
  50% {
    box-shadow: 0 6px 35px rgba(255, 149, 0, 0.6);
  }
}

/* ===== EFEITO HOVER ===== */
.acampja-card-container:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* ===== CARDS NÃO OBTIDAS ===== */
.acampja-card-container:not(.acquired) {
  background: linear-gradient(
    135deg,
    rgba(30, 60, 114, 0.9),
    rgba(44, 62, 80, 0.9)
  );
  color: white;
  border-color: #6c757d;
}

.acampja-card-container:not(.acquired):hover {
  border-color: var(--cr-gold);
  box-shadow: 0 8px 30px rgba(255, 215, 0, 0.3);
  transform: translateY(-4px) scale(1.02);
}

/* ===== HEADER DA CARTA ===== */
.card-header {
  flex: 0 0 auto; /* Não cresce */
  padding: 16px 20px 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
}

.card-title {
  color: var(--cr-blue-dark);
  font-weight: bold;
  font-size: 1.1rem;
  line-height: 1.2;
  flex: 1;
  margin: 0;
}

.acampja-card-container:not(.acquired) .card-title {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.3rem;
  text-align: center;
  letter-spacing: 3px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* ===== BADGES DE RARIDADE ===== */
.raridade-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.rarity-comum {
  background: linear-gradient(135deg, var(--cr-common), #7f7f7f);
}

.rarity-raro {
  background: linear-gradient(135deg, var(--cr-rare), #1e3c72);
}

.rarity-epico {
  background: linear-gradient(135deg, var(--cr-epic), #7b1fa2);
}

.rarity-lendario {
  background: linear-gradient(135deg, var(--cr-legendary), #ff6b00);
  animation: legendary-badge-glow 2s ease-in-out infinite alternate;
}

@keyframes legendary-badge-glow {
  from {
    box-shadow: 0 2px 8px rgba(255, 149, 0, 0.4);
  }
  to {
    box-shadow: 0 4px 16px rgba(255, 149, 0, 0.8);
  }
}

/* ===== MYSTERY RARITY BADGE ===== */
.mystery-rarity-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

.rarity-dot-badge {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-shadow: 0 0 10px currentColor;
}

.rarity-dot-badge.comum {
  background: var(--cr-common);
}
.rarity-dot-badge.raro {
  background: var(--cr-rare);
}
.rarity-dot-badge.epico {
  background: var(--cr-epic);
}
.rarity-dot-badge.lendario {
  background: var(--cr-legendary);
  animation: legendary-dot-glow 2s ease-in-out infinite alternate;
}

@keyframes legendary-dot-glow {
  from {
    box-shadow: 0 0 10px rgba(255, 149, 0, 0.5);
    transform: scale(1);
  }
  to {
    box-shadow: 0 0 20px rgba(255, 149, 0, 1);
    transform: scale(1.1);
  }
}

/* ===== CONTAINER DA IMAGEM ===== */
.card-image-container {
  flex: 1; /* Ocupa o espaço disponível */
  position: relative;
  overflow: hidden;
  min-height: 180px; /* Altura mínima para a imagem */
}

.card-image {
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
}

.acampja-card-container:hover .card-image {
  transform: scale(1.08);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ecf0f1, #bdc3c7);
}

/* ===== OVERLAY MISTERIOSA ===== */
.mystery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(30, 60, 114, 0.95),
    rgba(44, 62, 80, 0.95)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.mystery-content {
  text-align: center;
  color: white;
  padding: 20px;
}

.mystery-text {
  margin-top: 15px;
  font-weight: bold;
  font-size: 1.2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.mystery-subtitle {
  margin-top: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
}

/* ===== INDICADOR DE LEVEL ===== */
.level-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, var(--cr-gold), #ffa000);
  color: white;
  padding: 6px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* ===== FOOTER DA CARTA ===== */
.card-footer {
  flex: 0 0 auto; /* Não cresce */
  padding: 16px 20px 20px 20px;
  min-height: 80px; /* Altura mínima para o footer */
  display: flex;
  flex-direction: column;
}

/* ===== CARD INFO (DESBLOQUEADO) ===== */
.card-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  justify-content: space-between;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(74, 144, 226, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
}

.info-label {
  font-weight: 600;
  color: var(--cr-blue-dark);
  min-width: 50px;
}

.info-value {
  color: #2c3e50;
  flex: 1;
}

.stats-row {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}

.stat-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgb(143, 130, 130);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  flex: 1;
  justify-content: center;
}

.rarity-chip.comum {
  background: rgb(53, 219, 89);
}
.rarity-chip.raro {
  background: rgb(5, 101, 211);
}
.rarity-chip.epico {
  background: rgb(155, 39, 176);
}
.rarity-chip.lendario {
  background: rgba(255, 149, 0, 0.845);
}

/* ===== MYSTERY FOOTER ===== */
.mystery-footer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  justify-content: space-between;
}

.unlock-instruction {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  align-items: flex-start;
}

.instruction-content {
  flex: 1;
}

.instruction-title {
  font-weight: bold;
  color: #ffd700;
  font-size: 0.9rem;
  margin-bottom: 6px;
}

.instruction-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.3;
}

.rarity-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}

.rarity-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

.rarity-indicator.comum {
  background: var(--cr-common);
}
.rarity-indicator.raro {
  background: var(--cr-rare);
}
.rarity-indicator.epico {
  background: var(--cr-epic);
}
.rarity-indicator.lendario {
  background: var(--cr-legendary);
  animation: legendary-pulse 2s ease-in-out infinite;
}

@keyframes legendary-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* ===== BRILHO DA RARIDADE ===== */
.rarity-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  z-index: 1;
}

.rarity-glow.comum {
  background: linear-gradient(90deg, var(--cr-common), #7f7f7f);
}

.rarity-glow.raro {
  background: linear-gradient(90deg, var(--cr-rare), #1e3c72);
}

.rarity-glow.epico {
  background: linear-gradient(90deg, var(--cr-epic), #7b1fa2);
}

.rarity-glow.lendario {
  background: linear-gradient(90deg, var(--cr-legendary), #ff6b00, #ff5722);
  animation: legendary-top-glow 3s ease-in-out infinite;
}

@keyframes legendary-top-glow {
  0%,
  100% {
    background: linear-gradient(90deg, #ff9500, #ff6b00, #ff5722);
  }
  50% {
    background: linear-gradient(90deg, #ff5722, #ff9500, #ff6b00);
  }
}

/* ===== EFEITOS ESPECIAIS PARA LENDÁRIAS ===== */
.legendary-effects {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.legendary-sparkle {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, #fff, transparent);
  border-radius: 50%;
  animation: sparkle-float 3s ease-in-out infinite;
}

.legendary-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ring-pulse 4s ease-in-out infinite;
}

@keyframes sparkle-float {
  0%,
  100% {
    transform: translateY(0px) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-15px) scale(1.3);
    opacity: 1;
  }
}

@keyframes ring-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.1;
  }
}

/* ===== ANIMAÇÕES DE DESBLOQUEIO ===== */
.unlock-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  animation: unlock-fade-in 0.3s ease-out;
}

@keyframes unlock-fade-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.unlock-flash {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #fff, #ffeb3b, #fff);
  opacity: 0;
  animation: flash-effect 0.5s ease-out;
}

@keyframes flash-effect {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0;
  }
}

.unlock-particles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--color);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--color);
  animation: particle-burst 2s ease-out var(--delay);
}

@keyframes particle-burst {
  0% {
    transform: rotate(var(--angle)) translateX(0) scale(0);
    opacity: 1;
  }
  50% {
    transform: rotate(var(--angle)) translateX(var(--radius)) scale(1);
    opacity: 1;
  }
  100% {
    transform: rotate(var(--angle)) translateX(calc(var(--radius) * 1.5))
      scale(0);
    opacity: 0;
  }
}

.unlock-text {
  text-align: center;
  color: white;
  z-index: 10;
  animation: text-appear 1s ease-out 0.5s both;
}

@keyframes text-appear {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.unlock-message {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  animation: glow-text 1s ease-in-out infinite alternate;
}

@keyframes glow-text {
  from {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 10px #ffeb3b;
  }
  to {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px #ffeb3b,
      0 0 30px #ffeb3b;
  }
}

.unlock-rarity {
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* ===== ESTADO PÓS-DESBLOQUEIO ===== */
.acampja-card-container.just-unlocked {
  animation: celebration 2s ease-out;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
}

@keyframes celebration {
  0%,
  100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.05) rotate(1deg);
  }
  75% {
    transform: scale(1.05) rotate(-1deg);
  }
}

/* ===== EFEITO DE DESBLOQUEIO EM PROGRESSO ===== */
.acampja-card-container.unlocking {
  transform: scale(1.1);
  z-index: 999;
  transition: all 0.3s ease;
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 600px) {
  .acampja-card-container {
    height: 680px; /* Altura um pouco menor em mobile */
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .raridade-badge {
    align-self: flex-start;
  }

  .card-image-container {
    min-height: 160px;
  }

  .stats-row {
    flex-direction: column;
    gap: 8px;
  }

  .unlock-message {
    font-size: 1.4rem;
  }

  .unlock-rarity {
    font-size: 1rem;
  }

  .instruction-text {
    font-size: 0.75rem;
  }

  .mystery-text {
    font-size: 1rem;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-label {
    min-width: auto;
    font-size: 0.8rem;
  }
}

/* ===== ANIMAÇÕES DE ENTRADA ===== */
.acampja-card-container {
  animation: card-enter 0.6s ease-out;
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ===== ESTADOS ESPECIAIS ===== */
.acampja-card-container.rotate {
  animation: acampja-card-flip 4s ease-in-out;
}

.acampja-card-container.active-rotate {
  z-index: 1000;
  transform: scale(1.15);
}

@keyframes acampja-card-flip {
  0% {
    transform: rotateY(0deg) scale(1);
  }
  25% {
    transform: rotateY(180deg) scale(1.1);
  }
  50% {
    transform: rotateY(360deg) scale(1);
  }
  75% {
    transform: rotateY(540deg) scale(1.1);
  }
  100% {
    transform: rotateY(720deg) scale(1);
  }
}

/* ===== AJUSTES FINAIS PARA CARDS NÃO OBTIDAS ===== */
.acampja-card-container:not(.acquired) .info-item,
.acampja-card-container:not(.acquired) .stat-chip {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
}
</style>
