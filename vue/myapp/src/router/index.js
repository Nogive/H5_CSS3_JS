import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home";
import Hello from "@/components/Hello";
Vue.use(Router);

const Foo = {
  template: "<div>foo</div>"
};
const Bar = {
  template: "<div>bar</div>"
};

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/foo",
    component: Foo
  },
  {
    path: "/bar",
    component: Bar
  },
  {
    path: "/hello/:id",
    component: Hello
  }
];
const router = new Router({
  routes
});
export default router;
