const http = uni.$u.http
// 获取分页数据
export const getGardenList = (currentId,data) => http.post(`/api/system/Base/DataInterface/${currentId}/Actions/Response`,data)

 //加关注
 export const addFocus = (data) => http.post(`/api/visualdev/OnlineDev/5940ef4a8ef14b2a9e30a3c9c0996b3d`,data)
// 不再关注
 export const removeFocus = (delId) => http.delete(`/api/visualdev/OnlineDev/delete/5940ef4a8ef14b2a9e30a3c9c0996b3d/${delId}`)
 // 提交评论
 export const addComment = (data) => http.post(`/api/visualdev/OnlineDev/2bc631faad0d4a838beac72754de8f00`,data)
 //查询圈子评论
 export const getCommentList = (data) => http.post(`/api/system/Base/DataInterface/06251f3de20d4bc6a3f2ba425a2848a6/Actions/Response`,data)
 // 发布圈子
 export const addGarden = (data) => http.post(`/api/visualdev/OnlineDev/1f2abb9202e746858f4307d2242ff96b`,data)
 // 提交详情评论
 export const addDetailComment = (data) => http.post(`/api/visualdev/OnlineDev/c2801bcc03d64a63b4f4e0d8cb7557a0`,data)
 // 删除评论
 export const removeComment = (delId) => http.delete(`/api/visualdev/OnlineDev/delete/c2801bcc03d64a63b4f4e0d8cb7557a0/${delId}`)
 
 export const removeDetailComment = (delId) => http.delete(`/api/visualdev/OnlineDev/delete/2bc631faad0d4a838beac72754de8f00/${delId}`)