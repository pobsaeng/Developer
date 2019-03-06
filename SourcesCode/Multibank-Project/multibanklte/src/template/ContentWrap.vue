<template>
  <!-- v-bind:class="{ 'content-wrapper': isLoggedIn } -->
  <div id="content-wrap" class="content-wrapper">
    <section class="content">
      <!-- <transition name="page" mode="out-in"> -->
        <router-view></router-view>
      <!-- </transition> -->
    </section>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>

<script>
import { EventBus } from '@/misc/event-bus.js';

export default {
  name: 'va-content-wrap',
  data(){
    return {
      isLoggedIn: false
    }
  },
  mounted() {
    
  },
  created () {
    const me = this;
    EventBus.$on("isLoggedIn", function(values) {
      me.isLoggedIn = values.status;
    });
  },
  methods: {
    
  }
}
</script>

<style>
.page-enter-active, .page-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.page-enter, .page-leave-to {
  opacity: 0;
}
</style>
