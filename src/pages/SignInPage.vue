<script lang="js">
import {
  RequestSignInToSpotify,
  RequestAccessTokenFromSpotify,
} from "../javascript/SpotifyAuthorization.js";

export default {
 data: function() {
    return {
        SignedIn: false
    };
},
async mounted() {
  this.SignedIn = await this.RequestAccessToken();
},
  methods: {
    SignInToSpotify() {
      RequestSignInToSpotify();
    },
    async RequestAccessToken(){
      return await RequestAccessTokenFromSpotify()
    },
    GoToHome()
    {
      this.$router.push("/");
    }
  },
};
</script>

<template>
  <div v-if="SignedIn">
    <h1>Thanks for signing in!</h1>
    <button @click="GoToHome()">Explore your music</button>
  </div>

  <div v-else>
    <h1>Sign in with Spotify</h1>
    <button @click="SignInToSpotify()">Login</button>
  </div>
</template>

<style scoped></style>
