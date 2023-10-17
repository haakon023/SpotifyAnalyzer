<script lang="js">
import { ref } from 'vue';
//import { storeToRefs } from 'pinia'
import RefreshCircle from '../assets/icons/RefreshCircle.vue';
import { StatisticsStore } from '../stores/StatisticsStore';
import { GetProfilePlaylists, GetSpotifyTrackForPlaylist } from '../javascript/SpotifyRequests';
export default {
  props: {
    title: String,
    id: String,
    token: String
  },
  data() {
    const playlistsCount = ref(0);
    const playlists = ref(0);
    //const { getSongAmount } = storeToRefs(StatisticsStore());
    const statisticsStore = StatisticsStore();
    const totalTracks = ref(0);
    const delay = ms => new Promise(res => setTimeout(res, ms));

    return {
      playlistsCount,
      playlists,
      //getSongAmount,
      statisticsStore,
      totalTracks,
      delay
    }
  },
  async mounted() {
    await this.initialize();

  },
  components: {
    RefreshCircle,
  },
  methods: {
    async initialize() {
      await this.getAmountOfPlaylists()
      this.getTracks();
    },
    getTracks() {
      const token = this.token
      this.allTracks = [];
      for (let i = 0; i < this.playlists.length; i++) {
        let playlist = this.playlists[i]

        let p = new Promise((resolve, reject) => {
            resolve(GetSpotifyTrackForPlaylist(token, playlist.id));
          });

        p.then((tracks) => {
          this.totalTracks += tracks.length;
        });

      this.statisticsStore.setHasData(true);
      this.statisticsStore.setSongAmount(this.allTracks.length);
      }
    },
    async getAmountOfPlaylists() {
      try {

        const playlists = await GetProfilePlaylists(this.id, this.token);
        this.playlists = playlists.items;
        this.playlistsCount = playlists.items.length;
      } catch (error) {
        console.log(error)
      }
    },
  },
  computed: {
    getTrackAmount() {
      return this.totalTracks;
    }
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
          @click="initialize"
          @emit="$emit('RefreshClicked')"
          class="icon"
        >
        </RefreshCircle>
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
