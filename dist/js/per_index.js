var vm = new Vue({
	el: '#person_data',
	data: {

		//用户中心
		user_name: '',
		avatar: '',
		user_id: '',
		url_arr: null,

		//账号登陆类型    测试(false)或者正常(true)
		count_type: true,

		//用户登录
		number: '',
		new_number: '',
		test_code: '',
		password: '',
		agremment: false,
		code_tip: '获取验证码',
		code_onoff: true,
		timer: null,
		time: 60,

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

			self.get_application_list();

		} else {
			self.count_type = true;
		}

		self.url_arr = JSON.parse(window.localStorage.getItem('path_data'));

		self.get_userinf();

	},
	methods: {

		get_userinf: function() {

			var self = this;
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
							vm.user_id = res.data.info.id;
							if(res.data.info.avatar == '') {
								self.avatar = "../../dist/img/activity.png";
							} else {
								self.avatar = res.data.info.avatar;
							}
						}
						if(!res.data.credit.name) {
							vm.user_name = res.data.info.mobile;
						} else {
							vm.user_name = res.data.credit.name;
						}
					}
				});
			}
		},
		//退出当前账户
		singout: function() {
			if(window.localStorage.getItem('login_status')) {
				if(window.plus) {
					plus.nativeUI.confirm("确定退出吗", function(event) {
						var index = event.index;
						if(index == 0) {

							//重启登录
							window.localStorage.removeItem('launchFlag');
							plus.runtime.restart();

							//							$('.login_box').show();
							//							$('.per_box').hide();

							window.localStorage.removeItem('login_status');

							window.localStorage.removeItem('user_inf');

							vm.avatar = "../../dist/img/activity.png";
							vm.user_name = "未登录";

						}

					}, ["确定", "取消"]);
				} else {
					window.localStorage.clear();
					vm.avatar = "./dist/img/activity.png";
				}
			} else {
				plus.nativeUI.alert("还未登录", function() {}, "提示", "确定");
			}
		},

		//用户登录
		//获取验证码
		get_testcode: function() {
			var self = this;
			if((self.number == '') || !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(self.number))) {
				if(window.plus) {
					plus.nativeUI.alert("请完善手机号", function() {}, "提示", "确定");
				}
				return;
			}
			if(self.code_onoff) {

				//改变按钮颜色
				$('.get_code').css('background', '#EEEEEE');

				$.ajax({
					type: "GET",
					url: globalData.url + '/index.php/api/Users/code',
					data: {
						type: 1,
						mobile: self.number
					},
					//	dataType:"jsonp",
					success: function(res) {
						var res = JSON.parse(res);
						if(res.status == 200) {
							//							self.test_code = res.data.code;
							console.log('获取成功');
						} else {
							if(window.plus) {
								plus.nativeUI.alert("获取失败", function() {}, "提示", "确定");
							}
							return;
						}
					}
				});
			} else {
				return;
			}
			self.code_onoff = false;
			self.timer = setInterval(function() {
				if(self.time > 0) {
					self.time--;
					self.code_tip = self.time + '秒'
				} else {
					$('.get_code').css('background', '#18b5f9');
					self.time = 60;
					self.code_tip = '获取验证码';
					self.code_onoff = true;
					clearInterval(self.timer);
				}
			}, 1000);
		},

		//验证码登录
		test_login: function() {

			var self = this;

			//密码匹配正则
			var pattern_pwd = /^[0-9]*$/;

			if((self.number == '')) {
				plus.nativeUI.alert("请完善手机号", function() {}, "提示", "确定");
				return;
			} else if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(self.number))) {
				plus.nativeUI.alert("手机号不符", function() {}, "提示", "确定");
				return;
			} else if(self.test_code == '') {
				plus.nativeUI.alert("请填写验证码", function() {}, "提示", "确定");
				return;

			}
			$.ajax({
				type: "GET",
				url: globalData.url + '/index.php/api/Users/login_yzm',
				data: {
					mobile: self.number,
					code: self.test_code
				},
				success: function(res) {
					var res = JSON.parse(res);
					if(res.status == 200) {
						window.localStorage.setItem('login_status', 'login');
						window.localStorage.setItem('user_inf', JSON.stringify(res.data));

						if(window.plus) {
							plus.nativeUI.alert("登录成功", function() {
								//back();
								vm.user_name = res.data.name;
								vm.avatar = res.data.avatar;
								vm.user_id = res.data.id;
								$('.per_box').show();
								$('.login_box').hide();

								//正常登录
								if(self.new_number == globalData.count) {

									window.localStorage.setItem('count_type', 'test');

								} else {

									if(window.localStorage.getItem('count_type')) {

										window.localStorage.removeItem('count_type');

									}
									var detailPage = plus.webview.getWebviewById('main_index.html');

									//触发首页面的事件 改变底部tab
									mui.fire(detailPage, 'newsId', {
										id: '传参'
									});
								}

							}, "提示", "确定");
						}
						return;
					} else if(res.status == 201) {
						plus.nativeUI.alert("申请失败", function() {}, "提示", "确定");
						return;
					} else if(res.status == 202) {
						plus.nativeUI.alert("验证码已失效", function() {}, "提示", "确定");
						return;
					} else if(res.status == 203) {
						plus.nativeUI.alert("验证码不存在", function() {}, "提示", "确定");
						return;
					} else if(res.status == 204) {
						plus.nativeUI.alert("该手机号不存在", function() {}, "提示", "确定");
						return;
					} else if(res.status == 205) {
						plus.nativeUI.alert("密码错误", function() {}, "提示", "确定");
						//						alert('密码错误');
						return;
					} else if(res.status == 206) {
						plus.nativeUI.alert("手机号已注册", function() {}, "提示", "确定");
						//						alert('手机号已注册');
						return;
					} else if(res.status == 207) {
						plus.nativeUI.alert("已经实名注册", function() {}, "提示", "确定");
						//						alert('已经实名注册');
						return;
					} else if(res.status == 208) {
						plus.nativeUI.alert("未实名注册", function() {}, "提示", "确定");
						//						alert('未实名注册');
						return;
					} else if(res.status == 400) {
						plus.nativeUI.alert("参数错误", function() {}, "提示", "确定");
						//						alert('参数错误');
						return;
					}
				}
			});

		},
		//密码登录
		pwd_login: function() {
			var self = this;

			//密码匹配正则

			var pattern_pwd = /^[0-9]*$/;

			if((self.new_number == '')) {
				plus.nativeUI.alert("请完善手机号", function() {}, "提示", "确定");
				return;
			} else if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(self.new_number))) {
				plus.nativeUI.alert("手机号不符", function() {}, "提示", "确定");
				return;
			} else if(self.password == '') {
				plus.nativeUI.alert("请设置密码", function() {}, "提示", "确定");
				return;
			}
			$.ajax({
				type: "GET",
				url: globalData.url + '/index.php/api/Users/login_pwd',
				data: {
					mobile: self.new_number,
					pwd: self.password
				},
				success: function(res) {
					var res = JSON.parse(res);
					if(res.status == 200) {
						window.localStorage.setItem('login_status', 'login');
						window.localStorage.setItem('user_inf', JSON.stringify(res.data));

						plus.nativeUI.alert("登录成功", function() {
							//							back();
							vm.user_name = res.data.name;
							vm.avatar = res.data.avatar;

							vm.user_id = res.data.id;

							$('.per_box').show();
							$('.login_box').hide();

							//正常登录
							if(self.new_number == globalData.count) {

								window.localStorage.setItem('count_type', 'test');

							} else {

								if(window.localStorage.getItem('count_type')) {

									window.localStorage.removeItem('count_type');

								}
								var detailPage = plus.webview.getWebviewById('main_index.html');
								//触发详情页面的newsId事件
								mui.fire(detailPage, 'newsId', {
									id: '传参'
								});
							}

						}, "提示", "确定");
						return;
					} else if(res.status == 201) {
						plus.nativeUI.alert("申请失败", function() {

						}, "提示", "确定");
						return;
					} else if(res.status == 202) {
						plus.nativeUI.alert("验证码已失效", function() {

						}, "提示", "确定");
						return;
					} else if(res.status == 203) {
						plus.nativeUI.alert("验证码不存在", function() {

						}, "提示", "确定");
						return;
					} else if(res.status == 204) {
						plus.nativeUI.alert("该手机号不存在", function() {

						}, "提示", "确定");
						return;
					} else if(res.status == 205) {
						plus.nativeUI.alert("密码错误", function() {

						}, "提示", "确定");
						return;
					} else if(res.status == 206) {
						plus.nativeUI.alert("手机号已注册", function() {

						}, "提示", "确定");
						return;
					} else if(res.status == 207) {
						plus.nativeUI.alert("已经实名注册", function() {

						}, "提示", "确定");
						return;
					} else if(res.status == 208) {
						plus.nativeUI.alert("未实名注册", function() {

						}, "提示", "确定");
						return;
					} else if(res.status == 400) {
						plus.nativeUI.alert("参数错误", function() {

						}, "提示", "确定");
						return;
					}
				}
			});

		},

		//测试账号
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
						var nowtimr_str = parseInt(Number(nowtime.getTime()) / 1000);

						//时间差
						var lefttime = null;

						for(var i = 0; i < data_list.length; i++) {

							if(data_list[i].is_sel_day == 1) {

								endtime = parseInt(Number(data_list[i].ctime) + (Number(24 * 60 * 60) * Number(data_list[i].dai_time)));

								if(endtime >= nowtimr_str) {
									lefttime = parseInt(endtime - nowtimr_str);
								} else {
									lefttime = -parseInt(nowtimr_str - endtime);
								}
								data_list[i].term = parseInt(lefttime / dm);
							} else {
								endtime = parseInt(Number(data_list[i].ctime) + (Number(24 * 60 * 60) * Number(data_list[i].dai_time) * 30));

								if(endtime >= nowtimr_str) {
									lefttime = parseInt(endtime - nowtimr_str);
								} else {
									lefttime = -parseInt(nowtimr_str - endtime);
								}

								data_list[i].term = parseInt(lefttime / dm);
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
						
                        if(ws){
                        	
                        	ws.endPullToRefresh();

                        }
						vm.scroll_onff = true;
					}
				}
			});
		},
		formatDateTime: function(opations) {

			//type  d 天  m 月    

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

});

