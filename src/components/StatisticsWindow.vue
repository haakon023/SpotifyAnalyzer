<script lang="js">
import { ref } from 'vue';
import RefreshCircle from '../assets/icons/RefreshCircle.vue';
import { GetProfilePlaylists } from '../javascript/SpotifyRequests';
export default {
    props:{
        title: String,
        id: String,
        token: String
    },
    data(){
      const playlistsCount = ref(0);
      return{
        playlistsCount
      }
    },
    async mounted() {
      await this.getAmountOfPlaylists()

    },
    components:{
        RefreshCircle,
    },
    methods: {
      getAmountOfSongs(){

      },
      async getAmountOfPlaylists()
      {
        try {

          const playlists = await GetProfilePlaylists(this.id, this.token);
          this.playlistsCount = playlists.items.length;
          console.log(playlists)
        } catch (error) {
          console.log(error)
        }

      }
    },
    computed() {
    }
}
</script>

<template>
  <div class="analysis dark-gray card-radius">
    <h2 style="display: inline-block; margin-bottom: 0">
      {{ title
      }}<span style="width: fit-content">
        <RefreshCircle
          style="width: 24px; height: 24px"
          @click="getTracks"
          @emit="$emit('RefreshClicked')"
          class="icon"
        ></RefreshCircle>
      </span>
    </h2>
    <hr />

    <div class="NumberStatistics">
      <div>
        <h3># Songs</h3>
        <p>{{ getTrackAmount }}</p>
      </div>
      <div>
        <h3># Playlists</h3>
        <p>{{ playlistsCount }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.analysis {
  grid-column: 2 / 4;
  grid-row: 2 / 4;
  padding-left: 1em;
  padding-right: 1em;
  border-top-left-radius: 0;
}
</style>
