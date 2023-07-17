import store from "../store";
import configApp from "../common/config";
import config from "@/common/config";
// 初始化请求配置
uni.$u.http.setConfig(config => {
  /* config 为默认全局配置*/
  config.baseURL = process.env.VUE_APP_API_URL; /* 根域名 */
  return config;
});
// 请求拦截
uni.$u.http.interceptors.request.use(
  config => {
    // 可使用async await 做异步操作
    //设置定时器
    store.commit("setTimer");
    config.data = config.data || {};
    config.header["Content-Type"] =
      config.method === "GET"
        ? "application/x-www-form-urlencoded"
        : "application/json;charset=UTF-8";
    const token = uni.getStorageSync(configApp.Global.cache + "_Token");
    if (token && config.url.search("Public") == -1) {
      config.header.Authorization = token;
    }
    return config;
  },
  config => {
    return Promise.reject(config);
  }
);

// 响应拦截
uni.$u.http.interceptors.response.use(
  response => {
    //清除定时器
    store.commit("clearTimer");
    let { data } = response;
    if (data.code === 400) {
      uni.$u.toast(data.msg || "请求失败");
    }
    if (![200, 400, 500].includes(data.code)) {
      const inviteObj = uni.getStorageSync(config.Global.cache + "_inviteObj");
      // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
      if (data.msg) {
        uni.$u.toast(data.msg);
      }
      uni.reLaunch({
        url: "/subPages/user/login/login",
      });
      uni.clearStorageSync();
      uni.removeTabBarBadge({
        index: 3,
      });
      uni.setStorageSync(config.Global.cache + "_inviteObj", inviteObj);
    }
    return data === undefined ? {} : data;
  },
  response => {
    store.commit("clearTimer");
    return Promise.reject(response);
  }
);
