<template>
  <!-- Footer com marketing Dev_garbson (para usuários logados) -->
  <div v-if="authStore.isAuthenticated" class="app-footer">
    <div class="footer-content">
      <div class="footer-branding">
        <q-icon name="local_fire_department" size="md" color="primary" />
        <div class="footer-text">
          <div class="app-name">ACAMPJA 2025</div>
          <div class="version-info">v1.0 - Sistema de Cartas Colecionáveis</div>
        </div>
      </div>

      <div class="footer-developer">
        <div class="developer-badge">
          <div class="badge-content">
            <q-icon name="code" size="sm" color="primary" />
            <div class="badge-text">
              <div class="made-by">Desenvolvido com ❤️ por</div>
              <div class="dev-link" @click="openWhatsApp">
                <strong>@dev_garbson</strong>
                <q-icon name="open_in_new" size="xs" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-links">
        <q-btn 
          flat 
          size="sm" 
          icon="chat" 
          label="WhatsApp"
          @click="openWhatsApp"
          class="footer-btn"
        />
        <q-btn 
          flat 
          size="sm" 
          icon="info" 
          label="Sobre"
          @click="mostrarCreditos"
          class="footer-btn"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useQuasar } from "quasar";

// Stores
const authStore = useAuthStore();
const $q = useQuasar();

// Methods
const openWhatsApp = () => {
  window.open("https://wa.me/5568992490198", "_blank");
};

const mostrarCreditos = () => {
  $q.dialog({
    title: '🎮 Sobre o ACAMPJA 2025',
    message: `
      <div style="text-align: center; padding: 20px;">
        <div style="margin-bottom: 20px;">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24'%3E%3Cpath fill='%232ECC71' d='M14.6 16.6l4.6-4.6l-4.6-4.6L16 6l6 6l-6 6l-1.4-1.4zm-5.2 0L4.8 12l4.6-4.6L8 6l-6 6l6 6l1.4-1.4z'/%3E%3C/svg%3E" alt="Code Icon">
        </div>
        
        <h4 style="color: #2ECC71; margin: 10px 0;">Sistema desenvolvido por</h4>
        <h3 style="color: #2c3e50; margin: 5px 0;">@dev_garbson</h3>
        
        <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <p><strong>🚀 Tecnologias utilizadas:</strong></p>
          <p>Vue.js 3 • Quasar Framework • Supabase • Cloudinary</p>
        </div>
        
        <div style="margin: 20px 0;">
          <p>💼 <strong>Full Stack Developer</strong></p>
          <p>🎯 Especialista em Vue.js e sistemas web modernos</p>
          <p>❤️ Apaixonado por criar experiências incríveis</p>
        </div>
        
        <div style="margin-top: 25px;">
          <p style="color: #6c757d; font-size: 0.9rem;">
            Desenvolvido com muito ❤️ e ☕<br>
            Quer um sistema como este? Entre em contato!
          </p>
        </div>
      </div>
    `,
    html: true,
    ok: {
      label: 'Falar no WhatsApp',
      color: 'green'
    },
    cancel: {
      label: 'Fechar',
      flat: true
    }
  }).onOk(() => {
    openWhatsApp();
  });
};
</script>

<style scoped>
/* ===== FOOTER APP ACAMPJA ===== */
.app-footer {
  margin-top: 60px;
  padding: 30px 20px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-top: 3px solid var(--cr-gold);
  border-radius: 20px 20px 0 0;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 30px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-branding {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-text {
  color: #2c3e50;
}

.app-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--acampja-primary);
}

.version-info {
  font-size: 0.8rem;
  color: #6c757d;
}

.footer-developer {
  text-align: center;
}

.developer-badge {
  background: linear-gradient(135deg, var(--acampja-primary), var(--acampja-secondary));
  border-radius: 12px;
  padding: 16px 20px;
  color: white;
  box-shadow: 0 4px 16px rgba(46, 204, 113, 0.2);
}

.badge-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge-text {
  text-align: left;
}

.made-by {
  font-size: 0.8rem;
  opacity: 0.9;
}

.dev-link {
  font-size: 1rem;
  font-weight: bold;
  color: var(--cr-gold);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: transform 0.2s ease;
}

.dev-link:hover {
  transform: scale(1.05);
}

.footer-links {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.footer-btn {
  color: #6c757d;
  border-radius: 6px;
}

.footer-btn:hover {
  background: rgba(46, 204, 113, 0.1);
  color: var(--acampja-primary);
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 20px;
    text-align: center;
  }

  .footer-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .app-footer {
    padding: 20px 15px;
  }

  .developer-badge {
    padding: 12px 16px;
  }

  .badge-content {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .dev-link {
    justify-content: center;
  }
}
</style>
