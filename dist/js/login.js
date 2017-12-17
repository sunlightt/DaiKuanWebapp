

var vm = new Vue({

	el: '#login',
	data: {
		number: '',
		new_number:'',
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
					type: 1,
					mobile: self.number
				},
//				dataType:"jsonp",
				success: function(res) {
					var res=JSON.parse(res);
                    if(res.status==200){
                    	self.test_code=res.data.code;
                    }else{
                    	alert('获取失败');
                    	return;
                    }
				}
			});
		},
		
		//验证码登录
		test_login:function(){
			var self=this;
		
		    //密码匹配正则
		    
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
				
			}
			$.ajax({
				type: "GET",
				url: globalData.url+'/index.php/api/Users/login_yzm',
				data: {
					mobile: self.number,
					code:self.test_code
				},
				success: function(res) {
					var res=JSON.parse(res);
					console.log(res.data);
                    if(res.status==200){
                    	window.localStorage.setItem('login_status','login');
                        window.localStorage.setItem('user_inf',JSON.stringify(res.data));
                        back();
//                      window.history.go(-1);
                        alert('登录成功');
                        return;
                    }else if(res.status=201){
                    	alert('申请失败');
                    	return;
                    }else if(res.status=202){
                    	alert('验证码已失效');
                    	return;
                    }else if(res.status=203){
                    	alert('验证码不存在');
                    	return;
                    }else if(res.status=204){
                    	alert('该手机号不存在');
                    	return;
                    }else if(res.status=205){
                    	alert('密码错误');
                    	return;
                    }else if(res.status=206){
                    	alert('手机号已注册');
                    	return;
                    }else if(res.status=207){
                    	alert('已经实名注册');
                    	return;
                    }else if(res.status=208){
                    	alert('未实名注册');
                    	return;
                    }else if(res.status=400){
                    	alert('参数错误');
                    	return;
                    }
				}
			});
			
		},
		//密码登录
		pwd_login:function(){
			var self=this;
		
		    //密码匹配正则
		    
		    var pattern_pwd=/^[0-9]*$/;

			if((self.new_number == '')) {
				alert('请完善手机号');
				return;
			}else if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(self.new_number))){
				alert('手机号不符');
				return;
			}else if(self.password==''){
				alert('请设置密码');
			    return ;
			}
			$.ajax({
				type: "GET",
				url: globalData.url+'/index.php/api/Users/login_pwd',
				data: {
					mobile: self.new_number,
					pwd:self.password
				},
				success: function(res) {
					var res=JSON.parse(res);
                    if(res.status==200){
                    	window.localStorage.setItem('login_status','login');
                    	window.localStorage.setItem('user_inf',JSON.stringify(res.data));
                    	
                    	back();
//                  	window.history.go(-1);
                        alert('登录成功');
                        return;
                    }else if(res.status=201){
                    	alert('申请失败');
                    	return;
                    }else if(res.status=202){
                    	alert('验证码已失效');
                    	return;
                    }else if(res.status=203){
                    	alert('验证码不存在');
                    	return;
                    }else if(res.status=204){
                    	alert('该手机号不存在');
                    	return;
                    }else if(res.status=205){
                    	alert('密码错误');
                    	return;
                    }else if(res.status=206){
                    	alert('手机号已注册');
                    	return;
                    }else if(res.status=207){
                    	alert('已经实名注册');
                    	return;
                    }else if(res.status=208){
                    	alert('未实名注册');
                    	return;
                    }else if(res.status=400){
                    	alert('参数错误');
                    	return;
                    }
				}
			});
			
		}

	}

})
























//登录切换
change_login();
function change_login(){
	
	$('.tab_login span').each(function(i,item){
		
		$(this).on('click',function(){
			
			$('.tab_login span').removeClass('active');
			$(this).addClass('active');
		    $('.login_container .option').eq(i).show().siblings().hide();
			
		});
		
	});
}
