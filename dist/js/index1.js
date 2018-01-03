// 处理点击事件
var openw = null,
	waiting = null;
	
var vm = new Vue({

	el: '#parent',
	data: {

		//账号登陆类型    测试(false)或者正常(true)
		count_type: true,

		//上拉开关
		scroll_onff: true,

		// //推荐部分  option1 底部tab
		banner: [],

		//轮播图循环用
		banner_first: null,
		banner_end: null,

		credit_type: [],
		change_tab: [],
		credit_list: [],
		id: 1,

		//总页数
		all_pages: 0,
		page_size: 5,
		page: 1

	},
	mounted: function() {

		var self = this;

		if(window.localStorage.getItem('count_type')) {

			self.count_type = false;

		}else{
			self.count_type = true;
		}

		self.getdata();
	},
	methods: {

		clear: function() {

			window.localStorage.clear();
		},

		//推荐部分  option1 底部tab
		getdata: function() {
			var self = this;
			$.ajax({
				type: "GET",
				url: globalData.url + '/index.php/api/Index/sy',
				data: {
					id: self.id,
					page_size: self.page_size,
					page: self.page
				},
				success: function(res) {
					var res = JSON.parse(res);
					if(res.status == 200) {
						self.banner = res.data.cour;

						$('.fisrt_banner').attr('src', res.data.cour[res.data.cour.length - 1].carousel_img);

						$('.end_banner').attr('src', res.data.cour[0].carousel_img);

						self.credit_type = res.data.lab_1;
						self.change_tab = res.data.lab_2;

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
						
						vm.scroll_onff=true;

						//下拉刷新
						//	onRefresh();

					}
				}
			});
		},

		//贷款类型切换
		changeType: function(event) {
			var self = this;
			var event = event;
			var current = event.currentTarget;
			$('.credit_list_tab .list  li').removeClass('active');
			current.setAttribute('class', 'active');
			self.id = current.getAttribute('type_id');

			self.page = 1;

			self.getdata();

		},

		//推荐部分  option1 底部tab end

	}
});

// 处理点击事件
var openw = null,
	w = window,
	as = 'pop-in';
waiting = null;
/**
 * 打开新窗口
 * @param {URIString} id : 要打开页面url
 * @param {boolean} wa : 是否显示等待框
 * @param {boolean} ns : 是否不自动显示
 * @param {JSON} ws : Webview窗口属性
 */
function open_webview(id, wa, ns, ws) {
	if(openw) { //避免多次打开同一个页面
		return null;
	}

	if(w.plus) {
		console.log(id);
		wa && (waiting = plus.nativeUI.showWaiting());
		ws = ws || {};
		ws.scrollIndicator || (ws.scrollIndicator = 'none');
		ws.scalable || (ws.scalable = false);
		var pre = ''; //'http://192.168.1.178:8080/h5/';
		openw = plus.webview.create(pre + id, id, ws);
		ns || openw.addEventListener('loaded', function() { //页面加载完成后才显示
			//		setTimeout(function(){//延后显示可避免低端机上动画时白屏
			openw.show(as);
			closeWaiting();
			//		},200);
		}, false);
		openw.addEventListener('close', function() { //页面关闭后可再次打开
			openw = null;
		}, false);
		return openw;
	} else {
		w.open(id);
	}
	return null;
};

//下拉刷新
var ws = null,
	par_view = null;

function plusReady() {

	ws = plus.webview.currentWebview();

	if(plus.navigator.isImmersedStatusbar()) { // 兼容沉浸式状态栏模式
		topoffset = Math.round(plus.navigator.getStatusbarHeight());
	}
	ws.setPullToRefresh({
		support: true,
		style: 'circle',
		offset: 0 + 'px'
	}, onRefresh);

	//上拉加载
	document.addEventListener("plusscrollbottom", onScrollToBottom, false);
	
	
	//监听页面显示
	ws.addEventListener('show', function(e){
		
		if(window.localStorage.getItem('count_type')) {
			vm.count_type = false;
		}else{
			vm.count_type = true;
		}
	}, false);
	

}
// 判断扩展API是否准备，否则监听'plusready'事件
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

//下拉刷新
function onRefresh() {

	vm.page = 1;
	vm.getdata();
	var parent = document.querySelector(".parent");
	//	parent.style.marginTop = (Math.round(plus.navigator.getStatusbarHeight()) + 45) + 'px';

	setTimeout(function() {

		if(window.plus && ws) {

			ws.endPullToRefresh();
		}

	}, 1500);

}

//上拉加载
function onScrollToBottom() {

	var page = vm.page;
	page++;
	vm.page = page;

    
	if(page <= vm.all_pages && vm.scroll_onff) {
		
		vm.getdata();
		
		vm.scroll_onff=false;
		
		return;

	} else {
		
		vm.scroll_onff=false;
		
		if(window.plus) {
			plus.nativeUI.showWaiting('数据已加载完', {
				style: 'black',
				modal: false,
				color: '#000000',
				background: 'rgba(0,0,0,0)'
			});
			setTimeout(function() {
				
				plus.nativeUI.closeWaiting();
				vm.scroll_onff=true;
				
			}, 1000);
		}
	}
}

