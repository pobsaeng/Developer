import Vue from 'vue'
import axios from "axios";
import Promise from 'bluebird'

export default {
  getTest(){
    return "Hello";
  },
  getService1(serverPath, authorization) {
    return new Promise((resolve, reject) => {
      Vue.$http.get(serverPath,
        {
          headers: { "X-Auth-Token": authorization }
        }).then(({ data }) => {
          resolve(data)

        }).catch((error) => {
          reject(error)

        })
    })
  },
  getPromise(serverPath) {
    return new Promise((resolve, reject) => {
      Vue.$http.get(serverPath).then(({ data }) => {
          resolve(data)

        }).catch((error) => {
          reject(error)

        })
    })
  },
  postPromise(path, params) {
    return new Promise((resolve, reject) => {
      Vue.$http.post(path, params, {
        headers: {
            "Content-Type": "application/json"
        }
        }).then(({ data }) => {
          resolve(data)

        }).catch((error) => {
          reject(error.response.data)

        })
    })
  },
  getAxiosPromise(path) {
    return new Promise((resolve, reject) => {
      axios(path, {
        method: "get",
      }).then(function(response) {
        resolve(response)

      }).catch(error => {
        reject(error.response.data)
        
      });
    });
  },
  insertPromise(path, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: path,
        headers: {
          "Content-Type": "application/json"
        },
        data: params
      }).then(function(response) {
        resolve(response)

      }).catch(error => {
        reject(error.response.data)
        
      });
  
    })
  },
  updatePromise(path, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: "put",
        url: path,
        headers: {
          "Content-Type": "application/json"
        },
        data: params
      }).then(function(response) {
        resolve(response)

      }).catch(error => {
        reject(error.response.data)
        
      });
  
    })
  },
  deletePromise(path, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: path,
        headers: {
          "Content-Type": "application/json"
        },
        data: params
      }).then(function(response) {
        resolve(response)

      }).catch(error => {
        reject(error.response.data)
        
      });
  
    })
  },
}
