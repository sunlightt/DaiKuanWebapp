var vm = new Vue({

	el: '#application',
	data: {
		identity: [{
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
		is_card: [{
				'title': '有',
				'id': 1
			},
			{
				'title': '无',
				'id': 2
			}
		],
//		identity:[1,2,3,4],
//		is_card:[1,2],
		name: '',
		idcard: '',
		//身份id
		iden_id:1,
		//是否有卡
		card_id:1
	},
	mounted: function() {

	},
	methods: {

		application: function() {

			var self = this;

			if(self.iden_id == '') {

				alert('请选择身份');
				return;

			} else if(self.card_id == '') {

				alert('请选择是否有卡');
				return;

			} else if(self.name == '') {

				alert('请输入真实姓名');
				return;

			} else if(self.idcard == '') {

				alert('请输入身份证号');
				return;

			}
			
			var uid=null;

			if(window.localStorage.getItem('user_inf')) {

				user_json = JSON.parse(window.localStorage.getItem('user_inf'));

                uid=user_json.id;

			}

			$.ajax({
				type: "GET",
				url: globalData.url+'/index.php/api/users/add_rz',
				data: {
					uid:uid,
					my_identity:self.iden_id,
					is_card :self.card_id,
					name:self.name,
					idcard:self.idcard
				},
				//				dataType:"jsonp",
				success: function(res) {
					var res = JSON.parse(res);
					if(res.status == 200) {
						
						console.log(res);
						
						window.localStorage.setItem('authen_status',2);
						alert('认证成功');
						back();
						
					}else{
						alert('认证失败');
						window.localStorage.setItem('authen_status',1);
					}
				}
			});

		}

	}

});

//身份选择
function select_identity(ev) {


	vm.iden_id = $(ev).attr('iden_id');
	
	$(this).addClass('active').siblings().removeClass('active');
	
	console.log($(ev).attr('iden_id'));

}

//是否有卡选择
function select_is_card(ev) {

	console.log($(ev).attr('card_id'));
	
	$(this).removeClass('active');

	vm.card_id = $(ev).attr('card_id');

}


//身份选择
	credit_list_tab();

	function credit_list_tab() {

		$('.select_identity  li').each(function(i, item) {

			$(this).on('click', function() {
				
				console.log('ceshi');

				$(this).addClass('active').siblings().removeClass('active');
			});

		});

	}
	
//信用卡选择
select_card_id_style();
function select_card_id_style(){
	
	$('.select_card_id  li').each(function(i, item) {

			$(this).on('click', function() {
				
				console.log('ceshi');

				$(this).addClass('active').siblings().removeClass('active');
			});

		});
	
}
