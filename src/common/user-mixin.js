import {
	userLogin,
	userCreateOrder,
	getUserOpenId
} from '@/api/user'
import config from '@/common/config'
import { getPermission} from '@/utils'
import { getModelIdList } from '../config/api'

import { getRoleData } from '@/config/api.js';

export const userMixin = {
	data() {
		return {}
	},
	methods: {
		mixinGetUserLocation() {
			return new Promise((resolve, reject) => {
				uni.getLocation({
					type: 'gcj02',
					success: res => {
						// 获取用户位置
						resolve({
							latitude: res.latitude,
							longitude: res.longitude
						});
						console.log('getLocation获取当前位置成功', res);
					},
					fail: err => {
						reject();
						console.log('getLocation获取当前位置失败', err);
					}
				});

			});
		},
		/**
		 * @description: 判断用户是否有权限获取位置
		 * @returns {Promise}
		 */
		mixinUserCanGetLocation() {
			return new Promise((resolve, reject) => {
				// #ifdef MP-WEIXIN
				uni.getSetting({
					success: res => {
						if (res.authSetting['scope.userLocation']) {
							resolve();
						} else {
							uni.authorize({
								scope: 'scope.userLocation',
								success: res => {
									resolve();
								},
								fail: err => {
									reject();
									uni.showToast({
										title: '请打开定位服务',
										icon: 'none'
									});
								}
							});
						}
					}
				});

				// #endif
				// #ifdef H5
				resolve();
				// #endif
			});
		},
		/** 进入邀请页面
		 * @param {String} modelId modelId
		 * @param {String} name 标题
		 * @param {String} type 类型
		 */
		mixinGoInvite(modelId, name,type) {
			return new Promise(async (resolve, reject) => {
				if(type === 'func') {
					const permission =getPermission(modelId, 'module')
					if(!permission || !permission.button.some(({ enCode }) => enCode === 'add')) {
						uni.showToast({
							title: '暂无权限',
							icon: 'none'
						});
						reject();
						return;
					}

					uni.navigateTo({
						url: `/subPages/user/dynamic-form/dynamic-form?modelId=${modelId}&fullName=${name}&type=${type}`
					})
					resolve();

				}

			});
		},

		mixinGoInvitePage() {
			const inviteObj = uni.getStorageSync(config.Global.cache + '_inviteObj');

			this.mixinGoInvite(inviteObj.modelId, inviteObj.name, inviteObj.type)
				.then(() => this.mixinRemoveInviteInfo())
				.catch(() => this.mixinRemoveInviteInfo());
			/*getRoleData().then(res => {
				if(res.code === 600) return;
				if (inviteObj.endTime!==0 && this.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss') > inviteObj.endTime) {
					console.log('二维码已过期');
					uni.showToast({
						title: '二维码已过期',
						icon: 'error'
					});
					this.mixinRemoveInviteInfo();
					return;
				}

				this.mixinGoInvite(inviteObj.id, inviteObj.name, inviteObj.type)
					.then(() => this.mixinRemoveInviteInfo())
					.catch(() => this.mixinRemoveInviteInfo());
			})*/


		},
		mixinRemoveInviteInfo() {
			uni.removeStorageSync(config.Global.cache + '_inviteObj');
		},
		/**
		 * @param {Object} description 商品描述
		 * @param {Object} id 商品id
		 * @returns {Promise} 返回支付状态
		 *
		 */
		async mixinUserPay(id, description) {
			return new Promise(async (resolve, reject) => {
				// 获取openId
				const openid = await this.mixinGetUserOpenid()
				const {
					tenantId
				} = config.Global
				// JSAPI下单 返回支付参数
				const { data: payParams } = await userCreateOrder({
					description,
					id,
					openid,
					tenantId
				})
				console.log("payParams", payParams);
				uni.getProvider({
					service: 'payment',
					success: (res) => {

						let paymentObj = {
							...payParams,
							package: payParams.packageStr,
							provider: res.provider[0]
						}
						paymentObj.timeStamp = payParams.timeStamp + "",
							console.log("requestPayment", paymentObj)
						uni.requestPayment({
							...paymentObj,
							success: (payRes) => {
								uni.$u.toast("支付成功");
								resolve(payRes)

							},
							fail: function (err) {
								uni.$u.toast("支付失败");
								reject(err)
							}
						});

					}
				});
			})


		},
		/**
		 * 获取用户的OpenId
		 * @returns {Promise} 返回用户的OpenId
		 */
		mixinGetUserOpenid() {
			return new Promise((resolve, reject) => {
				// 如果存在缓存
				let userOpenId = uni.getStorageSync(this.$globName.OPENID_CACHE)
				if (!userOpenId) {
					uni.login({
						provider: "weixin",
						success: async (e) => {
							// 获取用户微信信息
							let userWxInfo = await getUserOpenId(e.code)
							// 保存openId
							uni.setStorageSync(this.$globName.OPENID_CACHE, userWxInfo.data)
							// 返回openId
							resolve(userWxInfo.data)
						}
					})
					return
				}
				resolve(userOpenId)

			})

		},

		/**
		 * @param {Object} code 验证码
		 * @param {Object} mobilePhone 手机号
		 */
		mixinCodeLogin(code, mobilePhone) {
			return new Promise((resolve, reject) => {

				let params = {
					type: 2,
					code,
					mobilePhone,
					tenantId: config.Global.tenantId,
				}
				// 是否是邀请用户
				let inviteUserId = uni.getStorageSync("inviteUserId")
				if (inviteUserId) {
					params.formUser = inviteUserId
				}

				userLogin(params).then(async res => {
					console.log("userLogin", res);
					if (res.code == 200) {
						uni.setStorageSync(config.Global.cache + "_Token", res.data.token);
						await this.$helper.setStoreCurrentDataInfo();
						uni.hideLoading();
						if (inviteUserId) {
							uni.removeStorageSync(config.Global.cache + "_inviteUserId")
						}
						// if (!this.$store.state.wschat.socketState) {
						// 	this.$helper.webSocket();
						// }
						uni.$u.toast("登录成功");
						resolve()
						return;
					}
					uni.$u.toast(res.msg);
					reject(res)

				})

			})
		},
		/**
		 * @param {Object} e 用户点击获取手机号的值
		 */
		mixinGetPhone(e) {
			if (!e.detail.code) {
				uni.showToast({
					title: "获取手机号失败",
					icon: "none",
				});
				return;
			}
			return new Promise((resolve, reject) => {

				let params = {
					type: 3,
					code: e.detail.code,
					tenantId: config.Global.tenantId,
				}
				// 是否是邀请用户
				let inviteUserId = uni.getStorageSync("inviteUserId")
				if (inviteUserId) {
					params.formUser = inviteUserId
				}

				userLogin(params).then(async res => {

					console.log("userLogin", res);
					if (res.code == 200) {
						uni.setStorageSync(config.Global.cache + "_Token", res.data.token);
						await this.$helper.setStoreCurrentDataInfo();
						uni.hideLoading();
						if (inviteUserId) {
							uni.removeStorageSync(config.Global.cache + "_inviteUserId")
						}
						// if (!this.$store.state.wschat.socketState) {
						// 	this.$helper.webSocket();
						// }
						uni.$u.toast("登录成功");
						resolve()
						return;
					}
					uni.$u.toast("登录失败");
					reject(res)

				})

			})



		}
	}
}
