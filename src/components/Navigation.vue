<template>
  <header>
    <section>
      <div class="col1">
        <router-link to="dashboard"><h3>Vuegram</h3></router-link>
        <ul class="inline">
          <li><router-link to="dashboard">Dashboard</router-link></li>
          <li><router-link to="settings">Settings</router-link></li>
          <li><a @click="logout">Logout</a></li>
        </ul>
      </div>
    </section>
  </header>
</template>

<script>
import {auth} from '../firebaseConfig';

export default {
  name: "Navigation",
  methods: {
    logout() {
      auth.signOut()
      .then(() => {
        this.$store.dispatch('clearData');
        this.$router.push('/login'); // TODO: why push and not replace
      })
      .catch(error => {
        alert(`${error}`)
      })
    }
  }
};
</script>

<style></style>
