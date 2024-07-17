<template>
  <q-card :class="['pokemon-card', { acquired }]">
    <q-card-section class="card-header">
      <div class="titulo text-h6">{{ pokemon.name }}</div>
    </q-card-section>
    <q-img :src="pokemon.image" class="pokemon-image" />
    <q-card-section class="card-footer">
      <div class="a text-subtitle2"><strong>Descrição:</strong> {{ pokemon.description }}</div>
      <div class="a text-subtitle2"><strong>Interação:</strong> {{ pokemon.acao }}</div>

      <div v-if="!acquired">
        <q-input
          v-model="password"
          :type="passwordVisible ? 'text' : 'password'"
          label="Digite a senha para adquirir"
          class="password-input"
          :append="passwordVisible ? 'visibility_off' : 'visibility'"
          @append="togglePasswordVisibility"
        />
        <q-btn
          class="acquire-btn"
          @click="acquirePokemon"
          :label="acquired ? 'Adquirido' : 'Adquirir'"
          color="black" 
          :disable="acquired"
        />
        <div v-if="passwordError" class="error-message">Senha incorreta. Tente novamente.</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Cookies from 'js-cookie'; // Importa a biblioteca js-cookie
import { defineProps } from 'vue';

// Define as props do componente
const props = defineProps({
  pokemon: {
    type: Object,
    required: true
  }
});

// Define o estado reativo para saber se o Pokémon foi adquirido
const acquired = ref(false);
const password = ref('');
const passwordVisible = ref(false);
const passwordError = ref(false);

// Função para adquirir um Pokémon e salvar o estado em um cookie
function acquirePokemon() {
  if (password.value === props.pokemon.password) {
    acquired.value = true;
    Cookies.set(`pokemon_${props.pokemon.id}`, 'acquired', { expires: 365 }); // Salva no cookie por 1 ano
    passwordError.value = false; 
  } else {
    passwordError.value = true; 
  }
}

// Alterna a visibilidade da senha
function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value;
}

// Verifica se o Pokémon já foi adquirido quando o componente é montado
onMounted(() => {
  acquired.value = Cookies.get(`pokemon_${props.pokemon.id}`) === 'acquired';
});
</script>

<style scoped>
.pokemon-card {
  height: auto;
  display: flex;
  flex-direction: column;
  border: 8px solid #dc9a02; 
  box-shadow: 0 6px 12px rgba(73, 71, 71, 0.3);
  background-color: #f5da3cde;
  border-radius: 0;
  transition: filter 0.3s; 
}

.pokemon-card.acquired {
  filter: grayscale(0%); 
}

.card-header {
  padding: 8px;
  text-align: center;
}

.pokemon-image {
  width: 100%;
  height: auto; 
  object-fit: cover;
  border: 8px solid #dc9a02; 
  margin: 0 auto; 
}

.card-footer {
  padding: 3px;
  width: 99%;
  text-align: left;
}

.text-h6 {
  color: #2D2D2D; 
  font-weight: bold;
}

.text-subtitle2 {
  color: #2D2D2D; 
}

strong {
  color: #FF0000; 
}

.titulo, .a {
  background-color: white;
}

.a {
  padding: 8px;
}

.acquire-btn {
  margin-top: 10px;
  color: white; 
}
</style>
