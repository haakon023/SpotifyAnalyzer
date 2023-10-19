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

export async function GetAlbums(token, albumIds) {
    //spotify bulk albums has max 20 album id per request
    let albums = [];
    try {
        while(albumIds.length > 0)
        {
            let albumFilterIds = "";
            for (let i = 0; i < 20; i++) {
                if(albumIds.length <= 0)
                    break;
                
                albumFilterIds += albumIds.pop() + ",";
            }
            albumFilterIds = albumFilterIds.slice(0, -1);
            
            const url = 'https://api.spotify.com/v1/albums?ids=' + albumFilterIds;
            let request = new Request(url, { method: "GET", headers: { Authorization: 'Bearer ' + token } })
            const response = await useFetchCached("album", url, request);
            if(response && response.albums)
                albums.push(response.albums);
        }
    } catch (error) {
        console.log(error);
    }
    return albums;
}

const delay = ms => new Promise(res => setTimeout(res, ms));
//Get all songs from each playlist
//Might be exeeding rate limit from spotify
export async function GetSpotifyTrackForPlaylist(token, playlistId) {
    let tracks = [];
    let hasMoreTracks = true;
    let url = 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks';


    if (!playlistId) {
        console.log("Something wrong with playlistid: " + playlistId)
        return;
    }

    try {
        while (hasMoreTracks) {
            let request = new Request(url, { method: "GET", headers: { Authorization: 'Bearer ' + token } });
            var response = await useFetchCached("playlist", url, request);

            if (!response || !response.items) {
                console.log("Error: Invalid or empty response");
                hasMoreTracks = false;
                break;
            }

            response.items.forEach(track => {
                tracks.push(track);
            });

            url = response.next;

            if (!url) {
                hasMoreTracks = false;
                break;
            }

            await delay(1000);
        }
    } catch (error) {
        console.error("Error in GetSpotifyTrackForPlaylist:", error);
    }

    return tracks;
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