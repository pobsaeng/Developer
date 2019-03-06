import Vue from "vue";
import Router from "vue-router";
import Admin from "@/components/Admin";
import Cheque from "@/components/Cheque";
import Home from "@/components/Home";
import Daily from "@/components/Daily";
import Report from "@/components/Report";
import Customer from "@/components/Customer";
import Calendar from "@/components/Calendar";
import Login from "@/components/Login";
import UserManagement from "@/components/UserManagement";
import CustomerStepper from "@/components/customers";
import { EventBus } from '@/misc/event-bus.js';

Vue.use(Router);

const guard = (to, from, next) => {
  if (localStorage.accessToken && localStorage.privilege) {
    next();
  } else {
    next({ path: "/login" });
  }
};

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: guard
    },
    {
      path: '/customer',
      name: 'customer',
      component: Customer,
      beforeEnter: guard
    },
    {
      path: '/customerstepper',
      name: 'customerstepper',
      component: CustomerStepper,
      beforeEnter: guard
    },
    ,
    {
      path: '/customerstepper/:customerId',
      name: 'customerstepper',
      component: CustomerStepper,
      props: true,
      beforeEnter: guard
    },
    {
      path: '/usermanagement',
      name: 'usermanagement',
      component: UserManagement,
      beforeEnter: guard
    },
    {
      path: '/holiday',
      name: 'holiday',
      component: Calendar,
      beforeEnter: guard
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
