<template>
<div>

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
                        :class="{'input form-control': true, 'has-error': errors.has('username') }"/>
                      <p class="text-danger" v-if="errors.has('username')">{{ errors.first('username') }}</p>
                    </div>
                  </div>

                  <div class="form-group">
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
                  <div class="form-group">
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
                    <kendo-listbox id="items"
                      @change="onChange"
                      :reorder="onReorder"
                      :data-source=dsMenuItems
                      :data-text-field="'text'"
                      :data-value-field="'id'"
                      :navigatable="true"              
                      :draggable="true"
                      :connect-with="'selected'"
                      :drop-sources="['selected']"
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
                    <kendo-listbox id="selected"
                        :value="modelValue"
                        :draggable="true"
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
            <!--data-dismiss="modal"-->
            <!-- <button class="btn btn-default" @click="onReset">Reset</button> 
            <button class="btn btn-default btn-lg" @click="onSave">Save</button> -->
             <div class="form-group pull-right">
              <button type="button" class="btn btn-default" @click="onReset"><i class="fa fa-window-restore"></i> Reset</button>
              <button type="button" class="btn btn-primary" @click="onSave"><i class="fa fa-floppy-o"></i> Save</button>
            </div>
            
          </div>

          </div>
        </div>
          
      </div>
  </div>
</div>

<div class="row">      
  <div class="col-md-12">
    <div class="box box-krungsri">
      <div class="box-header with-border">
        <h3 class="box-title">User Management</h3>
      </div>
      <div class="box-body">

        <div class="row"> 
          
          <div class="col-md-4">
            <form class="btn-group" role="search">
              <div class="input-group add-on">
                <input class="form-control" placeholder="Search" name="srch-term" id="srch-term" type="text">
                <div class="input-group-btn">
                  <button class="btn btn-primary" type="submit"><i class="glyphicon glyphicon-search"></i></button>
                </div>
              </div>
            </form>
          </div>

          <div class="col-md-8">
             <div class="btn-group pull-right">
              <button type="button" class="btn btn-primary" @click="onShowListBox"><i class="fa fa-plus-square"></i> Add User</button>
              <button type="button" class="btn btn-info"><i class="fa fa-pencil-square-o"></i> Edit User</button>
              <button type="button" class="btn btn-danger"><i class="fa fa-trash-o"></i> Delete User</button>
              <button type="button" class="btn btn-warning"><i class="fa fa-window-restore"></i> Reset Password</button>
            </div>
          </div>
        </div>

        <div class="row top-buffer">
          <div class="col-xs-12">
            <table id="example1" class="table table-bordered table-striped">
              <thead>
              <tr>
                <th>User Name</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Login Count</th>
                <th>Last Login (Local Time)</th>
                <th>Last IP Address</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>pob@gmail.com</td>
                <td>Kraipob Saengkhunthod</td>
                <td>pob@gmail.com</td>
                <td>5</td>
                <td>2018-09-05</td>
                <td>10.100.60.40</td>
              </tr>
              <tr>
                <td>joe@gmail.com</td>
                <td>Joe Joery</td>
                <td>joe@gmail.com</td>
                <td>3</td>
                <td>2018-09-05</td>
                <td>10.100.60.14</td>
              </tr>
              <tr>
                <td>suga@gmail.com</td>
                <td>Suga Caros</td>
                <td>suga@gmail.com</td>
                <td>2</td>
                <td>2018-09-05</td>
                <td>10.100.60.11</td>
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
      model: { id: "1", text: "User Management", value: "10" },
      UserModel: UserModel,
      dsMenuItems: [
        { id: "1", text: "User Management", value: "10" },
        { id: "2", text: "Bank/Branch Management", value: "20" },
        { id: "3", text: "Holiday Management", value: "30" },
        { id: "4", text: "Bank Signature Management", value: "40" },
        { id: "5", text: "Home", value: "50" },
        { id: "6", text: "System Admin", value: "60" },
        { id: "7", text: "Customer Management", value: "70" },
        { id: "8", text: "Cheque Management", value: "70" },
        { id: "9", text: "Daily Management", value: "70" },
        { id: "10", text: "Report", value: "70" }
      ]
    };
  },
  mounted() {

  },
  computed: {
      modelValue: function () {
          return this.model.value;
      }
  },
  methods: {
    onReorder(ev){
      console.log(ev);
    },
    onChange(ev){
      // var selectedIndex = ev.sender.select();
      // var selectedItem = ev.sender.dataItem(selectedIndex).toJSON();
      // this.model = selectedItem;
      // console.log(this.model);
      // console.log(this.modelValue);
      // var listBox = $("#selected").data("kendoListBox");
      // var items = listBox.dataSource._data;
      // for(var item of items){
      //   console.log(item.id, item.text, item.value)
      // }
      $("#selected").data("kendoListBox").clearSelection();
    },
    onShowListBox() {
      $("#listbox-modal").modal({
          backdrop: "static",
          keyboard: false
        })
        .css({
          width: "auto",
          heigh: "auto"
        })
        // .on("show.bs.modal", function() {
        //   var height = $(window).height() - 200;
        //   $(this)
        //     .find(".modal-body")
        //     .css("max-height", height);
            
        // });

        // this.resetForm({});
    },
    onSave() {
      const me = this;
      var listBox = $("#selected").data("kendoListBox");
      var listItems = listBox.dataSource._data;
      const list = [];
      for(var item of listItems){
        list.push({id: item.id, text: item.text, value: item.value});
      }
      this.UserModel.items = list;
      // console.log(list);
      // me.$validator.fields.items.forEach( each => {
      //   console.log(each.el.name, each.el.value);
      // })

      me.$validator.validateAll().then((result) => {
        if (result) {
          console.log(JSON.stringify(this.UserModel));
          this.save(this.UserModel);
          return;
        }
      });
    },
    save(params){
      const me =  this;
      const url = me.url + me.verbs.user.register
        axios({
        method: 'post',
        url: url,
        headers: {
          'Content-Type': 'application/json'
        },
        data: params
        }).then(function (response) {
          console.log("----------Success---------");
          console.log(response.data);
      
        }).catch(error => {
          console.log("----------Error---------");
          console.log(error.response.data);
      });
    },
    resetForm(UserForm) {
      this.$validator.reset();

      for(var key in UserForm){
        UserForm[key] = '';
      }
    },
    resetListBox(){
      var listSelected = $("#selected").data("kendoListBox");
      listSelected.remove(listSelected.items());

      var listItems = $("#items").data("kendoListBox");
      listItems.remove(listItems.items());
      listItems.dataSource.data(this.dsMenuItems);

      $("#items").data("kendoListBox").clearSelection();
      $("#selected").data("kendoListBox").clearSelection();
    },
    onReset() {
      this.resetForm(this.UserModel); 
      this.resetListBox();
    }
  }
};
</script>
<style scoped>

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
@media (min-width: 768px){
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
  height: 5px;
}
.has-error {
  border-color: none;
  /*box-shadow: none;*/
}
</style>
