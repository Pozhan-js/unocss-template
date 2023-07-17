function forMatNum(num) {
	return num < 10 ? '0' + num : num + '';
}

function initDays(year, month) {
	let totalDays = new Date(year, month, 0).getDate();
	let dates = [];
	for (let d = 1; d <= totalDays; d++) {
		dates.push(forMatNum(d));
	};
	return dates;
}

function initPicker(start, end, mode = "date", step) {
	let initstartDate = new Date(start);
	let endDate = new Date(end);
	let startYear = initstartDate.getFullYear();
	let startMonth = initstartDate.getMonth();
	let endYear = endDate.getFullYear();
	let years = [],
		months = [],
		days = [],
		hours = [],
		minutes = [],
		seconds = [];
	let totalDays = new Date(startYear, startMonth, 0).getDate();
	for (let s = startYear; s <= endYear; s++) {
		years.push(s + '');
	};
	for (let m = 1; m <= 12; m++) {
		months.push(forMatNum(m));
	};
	for (let d = 1; d <= totalDays; d++) {
		days.push(forMatNum(d));
	}
	for (let h = 0; h < 24; h++) {
		hours.push(forMatNum(h));
	}
	for (let m = 0; m < 60; m += step * 1) {
		minutes.push(forMatNum(m));
	}
	for (let s = 0; s < 60; s++) {
		seconds.push(forMatNum(s));
	}
	switch (mode) {
		case "date":
			return {
				years,
				months,
				days
			}
			break;
		case "yearMonth":
			return {
				years,
				months
			}
			break;
		case "dateTime":
			return {
				years,
				months,
				days,
				hours,
				minutes,
				seconds
			}
			break;
		case "time":
			return {
				hours,
				minutes,
				seconds
			}
			break;
	}
}

function getDate(type) {
	const date = new Date();
	let year = date.getFullYear();
	if (type === 'start') {
		year = year - 60;
	} else if (type === 'end') {
		year = year + 2;
	}
	return `${year}`;
}


function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function (milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function (dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function (number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function (str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

// 获取随机数
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}
function getWeekDate(time = new Date()) {
	let weeks = '日,一,二,三,四,五,六';
	let day = new Date(time).getDay();;
	return "星期" + weeks.split(",")[day];
}
function formatTimeMen(time) {
	//格式化时间
	let s = time / 1000;
	function padStart(num) {
		return (num | 0).toString().padStart(2, "0") || '00';
	}

	return (padStart((s / 60) % 60) + ":" + padStart(s % 60) + ":" + padStart(Math.round(time % 1000 / 10)));
}


module.exports = {
	getWeekDate: getWeekDate,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	getDate: getDate,
	initPicker: initPicker,
	forMatNum: forMatNum,
	initDays: initDays,
	getRandomInt: getRandomInt,
	formatTimeMen: formatTimeMen
}
