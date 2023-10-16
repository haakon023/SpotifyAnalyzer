<script lang="js">
import {storeToRefs} from 'pinia'
import { SessionStore } from '../stores/SessionStore';
import { SpotifyPlay, SpotifyPause, GetPlaybackState, SpotifySkip, SpotifyPrevious } from '../javascript/SpotifyRequests';

import {ref} from 'vue'
import moment from 'moment';
import playCircle from '../assets/icons/playCircle.vue'
import skipNextIcon from '../assets/icons/skipNext.vue';
import skipPreviousIcon from '../assets/icons/skipPrevious.vue';
import pauseCircle from '../assets/icons/pauseCircle.vue';

export default({
    components:{
        playCircle,
        skipNextIcon,
        skipPreviousIcon,
        pauseCircle
    },
    data() {
        const {getToken} = storeToRefs(SessionStore());
        const state = {}
        const percentage = ref(0);
        let timer = 0;
        let progressTime = 0;
        let currentTime_ms = 0;
        let isPlaying = false;
        return {
            getToken,
            state,
            percentage,
            timer,
            time: progressTime,
            currentTime_ms,
            isPlaying
        }
    },
    async mounted() {
        clearInterval(this.timer)
        await this.getPlayState()
    },
    methods: {
        tickTimer(){
            this.time += 1000;
            this.percentage = (this.state.progress_ms + this.time) / this.state.item.duration_ms  * 100;
            this.currentTime_ms += 1000;
        },
        async getPlayState(){
            this.state = await GetPlaybackState(this.getToken);
            if(this.state == null)
              return;
            this.isPlaying = this.state.is_playing;
            if(!this.isPlaying)
                return;
            this.timer = setInterval(this.tickTimer, 1000);
            this.setupTimeAndPercentage()
        },
        setupTimeAndPercentage(){
            if(this.state.item === undefined)
                return;
            this.currentTime_ms = this.state.progress_ms;
            this.percentage = this.state.progress_ms / this.state.item.duration_ms  * 100;
            return length
        },
        async PlayPauseClicked(){
            //Do callback to spotify to play/pause
            this.isPlaying = !this.isPlaying;
            if(!this.isPlaying)
            {
                await SpotifyPause(this.getToken);
                clearInterval(this.timer)
            }else{
                await SpotifyPlay(this.getToken);
                this.timer = setInterval(this.tickTimer, 1000);
            }
        },
        async SkipToNext()
        {
          await SpotifySkip(this.getToken);
        },
        async SkipToPrevious()
        {
          await SpotifyPrevious(this.getToken)
        }
    },
    computed: {
        getSongName()
        {
            if(this.state === null || this.state.item === undefined)
                return "";
            return this.state.item.name
        },
        getArtists()
        {
            if(this.state === null || this.state.item === undefined)
                return "";

            let artists = []
            this.state.item.artists.forEach(a => {artists.push(a.name)})
            return artists
        },
       getSongTimeInMinutes()
       {
        return moment(this.currentTime_ms).format("m:ss")
       },
       getTotalSongTime()
       {
        if(this.state === null || this.state.item === undefined)
            return;
        let length = moment(this.state.item.duration_ms).format("m:ss");
        return length;
       }
    },
    watch:{
        percentage : function(newValue){
            let sliderBar = document.getElementById("slider-bar");
            sliderBar.style.width = this.percentage + "%";
            this.percentage = newValue
            if(this.percentage > 100)
            {
                clearInterval(this.timer)
                this.time = 0;
                this.percentage = 0;
                this.getPlayState();
            }
        },
        currentTime: function(newTime)
        {
            this.currentTime = newTime;
        }
    },
    beforeUnmount() {
        clearInterval(this.timer)
    },
})
</script>

<template>
  <div class="xl-container grid justify-between grid-cols-3 grid-rows-2 row-start-4 col-start-1 col-span-2 dark-gray card-radius">
    <div class="song_details col-start-1">
      <h3 style="font-weight: bold; padding: 0; margin: 0">{{ getSongName }}</h3>
      <p>
        <span v-for="artist in getArtists" v-bind:key="artist">{{ artist }}</span>
      </p>
    </div>
    <div class="flex justify-center col-row-1 col-start-2">
      <skipPreviousIcon v-on:click="SkipToPrevious" class="h-12 w-12"></skipPreviousIcon>
      <playCircle
        v-on:click="PlayPauseClicked"
        v-if="!isPlaying"
        class="h-12 w-12"
      ></playCircle>
      <pauseCircle
        v-on:click="PlayPauseClicked"
        v-if="isPlaying"
        class="h-12 w-12"
      ></pauseCircle>
      <skipNextIcon v-on:click="SkipToNext" class="h-12 w-12"></skipNextIcon>
    </div>
    <div class="slider col-row-2 col-start-2">
      <p class="slider-text" style="grid-column: 1">
        {{ getSongTimeInMinutes }}
      </p>
      <div class="slider-bar-container card-radius">
        <div id="slider-bar" class="slider-bar card-radius"></div>
      </div>
      <p class="slider-text" style="grid-column: 3">{{ getTotalSongTime }}</p>
    </div>
  </div>
</template>

<style scoped>

.slider {
  display: grid;
  grid-template-columns: 5em 1fr 5em;
  align-content: center;
}
.slider-text {
  text-align: center;
  margin: auto;
}
.slider-bar {
  height: inherit;
  height: 12px;
  padding: 0;
  grid-column: 2;
  background-color: rgb(0, 88, 196);
}
.slider-bar-container {
  width: 100%;
  grid-column: 2;
  background-color: rgb(160, 160, 160);
  height: 10px;
  margin: auto;
}

.song_details {
  grid-column: 1;
  grid-row: 1 / 3;
  margin: auto;
  margin-left: 0;
  width: 100%;
}

.slider {
  align-self: top;
  grid-column: 2;
  grid-row: 2;
  padding: 0;
  margin: 0;
  height: 100%;
}
.slider p {
  margin: 0;
  padding: 0;
}
</style>
