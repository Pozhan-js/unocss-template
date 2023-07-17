const http = uni.$u.http;
const baseFlowUrl = "/api/mongoWorkflow/FlowTask";
// 流程发起
export const flowStart = (flowId, data) =>
  http.post(`${baseFlowUrl}`, { data: JSON.stringify(data), flowId, status: 0 });

// 获取我发起的流程列表(带分页)
export const getFlowStartList = data => http.post(`${baseFlowUrl}/startList`, data);
// 我的待办(带分页)
export const getFlowAuditList = data => http.post(`${baseFlowUrl}/AuditList`, data);
// 我的已办(带分页)
export const getFlowHandleList = data => http.post(`${baseFlowUrl}/HandleList`, data);

//获取流程表单、流转信息、流转记录
export const getFlowFormRecode = ({ flowId, operatorRecordId, type }) =>
  http.get(`${baseFlowUrl}/${flowId}/${operatorRecordId}/${type}`);

// 同意
export const userAuditAgree = ({ flowId, operatorRecordId }, data) => {
  return http.post(`${baseFlowUrl}/Audit/${flowId}/${operatorRecordId}`, data);
};
// 拒绝
export const userAuditReject = ({ flowId, operatorRecordId }, data) => {
  return http.post(`${baseFlowUrl}/Reject/${flowId}/${operatorRecordId}`, data);
};
