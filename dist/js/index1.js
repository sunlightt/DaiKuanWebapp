// 处理点击事件
var openw = null,
	waiting = null;

var vm = new Vue({

	el: '#parent',
	data: {
		// //推荐部分  option1 底部tab
		banner: [],
		credit_type: [],
		change_tab: [],
		credit_list: [],
		id: 1,

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

		//用户中心
		user_name: '',
		avatar: '',
		user_id: '',
		url_arr: []

	},
	mounted: function() {

		var self = this;

		self.getdata();
	},
	methods: {

		//推荐部分  option1 底部tab
		getdata: function() {
			var self = this;
			$.ajax({
				type: "GET",
				url: globalData.url + '/index.php/api/Index/sy',
				data: {
					id: self.id
				},
				success: function(res) {
					var res = JSON.parse(res);
					if(res.status == 200) {  
						self.banner = res.data.cour;
						self.credit_type = res.data.lab_1;
						self.change_tab = res.data.lab_2;
						self.credit_list = res.data.pro_lst;

						//下拉刷新
						//						onRefresh();
						if(window.plus && ws) {

							ws.endPullToRefresh();
						}

					}
				}
			});
		},

		//贷款类型切换
		changeType: function(event) {
			var self = this;
			var event = event;
			var current = event.currentTarget;
			
//			$('.credit_list_tab .list  li').each(function(i, item) {
//	
//				$(this).on('click', function() {
//	
//					$(this).addClass('active').siblings().removeClass('active');
//				});
//	
//			});
            $('.credit_list_tab .list  li').removeClass('active');
			current.setAttribute('class','active');
			self.id = current.getAttribute('type_id');
			self.getdata();

		},

		//推荐部分  option1 底部tab end

		//贷款   底部tab
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
			//搜索查询借贷列表
			$.ajax({
				type: "GET",
				url: globalData.url + '/index.php/api/Index/loan_search',
				data: {
					money: Number(self.loan_mount),
					time: self.term
				},
				success: function(res) {

					var res = JSON.parse(res);
					if(res.status == 200) {

						self.credit_search_list = res.data;
					}

				}
			});
		},

		//借款金额
		inputvalue: function() {

			var self = this;

			self.default_search();

			console.log(self.loan_mount);

		},
		//期限选择
		changeselect: function() {

			var self = this;
			self.default_search();

		}

	}
});

// 处理点击事件
var openw = null,
	w = window,
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

//公用 
//底部tab切换
tab_change('.container_wrap .option_tab', '.footer li');

var tab_onoff = true;

var tab_icon = [{
		path: './dist/img/recommend.png',
		active: './dist/img/recommend1.png'

	},
	{
		path: './dist/img/credit.png',
		active: './dist/img/credit1.png'

	},
	{
		path: './dist/img/service.png',
		active: './dist/img/service1.png'

	},
	{
		path: './dist/img/grouping1.png',
		active: './dist/img/grouping.png'

	}
]

