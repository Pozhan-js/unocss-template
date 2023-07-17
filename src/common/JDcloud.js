import store from '@/store/index.js';
import helper from '@/common/helper.js'
import config from './config.js'

var JDcloud = {
	// 当前用户
	userInfo: function () {
		try {
			const _data = uni.getStorageSync(config.Global.cache + '_UserProvider');
			if (_data) {
				return _data;
			}
		} catch (e) { }
	},
	//用户
	userData: function (id) {
		const userList = uni.getStorageSync(config.Global.cache + '_UserList');
		const _UserProvider = uni.getStorageSync(config.Global.cache + '_UserProvider');
		if (id == _UserProvider.id) {

			try {
				if (_UserProvider) {
					var _data = [];
					_data[_UserProvider.id] = {
						'F_Account': _UserProvider.account,
						'F_RealName': _UserProvider.realName,
						'F_Name': _UserProvider.realName + "/" + _UserProvider.account,
						'F_Gender': _UserProvider.gender,
						'F_HeadIcon': _UserProvider.headIcon,
						'F_OrganizeId': _UserProvider.id,
						'F_QuickQuery': _UserProvider.quickQuery,
						'F_OrganizeName': _UserProvider.department
					};

					if (typeof (id) != "undefined") {
						return _data[id] != undefined ? _data[id] : _data[0];
					} else {
						return _data;
					}
				}
			} catch (e) { }
		}

		try {
			if (userList) {
				var _data = [];
				for (let i = 0; i < userList.length; i++) {
					_data[userList[i].id] = {
						'F_Account': userList[i].account,
						'F_RealName': userList[i].realName,
						'F_Name': userList[i].realName + "/" + userList[i].account,
						'F_Gender': userList[i].gender,
						'F_HeadIcon': userList[i].headIcon,
						'F_OrganizeId': userList[i].id,
						'F_QuickQuery': userList[i].quickQuery,
						'F_OrganizeName': userList[i].department
					};

				};

				if (typeof (id) != "undefined") {
					return _data[id] != undefined ? _data[id] : _data[0];
				} else {
					return _data;
				}
			}
		} catch (e) { }
	},
	userDirectories: function () {
		try {

			const userList = uni.getStorageSync(config.Global.cache + '_UserList');
			if (userList) {
				const userList = res.data.data;
				let indexList = [];
				let array = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
					"T", "U", "V", "W", "X", "Y", "Z", "#"
				];
				for (let i in array) {
					let childNodes = helper.jsonFind(userList, function (v) {
						return v.F_QuickQuery == array[i]
					});
					if (childNodes.length > 0) {
						indexList.push({
							key: array[i],
							title: array[i],
							itemIndex: i,
							items: childNodes
						});
					}
				}
				uni.setStorage({
					key: config.Global.cache + '_Directories',
					data: indexList
				});
			}
		} catch (e) {
			//TODO handle the exception
		}
	},
	//角色
	roleData: function (id) {
		try {
			const _data = uni.getStorageSync(config.Global.cache + '_RoleList');
			if (_data) {
				if (typeof (id) != "undefined") {
					return _data[id] != undefined ? _data[id] : _data[0];
				} else {
					return _data;
				}
			}
		} catch (e) { }
	},
	//组织
	organizeData: function (id) {
		try {
			const _data = uni.getStorageSync(config.Global.cache + '_OrganizeList');
			if (_data) {
				if (typeof (id) != "undefined") {
					return _data[id] != undefined ? _data[id] : _data[0];
				} else {
					return _data;
				}
			}
		} catch (e) { }
	},
	//岗位
	positionData: function (id) {
		try {
			const _data = uni.getStorageSync(config.Global.cache + '_PositionList');
			if (_data) {
				if (typeof (id) != "undefined") {
					return _data[id] != undefined ? _data[id] : _data[0];
				} else {
					return _data;
				}
			}
		} catch (e) { }

	},
	// 岗位Ids转名称
	positionIdByName: function (id) {
		var _positionIds = id.split(",");
		var _positionvalue = new Array();
		for (var j = 0; j < _positionIds.length; j++) {
			_positionvalue.push(JDcloud.positionData(_positionIds[j]).F_FullName)
		}
		return _positionvalue.toString();
	},
	//公司
	companyData: function (organizeId) {
		var _data = "";
		parenOrganize(organizeId);

		function parenOrganize(id) {
			var parenItem = JDcloud.organizeData(id);
			if (parenItem.F_Category == "company") {
				_data = parenItem;
			} else {
				parenOrganize(parenItem.F_ParentId);
			}
		}
		return _data;
	},

};
export default JDcloud
