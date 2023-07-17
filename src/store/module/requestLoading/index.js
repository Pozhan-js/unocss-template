export default { 
	state() {
		return{
			timer: null
		}
	},
	getters: {
		
	},
	mutations: {
		// 设置定时器
		setTimer(state) {
			uni.hideLoading()
			clearTimeout(state.timer)
			state.timer = null
			state.timer = setTimeout(() => {
				uni.showLoading({
					title: "加载中...",
					mask: false
				})
		
				state.timer = null;
			}, 800);
		},
		clearTimer(state) {
			uni.hideLoading()
			clearTimeout(state.timer)
			state.timer = null
		},
	},
	actions: {
		
	}
}