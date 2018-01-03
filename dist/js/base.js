var globalData = {};

//globalData.url='http://tuiguang.yuanchuangyuan.com/verb';

globalData.url = ' http://120.79.69.205/verb';

//测试账号
globalData.count = 18811382869;



function formatDateTime(opations) {

	// type
	// all return return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
	// one return return y + '年' + m + '月' + d + '日';
	// two return return y + '-' + m + '-' + d
	// day return return y + '/' + m + '/' + d
	// hour return return h + ':' + minute 
	// md return m+'月'+d+'日'
	var inputTime = opations.inputTime;
	var date = new Date(inputTime);
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	var second = date.getSeconds();
	minute = minute < 10 ? ('0' + minute) : minute;
	second = second < 10 ? ('0' + second) : second;
	if(opations.type == 'all') {
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
	} else if(opations.type == 'one') {
		return y + '年' + m + '月' + d + '日';
	} else if(opations.type == 'two') {
		return y + '-' + m + '-' + d;
	} else if(opations.type == 'day') {
		return y + '/' + m + '/' + d;
	} else if(opations.type == 'hour') {
		return h + ':' + minute;
	} else if(opations.type == 'md') {
		return m + '月' + d + '日'
	}
}