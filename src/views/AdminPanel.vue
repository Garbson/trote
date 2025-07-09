<template>
  <q-layout view="lHh Lpr lFf" class="admin-layout">
    <!-- Header Responsivo -->
    <q-header elevated class="admin-header">
      <q-toolbar>
        <q-avatar size="40px" class="admin-avatar">
          <q-icon name="admin_panel_settings" color="white" />
        </q-avatar>

        <q-toolbar-title class="admin-title">
          🛡️ BIXO ROYALE - Admin
        </q-toolbar-title>

        <!-- Navegação Desktop -->
        <div class="desktop-nav">
          <q-btn
            flat
            :label="getTabLabel('dashboard')"
            :color="activeTab === 'dashboard' ? 'amber' : 'white'"
            @click="activeTab = 'dashboard'"
            class="nav-btn"
          />
          <q-btn
            flat
            :label="getTabLabel('cartas')"
            :color="activeTab === 'cartas' ? 'amber' : 'white'"
            @click="activeTab = 'cartas'"
            class="nav-btn"
          >
            <q-badge v-if="cartas.length > 0" color="orange" floating>
              {{ cartas.length }}
            </q-badge>
          </q-btn>
          <q-btn
            flat
            :label="getTabLabel('usuarios')"
            :color="activeTab === 'usuarios' ? 'amber' : 'white'"
            @click="activeTab = 'usuarios'"
            class="nav-btn"
          />
        </div>

        <!-- Botão logout desktop -->
        <q-btn
          flat
          round
          icon="logout"
          color="white"
          @click="logout"
          size="md"
          class="desktop-logout"
        >
          <q-tooltip>Sair</q-tooltip>
        </q-btn>

        <!-- Menu hambúrguer mobile -->
        <q-btn
          flat
          round
          icon="menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="mobile-menu-btn"
          size="md"
          color="white"
        />
      </q-toolbar>
    </q-header>

    <!-- Menu Mobile Drawer -->
    <q-drawer
      v-model="mobileMenuOpen"
      side="right"
      overlay
      behavior="mobile"
      :width="280"
      class="mobile-drawer"
    >
      <div class="mobile-menu">
        <!-- Header do menu admin -->
        <div class="mobile-menu-header">
          <q-avatar size="60px" class="user-avatar">
            <q-icon name="admin_panel_settings" size="35px" />
          </q-avatar>
          <div class="user-info">
            <div class="user-name">Administrador</div>
            <div class="user-level">Painel de Controle</div>
          </div>
        </div>

        <!-- Stats rápidas -->
        <div class="mobile-stats">
          <div class="mobile-stat">
            <q-icon name="collections" color="blue" />
            <span>{{ cartas.length }} cartas</span>
          </div>
          <div class="mobile-stat">
            <q-icon name="people" color="green" />
            <span>{{ usuarios.length }} usuários</span>
          </div>
        </div>

        <!-- Menu items admin -->
        <q-list class="menu-list">
          <q-item
            clickable
            v-ripple
            @click="selectTab('dashboard')"
            :class="[
              'menu-item',
              { 'primary-item': activeTab === 'dashboard' },
            ]"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" color="primary" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Dashboard</q-item-label>
              <q-item-label caption>Visão geral do sistema</q-item-label>
            </q-item-section>
            <q-item-section side v-if="activeTab === 'dashboard'">
              <q-icon name="arrow_forward_ios" size="sm" />
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="selectTab('cartas')"
            :class="['menu-item', { 'primary-item': activeTab === 'cartas' }]"
          >
            <q-item-section avatar>
              <q-icon name="collections" color="purple" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Gerenciar Cartas</q-item-label>
              <q-item-label caption>Criar e editar cartas</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge
                v-if="cartas.length > 0"
                color="purple"
                :label="cartas.length"
              />
              <q-icon
                v-if="activeTab === 'cartas'"
                name="arrow_forward_ios"
                size="sm"
              />
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="selectTab('usuarios')"
            :class="['menu-item', { 'primary-item': activeTab === 'usuarios' }]"
          >
            <q-item-section avatar>
              <q-icon name="people" color="green" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Usuários</q-item-label>
              <q-item-label caption>Gerenciar usuários</q-item-label>
            </q-item-section>
            <q-item-section side v-if="activeTab === 'usuarios'">
              <q-icon name="arrow_forward_ios" size="sm" />
            </q-item-section>
          </q-item>

          <q-separator class="menu-separator" />

          <q-item
            clickable
            v-ripple
            @click="logout"
            class="menu-item logout-item"
          >
            <q-item-section avatar>
              <q-icon name="logout" color="negative" size="lg" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="menu-label">Sair do Admin</q-item-label>
              <q-item-label caption>Voltar ao sistema</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
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
                    :label="formatarRaridade(props.value)"
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

        <!-- Tab Usuários -->
        <div v-if="activeTab === 'usuarios'" class="usuarios-content">
          <div class="page-header">
            <h3 class="page-title">👥 Gerenciar Usuários</h3>
          </div>
          <q-card class="placeholder-card">
            <q-card-section class="text-center">
              <q-icon name="people" size="80px" color="grey-5" />
              <h5>Gerenciamento de Usuários</h5>
              <p>Esta funcionalidade será implementada em breve.</p>
            </q-card-section>
          </q-card>
        </div>
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
              >
                <template v-slot:append>
                  <q-btn
                    flat
                    icon="refresh"
                    @click="gerarCodigoAleatorio"
                    :loading="salvandoCarta"
                    color="primary"
                    size="sm"
                  >
                    <q-tooltip>Gerar código automático</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
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
import { useAdminStore } from "@/stores/admin";
import { useQuasar } from "quasar";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

