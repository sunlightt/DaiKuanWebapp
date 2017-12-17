

var vm=new Vue({
	
	el:'#application_list',
	data:{
		data_list:[]
	},
	mounted:function(){
		var self=this;
		self.get_application_list();
	},
	methods:{
		
		get_application_list:function(){
			
			 var user_json = JSON.parse(window.localStorage.getItem('user_inf'));
			 
		     var self=this;
		     $.ajax({
				type: "GET",
				url:globalData.url+'/index.php/api/Users/my_loan',
				data: {
					uid:user_json.id
				},
				success: function(res) {

                    var res=JSON.parse(res);
                    if(res.status==200){
                    	
						console.log(res);
						self.data_list=res.data;
                    	
                    } 
				}
			});
		
		}
		
	}
})



