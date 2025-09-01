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
  // Implementar edição
  $q.notify({
    type: "info",
    message: "Função de edição em desenvolvimento",
  });
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

@media (max-width: 768px) {
  .admin-page {
    padding: 0;
  }
}
</style>