// Composables
const router = useRouter();
const $q = useQuasar();
const adminStore = useAdminStore();

// Estado
const mobileMenuOpen = ref(false);
const activeTab = ref("dashboard");
const cartaDialog = ref(false);
const deleteDialog = ref(false);
const cartaEditando = ref(null);
const cartaParaDeletar = ref(null);
const salvandoCarta = computed(() => adminStore.salvando);
const deletandoCarta = computed(() => adminStore.salvando);
const imagemFile = ref(null);
const loading = computed(() => adminStore.loading);

// Dados
const cartas = computed(() => adminStore.cartas);
const usuarios = computed(() => adminStore.usuarios);

const cartaData = ref({
  nome: "",
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
});

// Opções
const raridadeOptions = ["comum", "raro", "epico", "lendario"];

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
const codigosUsados = computed(() => {
  return Math.floor(cartas.value.length * 0.7);
});

const cartasLendarias = computed(() => {
  return cartas.value.filter((carta) => carta.raridade === "lendario").length;
});

const cartasFiltradas = computed(() => {
  let resultado = cartas.value;

  if (filtro.value.busca) {
    resultado = resultado.filter((carta) =>
      carta.nome.toLowerCase().includes(filtro.value.busca.toLowerCase())
    );
  }

  if (filtro.value.raridade) {
    resultado = resultado.filter(
      (carta) => carta.raridade === filtro.value.raridade
    );
  }

  return resultado;
});

// Methods
const getTabLabel = (tab) => {
  const labels = {
    dashboard: "Dashboard",
    cartas: "Cartas",
    usuarios: "Usuários",
  };
  return labels[tab] || tab;
};

const selectTab = (tab) => {
  activeTab.value = tab;
  mobileMenuOpen.value = false;
};

const logout = () => {
  mobileMenuOpen.value = false;
  router.push("/");
};

