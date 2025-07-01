// src/config/admin.js
// Configuração centralizada para controle de acesso administrativo

export const ADMIN_CONFIG = {
  // Email do administrador principal
  ADMIN_EMAIL: 'garbsonsouza2602@gmail.com',

  // Função para verificar se um usuário é admin
  isAdmin: (user) => {
    console.log(user)
    if (!user || !user.email) return false;
    return user.email === ADMIN_CONFIG.ADMIN_EMAIL;
  },

  // Função para verificar se um email é admin
  isAdminEmail: (email) => {
    if (!email) return false;
    return email === ADMIN_CONFIG.ADMIN_EMAIL;
  }
};

// Exportação da função principal para facilitar o uso
export const checkAdminAccess = (user) => {
  return ADMIN_CONFIG.isAdmin(user);
};

export default ADMIN_CONFIG;