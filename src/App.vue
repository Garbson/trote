<template>
  <q-layout view="hHh lpR fFf" class="layout">
    <q-page-container>
      <q-page class="page">
        <q-page-container class="page-container">
          <div class="pokemon-grid">
            <PokemonCard
              v-for="pokemon in pokemons"
              :key="pokemon.id"
              :id="'pokemon-' + pokemon.id"
              :pokemon="pokemon"
              :class="['pokemon-card-item', { acquired: pokemon.acquired, rotate: pokemon.rotate, 'active-rotate': activePokemon === pokemon.id }]"
            />
          </div>
        </q-page-container>
      </q-page>
    </q-page-container>
    <q-footer elevated class="footer">
      <q-toolbar class="footer-toolbar">
        <q-toolbar-title class="footer-title">
          Bixomon Collection © 2024
        </q-toolbar-title>
        <q-btn
          label="Adicionar Código"
          color="black"
          text-color="white"
          @click="openCodeDialog"
        />
      </q-toolbar>
    </q-footer>

    <div v-if="activePokemon" class="overlay"></div>

    <q-dialog v-model="codeDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Digite o código</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="inputCode" label="Código" />
          <q-btn
            label="Confirmar"
            color="primary"
            @click="applyCode"
            class="q-mt-md"
          />
          <div v-if="codeError" class="error-message">Código incorreto. Tente novamente.</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>



<script>
import PokemonCard from "./components/PokemonCard.vue";
import { ref } from 'vue';
import Cookies from 'js-cookie';

export default {
  components: {
    PokemonCard,
  },
  data() {
    return {
      leftDrawerOpen: false,
      codeDialog: false,
      inputCode: '',
      codeError: false,
      activePokemon: null,
      pokemons: [
        {
          id: 1,
          name: "Pikachu",
          description: "Um rato elétrico que solta raios pela cauda.",
          acao: "Se você encostar nele, ele irá gritar QUERO PIKA.",
          image: "/img/ovossauro.png",
          acquired: false,
          code: "1234",
          rotate: false,
        },
        {
          id: 2,
          name: "Bulbasaur",
          description: "Um Pokémon semente com um bulbo de planta nas costas.",
          acao: "Ele cresce absorvendo os raios do sol.",
          image:
            "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
          acquired: false,
          code: "5678",
          rotate: false,
        },
        {
          id: 3,
          name: "Charmander",
          description: "Um Pokémon de fogo com uma chama na ponta da cauda.",
          acao: "Se a chama se apagar, ele pode morrer.",
          image:
            "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
          acquired: false,
          code: "91011",
          rotate: false,
        },
        {
          id: 4,
          name: "Squirtle",
          description: "Um Pokémon de água que atira água nos inimigos.",
          acao: "Ele se esconde em sua concha para se proteger.",
          image:
            "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
          acquired: false,
          code: "121314",
          rotate: false,
        },
        {
          id: 5,
          name: "Jigglypuff",
          description: "Um Pokémon balão que canta canções de ninar.",
          acao: "Seu canto faz todos dormirem.",
          image:
            "https://assets.pokemon.com/assets/cms2/img/pokedex/full/039.png",
          acquired: false,
          code: "151617",
          rotate: false,
        },
        {
          id: 6,
          name: "Meowth",
          description: "Um Pokémon gato que adora moedas.",
          acao: "Ele coleciona objetos brilhantes.",
          image:
            "https://assets.pokemon.com/assets/cms2/img/pokedex/full/052.png",
          acquired: false,
          code: "181920",
          rotate: false,
        },
        {
          id: 7,
          name: "Psyduck",
          description: "Um Pokémon pato que sofre de dores de cabeça.",
          acao: "Quando ele tem dor de cabeça, libera poderes psíquicos.",
          image:
            "https://assets.pokemon.com/assets/cms2/img/pokedex/full/054.png",
          acquired: false,
          code: "212223",
          rotate: false,
        },
        {
          id: 8,
          name: "Machop",
          description: "Um Pokémon superpoderoso que adora treinar.",
          acao: "Ele pode levantar 100 vezes o seu próprio peso.",
          image:
            "https://assets.pokemon.com/assets/cms2/img/pokedex/full/066.png",
          acquired: false,
          code: "242526",
          rotate: false,
        },
        {
          id: 9,
          name: "Geodude",
          description: "Um Pokémon rocha que sobe caminhos montanhosos.",
          acao: "Pode ser nocauteado com um único chute.",
          image:
            "https://assets.pokemon.com/assets/cms2/img/pokedex/full/074.png",
          acquired: false,
          code: "272829",
          rotate: false,
        },
        {
          id: 10,
          name: "Eevee",
          description: "Um Pokémon com uma composição genética instável.",
          acao: "Ele evolui para diferentes formas baseadas no ambiente.",
          image:
            "https://assets.pokemon.com/assets/cms2/img/pokedex/full/133.png",
          acquired: false,
          code: "303132",
          rotate: false,
        },
      ],
    };
  },
  created() {
    this.loadAcquiredPokemons();
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    openCodeDialog() {
      this.codeDialog = true;
    },
    applyCode() {
      const foundPokemon = this.pokemons.find(pokemon => pokemon.code === this.inputCode);
      if (foundPokemon) {
        foundPokemon.acquired = true;
        foundPokemon.rotate = true;
        this.activePokemon = foundPokemon.id;
        this.saveAcquiredPokemons();
        this.codeError = false;
        this.codeDialog = false;
        this.scrollToPokemon(foundPokemon.id);
        setTimeout(() => {
          foundPokemon.rotate = false;
          this.activePokemon = null;
        }, 4000); // Duração da animação (4 segundos)
      } else {
        this.codeError = true;
      }
    },
    scrollToPokemon(pokemonId) {
      this.$nextTick(() => {
        const element = document.getElementById('pokemon-' + pokemonId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    },
    saveAcquiredPokemons() {
      const acquiredPokemons = this.pokemons.filter(pokemon => pokemon.acquired).map(pokemon => pokemon.id);
      Cookies.set('acquiredPokemons', JSON.stringify(acquiredPokemons), { expires: 365 });
    },
    loadAcquiredPokemons() {
      const acquiredPokemons = JSON.parse(Cookies.get('acquiredPokemons') || '[]');
      this.pokemons.forEach(pokemon => {
        if (acquiredPokemons.includes(pokemon.id)) {
          pokemon.acquired = true;
        }
      });
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

.pokemon-card-item.rotate {
  animation: rotate-card 2s ease-in-out;
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

.error-message {
  color: red;
}

@keyframes rotate-card {
  0% {
    transform: rotateY(0deg) scale(1);
  }
  25% {
    transform: rotateY(180deg) scale(1.2);
  }
  50% {
    transform: rotateY(360deg) scale(1);
  }
  75% {
    transform: rotateY(540deg) scale(1.2);
  }
  100% {
    transform: rotateY(720deg) scale(1);
  }
}

.pokemon-card-item.rotate {
  animation: rotate-card 4s ease-in-out;
}

.pokemon-card-item.active-rotate {
  z-index: 1000;
  transform: scale(1.5);
}

/* Estilos para a sobreposição */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
}

/* Adiciona responsividade */
@media (max-width: 1200px) {
  .pokemon-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .pokemon-grid {
    grid-template-columns: 1fr;
  }
}


</style>
