const config = {
  Global: {
    tenantId: "lkd", //租户id
    SoftName: "JDcloud", //软件名称
    SoftFullName: "JDcloud软件APP", //软件全称
    SoftVersion: "3.1.0", //软件版本
    baseUrl: {
      apiUrl: "https://kindoucloud.com:8077",
      // wssService: "wss://kindoucloud.com:8011/api/system/Message/websocket",
      // apiUrl: "http://192.168.1.3:30000",
      // apiUrl: "https://xiaoxiangcloud.net",
      wssService: "ws://kindoucloud.com:8066/api/mongoSystem/Message/websocket",
    },
    cache: "Kindow",
    filePostfix: ["jpg", "jpeg", "png", "gif"],
    socket: null, //IM通讯
    timeObj: "", //定时器
    contime: 0,
  },
  Resources: {
    message: {
      nocontent: "http://cdn.uviewui.com/uview/empty/data.png",
      nodata: "http://cdn.uviewui.com/uview/empty/data.png",
    },
  },
};
export function getStorage(val = "", key) {
  return uni.getStorageSync(getGlobal(key || "cache") + val);
}
export function setStorage(val = "", data, key) {
  uni.setStorageSync(getGlobal(key || "cache") + val, data);
}
export function removeStorage(val = "", key) {
  uni.removeStorageSync(getGlobal(key || "cache") + val);
}
export function getGlobal(key) {
  return key ? config.Global[key] : config.Global;
}
export function getConfig() {
  return config;
}
export default config;
