// src/config/admin.js
// Configuração centralizada para controle de acesso administrativo

export const ADMIN_CONFIG = {
  // Emails dos administradores
  ADMIN_EMAILS: [
    'garbsonsouza2602@gmail.com',
    'ana.vilanova@sou.ufac.br'
  ],

  // Função para verificar se um usuário é admin
  isAdmin: (user) => {
    if (!user || !user.email) return false;
    return ADMIN_CONFIG.ADMIN_EMAILS.includes(user.email);
  },

  // Função para verificar se um email é admin
  isAdminEmail: (email) => {
    if (!email) return false;
    return ADMIN_CONFIG.ADMIN_EMAILS.includes(email);
  }
};

// Exportação da função principal para facilitar o uso
export const checkAdminAccess = (user) => {
  return ADMIN_CONFIG.isAdmin(user);
};

export default ADMIN_CONFIG;