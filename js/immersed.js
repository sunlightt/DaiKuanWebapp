(function(w) {

	document.addEventListener('plusready', function() {
		var parent = document.querySelector(".parent");
	    
		if(parent) {
	        parent.style.marginTop =(Math.round(plus.navigator.getStatusbarHeight()) + 45) + 'px';
//			if(plus.device.vendor.indexOf('Apple') != -1) {
//				parent.style.marginTop = 0 + 'px';
//			} else {
//				parent.style.marginTop = (Math.round(plus.navigator.getStatusbarHeight()) + 45) + 'px';
//			}
	    }
	}, false);

	var immersed = 0;
	var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
	if(ms && ms.length >= 3) {
		immersed = parseFloat(ms[2]);
	}
	w.immersed = immersed;

	if(!immersed) {
		return;
	}
	var t = document.getElementById('header');
	console.log(immersed);
	//t&&(t.style.paddingTop=immersed+'px',t.style.background='-webkit-linear-gradient(top,rgba(215,75,40,1),rgba(215,75,40,0.8))',t.style.color='#FFF');
	t && (t.style.paddingTop = immersed + 'px', t.style.background = '#D74B28', t.style.color = '#FFF');
	t = document.getElementById('content');
	t && (t.style.marginTop = immersed + 'px');
	t = document.getElementById('scontent');
	t && (t.style.marginTop = immersed + 'px');
	t = document.getElementById('dcontent');
	t && (t.style.marginTop = immersed + 'px');
	t = document.getElementById('map');
	t && (t.style.marginTop = immersed + 'px');

	//	var parent=document.querySelector(".parent");
	//	parent.style.marginTop =immersed + 'px';
	//	parent.style.marginTop =(Math.round(plus.navigator.getStatusbarHeight()) + 45) + 'px';

})(window);