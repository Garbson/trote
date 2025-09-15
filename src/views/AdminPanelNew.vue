<template>
  <q-layout view="lHh Lpr lFf" class="admin-layout">
    <!-- Header Componente -->
    <AdminHeader
      :active-tab="activeTab"
      :cartas-count="cartas.length"
      @tab-change="activeTab = $event"
      @logout="logout"
      @toggle-drawer="drawerOpen = !drawerOpen"
    />

    <!-- Sidebar Componente -->
    <AdminSidebar
      v-model:is-open="drawerOpen"
      :active-tab="activeTab"
      :cartas-count="cartas.length"
      @tab-change="activeTab = $event"
      @logout="logout"
    />

    <!-- Conteúdo Principal -->
    <q-page-container>
      <q-page class="admin-page">
        <!-- Dashboard -->
        <AdminDashboard
          v-if="activeTab === 'dashboard'"
          :stats="adminStore.estatisticas"
          :loading="loadingEstatisticas"
          @add-animal="activeTab = 'cartas'"
          @refresh-stats="carregarEstatisticas"
          @export-data="exportarDados"
        />

        <!-- Gerenciar Animais -->
        <AdminAnimals
          v-if="activeTab === 'cartas'"
          :animals="cartas"
          :loading="loading"
          @add-animal="adicionarCarta"
          @edit-animal="editarCarta"
          @delete-animal="excluirCarta"
          @refresh-animals="carregarCartas"
        />

        <!-- Gerenciar Usuários -->
        <AdminUsers
          v-if="activeTab === 'usuarios'"
          :users="usuarios"
          :loading="loadingUsuarios"
          :total-animals="cartas.length"
          @search="buscarUsuarios"
          @filter-status="filtrarPorStatus"
          @refresh-users="carregarUsuarios"
          @export-users="exportarUsuarios"
          @view-user="visualizarUsuario"
          @edit-user="editarUsuario"
          @toggle-user-status="alternarStatusUsuario"
        />
      </q-page>
    </q-page-container>

    <!-- Modal de Edição de Animal -->
    <q-dialog v-model="modalEdicao" persistent>
      <q-card style="min-width: 500px; max-width: 650px" class="modal-edicao">
        <q-card-section class="row items-center q-pb-sm modal-header">
          <div class="text-h6 modal-title">📝 Editar Animal</div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            @click="fecharModalEdicao"
            class="close-btn"
          />
        </q-card-section>

        <q-card-section class="modal-content">
          <div class="row q-gutter-md q-pa-sm">
            <!-- Imagem atual -->
            <div class="col-12 image-section" v-if="cartaEditando.foto_url">
              <div class="text-subtitle2 q-mb-md image-label">🖼️ Imagem Atual:</div>
              <div class="image-container">
                <q-img
                  :src="cartaEditando.foto_url"
                  style="height: 180px; width: 180px"
                  class="rounded-borders image-preview"
                />
              </div>
            </div>

            <!-- Nome -->
            <div class="col-12">
              <q-input
                v-model="cartaEditando.nome"
                label="Nome do Animal"
                outlined
                dense
                :rules="[val => !!val || 'Nome é obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="pets" />
                </template>
              </q-input>
            </div>

            <!-- Raridade -->
            <div class="col-12">
              <q-select
                v-model="cartaEditando.raridade"
                :options="[
                  { label: 'Comum', value: 'comum' },
                  { label: 'Raro', value: 'raro' },
                  { label: 'Épico', value: 'epico' },
                  { label: 'Lendário', value: 'lendario' }
                ]"
                label="Raridade"
                outlined
                dense
                emit-value
                map-options
              >
                <template v-slot:prepend>
                  <q-icon name="star" />
                </template>
              </q-select>
            </div>

            <!-- Pontos -->
            <div class="col-12">
              <q-input
                v-model.number="cartaEditando.pontos_valor"
                label="Pontos"
                type="number"
                outlined
                dense
                min="1"
              >
                <template v-slot:prepend>
                  <q-icon name="stars" />
                </template>
              </q-input>
            </div>

            <!-- Código Único -->
            <div class="col-12">
              <q-input
                v-model="cartaEditando.codigo_unico"
                label="Código Único"
                outlined
                dense
                :rules="[val => !!val || 'Código é obrigatório']"
                readonly
              >
                <template v-slot:prepend>
                  <q-icon name="qr_code" />
                </template>
              </q-input>
            </div>

            <!-- Descrição -->
            <div class="col-12">
              <q-input
                v-model="cartaEditando.descricao"
                label="Descrição"
                outlined
                dense
                type="textarea"
                rows="3"
              >
                <template v-slot:prepend>
                  <q-icon name="description" />
                </template>
              </q-input>
            </div>

            <!-- Status -->
            <div class="col-12">
              <q-toggle
                v-model="cartaEditando.ativa"
                label="Animal Ativo"
                color="positive"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="modal-actions q-pa-md">
          <q-btn
            flat
            label="Cancelar"
            color="grey"
            @click="fecharModalEdicao"
            class="cancel-btn"
          />
          <q-btn
            label="Salvar Alterações"
            color="primary"
            :loading="salvandoEdicao"
            @click="salvarEdicao"
            class="save-btn"
            icon="save"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { useAdminStore } from "@/stores/admin";
