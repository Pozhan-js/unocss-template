
export default {
	state:{
	},
	getters: {
	},
	mutations: {
		// 想state中添加属性为【key】的值【obj】
		storeFloEngineObj:(state,obj)=>{
			// Vuex实现响应式必须提前定义，动态添加的属性需要借用$set来实现响应式
			console.log(obj.key,obj.value);
			uni.$set(state,obj.key,obj.value.constructor ===Object ?obj.value: JSON.parse(obj.value)) 
		}
	},
	actions: {
		
	}
}