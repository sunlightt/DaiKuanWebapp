var vm = new Vue({

	el: '#calculation',
	data: {
		
		//商品名
		pro_name:'',
		//日月类型
		is_rate: 1,
		//成功率
		success_rate: 0,
		//申请人数
		apply_num: 0,
		//审核说明
		review_msg: '',
		//图片路径
		img_src: '',
		//贷款最大 最小范围
		min_money: 0,
		max_money: 0,
		//贷款最大 最小期限
		min_day: 0,
		max_day: 0,
		//贷款期限
		term: 6,
		//贷款范围
		loan_range: 1000,
		//月利率
		month_rate: 0.34,
		//总利息
		Total_interest: 0,
		//月还款
		repayment: 0,

		//时间选择数组

		date_arr: [2, 3, 4, 5, 6, 7, 8],

		//贷款id
		did: '',
		
		//所有数据
		allData:'',
		
		//账号登陆类型    测试(false)或者正常(true)
		count_type:true,
	},
	mounted: function() {

		var self = this;

        if(window.localStorage.getItem('count_type')){
        	
        	self.count_type=false;
        	
        }
        
        //更改title
        if(window.localStorage.getItem('title')){
			
			$('#title').html(window.localStorage.getItem('title'));
			
		}

		self.get_detailinf();

	},
	methods: {
		//贷款日期选择 
		changeselect: function(e) {
			var self = this;
			//总利息
			self.Total_interest = (Number(self.loan_range) * Math.pow((1 + (Number(self.month_rate) / 100)), self.term) - Number(self.loan_range)).toFixed(1);
			//应还款
			self.repayment = (Number(self.loan_range) * Math.pow((1 + (Number(self.month_rate) / 100)), self.term) / self.term).toFixed(1);

			//贷款时间
			window.localStorage.setItem('dai_time', self.term);
			
			//贷款金额
			window.localStorage.setItem('dai_money', self.loan_range);

			//每次还款
			window.localStorage.setItem('money_per', self.repayment);
			//总利息
			window.localStorage.setItem('zong_lixi', self.Total_interest);

		},
		//贷款金额
		select_creditvalue: function() {
			var self = this;
			//总利息
			self.Total_interest = (Number(self.loan_range) * Math.pow((1 + (Number(self.month_rate) / 100)), self.term) - Number(self.loan_range)).toFixed(1);
			//应还款
			self.repayment = (Number(self.loan_range) * Math.pow((1 + (Number(self.month_rate) / 100)), self.term) / self.term).toFixed(1);

			//贷款金额
			window.localStorage.setItem('dai_money', self.loan_range);
			
			//还款期限
			window.localStorage.setItem('dai_time', self.term);
			
			//每次还款
			window.localStorage.setItem('money_per', self.repayment);
			//总利息
			window.localStorage.setItem('zong_lixi', self.Total_interest);

		},

		//详情信息获取

		get_detailinf: function() {

			var self = this;
			$.ajax({
				type: "GET",
				url: globalData.url + '/index.php/api/Index/dai_detail',
				data: {
					id: window.localStorage.getItem('credit_id')
				},
				success: function(res) {

					var res = JSON.parse(res);
					if(res.status == 200) {

                   
                        self.pro_name=res.data.pro_name;
						self.is_rate = res.data.is_rate;
						self.success_rate = res.data.success_rate;
						self.apply_num = res.data.apply_num;
						self.review_msg = res.data.review_msg;

						self.img_src = res.data.pro_img;
						self.min_money = res.data.min_money;
						self.max_money = res.data.max_money;
						self.min_day = res.data.min_day;
						self.max_day = res.data.max_day;

						self.loan_range = res.data.min_money;
						self.term = res.data.sel_day[0];
						self.month_rate = res.data.rate;
						self.date_arr = res.data.sel_day;
						
						self.allData=res.data;
						
						//总利息
		                self.Total_interest = (Number(res.data.min_money) * Math.pow((1 + (Number(res.data.rate) / 100)), res.data.sel_day[0]) - Number(res.data.min_money)).toFixed(1);
		                //应还款
		                self.repayment = (Number(res.data.min_money) * Math.pow((1 + (Number(res.data.rate) / 100)), res.data.sel_day[0]) / res.data.sel_day[0]).toFixed(1);
						
						//每次还款
		                window.localStorage.setItem('money_per', self.repayment);
		                //总利息
		                window.localStorage.setItem('zong_lixi', self.Total_interest);

						//贷款id
						self.did = res.data.id;
						window.localStorage.setItem('did', res.data.id);
						//贷款金额
						window.localStorage.setItem('dai_money', res.data.min_money);
						//贷款时间
						window.localStorage.setItem('dai_time', res.data.sel_day[0]);
						//期限选择
						window.localStorage.setItem('is_sel_day', res.data.is_sel_day);
						//利率
						window.localStorage.setItem('rate', res.data.rate);
						
						//贷款成功后跳转得外链
						window.localStorage.setItem('pro_url', res.data.pro_url);

					}
				}
			});
		}
	}
})

//获取当前窗口对象

function plusReady() {
	var ws=plus.webview.currentWebview();
	// 显示遮罩层
	ws.setStyle({
		softinputMode: "adjustResize",
		userSelect:false
	});
}

if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

