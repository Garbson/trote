<template>
  <q-layout view="lHh Lpr lFf" class="admin-layout">
    <!-- Header -->
    <q-header elevated class="admin-header">
      <q-toolbar>
        <q-avatar size="40px" class="admin-avatar">
          <q-icon name="admin_panel_settings" color="white" />
        </q-avatar>

        <q-toolbar-title class="admin-title">
          🛡️ Painel Administrativo - BIXO ROYALE
        </q-toolbar-title>

        <q-btn flat round icon="logout" color="white" @click="logout" size="md">
          <q-tooltip>Sair</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :width="280"
      :breakpoint="400"
      bordered
      class="admin-drawer"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item-label header class="drawer-header">
            📊 Painel de Controle
          </q-item-label>

          <q-item
            clickable
            v-ripple
            :active="activeTab === 'dashboard'"
            @click="activeTab = 'dashboard'"
            class="drawer-item"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="activeTab === 'cartas'"
            @click="activeTab = 'cartas'"
            class="drawer-item"
          >
            <q-item-section avatar>
              <q-icon name="collections" />
            </q-item-section>
            <q-item-section>Gerenciar Cartas</q-item-section>
            <q-item-section side>
              <q-badge color="primary" :label="cartas.length" />
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="activeTab === 'usuarios'"
            @click="activeTab = 'usuarios'"
            class="drawer-item"
          >
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>
            <q-item-section>Usuários</q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            :active="activeTab === 'estatisticas'"
            @click="activeTab = 'estatisticas'"
            class="drawer-item"
          >
            <q-item-section avatar>
              <q-icon name="analytics" />
            </q-item-section>
            <q-item-section>Estatísticas</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <q-page class="admin-page">
        <!-- Dashboard Tab -->
        <div v-if="activeTab === 'dashboard'" class="dashboard-content">
          <div class="page-header">
            <h3 class="page-title">📊 Dashboard Administrativo</h3>
            <p class="page-subtitle">Visão geral do sistema BIXO ROYALE</p>
          </div>

          <div class="stats-grid">
            <q-card class="stat-card">
              <q-card-section class="stat-content">
                <div class="stat-icon">
                  <q-icon name="collections" size="40px" color="primary" />
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ cartas.length }}</div>
                  <div class="stat-label">Total de Cartas</div>
                </div>
              </q-card-section>
            </q-card>

            <q-card class="stat-card">
              <q-card-section class="stat-content">
                <div class="stat-icon">
                  <q-icon name="people" size="40px" color="green" />
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ usuarios.length }}</div>
                  <div class="stat-label">Usuários Ativos</div>
                </div>
              </q-card-section>
            </q-card>

            <q-card class="stat-card">
              <q-card-section class="stat-content">
                <div class="stat-icon">
                  <q-icon name="trending_up" size="40px" color="orange" />
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ codigosUsados }}</div>
                  <div class="stat-label">Códigos Usados</div>
                </div>
              </q-card-section>
            </q-card>

            <q-card class="stat-card">
              <q-card-section class="stat-content">
                <div class="stat-icon">
                  <q-icon name="star" size="40px" color="amber" />
                </div>
                <div class="stat-info">
                  <div class="stat-number">{{ cartasLendarias }}</div>
                  <div class="stat-label">Cartas Lendárias</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Gerenciar Cartas Tab -->
        <div v-if="activeTab === 'cartas'" class="cartas-content">
          <div class="page-header">
            <h3 class="page-title">🃏 Gerenciar Cartas</h3>
            <q-btn
              color="primary"
              icon="add"
              label="Nova Carta"
              @click="openCartaDialog()"
              class="action-btn"
            />
          </div>

          <!-- Filtros -->
          <q-card class="filters-card">
            <q-card-section>
              <div class="filters-row">
                <q-input
                  v-model="filtro.busca"
                  placeholder="Buscar por nome..."
                  outlined
                  dense
                  class="search-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>

                <q-select
                  v-model="filtro.raridade"
                  :options="raridadeOptions"
                  placeholder="Filtrar por raridade"
                  outlined
                  dense
                  clearable
                  class="filter-select"
                />

                <q-select
                  v-model="filtro.curso"
                  :options="cursoOptions"
                  placeholder="Filtrar por curso"
                  outlined
                  dense
                  clearable
                  class="filter-select"
                />
              </div>
            </q-card-section>
          </q-card>

          <!-- Tabela de Cartas -->
          <q-card class="table-card">
            <q-table
              :rows="cartasFiltradas"
              :columns="cartasColumns"
              row-key="id"
              :pagination="pagination"
              :loading="loading"
              class="admin-table"
            >
              <template v-slot:body-cell-imagem="props">
                <q-td :props="props">
                  <q-avatar size="50px" rounded>
                    <img :src="props.value || '/img/default-avatar.jpg'" />
                  </q-avatar>
                </q-td>
              </template>

              <template v-slot:body-cell-raridade="props">
                <q-td :props="props">
                  <q-badge
                    :color="getRaridadeColor(props.value)"
                    :label="props.value"
                    class="raridade-badge"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-codigo="props">
                <q-td :props="props">
                  <q-chip
                    :label="props.value"
                    color="grey-8"
                    text-color="white"
                    icon="key"
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-acoes="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    round
                    icon="edit"
                    color="primary"
                    size="sm"
                    @click="openCartaDialog(props.row)"
                  >
                    <q-tooltip>Editar</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    round
                    icon="delete"
                    color="negative"
                    size="sm"
                    @click="confirmarDelete(props.row)"
                  >
                    <q-tooltip>Excluir</q-tooltip>
                  </q-btn>
                </q-td>
              </template>
            </q-table>
          </q-card>
        </div>

        <!-- Outras tabs aqui... -->
      </q-page>
    </q-page-container>

    <!-- Dialog para Criar/Editar Carta -->
    <q-dialog v-model="cartaDialog" persistent>
      <q-card class="carta-dialog">
        <q-card-section class="dialog-header">
          <div class="text-h6">
            {{ cartaEditando ? "✏️ Editar Carta" : "➕ Nova Carta" }}
          </div>
        </q-card-section>

        <q-card-section class="dialog-content">
          <q-form
            ref="cartaForm"
            @submit.prevent="salvarCarta"
            class="carta-form"
          >
            <div class="form-row">
              <q-input
                v-model="cartaData.nome"
                label="Nome do Calouro *"
                outlined
                :rules="[(val) => !!val || 'Nome é obrigatório']"
                class="form-field"
              />

              <q-input
                v-model="cartaData.codigo_unico"
                label="Código Único *"
                outlined
                :rules="[(val) => !!val || 'Código é obrigatório']"
                class="form-field"
              />
            </div>

            <div class="form-row">
              <q-select
                v-model="cartaData.curso"
                :options="cursoOptions"
                label="Curso *"
                outlined
                :rules="[(val) => !!val || 'Curso é obrigatório']"
                class="form-field"
              />

              <q-input
                v-model="cartaData.ano_ingresso"
                label="Ano de Ingresso *"
                type="number"
                outlined
                :rules="[(val) => !!val || 'Ano é obrigatório']"
                class="form-field"
              />
            </div>

            <div class="form-row">
              <q-select
                v-model="cartaData.raridade"
                :options="raridadeOptions"
                label="Raridade *"
                outlined
                :rules="[(val) => !!val || 'Raridade é obrigatória']"
                class="form-field"
              />

              <q-input
                v-model="cartaData.pontos_valor"
                label="Pontos *"
                type="number"
                outlined
                :rules="[(val) => !!val || 'Pontos são obrigatórios']"
                class="form-field"
              />
            </div>

            <q-input
              v-model="cartaData.descricao"
              label="Descrição"
              type="textarea"
              outlined
              rows="3"
              class="form-field full-width"
            />

            <!-- Upload de Imagem -->
            <div class="image-section">
              <div class="image-preview">
                <q-avatar size="120px" rounded class="preview-avatar">
                  <img
                    v-if="cartaData.foto_url"
                    :src="cartaData.foto_url"
                    alt="Preview"
                  />
                  <q-icon v-else name="person" size="60px" color="grey-5" />
                </q-avatar>
              </div>

              <div class="image-controls">
                <q-file
                  v-model="imagemFile"
                  accept="image/*"
                  outlined
                  label="Selecionar Imagem"
                  @update:model-value="handleImageUpload"
                  class="image-upload"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>

                <q-input
                  v-model="cartaData.foto_url"
                  label="URL da Imagem"
                  outlined
                  placeholder="https://exemplo.com/imagem.jpg"
                  class="url-input"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="dialog-actions">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn
            label="Salvar"
            color="primary"
            @click="salvarCarta"
            :loading="salvandoCarta"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de Confirmação para Deletar -->
    <q-dialog v-model="deleteDialog">
      <q-card class="delete-dialog">
        <q-card-section class="dialog-header">
          <div class="text-h6">🗑️ Confirmar Exclusão</div>
        </q-card-section>

        <q-card-section>
          <p>
            Tem certeza que deseja excluir a carta
            <strong>{{ cartaParaDeletar?.nome }}</strong
            >?
          </p>
          <p class="text-caption text-grey-6">
            Esta ação não pode ser desfeita.
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn
            label="Excluir"
            color="negative"
            @click="deletarCarta"
            :loading="deletandoCarta"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { useQuasar } from "quasar";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

