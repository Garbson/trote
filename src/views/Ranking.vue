<template>
  <q-layout view="hHh lpR fFf" class="layout">
    <q-header elevated class="header">
      <q-toolbar>
        <q-btn flat icon="arrow_back" @click="$router.go(-1)" />
        <q-toolbar-title class="header-title">
          🏆 Ranking de Colecionadores
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="page">
        <div class="ranking-container">
          <!-- Estatísticas Gerais -->
          <q-card class="stats-card" v-if="rankingStore.estatisticasGerais">
            <q-card-section>
              <div class="text-h6 text-center q-mb-md">
                📊 Estatísticas Gerais
              </div>
              <div class="stats-grid">
                <div class="stat-item">
                  <q-icon name="people" size="lg" color="blue" />
                  <div>
                    <div class="stat-value">
                      {{ rankingStore.estatisticasGerais.total_usuarios }}
                    </div>
                    <div class="stat-label">Colecionadores</div>
                  </div>
                </div>
                <div class="stat-item">
                  <q-icon name="collections" size="lg" color="green" />
                  <div>
                    <div class="stat-value">
                      {{ rankingStore.estatisticasGerais.media_cartas }}
                    </div>
                    <div class="stat-label">Média de Cartas</div>
                  </div>
                </div>
                <div class="stat-item">
                  <q-icon name="stars" size="lg" color="yellow" />
                  <div>
                    <div class="stat-value">
                      {{ rankingStore.estatisticasGerais.media_pontos }}
                    </div>
                    <div class="stat-label">Média de Pontos</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Minha Posição -->
          <q-card
            v-if="authStore.isAuthenticated && rankingStore.minhaPosicao"
            class="my-position-card"
          >
            <q-card-section>
              <div class="text-h6 text-center q-mb-md">🎯 Minha Posição</div>
              <div class="my-position">
                <div class="position-badge">
                  #{{ rankingStore.minhaPosicao }}
                </div>
                <div class="position-details">
                  <div>{{ authStore.user?.nome }}</div>
                  <div class="position-stats">
                    {{ authStore.user?.pontos_totais }} pontos •
                    {{ cartasStore.estatisticas.total_cartas }} cartas •
                    {{ cartasStore.estatisticas.percentual_completo }}% completo
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Ranking com Paginação -->
          <q-card class="ranking-card">
            <q-card-section>
              <div class="ranking-header">
                <div class="text-h6 text-center">
                  🏆 Ranking de Colecionadores
                </div>
                <div class="ranking-info">
                  Página {{ rankingStore.currentPage }} de {{ rankingStore.totalPages }}
                  ({{ rankingStore.ranking.length }} colecionadores)
                </div>
              </div>

              <div v-if="rankingStore.loading" class="loading-container">
                <q-spinner-dots size="50px" color="primary" />
                <p>Carregando ranking...</p>
              </div>

              <div
                v-else-if="rankingStore.ranking.length === 0"
                class="empty-state"
              >
                <q-icon name="emoji_events" size="80px" color="grey-5" />
                <p>Nenhum colecionador encontrado</p>
              </div>

              <div v-else>
                <!-- Botão para ir à minha posição -->
                <div
                  v-if="authStore.isAuthenticated && rankingStore.minhaPosicao"
                  class="my-position-controls q-mb-md"
                >
                  <q-btn
                    color="primary"
                    icon="my_location"
                    label="Ir para minha posição"
                    @click="rankingStore.goToMyPosition"
                    size="sm"
                    outline
                  />
                  <div class="current-position">
                    Você está na posição #{{ rankingStore.minhaPosicao }}
                  </div>
                </div>

                <div class="ranking-list">
                  <div
                    v-for="(usuario, index) in rankingStore.paginatedRanking"
                    :key="usuario.usuario_id"
                    :class="[
                      'ranking-item',
                      {
                        'first-place': usuario.posicao === 1,
                        'second-place': usuario.posicao === 2,
                        'third-place': usuario.posicao === 3,
                        'my-rank': authStore.user?.id === usuario.usuario_id,
                      },
                    ]"
                  >
                  <div class="rank-position">
                    <div class="position-number">
                      {{ usuario.posicao }}
                    </div>
                    <q-icon
                      v-if="usuario.posicao <= 3"
                      :name="getMedalIcon(usuario.posicao - 1)"
                      :color="getMedalColor(usuario.posicao - 1)"
                      size="md"
                    />
                  </div>

                  <div class="user-info">
                    <div class="user-name">{{ usuario.nome }}</div>
                    <div class="user-stats">
                      <span class="stat">
                        <q-icon name="stars" size="sm" />
                        {{ usuario.pontos_totais }} pts
                      </span>
                      <span class="stat">
                        <q-icon name="collections" size="sm" />
                        {{ usuario.total_cartas }} cartas
                      </span>
                      <span class="stat">
                        <q-icon name="trending_up" size="sm" />
                        Nível {{ usuario.nivel }}
                      </span>
                    </div>
                  </div>

                  <div class="rarities">
                    <div
                      v-if="usuario.cartas_lendarias > 0"
                      class="rarity-badge legendary"
                    >
                      {{ usuario.cartas_lendarias }}
                    </div>
                    <div
                      v-if="usuario.cartas_epicas > 0"
                      class="rarity-badge epic"
                    >
                      {{ usuario.cartas_epicas }}
                    </div>
                    <div
                      v-if="usuario.cartas_raras > 0"
                      class="rarity-badge rare"
                    >
                      {{ usuario.cartas_raras }}
                    </div>
                  </div>
                </div>

                <!-- Controles de Paginação -->
                <div v-if="rankingStore.totalPages > 1" class="pagination-controls">
                  <q-btn
                    icon="chevron_left"
                    color="primary"
                    outline
                    :disable="rankingStore.currentPage === 1"
                    @click="rankingStore.previousPage"
                    label="Anterior"
                  />

                  <div class="page-indicators">
                    <q-btn
                      v-for="page in getVisiblePages()"
                      :key="page"
                      :label="page"
                      :color="page === rankingStore.currentPage ? 'primary' : 'grey'"
                      :outline="page !== rankingStore.currentPage"
                      @click="rankingStore.setPage(page)"
                      size="sm"
                      class="page-btn"
                    />
                  </div>

                  <q-btn
                    icon-right="chevron_right"
                    color="primary"
                    outline
                    :disable="rankingStore.currentPage === rankingStore.totalPages"
                    @click="rankingStore.nextPage"
                    label="Próximo"
                  />
                </div>
              </div>
            </div>
            </q-card-section>
          </q-card>

          <!-- Minha Coleção -->
          <q-card v-if="authStore.isAuthenticated" class="collection-card">
            <q-card-section>
              <div class="text-h6 text-center q-mb-md">📚 Minha Coleção</div>

              <div class="collection-progress">
                <q-circular-progress
                  :value="cartasStore.estatisticas.percentual_completo"
                  size="100px"
                  :thickness="0.1"
                  color="primary"
                  track-color="grey-3"
                  class="q-ma-md"
                >
                  {{ cartasStore.estatisticas.percentual_completo }}%
                </q-circular-progress>

                <div class="collection-details">
                  <div class="detail-item">
                    <q-icon name="collections" color="blue" />
                    <span
                      >{{ cartasStore.estatisticas.total_cartas }}/{{
                        cartasStore.estatisticas.total_disponiveis
                      }}
                      cartas</span
                    >
                  </div>
                  <div class="detail-item">
                    <q-icon name="circle" color="grey" />
                    <span
                      >{{ cartasStore.estatisticas.cartas_comuns }} comuns</span
                    >
                  </div>
                  <div class="detail-item">
                    <q-icon name="circle" color="blue" />
                    <span
                      >{{ cartasStore.estatisticas.cartas_raras }} raras</span
                    >
                  </div>
                  <div class="detail-item">
                    <q-icon name="circle" color="purple" />
                    <span
                      >{{ cartasStore.estatisticas.cartas_epicas }} épicas</span
                    >
                  </div>
                  <div class="detail-item">
                    <q-icon name="circle" color="orange" />
                    <span
                      >{{
                        cartasStore.estatisticas.cartas_lendarias
                      }}
                      lendárias</span
                    >
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>

    <!-- Floating Action Button -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="refresh"
        color="primary"
        @click="atualizarDados"
        :loading="rankingStore.loading"
      />
    </q-page-sticky>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useCartasStore } from "@/stores/cartas";
