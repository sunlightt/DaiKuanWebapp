window.onload = function() {

//	//轮番图初始化
//  setTimeout(function(){
//  	$('#full_feature').swipeslider();
//		$('#content_slider').swipeslider({
//			transitionDuration: 600,
//			autoPlayTimeout: 10000,
//			sliderHeight: '260px'
//		});
//		$('#responsiveness').swipeslider();
//		$('#customizability').swipeslider({
//			transitionDuration: 1500,
//			autoPlayTimeout: 4000,
//			timingFunction: 'cubic-bezier(0.38, 0.96, 0.7, 0.07)',
//			sliderHeight: '30%'
//		});
//  },4000);
//	

	//广播轮番图
	set_animatetime();

	function set_animatetime() {
		var time = $('.broadcast .list li').length;
		$('.broadcast .list').css({
			'animationDuration': time * 2 + 's'
		});
	}

}


//贷款列表切换
//	credit_list_tab();
//
//	function credit_list_tab() {
//
//		$('.credit_list_tab .list  li').each(function(i, item) {
//
//			$(this).on('click', function() {
//
//				$(this).addClass('active').siblings().removeClass('active');
//			});
//
//		});
//
//	}