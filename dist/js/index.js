window.onload = function() {

	//轮番图初始化
	$('#full_feature').swipeslider();
	$('#content_slider').swipeslider({
		transitionDuration: 600,
		autoPlayTimeout: 10000,
		sliderHeight: '260px'
	});
	$('#responsiveness').swipeslider();
	$('#customizability').swipeslider({
		transitionDuration: 1500,
		autoPlayTimeout: 4000,
		timingFunction: 'cubic-bezier(0.38, 0.96, 0.7, 0.07)',
		sliderHeight: '30%'
	});

	//广播轮番图
	set_animatetime();

	function set_animatetime() {

		var time = $('.broadcast .list li').length;
		$('.broadcast .list').css({
			'animationDuration': time * 2 + 's'
		});

	}

	//贷款列表切换
	credit_list_tab();

	function credit_list_tab() {

		$('.credit_list_tab .list  li').each(function(i, item) {

			$(this).on('click', function() {

				$(this).addClass('active').siblings().removeClass('active');
			});

		});

	}

	//贷款部分
	ser_tab_change();
	//tab切换
	function ser_tab_change() {

		$('.head_top .ser_tab .list span').each(function(i, item) {

			$(this).on('click', function() {

				$('.head_top .ser_tab .list li').removeClass('active');
				$(this).parent().addClass('active');

				$('.ser_option .container .content').css({
					'display': 'none'
				});
				$('.ser_option .container .content').eq(i).css({
					'display': 'block'
				});

			});
		});

	}

	//公用 
	//底部tab切换
	tab_change('.container_wrap .option_tab', '.footer li img');

	var tab_onoff = true;

	var tab_icon = [{
			path: './dist/img/recommend.png',
			active: './dist/img/recommend1.png'

		},
		{
			path: './dist/img/credit.png',
			active: './dist/img/credit1.png'

		},
		{
			path: './dist/img/service.png',
			active: './dist/img/service1.png'

		},
		{
			path: './dist/img/grouping1.png',
			active: './dist/img/grouping.png'

		}
	]

	function tab_change(aim, item) {
		$(aim).hide();
		$(aim).eq(0).show();

		var botoffset = 0;
		botoffset = $('.footer').outerHeight(true) + 'px';
		
		var ws = null,
			embed = null;

		$(item).each(function(i, item) {

			$(item).on('click', function() {

				$(aim).hide();
				$(aim).eq(i).show();

				for(var j = 0; j < $('.footer li img').length; j++) {

					$('.footer li img').eq(j).attr('src', tab_icon[j].path);

				}

				if(i == 2) {

					
					// H5 plus事件处理
					function plusReady() {
						var topoffset = '45px';
						if(plus.navigator.isImmersedStatusbar()) { // 兼容immersed状态栏模式
							topoffset = (Math.round(plus.navigator.getStatusbarHeight()) + 45) + 'px';
						}

                        ws = plus.webview.currentWebview();
						embed = plus.webview.create('https://www.baidu.com', '', {
							top: topoffset,
							bottom: botoffset,
							dock: 'bottom',
							bounce: 'vertical'
						});
						ws.append(embed);

						embed.addEventListener('loaded', function() {
							plus.nativeUI.closeWaiting();
						}, false);
						embed.addEventListener('loading', function() {
							plus.nativeUI.showWaiting('', {
								style: 'black',
								modal: false,
								background: 'rgba(0,0,0,0)'
							});
						}, false);
					}
					if(window.plus) {
						plusReady();
					} else {
						document.addEventListener('plusready', plusReady, false);
					}

				} else {
				    if(window.plus){
				    	ws.remove(embed);
						embed.close();
						plus.nativeUI.closeWaiting();
				    }
				}
				
				$(this).attr('src', tab_icon[i].active);

			});

		});

	}

}