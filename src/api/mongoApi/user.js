const http = uni.$u.http
const USER_HEAD = '/api/mongoSystem/Permission/Users';
// 获取用户列表
export function getUserSelector() {
    return http.get(USER_HEAD + "/Selector")
}
