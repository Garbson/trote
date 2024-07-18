<template>
  <q-card :class="['pokemon-card', { acquired }]">
    <q-card-section class="card-header">
      <div class="titulo text-h6">{{ pokemon.name }}</div>
    </q-card-section>
    <q-img :src="pokemon.image" class="pokemon-image" />
    <q-card-section class="card-footer">
      <div class="a text-subtitle2"><strong>Descrição:</strong> {{ pokemon.description }}</div>
      <div class="a text-subtitle2"><strong>Interação:</strong> {{ pokemon.acao }}</div>
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
const code = ref('');
const codeError = ref(false);

// Função para adquirir um Pokémon e salvar o estado em um cookie
function acquirePokemon() {
  if (code.value === props.pokemon.code) {
    acquired.value = true;
    Cookies.set(`pokemon_${props.pokemon.id}`, 'acquired', { expires: 365 }); // Salva no cookie por 1 ano
    codeError.value = false; // Limpa a mensagem de erro
  } else {
    codeError.value = true; // Exibe mensagem de erro se o código estiver incorreto
  }
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
  transition: filter 0.3s; /* Adiciona uma transição suave para o filtro */
  filter: grayscale(100%); /* Aplica filtro cinza por padrão */
  margin-bottom: 20px;
}

.pokemon-card.acquired {
  filter: grayscale(0%); /* Remove filtro cinza se adquirido */
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
  color: #2D2D2D; /* Cor preta */
  font-weight: bold;
}

.text-subtitle2 {
  color: #2D2D2D; /* Cor preta */
}

strong {
  color: #FF0000; /* Cor vermelha */
}

.titulo, .a {
  background-color: white;
}

.a {
  padding: 8px;
}

.acquire-btn {
  margin-top: 10px;
}

.code-input {
  margin-bottom: 10px;
}

.error-message {
  color: red;
}
</style>
