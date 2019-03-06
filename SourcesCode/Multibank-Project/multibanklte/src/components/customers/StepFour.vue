<template>
    <div class="card" style="margin: 3rem">
        <h2>Complete</h2>
    </div>
</template>

<script>
    export default {
        props: ['currentStep', "customValues"],

        methods: {
          canContinue() {
              this.$emit('can-continue', {value: true});
          }
        },

        mounted() {
           this.$emit('can-continue', {value: true});
        },
        created(){
            console.log("Step Four!!");
            this.$emit('can-continue', {value: true});// Make it can click next of a button
        }
    }
</script>