import { useAuthStore } from "@/stores/auth";
import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { checkAdminAccess } from "../admin";

// Componentes
import AdminAnimals from "@/components/admin/AdminAnimals.vue";
import AdminDashboard from "@/components/admin/AdminDashboard.vue";
import AdminHeader from "@/components/admin/AdminHeader.vue";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminUsers from "@/components/admin/AdminUsers.vue";

// Stores e router
const authStore = useAuthStore();
const adminStore = useAdminStore();
const router = useRouter();
const $q = useQuasar();

// Estado local
const activeTab = ref("dashboard");
const drawerOpen = ref(false);
const loading = ref(false);
const loadingUsuarios = ref(false);
const loadingEstatisticas = ref(false);
const cartas = ref([]);
const usuarios = ref([]);
const modalEdicao = ref(false);
const cartaEditando = ref({});
const salvandoEdicao = ref(false);

// Verificação de acesso admin
onMounted(async () => {
  if (!authStore.isAuthenticated || !checkAdminAccess(authStore.user)) {
    $q.notify({
      type: "negative",
      message: "Acesso negado! Apenas administradores podem acessar esta área.",
      timeout: 3000,
    });
    router.push("/");
    return;
  }

  await Promise.all([
    carregarCartas(),
    carregarUsuarios(),
    carregarEstatisticas(),
  ]);
});

// Methods
const carregarCartas = async () => {
  loading.value = true;
  try {
    await adminStore.carregarCartas();
    cartas.value = adminStore.cartas;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erro ao carregar animais: " + error.message,
    });
  } finally {
    loading.value = false;
  }
};

const carregarUsuarios = async () => {
  loadingUsuarios.value = true;
  try {
    await adminStore.carregarUsuarios();
    usuarios.value = adminStore.usuarios;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erro ao carregar usuários: " + error.message,
    });
  } finally {
    loadingUsuarios.value = false;
  }
};

const carregarEstatisticas = async () => {
  loadingEstatisticas.value = true;
  try {
    await adminStore.carregarEstatisticas();
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erro ao carregar estatísticas: " + error.message,
    });
  } finally {
    loadingEstatisticas.value = false;
  }
};

const adicionarCarta = async (novaCarta) => {
  try {
    await adminStore.adicionarCarta(novaCarta);
    await carregarCartas();
    $q.notify({
      type: "positive",
      message: "Animal adicionado com sucesso!",
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erro ao adicionar animal: " + error.message,
    });
  }
};

const editarCarta = async (carta) => {
  // Abrir modal de edição
  modalEdicao.value = true;
  cartaEditando.value = { ...carta };
};

