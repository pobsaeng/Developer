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
        <li class="treeview">
          <router-link class="nav-link" to="/home">
            <i class="fa fa-home"></i> <span>Home</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </router-link>

          <!--<ul class="treeview-menu">
            <li><a href="#"><i class="fa fa-circle-o"></i> Dashboard 1</a></li>
            <li><a href="#"><i class="fa fa-circle-o"></i> Dashboard 2</a></li>
            <li><a href="#"><i class="fa fa-circle-o"></i> Dashboard 3</a></li>
          </ul>-->
        </li>
        <li class="treeview">
          <a class="nav-link" href="#">
            <i class="fa fa-database"></i> <span>System Admin</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </a>

          <ul class="treeview-menu">
            <li>
              
              <router-link to="/usermanagement">
                <i class="fa fa-circle-o"></i> <span>User Management</span>
              </router-link>
            </li>
            
            <li><a href="#"><i class="fa fa-circle-o"></i> Bank/Branch Management</a></li>
            <li>
            <!--<a href="#"><i class="fa fa-circle-o"></i> Holiday Management</a>-->
              <router-link class="nav-link" to="/holiday">
                <i class="fa fa-pencil"></i> <span>Holiday Management</span>
              </router-link>
            </li>

            <li><a href="#"><i class="fa fa-circle-o"></i> Bank Signature Management</a></li>
          </ul>
        </li>
        <li class="treeview">
          <router-link class="nav-link" to="/customer">
            <i class="fa fa-user"></i> <span>Customer Management</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </router-link>
        </li>
        <li class="treeview">
          <router-link class="nav-link" to="/cheque">
            <i class="fa fa-cube"></i> <span>Cheque Management</span>
            <span class="pull-right-container">
              <i class="fa fa-angle-left pull-right"></i>
            </span>
          </router-link>
        </li>
        <li class="treeview">
          <router-link class="nav-link" to="">
            <i class="fa fa-pencil"></i> <span>Daily Process</span>
          </router-link>
        </li>
        <li>
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
      isLoggedIn: false
    }
  },
  created () {
    const me = this;
    EventBus.$on("isLoggedIn", function(values) {
      me.isLoggedIn = values.status;
    });
  },
};
</script>
