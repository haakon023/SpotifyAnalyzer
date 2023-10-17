import { useFetchCached } from "../utility/fetchWrapper";
export async function GetProfilePlaylists(id, token) {
    let response = {};

    try {
        const url = 'https://api.spotify.com/v1/users/' + id + '/playlists?limit=50&offset=0';
        let request = new Request(url, { method: "GET", headers: { Authorization: 'Bearer ' + token } })
        response = await useFetchCached("playlist", url, request)

    } catch (error) {
        console.log(error)
    }
    return response;
}
const delay = ms => new Promise(res => setTimeout(res, ms));
//Get all songs from each playlist
//Might be exeeding rate limit from spotify
export async function GetSpotifyTrackForPlaylist(token, playlistId) {
    let tracks = [];
    let hasMoreTracks = true;
    let url = 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks';
    let request = new Request(url, { method: "GET", headers: { Authorization: 'Bearer ' + token } })
    try {
        while (hasMoreTracks) {
            let p = new Promise((resolve, reject) => { 
                resolve(useFetchCached("playlist", url, request))
            });
            p.then(result => result.items.forEach(track => {
                tracks.push(track)
                url = result.next;
            }));
            

            if (url === null) {
                hasMoreTracks = false;
                break;
            }
        }
    } catch (error) {
        console.log(error)
    }
    return tracks
}

//Fetch spotify playback state
export async function GetPlaybackState(token) {
    const response = await fetch('https://api.spotify.com/v1/me/player', {
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    if (response.status != "Ok")
        return null;
    return await response.json();
}

export async function SpotifyPlay(token) {
    const response = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'put',
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return await response;
}
export async function SpotifyPause(token) {
    const response = await fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'put',
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response
}

export async function SpotifySkip(token) {
    console.log("skip nextt")
    const response = await fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'post',
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response
}

export async function SpotifyPrevious(token) {
    const response = await fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'post',
        headers: {
            Authorization: 'Bearer ' + token
        }
    });
    return response
}