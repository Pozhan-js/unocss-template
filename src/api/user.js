const http = uni.$u.http
import config from "@/common/config.js"
// 登录

// 修改头像
export const updateAvatar = (imgUrl) => http.put(`api/system/Permission/Users/Current/Avatar/${imgUrl}`)
// 专业list
export const getProfessionalArray = (data) => http.post('/api/system/Base/DataInterface/f68869c3f696482d9b32b7a230df5bdb/Actions/Response', data)

export const getRegularCollegeArray = (data) => http.post('/api/system/Base/DataInterface/0a06f7e903574ec08a0a265d1f081f55/Actions/Response', data)

export const getProfessionCollegeArray = (data) => http.post('/api/system/Base/DataInterface/3a8b1d840a4240e88233fa1de1da7cc3/Actions/Response', data)
// 
export const getSchoolList = (data) => http.post('/api/system/Base/DataInterface/53d42d2e7c7b45698a9dc331d28bcdde/Actions/Response', data)
export const userLogin = (data) => http.post(`/api/mongoOauth/Login?client_id=admin&client_secret=123456&scope=all&grant_type=password`,data)

export const userSendCode = (phone) => http.get(`https://kindoucloud.com:8011/api/oauth/sendMsg/${phone}/login/${config.Global.tenantId}`)
// 获取邀请小程序码
export const getInviteCode = (data) => http.post(`/api/oauth/GenerateAppletCode`,data)
/**
 * jsapi下单
 */
export const userCreateOrder = (data) => http.post(`/api/third/MiniAppPay/JsapiCreateOrder`,data)
/**
 * 获取用户openid
 */
export const getUserOpenId = (code) => http.get(`/api/third/MiniApp/${config.Global.tenantId}/${code}/Openid`)
/**
 * 申请交易账单
 */
export const getTradebill = (bill_date) => http.get(`/api/third/MiniAppPay/${config.Global.tenantId}/${bill_date}/Tradebill`)

/**
 * 申请退款
 */
export const userRefund = (out_trade_no) => http.get(`/api/third/MiniAppPay/${config.Global.tenantId}/${out_trade_no}/Refund`)