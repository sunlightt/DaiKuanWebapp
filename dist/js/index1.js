
var openw = null,
    waiting = null;


var vm = new Vue({

	el: '#parent',
	data: {
		banner: [],
		credit_type: [],
		change_tab: [],
		credit_list: []
	},
	mounted: function() {

		var self = this;

		self.getdata();
	},
	methods: {

		getdata: function() {
			var self = this;
			$.ajax({
				type: "GET",
				url: globalData.url + '/index.php/api/Index/sy',
				data: {
					id: 1
				},
				dataType: "jsonp",
				success: function(res) {

					self.banner = res.cour;
					self.credit_type = res.lab_1;
					self.change_tab = res.lab_2;
					self.credit_list = res.pro_lst;

				}
			});

		},

		//跳转详情
		
		clicked_canshu: function(event) {
			var event=event;
			var current = event.currentTarget;
			var credit_id = current.getAttribute('credit_id');
			console.log(event);
			console.log(credit_id);
		    console.log(current.getAttribute('path'))
			var w=window;
			var option={
				 id:'',
				 wa:'',
				 ns:'',
				 wx:''
			}
			
			option.id="pages/credit/cre_dateils.html" ;
			
			
			console.log('ceshi');
			console.log(event);
			if(openw) { //避免多次打开同一个页面
				return null;
			}
//			return;
			if(w.plus) {
				option.wa && (waiting = plus.nativeUI.showWaiting());
				option.ws = option.ws || {};
				option.ws.scrollIndicator || (ws.scrollIndicator = 'none');
				option.ws.scalable || (ws.scalable = false);
				var pre = ''; //'http://192.168.1.178:8080/h5/';
				openw = plus.webview.create(pre + option.id, option.id, option.ws);
				option.ns || openw.addEventListener('loaded', function() { //页面加载完成后才显示
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
				w.open(option.id);
			}
			return null;
		}
	}
})