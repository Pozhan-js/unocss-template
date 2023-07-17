const http = uni.$u.http
const API_HEAD = '/api/mongoSystem/Permission/';
const ORGANIZE = API_HEAD + "Organize";
// 获取组织/公司扁平数组
export const getOrganize = () => {
    return http.get(ORGANIZE + '/List')
}


