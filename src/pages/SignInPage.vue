<script lang="js">
import {
  RequestSignInToSpotify,
  RequestAccessTokenFromSpotify,
} from "../javascript/SpotifyAuthorization.js";

export default {
  data: function () {
    return {
      SignedIn: false
    };
  },
  async mounted() {
    this.SignedIn = await this.RequestAccessToken();
  },
  methods: {
    async SignInToSpotify() {
      var path = await RequestSignInToSpotify();
      this.navigateTo(path);
      
    },
    async RequestAccessToken() {
      return await RequestAccessTokenFromSpotify()
    },
    GoToHome() {
      this.$router.push("/");
    },
    navigateTo(to) {
      window.location.href = to;
    }
  },
};
</script>

<template>
  <div class="container mx-auto h-screen">
    <div v-if="SignedIn" class="grid grid-cols-1 gap-4 h-full" >
      <h1 class="mx-auto text-2xl mt-auto">Thanks for signing in!</h1>
      <router-link to="/" class="mx-auto mb-auto button text-white">Explore your music</router-link>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 h-full">
      <button class="m-auto button" @click="SignInToSpotify()">Sign in with Spotify</button>
    </div>
  </div>
</template>