<script lang="js">
import { ref } from 'vue';
//import { storeToRefs } from 'pinia'
import RefreshCircle from '../assets/icons/RefreshCircle.vue';
import { StatisticsStore } from '../stores/StatisticsStore';
import { GetProfilePlaylists, GetSpotifyTrackForPlaylist, GetArtists } from '../javascript/SpotifyRequests';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BarController } from 'chart.js'

export default {
  props: {
    title: String,
    id: String,
    token: String
  },
  data() {
    const playlistsCount = ref(0);
    const playlists = ref(0);
    const statisticsStore = StatisticsStore();
    const totalTracks = ref(0);
    const tracks = ref([]);
    const uniqueTracks = ref(0);
    const albums = ref([]);
    const albumCount = ref(0);
    const uniqueGenreCount = ref(0);
    const uniqueGenres = ref([]);
    const genres = ref([]);
    const uniqueArtists = ref([]);
    const genreDistribution = ref({});
    const topGenres = ref({});

    return {
      playlistsCount,
      playlists,
      //getSongAmount,
      statisticsStore,
      totalTracks,
      uniqueTracks,
      tracks,
      albums,
      albumCount,
      genreCount: uniqueGenreCount,
      uniqueGenres,
      genres,
      genreDistribution,
      uniqueArtists,
      topGenres
    }
  },
  async mounted() {
    await this.initialize();

    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

  },
  components: {
    RefreshCircle,
    Bar
},
  methods: {
    async initialize() {
      await this.getAmountOfPlaylists()
      await this.getTracks();
      await this.filterTracks();
      await this.getAlbums();
      await this.getGenres();
      await this.processGenres();
    },
    async getTracks() {
      const token = this.token;
      let allTracks = [];
      let dataPromises = [];

      for (let i = 0; i < this.playlists.length; i++) {
        let playlist = this.playlists[i];
        dataPromises.push(GetSpotifyTrackForPlaylist(token, playlist.id));
      }

      const dataResponses = await Promise.all(dataPromises);

      for (let data of dataResponses) {
        allTracks.push(data.items);
        data.forEach(item => this.tracks.push(item));
        this.totalTracks += data.length;
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
    async filterTracks() {
      let filteredTracks = [];
      let trackIds = [];
      for (let track of this.tracks) {
        if (trackIds.includes(track.track.id)) {
          continue;
        }
        trackIds.push(track.track.id);
        filteredTracks.push(track);
      }
      this.tracks = filteredTracks;
      this.uniqueTracks = filteredTracks.length;
    },
    async getAlbums() {
      let albumIds = [];
      for (let track of this.tracks) {
        if (albumIds.includes(track.track.album.id)) {
          continue;
        }
        albumIds.push(track.track.album.id);
        this.albums.push(track.track.album);
      }
      this.albumCount = this.albums.length;
    },
    async getGenres() {

      const artistIds = [];

      for (let track of this.tracks) {
        for (let artist of track.track.artists) {
          if (artistIds.includes(artist.id)) {
            continue;
          }
          artistIds.push(artist.id);
        }
      }

      const response = await GetArtists(this.token, artistIds);
      for (let i = 0; i < response.length; i++) {
        let artistBulk = response[i];
        for (let j = 0; j < artistBulk.length; j++) {
          let artist = artistBulk[j];
          if (!artist) {
            continue; // Skip to the next iteration
          }

          //Add artist to unique artists
          if (!this.uniqueArtists.includes(artist)) {
            this.uniqueArtists.push(artist);
          }


          //Add unique genre per artist in unique genres
          for (let k = 0; k < artist.genres.length; k++) {
            let genre = artist.genres[k];
            this.genres.push(genre);
            if (this.uniqueGenres.includes(genre)) {
              continue; // Skip to the next iteration
            }
            this.uniqueGenres.push(genre);
          }
        }
      }

      this.genreCount = this.uniqueGenres.length;

    },
    async processGenres() {
      let genreDistribution = {}
      //Get total genres per genre
      for (let genre of this.genres) {
        if (genreDistribution[genre]) {
          genreDistribution[genre] = { 'count': genreDistribution[genre].count + 1, 'percentage': (genreDistribution[genre].count / this.genres.length) * 100 };
        }
        else {
          genreDistribution[genre] = { 'count': 1, 'percentage': 0 };
        }
      }

      this.genreDistribution = genreDistribution;

      //Get top 10 of genre distributions
      let sortedGenres = Object.entries(genreDistribution).sort((a, b) => b[1].count - a[1].count);
      let top10Genres = sortedGenres.slice(0, 10);

      this.topGenres = Object.fromEntries(top10Genres);
    }
  },
  computed: {
    getTrackAmount() {
      return this.totalTracks;
    },
    getArtistCount() {
      return this.uniqueArtists.length;
    }
  }
}
</script>

<template>
  <div class="analysis dark-gray card-radius">
    <h2 style="display: inline-block; margin-bottom: 0">
      {{ title
      }}<span style="width: fit-content">
        <RefreshCircle style="width: 24px; height: 24px" @click="initialize" @emit="$emit('RefreshClicked')" class="icon">
        </RefreshCircle>
      </span>
    </h2>
    <hr />

    <div class="NumberStatistics">
      <div>
        <h3>Playlists</h3>
        <p>{{ playlistsCount }}</p>
      </div>
      <div>
        <h3>Tracks In Total</h3>
        <p>{{ getTrackAmount }}</p>
      </div>
      <div>
        <h3>Unique Tracks</h3>
        <p>{{ uniqueTracks }}</p>
      </div>
      <div>
        <h3>Unique Albums</h3>
        <p>{{ albumCount }}</p>
      </div>
      <div>
        <h3>Unique Artists</h3>
        <p>{{ getArtistCount }}</p>
      </div>
      <div>
        <h3>Unique Genres</h3>
        <p>{{ genreCount }}</p>
      </div>
    </div>
    <div class="charts">
      <Bar>
      </Bar>
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
