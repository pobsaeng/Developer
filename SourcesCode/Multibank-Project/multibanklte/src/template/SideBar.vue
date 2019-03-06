<template>
  <!-- Left side column. contains the logo and sidebar -->
  <aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">

    <form action="#" method="get" class="sidebar-form">
      <div class="input-group">
        <input type="text" name="q" class="form-control" placeholder="Search...">
        <span class="input-group-btn">
              <button type="submit" name="search" id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i>
              </button>
            </span>
      </div>
    </form>

      <!-- sidebar menu: : style can be found in sidebar.less -->
      <ul class="sidebar-menu" data-widget="tree">
        <li class="treeview" v-show="userPrivilege.M_HOME">
          <router-link class="nav-link" to="/home">
            <i class="fa fa-home"></i> <span>Home</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </router-link>
        </li>
        <li class="treeview" v-show="userPrivilege.M_SYSTEMADMIN">
          <a class="nav-link" href="#">
            <i class="fa fa-database"></i> <span>System Admin</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>

          <ul class="treeview-menu">
            <li v-show="userPrivilege.M_USERMANAGEMENT">
              
              <router-link to="/usermanagement">
                <i class="fa fa-circle-o"></i> <span>User Management</span>
              </router-link>
            </li>
            
            <li v-show="userPrivilege.M_BANKBRANCH_MANAGEMENT"><a href="#"><i class="fa fa-circle-o"></i> Bank/Branch Management</a></li>
            <li v-show="userPrivilege.M_HOLIDAY_MANAGEMENT">
              <router-link class="nav-link" to="/holiday">
                <i class="fa fa-pencil"></i> <span>Holiday Management</span>
              </router-link>
            </li>

            <li v-show="userPrivilege.M_BANKSIGNATURE_MANAGEMENT"><a href="#"><i class="fa fa-circle-o"></i> Bank Signature Management</a></li>
          </ul>
        </li>
        <li class="treeview" v-show="userPrivilege.M_CUSTOMER_MANAGEMENT">
          <router-link class="nav-link" to="/customer">
            <i class="fa fa-user"></i> <span>Customer Management</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </router-link>
        </li>
        <li class="treeview" v-show="userPrivilege.M_CHEQUE_MANAGEMENT">
          <router-link class="nav-link" to="/cheque">
            <i class="fa fa-cube"></i> <span>Cheque Management</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </router-link>
        </li>
        <li class="treeview" v-show="userPrivilege.M_DAILAY_PROCESS">
          <router-link class="nav-link" to="">
            <i class="fa fa-pencil"></i> <span>Daily Process</span>
          </router-link>
        </li>
        <li v-show="userPrivilege.M_REPORT">
          <router-link class="nav-link" to="/report">
            <i class="fa fa-bars"></i> <span>Report</span>
          </router-link>
        </li>
      </ul>
    </section>
    <!-- /.sidebar -->
  </aside>
</template>

<script>
import { EventBus } from '@/misc/event-bus.js';

export default {
  name: "va-slider",
  data(){
    return {
      isLoggedIn: false,
      userPrivilege: {
        M_HOME: false,
        M_SYSTEMADMIN: false,
        M_USERMANAGEMENT: false,
        M_BANKBRANCH_MANAGEMENT: false,
        M_HOLIDAY_MANAGEMENT: false,
        M_BANKSIGNATURE_MANAGEMENT: false,
        M_CUSTOMER_MANAGEMENT: false,
        M_CHEQUE_MANAGEMENT: false,
        M_DAILAY_PROCESS: false,
        M_REPORT: false
      }
    }
  },
  mounted() {
    console.log("mounted!!");
    if (localStorage.accessToken && localStorage.privilege) {
      const privilege = JSON.parse(localStorage.privilege);
      EventBus.$emit('slideMenuItems', privilege);
    }
    if (localStorage.accessToken && localStorage.userAccount) {
      const userAccount = JSON.parse(localStorage.userAccount);
      
      EventBus.$emit('isLoggedIn', userAccount);
    }
    
  },
  created () {
    const me = this;
    EventBus.$on("isLoggedIn", function(values) {
      me.isLoggedIn = values.status;
    });

    EventBus.$on("slideMenuItems", function(value) {
      me.userPrivilege = value;
    });

  },
  methods: {},
  watch: {
    'userPrivilege': function (newVal, oldVal){
      for(var key in newVal){
        if(key == 'M_USERMANAGEMENT'
        || key == 'M_BANKBRANCH_MANAGEMENT'
        || key == 'M_HOLIDAY_MANAGEMENT'
        || key == 'M_BANKSIGNATURE_MANAGEMENT'){
          newVal.M_SYSTEMADMIN = true;
        }
      }
      
    },
  }
};
</script>
