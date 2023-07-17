/**
数据验证（表单验证）

*/
module.exports = {
	error: '',
	check: function(data, rule) {
		for (var i = 0; i < rule.length; i++) {
			data[rule[i].name] = data[rule[i].name];
			
			if (!rule[i].checkType) {
				return rule[i].checkType;
			}
			if (!rule[i].name) {
				return true;
			}
			if (!rule[i].errorMsg) {
				return true;
			}
			if (!data[rule[i].name]) {
				
				this.error = rule[i].errorMsg;
				return false;
			}
			switch (rule[i].checkType) {
				case 'string': //功能 : 字符串及长度检查 规则 : 最小长度,最大长度 如 1,3 或 2, 2,代表只检查最短
					var reg = new RegExp('^.{' + rule[i].checkRule + '}$');
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'int': //功能 : 整数及长度检查 规则 : 最小长度,最大长度 如 1,3
					// var reg = new RegExp('^(-[1-9]|[1-9])[0-9]{' + rule[i].checkRule + '}$');
					// if (!reg.test(data[rule[i].name])) {
					// 	this.error = rule[i].errorMsg;
					// 	return false;
					// }
					var reg = /^-?[1-9]\d*$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'between': //功能 : 数值区间检查 规则 : 最小值,最大值 如 1,3 或 2.5,1000
					if (!this.isNumber(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					var minMax = rule[i].checkRule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'betweenD': //功能 : 数值区间检查【整数】 规则 : 最小值,最大值 如 1,3 或 2,1000
					var reg = /^-?[1-9][0-9]?$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					var minMax = rule[i].checkRule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'betweenF':
					var reg = /^-?[0-9][0-9]?.+[0-9]+$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					var minMax = rule[i].checkRule.split(',');
					minMax[0] = Number(minMax[0]);
					minMax[1] = Number(minMax[1]);
					if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'same': //功能 : 等值检查 规则 : 对应的值
					if (data[rule[i].name] != rule[i].checkRule) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'notsame': //功能 : 不等值检查 规则 : 对应的值
					if (data[rule[i].name] == rule[i].checkRule) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'email':
					var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'phoneno':
					var reg = /^1[0-9]{10,10}$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'zipcode':
					var reg = /^[0-9]{6}$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'reg': //功能 : 正则表达式检查 规则 : 正则表达式内容 如 "^[0-9]{1,2}$"
					var reg = new RegExp(rule[i].checkRule);
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'in': //功能 : 包含某个字符串的检查 规则 : 字符串集，如："北京,上海"
					if (rule[i].checkRule.indexOf(data[rule[i].name]) == -1) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'notnull':
					if (data[rule[i].name] == null || data[rule[i].name].length < 1) {
						
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'qq':
					var reg = /^[1-9][0-9]{4,9}$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'money':
					var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'telPhone':
					var reg = /^(((1[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
					var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
					
					if (!reg.test(data[rule[i].name]) && !tel.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'plateNO':
					var reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
					//最短6位，最长21位 {6,21}，必须包含1个数字、包含2个小写字母、包含2个大写字母、包含1个特殊字符
				case 'inpassword':
					var reg = /^.*(?=.{6,21})(?=.*\d)(?=.*[A-Z]{2,})(?=.*[a-z]{2,})(?=.*[!@#$%^&*?\(\)]).*$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'password':
					var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'idnumber':
					var reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'isdecimal':
					var reg = /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^([^0][0-9]+|0)$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
				case 'isNumber':
					var reg = /^-?[1-9]\d*$/;
					if (!reg.test(data[rule[i].name])) {
						this.error = rule[i].errorMsg;
						return false;
					}
					break;
			}
		}
		return true;
	},
	
	//过滤必填列表
	filterRequiredList(ruleData,OperatesData){
		if(OperatesData == undefined){
			return helper.msg('数据未更新，请登录后台重新编辑表单权限!')
		}
		
		
		if(ruleData.length != 0 && OperatesData.length != 0){
			for(let i = 0;i<ruleData.length;i++){
				for(let j = 0;j<OperatesData.length;j++){
					if(ruleData[i].name == OperatesData[j].id && OperatesData[j].read == false){
						ruleData.splice(i,1)
					}
				}
			}
			return ruleData
		}
	},
}
