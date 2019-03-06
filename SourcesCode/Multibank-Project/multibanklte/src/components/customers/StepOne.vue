<template>
  <form class="form-horizontal">
      <div class="form-group">
        <label class="label">Krungsri Account Number</label>
        <input :class="['form-control', ($v.form.accountNumber.$error) ? 'is-danger' : '']" type="text" v-model="form.accountNumber">
        <p v-if="$v.form.accountNumber.$error" class="help is-danger">This Account Number is invalid</p>
      </div>
      <div class="form-group">
        <label class="label">Krungsri Account Name</label>
        <input :class="['form-control', ($v.form.accountName.$error) ? 'is-danger' : '']"  type="text" v-model="form.accountName">
        <p v-if="$v.form.accountName.$error" class="help is-danger">This Account Number is invalid</p>
      </div>
      <div class="form-group">
        <label class="label">Krungsri Account Branch</label>
        <input :class="['form-control', ($v.form.accountBranch.$error) ? 'is-danger' : '']"  type="text" v-model="form.accountBranch">
        <p v-if="$v.form.accountBranch.$error" class="help is-danger">This account branch is invalid</p>
      </div>
      <div class="form-group">
        <label class="label">Krungsri Account Number 1</label>
        <input :class="['form-control', ($v.form.referenceNumber1.$error) ? 'is-danger' : '']"  type="text" v-model="form.referenceNumber1">
        <p v-if="$v.form.referenceNumber1.$error" class="help is-danger">This account number 1 is invalid</p>
      </div>
      <div class="form-group">
        <label class="label">Download Time</label>
        <input :class="['form-control', ($v.form.downloadTime.$error) ? 'is-danger' : '']"  type="text" v-model="form.downloadTime">
        <p v-if="$v.form.downloadTime.$error" class="help is-danger">This download time is invalid</p>
      </div>
      <div class="form-group">
        <label class="label">Client Code</label>
        <input :class="['form-control', ($v.form.clientCode.$error) ? 'is-danger' : '']"  type="text" v-model="form.clientCode">
        <p v-if="$v.form.clientCode.$error" class="help is-danger">This client code is invalid</p>
      </div>
      <div class="form-group">
        <label class="label">Krungsri Reference Number 2</label>
        <input :class="['form-control', ($v.form.referenceNumber2.$error) ? 'is-danger' : '']"  type="text" v-model="form.referenceNumber2">
        <p v-if="$v.form.referenceNumber2.$error" class="help is-danger">This reference number 2 is invalid</p>
      </div>
  </form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import axios from "axios";

export default {
  props: ["clickedNext", "currentStep", "customValues", "customer"],
  mixins: [validationMixin],
  data() {
    return {
      url: this.$root.$children[0].paths.server_path,
      verbs: this.$root.$children[0].paths.verbs,
      listOfcustomer: '',
      form: {
        accountNumber: "",
        accountName: "",
        accountBranch: "",
        referenceNumber1: "",
        downloadTime: "",
        clientCode: "",
        referenceNumber2: ""
      }
    };
  },
  validations: {
    form: {
      accountNumber: {
        required
      },
      accountName: {
        required
      },
      accountBranch: {
        required
      },
      referenceNumber1: {
        required
      },
      downloadTime: {
        required
      },
      clientCode: {
        required
      },
      referenceNumber2: {
        required
      }
    }
  },
  watch: {
    $v: {
      handler: function(val) {
        if (!val.$invalid) {
          this.$emit("can-continue", { value: true });
        } else {
          this.$emit("can-continue", { value: false });
          setTimeout(() => {
            this.$emit("change-next", { form: this.form, nextBtnValue: false });
          }, 3000);
        }
      },
      deep: true
    },

    clickedNext(val) {
      if (val === true) {
        this.$v.form.$touch();
      }
    }
  },
  created(){
  },
  mounted() {
    if(this.customer != undefined){
      this.getCustomerById(this.customer);

      
    }else{
      alert("Add new a customer!");
    }
    
    this.$emit("change-next", { form: this.form, nextBtnValue: false }); // Make it can click next of a button

    if (!this.$v.$invalid) {
      this.$emit("can-continue", { value: true });
    } else {
      this.$emit("can-continue", { value: false });
    }
  },
  methods: {
    getCustomerById(custId){
      const me = this;
      const url = me.url + me.verbs.customer.findbyid+"/"+custId;
      axios
        .get(url, {
          method: "GET"
        })
        .then(response => {
          me.form = response.data;
          this.$emit("change-next", { form: me.form, nextBtnValue: false });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style scoped lang="scss">
label {
  color: #000;
  font-size: 100%;
  padding-left: 0px;
  // font-weight: normal;
}
.is-danger {
  color: red;
}
</style>