import { useRankingStore } from "@/stores/ranking";
import { onMounted } from "vue";

// Stores
const authStore = useAuthStore();
const cartasStore = useCartasStore();
const rankingStore = useRankingStore();

// Methods
const getMedalIcon = (index) => {
  const icons = ["emoji_events", "workspace_premium", "military_tech"];
  return icons[index] || "emoji_events";
};

const getMedalColor = (index) => {
  const colors = ["amber", "grey-5", "deep-orange"];
  return colors[index] || "primary";
};

const atualizarDados = async () => {
  await Promise.all([
    rankingStore.fetchRanking(),
    authStore.isAuthenticated
      ? cartasStore.fetchCartasUsuario()
      : Promise.resolve(),
    authStore.isAuthenticated
      ? rankingStore.fetchMinhaColecao()
      : Promise.resolve(),
  ]);
};

const getVisiblePages = () => {
  const current = rankingStore.currentPage;
  const total = rankingStore.totalPages;
  const pages = [];

  if (total <= 7) {
    // Se há 7 páginas ou menos, mostrar todas
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Sempre mostrar primeira página
    pages.push(1);

    // Calcular range ao redor da página atual
    let start = Math.max(2, current - 2);
    let end = Math.min(total - 1, current + 2);

    // Adicionar "..." se necessário
    if (start > 2) {
      pages.push('...');
    }

    // Adicionar páginas ao redor da atual
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) {
        pages.push(i);
      }
    }

    // Adicionar "..." se necessário
    if (end < total - 1) {
      pages.push('...');
    }

    // Sempre mostrar última página
    if (total > 1) {
      pages.push(total);
    }
  }

  return pages;
};

