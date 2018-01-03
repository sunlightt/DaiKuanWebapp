

var vm=new Vue({
	
	el:'#per_inf',
	data:{
		
		name:'',
		//身份证号
		idcard:'',
		//手机号
		mobile:'',
		//职业身份
		my_identity_arr:[{
				'title': '打工族',
				'id': 1
			},
			{
				'title': '企业主',
				'id': 2
			},
			{
				'title': '个体户',
				'id': 3
			},
			{
				'title': '自由职业',
				'id': 4
			}
		],
		my_identity:'',
		//有无信用卡
		is_card_arr:[{
				'title': '有',
				'id': 1
			},
			{
				'title': '无',
				'id': 2
			}
		],
		is_card:'',
		//手机使用时间
		is_mobile_time_arr:[{
				'title': '0',
				'id': 0
			},
			{
				'title': '1-5个月',
				'id': 1
			},
			{
				'title': '6个月以上',
				'id': 2
			}
		
		],
		is_mobile_time:''
		
	},
	mounted:function(){
		
		var self=this;
		
		self.get_perinf();
		
	},
	methods:{
		
		//获取用户信息
		get_perinf:function(){
			var self = this;
			var user_json = JSON.parse(window.localStorage.getItem('user_inf'));
			$.ajax({
				type: "GET",
				url: globalData.url + '/index.php/api/Users/get_info',
				data: {
					uid: user_json.id
				},
				success: function(res) {
                    var res=JSON.parse(res);
                    
                    if(res.status==200){
                    	console.log(res);
                    	
                    	self.name=res.data.credit.name;
                    	self.idcard=res.data.credit.idcard;
                    	self.mobile=res.data.info.mobile;
                    	self.my_identity=res.data.credit.my_identity;
                    	self.is_card=res.data.credit.is_card;
                    	self.is_mobile_time=res.data.credit.is_mobile_time;
                    	
                    } 
				}
			});
		},
		
		//修改职业身份
		change_identity:function(){
			
			var self=this;
			
			
			
			console.log(self.my_identity);
			
		},
		//是否有卡
		change_card_arr:function(){
			
			var self=this;
			
			console.log(self.is_card);
			
		},
		//修改使用时间
		change_time_arr:function(){
			
			var self=this;
			
			console.log(self.is_mobile_time);
			
		},
		
		//修改提交
		modify_submit:function(){
			var self = this;
			var user_json = JSON.parse(window.localStorage.getItem('user_inf'));
			$.ajax({
				type: "GET",
				url: globalData.url + '/index.php/api/Users/save_info',
				data: {
					uid: user_json.id,
					my_identity:self.my_identity,
					is_card:self.is_card,
					is_mobile_time:self.is_mobile_time
				},
				success: function(res) {
                    var res=JSON.parse(res);
                    if(res.status==200){
                    	plus.nativeUI.confirm("修改成功", function(event) {
							var index = event.index;
							if(index == 0) {
								
								back();
							}
						}, ["确定", "取消"]);
                    	//修改成功后返回
                    	
                    }else{
                    	plus.nativeUI.confirm("修改失败", function(event) {
							var index = event.index;
							if(index == 0) {
							}
						}, ["确定", "取消"]);
                    }
				}
			});
			
		}
		
		
	}
	
	
})
