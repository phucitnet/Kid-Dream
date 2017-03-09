$(function(){
    var $window = $(window);
    var $elements = $('.clo_1');
    $elements.each(function() {
		var picWidth = $(this).css('width');
		if(picWidth=='1920px'){
			$(this).width($window.width());
			$(this).children("a").children("img").width($window.width());
			$(this).children("div").children("a").children("img").width($window.width());
			$(this).children("div").children("div").children("a").children("img").width($window.width());
			$(this).children("div").children("div").children("div").children("a").children("img").width($window.width());
		}
    });
/*	$(document).find('img').load(function() {
		//图片默认隐藏 
		$(this).hide(); 
		//使用fadeIn特效 
		$(this).fadeIn("800"); 
		});*/
	
	/**/
	//事件触发
	/*hoverAdd('.categorys','categorys_itemOn');
	hoverAdd('.categorys_item','categorys_itemOn');*/
	hoverAdd('.in_promo','in_promoOn');
	//hoverAdd('.categorys','categorysOn');
	
	/*hoverAdd('.JSproduct li','on');*/
	
	//selection(".j-select-color");
	//selection(".j-select-size");
	//selection(".j-select-model");
	//Tab切换
	$(".J-tab").css({"display":"none"});
	$(".J-tab.active").css({"display":"block"});
	$(".tabClick>li").click(function(){
		var index = $(this).index();
		var thisList = $(this).parent().find("li");
		var thisId = $(this).parent().attr("id");
		thisList.removeClass("active").eq(index).addClass("active");
		$("#"+thisId+"_con>.J-tab").removeClass("active").hide().eq(index).addClass("active").show();
	})
	//查看帮助详细
	$(".userHelp_more").click(function(){
		var that = $(this);
		var more = that.parent().siblings()
		if(more.is(":hidden")){
			more.show();
			that.addClass("userHelp_moreOn");
		}else{
			more.hide();
			that.removeClass("userHelp_moreOn");
		}
	})
	$('.tk_quality_box .animation_li').hover(function(e) {
		if($(this).children('.mask_box').html()!=undefined)
			$(this).children('.title_box').stop().fadeToggle(600);
    });
})
//表单文本验证只能输入数字
$(function(){
	var text = $('.textVerify');
	text.keyup(function(){
		$(this).val($(this).val().replace(/\D|^0/g,''));
		if($(this).val()==''){$(this).val(1);}
	}).on("paste",function(){
		$(this).val($(this).val().replace(/\D|^0/g,''));
	}).css("ime-mode", "disabled");
})
//属性选择
function selection(obj){
	var object = $(obj),
		  that = object.find("li"),
		  input = object.siblings("input[type='hidden']");
	that.on("click",function(){
		if(!$(this).hasClass("invalid")){
			var rel = $(this).attr('rel');
			if($(this).hasClass("on")){
				$(this).removeClass('on');
				input.val(0);
			}else{
				$(this).siblings().removeClass('on');
				$(this).addClass('on');
				input.val(rel);
			}
		}
	});
}
//滑过添加类
function hoverAdd(classObj,addObj){	
	var classObject = $(classObj);
	classObject.hover(function(){
		$(this).addClass(addObj);
	},function(){
		$(this).removeClass(addObj);
	})
}
//幻灯片
$.fn.slide = function(options) {
	var defaults = {
		type:         'left',
		btn:          '.slide_btn',
		leftBtn:      '.slide_left',
		rightBtn:     '.slide_right',
		btnActive:    'click',
		picBox:       '.slide_pic',
		num:          '1',
		conWidth:     '100%',
		conHeidth:    '100%',
		time:         '3000',
		speed:        '500',
		play:         '1',
		percent:      '0'
	};
	var
		obj       =     $.extend(defaults,options),
		self      =     $(this),
		picUl     =     self.find(obj.picBox+">ul"),
		picLi     =     self.find(obj.picBox+">ul>li"),
		btnLi     =     self.find(obj.btn+">ul>li"),
		leftBtn   =     self.find(obj.leftBtn),
		rightBtn  =     self.find(obj.rightBtn),
		type      =     obj.type,
		conWidth  =     obj.conWidth,
		conHeight  =    obj.conHeight,
		speed     =     obj.speed,
		percent   =     obj.percent,
		len       =     Math.ceil(picLi.length/obj.num),
		index     =     0,
		timer;
	if(percent == 1 && type == "left"){
		picUl.css({"width":100*len+"%"});
		picLi.css({"width":100/len+"%"});
		$(this).animate({"opacity":"1"},500);
	}

	btnLi.bind(obj.btnActive,function(){
		if(index != btnLi.index(this)){
			index = btnLi.index(this);
			goanimate(index);
		}
	})

	leftBtn.click(function(){
		if(index==0){index=len-1;}else{index--;}
		goanimate(index);
	})

	rightBtn.click(function(){
		if(index==len-1){index=0;}else{index++;}
		goanimate(index);
	})

	if(obj.play==1){
		self.hover(function(){
			clearInterval(timer);
		},function(){
			clearInterval(timer);
			timer = setInterval(function(){
				if(index==len-1){index=0;}else{index++;}
				goanimate(index);
			},obj.time);
		}).trigger("mouseleave");
	}

	var goanimate = function(index){
		if(percent == "1" && type == "left"){
			picUl.stop().animate({"marginLeft":-index*100 +"%"},speed);
		}
		if(percent == "0" && type == "left"){
			picUl.stop().animate({"marginLeft":-index*conWidth},speed);
		}
		if(percent == "0" && type == "top"){
			picUl.stop().animate({"marginTop":-index*conHeight},speed);
		}
		if(percent == "0" && type == "fade"){
			picLi.stop(false,true).fadeOut();
			picLi.eq(index).stop(false,true).fadeIn();
		}
		btnLi.removeClass("active").eq(index).addClass("active");
	}

}