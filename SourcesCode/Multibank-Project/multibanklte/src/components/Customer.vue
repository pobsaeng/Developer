<template>
<div class="row">
  <div class="col-md-12">
    <div class="box box-bay">
    <div class="box-header with-border">
      <h3 class="box-title">Customer Management</h3>
    </div>
    <div class="box-body">

        <div class="row"> 
          <div class="col-md-4">
            <div class="btn-group">
              <div class="input-group add-on">
                <input class="form-control" placeholder="Search" name="srch-term" id="srch-term" type="text">
                <div class="input-group-btn">
                  <button class="btn btn-warning" type="submit" ><i class="glyphicon glyphicon-search"></i></button>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8">
             <div class="btn-group pull-right">
              <router-link class="nav-link" to="/customerstepper">
                  <button type="button" class="btn btn-warning"><i class="fa fa-plus-square"></i> Add Customer</button>
              </router-link>
            </div>
          </div>
        </div>

        <customer-data-table></customer-data-table>

      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from "axios";
import CustomerDataTable from "./customers/CustomerDataTable.vue";

export default {
  name: "customer",
  data() {
    return {
      url: this.$root.$children[0].paths.server_path,
      verbs: this.$root.$children[0].paths.verbs,
      listOfcustomers: []
    };
  },
  mounted(){
      this.loadAllCustomer();
  },
  methods: {
      loadAllCustomer(){
        console.log("loadAllCustomer!");
        const me = this;
        const url = me.url + me.verbs.customer.findall;
        axios.get(url, {
        method: "GET"
        }).then(response => {
            
            me.listOfcustomers = response.data;
            console.log(me.listOfcustomers);
        }).catch(error => {
            console.log(error);
        });
      }
  },
  components: { 'customer-data-table': CustomerDataTable }
};
</script>
<style scoped>
.top-buffer {
  margin-top: 10px;
}
</style>