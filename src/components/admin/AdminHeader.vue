<template>
  <q-header elevated class="admin-header">
    <q-toolbar>
      <q-avatar size="40px" class="admin-avatar">
        <q-icon name="admin_panel_settings" color="white" />
      </q-avatar>

      <q-toolbar-title class="admin-title">
        🛡️ ARCA DE NOÉ - Admin
      </q-toolbar-title>

      <!-- Navegação Desktop -->
      <div class="desktop-nav">
        <q-btn
          flat
          :label="getTabLabel('dashboard')"
          :color="activeTab === 'dashboard' ? 'amber' : 'white'"
          @click="$emit('tab-change', 'dashboard')"
          class="nav-btn"
        />
        <q-btn
          flat
          :label="getTabLabel('cartas')"
          :color="activeTab === 'cartas' ? 'amber' : 'white'"
          @click="$emit('tab-change', 'cartas')"
          class="nav-btn"
        >
          <q-badge v-if="cartasCount > 0" color="orange" floating>
            {{ cartasCount }}
          </q-badge>
        </q-btn>
        <q-btn
          flat
          :label="getTabLabel('usuarios')"
          :color="activeTab === 'usuarios' ? 'amber' : 'white'"
          @click="$emit('tab-change', 'usuarios')"
          class="nav-btn"
        />
      </div>

      <!-- Botão logout desktop -->
      <q-btn
        flat
        round
        icon="logout"
        color="white"
        @click="$emit('logout')"
        size="md"
        class="desktop-logout"
      >
        <q-tooltip>Sair do sistema</q-tooltip>
      </q-btn>

      <!-- Menu mobile -->
      <q-btn
        flat
        round
        icon="menu"
        color="white"
        @click="$emit('toggle-drawer')"
        class="mobile-menu-btn"
      />
    </q-toolbar>
  </q-header>
</template>

<script setup>
// Props
const props = defineProps({
  activeTab: {
    type: String,
    required: true,
  },
  cartasCount: {
    type: Number,
    default: 0,
  },
});

// Emits
const emit = defineEmits(["tab-change", "logout", "toggle-drawer"]);

// Methods
const getTabLabel = (tab) => {
  const labels = {
    dashboard: "Dashboard",
    cartas: "Animais",
    usuarios: "Usuários",
  };
  return labels[tab] || tab;
};
</script>

<style scoped>
.admin-header {
  background: linear-gradient(135deg, var(--arca-wood), var(--arca-gold));
  color: white;
}

.admin-avatar {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.admin-title {
  font-weight: bold;
  font-size: 1.2rem;
}

.desktop-nav {
  display: flex;
  gap: 8px;
}

.nav-btn {
  border-radius: 8px;
  font-weight: 500;
  padding: 8px 16px;
}

.desktop-logout {
  margin-left: 16px;
}

.mobile-menu-btn {
  display: none;
}

@media (max-width: 768px) {
  .desktop-nav,
  .desktop-logout {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }
}
</style>
