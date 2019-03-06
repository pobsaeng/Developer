<template>
<div class="row">
  <div class="col-12">

    <div class="login-box">
      <!-- /.login-logo -->
      <div class="login-box-body">
        <p class="login-box-msg">Sign in to start your session</p>
        <div>

          <div v-if="error" class="alert alert-danger">
            <a class="close" data-dismiss="alert">&times;</a>
            {{ error }}
          </div>

          <div class="form-group has-feedback">
            <input type="text" class="form-control" placeholder="Username" v-model="loginRequest.username">
            <span class="glyphicon glyphicon-user form-control-feedback"></span>
          </div>
          <div class="form-group has-feedback">
            <input type="password" class="form-control" placeholder="Password" v-model="loginRequest.password">
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
          </div>
          <div class="row">
            <div class="col-xs-12">
              <button type="submit" @click="doLogin" class="btn btn-primary btn-block btn-flat">Sign In</button>
            </div>
            <!-- /.col -->
          </div>
        </div>
        
      </div>
    </div>

  </div>
</div>

</template>

<script>
import axios from "axios";
import { EventBus } from '@/misc/event-bus.js';
import MenuItemModel from "../models/MenuItemModel.js";
import Service from '../service/index.js';

export default {
  name: 'Login',
  data: function () {
    return {
      MenuItemModel: MenuItemModel,
      loginRequest: {
        username: '',
        password: ''
      },
      error: ''
    }
  },
  methods: {
    doFindAll(){
      const path = this.$root.$children[0].paths.server_path;
      const verbs = this.$root.$children[0].paths.verbs;
      const url = path + verbs.user.findall;

      Service.getPromise(url).then(function(values) {
        console.log(JSON.stringify(values));
      }).catch((error) => {
        console.log("++++++++++++");
        console.log(error);
      })
      
    },
    doLogin(){
      const me = this;
      const path = me.$root.$children[0].paths.server_path;
      const verbs = me.$root.$children[0].paths.verbs;
      const url = path + verbs.auth.login;

      me.loginRequest.username = me.loginRequest.username.trim();
      me.loginRequest.password = me.loginRequest.password.trim();

      Service.postPromise(url, me.loginRequest).then(function(response) {
        
        me.savetoLocalStorage(response);

        EventBus.$emit('isLoggedIn', {
          status: true,
          username: response.data.username,
          fullname: response.data.name
        });

        me.getMenu(response.menu, function(result){
          localStorage.privilege = JSON.stringify(result);
          EventBus.$emit('slideMenuItems', result);
        });
        
        me.$router.push('/');

      }).catch((error) => {
        console.log(error.message);
      })
    },
    savetoLocalStorage(response){
      localStorage.accessToken = JSON.stringify(response.token);
      localStorage.userAccount = JSON.stringify({
        status: true,
        username: response.data.username,
        fullname: response.data.name
      });
    },
    login: function () {
      const me = this;
      const path = me.$root.$children[0].paths.server_path;
      const verbs = me.$root.$children[0].paths.verbs;
      const url = path + verbs.auth.login;

      me.loginRequest.username = me.loginRequest.username.trim();
      me.loginRequest.password = me.loginRequest.password.trim();

      axios({
        method: "post",
        url: url,
        headers: {
          "Content-Type": "application/json"
        },
        data: me.loginRequest
        }).then(function(response) {
          const responseData = response.data;
          localStorage.accessToken = JSON.stringify(responseData.token);
          localStorage.userAccount = JSON.stringify({
            status: true,
            username: responseData.data.username,
            fullname: responseData.data.name
          });

          // console.log(JSON.stringify(responseData.token));
          // console.log(responseData);
          // console.log(responseData.data.username);
          // console.log(responseData.data.name);
          
          EventBus.$emit('isLoggedIn', {
            status: true,
            username: responseData.data.username,
            fullname: responseData.data.name
          });

          me.getMenu(responseData.menu, function(result){
            localStorage.privilege = JSON.stringify(result);
            EventBus.$emit('slideMenuItems', result);
          });
          
          me.$router.push('/');
          // console.log(data);
        },
        function (response) {
          console.log(response);
        }
      )
    },
    getMenu(values, callback){
      const menu = {}
      for (var key in values) {
        menu[values[key].privilege] = true;
      }
      callback(menu);
    }
  }
}
</script>
