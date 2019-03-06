<template>
  <div id="app">
    <div class="wrapper">
      <!-- <va-navibar v-if="['login'].indexOf($route.name) != 0"></va-navibar>
      <va-sidebar v-if="['login'].indexOf($route.name) != 0"></va-sidebar>
      <va-content-wrap></va-content-wrap> -->

      <va-navibar></va-navibar>
      <va-sidebar></va-sidebar>
      <!-- <va-slider :slideMenuItems="slideMenuItems"></va-slider> -->
      <va-content-wrap></va-content-wrap>
    </div>
  </div>
</template>

<script>
import VANaviBar from "./template/NaviBar.vue";
import VASideBar from "./template/SideBar.vue";
import VASlider from './template/Slider.vue'
import VAContentWrap from "./template/ContentWrap.vue";
import paths from "./assets/store/server/server-path.json";
import Login from "./components/Login.vue";
import { EventBus } from "@/misc/event-bus.js";
// import slideMenuItems from './assets/store/client/slideMenuItems.js'
import store from './vuex/store.js'

export default {
  name: "App",
  data() {
    return {
      isLoggedIn: false,
      paths: paths,
      slideMenuItems: []
    };
  },
  mounted() {
    // this.isLoginStatus();
  },
  methods: {
    isLoginStatus() {
      if (!!localStorage.isLoggedIn) {
        this.isLoggedIn = true;
        this.$router.push('/login');
        
      }else{
        this.isLoggedIn = false;
        this.$router.push('/login');
      }
    }
  },
  created() {
    const me = this;
    EventBus.$on("isLoggedIn", function(values) {
      console.log(values);
      me.isLoggedIn = values.status;
    });
  },
  components: {
    "va-content-wrap": VAContentWrap,
    "va-navibar": VANaviBar,
    "va-sidebar": VASideBar,
    "va-slider": VASlider,
    "va-login": Login
  },
  store
};
</script>

<style scroped>
@import "./assets/customize/AdminLTE.css";
@import "./assets/customize/main.css";
@import "bootstrap/dist/css/bootstrap.min.css";
/* .wrapper{
  background-color: #515763 !important;
} */

</style>
