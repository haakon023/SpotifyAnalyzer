import {defineStore} from 'pinia'

export const StatisticsStore = defineStore("StatisticsStore", {
    state: () => (
        {hasData: false, numberOfPlaylists: Number, numberOfSongs: Number}
    ),
    getters:{
        getHasData: (state) => state.hasData,
        getPlaylistAmount: (state) => state.numberOfPlaylists,
        getSongAmount: (state) => state.numberOfSongs
    },
    actions:{
        setHasData(flag){
            this.hasData = flag
        },
        setSongAmount(amount){
            this.numberOfSongs = amount
        },
        setPlaylistAmount(amount){
            this.numberOfPlaylists = amount
        }
    },
    persist:true
})