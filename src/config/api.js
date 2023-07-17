const http = uni.$u.http;
import { addTimeStamp } from "@/common"; //添加时间戳
import config from "@/common/config.js";
const MODE_HADE = "/api/mongoVisualdev/online_dev/";

// 获取数据列表
export const getModelList = (id, data) =>
  http.post(MODE_HADE + id + "/list", data);
// 新建数据列表
export const createModel = (modelId, data) =>
  http.post(MODE_HADE + modelId, { data: JSON.stringify(data || {}) });
// 修改数据列表
export const updateModel = (modelId, data, id) =>
  http.put(MODE_HADE + `update/${modelId}/${data._id || id || ""}`, data);
// 获取数据信息详情
export const getModelInfo = (modelId, id) =>
  http.get(MODE_HADE + `${modelId}/${id}`);
// 批量操作
export const batchOperation = (modelId, data) =>
  http.post(MODE_HADE + `batch_insert_update/${modelId}`, data);
export const getAppCustomAuthorize = () =>
  getModelList("645b4093d57a117d31a25195", {
    filter: [
      { key: "role", method: "like", type: "field", value: ["currentRole"] },
    ],
    pageSize: 100,
  });
// 获取所以可发起的流程
export const getFlowList = () =>
  http.get(`/api/mongoWorkflow/FlowVersion/ListAll`);
// 获取自动生成的流程
export const getFlowEngine = id =>
  http.get(`/api/mongoWorkflow/FlowVersion/initiate/${id}`);

// 流程表单主表属性
export const engineFieldDataSelect = id =>
  http.get(`/api/workflow/Engine/FlowEngine/${id}/FieldDataSelect`);

// 获取流程的属性
export const engineFieldDataSelectValue = (flowId, id) =>
  http.get(`/api/workflow/Engine/FlowTask/${flowId}/${id}`);

// 获取表单主表属性
export const baseFieldDataSelect = (id, params) =>
  http.get(`/api/visualdev/Base/${id}/FieldDataSelect`, { params });

// 获取Public数据列表
export const getPublicModelList = (id, params) =>
  http.get(
    `/api/visualdev/OnlineDev/${id}/${config.Global.tenantId}/List/Override/Public`,
    {
      params,
    }
  );

// 删除数据列表
export const deteleModel = (modelId, id) =>
  http.delete(`/api/visualdev/OnlineDev/delete/${modelId}/${id}`);
// 修改数据

// 获取表单属性
export const baseFieldDataSelectValue = (modelId, id) =>
  http.get(`/api/visualdev/OnlineDev/${modelId}/${id}/DataChange`);
export const baseFieldDataSelectValuePublic = (modelId, id) =>
  http.get(
    `/api/visualdev/OnlineDev/${modelId}/${id}/${config.Global.tenantId}/DataChange/Public`
  );
// 获取组织/公司树形
export const getOrganizeTree = () =>
  http.get(`/api/mongoSystem/Permission/Organize/Tree`);

export const getTreeView = () =>
  http.get(`/api/mongoSystem/Permission/Organize/List`);

export const getTreeUserView = () =>
  http.get(`/api/mongoSystem/Permission/Users/Selector`);
// 获取个人数据
export const getCurrentUser = () => http.get(`/api/mongoOauth/App/CurrentUser`);
// 获取用户列表
export const getUsersData = () =>
  http.get(`/api/mongoSystem/Permission/Users/All`);
// 获取角色列表
export const getRoleData = () => http.get(`/api/mongoSystem/Permission/Role`);
// 获取岗位列表
export const getPositionData = () =>
  http.get(`/api/mongoSystem/Permission/Position/All`);
// 获取组织列表
export const getOrganizeData = () =>
  http.get(`/api/mongoSystem/Permission/Organize`);
// 保存常用功能APP
export const saveCommonMenu = data =>
  http.put(`/api/mongoSystem/Permission/Users/Current/CommonMenu`, {
    commonMenu: JSON.stringify(data),
  });

// 获取门户展示数据(权限)
export const getAuthPortal = id => http.get(`/api/visualdev/Portal/${id}/auth`);
// 获取门户下拉框列表
export const getPortalSelector = params =>
  http.get(`/api/visualdev/Portal/Selector`, { params });
// 保存信息/提交
export const saveFlowTask = data =>
  http.post(`/api/workflow/Engine/FlowTask`, data);

// 动态获取工作区数据
export const getFeaturesList = (id, params) =>
  http.get(`/api/visualdev/OnlineDev/App/${id}/List`, { params });

// 获取工作区字段
export const getFeaturesConfig = id =>
  http.get(`/api/visualdev/OnlineDev/App/${id}/Config`);
// 获取数据接口
export const previewDataInterface = (id, data) =>
  http.post(
    `/api/system/Base/DataInterface/${id}/Actions/Response`,
    data == undefined ? {} : data
  );
// 获取数据接口
export const previewDataInterfacePublic = (id, data) =>
  http.post(
    `/api/system/Base/DataInterface/${id}/${config.Global.tenantId}/Actions/Response/Public`,
    data == undefined ? {} : data
  );
// 获取功能按钮权限
export const getButtonAuth = id =>
  http.get(`/api/system/Base/ModuleButton/${id}/List`);
// 获取数据列表权限
export const getListAuth = id =>
  http.get(`/api/system/Base/ModuleColumn/${id}/Fields`);

//获取列表表单list
export const getModelIdList = (id, params) =>
  http.get(`/api/visualdev/OnlineDev/${id}/List`, { params });
// 删除数据
export const deleleModel = (modelId, id) =>
  http.delete(`/api/visualdev/OnlineDev/delete/${modelId}/${id}`);
//获取列表表单配置JSON
export const getModelIdConfig = id =>
  http.get(`/api/visualdev/OnlineDev/${id}/Config`);
