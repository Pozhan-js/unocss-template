import store from "@/store/index.js";
import { getGlobal, getStorage, removeStorage, setStorage } from "./config.js";
import JDcloud from "@/common/JDcloud.js";
import md5 from "@/common/md5.min.js";
import { initPicker } from "@/common/util.js";
import { getCurrentUser, getTreeUserView, getAppCustomAuthorize } from "@/config/api.js";
import custom from "@/common/custom";

var helper = {
  hasToken() {
    return store.state.user.token;
  },
  // 设置缓存
  setStoreCurrentDataInfo: () => {
    return new Promise(async (resolve, reject) => {
      let { data } = await getCurrentUser();
      setStorage("_UserProvider", data.userInfo);
      let {
        data: { list = [] },
      } = await getAppCustomAuthorize();
      // store.commit('user/set_user', data.userInfo);
      const keys = list.map(o => o.path);
      let { children } = custom;
      children = children.filter(item => keys.includes(item.id)); //判断app定制页权限
      if (children != false) {
        custom.children = children;
        data.menuList.unshift(custom);
      }
      setStorage(
        "_MenuList",
        data.menuList.filter(item => item.children)
      );
      setStorage("_PermissionList", data.permissionList);
      console.log(data);
      resolve();
    });
  },
  async setSelectorUserList() {
    var _data = uni.getStorageSync("userList");
    if (!_data) {
      const { data } = await getTreeUserView();
      _data = data?.list;
      uni.setStorageSync("userList", _data);
    }
    return _data || [];
  },

  // 时间字符处理
  timeForm: function (date) {
    var myDate;
    myDate = new Date(Date.parse(date.replace(/-/g, "/")));
    var hour = myDate.getHours();
    var minutes = myDate.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    return helper.thisTimeForm(hour, myDate) + " " + hour + ":" + minutes;
  },
  thisTimeForm: function (time) {
    var hour = time.getHours();
    var minutes = time.getMinutes();
    var year = time.getYear(); //获取当前年份(2位)
    var month = time.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var day = time.getDate(); ////获取当前日(1-31)
    var thisDate = new Date();
    var thisyear = thisDate.getYear(); //获取当前年份(2位)
    var thismonth = thisDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var thisday = thisDate.getDate(); ////获取当前日(1-31)
    if (year == thisyear && month == thismonth && day == thisday) {
      if (hour < 6) {
        return "凌晨";
      } else if (hour < 9) {
        return "早上";
      } else if (hour < 12) {
        return "上午";
      } else if (hour < 14) {
        return "中午";
      } else if (hour < 17) {
        return "下午";
      } else if (hour < 19) {
        return "傍晚";
      } else if (hour < 22) {
        return "晚上";
      } else {
        return "夜里";
      }
    } else {
      var date3 = thisDate.getTime() - time.getTime();
      var years = Math.floor(date3 / (12 * 30 * 24 * 3600 * 1000));
      var leave = date3 % (12 * 30 * 24 * 3600 * 1000);
      var months = Math.floor(leave / (30 * 24 * 3600 * 1000));
      var leave0 = leave % (30 * 24 * 3600 * 1000);
      var days = Math.floor(leave0 / (24 * 3600 * 1000));
      if (years == 0 && months == 0 && days > 0 && days < 7) {
        switch (days) {
          case 1:
            return "昨天";
          case 2:
            return "前天";
          default:
            return "周" + "日一二三四五六".charAt(time.getDay());
            break;
        }
      } else {
        if (months == 0 && years == 0 && days == 0) {
          return "昨天";
        }
        if (months < 10) months = "0" + months;
        if (days < 10) days = "0" + days;
        if (years == 0) {
          return months + "-" + days;
        } else {
          return "20" + years + "-" + months + "-" + days;
        }
      }
    }
  },

  jsonFind: function (data, action) {
    if (action == null) return;
    var reval = new Array();
    for (var i = 0; i < data.length; i++) {
      if (action(data[i])) {
        reval.push(data[i]);
      }
    }
    return reval;
  },
  /* 日期转换 */
  toDate: function (v, format) {
    if (!v || !format) return "";
    var d = v;
    if (typeof v === "string") {
      if (v.indexOf("/Date(") > -1)
        d = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
      else d = new Date(Date.parse(v.replace(/-/g, "/").replace("T", " ").split(".")[0]));
    } else {
      d = new Date(v);
    }
    var o = {
      "M+": d.getMonth() + 1,
      "d+": d.getDate(),
      "h+": d.getHours(),
      "H+": d.getHours(),
      "m+": d.getMinutes(),
      "s+": d.getSeconds(),
      "q+": Math.floor((d.getMonth() + 3) / 3),
      S: d.getMilliseconds(),
    };
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
        );
      }
    }
    return format;
  },
  getDateYear: function (type) {
    const date = new Date();
    let year = date.getFullYear();
    if (type === "start") {
      year = year - 60;
    } else if (type === "end") {
      year = year + 2;
    }
    return `${year}`;
  },
  getfilesize: function (limit) {
    var size = "";
    if (limit < 0.1 * 1024) {
      //如果小于0.1KB转化成B
      size = limit.toFixed(2) + "B";
    } else if (limit < 0.1 * 1024 * 1024) {
      //如果小于0.1MB转化成KB
      size = (limit / 1024).toFixed(2) + "KB";
    } else if (limit < 0.1 * 1024 * 1024 * 1024) {
      //如果小于0.1GB转化成MB
      size = (limit / (1024 * 1024)).toFixed(2) + "MB";
    } else {
      //其他转化成GB
      size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }
    var sizestr = size + "";
    var len = sizestr.indexOf(".");
    var dec = sizestr.substr(len + 1, 2);
    if (dec == "00") {
      //当小数点后为00时 去掉小数部分
      return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
    }
    return sizestr;
  },
  //时间戳转化成时间格式
  // timestampToTime: function(timestamp) {
  // 	var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  // 	const Y = date.getFullYear() + '-';
  // 	const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  // 	const D = helper.change(date.getDate()) + ' ';
  // 	const h = helper.change(date.getHours()) + ':';
  // 	const m = helper.change(date.getMinutes()) + ':';
  // 	const s = helper.change(date.getSeconds());
  // 	return Y + M + D + h + m + s;
  // },
  /* 时分秒,时间戳互转 */
  // 时间戳格式转换
  time: function (time) {
    let date = new Date(time); // 增加8小时
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (hours >= 1 && hours <= 9) {
      hours = "0" + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }

    let currentdate =
      date.getFullYear() + "-" + month + "-" + strDate + " " + hours + ":" + minutes;
    return currentdate;
  },

  time_to_sec(data, type) {
    if (type === "hh-mm-ss") {
      if (data != null) {
        let date = new Date(data * 1000);
        let hh = date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":";
        let mm = date.getMinutes() < 10 ? "0" + date.getMinutes() + ":" : date.getMinutes() + ":";
        let ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return hh + mm + ss;
      }
    } else {
      if (data !== null) {
        let s = "";
        s = Date.parse("1970-01-01 " + data) / 1000;
        return s;
      }
    }
  },

  change: function (t) {
    if (t < 10) {
      return "0" + t;
    } else {
      return t;
    }
  },
  timeDifference: function (startTime, endTime) {
    //截取字符串，得到日期部分"2009-12-02",用split把字符串分隔成数组
    var begin1 = startTime.substr(0, 10).split("-");
    var end1 = endTime.substr(0, 10).split("-");
    //将拆分的数组重新组合，并实例成化新的日期对象
    var date1 = new Date(begin1[1] + -+begin1[2] + -+begin1[0]);
    var date2 = new Date(end1[1] + -+end1[2] + -+end1[0]);
    //得到两个日期之间的差值m，以分钟为单位
    var m = parseInt(Math.abs(date2 - date1) / 1000 / 60);
    //小时数和分钟数相加得到总的分钟数
    var min1 = parseInt(startTime.substr(11, 2)) * 60 + parseInt(startTime.substr(14, 2));
    var min2 = parseInt(endTime.substr(11, 2)) * 60 + parseInt(endTime.substr(14, 2));
    //两个分钟数相减得到时间部分的差值，以分钟为单位
    var n = min2 - min1;
    var minutes = m + n;
    return minutes;
  },
  newdefaultVal: function (mode) {
    let data = initPicker(helper.getDateYear("start"), helper.getDateYear("end"), mode, 1);
    let year,
      month,
      day,
      hour,
      minute,
      second,
      newVal,
      yearVal,
      monthVal,
      dayVal,
      hourVal,
      minuteVal,
      secondVal;
    const newdate = new Date();
    year = newdate.getFullYear().toString(); //年
    month = (newdate.getMonth() + 1).toString(); //月
    day = newdate.getDate().toString(); //日
    hour = newdate.getHours().toString(); //时，
    minute = newdate.getMinutes().toString(); //分
    second = newdate.getSeconds().toString(); //秒
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    if (second < 10) {
      second = "0" + second;
    }
    if (Object.prototype.hasOwnProperty.call(data, "years")) {
      for (let i = 0; i < data.years.length; i++) {
        if (data.years[i] == year) {
          yearVal = i;
          break;
        }
      }
    }
    if (Object.prototype.hasOwnProperty.call(data, "months")) {
      for (let i = 0; i < data.months.length; i++) {
        if (data.months[i] == month) {
          monthVal = i;
          break;
        }
      }
    }
    if (Object.prototype.hasOwnProperty.call(data, "days")) {
      for (let i = 0; i < data.days.length; i++) {
        if (data.days[i] == day) {
          dayVal = i;
          break;
        }
      }
    }
    if (Object.prototype.hasOwnProperty.call(data, "hours")) {
      for (let i = 0; i < data.hours.length; i++) {
        if (data.hours[i] == hour) {
          hourVal = i;
          break;
        }
      }
    }
    if (Object.prototype.hasOwnProperty.call(data, "minutes")) {
      for (let i = 0; i < data.minutes.length; i++) {
        if (data.minutes[i] == minute) {
          minuteVal = i;
          break;
        }
      }
    }
    if (Object.prototype.hasOwnProperty.call(data, "seconds")) {
      for (let i = 0; i < data.seconds.length; i++) {
        if (data.seconds[i] == second) {
          secondVal = i;
          break;
        }
      }
    }
    switch (mode) {
      case "date":
        newVal = [yearVal, monthVal, dayVal];
        break;
      case "yearMonth":
        newVal = [yearVal, monthVal];
        break;
      case "dateTime":
        newVal = [yearVal, monthVal, dayVal, hourVal, minuteVal];
        break;
      case "dateTimes":
        newVal = [yearVal, monthVal, dayVal, hourVal, minuteVal, secondVal];
        break;
      case "time":
        newVal = [hourVal, minuteVal, secondVal];
        break;
      default:
        newVal = this.defaultVal;
        break;
    }
    return newVal;
  },
  toTreeViewJson: function (data, id) {
    var treeJson = [];
    var childNode = helper.jsonFind(data, function (v) {
      return v.parentId == id;
    });
    if (childNode.length > 0) {
      for (var i = 0; i < childNode.length; i++) {
        var treeModel = {
          id: childNode[i].id,
          text: childNode[i].label,
          hasChildren:
            helper.jsonFind(data, function (v) {
              return v.parentId == childNode[i].id;
            }).length == 0
              ? false
              : true,
          ChildNodes: JDcloud.toTreeViewJson(data, childNode[i].id),
          isexpand: childNode[i].isexpand == undefined ? true : childNode[i].isexpand,
          complete: true,
        };
        //编码
        if (childNode[i].code != undefined) {
          childNode[i].code = childNode[i].code;
        }
        if (childNode[i].title != undefined) {
          childNode[i].title = childNode[i].title;
        }
        //复选框
        if (childNode[i].showcheck != undefined) {
          childNode[i].showcheck = childNode[i].showcheck;
        }
        //复选框状态
        if (childNode[i].checkstate != undefined) {
          childNode[i].checkstate = childNode[i].checkstate;
        }
        //图标
        if (childNode[i].img != undefined) {
          childNode[i].img = childNode[i].img;
        }
        //扩展属性
        if (childNode[i].extdata != undefined) {
          childNode[i].extdata = childNode[i].extdata;
        }
        //允许点击
        if (childNode[i].click != undefined) {
          childNode[i].click = childNode[i].click;
        }
        treeJson.push(treeModel);
      }
    }
    return treeJson;
  },
  setSpinner: function (list, label, prop) {
    let spinner;
    if (prop) {
      for (var i = 0; i < list.length; i++) {
        if (list[i][prop.label] == label) {
          spinner = list[i][prop.value];
          break;
        }
      }
      return spinner;
    } else {
      for (var i = 0; i < list.length; i++) {
        if (list[i].fullName == label) {
          spinner = list[i].id;
          break;
        }
      }
      return spinner;
    }
  },

  getSpinner: function (list, value, prop) {
    let spinner;
    if (prop) {
      for (var i = 0; i < list.length; i++) {
        if (list[i][prop.value] == value) {
          spinner = list[i][prop.label];
          break;
        }
      }
      return spinner;
    } else {
      for (var i = 0; i < list.length; i++) {
        if (list[i].id == value) {
          spinner = list[i].fullName;
          break;
        }
      }
      return spinner;
    }
  },

  setSpinnerNew: function (
    list,
    label,
    prop = {
      label: "label",
      value: "value",
    }
  ) {
    let spinner;
    if (prop) {
      for (var i = 0; i < list.length; i++) {
        if (list[i][prop.label] == label) {
          spinner = list[i][prop.value];
          break;
        }
      }
      return spinner;
    } else {
      for (var i = 0; i < list.length; i++) {
        if (list[i].fullName == label) {
          spinner = list[i].id;
          break;
        }
      }
      return spinner;
    }
  },

  getSpinnerNew: function (
    list,
    value,
    prop = {
      label: "label",
      value: "value",
    }
  ) {
    let spinner;
    if (prop) {
      for (var i = 0; i < list.length; i++) {
        if (list[i][prop.value] == value) {
          spinner = list[i][prop.label];
          break;
        }
      }
      return spinner;
    } else {
      for (var i = 0; i < list.length; i++) {
        if (list[i].id == value) {
          spinner = list[i].fullName;
          break;
        }
      }
      return spinner;
    }
  },

  getUuid: function () {
    var len = 32; //32长度
    var radix = 16; //16进制
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
    var uuid = [],
      i;
    radix = radix || chars.length;
    if (len) {
      for (i = 0; i < len; i++) {
        uuid[i] = chars[0 | (Math.random() * radix)];
      }
    } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
      uuid[14] = "4";
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16);
          uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
        }
      }
    }
    return uuid.join("");
  },
  calcuMD5: function (pwd) {
    return md5(pwd);
  },
  msg: function (title, icon) {
    uni.showToast({
      title: title + "",
      icon: icon == undefined ? "none" : icon,
    });
  },
  /* 清除缓存 */
  removeStorage() {
    /* 删除缓存 */
    uni.removeStorageSync("item");
    uni.removeStorageSync("index");
    uni.removeStorageSync("rangData");
    uni.removeStorageSync("rangeIndex");
    uni.removeStorageSync("startedTitle");
    uni.removeStorageSync("F_FullName");
    uni.removeStorageSync("F_Category");
    uni.removeStorageSync("type");
    uni.removeStorageSync("F_Status");
    uni.removeStorageSync("obj");
    uni.removeStorageSync("_filedList");
    uni.removeStorageSync("transferId");
  },
  logout: function () {
    removeStorage("_commonMenu");
    removeStorage("_Token");
    removeStorage("_UserProvider");
    removeStorage("_Badge");
    uni.reLaunch({ url: "/pages/user/user" });
    this.setBadge(0);
  },
  setBadge: function (badge) {
    console.log("setBadge", badge);

    /* if (badge > 0) {
            uni.setTabBarBadge({
                index: 3,
                text: badge > 99 ? '99+' : badge.toString()
            });
        } else {
            uni.removeTabBarBadge({
                index: 3
            });
        } */
  },
  flowStatus: function (value) {
    let state;
    switch (value) {
      case 0:
        state = {
          text: "等待提交",
          statecss: "text-darkGray",
        };
        break;
      case 1:
        state = {
          text: "等待审核",
          statecss: "text-primary",
        };
        break;
      case 2:
        state = {
          text: "审核通过",
          statecss: "text-success",
        };
        break;
      case 3:
        state = {
          text: "审核驳回",
          statecss: "text-red",
        };
        break;
      case 4:
        state = {
          text: "审核撤回",
          statecss: "text-red",
        };
        break;
      case 5:
        state = {
          text: "审核终止",
          statecss: "text-gray",
        };
        break;
      default:
        state = {
          text: "等待提交",
          statecss: "text-darkGray",
        };
        break;
    }
    return state;
  },
  webSocket: function () {
    return console.log("关闭|webSocket");
    let that = this;
    try {
      const baseUrlObj = getGlobal("baseUrl");
      const global = getGlobal();
      const wssService = baseUrlObj.wssService;
      uni.connectSocket({
        url: wssService,
        complete: () => {},
      });
      uni.onSocketOpen(function (res) {
        const token = getStorage("_Token");
        global.contime = 0;
        if (!store.state.wschat.socketState) {
          console.log("OnConnection");
          store.state.wschat.socketState = true;
          console.log("OnConnection", store.state.wschat.socketState);
          const msg = JSON.stringify({
            method: "OnConnection",
            token: token,
            mobileDevice: true,
          });

          helper.sendSocketMessage(msg);
        }
      });
      uni.onSocketError(function (res) {
        console.log("onSocketError", res);
        store.state.wschat.socketState = false;
        setTimeout(function () {
          if (!store.state.wschat.socketState) {
            if (global.contime++ <= 10) {
              if (global.contime >= 3) {
                helper.msg("IM通讯正在连接:" + "连接第" + global.contime + "次！稍后...");
              }
              helper.reConnect();
            } else {
              helper.msg("IM通讯连接失败，联系服务器管理员");
            }
          }
        }, 0);
      });
      uni.onSocketClose(function (res) {
        console.log("onSocketClose", res);
        store.state.wschat.socketState = false;
      });
      uni.onSocketMessage(function (res) {
        let data = JSON.parse(res.data);
        const userProvider = getStorage("_UserProvider");
        const account = getStorage("_Account");
        let defMsg = "......";
        let content = {};
        //初始化消息
        let recentlys = new Array();
        const items = data;

        switch (data.method) {
          case "initMessage": //初始化
            let noticeMsgDef = {
              noticeText: data.noticeDefaultText,
              messageText: data.messageDefaultText,
              messageCount: data.unreadMessageCount,
              noticeCount: data.unreadNoticeCount,
              noticeDate: helper.toDate(new Date(), "MM-dd HH:mm"),
              messageDate: helper.toDate(new Date(), "MM-dd HH:mm"),
            };
            let badge = data.unreadMessageCount + data.unreadNoticeCount;
            for (var i = 0; i < data.unreadNums.length; i++) {
              var item = data.unreadNums[i];
              badge = badge + item.UnreadNum;
            }
            setStorage("_Badge", badge);
            that.setBadge(badge);
            const unreadNums = data.unreadNums;
            const recentlyList = getStorage("_To_" + account + "_Recently");
            if (recentlyList) {
              if (unreadNums.length > 0) {
                for (let i = 0; i < unreadNums.length; i++) {
                  switch (unreadNums[i].defaultMessageType) {
                    case "text":
                      defMsg = unreadNums[i].defaultMessage;
                      break;
                    case "voice":
                      defMsg = "[语音]";
                      break;
                    case "image":
                      defMsg = "[图片]";
                      break;
                  }
                  let _recently = helper.jsonFind(recentlyList, function (v) {
                    return v.friendId == unreadNums[i].sendUserId;
                  });
                  if (_recently.length > 0) {
                    _recently[0].count = unreadNums[i].unreadNum;
                    _recently[0].message = defMsg;
                    _recently[0].friendId = unreadNums[i].sendUserId;
                    _recently[0].time = helper.toDate(
                      unreadNums[i].defaultMessageTime,
                      "yyyy-MM-dd HH:mm"
                    );
                    _recently[0].url = "";
                    _recently[0].itle = "";
                  } else {
                    recentlys.push({
                      count: unreadNums[i].unreadNum,
                      friendId: unreadNums[i].sendUserId,
                      message: defMsg,
                      time: helper.toDate(unreadNums[i].defaultMessageTime, "yyyy-MM-dd HH:mm"),
                      url: "",
                      itle: "",
                    });
                  }
                }
                setStorage("_To_" + account + "_Recently", recentlys);
              }
            } else {
              for (let i = 0; i < unreadNums.length; i++) {
                switch (unreadNums[i].defaultMessageType) {
                  case "text":
                    defMsg = unreadNums[i].defaultMessage;
                    break;
                  case "voice":
                    defMsg = "[语音]";
                    break;
                  case "image":
                    defMsg = "[图片]";
                    break;
                }
                recentlys.push({
                  count: unreadNums[i].unreadNum,
                  friendId: unreadNums[i].sendUserId,
                  message: defMsg,
                  time: helper.toDate(unreadNums[i].defaultMessageTime, "yyyy-MM-dd HH:mm"),
                  url: "",
                  itle: "",
                });
              }
              setStorage("_To_" + account + "_Recently", recentlys);
            }
            store.commit("wschat/onlineUsersWSChat", data.onlineUsers);
            store.commit("wschat/unreadNumsWSChat", recentlys);
            store.commit("wschat/noticeMsgDefWSChat", noticeMsgDef);
            break;
          case "Online": //在线用户
            store.commit("wschat/onlineWSChat", data.userId);
            break;
          case "Offline": //离线用户
            store.commit("wschat/offlineWSChat", data.userId);
            break;
          case "sendMessage": //发送消息
            let sendMessage = new Array();
            switch (items.messageType) {
              case "text":
                content = {
                  text: items.toMessage,
                  emoji: [],
                };
                defMsg = items.toMessage;
                break;
              case "voice":
                content = {
                  url: items.toMessage.path,
                  length: items.toMessage.length,
                };
                defMsg = "[语音]";
                break;
              case "image":
                content = {
                  thumbnail: baseUrl + "/api/file/Image/IM/T" + items.toMessage.path,
                  url: baseUrl + "/api/file/Image/IM/" + items.toMessage.path,
                  w: items.toMessage.width,
                  h: items.toMessage.height,
                };
                defMsg = "[图片]";
                break;
            }
            if (userProvider) {
              sendMessage.push({
                type: "user",
                msg: {
                  id: 1,
                  type: items.messageType,
                  datetime: items.dateTime,
                  time: helper.timeForm(items.dateTime),
                  userinfo: {
                    uid: 0,
                    username: store.state.defsyslogn.accountNick,
                    face: baseUrl + userProvider.headIcon,
                    // face: baseUrl + JDcloud.userData(userProvider.id).F_HeadIcon
                  },
                  content: content,
                },
              });
              recentlys = getStorage("_To_" + account + "_Recently");

              if (recentlys) {
                let _recently = helper.jsonFind(recentlys, function (v) {
                  return v.friendId == items.toUserId;
                });
                if (_recently.length > 0) {
                  _recently[0].count = 0;
                  _recently[0].message = defMsg;
                  _recently[0].time = helper.timeForm(items.dateTime);
                } else {
                  recentlys.push({
                    count: 0,
                    friendId: items.toUserId,
                    message: defMsg,
                    userId: store.state.defsyslogn.userId,
                    time: helper.timeForm(items.dateTime),
                  });
                }
                setStorage("_To_" + account + "_Recently", recentlys);
              } else {
                switch (items.messageType) {
                  case "text":
                    defMsg = items.toMessage;
                    break;
                  case "voice":
                    defMsg = "[语音]";
                    break;
                  case "image":
                    defMsg = "[图片]";
                    break;
                }
                recentlys.push({
                  count: 0,
                  friendId: items.toUserId,
                  message: defMsg,
                  userId: store.state.defsyslogn.userId,
                  time: helper.timeForm(items.dateTime),
                });
                setStorage("_To_" + account + "_Recently", recentlys);
              }
            }
            store.commit("wschat/unreadNumsWSChat", recentlys);
            store.commit("wschat/sendMessageWSChat", sendMessage);
            break;
          case "receiveMessage": //接收消息
            console.log("receiveMessage");
            let badgen;
            badgen = getStorage("_Badge");
            badgen = badgen + 1;
            setStorage("_Badge", badgen);
            let receiveMessage = new Array();
            switch (items.messageType) {
              case "text":
                content = {
                  text: items.formMessage,
                  emoji: [],
                };
                defMsg = items.formMessage;
                break;
              case "voice":
                content = {
                  url: items.formMessage.path,
                  length: items.formMessage.length,
                };
                defMsg = "[语音]";
                break;
              case "image":
                content = {
                  thumbnail: baseUrl + "/api/file/Image/IM/T" + items.formMessage.path,
                  url: baseUrl + "/api/file/Image/IM/" + items.formMessage.path,
                  w: items.formMessage.width,
                  h: items.formMessage.height,
                };
                defMsg = "[图片]";
                break;
            }

            if (store.state.friend.friendId === items.formUserId) {
              receiveMessage.push({
                type: "user",
                msg: {
                  id: 1,
                  msgId: "",
                  type: items.messageType,
                  datetime: items.dateTime,
                  time: helper.timeForm(items.dateTime),
                  userinfo: {
                    uid: 1,
                    username: JDcloud.userData(items.formUserId).realName,
                    face: baseUrl + JDcloud.userData(items.formUserId).F_HeadIcon,
                  },
                  content: content,
                },
                method: items.method,
              });
            } else {
              recentlys = getStorage("_To_" + account + "_Recently");
              if (recentlys) {
                let _recently = helper.jsonFind(recentlys, function (v) {
                  return v.friendId == items.formUserId;
                });
                if (_recently.length > 0) {
                  _recently[0].count = _recently[0].count + 1;
                  _recently[0].message = defMsg;
                  _recently[0].time = helper.timeForm(items.dateTime);
                } else {
                  recentlys.push({
                    count: 1,
                    friendId: items.formUserId,
                    message: defMsg,
                    userId: store.state.defsyslogn.userId,
                    time: helper.timeForm(items.dateTime),
                  });
                }

                setStorage("_To_" + account + "_Recently", recentlys);
              } else {
                switch (items.messageType) {
                  case "text":
                    defMsg = items.formMessage;
                    break;
                  case "voice":
                    defMsg = "[语音]";
                    break;
                  case "image":
                    defMsg = "[图片]";
                    break;
                }
                recentlys.push({
                  count: 1,
                  friendId: items.formUserId,
                  message: defMsg,
                  userId: store.state.defsyslogn.userId,
                  time: helper.timeForm(items.dateTime),
                });
                setStorage("_To_" + account + "_Recently", recentlys);
              }
            }
            store.commit("wschat/unreadNumsWSChat", recentlys);
            store.commit("wschat/receiveMessageWSChat", receiveMessage);
            break;
          case "messageList": //消息列表
            store.commit("wschat/messageListWSChat", data);

            break;
          case "messagePush":
            store.commit("wschat/messagePushWSChat", data);
            break;
          case "logout":
            helper.msg("登录已过期");
            helper.logout();
            break;
          default:
            break;
        }
      });
    } catch (e) {}
  },

  sendSocketMessage: function (msg) {
    uni.sendSocketMessage({
      data: msg,
      fail: e => {
        helper.reConnect();
      },
    });
  },

  reConnect() {
    //重连
    helper.webSocket();
  },
};

export default helper;
