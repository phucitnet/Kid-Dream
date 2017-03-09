$(function(){
	$.fn.slide = function(options) {
		var defaults = {
			btn:          '.focus_btn',
			leftBtn:      '.focus_left',
			rightBtn:     '.focus_right',
			btnActive:    'click',
			picBox:       '.focus_pic',
			time:         '5000',
			speed:        '500',
			num:          '1',
			play:         '1'
		};
		var obj     =     $.extend(defaults, options),
			self    =     $(this),
			picUl   =     self.find(obj.picBox+">ul"),
			picLi   =     picUl.find(">li"),
			btnLi   =     self.find(obj.btn+">ul>li"),
			leftBtn =     self.find(obj.leftBtn),
			rightBtn=     self.find(obj.rightBtn),
			len     =     Math.ceil(picLi.length/obj.num),
			index   =     0,
			timer,
			moveX,
			moveWidth,
			ulWidth = 100*len + "%";
			liWidth = 100/len + "%";
		picUl.css({"width":ulWidth});
		picLi.css({"width":liWidth});
		
	}
	
	//点击小图标
	$('.focus_btn ul li').click(function(e) {
        $(this).addClass('active').siblings().removeClass('active')	
		var selfIndex = $(this).index()
		$('.focus_pic ul').stop().animate({'left':-100*selfIndex+'%'},500)
		liNum = selfIndex;
    });

	//自动轮播
	var liNum = 0;
	var cTimer;
	var liLine = $('.focus_pic ul li').length-1
	function autoPlay(){
		liNum++;
		if(liNum>liLine){
			liNum=0	
		}
		$('.focus_pic ul').stop().animate({'left':-100*liNum+'%'},500)
		$('.focus_btn ul li').eq(liNum).addClass('active').siblings().removeClass('active')	
	}
	cTimer = setInterval(autoPlay,5000) //自动轮播时间
	
	/*左右按钮*/
	$('.focus_right').click(function(e) {
        autoPlay();
    });
	$('.focus_left').click(function(e) {
        liNum--;
		if(liNum<0){
			liNum=liLine	
		}
		$('.focus_pic ul').stop().animate({'left':-100*liNum+'%'},500)
		$('.focus_btn ul li').eq(liNum).addClass('active').siblings().removeClass('active')	
    });
	
	//鼠标移上关闭定时器
	$('.focus_pic').hover(function(){
		clearInterval(cTimer)
	},function(){
		cTimer = setInterval(autoPlay,5000)  //自动轮播时间
	})
	
})