<template>
  <div class="dashboard-content">
    <div class="page-header">
      <h3 class="page-title">📊 Dashboard Administrativo</h3>
      <p class="page-subtitle">Visão geral do sistema Arca de Noé</p>
    </div>

    <!-- Cards de Estatísticas -->
    <div class="stats-grid">
      <q-card class="stat-card" :class="{ 'loading-card': loading }">
        <q-card-section class="stat-content">
          <div class="stat-icon">
            <q-icon name="pets" size="40px" color="primary" />
          </div>
          <div class="stat-info">
            <div class="stat-number">
              <q-skeleton v-if="loading" type="text" width="60px" />
              <span v-else>{{ stats.totalCartas || 0 }}</span>
            </div>
            <div class="stat-label">Total de Animais</div>
            <div class="stat-sublabel">
              {{ stats.cartasAtivas || 0 }} ativos
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="stat-card" :class="{ 'loading-card': loading }">
        <q-card-section class="stat-content">
          <div class="stat-icon">
            <q-icon name="people" size="40px" color="green" />
          </div>
          <div class="stat-info">
            <div class="stat-number">
              <q-skeleton v-if="loading" type="text" width="60px" />
              <span v-else>{{ stats.totalUsuarios || 0 }}</span>
            </div>
            <div class="stat-label">Acampistas</div>
            <div class="stat-sublabel">
              {{ stats.usuariosAtivos || 0 }} ativos
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="stat-card" :class="{ 'loading-card': loading }">
        <q-card-section class="stat-content">
          <div class="stat-icon">
            <q-icon name="trending_up" size="40px" color="orange" />
          </div>
          <div class="stat-info">
            <div class="stat-number">
              <q-skeleton v-if="loading" type="text" width="60px" />
              <span v-else>{{ stats.codigos_usados || 0 }}</span>
            </div>
            <div class="stat-label">Códigos Usados</div>
            <div class="stat-sublabel">Animais coletados</div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="stat-card" :class="{ 'loading-card': loading }">
        <q-card-section class="stat-content">
          <div class="stat-icon">
            <q-icon name="star" size="40px" color="amber" />
          </div>
          <div class="stat-info">
            <div class="stat-number">
              <q-skeleton v-if="loading" type="text" width="60px" />
              <span v-else>{{ stats.cartas_lendarias || 0 }}</span>
            </div>
            <div class="stat-label">Animais Lendários</div>
            <div class="stat-sublabel">Mais raros da arca</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Ações Rápidas -->
    <div class="quick-actions">
      <h4 class="section-title">🚀 Ações Rápidas</h4>
      <div class="actions-grid">
        <q-btn
          @click="$emit('add-animal')"
          color="primary"
          icon="add"
          label="Novo Animal"
          size="lg"
          class="action-btn"
        />
        <q-btn
          @click="$emit('refresh-stats')"
          color="green"
          icon="refresh"
          label="Atualizar Stats"
          size="lg"
          class="action-btn"
          :loading="loading"
        />
        <q-btn
          @click="$emit('export-data')"
          color="orange"
          icon="file_download"
          label="Exportar Dados"
          size="lg"
          class="action-btn"
        />
      </div>
    </div>

    <!-- Atividade Recente -->
    <div class="recent-activity">
      <h4 class="section-title">📈 Atividade Recente</h4>
      <q-card class="activity-card">
        <q-card-section>
          <q-list>
            <q-item
              v-for="(activity, index) in recentActivities"
              :key="index"
              class="activity-item"
            >
              <q-item-section avatar>
                <q-icon :name="activity.icon" :color="activity.color" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ activity.title }}</q-item-label>
                <q-item-label caption>{{ activity.description }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>{{ activity.time }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

// Props
const props = defineProps({
  stats: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["add-animal", "refresh-stats", "export-data"]);

// Computed
const recentActivities = computed(() => [
  {
    icon: "pets",
    color: "primary",
    title: "Novo animal adicionado",
    description: 'Animal lendário "Leão Dourado" foi criado',
    time: "há 2h",
  },
  {
    icon: "person_add",
    color: "green",
    title: "Novo acampista registrado",
    description: "João Silva se registrou no sistema",
    time: "há 3h",
  },
  {
    icon: "code",
    color: "orange",
    title: "Código utilizado",
    description: "Código ABC123 foi usado por Maria",
    time: "há 4h",
  },
]);
</script>

<style scoped>
.dashboard-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--arca-wood);
  margin: 0 0 8px 0;
}

.page-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--arca-wood);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 1rem;
  font-weight: 500;
  color: #495057;
  margin-bottom: 2px;
}

.stat-sublabel {
  font-size: 0.875rem;
  color: #6c757d;
}

.section-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--arca-wood);
  margin: 0 0 16px 0;
}

.quick-actions {
  margin-bottom: 32px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.action-btn {
  height: 60px;
  border-radius: 12px;
  font-size: 1rem;
}

.recent-activity {
  margin-bottom: 32px;
}

.activity-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.activity-item {
  border-radius: 8px;
  margin-bottom: 8px;
}

.activity-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
