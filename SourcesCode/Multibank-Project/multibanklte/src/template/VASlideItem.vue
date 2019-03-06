<template>  
  <li :class="getType">
    <!--menu-->
    <a href="#" v-if="items.length > 0">
      <i :class="icon"></i><span>{{ name }}</span>
      <span class="pull-right-container">
        <i class="fa fa-angle-left pull-right"></i>
      </span>
    </a>
    <router-link tag="a" :to="router" v-else>
        <i :class="icon"></i><span>{{ name }}</span>
        <span class="pull-right-container"></span>
    </router-link>

    <!--submenu-->
    <ul class="treeview-menu" v-if="items.length > 0">
      <router-link tag="li" v-for="(item,index) in items" 
        :data="item" :key="index" 
        :to="item.router" 
        v-if="item.router && item.router.name">
        <a><i :class="item.icon"></i> {{ item.name }}</a>
      </router-link>

      <li v-else>
        <a><i :class="item.icon"></i> {{ item.name }}</a>
      </li>
      
    </ul>
  </li>
  
</template>

<script>
export default {
  name: "va-slide-item",
  props: {
    type: {
      type: String,
      default: "item"
    },
    icon: {
      type: String,
      default: ""
    },
    name: {
      type: String
    },
    items: {
      type: Array,
      default() {
        return [];
      }
    },
    router: {
      type: Object,
      default() {
        return {
          name: ""
        };
      }
    },
    link: {
      type: String,
      default: ""
    }
  },
  created() {},
  computed: {
    getType() {
      return this.type === "item" ? "nav-link" : "treeview";
    }
  }
};
</script>
