/**
 * @description: 弹出消息框
 * @param {String} title 消息标题
 * @param {String|Boolean} icon 状态(布尔类型时只有成功与失败状态,字符串类型时自定义)
 * @param {String|Object} info 信息([字符串]用于处理无message时显示空白问题,[对象]:配置强制内容显示,用于替换不需要的message)
 * @return {Object} 返回result对象,包含close,success,error,finally方法
 */
export function message(msg = "", state = true, info) {
  let config = {};
  let isIcon = typeof state === "string";//是否为图标类型
  const Enum = ["success", "error", "info", "warning", "none"];//支持的类型
  if (isIcon && !Enum.includes(state)) state = Enum[2];//不符合规则则默认为info
  else if (!isIcon) state = state ? Enum[0] : Enum[1]; //计算类型值
  if (isObject(info)) {//如果info是配置对象则进行处理
    let { auto, ..._config } = info;
    msg = info[state] || msg;
    if (auto) msg += state == "success" ? "成功" : "失败"; //自动填充成功还是失败后缀
    config = _config || {};
  }
  let params = { title: msg, icon: state, duration: 2000, ...config }
  uni.showToast(params);
  let result = {
    //前半部分为状态判断并调用回调函数,
    //使用||true是为了防止回调函数返回false时导致后面的代码不执行
    //这样保证了最后返回的是result对象,用于链式调用
    close: () => (params = result = null) || uni.hideToast(),
    success: (cb) => ((state == 'success' && cb(params)) || true) && result,
    error: (cb) => ((state == 'error' && cb(params)) || true) && result,
    finally: (cb) => (cb(state, params) || true) && result
  };
  return result;//返回结果
}

/**
 * @description: 弹出消息框
 * @param title 标题
 * @param content 内容
 * @param showCancel 是否显示取消按钮
 * @param cancelText 取消按钮文字
 * @param confirmText 确认按钮文字
 * @returns {Promise<unknown>}
 */
export function showModal({ title, content, showCancel = true, cancelText = '取消', confirmText = '确定' }) {
  return new Promise((res, rej) => {
    uni.showModal({
      title,
      content,
      showCancel,
      cancelText,
      confirmText,
      success({ confirm, cancel }) {
        if (confirm) res();
        else rej();
      }
    });
  });
}

/**
 * @description: 跳转路径
 * @param {String} path 路径地址
 * @param {Object=} query 路径query参数
 * @param {Object=} events 路径打开时需要通信的事件
 * @param {String} [method='navigateTo']  转跳方法
 * @return {Promise}
 */
export function goToPath(path, { query, events, method = 'navigateTo', duration = 0 } = {}) {
  if (typeof path !== 'string' || !path.length) return Promise.reject('参数路径不合法!');
  if (!uni[method] instanceof Function) return Promise.reject('method传入错误,没有该方法!')
  return new Promise((res, rej) => {
    setTimeout(() => {
      uni[method]({
        url: join(path, query),
        events,
        success() {
          res(...arguments)
        },
        fail({ errMsg }) {
          rej(errMsg)
        }
      })
    }, duration)
  })

  function join(path, query = {}) {
    if (typeof query === 'string') return path + '?query=' + query
    path += '?'
    for (const key in query) {
      path += (key + '=' + query[key] + '&')
    }
    return path.substr(0, path.length - 1)
  }
}
export function getTypeof(data) {
  //获取类型
  return Object.prototype.toString.call(data).slice(8, -1);
}
export function isObject(data) {
  //判断是否为对象
  return getTypeof(data) == "Object";
}

/**
 * @description: 创建定时器
 * @example let Timer=createTimer();
 * Timer.openTimer(()=>{console.log(0)},500);==>500毫秒后输出0;
 * Timer.clearTimer();==>关闭定时器
 * 在创建前调用关闭,可以实现防抖功能
 * @param {Boolean} isTimeOut 是否为setTimeOut
 * @param {Boolean} isAutoClear 是否自动清除原定时器
 * @return {openTimer:function,clearTimer:function}
 */
export function createTimer(isTimeOut = true) {
  let timer = null
  return {
    openTimer: function (fn, time) { //打开定时器
      if (!isFunction(fn)) throw new Error('请传入函数')
      clearTimer()
      if (typeof time !== 'number') time = (time >> 0 || 5000) //确保数字
      if (isTimeOut) {
        timer = setTimeout(fn.bind(this, timer = null), time)
      } else {
        timer = setInterval(fn.bind(this, clearTimer), time)
      }
      return useFn.bind(this, fn)
    },
    clearTimer
  }

  function useFn(fn) { //使用fn
    if (isFunction(fn)) fn(clearTimer, timer)
  }

  function clearTimer(fn) { //关闭定时器
    if (timer) {
      isTimeOut ? clearTimeout(timer) : clearInterval(timer)
      timer = null
      useFn(fn)
    }
  }
};
/**
 * @description: 是否为函数
 * @param {any} fn 待校验参数是否为函数
 * @param {Boolean} useFn 校验通过时是否调用函数
 * @param {any} params 调用函数时传入的参数
 * @param {any} defaultVal 如果函数执行后并没有返回值,且不需要返回的布尔值,可以设置默认值
 * @return {Boolean|any} 不执行函数则返回布尔值
 */
