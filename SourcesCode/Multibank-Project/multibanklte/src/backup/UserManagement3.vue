<template>
<div>
<!-- Start point of modal form -->
<div id="listbox-modal" class="modal fade modal-wide">
  <div class="modal-dialog">
      <div class="modal-content">
        <div class="row">
          <div class="col-md-12">

          <div class="box-header with-bg-primary">
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">
                <i class="fa fa-times" style="color:#424242;" aria-hidden="true"></i>
              </span>
            </button>
            <h4 class="modal-title ">Create New User</h4>
          </div>
          <div id="modalBody" class="modal-body">
            <div class="row">
              <div class="col-md-12">

                <form class="form-horizontal" novalidate>
                  <div class="form-group">
                    <label class="control-label col-sm-3">Username: </label>
                    <div class="col-md-9">
                      <input type="text" 
                        v-model="UserModel.username"
                        name="username"
                        value="pob@gmail.com"
                        v-validate="'required'"
                        :disabled="isDisabled==true"
                        :class="{'input form-control': true, 'has-error': errors.has('username') }"/>
                      <p class="text-danger" v-if="errors.has('username')">{{ errors.first('username') }}</p>
                    </div>
                  </div>

                  <div class="form-group" v-show="isShow">
                    <label class="control-label col-sm-3">Password: </label>
                    <div class="col-md-9">
                      <input type="password"
                        v-model="UserModel.password"
                        value="1234"
                        name="password"
                        v-validate="'required'"
                        :class="{'input form-control': true, 'has-error': errors.has('password') }"/>
                      <p class="text-danger" v-if="errors.has('password')">{{ errors.first('password') }}</p>
                    </div>
                  </div>
                  <div class="form-group" v-show="isShow">
                    <label class="control-label col-sm-3">Re-type: </label>
                    <div class="col-md-9">
                      <input type="password"
                        v-model="UserModel.password_retype"
                        value="1234"
                        name="password_retype"
                        v-validate="'required'"
                        :class="{'input form-control': true, 'has-error': errors.has('password_retype') }"/>
                      <p class="text-danger" v-if="errors.has('password_retype')">{{ errors.first('password_retype') }}</p>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="control-label col-sm-3">Full Name: </label>
                    <div class="col-md-9">
                      <input type="text"
                        v-model="UserModel.fullname"
                        value="Kraipob Saengkhunthod"
                        name="fullname"
                        v-validate="'required'"
                        :class="{'input form-control': true, 'has-error': errors.has('fullname') }"/>
                      <p class="text-danger" v-if="errors.has('fullname')">{{ errors.first('fullname') }}</p>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="control-label col-sm-3">Email Address: </label>
                    <div class="col-md-9">
                      <input type="email" 
                        v-model="UserModel.email"
                        value="pob@gmail.com"
                        name="email"
                        v-validate="'required'"
                        :class="{'input form-control': true, 'has-error': errors.has('email') }"/>
                      <p class="text-danger" v-if="errors.has('email')">Please enter email.</p>
                    </div>
                  </div>
                </form>
                
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label class="control-label">Groups</label>
                  <div id="vueapp" class="vue-app">
                    <kendo-listbox id="listBoxItems"
                      @change="onListBoxItems"
                      :data-source=dsListItems
                      :data-text-field="'item_name'"
                      :data-value-field="'id'"
                      :navigatable="false"              
                      :draggable="false"
                      :connect-with="'listBoxSelected'"
                      :drop-sources="['listBoxSelected']"
                      :toolbar-tools="['transferTo', 'transferFrom', 'transferAllTo', 'transferAllFrom']"
                      style="min-width: 260px; width:100%;">
                    </kendo-listbox>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label class="control-label"></label>
                  <div id="vueapp" class="vue-app">
                    <kendo-listbox id="listBoxSelected"
                      @change="onListBoxSelectedChange"
                      :data-text-field="'item_name'"
                      :data-value-field="'id'"
                      :draggable="false"
                      :connect-with="'optional'"
                      :drop-sources="['optional']"
                      style="width:100%;"
                      name="listboxSelected">
                    </kendo-listbox>
                  </div>
                </div>
              </div>
              <p class="text-danger" v-if="errors.has('listboxSelected')">{{ errors.first('listboxSelected') }}</p>
            </div>
          </div>
          <div class="modal-footer">
             <div class="form-group pull-right">
              <button type="button" :disabled="isDisabled==true" class="btn btn-default" @click="onReset"><i class="fa fa-window-restore"></i> Reset</button>
              <button type="button" class="btn btn-primary" @click="onSave"><i class="fa fa-floppy-o"></i> Save</button>
            </div>
          </div>
          </div>
        </div>
          
      </div>
  </div>