const openCartaDialog = (carta = null) => {
  cartaEditando.value = carta;

  if (carta) {
    cartaData.value = { ...carta };
  } else {
    cartaData.value = {
      nome: "",
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
  if (!cartaData.value.nome || !cartaData.value.codigo_unico) {
    $q.notify({
      type: "negative",
      message: "Nome e código são obrigatórios",
    });
    return;
  }

  let resultado;

  if (cartaEditando.value) {
    resultado = await adminStore.atualizarCarta(
      cartaEditando.value.id,
      cartaData.value
    );
  } else {
    resultado = await adminStore.criarCarta(cartaData.value);
  }

  if (resultado.success) {
    cartaDialog.value = false;
    cartaData.value = {
      nome: "",
      raridade: "",
      pontos_valor: 10,
      codigo_unico: "",
      foto_url: "",
      descricao: "",
    };
    cartaEditando.value = null;
  }
};

const confirmarDelete = (carta) => {
  cartaParaDeletar.value = carta;
  deleteDialog.value = true;
};

const deletarCarta = async () => {
  const resultado = await adminStore.excluirCarta(cartaParaDeletar.value.id);

  if (resultado.success) {
    deleteDialog.value = false;
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

const formatarRaridade = (raridade) => {
  const nomes = {
    comum: "Comum",
    raro: "Raro",
    epico: "Épico",
    lendario: "Lendário",
  };
  return nomes[raridade] || raridade;
};

const gerarCodigoAleatorio = async () => {
  try {
    const codigo = adminStore.gerarCodigoUnico();
    cartaData.value.codigo_unico = codigo;

    $q.notify({
      type: "positive",
      message: "Código gerado automaticamente!",
      timeout: 1000,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erro ao gerar código",
    });
  }
};

const handleImageUpload = async (file) => {
  if (file) {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        cartaData.value.foto_url = e.target.result;
      };
      reader.readAsDataURL(file);

      const resultado = await adminStore.uploadImagem(file);

      if (resultado.success) {
        cartaData.value.foto_url = resultado.url;
        cartaData.value.cloudinary_public_id = resultado.publicId;
      }
    } catch (error) {
      console.error("Erro no upload:", error);
    }
  }
};

// Lifecycle
onMounted(() => {
  adminStore.fetchCartas();
});
</script>

<style scoped>
@import "@/assets/clash-royale-theme.css";

.admin-layout {
  background: var(--cr-bg-primary);
  min-height: 100vh;
  position: relative;
}

/* ===== HEADER ===== */
.admin-header {
  background: linear-gradient(135deg, var(--cr-blue-dark), var(--cr-purple));
  border-bottom: 3px solid var(--cr-gold);
}

.admin-avatar {
  background: linear-gradient(135deg, var(--cr-gold), #ffa000);
}

.admin-title {
  font-weight: bold;
  color: var(--cr-gold);
  margin-left: 12px;
}

/* ===== NAVEGAÇÃO DESKTOP ===== */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
}

.nav-btn {
  position: relative;
  transition: all 0.3s ease;
  border-radius: 8px;
  color: white;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.desktop-logout {
  background: rgba(239, 35, 60, 0.2);
  transition: all 0.3s ease;
  margin-left: 8px;
}

.desktop-logout:hover {
  background: rgba(239, 35, 60, 0.3);
  transform: scale(1.05);
}

/* ===== MENU HAMBÚRGUER MOBILE ===== */
.mobile-menu-btn {
  display: none;
  color: white;
}

/* ===== MENU MOBILE ===== */
.mobile-drawer {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}

.mobile-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: rgb(208, 208, 208);
  background: linear-gradient(135deg, #1e3c72, #2a5298);
}

.mobile-menu-header {
  padding: 30px 20px 20px 20px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-avatar {
  background: linear-gradient(135deg, var(--cr-gold), #ffa000);
  color: white;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 4px;
}

.user-level {
  font-size: 0.9rem;
  opacity: 0.8;
}

.mobile-stats {
  padding: 15px 20px;
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
}

.menu-list {
  flex: 1;
  padding: 10px 0;
}

.menu-item {
  margin: 4px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.primary-item {
  background: rgba(74, 144, 226, 0.2);
  border: 1px solid rgba(74, 144, 226, 0.3);
}

.logout-item {
  background: rgba(239, 35, 60, 0.2);
  border: 1px solid rgba(239, 35, 60, 0.3);
}

.menu-label {
  font-weight: 600;
  font-size: 1rem;
}

.menu-separator {
  margin: 15px 20px;
  background: rgba(255, 255, 255, 0.2);
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 768px) {
  .desktop-nav,
  .desktop-logout {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .admin-title {
    font-size: 1rem;
  }
}

@media (min-width: 769px) {
  .mobile-drawer {
    display: none !important;
  }
}

/* ===== CONTENT STYLES ===== */
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
  grid-template-columns: 2fr 1fr;
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

/* ===== DIALOGS ===== */
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

/* ===== PLACEHOLDER CARDS ===== */
.placeholder-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 40px;
}

.placeholder-card h5 {
  color: #2c3e50;
  margin: 16px 0 8px 0;
}

.placeholder-card p {
  color: #6c757d;
  margin: 0;
}

/* ===== RESPONSIVIDADE MOBILE ===== */
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

  .mobile-menu-header {
    padding: 20px 15px 15px 15px;
  }

  .user-name {
    font-size: 1rem;
  }

  .mobile-stats {
    padding: 12px 15px;
  }

  .mobile-stat {
    font-size: 0.85rem;
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

  .admin-title {
    font-size: 0.9rem;
  }
}

/* ===== ANIMAÇÕES ===== */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.mobile-drawer .q-drawer__content {
  animation: slideInRight 0.3s ease-out;
}

/* ===== BADGES COLORIDOS ===== */
.nav-btn .q-badge {
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* ===== EFEITOS HOVER ===== */
.menu-item {
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.menu-item:hover {
  border-left-color: var(--cr-gold);
  transform: translateX(5px);
}

.primary-item:hover {
  border-left-color: #4a90e2;
}

.logout-item:hover {
  border-left-color: #ef233c;
}

/* ===== MELHORIAS VISUAIS ===== */
.mobile-stat q-icon {
  font-size: 1.2rem;
}

.nav-btn:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
}

.stat-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.9)
  );
}

.filters-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(248, 250, 252, 0.95)
  );
}

.table-card {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95),
    rgba(248, 250, 252, 0.95)
  );
}
</style>
