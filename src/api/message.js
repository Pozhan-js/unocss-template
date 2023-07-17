const http = uni.$u.http
// 获取消息
export const getMessage = (data) => http.get(`/api/system/Message`,data)
// 阅读系统公告ReadInfo
export const getReadInfo = (id) => http.get(`/api/system/Message/ReadInfo/${id}`,)


// 获取待我处理分页

export const getHandleListPage = (params) => http.get(`/api/system/Message/from/HandleListPage`, {params})

// 获取表单下发message
export const getFormMessageInfo = (id) => http.get(`/api/system/Message/from/info/${id}`)

// 修改表单下发dataid
export const updateDataId = (id, dataid) => http.put(`/api/system/Message/from/${id}/${dataid}`)
