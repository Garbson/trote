<template>
  <q-card :class="['clash-card-container', { acquired }, pokemon.raridade]">
    <!-- Brilho da raridade -->
    <div
      v-if="acquired && pokemon.raridade"
      :class="['rarity-glow', pokemon.raridade]"
    ></div>

    <!-- Header da carta -->
    <q-card-section class="card-header">
      <div class="card-title clash-subtitle">{{ pokemon.name }}</div>
      <div
        v-if="pokemon.raridade"
        :class="['raridade-badge', 'rarity-' + pokemon.raridade]"
      >
        {{ formatarRaridade(pokemon.raridade) }}
      </div>
    </q-card-section>

    <!-- Container da imagem -->
    <div class="card-image-container">
      <q-img
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

      <!-- Overlay para cartas não obtidas -->
      <div v-if="!acquired" class="mystery-overlay">
        <div class="mystery-content">
          <q-icon
            name="help_outline"
            size="60px"
            color="white"
            class="clash-pulse"
          />
          <div class="mystery-text">Carta Misteriosa</div>
        </div>
      </div>

      <!-- Indicador de level/pontos -->
      <div v-if="acquired" class="level-indicator">
        <q-icon name="star" size="sm" />
        <span>{{ pokemon.pontos || 10 }}</span>
      </div>
    </div>

    <!-- Footer da carta -->
    <q-card-section class="card-footer">
      <div v-if="acquired" class="card-info">
        <div class="info-text">
          <q-icon name="school" size="sm" color="primary" />
          <span>{{ pokemon.acao }}</span>
        </div>

        <div class="card-stats">
          <div class="stat-row">
            <div class="stat-item">
              <q-icon name="stars" size="sm" color="amber" />
              <span>{{ pokemon.pontos || 10 }} pts</span>
            </div>
            <div v-if="pokemon.raridade" class="stat-item">
              <q-icon
                name="diamond"
                size="sm"
                :color="getRaridadeColor(pokemon.raridade)"
              />
              <span>{{ formatarRaridade(pokemon.raridade) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="mystery-footer">
        <div class="unlock-hint">
          <q-icon name="lock" size="sm" />
          <span>Digite o código para revelar</span>
        </div>
        <div class="rarity-hint" v-if="pokemon.raridade">
          <div :class="['rarity-dot', pokemon.raridade]"></div>
          <span>{{ formatarRaridade(pokemon.raridade) }}</span>
        </div>
      </div>
    </q-card-section>

    <!-- Efeitos especiais para carta lendária -->
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
import { computed } from "vue";

// Props
const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
});

// Computed
const acquired = computed(() => props.pokemon.acquired || false);

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
</script>

