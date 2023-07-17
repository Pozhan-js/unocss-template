const http = uni.$u.http
const API_HEAD = '/api/mongoSystem/Permission/';
const ROLE = API_HEAD + "Role";
// 获取角色数据
export const getRoleData = () => {
    return http.get(ROLE + "/Selector")
}
