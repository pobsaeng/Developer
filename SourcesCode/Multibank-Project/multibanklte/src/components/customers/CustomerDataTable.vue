<template>
<div>
  <!--start remove modal -->
  <div id="remove-modal" class="modal fade">
    <div class="modal-dialog">
      <div class="modal-content">
          <div class="box-header with-bg-red">
            <button type="button" class="close" data-dismiss="modal">
              <span aria-hidden="true">
                <i class="fa fa-times" style="color:#424242;" aria-hidden="true"></i>
              </span>
            </button>
            <h4 class="modal-title">Delete Customer</h4>
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

  <div class="row top-buffer">
    <div class="col-xs-12">
      <div class="col-md">
        <table id="tblUM" class="table table-bordered table-striped table-hover">
          <thead>
          <tr>
            <th>Krungsri Account Number</th>
            <th>Krungsri Account Name</th>
            <th>Customer</th>
            <th>Telephone / Mobile</th>
            <th>Email</th>
            <th style="width: 7%"></th>
          </tr>
          </thead>
          <tbody>
          <!--:class="{highlight: isRowActive}"-->
          <tr v-for="(customer, index) in listOfcustomers" :id="customer.customerID" :data-key="index">
            <td>{{customer.accountNumber}}</td>
            <td>{{customer.accountName}}</td>
            <td>{{customer.customerID}}</td>
            <td></td>
            <td></td>
            <td>
              <button type="button" class="btn btn-success btn-xs" @click="onEdit(customer.customerID)"><i class="fa fa-pencil"></i></button>
              <button type="button" class="btn btn-danger btn-xs" @click="onDelete(customer.customerID)"><i class="fa fa-trash-o"></i></button>
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
import Service from '../../service/index.js';

export default {
  name: "customerdatatable",
  data() {
    return {
      url: this.$root.$children[0].paths.server_path,
      verbs: this.$root.$children[0].paths.verbs,
      listOfcustomers: [],
      customerId: ''
    };
  },
  mounted() {
    this.loadAllCustomers();
  },
  methods: {
    loadAllCustomers(){
      console.log("Load all data customers!");
      const me = this;
      const path = me.url + me.verbs.customer.findall;

      Service.getAxiosPromise(path).then(function(response) {
        me.listOfcustomers = response.data;
      }).catch((error) => {
        console.log(error.message);
      })
    },
    // loadAllCustomer() {
    //   console.log("loadAllCustomer!");
    //   const me = this;
    //   const url = me.url + me.verbs.customer.findall;
    //   axios
    //     .get(url, {
    //       method: "GET"
    //     })
    //     .then(response => {
    //       me.listOfcustomers = response.data;
    //       console.log(me.listOfcustomers);
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // },
    onAddContact(){
      $("#edit-contact-modal")
      .modal({
        backdrop: "static",
        keyboard: false
      }).css({ width: "auto", heigh: "auto" });
    },
    onSave(){

    },
    onEdit(customerId) {
      this.$router.push('/customerstepper/' + customerId);
    },
    onDelete(customerId){
      this.customerId = customerId;
      $("#remove-modal").modal({ backdrop: "static", keyboard: false });     
    },
    doDelete() {
      const me = this;
      const url = me.url + me.verbs.customer.delete;
      if(me.customerId == '') return;

      axios({
        method: 'get',
        url: url + "/" + me.customerId,
      }).then(function (response) {
        console.log("----------Delete Success---------");
        console.log(response);
        me.loadAllCustomers();

      }).catch(error => {
        console.log(error.response.data);
      });
    }
  }
};
</script>
<style scoped>
.top-buffer {
  margin-top: 10px;
}
</style>