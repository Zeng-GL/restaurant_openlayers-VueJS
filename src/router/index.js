import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "Home",
    component: () => import('../components/Home.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
