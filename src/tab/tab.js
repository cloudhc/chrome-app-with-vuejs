import Vue from 'vue';
import App from './App';
import 'chart.js'
import 'hchs-vue-charts'

Vue.use(window.VueCharts)

new Vue({
  el: '#app',
  render: h => h(App)
});
