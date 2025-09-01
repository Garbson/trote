<template>
  <!-- Menu mobile slide -->
  <q-drawer
    :model-value="isOpen"
    @update:model-value="$emit('update:isOpen', $event)"
    side="right"
    overlay
    behavior="mobile"
    :width="280"
    class="mobile-drawer"
    v-if="authStore.isAuthenticated"
  >
    <div class="mobile-menu">
      <!-- Header do menu -->
      <div class="mobile-menu-header">
        <q-avatar size="60px" class="user-avatar">
          <q-icon name="person" size="35px" />
        </q-avatar>
        <div class="user-info">
          <div class="user-name">
            {{ authStore.user?.nome || "Acampista" }}
          </div>
          <div class="user-level">Nível {{ authStore.user?.nivel || 1 }}</div>
        </div>
      </div>

      <!-- Stats rápidas -->
      <div class="mobile-stats">
        <div class="mobile-stat">
          <q-icon name="stars" color="amber" />
          <span>{{ authStore.user?.pontos_totais || 0 }} pts</span>
        </div>
        <div class="mobile-stat">
          <q-icon name="collections" color="blue" />
          <span>{{ cartasStore.estatisticas.total_cartas }}/{{ cartasStore.estatisticas.total_disponiveis }}</span>
        </div>
      </div>

      <!-- Menu items -->
      <q-list class="menu-list">
        <q-item
          clickable
          v-ripple
          @click="openCodeDialog"
          class="menu-item primary-item"
        >
          <q-item-section avatar>
            <q-icon name="add_circle" color="primary" size="lg" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="menu-label">Adicionar Código</q-item-label>
            <q-item-label caption>Digite o código da carta</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-spinner v-if="cartasStore.loadingObter" size="sm" />
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          @click="$router.push('/ranking')"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="emoji_events" color="orange" size="lg" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="menu-label">Ranking</q-item-label>
            <q-item-label caption>Ver posição no ranking</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="arrow_forward_ios" size="sm" />
          </q-item-section>
        </q-item>

        <q-item
          v-if="isAdmin"
          clickable
          v-ripple
          @click="$router.push('/admin')"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="admin_panel_settings" color="purple" size="lg" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="menu-label">Painel Admin</q-item-label>
            <q-item-label caption>Administrar sistema</q-item-label>
          </q-item-section>
          <q-item-section side>
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
            <q-item-label class="menu-label">Sair</q-item-label>
            <q-item-label caption>Fazer logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Footer com créditos -->
      <div class="mobile-footer">
        <q-btn 
          flat 
          no-caps 
          class="developer-credit-mobile" 
          @click="openWhatsApp"
          icon="code"
        >
          <div class="dev-info">
            <div class="dev-text">Desenvolvido com ❤️</div>
            <div class="dev-name">@dev_garbson</div>
          </div>
          <q-icon name="open_in_new" size="xs" />
        </q-btn>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useCartasStore } from "@/stores/cartas";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { checkAdminAccess } from "../admin";

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['update:isOpen', 'open-code-dialog', 'logout']);

// Stores e router
const authStore = useAuthStore();
const cartasStore = useCartasStore();
const router = useRouter();

// Computed
const isAdmin = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user) return false;
  return checkAdminAccess(authStore.user);
});

// Methods
const openCodeDialog = () => {
  emit('open-code-dialog');
  emit('update:isOpen', false);
};

const logout = () => {
  emit('logout');
  emit('update:isOpen', false);
};

const openWhatsApp = () => {
  window.open("https://wa.me/5568992490198", "_blank");
};
</script>

<style scoped>
/* ===== MENU MOBILE ACAMPJA ===== */
.mobile-drawer {
  background: linear-gradient(135deg, var(--acampja-primary), var(--acampja-secondary));
}

.mobile-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  color: rgb(208, 208, 208);
  background: linear-gradient(135deg, var(--acampja-primary), var(--acampja-secondary));
}

.mobile-menu-header {
  padding: 30px 20px 20px 20px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-avatar {
  background: linear-gradient(135deg, var(--cr-gold), var(--acampja-yellow));
  color: white;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 4px;
  color: white;
}

.user-level {
  font-size: 0.9rem;
  opacity: 0.8;
  color: rgba(255, 255, 255, 0.8);
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
  color: white;
}

.menu-list {
  flex: 1;
  padding: 10px 0;
}

.menu-item {
  margin: 4px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  color: white;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.primary-item {
  background: rgba(52, 152, 219, 0.2);
  border: 1px solid rgba(52, 152, 219, 0.3);
}

.logout-item {
  background: rgba(231, 76, 60, 0.2);
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.menu-label {
  font-weight: 600;
  font-size: 1rem;
  color: white;
}

.menu-separator {
  margin: 15px 20px;
  background: rgba(255, 255, 255, 0.2);
}

/* ===== FOOTER MOBILE ===== */
.mobile-footer {
  margin-top: auto;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.developer-credit-mobile {
  width: 100%;
  color: rgba(255, 255, 255, 0.9);
  justify-content: flex-start;
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  transition: background 0.3s ease;
}

.developer-credit-mobile:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dev-info {
  flex: 1;
  text-align: left;
  margin-left: 8px;
}

.dev-text {
  font-size: 0.8rem;
  opacity: 0.8;
}

.dev-name {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--cr-gold);
}

/* ===== HOVER EFFECTS ===== */
.menu-item {
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.menu-item:hover {
  border-left-color: var(--cr-gold);
  transform: translateX(5px);
}

.primary-item:hover {
  border-left-color: var(--acampja-blue);
}

.logout-item:hover {
  border-left-color: var(--cr-red);
}

/* ===== ANIMAÇÃO DE ABERTURA ===== */
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

/* ===== RESPONSIVIDADE MOBILE PEQUENO ===== */
@media (max-width: 480px) {
  .mobile-menu-header {
    padding: 20px 15px 15px 15px;
  }

  .user-name {
    font-size: 1rem;
  }

  .mobile-stats {
    padding: 12px 15px;
    flex-direction: column;
    gap: 8px;
  }

  .mobile-stat {
    font-size: 0.85rem;
    justify-content: center;
  }
}
</style>
