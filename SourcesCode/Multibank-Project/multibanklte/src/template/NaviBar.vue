<template>
<div>
  <header class="main-header">
    <div class="logo navbar-brand">
      <img src="../assets/images/krungsri-auto.png">
    </div>

    <!-- Header Navbar: style can be found in header.less -->
    <nav class="navbar navbar-static-top">
      <!-- Sidebar toggle button-->
      <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
        <span class="sr-only">Sidebar Toggle</span>
      </a>

      <div v-show="isLoggedIn" class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <li class="dropdown user user-menu">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">
              <img src="../assets/images/user2-160x160.jpg" class="user-image" alt="User Image">
              <span class="hidden-xs">{{username}} - {{fullname}}</span>
            </a>
            <ul class="dropdown-menu">
              <!-- User image -->
              <li class="user-header">
                <img src="../assets/images/user2-160x160.jpg" class="img-circle" alt="User Image">

                <p>
                  {{username}} - {{fullname}}
                </p>
              </li>
              <!-- Menu Body -->
              <!-- <li class="user-body">
                <div class="row">
                  <div class="col-xs-4 text-center">
                    <a href="#">Followers</a>
                  </div>
                  <div class="col-xs-4 text-center">
                    <a href="#">Sales</a>
                  </div>
                  <div class="col-xs-4 text-center">
                    <a href="#">Friends</a>
                  </div>
                </div>
              </li> -->
              <!-- Menu Footer-->
              <li class="user-footer">
                <div class="pull-left">
                  <a href="#" class="btn btn-default btn-flat">Profile</a>
                </div>
                <div class="pull-right">
                  <a @click="onSignOut" class="btn btn-default btn-flat">Sign out</a>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import { EventBus } from '@/misc/event-bus.js';
import SideBarModel from "../models/SideBarModel.js";

export default {
  name: "va-navibar",
  data(){
    return {
      isLoggedIn: false,
      username: "",
      fullname: "",
      userPrivilege: SideBarModel.userPrivilege
    }
  },
  created () {
    const me = this;
    EventBus.$on("isLoggedIn", function(values) {
      me.isLoggedIn = values.status;
      me.username = values.username;
      me.fullname = values.fullname;
    });
  },
  methods: {
    onSignOut(){
      // if(!!localStorage.isLoggedIn){}
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('privilege');
      EventBus.$emit('isLoggedIn', {status: false, username: ''});
      EventBus.$emit('slideMenuItems', {});
      this.$router.push('login');

       
      
    }
  }
};
</script>
