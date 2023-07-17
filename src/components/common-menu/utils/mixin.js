import {
	getStorage
} from "@/common/config";

export default {
	data() {
		return {
			// 菜单列表
			menuList: this.getCommonMenu(),
		};
	},
	methods: {
		getCommonMenu() {
			if (!getStorage("_MenuList")) return []
			const showList = ['6426532fdf360d64504189e0', '64265374df360d64504189e1', '64268edfdf360d64504189ec',
				'6438a521345c55536c3d565f', '646321892c6e494da46c6cfa', '64263ddbdf360d64504189cf',
				'642649e1df360d64504189d8',
				'64264cb8df360d64504189dc'
			]
			const staticPage = getStorage("_MenuList")[0].children
			const list = getStorage("_MenuList").flatMap(item => item.children.filter(o => showList.includes(o
				.moduleId)))

			return [...staticPage, ...list];
		},
		/**
		 * 跳转到对应页面
		 * @param item
		 */
		mixinFlowForm(item) {
			console.log("item", item);
			const CODE_MAP = {
				// 自定义页面
				CUSTOM: 0,
				// 工作流表单
				ENGINE: 4,
				// 功能表单
				FUNCTION: 3,
			};
			console.log("item", item);
			if (item.type === CODE_MAP.CUSTOM) {
				uni.navigateTo({
					url: item.urlAddress
				});
			} else if (item.urlAddress && item.urlAddress.startsWith("http")) {
				uni.navigateTo({
					url: `/subPages/workflow/webview/webview?F_FullName=${item.fullName}&url=${item.urlAddress}`,
					fail: this.failPage,
				});
			} else if (item.type === CODE_MAP.ENGINE) {
				uni.navigateTo({
					url: `/subPages/user/dynamic-form/dynamic-form?fullName=${item.fullName}&modelId=${item.moduleId}&type=engine`,
					fail: this.failPage,
				});
			}
			// 功能表单
			else if (item.type === CODE_MAP.FUNCTION) {
				const url = "/subPages/user/fromList/fromList";
				uni.navigateTo({
					url: `${url}?fullName=${item.fullName}&formId=${item.moduleId}`,
					fail: this.failPage,
				});
			}
		},
		//跳转页面失败
		failPage(err) {
			uni.showToast({
				title: "功能正在开发中",
				icon: "warning"
			});
			console.log(err);
		},
	},
	computed: {
		user() {
			return uni.getStorageSync(this.$cache + "_UserProvider") || {};
		},
		isLogin() {
			return Boolean(this.user.userId);
		},
	},
};