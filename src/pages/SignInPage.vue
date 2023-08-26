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
    async SignInToSpotify() {
      var path = await RequestSignInToSpotify();
      this.navigateTo(path);
      
    },
    async RequestAccessToken(){
      return await RequestAccessTokenFromSpotify()
    },
    GoToHome()
    {
      this.$router.push("/");
    },
    navigateTo(to) {
      window.location.href = to;
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
