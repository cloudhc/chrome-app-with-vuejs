<template>
  <div>
    <div v-if="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <p class="joke">{{ joke }}</p>
    </div>
    <table id="list">
      <thead>
        <tr>
          <th v-for="c in contacts[0]">{{ c }}</th>
        </tr>
      </thead>
      <tbody id="trip">
        <tr v-for="(dataes, index) in contacts" v-if="index != 0">
          <td v-for="(e, idx) in dataes">
            <span v-if="e >= 10 && idx != 0" style="color:red">{{ e }}</span>
            <span v-else>{{ e }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {
      loading: true,
      joke: "",
      contacts: [[1,2,3,4]]
    }
  },
  created() {
    let vm = this;
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      axios.get("https://sheets.googleapis.com/v4/spreadsheets/1n3uci3ucTqJOA1nIDO90ihfPPJkpM6JQRSdwZdLN6aQ/values:batchGet?ranges=stats!M1:W13", { 'headers': { 'Authorization': 'Bearer ' + token }}
      ).then(res => {
        console.log(vm.contacts);
        vm.contacts = res.data.valueRanges[0].values;
        console.log(vm.contacts);
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

strong {
    font-weight: bold;
}

em {
    font-style: italic;
}

table {
    background: #f5f5f5;
    border-collapse: separate;
    box-shadow: inset 0 1px 0 #fff;
    font-size: medium;
    line-height: 24px;
    font-family: "Hanna", Jeju Gothic, Nanum Gothic, Serif;
    margin: 30px auto;
    text-align: center;
    width: 800px;
}

th {
    background: url(https://jackrugile.com/images/misc/noise-diagonal.png), linear-gradient(#777, #444);
    border-left: 1px solid #555;
    border-right: 1px solid #777;
    border-top: 1px solid #555;
    border-bottom: 1px solid #333;
    box-shadow: inset 0 1px 0 #999;
    color: #fff;
    font-weight: bold;
    padding: 10px 15px;
    position: relative;
    text-shadow: 0 1px 0 #000;
}

th:after {
    background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,.08));
    content: '';
    display: block;
    height: 25%;
    left: 0;
    margin: 1px 0 0 0;
    position: absolute;
    top: 25%;
    width: 100%;
}

th:first-child {
    border-left: 1px solid #777;
    box-shadow: inset 1px 1px 0 #999;
}

th:last-child {
    box-shadow: inset -1px 1px 0 #999;
}

td {
    border-right: 1px solid #fff;
    border-left: 1px solid #e8e8e8;
    border-top: 1px solid #fff;
    border-bottom: 1px solid #e8e8e8;
    font-weight: bold;
    padding: 10px 15px;
    position: relative;
    transition: all 300ms;
}

td:first-child {
    box-shadow: inset 1px 0 0 #fff;
}

td:last-child {
    border-right: 1px solid #e8e8e8;
    box-shadow: inset -1px 0 0 #fff;
}

tr {
    background: url(https://jackrugile.com/images/misc/noise-diagonal.png);
}

tr:nth-child(odd) td {
    background: #f1f1f1 url(https://jackrugile.com/images/misc/noise-diagonal.png);
}

tr:last-of-type td {
    box-shadow: inset 0 -1px 0 #fff;
}

tr:last-of-type td:first-child {
    box-shadow: inset 1px -1px 0 #fff;
}

tr:last-of-type td:last-child {
    box-shadow: inset -1px -1px 0 #fff;
}

tbody:hover td {
    color: transparent;
    text-shadow: 0 0 3px #aaa;
}

tbody:hover tr:hover td {
    color: #444;
    text-shadow: 0 1px 0 #fff;
}

.joke {
  max-width: 800px;
}
</style>
