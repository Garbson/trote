<template>
  <q-drawer
    :model-value="isOpen"
    @update:model-value="$emit('update:isOpen', $event)"
    side="left"
    bordered
    :width="280"
    :breakpoint="768"
    class="admin-drawer"
  >
    <q-scroll-area class="fit">
      <!-- Logo da sidebar -->
      <div class="sidebar-header">
        <q-avatar size="50px" class="sidebar-avatar">
          <q-icon name="sailing" color="brown" />
        </q-avatar>
        <div class="sidebar-title">Painel Admin</div>
        <div class="sidebar-subtitle">Arca de Noé</div>
      </div>

      <!-- Menu de navegação -->
      <q-list padding class="sidebar-menu">
        <!-- Dashboard -->
        <q-item
          clickable
          @click="$emit('tab-change', 'dashboard')"
          :class="['menu-item', { 'primary-item': activeTab === 'dashboard' }]"
        >
          <q-item-section avatar>
            <q-icon
              name="dashboard"
              :color="activeTab === 'dashboard' ? 'amber' : 'grey-6'"
              size="md"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="menu-label">Dashboard</q-item-label>
            <q-item-label caption>Visão geral</q-item-label>
          </q-item-section>
          <q-item-section side v-if="activeTab === 'dashboard'">
            <q-icon name="chevron_right" color="amber" />
          </q-item-section>
        </q-item>

        <!-- Animais -->
        <q-item
          clickable
          @click="$emit('tab-change', 'cartas')"
          :class="['menu-item', { 'primary-item': activeTab === 'cartas' }]"
        >
          <q-item-section avatar>
            <q-icon
              name="pets"
              :color="activeTab === 'cartas' ? 'amber' : 'grey-6'"
              size="md"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="menu-label">Animais</q-item-label>
            <q-item-label caption>Gerenciar coleção</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge
              v-if="activeTab === 'cartas'"
              color="amber"
              text-color="dark"
            >
              {{ cartasCount }}
            </q-badge>
            <q-icon
              v-else
              name="chevron_right"
              :color="activeTab === 'cartas' ? 'amber' : 'grey-6'"
            />
          </q-item-section>
        </q-item>

        <!-- Usuários -->
        <q-item
          clickable
          @click="$emit('tab-change', 'usuarios')"
          :class="['menu-item', { 'primary-item': activeTab === 'usuarios' }]"
        >
          <q-item-section avatar>
            <q-icon
              name="people"
              :color="activeTab === 'usuarios' ? 'amber' : 'grey-6'"
              size="md"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="menu-label">Usuários</q-item-label>
            <q-item-label caption>Gerenciar acampistas</q-item-label>
          </q-item-section>
          <q-item-section side v-if="activeTab === 'usuarios'">
            <q-icon name="chevron_right" color="amber" />
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Logout na sidebar -->
      <div class="sidebar-footer">
        <q-btn
          flat
          @click="$emit('logout')"
          color="negative"
          icon="logout"
          label="Sair"
          class="logout-btn"
        />
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup>
// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
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
const emit = defineEmits(["update:isOpen", "tab-change", "logout"]);
</script>

<style scoped>
.admin-drawer {
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
}

.sidebar-header {
  padding: 24px;
  text-align: center;
  background: linear-gradient(135deg, var(--arca-wood), var(--arca-gold));
  color: white;
  margin-bottom: 16px;
}

.sidebar-avatar {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  margin-bottom: 12px;
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 4px;
}

.sidebar-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
}

.sidebar-menu {
  padding: 16px 8px;
}

.menu-item {
  border-radius: 12px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.primary-item {
  background: linear-gradient(135deg, var(--arca-gold), var(--arca-wood));
  color: white;
}

.primary-item .menu-label {
  color: white;
  font-weight: bold;
}

.menu-label {
  font-weight: 500;
  font-size: 0.95rem;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #dee2e6;
  margin-top: auto;
}

.logout-btn {
  width: 100%;
  border-radius: 8px;
}
</style>
