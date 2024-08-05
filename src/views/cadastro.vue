<template>
    <q-layout class="layout">
      <q-page-container>
        <q-page class="cadastro-page">
          <q-card class="cadastro-card">
            <q-card-section>
              <div class="text-h6">Cadastro</div>
              <q-input v-model="username" label="Usuário" />
              <q-input
                v-model="password"
                label="Senha"
                type="password"
                class="q-mt-md"
              />
              <q-btn
                label="Cadastrar"
                color="positive"
                @click="handleCadastro"
                class="q-mt-md"
              />
              <div v-if="cadastroError" class="error-message q-mt-md">
                Erro ao criar o usuário. Verifique os dados e tente novamente.
              </div>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </template>
  
  <script>
  import Cookies from 'js-cookie';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const username = ref('');
      const password = ref('');
      const cadastroError = ref(false);
      const router = useRouter();
  
      const handleCadastro = () => {
        // Cria um novo usuário e armazena no cookie
        const user = {
          username: username.value,
          password: password.value,
        };
  
        // Adiciona o novo usuário ao cookie
        let users = Cookies.get('users');
        users = users ? JSON.parse(users) : [];
        users.push(user);
        Cookies.set('users', JSON.stringify(users), { expires: 365 });
  
        // Redireciona para a página de login após o cadastro
        router.push('/');
      };
  
      return {
        username,
        password,
        cadastroError,
        handleCadastro,
      };
    },
  };
  </script>
  
  <style scoped>
  .layout {
    background: rgb(30, 214, 217);
    background: linear-gradient(
      0deg,
      rgba(30, 214, 217, 1) 10%,
      rgba(245, 238, 117, 1) 90%
    );
    min-height: 100vh;
  }
  
  .cadastro-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  
  .cadastro-card {
    max-width: 400px;
    width: 100%;
  }
  
  .error-message {
    color: red;
  }
  </style>
  