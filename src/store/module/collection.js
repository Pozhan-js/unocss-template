import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let state = {
	user: [],
	position: [],
	organize: [],
	role: [],
	dictionary: [],
	flowEngine: [],
	userProvider: {},
	flowLaunch: [],
	backlog: [],
	alreadybacklog: [],
	copyme: []
};
let getters = {
};
let mutations = {
	organizeCollects(state, items) { //如何变化collects,插入items
		state.organize = items;
	},
	positionCollects(state, items) {
		state.position = items
	},
	roleCollects(state, items) {
		state.role = items
	},
	dictionaryCollects(state, items) {
		state.dictionary = items
	},
	flowEngineCollects(state, items) {
		state.flowEngine = items
	},
	userCollects(state, items) {
		state.user = items
	},
	userProviderCollects(state, items) {
		state.userProvider = items.userProvider
	},
	flowLaunchflow(state, items) {
		state.flowLaunch = items;
	},
	flowBeforeListBacklogflow(state, items) {
		state.backlog = items;
	},
	flowBeforeAlreadybacklogflow(state, items) {
		state.alreadybacklog = items;
	},
	flowBeforeCopymeflow(state, items) {
		state.copyme = items;
	},
};
let actions = {
	invokeOrganizeList(context, item) { //触发mutations里面的pushCollects ,传入数据形参item 对应到items
		context.commit('organizeCollects', item);
	},
	invokePositionList(context, item) {
		context.commit('positionCollects', item);
	},
	invokeRoleList(context, item) {
		context.commit('roleCollects', item);
	},
	invokeFlowEngineList(context, item) {
		context.commit('flowEngineCollects', item);
	},
	invokeUserList(context, item) {
		context.commit('userCollects', item);
	},
	invokeUserProviderList(context, item) {
		context.commit('userProviderCollects', item);
	},
	invokeFlowLaunchList(context, item) {
		context.commit('flowLaunchflow', item);
	},
	invokeFlowBeforeListBacklog(context, item) {
		context.commit('flowBeforeListBacklogflow', item);
	},
	invokeFlowBeforeListAlreadybacklog(context, item) {
		context.commit('flowBeforeAlreadybacklogflow', item);
	},
	invokeFlowBeforeListCopyme(context, item) {
		context.commit('flowBeforeCopymeflow', item);
	},
};
export default {
	namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
	state,
	getters,
	mutations,
	actions
}
