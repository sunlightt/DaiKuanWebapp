var vm = new Vue({
	el: '#cre_list',
	data: {
		credit_list: [],
		//总页数
		all_pages: 0,
		page_size: 5,
		page: 1

	},
	mounted: function() {

		var self = this;

		self.get_creditlist();
		
		if(window.localStorage.getItem('title')){
			
			$('#title').html(window.localStorage.getItem('title'));
			
		}
	},
	methods: {

		get_creditlist: function() {
			var self = this;
			var url = null;

			if(window.localStorage.getItem('ser_url')) {

				url = globalData.url + window.localStorage.getItem('ser_url');

			} else {
				url = globalData.url + '/index.php/api/Index/type_search';
			}

			$.ajax({
				type: "GET",
				url: url,
				data: {
					id: window.localStorage.getItem('credit_id'),
					page_size: self.page_size,
					page: self.page

				},
				success: function(res) {

					var res = JSON.parse(res);
					if(res.status == 200) {

						var data_list = res.data.pro_lst;

						var old_data = self.credit_list;

						if(self.page != 1) {
							for(var i = 0; i < data_list.length; i++) {
								old_data.push(data_list[i]);
							}
							self.credit_list = old_data;

						} else {
							self.credit_list = data_list;
							self.all_pages = res.data.totalpage;
						}

						//下拉刷新
						if(window.plus && ws) {

							ws.endPullToRefresh();

						}

					}
				}
			});

		},

	}
})

//下拉刷新
var ws = null;

function plusReady() {
	ws = plus.webview.currentWebview();
	if(plus.navigator.isImmersedStatusbar()) { // 兼容沉浸式状态栏模式
		topoffset = Math.round(plus.navigator.getStatusbarHeight());
	}
	ws.setPullToRefresh({
		support: true,
		style: 'circle',
		offset: topoffset + 45 + 'px'
	}, onRefresh);
}
// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

function onRefresh() {

	vm.page = 1;
	vm.get_creditlist();
	var parent = document.querySelector(".parent");
	parent.style.marginTop = (Math.round(plus.navigator.getStatusbarHeight()) + 45) + 'px';
}

//上拉加载
$(window).scroll(function() {
	var scrollTop = $(this).scrollTop();
	var scrollHeight = $(document).height();
	var windowHeight = $(this).height();
	var positionValue = (scrollTop + windowHeight) - scrollHeight;

	if(positionValue >= 0) {
		var page = vm.page;
		page++;
		vm.page = page;

		console.log(page);

		if(page > vm.all_pages) {

			if(window.plus) {

				plus.nativeUI.showWaiting('数据已加载完', {
					style: 'black',
					modal: false,
					color: '#000000',
					background: 'rgba(0,0,0,0)'
				});

				setTimeout(function() {
					plus.nativeUI.closeWaiting();
				}, 1000);

			}
			return;

		} else {
			vm.getdata();
		}

	}
});