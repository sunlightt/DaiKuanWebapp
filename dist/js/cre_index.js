//tab切换
function tab_change() {

	$('.head_top .list li').removeClass('active');
	$('.head_top .list span').eq(0).parent().addClass('active');

	$('.container .content').css({
		'display': 'none'
	});
	$('.container .content').eq(0).css({
		'display': 'block'
	});

	$('.head_top .list span').each(function(i, item) {

		$(this).on('click', function() {

			$('.head_top .list li').removeClass('active');
			$(this).parent().addClass('active');

			$('.container .content').css({
				'display': 'none'
			});
			$('.container .content').eq(i).css({
				'display': 'block'
			});

			//调用函数
			if(i === 1) {
				//默认搜索
				vm.default_search();
				vm.up_index=1;
			}else{
				vm.up_index=0;
			}
		});
	});
}

// 处理点击事件
var openw = null,
	waiting = null;

var vm = new Vue({

	el: '#credit_inf',
	data: {
		
		//切换title
		
		//账号登陆类型    测试(false)或者正常(true)
		count_type: true,
		
		//上拉加载index
		up_index:0,
		//上拉开关
		scroll_onff: true,

		//贷款   底部tab
		//url切换
		ser_url: '/index.php/api/Index/loan_lab_search',
		//期限
		term: '不限',
		//贷款金额
		loan_mount: 0,
		//热门推荐
		select_date: [1, 2, 3, 4, 5, 6],
		date_arr: ['3天', '一周内', '1个月', '3个月', '6个月', '不限'],
		pup_recom_list: [],
		//借贷搜索
		credit_search_list: [],

		//贷款列表添加
		credit_all_pages: 0,
		credit_page_size: 5,
		credit_page: 1,

		//用户中心
		user_name: '',
		avatar: '',
		user_id: '',
		url_arr: [],

		//测试账号登录计算数据
		//金额
		account_val: 0,
		//期限
		term: 0,
		//利率
		rate: 0,

		//总利息
		Total_interest: 0,
		//月还款
		repayment: 0,

		//期限
		term_aim: '月',

		//期限类型
		term_type: ['月', '日']

	},
	mounted: function() {

		var self = this;

		if(window.localStorage.getItem('count_type')) {

			self.count_type = false;

		}else{
			self.count_type = true;
		}

		self.pup_recom();
	},
	methods: {

		//热门推荐
		pup_recom: function() {
			var self = this;
			$.ajax({
				type: "GET",
				url: globalData.url + '/index.php/api/Index/loan_lab',
				//				dataType: "jsonp",
				success: function(res) {
					var res = JSON.parse(res);
					if(res.status == 200) {
						self.pup_recom_list = res.data;
					}
				}
			});
		},
		//信用卡带  
		credit_card: function() {
			var self = this;
			$.ajax({
				type: "GET",
				url: globalData.url + '/index.php/api/Index/loan_lab',
				success: function(res) {
					var res = JSON.parse(res);
					if(res.status == 200) {
						self.pup_recom_list = res.data;
					}
				}
			});
		},

		//默认搜索
		default_search: function() {

			var self = this;
			if(self.term == '不限') {
				self.term = 6;
			}
			console.log('ceshi');
			//搜索查询借贷列表
			$.ajax({
				type: "GET",
				url: globalData.url + '/index.php/api/Index/loan_search',
				data: {
					money: Number(self.loan_mount),
					time: self.term,
					page_size: self.credit_page_size,
					page: self.credit_page
				},
				success: function(res) {

					var res = JSON.parse(res);

					if(res.status == 200) {
						var old_search_list = self.credit_search_list;
						var data_search_list = res.data.pro;
						if(self.credit_page != 1) {
							for(var i = 0; i < data_search_list.length; i++) {
								old_search_list.push(data_search_list[i]);
							}
							self.credit_search_list = old_search_list;

						} else {
							self.credit_search_list = data_search_list;
							self.credit_all_pages = res.data.totalpage;
						}
						
						vm.scroll_onff=true;
						
						console.log(res.data.totalpage);
					}
				}
			});
		},

		//借款金额
		inputvalue: function() {

			var self = this;

			self.credit_page = 1;

			self.default_search();

		},
		//期限选择
		changeselect: function() {

			var self = this;

			self.credit_page = 1;

			self.default_search();

		},

		//测试账号处理
		input_count: function() {

			var self = this;
			if(self.account_val == 0) {
				self.repayment = 0;
				self.Total_interest = 0;
				return;
			} else if(self.term == 0 && self.rate == 0) {
				self.repayment = Number(self.account_val);
				self.Total_interest = 0;
				return;
			}else if(self.term == 0){
				self.repayment = Number(self.account_val);
				self.Total_interest = (Number(self.account_val) * Number(self.rate)).toFixed(1);
				return;
			}else if(self.rate == 0){
				self.repayment = (Number(self.account_val) / Number(self.term)).toFixed(1);
				self.Total_interest = 0;
				return;
				
			}
			
			
			//总利息
			self.Total_interest = (Number(self.account_val) * Math.pow((1 + (Number(self.rate) / 100)), self.term) - Number(self.account_val)).toFixed(1);
			//应还款
			self.repayment = (Number(self.account_val) * Math.pow((1 + (Number(self.rate) / 100)), self.term) / self.term).toFixed(1);

		},
		input_term: function() {

			var self = this;
			if(self.account_val == 0) {
				self.repayment = 0;
				self.Total_interest = 0;
				return;
			} else if(self.term == 0 && self.rate == 0) {
				self.repayment = Number(self.account_val);
				self.Total_interest = 0;
				return;
			} else if(self.rate == 0) {
				self.repayment = (Number(self.account_val) / Number(self.term)).toFixed(1);
				self.Total_interest = 0;
				return;
			}
			//总利息
			self.Total_interest = (Number(self.account_val) * Math.pow((1 + (Number(self.rate) / 100)), self.term) - Number(self.account_val)).toFixed(1);
			//应还款
			self.repayment = (Number(self.account_val) * Math.pow((1 + (Number(self.rate) / 100)), self.term) / self.term).toFixed(1);

		},
		input_rate: function() {

			var self = this;
			if(self.account_val == 0) {
				self.repayment = 0;
				self.Total_interest = 0;
				return;
			} else if(self.term == 0 && self.rate == 0) {
				self.repayment = Number(self.account_val);
				self.Total_interest = 0;
				return;
			} else if(self.term == 0) {
				self.repayment = Number(self.account_val);
				self.Total_interest = (Number(self.account_val) * Number(self.rate)).toFixed(1);
				return;
			}
			//总利息
			self.Total_interest = (Number(self.account_val) * Math.pow((1 + (Number(self.rate) / 100)), self.term) - Number(self.account_val)).toFixed(1);
			//应还款
			self.repayment = (Number(self.account_val) * Math.pow((1 + (Number(self.rate) / 100)), self.term) / self.term).toFixed(1);

		}

	}
});

