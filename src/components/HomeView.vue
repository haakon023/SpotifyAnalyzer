<script lang="js">
import {storeToRefs} from 'pinia'
import { SessionStore } from '../stores/SessionStore';
import { StatisticsStore } from '../stores/StatisticsStore';
import { GetProfilePlaylists } from '../javascript/SpotifyRequests.js'
import PlaybackView from "./PlaybackView.vue";

import StatisticsWindow from './StatisticsWindow.vue';

export default {
  components:{
    PlaybackView,
    StatisticsWindow
  },
  data() {
    const { getProfileData, getToken} = storeToRefs(SessionStore());
    const statisticsStore = StatisticsStore();
    const {getPlaylistAmount} = storeToRefs(StatisticsStore());
    let playlists = [];
    let allTracks = [];
    return {
      getProfileData,
      getToken,
      playlists,
      allTracks,
      statisticsStore,
      getPlaylistAmount
    }
  },
  async mounted() {
    await this.FetchProfilePlaylists();
  },
  methods: {
    async FetchProfilePlaylists() {
      const token = this.getToken;
      const id = this.getProfileData.id;

      //Todo fix a refresh token or update session to say not signed in
      const data = await GetProfilePlaylists(id, token)
      let playlists = []
      //This will fail and give error if profile is not signed in
      if(data.items === undefined)
        return;
      data.items.forEach(item => playlists.push(item))
      this.playlists = playlists;
      this.statisticsStore.setPlaylistAmount(playlists.length)
    },

  },computed: {
      FilteredPlaylists()
      {
        if(this.playlists === undefined){
          return false;
        }
          return true;
      },

      getPlaylistCount(){
        return this.getPlaylistAmount
      }
  },

}
</script>

<template>
  <main class="md-container w-full">
    <div class="main-frame-tabs">
      <div class="tab">
        <h2>Overview</h2>
      </div>
      <div class="tab">
        <h2>Playlist</h2>
      </div>
    </div>
    <StatisticsWindow
      title="Overall statistics"
      :token="this.getToken"
      :id="this.getProfileData.id"
    ></StatisticsWindow>
    <div class="playlists-card dark-gray card-radius" v-if="FilteredPlaylists">
      <h2>Playlists</h2>
      <div class="playlists">
        <div v-for="playlist in playlists" v-bind:key="playlist.id">
          <p>{{ playlist.name }}</p>
        </div>
      </div>
    </div>
    <div v-else class="playlists dark-gray card-radius">
      <h2>This user has no playlists</h2>
    </div>
    <PlaybackView></PlaybackView>
  </main>
</template>

<style scoped>
.playlists-card {
  grid-column: 1;
  grid-row: 2 / 4;
  overflow: hidden;
  padding: 5px;
  display: flex;
  flex-direction: column;
}

.main-frame-tabs {
  grid-column: 2;
  grid-row: 1;
  margin-bottom: -10px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  width: 25em;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.tab {
  background: linear-gradient(rgb(82, 82, 82), rgb(33, 33, 33));
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  text-align: center;
}
.tab:hover {
  transform: scaleY(1.1);
  background: linear-gradient(rgb(172, 172, 172), rgb(82, 82, 82), rgb(33, 33, 33));
  transform-origin: bottom;
}
.tab:active {
  transform: scaleY(1.1);
  transform-origin: bottom;
}
.tab:hover * {
  transform: scaleY(0.9);
}
.main-frame-tabs h2 {
  padding: 0;
  margin: 0;
}

.playlists-card h2 {
  text-align: center;
}

.playlists {
  overflow-y: scroll;
  padding: 1em;
}

.analysis {
  grid-column: 2 / 4;
  grid-row: 2 / 4;
  padding-left: 1em;
  padding-right: 1em;
  border-top-left-radius: 0;
}
main {
  display: grid;
  grid-template-rows: 2em minmax(5em, 100%) 5em 5em;
  grid-template-columns: 1fr 5fr;
  gap: 10px;
  overflow-y: hidden;
  padding: 5px;
}
</style>
