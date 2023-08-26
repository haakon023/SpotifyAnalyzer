import { SessionStore } from "../stores/SessionStore";

export async function RequestAccessTokenFromSpotify() {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');

    if(code === null){
      console.log("Code does not exist in URL path")
      return;
    }
      
    let codeVerifier = localStorage.getItem('code_verifier');

    let body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'https://spotify.haakonfinstad.com/signin',
      client_id: '896c365d23084749ac25e60fc68a2910',
      code_verifier: codeVerifier
    })
    let success = false;
    await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: body
    })
      .then(response => {
        if (!response.ok) {
          console.log(body)
          throw new Error('HTTP status ' + response.status);
        }

        return response.json();
      })
      .then(data => {
        const store = SessionStore();
        store.onSignedIn(data.access_token)
        success = true;
      })
      .catch(error => {
        console.error('Error:', error);
      });
      return success;
  }

export function FetchAccessTokenFromStorage()
{
  return localStorage.getItem('SessionStore').token;
}

export function RemoveSessionFromStorage()
{
  localStorage.removeItem('SessionStore');
}

export function CheckIfSessionExipred()
{

}


function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
async function generateCodeChallenge(codeVerifier) {
    function base64encode(string) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return base64encode(digest);
}
export function RequestSignInToSpotify() {
    let string = generateRandomString(120);
    generateCodeChallenge(string).then(codeChallenge => {
        let state = generateRandomString(16);
        let scope = 'user-read-private user-modify-playback-state user-read-playback-state playlist-read-private playlist-read-collaborative user-read-email';

        localStorage.setItem('code_verifier', string);

        let args = new URLSearchParams({
            response_type: 'code',
            client_id: "896c365d23084749ac25e60fc68a2910",
            scope: scope,
            redirect_uri: "https://spotify.haakonfinstad.com/signin",
            state: state,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge
        });

        window.location = 'https://accounts.spotify.com/authorize?' + args;
    });

}