// 处理点击事件
var openw = null,
	w = window,
	as = 'pop-in';
waiting = null;
/**
 * 打开新窗口
 * @param {URIString} id : 要打开页面url
 * @param {boolean} wa : 是否显示等待框
 * @param {boolean} ns : 是否不自动显示
 * @param {JSON} ws : Webview窗口属性
 */
function open_webview(id, wa, ns, ws) {
	if(openw) { //避免多次打开同一个页面
		return null;
	}

	if(w.plus) {
		console.log(id);
		wa && (waiting = plus.nativeUI.showWaiting());
		ws = ws || {};
		ws.scrollIndicator || (ws.scrollIndicator = 'none');
		ws.scalable || (ws.scalable = false);
		var pre = ''; //'http://192.168.1.178:8080/h5/';
		openw = plus.webview.create(pre + id, id, ws);
		ns || openw.addEventListener('loaded', function() { //页面加载完成后才显示
			//		setTimeout(function(){//延后显示可避免低端机上动画时白屏
			openw.show(as);
			closeWaiting();
			//		},200);
		}, false);
		openw.addEventListener('close', function() { //页面关闭后可再次打开
			openw = null;
		}, false);
		return openw;
	} else {
		w.open(id);
	}
	return null;
};

//获取当前窗口对象

function plusReady() {
	var ws = plus.webview.currentWebview();
	ws.addEventListener('show', function(e) {
		tab_change();

		//监听页面显示
		if(window.localStorage.getItem('count_type')) {
			vm.count_type = false;
		} else {
			vm.count_type = true;
		}

	}, false);
	
	//上拉加载
	document.addEventListener("plusscrollbottom", onScrollToBottom, false);
}

//上拉加载
function onScrollToBottom() {

	var page = vm.credit_page;
	page++;
	vm.credit_page = page;
	console.log(vm.up_index);
	if(vm.up_index!=1){
		return;
	}
	console.log('加载');
	if(page <= vm.credit_all_pages && vm.scroll_onff) {
		console.log('搜索'); 
		vm.default_search();
		vm.scroll_onff=false;
		return;
	} else {
		vm.scroll_onff=false;
		if(window.plus) {
			plus.nativeUI.showWaiting('数据已加载完', {
				style: 'black',
				modal: false,
				color: '#000000',
				background: 'rgba(0,0,0,0)'
			});
			setTimeout(function() {
				
				plus.nativeUI.closeWaiting();
				vm.scroll_onff=true;
				
			}, 1000);
		}
	}
}

if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}