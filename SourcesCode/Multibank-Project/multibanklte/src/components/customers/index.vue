<template>
<div class="row">
  <div class="col-md-12">
    <div class="box box-bay">
    <div class="box-header with-border">
      <h3 class="box-title">Customer Management</h3>
    </div>
    <div class="box-body">

        <section>
            <div class="col-md-12">
                <HorizontalStepper 
                :steps="demoSteps"
                :customer="customerId"
                @completed-step="completeStep" 
                :top-buttons="true"
                @active-step="isStepActive" 
                @stepper-finished="alert"></HorizontalStepper>
            </div>
        </section>

      </div>
    </div>
  </div>
</div>
</template>

<script>
import HorizontalStepper from "./HorizontalStepper.vue";
import StepOne from "./StepOne.vue";
import StepTwo from "./StepTwo.vue";
import StepThree from "./StepThree.vue";
import StepFour from "./StepFour.vue";
import axios from "axios";

export default {
  name: "customerstep",
  props: ["customerId"],
  components: {
    HorizontalStepper
  },
  data() {
    return {
      listOfcustomer: {},
      demoSteps: [
        {
          title: "Krungsri Account Profile",
          icon: "mail",
          name: "first",
          number: "1",
          component: StepOne,
          completed: false
        },
        {
          title: "Contact",
          icon: "report_problem",
          name: "second",
          number: "2",
          component: StepTwo,
          completed: false
        },
        {
          title: "Source Account",
          icon: "announcement",
          name: "third",
          number: "3",
          component: StepThree,
          completed: false
        },
        {
          title: "Complete",
          icon: "complete",
          name: "four",
          number: "4",
          component: StepFour,
          completed: false
        }
      ],
      activeStep: 0
    };
  },
  created(){
    
  },
  methods: {
    completeStep(payload) {
      this.demoSteps.forEach(step => {
        if (step.name === payload.name) {
          step.completed = true;
        }
      });
    },
    isStepActive(payload) {
      this.demoSteps.forEach(step => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = false;
          }
        }
      });
    },
    alert() {
      console.log("end");
    }
  }
};
</script>