const http = uni.$u.http
// 获取表单配置
export const getFormConfig = modelId => http.get(`/api/mongoVisualdev/base/${modelId}`);

export function deteleAllModel(modelId, data) {
    return http.delete(`/api/mongoVisualdev/online_dev/delete_batch/${modelId}`, data);
}
