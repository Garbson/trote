<template>
  <q-layout view="hHh lpR fFf" class="layout">
    <q-page-container>
      <q-page class="page">
        <q-page-container class="page-container">
          <div class="welcome-message">
            <p v-html="typedMessage"></p>
          </div>
          <div class="pokemon-grid">
            <PokemonCard
              v-for="pokemon in sortedPokemons"
              :key="pokemon.id"
              :id="'pokemon-' + pokemon.id"
              :pokemon="pokemon"
              :class="[
                'pokemon-card-item',
                {
                  acquired: pokemon.acquired,
                  rotate: pokemon.rotate,
                  'active-rotate': activePokemon === pokemon.id,
                },
              ]"
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
          <div v-if="codeError" class="error-message">
            Código incorreto. Tente novamente.
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import PokemonCard from "@/components/PokemonCard.vue";
import { ref, onMounted } from "vue";
import Cookies from "js-cookie";

export default {
  components: {
    PokemonCard,
  },
  data() {
    return {
      leftDrawerOpen: false,
      codeDialog: false,
      inputCode: "",
      codeError: false,
      activePokemon: null,
      typedMessage: "",
      message: `Seja bem-vindo! Nesse site, você pode montar a coleção de pokemons. Cada pokemon tem um código na sua placa. Coloque esse código em "Adicionar código" e obtenha o pokemon, podendo então ver a interatividade do pokemon. No total, são 28 pokemons. Boa sorte tentando capturar os 28! Este site faz parte do trote dos Alunos de Sistemas de Informação.`,
      pokemons: [
        {
          id: 1,
          name: "Jinkx",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/jinks.jpg",
          acquired: false,
          code: "3333",
          rotate: false,
        },
        {
          id: 2,
          name: "Gastly",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/geskley.jpg",
          acquired: false,
          code: "6969",
          rotate: false,
        },
        {
          id: 3,
          name: "Pikachu",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/pikachu.jpg",
          acquired: false,
          code: "1234",
          rotate: false,
        },
        {
          id: 4,
          name: "Charmander",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/gay.jpg",
          acquired: false,
          code: "2100",
          rotate: false,
        },
        {
          id: 5,
          name: "Squirtle",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/skartan.jpg",
          acquired: false,
          code: "3435",
          rotate: false,
        },
        {
          id: 6,
          name: "Psyduck",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/psyduck.jpg",
          acquired: false,
          code: "5183",
          rotate: false,
        },
        {
          id: 7,
          name: "Magikarp",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/magi_carp.jpg",
          acquired: false,
          code: "3211",
          rotate: false,
        },
        {
          id: 8,
          name: "Tauros",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/tauros.jpg",
          acquired: false,
          code: "6666",
          rotate: false,
        },
        {
          id: 9,
          name: "Digglet",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/digglet.jpg",
          acquired: false,
          code: "0000",
          rotate: false,
        },
        {
          id: 10,
          name: "Alakazam",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/Alacazam.jpg",
          acquired: false,
          code: "1089",
          rotate: false,
        },
        {
          id: 11,
          name: "Caterpie",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/carterpie.jpg",
          acquired: false,
          code: "3485",
          rotate: false,
        },
        {
          id: 12,
          name: "Snorlax",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/snorlax.jpg",
          acquired: false,
          code: "0800",
          rotate: false,
        },
        {
          id: 13,
          name: "Bulbasaur",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/wesley.jpg",
          acquired: false,
          code: "8308",
          rotate: false,
        },
        {
          id: 14,
          name: "Mew",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/mew.jpg",
          acquired: false,
          code: "4211",
          rotate: false,
        },
        {
          id: 15,
          name: "Lickitung",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image:
            "/img/lucting.jpg",
          acquired: false,
          code: "1934",
          rotate: false,
        },
        {
          id: 16,
          name: "Koffing",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/cofen.jpg",
          acquired: false,
          code: "7373",
          rotate: false,
        },
        // {
        //   id: 17,
        //   name: "Meowth",
        //   description: "",
        //   acao: "Toque nele e veja a mágica acontecer.",
        //   image: "/img/mew.jpg",
        //   acquired: false,
        //   code: "1129",
        //   rotate: false,
        // },
        {
          id: 18,
          name: "Vaporeon",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/valporoun.jpg",
          acquired: false,
          code: "1815",
          rotate: false,
        },
        {
          id: 19,
          name: "Slowbro",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image:
            "/img/slowbrow.jpg",
          acquired: false,
          code: "2359",
          rotate: false,
        },
        {
          id: 20,
          name: "Togepi",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/togepi.jpg",
          acquired: false,
          code: "2424",
          rotate: false,
        },
        {
          id: 21,
          name: "Flareon",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/flareon.jpg",
          acquired: false,
          code: "1722",
          rotate: false,
        },
        {
          id: 22,
          name: "Jigglypuff",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/jigllypof.jpg",
          acquired: false,
          code: "1474",
          rotate: false,
        },
        {
          id: 23,
          name: "Rattata",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/ratata.jpg",
          acquired: false,
          code: "0001",
          rotate: false,
        },
        {
          id: 24,
          name: "Ekans",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/ekans.jpg",
          acquired: false,
          code: "0311",
          rotate: false,
        },
        {
          id: 25,
          name: "Mr. Mime",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/mr_mine.jpg",
          acquired: false,
          code: "1969",
          rotate: false,
        },
        // {
        //   id: 26,
        //   name: "Jolteon",
        //   description: "",
        //   acao: "Toque nele e veja a mágica acontecer.",
        //   image:
        //     "https://assets.pokemon.com/assets/cms2/img/pokedex/full/000.png",
        //   acquired: false,
        //   code: "2000",
        //   rotate: false,
        // },
        {
          id: 27,
          name: "Vulpix",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/vulpix.jpg",
          acquired: false,
          code: "3141",
          rotate: false,
        },
        {
          id: 28,
          name: "Sandshrew",
          description: "",
          acao: "Toque nele e veja a mágica acontecer.",
          image: "/img/sandrow.jpg",
          acquired: false,
          code: "6996",
          rotate: false,
        },
      ],
    };
  },
  computed: {
    sortedPokemons() {
      return this.pokemons.slice().sort((a, b) => b.acquired - a.acquired);
    },
  },
  created() {
    this.loadUserPokemons();
  },
  mounted() {
    this.typeMessage();
  },
  methods: {
    typeMessage() {
      let i = 0;
      const speed = 50; // Speed in milliseconds
      const type = () => {
        if (i < this.message.length) {
          this.typedMessage += this.message.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      };
      type();
    },
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    openCodeDialog() {
      this.codeDialog = true;
    },
    applyCode() {
      const foundPokemon = this.pokemons.find(
        (pokemon) => pokemon.code === this.inputCode
      );
      if (foundPokemon) {
        foundPokemon.acquired = true;
        foundPokemon.rotate = true;
        this.activePokemon = foundPokemon.id;
        this.saveUserPokemons();
        this.codeError = false;
        this.codeDialog = false;
        this.scrollToPokemon(foundPokemon.id);
        setTimeout(() => {
          foundPokemon.rotate = false;
          this.activePokemon = null;
        }, 4000); // Duration of the animation (4 seconds)
      } else {
        this.codeError = true;
      }
    },
    scrollToPokemon(pokemonId) {
      this.$nextTick(() => {
        const element = document.getElementById("pokemon-" + pokemonId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    },
    saveUserPokemons() {
      const username = Cookies.get("user");
      if (username) {
        const acquiredPokemons = this.pokemons
          .filter((pokemon) => pokemon.acquired)
          .map((pokemon) => pokemon.id);
        Cookies.set(
          `userPokemons_${username}`,
          JSON.stringify(acquiredPokemons),
          { expires: 365 }
        );
      }
    },
    loadUserPokemons() {
      const username = Cookies.get("user");
      if (username) {
        const acquiredPokemons = JSON.parse(
          Cookies.get(`userPokemons_${username}`) || "[]"
        );
        this.pokemons.forEach((pokemon) => {
          if (acquiredPokemons.includes(pokemon.id)) {
            pokemon.acquired = true;
          }
        });
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

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

@media (max-width: 768px) {
  .pokemon-grid {
    grid-template-columns: 1fr;
  }
}

.pokemon-card-item {
  width: 100%;
  height: 100%;
  transition: transform 0.3s, box-shadow 0.3s, filter 0.3s;
  filter: grayscale(100%);
  background: #ffcb05; /* Matching card background */
  border: 2px solid #d3a400;
  border-radius: 10px;
  padding: 10px;
  font-family: "Press Start 2P", cursive;
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

/* Styles for the welcome message */
.welcome-message {
  background: rgba(0, 0, 0, 0.7);
  color: #ffcb05;
  font-family: "Press Start 2P", cursive;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  animation: fadeIn 2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Overlay styles */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
