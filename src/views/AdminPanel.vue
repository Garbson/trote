<template>
  <q-layout view="lHh Lpr lFf" class="admin-layout">
    <!-- Header Componente -->
    <AdminHeader
      :active-tab="activeTab"
      :cartas-count="cartasStore.cartas.length"
      @tab-change="activeTab = $event"
      @logout="logout"
      @go-home="goHome"
      @toggle-drawer="drawerOpen = !drawerOpen"
    />

    <!-- Sidebar Componente -->
    <AdminSidebar
      v-model:is-open="drawerOpen"
      :active-tab="activeTab"
      :cartas-count="cartasStore.cartas.length"
      @tab-change="activeTab = $event"
      @logout="logout"
      @go-home="goHome"
    />

    <!-- Conteúdo Principal -->
    <q-page-container>
      <q-page class="admin-page">
        <!-- Dashboard -->
        <AdminDashboard
          v-if="activeTab === 'dashboard'"
          :stats="{
            totalCartas: cartasStore.cartas.length,
            cartasAtivas: cartasStore.cartas.filter((c) => c.ativa).length,
            totalUsuarios: adminUsersStore.usuarios.length,
            usuariosAtivos: adminUsersStore.usuariosAtivos.length,
          }"
          :loading="cartasStore.loading || adminUsersStore.loading"
          @add-animal="activeTab = 'cartas'"
          @refresh-stats="carregarEstatisticas"
          @export-data="exportarDados"
        />

        <!-- Gerenciar Animais -->
        <AdminAnimals
          v-if="activeTab === 'cartas'"
          :animals="cartasStore.cartas"
          :loading="cartasStore.loading"
          @add-animal="adicionarCarta"
          @edit-animal="editarCarta"
          @delete-animal="excluirCarta"
          @refresh-animals="carregarCartas"
        />

        <!-- Gerenciar Usuários -->
        <AdminUsers
          v-if="activeTab === 'usuarios'"
          :users="adminUsersStore.usuarios"
          :loading="adminUsersStore.loading"
          :total-animals="cartasStore.cartas.filter((c) => c.ativa).length"
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
import { useAdminUsersStore } from "@/stores/adminUsers";
import { useAuthStore } from "@/stores/auth";
import { useCartasStore } from "@/stores/cartas";
import { useQuasar } from "quasar";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

// Componentes
import AdminAnimals from "@/components/admin/AdminAnimals.vue";
import AdminDashboard from "@/components/admin/AdminDashboard.vue";
import AdminHeader from "@/components/admin/AdminHeader.vue";
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminUsers from "@/components/admin/AdminUsers.vue";

// Stores e router
const authStore = useAuthStore();
const cartasStore = useCartasStore();
const adminUsersStore = useAdminUsersStore();
const router = useRouter();
const $q = useQuasar();

// Estado local
const activeTab = ref("dashboard");
const drawerOpen = ref(false);

// Verificação de acesso admin
onMounted(async () => {
  if (!authStore.isAuthenticated || !authStore.user?.is_admin) {
    $q.notify({
      type: "negative",
      message: "Acesso negado! Apenas administradores podem acessar esta área.",
      timeout: 3000,
    });
    router.push("/");
    return;
  }

  await Promise.all([
    cartasStore.fetchTodasCartas(),
    adminUsersStore.fetchUsuarios(),
  ]);
});

// Methods
const carregarCartas = async () => {
  await cartasStore.fetchTodasCartas();
};

const carregarUsuarios = async () => {
  await adminUsersStore.fetchUsuarios();
};

const carregarEstatisticas = async () => {
  // Estatísticas são calculadas automaticamente nos stores
  await Promise.all([
    cartasStore.fetchTodasCartas(),
    adminUsersStore.fetchUsuarios(),
  ]);
};

const adicionarCarta = async (novaCarta) => {
  const resultado = await cartasStore.criarCarta(novaCarta);
  if (resultado.success) {
    // Sucesso é tratado no store com notify
  }
};

const editarCarta = async (carta) => {
  $q.dialog({
    title: "Editar Animal",
    message: "Funcionalidade de edição será implementada em breve.",
    ok: "Ok",
  });
};

const excluirCarta = async (carta) => {
  $q.dialog({
    title: "Confirmar exclusão",
    message: `Tem certeza que deseja excluir o animal "${carta.nome}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    await cartasStore.excluirCarta(carta.id);
  });
};

const buscarUsuarios = async (termo) => {
  await adminUsersStore.buscarUsuarios(termo);
};

const filtrarPorStatus = async (status) => {
  if (status === "todos") {
    await adminUsersStore.fetchUsuarios();
  } else {
    // Filtrar localmente
    const usuariosFiltrados = adminUsersStore.usuarios.filter(
      (user) => user.ativo === status
    );
    adminUsersStore.usuarios = usuariosFiltrados;
  }
};

const exportarUsuarios = async () => {
  await adminUsersStore.exportarUsuarios();
};

const exportarDados = () => {
  $q.notify({
    type: "info",
    message: "Função de exportação geral em desenvolvimento",
  });
};

const visualizarUsuario = async (usuario) => {
  const resultado = await adminUsersStore.obterDetalhesUsuario(usuario.id);
  if (resultado.success) {
    $q.dialog({
      title: `Detalhes - ${usuario.nome}`,
      message: `
        Email: ${usuario.email}
        Pontos: ${usuario.pontos_totais}
        Nível: ${usuario.nivel}
        Animais coletados: ${usuario.total_cartas || 0}
        Admin: ${usuario.is_admin ? "Sim" : "Não"}
        Status: ${usuario.ativo ? "Ativo" : "Inativo"}
      `,
      ok: "Fechar",
    });
  }
};

const editarUsuario = (usuario) => {
  $q.dialog({
    title: "Editar Usuário",
    message: "Funcionalidade de edição será implementada em breve.",
    ok: "Ok",
  });
};

const alternarStatusUsuario = async (usuario) => {
  await adminUsersStore.alterarStatusUsuario(usuario.id, !usuario.ativo);
};

const logout = async () => {
  try {
    await authStore.signOut();
    router.push("/login");
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erro ao fazer logout: " + error.message,
    });
  }
};

const goHome = () => {
  router.push("/");
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
