<script lang="js">
import { ref } from 'vue';
import RefreshCircle from '../assets/icons/RefreshCircle.vue';
import { GetProfilePlaylists, GetSpotifyTrackForPlaylist } from '../javascript/SpotifyRequests';
export default {
    props:{
        title: String,
        id: String,
        token: String
    },
    data(){
      const playlistsCount = ref(0);
      const playlists = ref(0);
      const tracksCount = ref(0);
      return{
        playlistsCount,
        playlists,
        tracksCount
      }
    },
    async mounted() {
      await this.initialize();

    },
    components:{
        RefreshCircle,
    },
    methods: {
      async initialize()
      {
        await this.getAmountOfPlaylists()
        await this.getAmountOfSongs();
      },
      async getAmountOfSongs(){
        let total = 0;
        try{
          for(let i = 0; i < this.playlistsCount; i++)
          {
            if (this.playlists[i].id === undefined || this.playlists[i].id === ""){
              continue;
            }
            const tracks = await GetSpotifyTrackForPlaylist(this.token, this.playlists[i].id);
            console.log(tracks);
            if(tracks === undefined)
              continue;
            total += tracks.length;
          }
        }catch(error)
        {
          console.log(error)
        }
        this.tracksCount = total;
        console.log(tracksCount)
      },
      async getAmountOfPlaylists()
      {
        try {

          const playlists = await GetProfilePlaylists(this.id, this.token);
          this.playlists = playlists.items;
          this.playlistsCount = playlists.items.length;
        } catch (error) {
          console.log(error)
        }
      },
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
        <p>{{ tracksCount }}</p>
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
