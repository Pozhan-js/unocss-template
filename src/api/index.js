const http = uni.$u.http
// 获取分页数据
export const getActiveList = (params) => http.get(`/api/visualdev/OnlineDev/6051fd279ffd49e290bfe033f821751a/List`,{params})
// 
export const getActiveListNotLogin = (params) => http.get(`/api/visualdev/OnlineDev/6051fd279ffd49e290bfe033f821751a/3/List/Override/Public`,{params})

// 获取湖南省树级结构
export const getHNTreeData = () => http.post(`/api/system/Base/DataInterface/fa6e200c2ce74e80a514db09767553eb/Actions/Response`)
 
// 获取湖南省树级结构
export const getHNTreeDataNotLogin = () => http.post(`/api/system/Base/DataInterface/fa6e200c2ce74e80a514db09767553eb/3/Actions/Response/Public`)


// 获取活动已参与数据
export const getJoinActiveList = (data) => http.post(`/api/system/Base/DataInterface/b0e19e3faac9487086b943936898da43/Actions/Response`,data)
// export const getJoinActiveList = (data) => http.post(`/api/system/Base/DataInterface/b0e19e3faac9487086b943936898da43/3/Actions/Response/Public`,data)
// 获取活动 未参与
export const getNotJoinActiveList = (data) => http.post(`/api/system/Base/DataInterface/b5413810305641189b9cf1d67eea3300/Actions/Response`,data)
// export const getNotJoinActiveList = (data) => http.post(`/api/system/Base/DataInterface/b5413810305641189b9cf1d67eea3300/3/Actions/Response/Public`,data)
// 已完成
export const getCompleteList = (data) => http.post(`/api/system/Base/DataInterface/1468797761244ec4b7ed49a80c178e8d/Actions/Response`,data)
// export const getCompleteList = (data) => http.post(`/api/system/Base/DataInterface/1468797761244ec4b7ed49a80c178e8d/3/Actions/Response/Public`,data)
// 轮播图
export const getBannerList = () => http.get(`/api/visualdev/OnlineDev/eb4833a791f048ad8ca2d338b2488a7f/List`)
// 轮播图	
export const getBannerListNotLogin = () => http.get(`/api/visualdev/OnlineDev/eb4833a791f048ad8ca2d338b2488a7f/3/List/Override/Public`)
// 公告
export const getNotice = () => http.get(`/api/system/Message/Notice`)
// 精选活动
export const getSelectActive = () => http.get(`/api/visualdev/OnlineDev/af39e9e684b1446980b32399cc57d878/List`)
export const getSelectActiveNotLogin = () => http.get(`/api/visualdev/OnlineDev/af39e9e684b1446980b32399cc57d878/3/List/Override/Public`)

// 参与人数
export const getScanPersonNum = (data) => http.post(`/api/system/Base/DataInterface/2a02e53d482d4d6fb83cf70363fc5ef1/Actions/Response`,data)
// 确认签到
export const userSign = (data) => http.post(`/api/visualdev/OnlineDev/8e3f3745c7d34efaafa79197a45f7b85`,data)
// 查询是否签到
export const userAlreadSign = (params) => http.get(`/api/visualdev/OnlineDev/8e3f3745c7d34efaafa79197a45f7b85/List`,{params})
export const getSignDetail = (data) => http.post(`/api/system/Base/DataInterface/57bf710d20b246f3a0149645b52ea4ff/Actions/Response`,data)
// 热榜/OnlineDev/b4e0e394d27b40069df90720ea3a3fb9/3/List/Override/Public
export const getHotList = (params) => http.get(`/api/visualdev/OnlineDev/b4e0e394d27b40069df90720ea3a3fb9/List`,{params})
export const getHotListNotLogin = (params) => http.get(`/api/visualdev/OnlineDev/b4e0e394d27b40069df90720ea3a3fb9/3/List/Override/Public`,{params})