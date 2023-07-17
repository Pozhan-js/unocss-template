import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let state = {
	comflows:[],//主页初始化流程表单数据
	flowfromId:'',//表单Id
};
let getters = {
};
let mutations = {
	comflowsflow(state, items) {
		state.comflows = items;
	},
};
let actions = {
	invokeComflowsflow(context, item) {
		context.commit('comflowsflow', item);
	},
};
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}
