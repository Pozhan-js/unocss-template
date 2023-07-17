//store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import loadingModule from "./module/requestLoading"
// import relationFlowEngine from "./module/relationFlowEngine"
import user from "./module/user.js"
// import collection from './module/collection.js'
// import workflow from './module/workflow.js'
// import wschat from './module/wschat.js'
import base from './module/base.js'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		// defsyslogn: {
		// 	userId: '',
		// 	applyId: '',
		// 	token: '',
		// 	account: '',
		// 	accountHeadurl: '',
		// 	accountNick: '',
		// 	password: ''
		// },
		// friend: {
		// 	friendId: '',
		// 	friendHeadurl: '',
		// 	friendNnick: ''
		// }
	},
	mutations: {
		// login(state, provider) { //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
		// 	state.defsyslogn.token = provider.token;
		// 	state.defsyslogn.account = provider.account;
		// },
		// logout(state) {
		// 	state.defsyslogn.token = '';
		// 	state.defsyslogn.account = '';
		// },
		// setSysLogn(state, item) {
		// 	state.defsyslogn = item;
		// },
		// unfriend(state){
		// 	state.friend.friendId = '';
		// 	state.friend.friendHeadurl = '';
		// 	state.friend.friendNnick = '';
		// },
		// setFriend(state,item){
		// 	state.friend.friendId = item.friendId;
		// 	state.friend.friendHeadurl = item.friendHeadurl;
		// 	state.friend.friendNnick = item.friendNnick;
		// }
	},
	modules: {
		base,
		loadingModule,
		// relationFlowEngine,
		// collection,
		// workflow,
		// wschat,
		user
	},
	// 异步操作
	actions: {},
	getters: {
		// islogin(state) { //承载变化的showFooter的值
		// 	return state.defsyslogn.token
		// },
	}
})
export default store

