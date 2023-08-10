<script>
export default {
  methods: {
    navigateTo(to) {
      this.$router.push(to);
    },
  },
};
</script>

<template>
  <main>
    <div class="greetings">
      <h1 class="green">Spotify Analytics</h1>
    </div>
    <hr />
    <div class="card dark-gray card-radius">
      <h2>Analyze Your Music!</h2>
      <p>
        Sign in with your spotify user, let us analyze the music you listen to view the
        type of music you listen to!
      </p>
    </div>
    <div class="card dark-gray card-radius">
      <h2>Discover New Music!</h2>
      <p>
        After your music has been analysed, we are able to recommend songs that you may
        enjoy!
      </p>
    </div>
    <hr />
    <div class="card btn dark-green card-radius" @click="navigateTo('/signin')">
      <h1>Get Started!</h1>
    </div>
  </main>
</template>

<style scoped>
.greetings {
  width: auto;
  flex: 1 1 0px;
  text-align: center;
}
.break {
  flex-basis: 100%;
}
.card {
  color: whitesmoke;
  box-shadow: 0px 0px 5px gray;
  flex-grow: 1;
  margin-top: 2em;
  padding: 1rem;
  max-width: 20vw;
}
.card h2 {
  text-align: center;
}
.card h1 {
  text-align: center;
  padding: 0;
}
main hr {
  flex-basis: 100%;
  border: none;
}
main {
  display: flex;
  flex-wrap: wrap;
  width: 60%;
  align-items: center;
  justify-content: center;
  column-gap: 1em;
  margin: auto;
}
</style>
