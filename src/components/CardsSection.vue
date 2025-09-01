<template>
  <div class="cards-section">
    <!-- Barra de progresso da coleção -->
    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-label acampja-subtitle">Progresso da Arca</span>
        <span class="progress-percentage"
          >{{ cartasStore.estatisticas.percentual_completo }}%</span
        >
      </div>
      <div class="acampja-progress">
        <div
          class="acampja-progress-bar"
          :style="{ width: cartasStore.estatisticas.percentual_completo + '%' }"
        ></div>
      </div>
    </div>

    <!-- Grid de animais -->
    <div class="cards-grid">
      <AnimalCard
        v-for="carta in cartasOrdenadas"
        :key="carta.id"
        :id="'carta-' + carta.id"
        :animal="mapearCartaParaAnimal(carta)"
        :class="[
          'card-item acampja-card-hover',
          {
            acquired: cartasStore.verificarCartaObtida(carta.id),
            rotate: carta.rotate,
            'active-rotate': activeCarta === carta.id,
          },
        ]"
      />
    </div>
  </div>
</template>

<script setup>
import { useCartasStore } from "@/stores/cartas";
import { computed } from "vue";
import AnimalCard from "./AnimalCard.vue";

// Props
const props = defineProps({
  activeCarta: {
    type: [String, Number],
    default: null,
  },
});

// Stores
const cartasStore = useCartasStore();

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
const mapearCartaParaAnimal = (carta) => {
  return {
    id: carta.id,
    name: carta.nome,
    image: carta.foto_url || "/img/default-avatar.jpg",
    acquired: cartasStore.verificarCartaObtida(carta.id),
    code: carta.codigo_unico,
    raridade: carta.raridade,
    pontos: carta.pontos_valor,
    habitat: carta.descricao || "Animal da Arca",
  };
};
</script>

<style scoped>
.cards-section {
  margin-top: 20px;
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

.acampja-progress {
  height: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 20px;
  overflow: hidden;
}

.acampja-progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--acampja-primary),
    var(--acampja-secondary)
  );
  border-radius: 20px;
  position: relative;
  transition: width 0.8s ease;
}

.acampja-progress-bar::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: progress-shine 2s ease-in-out infinite;
}

@keyframes progress-shine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
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
  animation: acampja-bounce 4s ease-in-out;
}

@keyframes acampja-bounce {
  0%,
  100% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.15) translateY(-10px);
  }
}

/* Efeitos hover para cards */
.acampja-card-hover {
  transition: all 0.3s ease;
}

.acampja-card-hover:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* Animações de entrada das cartas */
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
  box-shadow: 0 0 30px rgba(243, 156, 18, 0.3);
}

.card-item[data-rarity="epico"] {
  box-shadow: 0 0 20px rgba(155, 89, 182, 0.3);
}

.card-item[data-rarity="raro"] {
  box-shadow: 0 0 15px rgba(52, 152, 219, 0.3);
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .progress-section {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .progress-header {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .progress-label {
    font-size: 1rem;
  }

  .progress-percentage {
    font-size: 1.1rem;
  }
}
</style>