export function isFunction(fn, useFn = false, { params, defaultVal } = {}) {
  let isFn = fn instanceof Function
  if (useFn) useFn = isFn
  return get(useFn ? fn.call(this, params) : null)

  function get(val) {
    return val ?? defaultVal ?? isFn
  }
};
/**
 * @description: 函数上锁(未解锁时不执行,节流功能)[在页面销毁时需要关闭锁函数]
 * @param {Boolean} isAutoUnlock 是否自动解锁
 * @param {Number} unlockTime 自动解锁时间
 * @return {Boolean} 锁状态
 */
export function lockFunction(isAutoUnlock = false, unlockTime = 0) {
  let _lock = false,
    autoCancel = null,
    Timer = null,
    runNum = 0 //执行次数
  return function (fn, { cancel, lockFn } = {}) {
    if (fn === 'close') return close() //传入close字符串关闭函数
    if (fn === 'unlock') return unlock() //传入unlock字符串解锁函数
    if (!isFunction(fn)) throw 'this is not a function' //这不是一个函数
    if (isAutoUnlock && runNum && !unlockTime) unlock(true) //无时间提前自动解锁(首次不执行)
    if (_lock) return isFunction(lockFn, true) //上锁时才触发
    if (cancel) autoCancel = cancel //赋值取消函数
    lock(runNum++) //上锁
    fn(unlock, close) //传入解锁函数
    if (isAutoUnlock && unlockTime) {
      if (Timer === null) Timer = createTimer(true)
      Timer.openTimer(unlock, unlockTime >> 0)
    }
    //有时间按时间自动解锁
    return () => _lock
  }

  function close() { //关闭函数
    if (Timer) Timer.clearTimer()
    Timer = autoCancel = null
    _lock = false
    runNum = 0
  }

  function lock() { //上锁函数
    _lock = true
  }

  function unlock(useCancel = false) { //解锁函数(是否启用cancel函数)
    _lock = false
    if (Timer) Timer.clearTimer(useCancel ? autoCancel : null)
  }
};
/**
 * @description: 获取查询时的过滤条件
 * @param {object} data 查询条件({key:value})
 * @param {string} method 查询方法(eq,like,gt,lt,ge,le)
 * @param {string} type 查询类型(custom,or,and)
 * @return {array} 
 */
export function getSearchFilter(data = {}, { method = "eq", type = "custom" } = {}) {
  const list = [];
  const get = (val) => Array.isArray(val) ? val : [val];
  for (const key in data) {
    list.push({ key, method, type, value: get(data[key]) })
  }
  return list;
}
export function addTimeStamp(url) {
  if (url.indexOf("?") > -1) {
    return url + "&n=" + Date.now();
  } else {
    return url + "?n=" + Date.now();
  }
}
//删除数组指定项
export function removeArrayItem(arr, value, key = "id") {
  let item = null;
  const index = key ? arr.findIndex(o => o[key] === value) : arr.indexOf(value);
  if (index > -1) item = arr.splice(index, 1);
  return item;
}
export function createHashTable(list = [], key = "id", filter) {
  // 创建一个哈希表
  const hashTable = {};
  if (typeof filter === 'function') {
    var fn = (val) => filter(val);//返回自定义值
  } else if (typeof filter === 'string') {
    var fn = (val) => val[filter];//返回指定字段
  } else {
    var fn = (val) => val;//默认返回原值
  }
  const getKey = (data) => key.split('.').reduce((pre, cur) => pre[cur], data);//解析多级key(例:a.b)
  for (const element of list) {
    hashTable[getKey(element)] = fn(element);
  }
  return hashTable;
}

/**
 * @description: 将数组转换为树形结构
 * @param {array} list 数组
 * @param {object} options 配置项
 * @return {array} 树形结构
 */
export function transformTree(list, options = {}) {
  const {
    keyField = 'id',
    childField = 'children',
    parentField = 'parentId',
    checkFn = (res) => res && res != -1 //当parentField为-1或者其他特殊值,需要传入校验函数
  } = options;
  const tree = [];
  const record = {}; //记录单次children结果
  for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i];//当前项
    const id = item[keyField];//当前项id
    if (!id) continue;//id不存在则跳过
    let record_id = record[id];
    item[childField] = record_id ? record_id : (record[id] = []);
    //如果当前项有parentId,则将当前项添加到parentId对应的children中
    if (checkFn(item[parentField])) {
      const parentId = item[parentField];
      if (!record[parentId]) record[parentId] = [];
      record[parentId].push(item);//将当前项添加到parentId对应的children中
    } else {
      //如果当前项没有parentId,则将当前项添加到根节点中
      tree.push(item);
    }
  }
  return tree;
}