</div>
<!-- Point of the end of the modal form   -->
<div class="row">      
  <div class="col-md-12">
    <div class="box box-krungsri">
      <div class="box-header with-border">
        <h3 class="box-title">User Management</h3>
      </div>
      <div class="box-body">

        <div class="row"> 
          
          <div class="col-md-4">
            <div class="btn-group">
              <div class="input-group add-on">
                <input class="form-control" placeholder="Search" name="srch-term" id="srch-term" type="text">
                <div class="input-group-btn">
                  <button class="btn btn-primary" type="submit" @click="onSearch"><i class="glyphicon glyphicon-search"></i></button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-8">
             <div class="btn-group pull-right">
              <button type="button" :disabled="isAddDisabled" class="btn btn-primary" @click="onListBox"><i class="fa fa-plus-square"></i> Add User</button>
              <button type="button" :disabled="isEditDisabled" class="btn btn-info" @click="onEdit"><i class="fa fa-pencil-square-o"></i> Edit User</button>
              <button type="button" :disabled="isDeleteDisabled" class="btn btn-danger" @click="onDelete"><i class="fa fa-trash-o"></i> Delete User</button>
              <button type="button" :disabled="isResetPassDisabled" class="btn btn-warning"><i class="fa fa-window-restore"></i> Reset Password</button>
              <button type="button" @click="onClear" class="btn btn-default"><i class="fa fa-eraser"></i> Clear</button>
            </div>
          </div>
        </div>
        <!--v-bind:class="[isRowActive ? activeClass : '', errorClass]"-->
        <div class="row top-buffer">
          <div class="col-xs-12">
            <table id="tblUM" class="table table-bordered table-striped table-hover">
              <thead>
              <tr>
                <th>User Name</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
              </thead>
              <tbody>
              <!--:class="{highlight: isRowActive}"-->
              <tr v-for="user of listAllUsers">
                <td :class="{highlight:cellSelected == user.id}" @click="onRowSelected(user.id)">{{user.id}}</td>
                <td :class="{highlight:cellSelected == user.id}" @click="onRowSelected(user.id)">{{user.fullname}}</td>
                <td :class="{highlight:cellSelected == user.id}" @click="onRowSelected(user.id)">{{user.username}}</td>
                <td :class="{highlight:cellSelected == user.id}" @click="onRowSelected(user.id)">{{user.email}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</div>

</div>
</template>

<script>
import $ from "jquery";
import UserModel from "../models/UserModel.js";
import axios from "axios";
export default {
  name: "usermanagement",
  data() {
    return {
      url: this.$root.$children[0].paths.local_path,
      verbs: this.$root.$children[0].paths.verbs,
      UserModel: UserModel,
      isDisabled: false,
      isShow: true,
      action: 'add',
      listAllUsers: [],
      cellSelected: '',
      isRowActive: false,
      isAddDisabled: false,
      isEditDisabled: true,
      isDeleteDisabled: true,
      isResetPassDisabled: true,
      dsSelectedItems: [],
      dsListItems: [//Here are should be reading from the service 
        { id: "1", item_name: "User Management", value: "10" },
        { id: "2", item_name: "Bank/Branch Management", value: "20" },
        { id: "3", item_name: "Holiday Management", value: "30" },
        { id: "4", item_name: "Bank Signature Management", value: "40" },
        { id: "5", item_name: "Home", value: "50" },
        { id: "6", item_name: "System Admin", value: "60" },
        { id: "7", item_name: "Customer Management", value: "70" },
        { id: "8", item_name: "Cheque Management", value: "70" },
        { id: "9", item_name: "Daily Management", value: "70" },
        { id: "10", item_name: "Report", value: "70" }
      ]
    };
  },
  mounted() {
    this.onGetUsers();
  },
  methods: {
    onListBoxSelectedChange(ev){
      var selectedIndex = ev.sender.select();
      var selectedItem = ev.sender.dataItem(selectedIndex).toJSON();
      console.log(selectedItem);
    },
    onListBoxItems(ev) {
      var selectedIndex = ev.sender.select();
      var selectedItem = ev.sender.dataItem(selectedIndex).toJSON();
      console.log(selectedItem);
      // var selectedIndex = ev.sender.select();
      // var selectedItem = ev.sender.dataItem(selectedIndex).toJSON();
      // this.model = selectedItem;
      // console.log(this.model);
      // var listBox = $("#selected").data("kendoListBox");
      // var items = listBox.dataSource._data;
      // for(var item of items){
      //   console.log(item.id, item.text, item.value)
      // }
      $("#listBoxSelected")
        .data("kendoListBox")
        .clearSelection();
    },
    onListBox() {
      $("#listbox-modal").modal({
          backdrop: "static",
          keyboard: false
      }).css({ width: "auto", heigh: "auto" });
      this.resetForm({});
    },
    onRowSelected(userId){
      const me = this;
      me.cellSelected = userId;
      me.isRowActive = true;
      this.action = 'edit';
    },
    onSave() {
      const me = this;
      if(me.action == 'add'){
        console.log("add!");
        var listBox = $("#listBoxSelected").data("kendoListBox");
        var listItems = listBox.dataSource._data;
        const list = [];
        for (var item of listItems) {
          list.push({ id: item.id, item_name: item.item_name});
        }
        me.UserModel.items = list;

        me.$validator.validateAll().then(result => {
          if (result) {
            console.log(JSON.stringify(me.UserModel));
            me.save(me.UserModel);
            return;
          }
        });
      }else{
        //For editing
        console.log("edit!");
      }
     
    },
    save(params) {
      const me = this;
      const url = me.url + me.verbs.auth.register;
      axios({
        method: "post",
        url: url,
        headers: {
          "Content-Type": "application/json"
        },
        data: params
      }).then(function(response) {
        console.log("----------Success---------");
        $('#listbox-modal').modal('hide');
        me.onGetUsers();
        me.isRowActive = false;
      }).catch(error => {
        console.log("----------Error---------");
        console.log(error.response.data);
        
      });
    },
    update(params) {
      console.log(params);
      const me = this;
      // const url = me.url + me.verbs.auth.update;
      // axios({
      //   method: "post",
      //   url: url,
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   data: params
      // }).then(function(response) {
      //   console.log("----------Success---------");
      //   $('#listbox-modal').modal('hide');
      //   me.onGetUsers();
      //   me.isRowActive = false;
      // }).catch(error => {
      //   console.log("----------Error---------");
      //   console.log(error.response.data);
      // });
    },
    onEdit(){
      const me = this;

      me.onGetUserById(this.cellSelected, function(data){
        me.UserModel = Object.assign({}, data.results.users);
        // me.dsSelectedItems = Object.assign([], data.results.Items);

        var listBoxItems = $("#listBoxItems").data("kendoListBox");
        // console.log(listBoxItems.dataItems())

        var listSelected = $("#listBoxSelected").data("kendoListBox");
        listSelected.setDataSource(data.results.Items);

        // var list = listBoxItems.dataSource.data();
        // for(var index in list){
        //   // console.log(index, list[index]);
        //   var i = listBoxItems.dataSource.view()[index];
        //   console.log(i);
        // }
        
        var raw = listSelected.dataSource.data();
        var length = raw.length;

        // iterate and remove "done" items
        var item, i;
        for(i=length-1; i>=0; i--){
          item = raw[i];
          console.log(item);
          
          // if (item.done){
          //   listBoxItems.remove(item);
          // }

        }

        //It happen while to do add an item at runtime.
        // listBoxItems.add = function(e) {
        //   console.log(e);
        // }
        //Take an object out of itself
        // listSelected.remove = function(e) {
        //   console.log("remove!");
        // }

        // listSelected.dataSource.data(Object.assign([], data.results.Items));
        // listSelected.dataSource.data(data.results.Items);
        //listbox.setDataSource(dataSource);
        // console.log(listSelected.dataSource._data); //.dataSource.data
        // console.log(listSelected.items()._data);
        // listBoxItems.remove(listSelected.items());

        $('#listbox-modal').modal('show');
      });
    },
    onDelete(){
      const me = this;
      me.onGetUserById(this.cellSelected, function(data){
        console.log(data);
      });
    },
    onSearch(){

    },
    onGetUsers() {
      const me = this;
      const url = me.url + me.verbs.auth.findall;
      axios
        .get(url, {
          method: "GET"
        })
        .then(response => {
          console.log(response.data);
          me.listAllUsers = response.data.users;
        })
        .catch(e => {
          console.log(e);
        });
    },
    onGetUserById(userId, callback) {
      const me = this;
      me.isRowActive = true;
      
      const url = me.url + me.verbs.auth.finbyuser;
      axios
        .get(url + '/' + userId, {
          method: "GET"
        })
        .then(response => {
          callback(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    resetForm(UserForm) {
      this.$validator.reset();
      for (var key in UserForm) {
        UserForm[key] = "";
      }
    },
    resetListBox() {
      var listSelected = $("#listBoxSelected").data("kendoListBox");
      listSelected.remove(listSelected.items());
      this.dsSelectedItems = [];
      
      var listItems = $("#listBoxItems").data("kendoListBox");
      // listItems.remove(listItems.items());
      listItems.dataSource.data(this.dsListItems);

      // this.dsSelectedItems = this.dsMenuItems;

      $("#listBoxItems").data("kendoListBox").clearSelection();
      $("#listBoxSelected").data("kendoListBox").clearSelection();
    },
    onReset() {
      this.resetForm(this.UserModel);
      this.resetListBox();
    },
    onClear(){
      this.action = 'add';
      this.isRowActive = false;
      this.cellSelected = '';
      this.dsSelectedItems = [];
      this.onReset();
    }
  },
  watch: {
    action: function(value) {
      if(value == 'add'){
        //Set up enable inputs for adding the data
        this.isDisabled = false;
        this.isShow = true;
      }else{
        //Set up enable inputs for editing the data
        this.isDisabled = true;
        this.isShow = false;
      }
    },
    isRowActive: function (bool) {
      if(bool){
        this.isAddDisabled = true;
        this.isEditDisabled = false;
        this.isDeleteDisabled = false;
        this.isResetPassDisabled = false;
      }else{
        this.isAddDisabled = false;
        this.isEditDisabled = true;
        this.isDeleteDisabled = true;
        this.isResetPassDisabled = true;
      }
    }
  }
};
</script>
<style scoped>

.table>tbody>tr.active>td {
  background-color: #123456;
  color: #fff;
}
/* .table-hover tbody tr:hover td {
  background-color: #9A0000;
  color: #fff;
} */
.modal-body {
  padding: 20px;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
}
/* .modal-footer {
  margin-top: 16px;
  padding: 10px;
  text-align: right;
  border-top: 1px solid #e5e5e5;
} */
@media (min-width: 768px) {
  .modal-dialog {
    width: 590px;
    margin: 30px auto;
  }
}
.modal-wide .modal-dialog {
  min-width: 30%;
}

.top-buffer {
  margin-top: 10px;
}
label {
  color: #000;
}
.form-group {
  margin-bottom: 10px;
}
.text-danger {
  height: 7px;
  color: #C50C03;
}
.has-error {
  border-color: none;
  /*box-shadow: none;*/
}
.highlight {
  border-color: none;
  background-color: #8B0000;
  color: #fff;
}
.btn-primary {
  background-color: #337ab7;
}
.btn-info {
  background-color: #269abc;
}
.btn-danger {
    background-color: #d43f3a;
}
.btn-warning {
  background-color: #eea236;
}
</style>
