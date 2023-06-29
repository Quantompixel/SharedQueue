<template>
  <h1>Login</h1>
  <form @submit.prevent>
    <label for="username">Username:</label>
    <input id="username" v-model="username" type="text"><br>
    <label for="password">Password:</label>
    <input id="password" v-model="password" type="password"><br>
    <button class="submit-button" @click="loginRequest">Login</button>
  </form>
</template>

<script>
import router from "@/router";

export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: ""
    }
  },
  methods: {
    async loginRequest() {
      const response = await fetch(`http://${window.location.hostname}:4111/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        credentials: 'same-origin',
        body: JSON.stringify({
              username: this.username,
              password: this.password
            }
        )
      });

      if (!response.ok) {
        let data = await response.json();
        console.log(data);
        return;
      }

      let data = await response.json();
      sessionStorage.setItem("sessionKey", data.sessionKey);
      await router.push("/main");
    }
  }
}
</script>

<style scoped>

</style>