/**
 * @description: 树型扁平化(递归处理)
 * @param {array} data 待处理数据
 * @param {string} [childField= "children"] 子元素标识符
 * @param {?function} filterFn 传递过滤函数时可自行控制循环和返回值,这样可以在递归时处理数据
 * @param {array} [defaultValue=[]] 默认数据
 * @return {array}
 */
export function extractTree(
  data,
  { childField = "children", filterFn, defaultValue = [] } = {}
) {
  let res = defaultValue,
    isOver = false, //是否结束
    isSkip = false,//是否跳过
    index = -1;//计数索引
  const main = filterFn instanceof Function ?
    (el, source) => {
      index++;
      const getParent = () => source;
      const getIndex = () => index;
      const params = { over, get, set, skip, getTier, getParent, getIndex }
      return filterFn(el, params);
    } : (el) => res.push(el);
  let tier = 0; //层级
  const fn = (source = []) => {
    index = -1;//每次递归时重置索引
    for (const el of source) {
      main(el, source);
      if (isOver) return;
      if (isSkip) {
        isSkip = false;
        continue;
      }
      if (el[childField] && el[childField].length > 0)
        fn(el[childField], ++tier) || --tier;//递归时加1,结束后减1
    }
  };

  function over() {
    isOver = true;
  } //结束循环
  function get() {
    return res;
  } //返回值值
  function set(val) {
    res = val;
  } //设置值
  function skip() {
    isSkip = true;
  } //跳过当前
  function getTier() {
    return tier;
  } //获取层级
  fn(data);
  return res;
}
/**
 * @description: 获取对象指定属性值
 * @param {object} obj 目标对象
 * @param {array} attrs 需要返回的目标对象的属性列表
 * @param {any} defaultValue 默认值(支持函数,对象,其他数据)
 * @return {object}
 * @example
 * 如果属性列表中包含目标对象没有的属性,会设置undefined
 * getObjectAssignProperty({a:1,b:2},["a","c"]):==>{a:1,c:undefined}
 */
export function getObjectAssignProperty(obj, attrs = [], defaultValue) {
  var getDefaultValue = function () {
    //获取默认值(函数执行后会获取一个固定函数)
    let fn = () => defaultValue;
    if (isObject(defaultValue)) {
      fn = (key) => {
        const val = defaultValue[key];
        return isFunction(val) ? val(obj) : val;
      }
    } else if (isFunction(defaultValue)) {
      fn = defaultValue;
    }
    getDefaultValue = fn;
    return fn.apply(this, arguments);
  }
  return attrs.reduce((val, key) => {
    const [keyName, alias] = key.split("|");//(目标属性名|返回属性名)
    val[alias || keyName] = obj[keyName] || getDefaultValue(keyName);
    return val;
  }, {});
}
/**
 * @description: 获取引用对象属性值
 * @param {object} raw 原始对象
 * @param {object} target 目标对象
 * @return {object}
 * @example
 * 根据原始对象的属性值,获取目标对象的属性值,如果目标对象没有该属性,则使用原始对象的属性值
 * getReferenceObjectProperty({a:1,b:2},{b:3,c:1}):==>{a:1,b:3}
 */
export function getReferenceObjectProperty(raw = {}, target = {}) {
  if (!isObject(raw) || !isObject(target)) return raw;
  return Object.entries(raw).reduce((obj, [key, val]) => {
    obj[key] = verifyEmpty(target[key]) ? val : target[key];
    return obj;
  }, {});
}
export function verifyEmpty(val) {
  //校验是否为空
  if (val === null || val == undefined) return true;
  if (["boolean", "number"].includes(typeof val)) return false;
  switch (getTypeof(val)) {
    case "String":
    case "Array":
      return !val.length;
    case "Map":
    case "Set":
      return !val.size;
    case "Object":
      return !Object.keys(val).length;
  }
  return false;
}

// 获取过滤参数格式
/* 
参数格式

*/

/**
 * 
 * @param {*} params params[key|value,key|value] 传递过滤参数形式
 * @returns 
 */
export function getFilterParamsFormat(params = []) {
var resultInfo = params.map((item, index) => {
    var arr = item.split("|")
    return {
      key: `${arr[0]}`,
      method: "eq",
      type: "custom",
      value: [arr[1]],
    }
  })
  return resultInfo
}