<style scoped>
.clash-card-container {
  height: auto;
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

/* Bordas de raridade */
.clash-card-container.comum {
  border-color: var(--cr-common);
  box-shadow: 0 4px 20px rgba(168, 168, 168, 0.2);
}

.clash-card-container.raro {
  border-color: var(--cr-rare);
  box-shadow: 0 4px 20px rgba(74, 144, 226, 0.3);
}

.clash-card-container.epico {
  border-color: var(--cr-epic);
  box-shadow: 0 4px 20px rgba(156, 39, 176, 0.3);
}

.clash-card-container.lendario {
  border-color: var(--cr-legendary);
  box-shadow: 0 4px 25px rgba(255, 149, 0, 0.4);
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

/* Efeito hover */
.clash-card-container:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Cards não obtidas */
.clash-card-container:not(.acquired) {
  background: linear-gradient(135deg, #2c3e50, #34495e);
  color: white;
  border-color: #7f8c8d;
}

.clash-card-container:not(.acquired):hover {
  border-color: var(--cr-gold);
  box-shadow: 0 8px 30px rgba(255, 215, 0, 0.2);
}

/* Header da carta */
.card-header {
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

.clash-card-container:not(.acquired) .card-title {
  color: white;
}

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

/* Container da imagem */
.card-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
}

.clash-card-container:hover .card-image {
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

/* Overlay misteriosa */
.mystery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(44, 62, 80, 0.95),
    rgba(52, 73, 94, 0.95)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.card-footer {
  padding: 12px 16px 16px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-text {
  color: #2d2d2d;
  font-size: 0.9rem;
  line-height: 1.3;
}

.pokemon-card:not(.acquired) .info-text {
  color: rgba(255, 255, 255, 0.8);
}

.card-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #2d2d2d;
}

.pokemon-card:not(.acquired) .stat-item {
  color: rgba(255, 255, 255, 0.8);
}

.mystery-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  margin-top: 8px;
}

.rarity-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  z-index: 1;
}

.rarity-border.comum {
  background: linear-gradient(90deg, #9e9e9e, #757575);
}

.rarity-border.raro {
  background: linear-gradient(90deg, #2196f3, #1976d2);
}

.rarity-border.epico {
  background: linear-gradient(90deg, #9c27b0, #7b1fa2);
}

.rarity-border.lendario {
  background: linear-gradient(90deg, #ff9800, #f57c00, #ff5722);
  animation: legendary-border 3s ease-in-out infinite;
}

@keyframes legendary-border {
  0%,
  100% {
    background: linear-gradient(90deg, #ff9800, #f57c00, #ff5722);
  }
  50% {
    background: linear-gradient(90deg, #ff5722, #ff9800, #f57c00);
  }
}

strong {
  color: #d32f2f;
}

.pokemon-card:not(.acquired) strong {
  color: #ff6b6b;
}

/* Responsividade */
@media (max-width: 600px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .raridade-badge {
    align-self: flex-start;
  }

  .card-image-container {
    height: 150px;
  }
}

/* Estados especiais */
.pokemon-card.rotate {
  animation: rotate-card 4s ease-in-out;
}

.pokemon-card.active-rotate {
  z-index: 1000;
  transform: scale(1.1);
}

@keyframes rotate-card {
  0% {
    transform: rotateY(0deg) scale(1);
  }
  25% {
    transform: rotateY(180deg) scale(1.15);
  }
  50% {
    transform: rotateY(360deg) scale(1);
  }
  75% {
    transform: rotateY(540deg) scale(1.15);
  }
  100% {
    transform: rotateY(720deg) scale(1);
  }
}

.mystery-content {
  text-align: center;
  color: white;
}

.mystery-text {
  margin-top: 12px;
  font-weight: bold;
  font-size: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Indicador de level */
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

/* Footer da carta */
.card-footer {
  padding: 16px 20px 20px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-text {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--cr-blue-dark);
  font-size: 0.95rem;
  font-weight: 500;
}

.clash-card-container:not(.acquired) .info-text {
  color: rgba(255, 255, 255, 0.8);
}

.card-stats {
  margin-top: 8px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: var(--cr-blue-dark);
  font-weight: 500;
  padding: 6px 10px;
  background: rgba(74, 144, 226, 0.1);
  border-radius: 12px;
  flex: 1;
  justify-content: center;
}

.clash-card-container:not(.acquired) .stat-item {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
}

/* Footer misteriosa */
.mystery-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.unlock-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

.rarity-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}

.rarity-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.rarity-dot.comum {
  background: var(--cr-common);
}
.rarity-dot.raro {
  background: var(--cr-rare);
}
.rarity-dot.epico {
  background: var(--cr-epic);
}
.rarity-dot.lendario {
  background: var(--cr-legendary);
  animation: dot-glow 1.5s ease-in-out infinite alternate;
}

@keyframes dot-glow {
  from {
    box-shadow: 0 0 5px rgba(255, 149, 0, 0.5);
  }
  to {
    box-shadow: 0 0 15px rgba(255, 149, 0, 1);
  }
}

/* Efeitos especiais para lendárias */
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

/* Brilho da raridade */
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

/* Responsividade */
@media (max-width: 600px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .raridade-badge {
    align-self: flex-start;
  }

  .card-image-container {
    height: 160px;
  }

  .stat-row {
    flex-direction: column;
    gap: 8px;
  }
}

/* Animações de entrada */
.clash-card-container {
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

/* Estados especiais */
.clash-card-container.rotate {
  animation: clash-card-flip 4s ease-in-out;
}

.clash-card-container.active-rotate {
  z-index: 1000;
  transform: scale(1.15);
}

@keyframes clash-card-flip {
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
</style>
