import Vue from 'vue'
import Vuex from 'vuex'
import store from 'store/index.js'
import config from '@/common/config.js'
import helper from '@/common/helper.js'
import JDcloud from '@/common/JDcloud.js'

Vue.use(Vuex)

let state = {
	onlineUsers: [], //在线列表
	unreadNums: [], //未读
	online: '', //上线用户
	offline: '', //离线
	sendMessage: [], //发送消息
	receiveMessage: [], //接收消息
	hisMessage: [], //历史消息
	isread: false, //未读
	reParam: {}, //分页初始化
	paramMessage: [], //分页数据
	recentlys: [], //最近联系数据
	socketState: false, //连接状态
	messageList: null,
	noticeMsgDef: {},
};
let getters = {
	socketState(state) {
		return state.socketState;
	}
};
let mutations = {
	onlineUsersWSChat(state, items) {
		console.log("onlineUsersWSChat");
		state.onlineUsers = items;
	},
	unreadNumsWSChat(state, items) {
		state.recentlys = items;
			// const userProvider = uni.getStorageSync(config.Global.cache + '_UserProvider');
			// const account = uni.getStorageSync(config.Global.cache + '_Account');
			// const recentlyList = uni.getStorageSync(config.Global.cache + '_To_' + account + '_Recently');
			// if (recentlyList) {
			// 	// console.log('222');
			// 	if (items.length > 0) {
			// 		let defMsg = '......';
			// 		for (let i = 0; i < items.length; i++) {
			// 			switch (items[i].DefaultMessageType) {
			// 				case "text":
			// 					defMsg = items[i].DefaultMessage;
			// 					break;
			// 				case "voice":
			// 					defMsg = '[语音]'
			// 					break;
			// 				case "image":
			// 					defMsg = '[图片]'
			// 					break;
			// 			}
			// 			let _recently = helper.jsonFind(recentlyList, function(v) {
			// 				return v.friendId == items[i].SendUserId
			// 			});
			// 			if (_recently.length > 0) {
			// 				_recently[0].count = items[i].UnreadNum;
			// 				_recently[0].message = defMsg;
			// 				_recently[0].friendId = items[i].SendUserId;
			// 				_recently[0].time = helper.timeForm(helper.toDate(items[i].DefaultMessageTime, "yyyy-MM-dd HH:mm"));
			// 			} else {
			// 				state.recentlys.push({
			// 					count: items[i].UnreadNum,
			// 					friendId: items[i].SendUserId,
			// 					message: defMsg,
			// 					time: helper.timeForm(helper.toDate(items[i].DefaultMessageTime, "yyyy-MM-dd HH:mm"))
			// 				});
			// 			}
			// 		}
			// 		uni.setStorage({
			// 			key: config.Global.cache + '_To_' + account + '_Recently',
			// 			data: state.recentlys
			// 		});
			// 	}
			// } else {
			// 	// console.log('1111');
			// let defMsg = '......';
			// for (let i = 0; i < items.length; i++) {
			// 	switch (items[i].DefaultMessageType) {
			// 		case 'text':
			// 			defMsg = items[i].DefaultMessage;
			// 			break;
			// 		case 'voice':
			// 			defMsg = '[语音]'
			// 			break;
			// 		case 'image':
			// 			defMsg = '[图片]'
			// 			break;
			// 	}
			// 	state.recentlys.push({
			// 		count: items[i].UnreadNum,
			// 		friendId: items[i].SendUserId,
			// 		message: defMsg,
			// 		time: helper.timeForm(helper.toDate(items[i].DefaultMessageTime, "yyyy-MM-dd HH:mm"))
			// 	});
			// }
			// // console.log(state.recentlys);
			// uni.setStorage({
			// 	key: config.Global.cache + '_To_' + account + '_Recently',
			// 	data: state.recentlys
			// });
			// }
			// uni.getStorage({
			// 	key: config.Global.cache + '_To_' + account + '_Recently',
			// 	success: (res) => {
			// 		state.recentlys = res.data;
			// 		if (items.length > 0) {
			// 			let defMsg = '......';
			// 			for (let i = 0; i < items.length; i++) {
			// 				switch (items[i].DefaultMessageType) {
			// 					case "text":
			// 						defMsg = items[i].DefaultMessage;
			// 						break;
			// 					case "voice":
			// 						defMsg = '[语音]'
			// 						break;
			// 					case "image":
			// 						defMsg = '[图片]'
			// 						break;
			// 				}
			// 				let _recently = helper.jsonFind(state.recentlys, function(v) {
			// 					return v.friendId == items[i].SendUserId
			// 				});
			// 				if (_recently.length > 0) {
			// 					_recently[0].count = items[i].UnreadNum;
			// 					_recently[0].message = defMsg;
			// 					_recently[0].friendId = items[i].SendUserId;
			// 					_recently[0].time = helper.timeForm(helper.toDate(items[i].DefaultMessageTime, "yyyy-MM-dd HH:mm"));
			// 				} else {
			// 					state.recentlys.push({
			// 						count: items[i].UnreadNum,
			// 						friendId: items[i].SendUserId,
			// 						message: defMsg,
			// 						time: helper.timeForm(helper.toDate(items[i].DefaultMessageTime, "yyyy-MM-dd HH:mm"))
			// 					});
			// 				}
			// 			}
			// 			uni.setStorage({
			// 				key: config.Global.cache + '_To_' + account + '_Recently',
			// 				data: state.recentlys
			// 			});
			// 		}
			// 	},
			// 	fail() {
			// 		let defMsg = '......';
			// 		for (let i = 0; i < items.length; i++) {
			// 			switch (items[i].DefaultMessageType) {
			// 				case 'text':
			// 					defMsg = items[i].DefaultMessage;
			// 					break;
			// 				case 'voice':
			// 					defMsg = '[语音]'
			// 					break;
			// 				case 'image':
			// 					defMsg = '[图片]'
			// 					break;
			// 			}
			// 			state.recentlys.push({
			// 				count: items[i].UnreadNum,
			// 				friendId: items[i].SendUserId,
			// 				message: defMsg,
			// 				time: helper.timeForm(helper.toDate(items[i].DefaultMessageTime, "yyyy-MM-dd HH:mm"))
			// 			});
			// 		}
			// 		uni.setStorage({
			// 			key: config.Global.cache + '_To_' + account + '_Recently',
			// 			data: state.recentlys
			// 		});
			// 	}
			// });
	},
	onlineWSChat(state, userId) {
		state.online = userId;
		for (let i = 0; i < state.onlineUsers.length; i++) {
			if (state.onlineUsers[i] != userId) {
				state.onlineUsers.push(userId)
			}
		}
	},
	offlineWSChat(state, userId) {
		state.offline = userId;
		for (let i = 0; i < state.onlineUsers.length; i++) {
			if (state.onlineUsers[i] == userId) {
				state.onlineUsers.splice(i, 1)
			}
		}
	},
	sendMessageWSChat(state, items) {
		// state.sendMessage.splice(0);
		state.sendMessage = items;
		// try {
		// 	let content = {};
		// 	let defMsg = '......';
		// 	let apiKey = uni.getStorageSync('apiKey') || 'NET';
		// 	let baseUrlObj = config.Global.baseUrl;
		// 	let baseUrl = config.Global.baseUrl[apiKey].apiUrl;
		// 	state.sendMessage.splice(0);
		// 	switch (items.messageType) {
		// 		case 'text':
		// 			content = {
		// 				text: items.toMessage,
		// 				emoji: []
		// 			};
		// 			defMsg = items.toMessage;
		// 			break;
		// 		case 'voice':
		// 			content = {
		// 				url: items.toMessage.path,
		// 				length: items.toMessage.length
		// 			};
		// 			defMsg = '[语音]'
		// 			break;
		// 		case 'image':
		// 			content = {
		// 				thumbnail: baseUrl + "/api/file/IMImage/T" + items.toMessage.path.replace(".", "@"),
		// 				url: baseUrl + "/api/file/IMImage/" + items.toMessage.path.replace(".", "@"),
		// 				w: items.toMessage.width,
		// 				h: items.toMessage.height
		// 			};
		// 			defMsg = '[图片]'
		// 			break;
		// 	}
		// 	const userProvider = uni.getStorageSync(config.Global.cache + '_UserProvider');
		// 	const account = uni.getStorageSync(config.Global.cache + '_Account');
		// 	if (userProvider) {
		// 		state.sendMessage.push({
		// 			type: "user",
		// 			msg: {
		// 				id: 1,
		// 				type: items.messageType,
		// 				datetime: items.dateTime,
		// 				time: helper.timeForm(items.dateTime),
		// 				userinfo: {
		// 					uid: 0,
		// 					username: store.state.defsyslogn.accountNick,
		// 					face: baseUrl + "api/system/Permission/User/Avatar/" + JDcloud.userData(userProvider.userId).F_HeadIcon
		// 				},
		// 				content: content
		// 			},
		// 		});
		// 		uni.getStorage({
		// 			key: config.Global.cache + '_To_' + account + '_Recently',
		// 			success: (res) => {
		// 				state.recentlys = res.data;
		// 				let _recently = helper.jsonFind(state.recentlys, function(v) {
		// 					return v.friendId == items.toUserId
		// 				});
		// 				if (_recently.length > 0) {
		// 					_recently[0].count = 0;
		// 					_recently[0].message = defMsg;
		// 					_recently[0].time = helper.timeForm(items.dateTime);
		// 				} else {
		// 					state.recentlys.push({
		// 						count: 0,
		// 						friendId: items.toUserId,
		// 						message: defMsg,
		// 						userId: store.state.defsyslogn.userId,
		// 						time: helper.timeForm(items.dateTime)
		// 					});
		// 				}
		// 				uni.setStorage({
		// 					key: config.Global.cache + '_To_' + account + '_Recently',
		// 					data: state.recentlys
		// 				});
		// 			},
		// 			fail: () => {
		// 				let defMsg = '......';
		// 				switch (items.messageType) {
		// 					case 'text':
		// 						defMsg = items.toMessage;
		// 						break;
		// 					case 'voice':
		// 						defMsg = '[语音]'
		// 						break;
		// 					case 'image':
		// 						defMsg = '[图片]'
		// 						break;
		// 				}
		// 				state.recentlys.push({
		// 					count: 0,
		// 					friendId: items.toUserId,
		// 					message: defMsg,
		// 					userId: store.state.defsyslogn.userId,
		// 					time: helper.timeForm(items.dateTime)
		// 				});
		// 				uni.setStorage({
		// 					key: config.Global.cache + '_To_' + account + '_Recently',
		// 					data: state.recentlys
		// 				});
		// 			}
		// 		});
		// 	}
		// } catch (e) {
		// 	//TODO handle the exception
		// }
	},
	receiveMessageWSChat(state, items) {
		state.receiveMessage.splice(0);
		state.receiveMessage = items;
		// try {
		// 	const userProvider = uni.getStorageSync(config.Global.cache + '_UserProvider');
		// 	const account = uni.getStorageSync(config.Global.cache + '_Account');
		// 	state.receiveMessage.splice(0);
		// 	let defMsg = '......';
		// 	let content = {};
		// 	let apiKey = uni.getStorageSync('apiKey') || 'NET';
		// 	let baseUrlObj = config.Global.baseUrl;
		// 	let baseUrl = config.Global.baseUrl[apiKey].apiUrl;
		// 	switch (items.messageType) {
		// 		case 'text':
		// 			content = {
		// 				text: items.formMessage,
		// 				emoji: []
		// 			};
		// 			defMsg = items.formMessage;
		// 			break;
		// 		case 'voice':
		// 			content = {
		// 				url: items.formMessage.path,
		// 				length: items.formMessage.length
		// 			};
		// 			defMsg = '[语音]'
		// 			break;
		// 		case 'image':
		// 			content = {
		// 				thumbnail: baseUrl + "/api/file/IMImage/T" + items.formMessage.path.replace(".", "@"),
		// 				url: baseUrl + "/api/file/IMImage/" + items.formMessage.path.replace(".", "@"),
		// 				w: items.formMessage.width,
		// 				h: items.formMessage.height
		// 			};
		// 			defMsg = '[图片]'
		// 			break;
		// 	}
		// 	if (store.state.friend.friendId === items.formUserId) {
		// 		state.receiveMessage.push({
		// 			type: "user",
		// 			msg: {
		// 				id: 1,
		// 				msgId: '',
		// 				type: items.messageType,
		// 				datetime: items.dateTime,
		// 				time: helper.timeForm(items.dateTime),
		// 				userinfo: {
		// 					uid: 1,
		// 					username: JDcloud.userData(items.formUserId).F_Name,
		// 					face: baseUrl + "api/system/Permission/User/Avatar/" + JDcloud.userData(items.formUserId).F_HeadIcon
		// 				},
		// 				content: content
		// 			},
		// 			method: items.method
		// 		});
		// 	} else {
		// 		state.recentlys = uni.getStorageSync(config.Global.cache + '_To_' + account + '_Recently');
		// 		if (state.recentlys) {
		// 			let _recently = helper.jsonFind(state.recentlys, function(v) {
		// 				return v.friendId == items.formUserId
		// 			});
		// 			if (_recently.length > 0) {
		// 				_recently[0].count = _recently[0].count + 1;
		// 				_recently[0].message = defMsg;
		// 				_recently[0].time = helper.timeForm(items.dateTime);
		// 			} else {
		// 				state.recentlys.push({
		// 					count: 1,
		// 					friendId: items.formUserId,
		// 					message: defMsg,
		// 					userId: store.state.defsyslogn.userId,
		// 					time: helper.timeForm(items.dateTime)
		// 				});
		// 			}
		// 			uni.setStorage({
		// 				key: config.Global.cache + '_To_' + account + '_Recently',
		// 				data: state.recentlys
		// 			});
		// 		} else {
		// 			let defMsg = '......';
		// 			switch (items.messageType) {
		// 				case 'text':
		// 					defMsg = items.formMessage;
		// 					break;
		// 				case 'voice':
		// 					defMsg = '[语音]'
		// 					break;
		// 				case 'image':
		// 					defMsg = '[图片]'
		// 					break;
		// 			}
		// 			state.recentlys.push({
		// 				count: 1,
		// 				friendId: items.formUserId,
		// 				message: defMsg,
		// 				userId: store.state.defsyslogn.userId,
		// 				time: helper.timeForm(items.dateTime)
		// 			});
		// 			uni.setStorage({
		// 				key: config.Global.cache + '_To_' + account + '_Recently',
		// 				data: state.recentlys
		// 			});
		// 		}
		// 	}
		// } catch (e) {
		// 	//TODO handle the exception
		// }
	},
	messageListWSChat(state, items) {
		state.messageList = items
	},
	noticeMsgDefWSChat(state, items) {
		state.noticeMsgDef = items
	},
	messagePushWSChat(state, items) {
		if (items.messageType == "1") {
			state.noticeMsgDef.noticeCount = state.noticeMsgDef.noticeCount + 1;
			state.noticeMsgDef.noticeText = items.messageContent;
			state.noticeMsgDef.noticeDate = helper.toDate(new Date, 'MM-dd HH:mm');
		} else {
			state.noticeMsgDef.messageCount = state.noticeMsgDef.messageCount + 1;
			state.noticeMsgDef.messageText = items.messageContent;
			state.noticeMsgDef.messageDate = helper.toDate(new Date, 'MM-dd HH:mm');
		}
	},
};
export default {
	namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
	state,
	getters,
	mutations,
}
