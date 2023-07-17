const http = uni.$u.http;
// 获取我发起的
export const getFlowLaunch = data => http.get(`/api/workflow/Engine/FlowLaunch`, data);
// 删除我发起的
export const delFlowLaunch = id => http.delete(`/api/workflow/Engine/FlowLaunch/${id}`);

// 获取待办事项
export const getFlowBefore = (id, data) => http.get(`/api/workflow/Engine/FlowBefore/List/${id}`, data);

export const getFlowBeforeInfo = (id, data) => http.get(`/api/workflow/Engine/FlowBefore/${id}`, data);

// 获取待办事项
export const getFlowEngine = id => http.get(`/api/workflow/Engine/FlowEngine/${id}`);
export const postFlowTask = data => http.post(`/api/workflow/Engine/FlowTask`, data);
export const getFlowTask = id => http.get(`/api/workflow/Engine/FlowTask/${id}`);
export const updateFlowTask = (data) => http.put(`/api/workflow/Engine/FlowTask/${data.id}`,data);

//转办事项
export const postFlowTransfer = (id, data) => http.post(`/api/workflow/Engine/FlowBefore/Transfer/${id}`, data);

// 催办事项
export const postFlowLaunch = (id, data) => http.post(`/api/workflow/Engine/FlowLaunch/Press/${id}`, data);

// 撤回事项
export const postFlowRecall = (id, data) => http.post(`/api/workflow/FlowBefore/Recall/${id}`, data);

//发起撤回
export const postFlowLaunches = (id, data) => http.put(`/api/workflow/Engine/FlowLaunch/${id}/Actions/Withdraw`,data);

// 发起拒绝
export const postFlowReject = (id, data) => http.post(`/api/workflow/Engine/FlowBefore/Reject/${id}`, data);

// 通过
export const getAgree = () => http.get(`/api/workflow/Engine/FlowBefore/List/2`);
export const postAgree = (id, data) => http.post(`/api/workflow/Engine/FlowBefore/Audit/${id}`, data);