// Lifecycle
onMounted(async () => {
  await atualizarDados();
});
</script>

<style scoped>
.layout {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.header {
  background: rgba(0, 0, 0, 0.8);
}

.header-title {
  font-weight: bold;
  font-size: 1.2rem;
}

.page {
  padding: 20px;
}

.ranking-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-card,
.ranking-card,
.my-position-card,
.collection-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.stat-label {
  font-size: 0.9rem;
  color: #7f8c8d;
}

.my-position {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.position-badge {
  font-size: 2rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 16px;
  border-radius: 50%;
  min-width: 60px;
  text-align: center;
}

.position-details {
  flex: 1;
}

.position-stats {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 4px;
}

.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.02);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.ranking-item:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.ranking-item.my-rank {
  background: rgba(102, 126, 234, 0.1);
  border-color: #667eea;
}

.ranking-item.first-place {
  background: linear-gradient(
    45deg,
    rgba(255, 193, 7, 0.1),
    rgba(255, 235, 59, 0.1)
  );
}

.ranking-item.second-place {
  background: linear-gradient(
    45deg,
    rgba(158, 158, 158, 0.1),
    rgba(189, 189, 189, 0.1)
  );
}

.ranking-item.third-place {
  background: linear-gradient(
    45deg,
    rgba(255, 87, 34, 0.1),
    rgba(255, 152, 0, 0.1)
  );
}

.rank-position {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 60px;
}

.position-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 4px;
}

.user-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.rarities {
  display: flex;
  gap: 8px;
}

.rarity-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.rarity-badge.legendary {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
}

.rarity-badge.epic {
  background: linear-gradient(45deg, #667eea, #764ba2);
}

.rarity-badge.rare {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
}

.collection-progress {
  display: flex;
  align-items: center;
  gap: 24px;
}

.collection-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.loading-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px;
  color: #7f8c8d;
}

/* ===== HEADER DO RANKING ===== */
.ranking-header {
  margin-bottom: 20px;
}

.ranking-info {
  text-align: center;
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-top: 8px;
}

/* ===== CONTROLES DA MINHA POSIÇÃO ===== */
.my-position-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.current-position {
  font-size: 0.9rem;
  color: #667eea;
  font-weight: 600;
}

/* ===== CONTROLES DE PAGINAÇÃO ===== */
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 20px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.page-indicators {
  display: flex;
  gap: 8px;
  align-items: center;
}

.page-btn {
  min-width: 40px;
  height: 36px;
}

@media (max-width: 600px) {
  .collection-progress {
    flex-direction: column;
    text-align: center;
  }

  .user-stats {
    flex-direction: column;
    gap: 8px;
  }

  .my-position {
    flex-direction: column;
    text-align: center;
  }

  .my-position-controls {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 16px;
  }

  .page-indicators {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
