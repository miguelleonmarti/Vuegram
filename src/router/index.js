import Vue from "vue";
import VueRouter from "vue-router";
import firebase from "firebase";

import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Settings from "../views/Settings.vue";

Vue.use(VueRouter);

const routes = [
  { path: "*", redirect: "/dashboard" },
  { path: "/login", name: "Login", component: Login},
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: { requiresAuth: true }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
  const currentUser = firebase.auth().currentUser;

  if (requiresAuth && !currentUser) {
    next("/login");
  } else {
    next();
  }

  /*if (!currentUser && to.path !== "/login") {
    next("/login");
  } else {
    next();
  }*/
})

export default router;
