import App from "./App";
import uView from "uview-ui";
import store from "./store";
import helper from "@/common/helper.js";
import config from "@/common/config.js";
// 全局变量名称
import globName from "@/common/globalName.js";
import "./config/request.js";
Vue.use(uView);
// #ifndef VUE3
import Vue from "vue";
Vue.config.productionTip = false;
Vue.prototype.$helper = helper;
Vue.prototype.bus = new Vue();
Vue.prototype.$eventHub = new Vue();
Vue.prototype.$globName = globName;
Vue.prototype.$cache = config.Global.cache;
Vue.prototype.$config = config;
Vue.prototype.$baseUrl = config.Global.baseUrl.apiUrl;
App.mpType = "app";
const app = new Vue({
  ...App,
  store,
});
app.$mount();
// #endif

// 引入请求封装，将app参数传递到配置中
// require("./config/request.js")(app);
// #ifdef VUE3
import { createSSRApp } from "vue";
export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
// #endif
