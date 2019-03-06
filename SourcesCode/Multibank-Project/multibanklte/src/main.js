// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@babel/polyfill'
import 'es6-promise/auto'
import Axios from 'axios'

//import all librarys
import './assets/lib/css'
import './assets/lib/script'
// import '@/assets/sysconfig/config';

window.$ = window.jQuery = require('jquery');

//Use JQuery Full-Calendar
import FullCalendar from "vue-full-calendar";
import "fullcalendar/dist/fullcalendar.min.css";
Vue.use(FullCalendar);

Axios.defaults.headers.common.Accept = 'application/json'
Axios.interceptors.response.use(
  response => response,
  (error) => {
    return Promise.reject(error)
  })
Vue.$http = Axios

import VueResource from 'vue-resource';
Vue.use(VueResource)

//Making validation
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

//Use Kendo UI
import '@progress/kendo-ui'
import '@progress/kendo-theme-default/dist/all.css'
import { ListBoxInstaller } from '@progress/kendo-listbox-vue-wrapper'
Vue.use(ListBoxInstaller)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data(){
    return {}
  },
  methods: {

  },
  components: { App },
  template: '<App/>'
})
