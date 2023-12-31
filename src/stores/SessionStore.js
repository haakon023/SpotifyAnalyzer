import { defineStore } from 'pinia'

export const SessionStore = defineStore("SessionStore", {
    state: () => (
        { session: "no_session", token: "", data: {id: "", name: ""} }
    ),
    getters: {
        checkSession: (state) => state.session,
        getToken: (state) => {
            return state.token;
        },
        getProfileData: (state) => state.data
    },
    actions: {
        async onSignedIn(token)
        {
            this.token = token
            this.session = "ok"

            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });

            const data = await response.json();
            this.data = {
                name: data.display_name,
                id: data.id
            }
        },
        //TODO probably move this into own method to add as a decorator
        async checkSessionValid() {
            //check if has session
            if (this.token === null || this.token === undefined || this.token === "") {
                this.session = "no_session"
                return;
            }
            //Check if session has expired
            //todo figure out how to even do that
            const response = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: 'Bearer ' + this.token
                }
            });
            return response;
        },
        removeSession() {
            this.token = "";
            this.data = {};
            this.session = "no_session"
            window.location.reload()
        }
    },
    persist:true
});