// Composables
const router = useRouter();
const $q = useQuasar();

// Estado
const leftDrawerOpen = ref(false);
const activeTab = ref("dashboard");
const loading = ref(false);
const cartaDialog = ref(false);
const deleteDialog = ref(false);
const cartaEditando = ref(null);
const cartaParaDeletar = ref(null);
const salvandoCarta = ref(false);
const deletandoCarta = ref(false);
const imagemFile = ref(null);

// Dados
const cartas = ref([
  {
    id: 1,
    nome: "João Silva",
    curso: "Sistemas de Informação",
    ano_ingresso: 2024,
    raridade: "comum",
    pontos_valor: 10,
    codigo_unico: "SI001",
    foto_url: "/img/default-avatar.jpg",
    descricao: "Calouro dedicado aos estudos",
  },
  {
    id: 2,
    nome: "Maria Santos",
    curso: "Engenharia da Computação",
    ano_ingresso: 2024,
    raridade: "raro",
    pontos_valor: 25,
    codigo_unico: "EC002",
    foto_url: "/img/default-avatar.jpg",
    descricao: "Especialista em algoritmos",
  },
]);

const usuarios = ref([
  { id: 1, nome: "Admin", email: "admin@bixo.com" },
  { id: 2, nome: "Usuário 1", email: "user1@bixo.com" },
]);

