import { getGlobal } from "./config";
/**
 * @description: 过滤数据(脱壳) 
 * @param {Object} data 把请求成功的res数据传入进来,或者直接await 请求接口()
 * @param {Function|Boolean} filterFn 可以再传入一个回调函数对返回的数据进行二次处理
 * @param {String} key 可以控制返回的字段
 * @return {Array|Object} 返回值
 */
export function filterDate(data, filterFn, key) {
    //filterFn为布尔值true时,仅返回data,不获取list
    data = data?.data;
    let list = data?.[key || "list"] || []
    if (!Array.isArray(list) || typeof filterFn != "function") return (filterFn ? (data || {}) : (list || []));
    return list.map(res => {
        return filterFn(res);
    })
}
//过滤封面
export function filterCover(data, isUrl = true) {
    if (!data) return ""
    if (typeof data == "string") data = JSON.parse(data);
    return isUrl ? data[0]?.url : data[0];
}
//获取图片地址
const apiUrl = getGlobal("baseUrl").apiUrl;
export function getImage(fileName = "", tenement = "dtghc") {
    if (!!tenement) tenement += "/";
    if (fileName.lastIndexOf(".") === -1) fileName += '.png'; //默认png后缀
    return apiUrl + "/api/mongoFile/Image/systemicon/" + tenement + fileName;
}