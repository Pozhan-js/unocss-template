import Vue from "vue";
import Vuex from "vuex";
import { getStorage } from "@/common/config";

Vue.use(Vuex);
const state = {
  token: null,
  associateHashMap: {},
  userInfo: getStorage("_UserProvider") || null,
};

const mutations = {
  emptyAssociateHashMap: (state, id) => {
    state.associateHashMap[id] = null;
  },
  setAssociateHashMap: (state, { tableData, id, config }) => {
    const list = state.associateHashMap[id]?.list || [];
    state.associateHashMap[id] = {
      list: tableData,
      config,
    };
  },
  set_token: (state, token) => {
    state.token = token;
  },
  set_user: (state, user) => {
    state.userInfo = user;
  },
};
const actions = {
  getAssociateHashMap({ commit }, id) {
    console.log("getAssociateHashMap", id);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
