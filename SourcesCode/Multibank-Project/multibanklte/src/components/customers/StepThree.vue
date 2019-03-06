<template>
<div>
<div id="bank-cheque-modal" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
        <div class="box-header with-bg-primary">
          <button type="button" class="close" data-dismiss="modal">
            <span aria-hidden="true">
              <i class="fa fa-times" style="color:#424242;" aria-hidden="true"></i>
            </span>
          </button>
          <h4 class="modal-title">Bank Cheque</h4>
        </div>
        <div class="modal-body">
          
          <form class="form-horizontal">
            <div class="form-group">
              <label class="control-label col-sm-3">Bank Cheque: </label>
              <div class="col-md-9">
                <!-- UserModel.department = $event.target.value -->
                <select class="form-control">
                <option value="01">IT Admin</option>
                <option value="02">Customer Service</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-3">User : </label>
              <div class="col-md-9">
                <input type="text" name="user" 
                v-model="SourceAccount.user"
                class="form-control" required/>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-3">Password : </label>
              <div class="col-md-9">
                <input type="text" name="password" 
                v-model="SourceAccount.password"
                class="form-control" required/>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-3">Other : </label>
              <div class="col-md-9">
                <input type="text" name="other" 
                v-model="SourceAccount.other"
                class="form-control" required/>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-3">Min Balance : </label>
              <div class="col-md-9">
                <input type="text" name="other" 
                v-model="SourceAccount.minimum_balance"
                class="form-control" required/>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-3">Cut Balance : </label>
              <div class="col-md-9">
                <input type="text" name="cutBalance" 
                v-model="SourceAccount.cut_balance"
                class="form-control" required/>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-3">Round : </label>
              <div class="col-md-9">
                <!-- UserModel.department = $event.target.value -->
                <select class="form-control">
                <option value="01">0</option>
                <option value="02">10</option>
                <option value="02">100</option>
                <option value="02">1000</option>
                <option value="02">10000</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-sm-3">Signature : </label>
              <div class="col-md-9">
              
                <div class="input-group">
                <span>Image Here</span>
                <span class="input-group-btn">
                    <span class="btn btn-default btn-file">
                        Browse… <input type="file" id="imgInp">
                    </span>
                    <span class="btn btn-default" >Clear</span>
                </span>
                </div>
                
                <img id='img-upload'/>  

               </div>
            </div>

          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
          <button class="btn btn-warning" @click="">Save</button>
        </div>
    </div>
  </div>
</div>


<div class="row bottom-buffer">
  <div class="col-12">
  <div class="col-md">
    <div class="btn-group pull-right">
      <button type="button" class="btn btn-primary" @click="showBankChequeModal"><i class="fa fa-plus-square"></i> Bank Cheque</button>
    </div>
  </div>    
</div>
</div>
<div class="row">
  <div class="col-12">
      <div class="col-md">
    <table id="tblUM" class="table table-bordered table-striped table-hover">
      <thead>
      <tr>
        <th>Bank Cheque</th>
        <th>Password</th>
        <th>Other</th>
        <th>Min Bal</th>
        <th>Cut Bal</th>
        <th>Round</th>
        <th>Signature</th>
        <th style="width: 8%"></th>
      </tr>
      </thead>
      <tbody>
          <tr v-for="(bankcheque, index) in listOfBankCheque" :id="bankcheque.bank_id" 
          @click="" :data-key="index">
            <td>{{bankcheque.user}}</td>
            <td>{{bankcheque.password}}</td>
            <td>{{bankcheque.other}}</td>
            <td>{{bankcheque.minimum_balance}}</td>
            <td>{{bankcheque.cut_balance}}</td>
            <td>{{bankcheque.items_round}}</td>
            <td>{{bankcheque.signature}}</td>
            <td>
              <button type="button" class="btn btn-success btn-xs" @click="onEdit(bankcheque)"><i class="fa fa-pencil"></i></button>
              <button type="button" class="btn btn-danger btn-xs" @click="onDelete(bankcheque.bank_id)"><i class="fa fa-trash-o"></i></button>
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
import SourceAccount from "../../models/SourceAccount.js";
import Service from '../../service/index.js';

export default {
  props: ["currentStep", "customValues"],
  data() {
    return {
      listOfBankCheque: [],
      SourceAccount: SourceAccount
    };
  },
  methods: {
    onEdit(bankcheque){
      $("#bank-cheque-modal")
        .modal({
          backdrop: "static",
          keyboard: false
        })
        .css({ width: "auto", heigh: "auto" });
    },
    onDelete(bank_id){

    },
    showBankChequeModal() {
      $("#bank-cheque-modal")
        .modal({
          backdrop: "static",
          keyboard: false
        })
        .css({ width: "auto", heigh: "auto" });
    },
    canContinue() {
      this.$emit("can-continue", { value: true });
    },
    loadAll(){
      const me = this;
      const url = me.$root.$children[0].paths.server_path;
      const verbs = me.$root.$children[0].paths.verbs;
      const path = url + verbs.bankcheque.findall;

      Service.getPromise(path).then(function(values) {
        console.log(JSON.stringify(values));
        me.listOfBankCheque = values;

      }).catch((error) => {
        console.log(error.message);
      })
      
    }
  },

  mounted() {
      this.loadAll();
    this.$emit("can-continue", { value: true });
    
  }
};
</script>
<style scoped>
.bottom-buffer {
  margin-bottom: 10px;
}
</style>