var vm = new Vue({

	el: '#register',
	data: {
		number: '',
		test_code: '',
		password: '',
		agremment: false
	},
	mounted: function() {

	},
	methods: {

		//获取验证码
		get_testcode: function() {

			var self = this;
			if((self.number == '') || !(/^1[3|4|5|8][0-9]\d{4,8}$/.test(self.number))) {
				alert('请完善手机号');
				return;
			}
			$.ajax({
				type: "GET",
				url: globalData.url + '/index.php/api/Users/code',
				data: {
					type: 2,
					mobile: self.number
				},
//				dataType:"jsonp",
				success: function(res) {
					var res=JSON.parse(res);
                    if(res.status==200){
                    	self.test_code=res.data.code;
                    }
				}
			});
		},
		
		//注册
		register:function(){
			var self=this;
		
		    //密码匹配正则
		    var pPattern = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/;
		    var pattern_pwd=/^[0-9]*$/;

			if((self.number == '')) {
				alert('请完善手机号');
				return;
			}else if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(self.number))){
				alert('手机号不符');
				return;
			}else if(self.test_code==''){
				alert('请填写验证码');
			    return ;
				
			}else if(self.password==''){
				alert('请设置密码');
			    return ;
			}else if(!pattern_pwd.test(self.password)){
			    alert('设置的密码不符');
			    return ;
			}else if(!self.agremment){
				alert('您还未同意协议');
			    return ;
			}
			$.ajax({
				type: "GET",
				url: globalData.url+'/index.php/api/Users/register',
				data: {
					mobile: self.number,
					code:self.test_code,
					pwd:self.password
				},
				success: function(res) {
					var res=JSON.parse(res);
                    if(res.status==200){
                        alert('注册成功');
                    }else if(res.status=201){
                    	alert('申请失败');
                    }else if(res.status=202){
                    	alert('验证码已失效');
                    }else if(res.status=203){
                    	alert('验证码不存在');
                    }else if(res.status=204){
                    	alert('该手机号不存在');
                    }else if(res.status=205){
                    	alert('密码错误');
                    }else if(res.status=206){
                    	alert('手机号已注册');
                    }else if(res.status=207){
                    	alert('已经实名注册');
                    }else if(res.status=208){
                    	alert('未实名注册');
                    }else if(res.status=400){
                    	alert('参数错误');
                    }
				}
			});
			
		}

	}

})