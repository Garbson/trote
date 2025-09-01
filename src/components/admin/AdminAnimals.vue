<template>
  <div class="animals-content">
    <div class="page-header">
      <h3 class="page-title">🦁 Gerenciar Animais da Arca</h3>
      <p class="page-subtitle">Adicione, edite e remova animais da coleção</p>
    </div>

    <!-- Formulário de adição -->
    <q-card class="add-form-card">
      <q-card-section>
        <h5 class="form-title">➕ Adicionar Novo Animal</h5>
        <div class="form-grid">
          <q-input
            v-model="novaAnimal.nome"
            label="Nome do Animal"
            outlined
            dense
            placeholder="Ex: Leão Dourado"
            class="form-input"
          >
            <template v-slot:prepend>
              <q-icon name="pets" />
            </template>
          </q-input>

          <q-select
            v-model="novaAnimal.raridade"
            :options="raridadeOptions"
            label="Raridade"
            outlined
            dense
            emit-value
            map-options
            class="form-input"
          >
            <template v-slot:prepend>
              <q-icon name="star" />
            </template>
          </q-select>

          <q-input
            v-model.number="novaAnimal.pontos_valor"
            label="Pontos"
            type="number"
            outlined
            dense
            min="1"
            class="form-input"
          >
            <template v-slot:prepend>
              <q-icon name="stars" />
            </template>
          </q-input>

          <q-input
            v-model="novaAnimal.codigo_unico"
            label="Código Único"
            outlined
            dense
            placeholder="Ex: LEO001"
            class="form-input"
          >
            <template v-slot:prepend>
              <q-icon name="qr_code" />
            </template>
          </q-input>

          <q-input
            v-model="novaAnimal.descricao"
            label="Habitat"
            outlined
            dense
            placeholder="Ex: Savana Africana"
            class="form-input"
          >
            <template v-slot:prepend>
              <q-icon name="nature" />
            </template>
          </q-input>

          <q-input
            v-model="novaAnimal.foto_url"
            label="URL da Imagem"
            outlined
            dense
            placeholder="https://..."
            class="form-input"
          >
            <template v-slot:prepend>
              <q-icon name="image" />
            </template>
          </q-input>
        </div>

        <div class="form-actions">
          <q-btn
            @click="$emit('add-animal', novaAnimal)"
            :loading="loading"
            color="primary"
            icon="add"
            label="Adicionar Animal"
            size="md"
            class="add-btn"
          />
          <q-btn
            @click="resetForm"
            flat
            color="grey"
            icon="refresh"
            label="Limpar"
            size="md"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela de animais -->
    <q-card class="animals-table-card">
      <q-card-section>
        <div class="table-header">
          <h5 class="table-title">📋 Lista de Animais</h5>
          <q-btn
            @click="$emit('refresh-animals')"
            flat
            round
            icon="refresh"
            color="primary"
            :loading="loading"
          >
            <q-tooltip>Atualizar lista</q-tooltip>
          </q-btn>
        </div>

        <q-table
          :rows="animals"
          :columns="columns"
          :loading="loading"
          row-key="id"
          :rows-per-page-options="[10, 25, 50]"
          class="animals-table"
        >
          <template v-slot:body-cell-imagem="props">
            <q-td :props="props">
              <q-avatar size="40px">
                <q-img :src="props.value || '/img/default-avatar.jpg'" />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-raridade="props">
            <q-td :props="props">
              <q-chip
                :color="getRaridadeColor(props.value)"
                text-color="white"
                size="sm"
                :icon="getRaridadeIcon(props.value)"
              >
                {{ formatRaridade(props.value) }}
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
                icon="edit"
                color="primary"
                size="sm"
                @click="$emit('edit-animal', props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                icon="delete"
                color="negative"
                size="sm"
                @click="$emit('delete-animal', props.row)"
              >
                <q-tooltip>Excluir</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { reactive } from "vue";

// Props
const props = defineProps({
  animals: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits([
  "add-animal",
  "edit-animal",
  "delete-animal",
  "refresh-animals",
]);

// Estado local
const novaAnimal = reactive({
  nome: "",
  raridade: "comum",
  pontos_valor: 10,
  codigo_unico: "",
  descricao: "",
  foto_url: "",
  ativo: true,
});

// Opções
const raridadeOptions = [
  { label: "Comum", value: "comum" },
  { label: "Raro", value: "raro" },
  { label: "Épico", value: "epico" },
  { label: "Lendário", value: "lendario" },
];

// Colunas da tabela
const columns = [
  {
    name: "imagem",
    label: "Imagem",
    field: "foto_url",
    align: "center",
    sortable: false,
  },
  {
    name: "nome",
    label: "Nome",
    field: "nome",
    align: "left",
    sortable: true,
  },
  {
    name: "raridade",
    label: "Raridade",
    field: "raridade",
    align: "center",
    sortable: true,
  },
  {
    name: "pontos",
    label: "Pontos",
    field: "pontos_valor",
    align: "center",
    sortable: true,
  },
  {
    name: "codigo",
    label: "Código",
    field: "codigo_unico",
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
const resetForm = () => {
  Object.assign(novaAnimal, {
    nome: "",
    raridade: "comum",
    pontos_valor: 10,
    codigo_unico: "",
    descricao: "",
    foto_url: "",
    ativo: true,
  });
};

const getRaridadeColor = (raridade) => {
  const colors = {
    comum: "grey",
    raro: "blue",
    epico: "purple",
    lendario: "orange",
  };
  return colors[raridade] || "grey";
};

const getRaridadeIcon = (raridade) => {
  const icons = {
    comum: "radio_button_unchecked",
    raro: "star_half",
    epico: "star",
    lendario: "stars",
  };
  return icons[raridade] || "radio_button_unchecked";
};

const formatRaridade = (raridade) => {
  const labels = {
    comum: "Comum",
    raro: "Raro",
    epico: "Épico",
    lendario: "Lendário",
  };
  return labels[raridade] || raridade;
};
</script>

<style scoped>
.animals-content {
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

.add-form-card,
.animals-table-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.form-title,
.table-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--arca-wood);
  margin: 0 0 20px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.form-input {
  width: 100%;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

.add-btn {
  background: linear-gradient(135deg, var(--arca-wood), var(--arca-gold));
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.animals-table {
  border-radius: 8px;
}

@media (max-width: 768px) {
  .animals-content {
    padding: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>