const excluirCarta = async (carta) => {
  $q.dialog({
    title: "Confirmar exclusão",
    message: `Tem certeza que deseja excluir o animal "${carta.nome}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await adminStore.excluirCarta(carta.id);
      await carregarCartas();
      $q.notify({
        type: "positive",
        message: "Animal excluído com sucesso!",
      });
    } catch (error) {
      $q.notify({
        type: "negative",
        message: "Erro ao excluir animal: " + error.message,
      });
    }
  });
};

const buscarUsuarios = (termo) => {
  // Implementar busca
  console.log("Buscar:", termo);
};

const filtrarPorStatus = (status) => {
  // Implementar filtro
  console.log("Filtrar por status:", status);
};

const exportarUsuarios = () => {
  // Implementar exportação
  $q.notify({
    type: "info",
    message: "Função de exportação em desenvolvimento",
  });
};

const exportarDados = () => {
  // Implementar exportação de dados
  $q.notify({
    type: "info",
    message: "Função de exportação em desenvolvimento",
  });
};

const visualizarUsuario = (usuario) => {
  // Implementar visualização
  $q.notify({
    type: "info",
    message: `Visualizar usuário: ${usuario.nome}`,
  });
};

const editarUsuario = (usuario) => {
  // Implementar edição
  $q.notify({
    type: "info",
    message: `Editar usuário: ${usuario.nome}`,
  });
};

const alternarStatusUsuario = async (usuario) => {
  try {
    await adminStore.alternarStatusUsuario(usuario.id);
    await carregarUsuarios();
    $q.notify({
      type: "positive",
      message: `Status do usuário ${usuario.nome} alterado com sucesso!`,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erro ao alterar status: " + error.message,
    });
  }
};

const salvarEdicao = async () => {
  salvandoEdicao.value = true;
  try {
    await adminStore.editarCarta(cartaEditando.value.id, cartaEditando.value);
    await carregarCartas();
    modalEdicao.value = false;
    $q.notify({
      type: "positive",
      message: "Animal editado com sucesso!",
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erro ao editar animal: " + error.message,
    });
  } finally {
    salvandoEdicao.value = false;
  }
};

const fecharModalEdicao = () => {
  modalEdicao.value = false;
  cartaEditando.value = {};
};

const logout = async () => {
  try {
    await authStore.logout();
    router.push("/login");
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erro ao fazer logout: " + error.message,
    });
  }
};
</script>

<style scoped>
.admin-layout {
  background: #f8f9fa;
}

.admin-page {
  background: #f8f9fa;
  min-height: 100vh;
}

/* Estilos do Modal de Edição */
.modal-edicao {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.modal-header {
  background: linear-gradient(135deg, #8B4513, #D2691E);
  color: white;
  border-radius: 16px 16px 0 0;
  padding: 20px 24px 16px 24px;
}

.modal-title {
  font-weight: 600;
  font-size: 1.3rem;
}

.close-btn {
  color: white !important;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.modal-content {
  padding: 24px;
}

.image-section {
  text-align: center;
  margin-bottom: 16px;
}

.image-label {
  color: #6c757d;
  font-weight: 500;
}

.image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.image-preview {
  border: 3px solid #e9ecef;
  transition: all 0.3s ease;
}

.image-preview:hover {
  border-color: #D2691E;
  transform: scale(1.02);
}

.modal-actions {
  background: #f8f9fa;
  border-radius: 0 0 16px 16px;
  gap: 12px;
  padding: 20px 24px;
}

.cancel-btn {
  min-width: 100px;
  height: 40px;
  font-weight: 500;
}

.save-btn {
  min-width: 140px;
  height: 40px;
  background: linear-gradient(135deg, #8B4513, #D2691E);
  font-weight: 600;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background: linear-gradient(135deg, #A0522D, #F4A460);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
}

/* Melhorar espaçamento dos campos */
.q-input,
.q-select {
  margin-bottom: 4px;
}

.q-toggle {
  margin-top: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

@media (max-width: 768px) {
  .admin-page {
    padding: 0;
  }

  .modal-edicao {
    margin: 16px;
    max-width: calc(100vw - 32px);
    min-width: auto;
  }

  .modal-header {
    padding: 16px 20px 12px 20px;
  }

  .modal-title {
    font-size: 1.1rem;
  }

  .modal-content {
    padding: 20px;
  }

  .image-preview {
    height: 150px !important;
    width: 150px !important;
  }

  .save-btn {
    min-width: 120px;
  }
}
</style>
