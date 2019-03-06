<template>
<div class="row">
  <div class="col-md-12">
        <div class="box-comments">
            <div class="comment-text">Krungsri Account Number : {{customValues.accountNumber}}</div>
            <div class="comment-text">Krungsri Account Name : {{customValues.accountName}}</div>
            <div class="comment-text">Krungsri Account Branch : {{customValues.accountBranch}}</div>
            <div class="comment-text">Reference Number 1 : {{customValues.referenceNumber1}}</div>
            <div class="comment-text">Download Time : {{customValues.downloadTime}}</div>
        </div>

        <contact></contact>

  </div>
</div> 
</template>

<script>
import Contact from "./Contact.vue";
export default {
    props: ['currentStep', "customValues"],
    data() {
        return {
         
        }
    },
    methods: {
        canContinue() {
            this.$emit('can-continue', {value: true});
        }
    },
    created(){
        console.log("Step Two!!");
        this.$emit("change-next", { form: this.customValues, nextBtnValue: false });
        this.$emit('can-continue', {value: true});// Make it can click next of a button
    },
    mounted() {
        this.$emit('can-continue', {value: true});
    },
    components: { 'contact': Contact }
}
</script>