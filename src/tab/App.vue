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
                  <span v-if="e >= 10 && idx != 0 && idx != 11" style="color:red">{{ e }}</span>
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
    <div class="d-table">
      <div class="d-row">
        <canvas id="doughnutRegionsChart" height="450" width="800"></canvas>
        <canvas id="lineTripsChart" height="450" width="800"></canvas>
        <canvas id="lineTotalsChart" height="450" width="800"></canvas>
        <canvas id="radarTotalsChart" height="450" width="800"></canvas>
        <chartjs-line :labels="labels" :data="dataset" :bind="true"></chartjs-line>
      </div>
    </div>
    <div class="d-table">
      <div class="d-row">
        <div class="center-box" v-for="(index) in radar_lists">
          <chartjs-radar :labels="labels_radar" :data="dataset_radar[index]" :bind="true" v-if="totals.length > 0"></chartjs-radar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

var globalRegionsChart;
var globalTripsChart;
var globalLineTotalsChart;
var globalRadarTotalsChart;

export default {
  name: 'VueCharts',
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
      regions: [],
      dataentry: [],
      datalabel: [],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "SUM"],
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      dataset: [65, 59, 80, 81, 56, 55, 40],
      labels_radar: [],
      dataset_radar: [],
      radar_lists: [5, 6, 7, 8, 9]
    }
  },
  created() {
    let vm = this;

    chrome.identity.getAuthToken({interactive: true}, function(token) {
      let ranges = [['매년월별', 'stats!M1:X14'],
                    ['관광지별', 'stats!G1:H17'],
                    ['주요활동', 'totals!L1:R12'],
                    ['영화', 'totals!A1:B12'],
                    ['독서', 'totals!C1:D12'],
                    ['공영', 'totals!E1:F12'],
                    ['강연', 'totals!G1:H12'],
                    ['여행', 'totals!I1:J12']];

      ranges.forEach((value, index, array) => {
        axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1n3uci3ucTqJOA1nIDO90ihfPPJkpM6JQRSdwZdLN6aQ/values:batchGet?ranges=${value[1]}`, { 'headers': { 'Authorization': 'Bearer ' + token }}
        ).then(res => {
          if (index == 0) {
            vm.trips = res.data.valueRanges[0].values;
            let trips = vm.transpose(vm.trips);

            let tripsLabels = vm.trips[0].slice(1, vm.trips[0].length);
            globalTripsChart = vm.createChart('lineTripsChart',  vm.makeLineChartData(tripsLabels));
            vm.fillData(globalTripsChart, trips);
          } else if (index == 1) {
            vm.regions  = res.data.valueRanges[0].values;
            let regions = vm.transpose(vm.regions);

            let regionsLabels = vm.regions[0].slice(0, vm.regions[0].length-1);
            globalRegionsChart = vm.createChart('doughnutRegionsChart', vm.makeHalfDoughnutChartData(regionsLabels));
            vm.fillData(globalRegionsChart, regions);
          } else if (index == 2) {
            vm.totals = res.data.valueRanges[0].values;
            let totals = vm.transpose(vm.totals);

            let categoriesLabels = vm.totals[0].slice(1, vm.totals[0].length);
            globalLineTotalsChart = vm.createChart('lineTotalsChart', vm.makeLineChartData(categoriesLabels));
            vm.fillData(globalLineTotalsChart, totals);

            let yearsLabels = totals[0].slice(1, totals[0].length-1);
            globalRadarTotalsChart = vm.createChart('radarTotalsChart', vm.makeRadarChartData(yearsLabels));
            vm.fillData(globalRadarTotalsChart, vm.totals.slice(0, vm.totals.length-1));

            vm.totals.slice(0, vm.totals.length-1).forEach((row, index, array) => {
              if (index == 0) vm.labels_radar = row.slice(1, row.length-1);
              else vm.dataset_radar[index-1] = row.slice(1, row.length-1);
            });
          } else if (index == 3) {
            vm.movies = res.data.valueRanges[0].values;
            let movies = vm.transpose(vm.movies);

            movies.forEach((row, index, arrary) => {
              if (index == 0) vm.datalabel = row.slice(1, row.length-1);
              else vm.dataentry = row.slice(1, row.length-1);
            });
            vm.addData();
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
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId)
      let myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });

      return myChart;
    },
    addData() {
      this.labels = this.datalabel;
      this.dataset = this.dataentry;
      this.datalabel = [];
      this.dataentry = [];
    },
    fillData (graph, datas) {
      datas.forEach((row, index, array) => {
        if (index == 0) {
          graph.data.labels = row.slice(1, row.length-1);
        } else {
          graph.data.datasets[index-1].label = row[0];
          graph.data.datasets[index-1].data = row.slice(1, row.length-1);
        }
      });
      graph.update();
    },
    makeLineChartData(labels) {
      let datasets = [];

      labels.forEach(label => {
        let dataset = {
          label: '',
          data: [],
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)"
        };

        datasets.push(dataset);
      });

      let options = {
        responsive: true,
        lineTension: 1,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              padding: 25
            }
          }]
        }
      };

      let lineChartData = {
        type: 'line',
        data: {
          labels: [],
          datasets: datasets
        },
        options: options
      };

      return lineChartData;
    },
    makeDoughnutChartData(labels) {
      let datasets = [];

      labels.forEach(label => {
        let dataset = {
          label: label,
          data: [],
          backgroundColor: [
            'rgba(0, 0, 0, 0.7)',
            'rgba(0, 0, 128, 0.7)',
            'rgba(0, 0, 255, 0.7)',
            'rgba(0, 128, 0, 0.7)',
            'rgba(0, 128, 128, 0.7)',
            'rgba(0, 255, 0, 0.7)',
            'rgba(0, 255, 128, 0.7)',
            'rgba(0, 255, 255, 0.7)',
            'rgba(128, 0, 0, 0.7)',
            'rgba(128, 0, 128, 0.7)',
            'rgba(128, 128, 0, 0.7)',
            'rgba(128, 128, 128, 0.7)',
            'rgba(192, 128, 192, 0.7)',
            'rgba(255, 0, 0, 0.7)',
            'rgba(255, 0, 255, 0.7)',
            'rgba(255, 255, 0, 0.7)',
            'rgba(255, 255, 255, 0.7)'
          ],
          borderColor: [
            'rgba(0, 0, 0, 1)',
            'rgba(0, 0, 128, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 128, 0, 1)',
            'rgba(0, 128, 128, 1)',
            'rgba(0, 255, 0, 1)',
            'rgba(0, 255, 128, 1)',
            'rgba(0, 255, 255, 1)',
            'rgba(128, 0, 0, 1)',
            'rgba(128, 0, 128, 1)',
            'rgba(128, 128, 0, 1)',
            'rgba(128, 128, 128, 1)',
            'rgba(192, 192, 192, 1)',
            'rgba(255, 0, 0, 1)',
            'rgba(255, 0, 255, 1)',
            'rgba(255, 255, 0, 1)',
            'rgba(255, 255, 255, 1)'
          ],
          borderWidth: 1
        };

        datasets.push(dataset);
      });

      let doughnutChartData = {
        type: 'doughnut',
        data: {
          labels: [],
          datasets: datasets
        },
        options: {
          responsive: true,
          cutoutPercentage: 40,
        }
      };

      return doughnutChartData;
    },
    makeHalfDoughnutChartData(labels) {
      let halfDoughnutChartData = this.makeDoughnutChartData(labels);

      halfDoughnutChartData.options.rotation = 1 * Math.PI;
      halfDoughnutChartData.options.circumference = 1 * Math.PI;

      return halfDoughnutChartData;
    },
    makePolarAreaChartData(labels) {
      let polarAreaChartData = this.makeDoughnutChartData(labels);

      polarAreaChartData.type = "polarArea";

      return polarAreaChartData;
    },
    makeRadarChartData(labels) {
      let datasets = [];

      labels.forEach(label => {
        let dataset = {
          label: label,
          data: []
        };

        datasets.push(dataset);
      });

      let radarChartData = {
        type: 'radar',
        data: {
          labels: [],
          datasets: datasets,
          borderWidth: 1
        },
        options: {
          responsive: true,
          scale: {
            angleLines: {
              display: false
            },
            ticks: {
              suggestedMin: 50,
              suggestedMax: 100
            }
          }
        }
      };

      return radarChartData;
    },
    transpose(a) {
      return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
      });
    }
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
  height: 100%;
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
