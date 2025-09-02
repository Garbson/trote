<template>
  <div class="users-content">
    <div class="page-header">
      <h3 class="page-title">👥 Gerenciar Acampistas</h3>
      <p class="page-subtitle">Visualize e gerencie os usuários do sistema</p>
    </div>

    <!-- Filtros e Busca -->
    <q-card class="filters-card">
      <q-card-section>
        <div class="filters-grid">
          <q-input
            v-model="searchTerm"
            label="Buscar acampista"
            outlined
            dense
            placeholder="Nome, email ou telefone..."
            clearable
            @input="$emit('search', searchTerm)"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-select
            v-model="statusFilter"
            :options="statusOptions"
            label="Status"
            outlined
            dense
            emit-value
            map-options
            @update:model-value="$emit('filter-status', statusFilter)"
          >
            <template v-slot:prepend>
              <q-icon name="filter_list" />
            </template>
          </q-select>

          <q-btn
            @click="$emit('refresh-users')"
            color="primary"
            icon="refresh"
            label="Atualizar"
            :loading="loading"
            class="refresh-btn"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Estatísticas Rápidas -->
    <div class="users-stats">
      <q-card class="stat-card">
        <q-card-section class="stat-content">
          <q-icon name="people" size="32px" color="primary" />
          <div class="stat-info">
            <div class="stat-number">{{ totalUsers }}</div>
            <div class="stat-label">Total</div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="stat-card">
        <q-card-section class="stat-content">
          <q-icon name="check_circle" size="32px" color="green" />
          <div class="stat-info">
            <div class="stat-number">{{ activeUsers }}</div>
            <div class="stat-label">Ativos</div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="stat-card">
        <q-card-section class="stat-content">
          <q-icon name="stars" size="32px" color="amber" />
          <div class="stat-info">
            <div class="stat-number">{{ topCollectors }}</div>
            <div class="stat-label">Top Coletores</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Tabela de Usuários -->
    <q-card class="users-table-card">
      <q-card-section>
        <div class="table-header">
          <h5 class="table-title">📋 Lista de Acampistas</h5>
          <div class="table-actions">
            <q-btn
              @click="$emit('export-users')"
              flat
              icon="file_download"
              color="primary"
              label="Exportar"
            >
              <q-tooltip>Exportar dados dos usuários</q-tooltip>
            </q-btn>
          </div>
        </div>

        <q-table
          :rows="users"
          :columns="columns"
          :loading="loading"
          row-key="id"
          :rows-per-page-options="[10, 25, 50, 100]"
          :pagination="{ rowsPerPage: 25 }"
          class="users-table"
        >
          <template v-slot:body-cell-nome="props">
            <q-td :props="props">
              <div class="user-info">
                <q-avatar size="32px">
                  <q-icon name="person" />
                </q-avatar>
                <div class="user-details">
                  <div class="user-name">{{ props.value }}</div>
                  <div class="user-email">{{ props.row.email }}</div>
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-nivel="props">
            <q-td :props="props">
              <q-chip
                :color="getLevelColor(props.value)"
                text-color="white"
                size="sm"
                icon="trending_up"
              >
                Nível {{ props.value || 1 }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-pontos="props">
            <q-td :props="props">
              <div class="points-display">
                <q-icon name="stars" color="amber" size="sm" />
                <span class="points-value">{{ props.value || 0 }}</span>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-admin="props">
            <q-td :props="props">
              <q-chip
                :color="props.value ? 'purple' : 'grey'"
                text-color="white"
                size="sm"
                :icon="props.value ? 'admin_panel_settings' : 'person'"
              >
                {{ props.value ? "Admin" : "Usuário" }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                :color="props.value ? 'green' : 'grey'"
                text-color="white"
                size="sm"
                :icon="props.value ? 'check_circle' : 'radio_button_unchecked'"
              >
                {{ props.value ? "Ativo" : "Inativo" }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                icon="visibility"
                color="primary"
                size="sm"
                @click="$emit('view-user', props.row)"
              >
                <q-tooltip>Ver detalhes</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                icon="edit"
                color="orange"
                size="sm"
                @click="$emit('edit-user', props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                :icon="props.row.ativo ? 'block' : 'check_circle'"
                :color="props.row.ativo ? 'negative' : 'green'"
                size="sm"
                @click="$emit('toggle-user-status', props.row)"
              >
                <q-tooltip>{{
                  props.row.ativo ? "Desativar" : "Ativar"
                }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

// Props
const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  totalAnimals: {
    type: Number,
    default: 0,
  },
});

// Emits
const emit = defineEmits([
  "search",
  "filter-status",
  "refresh-users",
  "export-users",
  "view-user",
  "edit-user",
  "toggle-user-status",
]);

// Estado local
const searchTerm = ref("");
const statusFilter = ref("todos");

// Opções
const statusOptions = [
  { label: "Todos", value: "todos" },
  { label: "Ativos", value: true },
  { label: "Inativos", value: false },
];

// Computed
const totalUsers = computed(() => props.users.length);
const activeUsers = computed(
  () => props.users.filter((user) => user.ativo).length
);
const topCollectors = computed(
  () => props.users.filter((user) => user.pontos_totais > 1000).length
);

// Colunas da tabela
const columns = [
  {
    name: "nome",
    label: "Usuário",
    field: "nome",
    align: "left",
    sortable: true,
  },
  {
    name: "email",
    label: "Email",
    field: "email",
    align: "left",
    sortable: true,
  },
  {
    name: "nivel",
    label: "Nível",
    field: "nivel",
    align: "center",
    sortable: true,
  },
  {
    name: "pontos",
    label: "Pontos",
    field: "pontos_totais",
    align: "center",
    sortable: true,
  },
  {
    name: "admin",
    label: "Admin",
    field: "is_admin",
    align: "center",
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    field: "ativo",
    align: "center",
    sortable: true,
  },
  {
    name: "actions",
    label: "Ações",
    field: "actions",
    align: "center",
    sortable: false,
  },
];

// Methods
const getLevelColor = (level) => {
  if (level >= 10) return "purple";
  if (level >= 7) return "orange";
  if (level >= 4) return "blue";
  return "green";
};
</script>

<style scoped>
.users-content {
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

.filters-card,
.users-table-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.filters-grid {
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: 16px;
  align-items: end;
}

.refresh-btn {
  background: linear-gradient(135deg, var(--arca-wood), var(--arca-gold));
  color: white;
}

.users-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--arca-wood);
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--arca-wood);
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  text-align: left;
}

.user-name {
  font-weight: 500;
  color: #2c3e50;
}

.user-email {
  font-size: 0.85rem;
  color: #6c757d;
}

.points-display {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}

.points-value {
  font-weight: 500;
  color: var(--arca-wood);
}

.progress-circle {
  position: relative;
}

.progress-text {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--arca-wood);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@media (max-width: 768px) {
  .users-content {
    padding: 16px;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .users-stats {
    grid-template-columns: 1fr;
  }

  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .user-info {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
}
</style>
