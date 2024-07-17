<template>
  <q-layout view="hHh lpR fFf" class="layout">
    <q-header elevated class="header">
      <q-toolbar>
        <q-btn
          flat
          round
          dense
          icon="menu"
          @click="toggleLeftDrawer"
          class="header-btn"
        />
        <q-toolbar-title class="header-title">Bixomon Collection</q-toolbar-title>
        <q-btn flat round dense icon="home" to="/" class="header-btn" />
        <q-btn
          flat
          round
          dense
          label="Collection"
          to="/collection"
          class="header-btn"
        />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="page">
        <q-page-container class="page-container">
          <div class="pokemon-grid">
            <PokemonCard
              v-for="pokemon in pokemons"
              :key="pokemon.id"
              :pokemon="pokemon"
              :class="['pokemon-card-item', { 'acquired': pokemon.acquired }]"
            />
          </div>
        </q-page-container>
      </q-page>
    </q-page-container>
    <q-footer elevated class="footer">
      <q-toolbar class="footer-toolbar">
        <q-toolbar-title class="footer-title">Bixomon Collection © 2024</q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import PokemonCard from "./components/PokemonCard.vue";

export default {
  components: {
    PokemonCard,
  },
  data() {
    return {
      leftDrawerOpen: false,
      pokemons: [
        {
          id: 1,
          name: "Pikachu",
          description: "Um rato elétrico que solta raios pela cauda.",
          acao: "Se você encostar nele, ele irá gritar QUERO PIKA.",
          image: "/img/ovossauro.png",
          acquired: false,
        },
        {
          id: 2,
          name: "Bulbasaur",
          description: "Um Pokémon semente com um bulbo de planta nas costas.",
          acao: "Ele cresce absorvendo os raios do sol.",
          image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
          acquired: false,
        },
        {
          id: 3,
          name: "Charmander",
          description: "Um Pokémon de fogo com uma chama na ponta da cauda.",
          acao: "Se a chama se apagar, ele pode morrer.",
          image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
          acquired: false,
          password: "123"
        },
        {
          id: 4,
          name: "Squirtle",
          description: "Um Pokémon de água que atira água nos inimigos.",
          acao: "Ele se esconde em sua concha para se proteger.",
          image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
          acquired: false,
          password: "1235"
        },
        {
          id: 5,
          name: "Jigglypuff",
          description: "Um Pokémon balão que canta canções de ninar.",
          acao: "Seu canto faz todos dormirem.",
          image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/039.png",
          acquired: false,
        },
        {
          id: 6,
          name: "Meowth",
          description: "Um Pokémon gato que adora moedas.",
          acao: "Ele coleciona objetos brilhantes.",
          image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/052.png",
          acquired: false,
          password: "jeangay"
        },
        {
          id: 7,
          name: "Psyduck",
          description: "Um Pokémon pato que sofre de dores de cabeça.",
          acao: "Quando ele tem dor de cabeça, libera poderes psíquicos.",
          image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/054.png",
          acquired: false,
        },
        {
          id: 8,
          name: "Machop",
          description: "Um Pokémon superpoderoso que adora treinar.",
          acao: "Ele pode levantar 100 vezes o seu próprio peso.",
          image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/066.png",
          acquired: false,
        },
        {
          id: 9,
          name: "Geodude",
          description: "Um Pokémon rocha que sobe caminhos montanhosos.",
          acao: "Pode ser nocauteado com um único chute.",
          image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/074.png",
          acquired: false,
        },
        {
          id: 10,
          name: "Eevee",
          description: "Um Pokémon com uma composição genética instável.",
          acao: "Ele evolui para diferentes formas baseadas no ambiente.",
          image: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/133.png",
          acquired: false,
        },
      ],
    };
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
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

.header {
  background-color: #ffcb05;
  border-bottom: 4px solid #d3a400;
}

.header-btn {
  color: #4d4d4d;
}

.header-title {
  color: #3b4cca;
  font-family: "Press Start 2P", cursive;
}

.page-container {
  padding: 20px;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.pokemon-card-item {
  width: 100%;
  height: 100%;
  transition: transform 0.3s, box-shadow 0.3s, filter 0.3s;
  filter: grayscale(100%); 
}

.pokemon-card-item.acquired {
  filter: grayscale(0%); 
}

.pokemon-card-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  filter: grayscale(0%);
}

.footer {
  background-color: #ffcb05;
  border-top: 4px solid #d3a400;
}

.footer-toolbar {
  justify-content: center;
}

.footer-title {
  color: #3b4cca;
  font-family: "Press Start 2P", cursive;
}
</style>
