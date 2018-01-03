var vm = new Vue({

	el: '#application_list',
	data: {
		data_list: [],

		//上拉开关
		scroll_onff: true,

		//总页数
		all_pages: 0,
		page_size: 5,
		page: 1,
		//账号登陆类型    测试(false)或者正常(true)
		count_type: true,

		//当前日期
		month: 0,
		cur_day: 0,
	},
	mounted: function() {
		var self = this;

		var date = new Date();

		self.month = date.getMonth() + 1;

		self.cur_day = date.getDate();

		if(window.localStorage.getItem('count_type')) {

			self.count_type = false;
		}

		self.get_application_list();
	},
	methods: {

		get_application_list: function() {

			var user_json = JSON.parse(window.localStorage.getItem('user_inf'));

			var self = this;
			$.ajax({
				type: "GET",
				url: globalData.url + '/index.php/api/Users/my_loan',
				data: {
					uid: user_json.id,
					page_size: self.page_size,
					page: self.page

				},
				success: function(res) {

					var res = JSON.parse(res);
					if(res.status == 200) {

						var data_list = res.data.res;

						var old_data = self.data_list;
						
						var dm = 24 * 60 * 60;
//				        var d = parseInt(lefttime / dm);
						
						var endtime = null;
						
	                    var nowtime = new Date();
	                    var nowtimr_str=parseInt(Number(nowtime.getTime())/1000);
	                    
	                    //时间差
	                    var lefttime=null;
						
						for (var i=0;i<data_list.length;i++){
							
							if(data_list[i].is_sel_day==1){
								
								endtime=parseInt(Number(data_list[i].ctime)+(Number(24 * 60 * 60)*Number(data_list[i].dai_time)));
								
								if(endtime>=nowtimr_str){
									lefttime=parseInt(endtime - nowtimr_str);
								}else{
									lefttime=-parseInt(nowtimr_str - endtime);
								}
								data_list[i].term=parseInt(lefttime / dm);
							}else{
								endtime=parseInt(Number(data_list[i].ctime)+(Number(24 * 60 * 60)*Number(data_list[i].dai_time)*30));
								
								if(endtime>=nowtimr_str){
									lefttime=parseInt(endtime - nowtimr_str);
								}else{
									lefttime=-parseInt(nowtimr_str - endtime);
								}
								
								data_list[i].term=parseInt(lefttime / dm);
							}
						}

						if(self.page != 1) {
							for(var i = 0; i < data_list.length; i++) {
								old_data.push(data_list[i]);
							}
							self.data_list = old_data;

						} else {
							self.data_list = data_list;
							self.all_pages = res.data.totalpage;
						}

						ws.endPullToRefresh();

						vm.scroll_onff = true;
					}
				}
			});
		},
		formatDateTime: function(opations) {
			var inputTime = inputTime = opations.inputTime;
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
	}
})

//下拉刷新
var ws = null;

function plusReady() {
	ws = plus.webview.currentWebview();
	
	ws.setStyle({
		userSelect:false
	});
	
	if(plus.navigator.isImmersedStatusbar()) { // 兼容沉浸式状态栏模式
		topoffset = Math.round(plus.navigator.getStatusbarHeight());
	}
	ws.setPullToRefresh({
		support: true,
		style: 'circle',
		offset: topoffset + 45 + 'px'
	}, onRefresh);

	//上拉加载
	document.addEventListener("plusscrollbottom", onScrollToBottom, false);

}
// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

function onRefresh() {

	vm.page = 1;
	vm.get_application_list();
}

//上拉加载
function onScrollToBottom() {

	var page = vm.page;
	page++;
	vm.page = page;
	if(page <= vm.all_pages && vm.scroll_onff) {

		vm.get_application_list();

		vm.scroll_onff = false;

		return;

	} else {

		vm.scroll_onff = false;

		if(window.plus) {
			plus.nativeUI.showWaiting('数据已加载完', {
				style: 'black',
				modal: false,
				color: '#000000',
				background: 'rgba(0,0,0,0)'
			});
			setTimeout(function() {

				plus.nativeUI.closeWaiting();
				vm.scroll_onff = true;

			}, 1000);
		}
	}
}

