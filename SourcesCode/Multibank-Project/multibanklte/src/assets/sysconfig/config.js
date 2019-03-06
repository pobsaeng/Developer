import PathConfig from '@/assets/store/server/server-path.json'
import Vue from 'vue'
/*+++ Choose path for configuration ++++*/
Vue.mixin(serverPathConfig())

function serverPathConfig() {
  return {
    data: function () {
      return {
        get SERVER_PATH() {
          console.log("server_path: "+PathConfig.server_path);
          return PathConfig.server_path;
        },
        get USER_VERBS() {
          return PathConfig.server_verbs.user;
        },
        imageLoading: false,
        isLogin: false,
        currentUser: ''
      }
    }
  }
}

function localPathConfig() {
  return {
    data: function () {
      return {
        get SERVER_PATH() {
          return PathConfig.local_path;
        },
        get USER_VERBS() {
          return PathConfig.local_verbs.user;
        },
        imageLoading: false,
        isLogin: false,
        currentUser: ''
      }
    }
  }
}
