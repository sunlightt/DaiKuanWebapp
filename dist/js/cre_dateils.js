

var globalData={};






//globalData.time=[1,2,3,4,5,6,7,8,9];

//月利率
globalData.month_rate=null;
//总利息
globalData.Total_interest=null;
//应还款
globalData.repayment=null;

//时间
globalData.time=null;


function actionsheet() {
//
// console.log('ceshiyixia');
// 
// // 月利率
//// var month_rate=0.95%;
//  globalData.month_rate=Number($('.credit_range_wrap .month_rate i').html());
// 
// //总利息
//// var Total_interest=0;
//  globalData.Total_interest=Number($('.credit_range_wrap .Total_interest i').html());
// 
// //应还款
//// var repayment=0;
//  globalData.repayment=Number($('.credit_range_wrap .repayment i').html());
//  
//  //时间
//  globalData.time=Number($('.credit_range_wrap .credit_range .time').val());
//  
// 
// console.log(globalData.month_rate,globalData.Total_interest,globalData.repayment,globalData.time);


//	function plusReady() {
//		// 弹出系统选择按钮框
//		var buttons=[];
//
//		plus.nativeUI.actionSheet({
//			title: "选择日期",
//			cancel: "取消",
//			buttons:[
//			    {'title':1},
//			    {'title':2},
//			    {'title':3},
//			    {'title':4},
//			    {'title':5},
//			    {'title':6},
//			    {'title':7},
//			    {'title':8},
//			    {'title':9}
//			]
//		}, function(e) {
//      
//      
//      
//      
//      
//      d
//			
//		});
//	}
//	if(window.plus) {
//		plusReady();
//	} else {
//		document.addEventListener("plusready", plusReady, false);
//	}

}


//计算
function calculation_money(e){
	
//	   console.log('ceshiyixia');
//	   
//	   var value=Number(e.value);
//	   
//	  //时间
//  
//  console.log(globalData.time);
//  
//  console.log($('.credit_range_wrap .credit_range .time').val());
//  
//  //月利率
//  globalData.month_rate=null;
//  
//  
//
//	   //总利息
//	   globalData.Total_interest=Number(value*globalData.month_rate*globalData.time);
//	   
//	   $('.credit_range_wrap .Total_interest i').html(Number(value*globalData.month_rate*globalData.time));
//	   
//	   console.log(Number(value*globalData.month_rate*globalData.time));
//	   
//	   //月还款
//	   globalData.repayment=Number(value*globalData.month_rate*globalData.time);
//	   $('.credit_range_wrap .repayment i').html(Number(value*globalData.month_rate*globalData.time))
//	   
	   
	
}




var vm=new Vue({
	
	  el:'#calculation',
	  data:{
	  	  //贷款期限
	  	  term:6,
	  	  //贷款范围
	  	  loan_range:1000,
	  	  //月利率
	  	  month_rate:0.34,
	  	  //总利息
	  	  Total_interest:0,
	  	  //月还款
	  	  repayment:0,
	  	  
	  	  //时间选择数组
	  	  
	  	  date_arr:[2,3,4,5,6,7,8]
	  },
	  mounted:function(){
	  	
	  	  var self=this;
	  	  
	  	  //总利息
	  	  self.Total_interest=(Number(self.loan_range)* Math.pow((1+(Number(self.month_rate)/100)),self.term)-Number(self.loan_range)).toFixed(1);
	  	  //应还款
	  	  self.repayment=(Number(self.loan_range)* Math.pow((1+(Number(self.month_rate)/100)),self.term)/self.term).toFixed(1);
	  	  
	  	  console.log(self.Total_interest);
	  	  console.log(self.month_rate);
	  	  
	  },
	  methods:{
	  	//贷款日期选择 
	  	changeselect:function(e){
	  		   var self=this;
	  		   //总利息
	  	     self.Total_interest=(Number(self.loan_range)* Math.pow((1+(Number(self.month_rate)/100)),self.term)-Number(self.loan_range)).toFixed(1);
	  	     //应还款
	  	     self.repayment=(Number(self.loan_range)* Math.pow((1+(Number(self.month_rate)/100)),self.term)/self.term).toFixed(1);
	  		
	  	},
	  	//贷款金额
	  	select_creditvalue:function(){
	  		   var self=this;
	  		   //总利息
	  	     self.Total_interest=(Number(self.loan_range)* Math.pow((1+(Number(self.month_rate)/100)),self.term)-Number(self.loan_range)).toFixed(1);
	  	     //应还款
	  	     self.repayment=(Number(self.loan_range)* Math.pow((1+(Number(self.month_rate)/100)),self.term)/self.term).toFixed(1);
	  		
	  	}
	  }
})

