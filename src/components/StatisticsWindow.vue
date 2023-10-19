<script lang="js">
import { ref } from 'vue';
//import { storeToRefs } from 'pinia'
import RefreshCircle from '../assets/icons/RefreshCircle.vue';
import { StatisticsStore } from '../stores/StatisticsStore';
import { GetProfilePlaylists, GetSpotifyTrackForPlaylist, GetAlbums } from '../javascript/SpotifyRequests';
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
    const genreCount = ref(0);
    const genres = ref([]);

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
      genreCount,
      genres
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
      await this.getTracks();
      await this.filterTracks();
      await this.getAlbums();
      await this.getGenres();
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

      const albumsIds = [];
      this.albums.forEach(album => albumsIds.push(album.id));
      const albumContainer = await GetAlbums(this.token, albumsIds);

      for (let i = 0; i < albumContainer.length; i++) {
        let albumBulk = albumContainer[i];
        for (let j = 0; j < albumBulk.length; j++) {
          let album = albumBulk[j];
          if (!album) {
            console.log("does not have an album");
            continue; // Skip to the next iteration
          }
          console.log("has an album")
          console.log(album.genres + " " + album.name + " " + album.id)
          for (let k = 0; k < album.genres.length; k++) {
            let genre = album.genres[k];
            if (this.genres.includes(genre)) {
              console.log("already has genre");
              continue; // Skip to the next iteration
            }
            console.log("adding genre");
            this.genres.push(genre);
          }
        }
      }


      console.log(this.genres);
      this.genres.forEach(genre => {
        console.log(genre);
      });

      this.genreCount = this.genres.length;

    }
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
        <h3>Total Songs</h3>
        <p>{{ getTrackAmount }}</p>
      </div>
      <div>
        <h3>Unique Tracks</h3>
        <p>{{ uniqueTracks }}</p>
      </div>
      <div>
        <h3>Unique albums</h3>
        <p>{{ albumCount }}</p>
      </div>
      <div>
        <h3>Genres</h3>
        <p>{{ genreCount }}</p>
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