function tab_change(aim, item) {
	$(aim).hide();
	$(aim).eq(0).show();

	var botoffset = 0;
	botoffset = $('.footer').outerHeight(true) + 'px';

	var ws = null,
		embed = null;

	//  ws = plus.webview.currentWebview();		

	$(item).each(function(i, item) {

		$(item).on('click', function() {

			if(i == 0) {

				vm.pup_recom();

				if(window.plus && embed) {
					ws.remove(embed);
					embed.close();
					plus.nativeUI.closeWaiting();
				}

			} else if(i == 1) {

				vm.pup_recom();

				if(window.plus && embed) {
					ws.remove(embed);
					embed.close();
					plus.nativeUI.closeWaiting();
				}
			} else if(i == 2) {
				var path = null;
				$.ajax({
					type: "POST",
					url: globalData.url + '/index.php/api/Users/services',
					async: false,
					success: function(res) {

						var res = JSON.parse(res);
						if(res.status == 200) {

							path = res.data.fw;

							if(window.plus) {
								plusReady();
							} else {
								document.addEventListener('plusready', plusReady, false);
							}

						}
					}
				});

				// H5 plus事件处理
				function plusReady() {
					var topoffset = '45px';
					if(plus.navigator.isImmersedStatusbar()) { // 兼容immersed状态栏模式
						topoffset = (Math.round(plus.navigator.getStatusbarHeight()) + 45) + 'px';
					}

					ws = plus.webview.currentWebview();
					embed = plus.webview.create(path, path, {
						top: topoffset,
						bottom: botoffset,
						dock: 'bottom',
						bounce: 'vertical'
					});
					ws.append(embed);

					embed.addEventListener('loaded', function() {
						plus.nativeUI.closeWaiting();
					}, false);
					embed.addEventListener('loading', function() {
						plus.nativeUI.showWaiting('', {
							style: 'black',
							modal: false,
							background: 'rgba(0,0,0,0)'
						});
					}, false);
				}

			} else if(i == 3) {
				if(window.plus && embed) {
					ws.remove(embed);
					embed.close();
					plus.nativeUI.closeWaiting();
				}

				if(window.localStorage.getItem('login_status')) {
					var user_json = JSON.parse(window.localStorage.getItem('user_inf'));
					$.ajax({
						type: "GET",
						url: globalData.url + '/index.php/api/Users/get_info',
						data: {
							uid: user_json.id
						},
						success: function(res) {
							var res = JSON.parse(res);
							if(res.status == 200) {

								vm.user_name = res.data.credit.name;
								vm.user_id = res.data.info.id;
								if(res.data.info.avatar == '') {
									vm.avatar = "./dist/img/activity.png";
								} else {
									vm.avatar = res.data.info.avatar;
								}
							}
						}
					});

					//获取跳转链接
					$.ajax({
						type: "POST",
						url: globalData.url + '/index.php/api/Users/services',
						async: false,
						success: function(res) {
							var res = JSON.parse(res);
							if(res.status == 200) {

								// path = res.data.fw;

								vm.url_arr = res.data;

							}
						}
					});

				} else {
					//没有登录时跳转到登录页
					open_webview('pages/login/login.html');
					return;
				}

			}

			$(aim).hide();
			$(aim).eq(i).show();

			for(var j = 0; j < $('.footer li img').length; j++) {

				$('.footer li img').eq(j).attr('src', tab_icon[j].path);

			}

			$(this).find('img').attr('src', tab_icon[i].active);

			//			if(i != 2) {
			//				if(window.plus) {
			//					ws.remove(embed);
			//					embed.close();
			//					plus.nativeUI.closeWaiting();
			//
			//				}
			//			}

		});

	});

}

//底部ta切换  第二部分

//贷款部分
ser_tab_change();
//tab切换
function ser_tab_change() {

	$('.head_top .ser_tab .list span').each(function(i, item) {

		$(this).on('click', function() {

			$('.head_top .ser_tab .list li').removeClass('active');
			$(this).parent().addClass('active');

			$('.ser_option .container .content').css({
				'display': 'none'
			});
			$('.ser_option .container .content').eq(i).css({
				'display': 'block'
			});

			//调用函数
			if(i === 1) {

				//默认搜索
				vm.default_search();

			}

		});
	});

}

//用户头像更改
function up_img() {
	$.ajax({
		type: "POST",
		url: globalData.url + '/index.php/api/Users/save_avatar',
		data: new FormData($('#uploadForm')[0]),
		processData: false,
		contentType: false,
		success: function(res) {
			console.log(res);
			var res = JSON.parse(res);
			if(res.status == 200) {
				vm.avatar = res.data.avatar;
			}
		}
	});
}

//下拉刷新
var ws = null;

function plusReady() {
	ws = plus.webview.currentWebview();
	ws.setPullToRefresh({
		support: true,
		height: '50px',
		range: '200px',
		contentdown: {
			caption: '下拉可以刷新'
		},
		contentover: {
			caption: '释放立即刷新'
		},
		contentrefresh: {
			caption: '正在刷新...'
		}
	}, onRefresh);

//	document.addEventListener("plusscrollbottom", onScrollToBottom, false);

	//	plus.nativeUI.toast('下拉可以刷新');
}
// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

function onRefresh() {

	//  ws.endPullToRefresh();

	vm.getdata();

	var parent = document.querySelector(".parent");
	parent.style.marginTop = (Math.round(plus.navigator.getStatusbarHeight()) + 45) + 'px';
//	if(plus.device.vendor.indexOf('Apple') != -1) {
//		parent.style.marginTop = 0 + 'px';
//	} else {
//		parent.style.marginTop = (Math.round(plus.navigator.getStatusbarHeight()) + 45) + 'px';
//	}

}

// 处理滚动到窗口底部事件   （上啦加载）
function onScrollToBottom() {
	plus.nativeUI.toast('数据已加载完，已滑到最底部', {
		align: 'center',
		duration: 'short',
		verticalAlign: 'center'
	});

}



//下拉刷新
$(window).scroll(function() {
    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(document).height();
    var windowHeight = $(this).height();
    var positionValue = (scrollTop + windowHeight) - scrollHeight;
    if (positionValue >= 0) {
         //执行ajax，获取数据
        console.log('数据已加载完，已滑到最底部');
        if(window.plus){
        	plus.nativeUI.toast('数据已加载完，已滑到最底部', {
				align: 'center',
				duration: 'short',
				verticalAlign: 'center'
			});
        }
        
    }
});