<template>
  <div>
    <div v-if="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <p class="joke">{{ joke }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {
      loading: true,
      joke: ""
    }
  },
  created() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      axios.get("https://sheets.googleapis.com/v4/spreadsheets/1n3uci3ucTqJOA1nIDO90ihfPPJkpM6JQRSdwZdLN6aQ/values:batchGet?ranges=stats!M1:W13", { 'headers': { 'Authorization': 'Bearer ' + token }}
      ).then(res => {
        console.log(res);
      });
    });    
  },
  mounted() {
    axios.get("https://icanhazdadjoke.com/", { 'headers': { 'Accept': 'application/json' } }
    ).then(res => {
      this.joke = res.data.joke
      this.loading = false;
    });
  }
}
</script>

<style>
body {
  height: 98vh;
  text-align: center;
  color: #353638;
  font-size: 22px;
  line-height: 30px;
  font-family: Merriweather,Georgia,serif;
  background-size: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.joke {
  max-width: 800px;
}
</style>
