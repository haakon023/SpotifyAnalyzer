<script lang="js">
import { SessionStore } from '../stores/SessionStore';
import {storeToRefs} from 'pinia'
export default {

  data() {
    const { removeSession, getProfileData, checkSession} = storeToRefs(SessionStore());
    const store = SessionStore()
    const name = ""
    return {
      removeSession, getProfileData, store, name, checkSession
    }
  },
  async mounted() {
    await this.IsSignedInAndGetName()
  },
  methods: {
    //todo redirect to sign out page
    signout()
    {
      const store = SessionStore();
      store.removeSession();
      this.$router.push("/introduction");
    },
    async IsSignedInAndGetName() {
      const status = await this.store.checkSessionValid()
      if(status !== undefined && status.ok){
        this.name = this.getProfileData.name
        return true;
      }
      else {
        this.name = "Sign in";
        return false;
      }
    }
  },
  computed: {
    getName(){
      return this.name;
    },
    HasSession(){
      return this.checkSession === "ok" ? true : false;
    }
  },
  watch: {
    name : function(newValue){
      this.name = newValue;
    },
    getProfileData : function(newValue)
    {
      this.name = newValue.name
    }
  },
}
</script>

<template>
  <div class="header">
    <div v-if="HasSession" class="dropdown">
      <h1>{{ getName }}</h1>
      <div @click="signout()" class="dropdown-content">
        <p>Sign out</p>
      </div>
    </div>
    <div v-else>
      <h1>Sign in</h1>
    </div>
  </div>
</template>

<style scoped>
.header {
  border-bottom: 1px solid gray;
  justify-content: flex-end;
  width: 100%;
  display: flex;
  color: hsla(160, 100%, 37%, 1);
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  width: 100%;
  background-color: rgb(55, 55, 55);
  min-width: 5em;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 5px;
  z-index: 1;
  box-sizing: border-box;
}

.dropdown-content p {
  padding: 0;
  margin: 0;
  text-align: end;
  cursor: pointer;
}

.dropdown-content p:hover {
  background-color: rgb(97, 97, 97);
}
.dropdown-content p:active {
  background-color: rgb(44, 44, 44);
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
