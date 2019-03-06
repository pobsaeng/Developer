<template>
<div>

<div class="row top-buffer">
  <div class="col-xs-12">
  <div class="col-md">
    <div class="btn-group pull-right">
    <button type="button" class="btn btn-primary" @click="onAddContact"><i class="fa fa-plus-square"></i> Add Contact</button>
    </div>
  </div>    
  </div>
</div>

<div class="row top-buffer">
  <div class="col-xs-12">

    <!--start edit modal-->
<div id="edit-contact-modal" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
        <div class="box-header with-bg-info">
          <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">
              <i class="fa fa-times" style="color:#424242;" aria-hidden="true"></i>
            </span>
          </button>
          <h4 class="modal-title">Management Contact</h4>
        </div>
        <div class="modal-body">
          
          <form class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-3">Customer Name : </label>
              <div class="col-md-9">
                <input type="text" name="customername"
                  v-model="ContactModel.customer_name"
                  class="form-control" required/>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-3">Mobile : </label>
              <div class="col-md-9">
                <input type="text" name="mobile" 
                v-model="ContactModel.mobile"
                class="form-control" required/>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-3">Email : </label>
              <div class="col-md-9">
                <input type="text" name="email" 
                v-model="ContactModel.email"
                class="form-control" required/>
              </div>
            </div>

          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button class="btn btn-warning" @click="onSave">Save</button>
        </div>
    </div>
  </div>
</div>

<!--start remove modal -->
<div id="remove-contact-modal" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
        <div class="box-header with-bg-red">
          <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">
              <i class="fa fa-times" style="color:#424242;" aria-hidden="true"></i>
            </span>
          </button>
          <h4 class="modal-title">Delete Contact</h4>
        </div>
        <div class="modal-body">
          <div>Are you sure you want to remove this item?</div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button class="btn btn-danger" @click="doDelete" data-dismiss="modal">Yes</button>
        </div>
    </div>
  </div>
</div>
<!--end remove modal-->

<div class="col-md">
    <table id="tblUM" class="table table-bordered table-striped table-hover">
      <thead>
      <tr>
        <th>Customer Name</th>
        <th>Mobile</th>
        <th>Email</th>
        <th style="width: 8%"></th>
      </tr>
      </thead>
      <tbody>
      <!--:class="{highlight: isRowActive}"-->
      <tr v-for="(contact, index) in listOfContacts" :id="contact.contact_id" :data-key="index">
        <td>{{contact.customer_name}}</td>
        <td>{{contact.mobile}}</td>
        <td>{{contact.email}}</td>
        <td>
          <button type="button" class="btn btn-success btn-xs" @click="onEdit(contact)"><i class="fa fa-pencil"></i></button>
          <button type="button" class="btn btn-danger btn-xs" @click="onDelete(contact.contact_id)"><i class="fa fa-trash-o"></i></button>
        </td>
      </tr>
      </tbody>
    </table>
    </div>
    
  </div>
</div>

</div>
</template>

<script>
import axios from "axios";
import ContactModel from "../../models/ContactModel.js";
import Service from '../../service/index.js';

export default {
  name: "contact",
  data() {
    return {
      url: this.$root.$children[0].paths.server_path,
      verbs: this.$root.$children[0].paths.verbs,
      listOfContacts: [],
      contactId: '',
      ContactModel: ContactModel
    };
  },
  mounted() {
    this.loadAllContact();
  },
  methods: {
    loadAllContact() {
      console.log("loadAllContacts!");
      const me = this;
      const url = me.url + me.verbs.contact.findall;
      axios
        .get(url, {
          method: "GET"
        })
        .then(response => {
          me.listOfContacts = response.data;
          console.log(me.listOfContacts);
        })
        .catch(error => {
          console.log(error);
        });
    },
    onAddContact(){
      this.contactId = '';
      this.ContactModel = {};
      $("#edit-contact-modal")
      .modal({
        backdrop: "static",
        keyboard: false
      }).css({ width: "auto", heigh: "auto" });
    },
    onSave(){
      const me = this;

      if(me.contactId != ''){
        const path = me.url + me.verbs.contact.update;
        Service.updatePromise(path, me.ContactModel).then(function(response) {
          $('#edit-contact-modal').modal('hide');
          me.contactId = '';

          me.loadAllContact();
        }).catch((error) => {
          console.log(error.message);
        })

      }else{
        const path = me.url + me.verbs.contact.save;
        Service.insertPromise(path, me.ContactModel).then(function(response) {
          $('#edit-contact-modal').modal('hide');
          me.contactId = '';

          me.loadAllContact();

        }).catch((error) => {
          console.log(error.message);
        })

        // axios({
        // method: "post",
        // url: url,
        // headers: {
        //   "Content-Type": "application/json"
        // },
        // data: me.ContactModel
        // }).then(function(response) {
        //   $('#edit-contact-modal').modal('hide');
        //   me.loadAllContact();

        // }).catch(error => {
        //   console.log("----------Error---------");
        //   console.log(error.response.data);
          
        // });

      }
      
    },
    onEdit(contact) {
      this.contactId = contact.contact_id;
      this.ContactModel = Object.assign({}, contact);
      $("#edit-contact-modal")
      .modal({
        backdrop: "static",
        keyboard: false
      }).css({ width: "auto", heigh: "auto" });
    },
    onDelete(id){
      this.contactId = id;
      $("#remove-contact-modal").modal({ backdrop: "static", keyboard: false });     
    },
    doDelete() {
      const me = this,
      path = me.url + me.verbs.contact.delete + "/" + me.contactId;

      if(me.contactId == '') return;

      Service.getAxiosPromise(path).then(function(response) {
        me.loadAllContact();

      }).catch((error) => {
        console.log(error.message);
      })

    }
  }
};
</script>
<style scoped>
.top-buffer {
  margin-top: 10px;
}
</style>