

window.onload=function(){
	
	//初始化
	init();
	
}


function init(){
	
	//tab切换
    tab_change()
	
}


//tab切换
function tab_change(){
	
	$('.head_top .list span').each(function(i,item){
		
		$(this).on('click',function(){
			
			$('.head_top .list li').removeClass('active');
			$(this).parent().addClass('active');
			
			$('.container .content').css({'display':'none'});
			$('.container .content').eq(i).css({'display':'block'});
			
			
		});
		
	});
	
	
}
