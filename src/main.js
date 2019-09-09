import Vue from 'vue'
import App from './App.vue'
import './assets/css/reset.css'
import router from './router/router.js'


new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
