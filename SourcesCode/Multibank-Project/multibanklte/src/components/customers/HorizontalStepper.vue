<template>
<div class="row">
  <div class="col-md-12">

    <div class="stepper-box">
        <div class="top">
            <div class="divider-line" :style="{width: `${(100/(steps.length) * (steps.length - 1)) - 10}%`}"></div>
            <div class="steps-wrapper">

              <template v-for="(step, index) in steps">
                  <div :class="['step', isStepActive(index, step)]" :key="index" :style="{width: `${100 / steps.length}%`}">
                      <div class="circle">
                        <!-- <i v-bind:class="(step.completed) ? 'fa fa-check' : step.icon"></i> -->

                        <!-- <div> {{ (step.completed) ? '<i class="fa fa-check"></i>' : step.number }}</div> -->

                          <!-- <i>{{ (step.completed) ?'fa fa-check' : step.number }}</i> -->

                          <i class="circle fa fa-check" v-if="step.completed"></i>
                          <i v-else>{{step.number}}</i>

                      </div>
                      <div class="step-title">
                          <h5>{{step.title}}</h5>
                      </div>
                  </div>
              </template>

            </div>
        </div>

        <div class="content">
           <!--If keep alive-->
            <keep-alive v-if="keepAliveData">
                <component :is="steps[currentStep.index].component"
                :customer="customer"
                :customValues="customValues"
                :clickedNext="nextButton[currentStep.name]" 
                @can-continue="proceed" 
                @change-next="changeNextBtnValue" 
                :current-step="currentStep"></component>
            </keep-alive>
            <!--If not show component and destroy it in each step change-->
            <component v-else :is="steps[currentStep.index].component" :clickedNext="nextButton[currentStep.name]" @can-continue="proceed" @change-next="changeNextBtnValue" :current-step="currentStep"></component>
        </div>
        
        <div :class="['bottom', (currentStep.index > 0) ? '' : 'only-next']">
            <div v-if="currentStep.index >= 0" class="stepper-button previous" @click="backStep()">
                <!-- <i class="material-icons">keyboard_arrow_left</i> -->
                
                <button type="button" class="btn btn-primary"><i class="fa fa-angle-double-left"></i></button>
            </div>

            <div :class="['btn btn-primary', !canContinue ? 'deactivated' : '']" @click="nextStep()">
                <!-- <span>{{ (finalStep) ? 'finish' : 'next'}}</span> -->
                <i class="fa fa-angle-double-right"></i>
            </div>
        </div>
    </div>

  </div>
</div>
</template>

<script>
import axios from "axios";
import { EventBus } from '@/misc/event-bus.js';
import Service from '../../service/index.js';

export default {
  props: {
    customer: {
    },
    topButtons: {
      type: Boolean,
      default: false
    },
    steps: {   
    },
    keepAlive: {
      type: Boolean,
      default: true
    },
    reset: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      url: this.$root.$children[0].paths.server_path,
      verbs: this.$root.$children[0].paths.verbs,
      customerId: {},
      customValues: {},
      currentStep: {},
      previousStep: {},
      nextButton: {},
      canContinue: false,
      finalStep: false,
      keepAliveData: this.keepAlive
    };
  },
  mounted(){
  },
  methods: {
    isStepActive(index) {
      if (this.currentStep.index === index) {
        return "activated";
      } else {
        return "deactivated";
      }
    },

    activateStep(index, back = false) {
      if (this.steps[index]) {
        this.previousStep = this.currentStep;
        this.currentStep = {
          name: this.steps[index].name,
          index: index
        };

        if (index + 1 === this.steps.length) {
          this.finalStep = true;
        } else {
          this.finalStep = false;
        }

        if (!back) {
          this.$emit("completed-step", this.previousStep);
        }
      }
      this.$emit("active-step", this.currentStep);
    },

    nextStepAction() {
      // let currentIndex = this.currentStep.index + 1;
      // this.activateStep(currentIndex);
      

      //========= Original =========
      this.nextButton[this.currentStep.name] = true;
      if (this.canContinue) {
        if (this.finalStep) {
          this.$emit("stepper-finished", this.currentStep);
        }
        let currentIndex = this.currentStep.index + 1;

        this.activateStep(currentIndex);
      }
      this.canContinue = false;
      this.$forceUpdate();
    },

    nextStep () {
      console.log(this.currentStep.index +', ' + this.canContinue);
      //========= Original =========
      if (!this.$listeners || !this.$listeners['before-next-step']) {
        if(this.currentStep.index == 0 && this.canContinue && this.customer == '') {
          this.save();
          console.log(this.customValues);
          EventBus.$emit("change-next", { form: this.customValues, nextBtnValue: false }); //For Testing
          
        }else if(this.currentStep.index == 1 && this.canContinue && this.customer !== '') {
          this.doUpdate();
        }
        this.nextStepAction()
      }
      this.canContinue = false;
      this.$emit("before-next-step", { currentStep: this.currentStep }, (next = true) => {
        this.canContinue = true;
        if (next) {
          this.nextStepAction()
        }
      });
    },
    backStep() {
      this.canContinue = true;//For Testing

      this.$emit("clicking-back");
      let currentIndex = this.currentStep.index - 1;
      if (currentIndex >= 0) {
        this.activateStep(currentIndex, true);
      }else{
        this.$router.push('/customer'); //go to first customer page
      }
    },

    proceed(payload) {
      this.canContinue = payload.value;
    },

    changeNextBtnValue(payload) {
      this.customValues = payload.form;
      this.nextButton[this.currentStep.name] = payload.nextBtnValue;
      this.$forceUpdate();
    },

    init() {
      // Initiate stepper
      this.activateStep(0);
      this.steps.forEach(step => {
        this.nextButton[step.name] = false;
      });
    },
    save(){
      console.log("Save Data!");
      console.log(this.customValues);
      const me = this;
      const url = me.url + me.verbs.customer.save;

      axios({
        method: "post",
        url: url,
        headers: {
          "Content-Type": "application/json"
        },
        data: me.customValues
      }).then(function(response) {
        console.log(response.data);
      }).catch(error => {
        console.log("----------Error---------");
        console.log(error.response.data);
        
      });
    },
    doUpdate(){
      console.log("Update Customer!");
      const me = this;
      const path = me.url + me.verbs.customer.update;
      Service.updatePromise(path, me.customValues).then(function(response) {
        console.log(response);

      }).catch((error) => {
        console.log(error.message);
      })
    }
  },

  watch: {
    reset(val) {
      if(!val) {
        return;
      }

      this.keepAliveData = false;

      this.init();
      this.previousStep = {};

      this.$nextTick(() => {
        this.keepAliveData = this.keepAlive;
        this.$emit('reset', true);
      });

    }
  },

  created() {
    this.init();
  }
};
</script>
// npm install sass-loader node-sass style-loader --save-dev
<style src="./HorizontalStepper.scss" scoped lang="scss"></style>
<style scoped>
/* fallback */
/* @font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: local("Material Icons"), local("MaterialIcons-Regular"),
    url(https://fonts.gstatic.com/s/materialicons/v17/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2)
      format("woff2");
} */

/* .material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 30px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: "liga";
  -webkit-font-smoothing: antialiased;
} */
</style>
