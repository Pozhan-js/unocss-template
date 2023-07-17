const http = uni.$u.http;
// 获取我发起的
export const getFlowLaunch = params => http.get(`/api/workflow/Engine/FlowLaunch`, {params});
// 删除我发起的
export const delFlowLaunch = id => http.delete(`/api/workflow/Engine/FlowLaunch/${id}`);

// 获取待办事项
export const getFlowBefore = (id, params) => http.get(`/api/workflow/Engine/FlowBefore/List/${id}`, {params});

export const getFlowBeforeInfo = (id, data) => http.get(`/api/workflow/Engine/FlowBefore/${id}`, data);

// 获取待办事项
export const getFlowEngine = id => http.get(`/api/workflow/Engine/FlowEngine/${id}`);
export const postFlowTask = data => http.post(`/api/workflow/Engine/FlowTask`, data);
export const getFlowTask = id => http.get(`/api/workflow/Engine/FlowTask/${id}`);

//转办事项
export const postFlowTransfer = (id, data) => http.post(`/api/workflow/Engine/FlowBefore/Transfer/${id}`, data);

// 催办事项
export const postFlowLaunch = (id, data) => http.post(`/api/workflow/Engine/FlowLaunch/Press/${id}`, data);

// 撤回事项
export const postFlowRecall = (id, data) => http.post(`/api/workflow/FlowBefore/Recall/${id}`, data);

//发起撤回
export const postFlowLaunches = id => http.put(`/api/workflow/Engine/FlowLaunch/${id}/Actions/Withdraw`);

// 发起拒绝
export const postFlowReject = (id, data) => http.POST(`/api/workflow/FlowBefore/Reject/${id}`, data);

// 通过
export const getAgree = () => http.get(`/api/workflow/Engine/FlowBefore/List/2`);
export const postAgree = (id, data) => http.post(`/api/workflow/Engine/FlowBefore/Audit/${id}`, data);