const cartaData = ref({
  nome: "",
  curso: "",
  ano_ingresso: new Date().getFullYear(),
  raridade: "",
  pontos_valor: 10,
  codigo_unico: "",
  foto_url: "",
  descricao: "",
});

// Filtros
const filtro = ref({
  busca: "",
  raridade: null,
  curso: null,
});

// Opções
const raridadeOptions = [
  { label: "Comum", value: "comum" },
  { label: "Raro", value: "raro" },
  { label: "Épico", value: "epico" },
  { label: "Lendário", value: "lendario" },
];

const cursoOptions = [
  "Sistemas de Informação",
  "Engenharia da Computação",
  "Ciência da Computação",
  "Análise e Desenvolvimento de Sistemas",
];

// Configuração da tabela
const cartasColumns = [
  {
    name: "imagem",
    label: "Foto",
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
    name: "curso",
    label: "Curso",
    field: "curso",
    align: "left",
    sortable: true,
  },
  {
    name: "ano",
    label: "Ano",
    field: "ano_ingresso",
    align: "center",
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
    sortable: false,
  },
  {
    name: "acoes",
    label: "Ações",
    field: "acoes",
    align: "center",
    sortable: false,
  },
];

const pagination = ref({
  sortBy: "nome",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

// Computed
const cartasFiltradas = computed(() => {
  let resultado = cartas.value;

  if (filtro.value.busca) {
    resultado = resultado.filter((carta) =>
      carta.nome.toLowerCase().includes(filtro.value.busca.toLowerCase())
    );
  }

  if (filtro.value.raridade) {
    resultado = resultado.filter(
      (carta) => carta.raridade === filtro.value.raridade.value
    );
  }

  if (filtro.value.curso) {
    resultado = resultado.filter((carta) => carta.curso === filtro.value.curso);
  }

  return resultado;
});

const codigosUsados = computed(() => {
  return Math.floor(cartas.value.length * 0.7); // Simulação
});

const cartasLendarias = computed(() => {
  return cartas.value.filter((carta) => carta.raridade === "lendario").length;
});

// Methods
const logout = () => {
  router.push("/login");
};

const openCartaDialog = (carta = null) => {
  cartaEditando.value = carta;

  if (carta) {
    cartaData.value = { ...carta };
  } else {
    cartaData.value = {
      nome: "",
      curso: "",
      ano_ingresso: new Date().getFullYear(),
      raridade: "",
      pontos_valor: 10,
      codigo_unico: "",
      foto_url: "",
      descricao: "",
    };
  }

  cartaDialog.value = true;
};

const salvarCarta = async () => {
  salvandoCarta.value = true;

  try {
    // Validação básica
    if (!cartaData.value.nome || !cartaData.value.codigo_unico) {
      $q.notify({
        type: "negative",
        message: "Nome e código são obrigatórios",
      });
      return;
    }

    // Verificar se código já existe
    const codigoExiste = cartas.value.some(
      (carta) =>
        carta.codigo_unico === cartaData.value.codigo_unico &&
        carta.id !== cartaEditando.value?.id
    );

    if (codigoExiste) {
      $q.notify({
        type: "negative",
        message: "Este código já está sendo usado",
      });
      return;
    }

    if (cartaEditando.value) {
      // Editar carta existente
      const index = cartas.value.findIndex(
        (carta) => carta.id === cartaEditando.value.id
      );
      cartas.value[index] = { ...cartaData.value, id: cartaEditando.value.id };

      $q.notify({
        type: "positive",
        message: "Carta atualizada com sucesso!",
      });
    } else {
      // Criar nova carta
      const novaCarta = {
        ...cartaData.value,
        id: Date.now(), // ID temporário
      };
      cartas.value.push(novaCarta);

      $q.notify({
        type: "positive",
        message: "Carta criada com sucesso!",
      });
    }

    cartaDialog.value = false;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erro ao salvar carta",
    });
  } finally {
    salvandoCarta.value = false;
  }
};

