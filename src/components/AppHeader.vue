<template>
  <q-header elevated class="acampja-header enhanced-header" v-if="authStore.isAuthenticated">
    <q-toolbar class="enhanced-toolbar">
      <!-- Logo e título -->
      <div class="logo-section">
        <q-avatar size="40px" class="logo-avatar">
          <q-icon name="local_fire_department" size="24px" color="white" />
        </q-avatar>
        <div class="title-section">
          <div class="header-title acampja-title">ACAMPJA 2025</div>
        </div>
      </div>

      <!-- Stats rápidas no header (desktop) -->
      <div class="header-stats desktop-only">
        <div class="stat-item">
          <q-icon name="collections" size="sm" color="amber" />
          <span>{{ cartasStore.estatisticas.total_cartas }}/{{ cartasStore.estatisticas.total_disponiveis }}</span>
        </div>
        <div class="stat-item">
          <q-icon name="star" size="sm" color="gold" />
          <span>{{ authStore.user?.pontos_totais || 0 }}</span>
        </div>
      </div>

      <!-- Ações principais desktop -->
      <div class="desktop-actions">
        <!-- Botão Admin com badge -->
        <q-btn
          v-if="isAdmin"
          flat
          icon="admin_panel_settings"
          label="Admin"
          @click="$router.push('/admin')"
          class="desktop-btn admin-btn"
        >
          <q-badge color="red" floating rounded>!</q-badge>
          <q-tooltip>Painel Administrativo</q-tooltip>
        </q-btn>

        <!-- Botão principal de adicionar código -->
        <q-btn
          color="primary"
          icon="add_circle"
          label="Código"
          @click="openCodeDialog"
          :loading="cartasStore.loadingObter"
          class="desktop-btn primary-btn"
          glossy
        >
          <q-tooltip>Adicionar código de carta</q-tooltip>
        </q-btn>

        <!-- Botão de ranking -->
        <q-btn
          flat
          icon="emoji_events"
          label="Ranking"
          @click="$router.push('/ranking')"
          class="desktop-btn ranking-btn"
        >
          <q-tooltip>Ver ranking de jogadores</q-tooltip>
        </q-btn>

        <!-- Menu do usuário -->
        <q-btn-dropdown
          flat
          class="user-dropdown desktop-btn"
          :icon="authStore.user?.nome ? 'account_circle' : 'person'"
        >
          <template v-slot:label>
            <div class="user-info-dropdown">
              <div class="user-name-short">{{ (authStore.user?.nome || 'Usuário').split(' ')[0] }}</div>
              <div class="user-level-badge">Nv.{{ authStore.user?.nivel || 1 }}</div>
            </div>
          </template>

          <q-list>
            <q-item clickable @click="verPerfil">
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Meu Perfil</q-item-label>
                <q-item-label caption>{{ authStore.user?.email }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable @click="verColetao">
              <q-item-section avatar>
                <q-icon name="collections_bookmark" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Minha Coleção</q-item-label>
                <q-item-label caption>{{ cartasStore.estatisticas.total_cartas }} cartas</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable @click="logout" class="logout-item">
              <q-item-section avatar>
                <q-icon name="logout" color="negative" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Sair</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <!-- Menu hambúrguer mobile -->
      <q-btn
        flat
        round
        icon="menu"
        @click="toggleMobileMenu"
        class="mobile-menu-btn enhanced-mobile-btn"
        size="md"
      >
        <q-badge 
          v-if="cartasStore.estatisticas.total_cartas > 0" 
          color="primary" 
          floating 
          rounded
          :label="cartasStore.estatisticas.total_cartas"
        />
      </q-btn>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useCartasStore } from "@/stores/cartas";
import { useQuasar } from "quasar";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { checkAdminAccess } from "../admin";

// Props
const props = defineProps({
  mobileMenuOpen: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['toggle-mobile-menu', 'open-code-dialog', 'logout', 'ver-perfil', 'ver-colecao']);

// Stores e router
const authStore = useAuthStore();
const cartasStore = useCartasStore();
const router = useRouter();
const $q = useQuasar();

// Computed
const isAdmin = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user) return false;
  return checkAdminAccess(authStore.user);
});

// Methods
const toggleMobileMenu = () => {
  emit('toggle-mobile-menu');
};

const openCodeDialog = () => {
  emit('open-code-dialog');
};

const logout = () => {
  emit('logout');
};

const verPerfil = () => {
  emit('ver-perfil');
};

const verColetao = () => {
  emit('ver-colecao');
};
</script>

<style scoped>
/* ===== NAVBAR ACAMPJA 2025 ===== */
.acampja-header {
  background: linear-gradient(135deg, var(--acampja-primary), var(--acampja-secondary), var(--acampja-accent));
  border-bottom: 3px solid var(--cr-gold);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.enhanced-toolbar {
  padding: 8px 24px;
  min-height: 75px;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  min-width: 250px;
}

.logo-avatar {
  background: linear-gradient(135deg, var(--cr-gold), var(--acampja-yellow));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.title-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: white;
  line-height: 1.1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 24px;
  margin: 0 auto;
  flex: 1;
  justify-content: center;
  max-width: 400px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.9rem;
  color: white;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.desktop-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  justify-content: flex-end;
}

.desktop-btn {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  min-height: 42px;
  padding: 8px 16px;
  white-space: nowrap;
}

.admin-btn {
  color: #E74C3C;
  background: rgba(231, 76, 60, 0.1);
}

.admin-btn:hover {
  background: rgba(231, 76, 60, 0.2);
  transform: scale(1.05);
}

.primary-btn {
  background: linear-gradient(135deg, var(--acampja-primary), var(--acampja-secondary));
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(46, 204, 113, 0.4);
}

.ranking-btn {
  color: var(--acampja-yellow);
  background: rgba(241, 196, 15, 0.1);
}

.ranking-btn:hover {
  background: rgba(241, 196, 15, 0.2);
  transform: scale(1.05);
}

.user-dropdown {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.user-info-dropdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.user-name-short {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}

.user-level-badge {
  font-size: 0.7rem;
  color: var(--cr-gold);
  font-weight: bold;
}

.enhanced-mobile-btn {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.desktop-only {
  display: flex;
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 768px) {
  .desktop-actions, .header-stats, .desktop-only {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .enhanced-toolbar {
    min-height: 60px;
    padding: 8px 12px;
  }

  .logo-section {
    flex: 1;
  }

  .header-title {
    font-size: 1.1rem;
  }
}

@media (min-width: 769px) {
  .mobile-menu-btn {
    display: none;
  }
}

/* ===== HOVER EFFECTS ===== */
.desktop-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.logout-item {
  color: var(--cr-red);
}
</style>
