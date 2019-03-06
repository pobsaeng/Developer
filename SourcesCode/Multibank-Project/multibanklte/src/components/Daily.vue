<template>
<div class="row">
  <div class="col-md-12">
    <div class="box box-bay">
      <div class="box-body">

        <Calendar></Calendar>

      </div>
    </div>
  </div>
</div> 
</template>

<script>
import Calendar from "../components/Calendar";

export default {
  name: "daily",
  data() {
    return {};
  },
  components: {
    Calendar
  }
};
</script>