//用户头像更改
function up_img() {

	if(window.plus) {
		plus.nativeUI.showWaiting('图片上传中', {
			style: 'black',
			modal: false,
			color: '#000000',
			background: 'rgba(0,0,0,0)'
		});
	}
	$.ajax({
		type: "POST",
		url: globalData.url + '/index.php/api/Users/save_avatar',
		data: new FormData($('#uploadForm')[0]),
		processData: false,
		contentType: false,
		success: function(res) {
			//console.log(res);
			var res = JSON.parse(res);
			if(res.status == 200) {
				vm.avatar = res.data.avatar;
				if(window.plus) {
					plus.nativeUI.closeWaiting();
				}
			}
		}
	});
}

//用户登录
//登录切换

function change_login() {

	$('.login_box .tab_login span').each(function(i, item) {

		$(this).on('click', function() {

			$('.tab_login span').removeClass('active');
			$(this).addClass('active');
			$('.login_container .option').eq(i).show().siblings().hide();

		});

	});
}

//获取当前窗口对象
var ws = null;

function plusReady() {
	ws = plus.webview.currentWebview();

	ws.setStyle({
		userSelect: false
	});

	ws.addEventListener('show', function(e) {

		vm.get_userinf();

		change_login();

		//登录页和个人中心显示
		if(window.localStorage.getItem('login_status')) {

			$('.per_box').show();
			$('.login_box').hide();

		} else {
			$('.login_box').show();
			$('.per_box').hide();
		}

		vm.url_arr = JSON.parse(window.localStorage.getItem('path_data'));

	}, false);

	ws.addEventListener('hide', function(e) {
		console.log('Webview Showed');
		console.log('页面隐藏');
	}, false);

	//下拉和上拉
	if(window.localStorage.getItem('count_type')) {
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

}

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