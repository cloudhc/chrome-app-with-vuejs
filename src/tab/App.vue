<template>
  <div style="width: 80%;">
    <div class="d-table">
      <div class="d-row">
        <div v-if="loading">
          <p>Loading...</p>
        </div>
        <div v-else>
          <p class="joke">{{ joke }}</p>
        </div>
      </div>
    </div>
    <div class="d-table">
      <div class="d-row">
        <div class='left-box'>
          <table id="trips">
            <thead>
              <tr>
                <th v-for="c in trips[0]">{{ c }}</th>
              </tr>
            </thead>
            <tbody id="list">
              <tr v-for="(dataes, index) in trips" v-if="index != 0">
                <td v-for="(e, idx) in dataes">
                  <span v-if="e >= 10 && idx != 0" style="color:red">{{ e }}</span>
                  <span v-else>{{ e }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class='right-box'>
          <table id="tatals">
            <thead>
              <tr>
                <th v-for="c in totals[0]">{{ c }}</th>
              </tr>
            </thead>
            <tbody id="list">
              <tr v-for="(dataes, index) in totals" v-if="index != 0">
                <td v-for="(e, idx) in dataes">{{ e }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="d-table">
      <div class="d-row">
        <div class='center-box'>
          <table id="movies">
            <thead>
              <tr>
                <th v-for="c in movies[0]">{{ c }}</th>
              </tr>
            </thead>
            <tbody id="list">
              <tr v-for="(dataes, index) in movies" v-if="index != 0">
                <td v-for="(e, idx) in dataes">{{ e }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class='center-box'>
          <table id="books">
            <thead>
              <tr>
                <th v-for="c in books[0]">{{ c }}</th>
              </tr>
            </thead>
            <tbody id="list">
              <tr v-for="(dataes, index) in books" v-if="index != 0">
                <td v-for="(e, idx) in dataes">{{ e }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class='center-box'>
          <table id="concerts">
            <thead>
              <tr>
                <th v-for="c in concerts[0]">{{ c }}</th>
              </tr>
            </thead>
            <tbody id="list">
              <tr v-for="(dataes, index) in concerts" v-if="index != 0">
                <td v-for="(e, idx) in dataes">{{ e }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class='center-box'>
          <table id="lectures">
            <thead>
              <tr>
                <th v-for="c in lectures[0]">{{ c }}</th>
              </tr>
            </thead>
            <tbody id="list">
              <tr v-for="(dataes, index) in lectures" v-if="index != 0">
                <td v-for="(e, idx) in dataes">{{ e }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class='center-box'>
          <table id="travels">
            <thead>
              <tr>
                <th v-for="c in travels[0]">{{ c }}</th>
              </tr>
            </thead>
            <tbody id="list">
              <tr v-for="(dataes, index) in travels" v-if="index != 0">
                <td v-for="(e, idx) in dataes">{{ e }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class='center-box'>
          <table id="regions">
            <thead>
              <tr>
                <th v-for="c in regions[0]">{{ c }}</th>
              </tr>
            </thead>
            <tbody id="list">
              <tr v-for="(dataes, index) in regions" v-if="index != 0">
                <td v-for="(e, idx) in dataes">{{ e }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data () {
    return {
      loading: true,
      joke: "",
      trips: [],
      totals: [],
      movies: [],
      books: [],
      concerts: [],
      lectures: [],
      travels: [],
      regions: []
    }
  },
  created() {
    let vm = this;
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      let ranges = [['매년월별', 'stats!M1:W13'],
                    ['관광지별', 'stats!G1:H16'],
                    ['주요활동', 'totals!L1:Q11'],
                    ['영화', 'totals!A1:B11'],
                    ['독서', 'totals!C1:D11'],
                    ['공영', 'totals!E1:F11'],
                    ['강연', 'totals!G1:H11'],
                    ['여행', 'totals!I1:J11']];

      ranges.forEach((value, index, array) => {
        axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1n3uci3ucTqJOA1nIDO90ihfPPJkpM6JQRSdwZdLN6aQ/values:batchGet?ranges=${value[1]}`, { 'headers': { 'Authorization': 'Bearer ' + token }}
        ).then(res => {
          if (index == 0) {
            vm.trips = res.data.valueRanges[0].values;
          } else if (index == 1) {
            vm.regions = res.data.valueRanges[0].values;
          } else if (index == 2) {
            vm.totals = res.data.valueRanges[0].values;
          } else if (index == 3) {
            vm.movies = res.data.valueRanges[0].values;
          } else if (index == 4) {
            vm.books = res.data.valueRanges[0].values;
          } else if (index == 5) {
            vm.concerts = res.data.valueRanges[0].values;
          } else if (index == 6) {
            vm.lectures = res.data.valueRanges[0].values;
          } else if (index == 7) {
            vm.travels = res.data.valueRanges[0].values;
          } else {
            alert("invalid index");
          }
        });
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
    font-size: small;
    line-height: 9px;
    font-family: "Hanna", Jeju Gothic, Nanum Gothic, Serif;
    margin: 2px auto;
    text-align: center;
    width: 100%;
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
    padding: 5px 5px;
    position: relative;
    text-shadow: 0 1px 0 #000;
}

th:after {
    background: linear-gradient(rgba(255,255,255,0), rgba(255,255,255,.08));
    content: '';
    display: block;
    height: 5%;
    left: 0;
    margin: 1px 0 0 0;
    position: absolute;
    top: 15%;
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
    padding: 5px 5px;
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

.left-box {
  float: left;
  width: 70%;
}

.right-box {
  float: right;
  width: 30%;
}

.d-table{
  display: table;
  width: 100%;
}

.d-row{
  display: table-row;
  width: 95%;
}

.center-box {
  float: center;
  display: table-cell;
  width: 16.6%;
}

.joke {
  max-width: 100%;
}
</style>
