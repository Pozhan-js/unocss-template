import { getOrganize } from '@/api/mongoApi/organize'
import { getRoleData } from '@/api/mongoApi/role'
import { getUserSelector } from "@/api/mongoApi/user";
import {extractTree,transformTree,createHashTable} from "@/common";
const cacheState = new Map();//缓存状态仓库
const cacheRequest = (fn, key) => {//缓存请求
    if (!key) key = fn.name || null;//如果没有key则使用函数名作为key
    if (key === null) throw new Error('cacheRequest: key is null');
    if (cacheState.has(key)) return cacheState.get(key);
    const result = new Promise((res, rej) => {
        let errIndex = 0;
        const reloadRequest = () => {
            fn()
                .then(o => cacheState.delete(key, res(o)))//请求成功后缓存出库
                .catch(o => errIndex++ > 3 ? rej(o) : reloadRequest());//请求失败后重试3次
        }
        reloadRequest();
    });
    cacheState.set(key, result);
    return result;
};
const state = {
    userTree: [],
    roleTree: [],
    organizeTree: []
}
const mutations = {
    SET_USER_LIST: (state, userList) => {
        state.userList = userList
    },
    SET_USER_TREE: (state, userTree) => {
        state.userTree = userTree
    },
    SET_ROLE_TREE: (state, roleTree) => {
        state.roleTree = roleTree
    },
    SET_ORGANIZE_TREE: (state, organizeTree) => {
        state.organizeTree = organizeTree
    },
    SET_ORGANIZE_LIST: (state, organizeList) => {
        state.organizeList = organizeList
    },
}
const getters = {
    userHashTable: state => createHashTable(state.userList),
}
const actions = {


    async getOrganizeTree({ state: { organizeTree }, commit }, refresh) {
        if (refresh || !organizeTree.length) {
            let organizeList = (await cacheRequest(getOrganize,"getOrganize")).data || [];
            commit("SET_ORGANIZE_LIST", organizeList)
            organizeTree = transformTree(organizeList, { parentField: "parentId" });
            commit("SET_ORGANIZE_TREE", organizeTree)
        }
        return organizeTree
    },

    async getUserTree({ state: { userTree }, commit }, refresh) {
        if (refresh || !userTree.length) {
            userTree = (await cacheRequest(getUserSelector,"getUserSelector")).data.list || [];
            commit("SET_USER_TREE", userTree)
        }
        return userTree
    },
    async getRoleTree({ state: { roleTree }, commit }, refresh) {
        if (refresh || !roleTree.length) {
            roleTree = (await cacheRequest(getRoleData,"getRoleData")).data || [];
            commit("SET_ROLE_TREE", roleTree)
        }
        return roleTree
    },


    async getUserList({ state: { userList }, commit, dispatch }, refresh) {
        if (refresh || !userList.length) {
            userList = extractTree(await dispatch("getUserTree"), {
                filterFn(item, { get }) {
                    item.type === "user" && get().push(item);
                }
            });
            commit("SET_USER_LIST", userList)
        }
        return userList
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
