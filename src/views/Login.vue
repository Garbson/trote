<template>
  <q-layout class="layout">
    <q-page-container>
      <q-page class="login-page">
        <q-card class="login-card">
          <q-card-section>
            <div class="text-h6">Login</div>
            <q-input v-model="username" label="Usuário" />
            <q-input
              v-model="password"
              label="Senha"
              type="password"
              class="q-mt-md"
            />
            <q-btn
              label="Entrar"
              color="positive"
              @click="handleLogin"
              class="q-mt-md"
            />
            <q-btn
              label="Cadastrar"
              color="info"
              @click="goToCadastro"
              class="q-mt-md q-ml-lg"
            />
            <div v-if="loginError" class="error-message q-mt-md">
              Usuário ou senha incorretos.
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
    const loginError = ref(false);
    const router = useRouter();

    const handleLogin = () => {
      // Recupera a lista de usuários dos cookies
      const usersCookie = Cookies.get('users');
      const users = usersCookie ? JSON.parse(usersCookie) : [];

      // Verifica se o usuário e senha correspondem aos dados armazenados
      const user = users.find(u => u.username === username.value && u.password === password.value);

      if (user) {
        // Salva o usuário em cookies
        Cookies.set('user', JSON.stringify({ username: user.username }), { expires: 365 });
        Cookies.set('acquiredPokemons', JSON.stringify([]), { expires: 365 }); // Inicializa como uma lista vazia
        // Redireciona para a página inicial após o login bem-sucedido
        router.push('/home');
      } else {
        loginError.value = true;
      }
    };

    const goToCadastro = () => {
      router.push('/cadastro');
    };

    return {
      username,
      password,
      loginError,
      handleLogin,
      goToCadastro,
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

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-card {
  max-width: 400px;
  width: 100%;
}

.error-message {
  color: red;
}
</style>