const confirmarDelete = (carta) => {
  cartaParaDeletar.value = carta;
  deleteDialog.value = true;
};

const deletarCarta = async () => {
  deletandoCarta.value = true;

  try {
    const index = cartas.value.findIndex(
      (carta) => carta.id === cartaParaDeletar.value.id
    );
    cartas.value.splice(index, 1);

    $q.notify({
      type: "positive",
      message: "Carta excluída com sucesso!",
    });

    deleteDialog.value = false;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erro ao excluir carta",
    });
  } finally {
    deletandoCarta.value = false;
  }
};

const getRaridadeColor = (raridade) => {
  const cores = {
    comum: "grey",
    raro: "blue",
    epico: "purple",
    lendario: "orange",
  };
  return cores[raridade] || "grey";
};

const handleImageUpload = (file) => {
  if (file) {
    // Aqui você implementaria o upload real da imagem
    // Por enquanto, vamos simular com um URL local
    const reader = new FileReader();
    reader.onload = (e) => {
      cartaData.value.foto_url = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Lifecycle
onMounted(() => {
  // Carregar dados iniciais se necessário
});
</script>

<style scoped>
.admin-layout {
  background: #f5f5f5;
}

.admin-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.admin-avatar {
  background: rgba(255, 255, 255, 0.2);
}

.admin-title {
  font-weight: bold;
  color: white;
}

.admin-drawer {
  background: white;
}

.drawer-header {
  background: #f8f9fa;
  color: #495057;
  font-weight: bold;
  padding: 16px;
}

.drawer-item {
  margin: 4px 8px;
  border-radius: 8px;
}

.drawer-item.q-router-link--active {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.admin-page {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
}

.page-subtitle {
  color: #6c757d;
  margin: 4px 0 0 0;
  font-size: 1rem;
}

.action-btn {
  border-radius: 8px;
  font-weight: bold;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  line-height: 1;
}

.stat-label {
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 4px;
}

.filters-card {
  margin-bottom: 24px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filters-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
  align-items: center;
}

.search-input {
  min-width: 250px;
}

.filter-select {
  min-width: 150px;
}

.table-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.admin-table {
  border-radius: 12px;
}

.raridade-badge {
  text-transform: capitalize;
  font-weight: bold;
}

.carta-dialog {
  min-width: 600px;
  max-width: 800px;
  border-radius: 12px;
}

.dialog-header {
  background: #667eea;
  color: white;
  padding: 20px;
}

.dialog-content {
  padding: 24px;
}

.carta-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-field {
  width: 100%;
}

.full-width {
  grid-column: 1 / -1;
}

.image-section {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.image-preview {
  flex-shrink: 0;
}

.preview-avatar {
  border: 3px solid #dee2e6;
  background: white;
}

.image-controls {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-upload,
.url-input {
  width: 100%;
}

.dialog-actions {
  padding: 16px 24px;
  background: #f8f9fa;
}

.delete-dialog {
  min-width: 400px;
  border-radius: 12px;
}

/* Responsividade */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-row {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .carta-dialog {
    min-width: 95vw;
    max-width: 95vw;
  }

  .image-section {
    flex-direction: column;
    text-align: center;
  }

  .admin-page {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.4rem;
  }

  .stat-content {
    padding: 16px;
  }

  .stat-number {
    font-size: 1.6rem;
  }
}
</style>
