var vm = new Vue({

	el: '#login',
	data: {
		number: '',
		new_number: '',
		test_code: '',
		password: '',
		agremment: false,
		code_tip: '获取验证码',
		code_onoff: true,
		timer: null,
		time: 60
	},
	mounted: function() {

	},
	methods: {

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
				$('.get_code').css('background','#EEEEEE');
				
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
					$('.get_code').css('background','#18b5f9');
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
					console.log(res.data);
					if(res.status == 200) {
						window.localStorage.setItem('login_status', 'login');
						window.localStorage.setItem('user_inf', JSON.stringify(res.data));
						
						//正常登录
						if(self.new_number == globalData.count) {

							window.localStorage.setItem('count_type', 'test');

						} else {

							if(window.localStorage.getItem('count_type')) {

								window.localStorage.removeItem('count_type');

							}
						}
						
						if(window.plus) {
							plus.nativeUI.alert("登录成功", function() {
								back();
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
						
						//正常登录
						if(self.new_number == globalData.count) {

							window.localStorage.setItem('count_type', 'test');

						} else {

							if(window.localStorage.getItem('count_type')) {

								window.localStorage.removeItem('count_type');

							}
						}
						
						plus.nativeUI.alert("登录成功", function() {
							back();
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

		}

	}

})

//登录切换

function change_login() {

	$('.tab_login span').each(function(i, item) {

		$(this).on('click', function() {
			
			console.log(i);

			$('.tab_login span').removeClass('active');
			$(this).addClass('active');
			$('.login_container .option').hide();
			$('.login_container .option').eq(i).show();

		});

	});
}

//获取当前窗口对象

function plusReady() {
	var ws = plus.webview.currentWebview();
	plus.webview.currentWebview().setStyle({
		softinputMode: "adjustResize"
	});
	ws.addEventListener('show', function(e) {

		change_login();

	}, false);
}

if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}