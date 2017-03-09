
//控制字符长度兼容 
function wordList(obj, num) {
		if($(obj).text().length > num) {
		$(obj).text($(obj).text().substring(0,num));
		$(obj).html($(obj).html()+'....');
	} 
}
function showForm(){
	var h = document.body.scrollHeight;
    $("#b").fadeIn(); 
	$("#b").css("height",h);	
}



//
function prompt_close(){
	$("#b").fadeOut(); 
    $(".drawBox").fadeOut();
}

function videos(video) {
	if(navigator.userAgent.indexOf("MSIE")>0) { 
		$("#videoM").append('<object classid="clsid:22D6F312-B0F6-11D0-94AB-0080C74C7E95" width="644" height="428" >'+ 
		'<param name="Filename" value='+video+'>'+ 
		'<param name="PlayCount" value="0">'+ 
		'<param name="AutoStart" value="0">'+ 
		'<param name="ClickToPlay" value="1">'+ 
		'<param name="EnableFullScreen Controls" value="1">'+ 
		'<param name="ShowAudio Controls" value="1">'+
		'<param name="EnableContext Menu" value="1">'+ 
		'<param name="ShowDisplay" value="0">'+ 
		'</object>'); 
	} else { 
		$("#videoM").append(
			'<video controls="controls" preload width="644" height="428">'+ 
			'<source src='+video+' type="video/mp4" codecs="avc1.42E01E, mp4a.40.2"></source>'+ 
			'<source src='+video+' type="video/ogg"></source>'+ 
			'<source src='+video+' type="video/3gp"></source>'+ 
			'</video>'); 
		} 
    }

function private_ajax(method, data, handler) {
	$.ajax({
		url:method,
		data:data,
		type:"post",
		cache:false,
		dataType:"html",
		contenttype :"application/x-www-form-urlencoded;charset=utf-8", 
		success: function(data) {
			if(typeof handler == 'function') {
				handler(data);
			}
		}
	});
}

function private_ajax2(method, data, handler) {
	$.ajax({
		url:method,
		data:data,
		type:"post",
		cache:false,
		async:false,  
		dataType:"html",
		contenttype :"application/x-www-form-urlencoded;charset=utf-8", 
		success: function(data) {
			if(typeof handler == 'function') {
				handler(data);
			}
		}
	});
}
//获取“？”后面的参数，过滤“&”的参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]); return null;
}

//不过滤带“&”的参数
function getPar(par) {
	   //获取当前URL
	   var local_url = document.location.href;
	   //获取要取得的get参数位置
	   var get = local_url.indexOf(par +"=");
	   if(get == -1){
	       return false;  
	   }  
	   //截取字符串
	   var get_par = local_url.slice(par.length + get + 1);  
	   //判断截取后的字符串是否还有其他get参数
	   /*var nextPar = get_par.indexOf("&");
	   if(nextPar != -1){
	       get_par = get_par.slice(0, nextPar);
	   }*/
	   return get_par;
	}

function validateBuyNumber(num) {
	if(!num) {
		return false;
	}else if(isNaN(num)) {
		return false;
	}else if(num <= 0 || num >= 1000) {
		return false;
	}else{
		return true;
	}
}

var loading = null;
function lock() {
	if(loading == null) {
		loading = layer.load('加载中…');
	}
	
}
function unlock() {
	if(loading != null) {
		layer.close(loading);
		loading = null;
	}
}

//设置按钮是否可用
function disabled(obj,text,disable){
	$(obj).attr("disabled", disable);
	$(obj).val(text);
}

function prompt_closet(){
	$("#b").fadeOut(); 
    $(".promptBox").fadeOut();
}
//积分提示框
function upBox(obj,text){
	var str = "";
	str+= "<div class='b' id='b'></div>";
	str+= "<div class='promptBox'>";
	str+= "<div class='prompt_cos'></div>";
	str+= "<div class='prompt_i'></div>"
	str+= "<div class='prompt_box'>";
	str+= "<div class='prompt_boxConter'>";
	str+= "<div class='prompt_title'>";
	str+= "<div class='prompt_logo'></div>";
	str+= "<div class='prompt_close' onclick='prompt_closet()' title='关闭'></div>";
	str+= "</div>";
	str+= "<div class='prompt_text clearbox'>";
	str+="<p>"+text+"<p>";
	str+="</div>";
	str+= "<div class='prompt_confirmation'></div>";
	str+= "</div>";
	str+= "</div>";
	str+= "</div>";
	$("#"+obj).html(str);
	var h = document.body.scrollHeight;
    $("#b").fadeIn(); 
    $("#b").css("height",h);
	$(".promptBox").fadeIn();
};



//首页分类(静态页面使用到，因为样式不一样，所以分开)
$(document).ready(function(){
	$(document).on({ 
	    mouseenter: function() {
	    	$(".wrap_btn").removeClass('dn');
	    }, 
	    mouseleave: function() { 
	    	$(".wrap_btn").addClass('dn');
	    }
	}, '.wrap_btn, .categorysName_btn, .wrap');	
	
	  //====================================页面返回顶部===================================
    $("#gotoTop").click(function(e) {
		$("html, body").stop().animate({scrollTop:0})
	});
	
	
	$('.all-sort-list > .item:last').css({borderBottom:'none'});
	$('.all-sort-list > .item').hover(function(){
		var eq = $('.all-sort-list > .item').index(this),				//获取当前滑过是第几个元素
			h = $('.all-sort-list').offset().top,						//获取当前下拉菜单距离窗口多少像素
			s = $(window).scrollTop(),									//获取游览器滚动了多少高度
			i = $(this).offset().top,									//当前元素滑过距离窗口多少像素
			item = $(this).children('.item-list').actual('height');		//下拉菜单子类内容容器的高度									//父类分类列表容器的高度
			sort = $('.all-sort-list').actual('height');    //actual该方法是jquery.actual.min.js组件里面的方法，用来获取加了display:none的元素高度宽度
		if(item<=sort){	//如果子类实际高度(根据数据量撑开的高度)小于等于父类高度时，就将子类高度设置和父类的高度一致		
			$(this).children('.item-list').css('height',sort);
		}
		$(this).children('.item-list').css('top', 0 );
		/* if ( item < sort ){												//如果子类的高度小于父类的高度
			if ( eq == 0 ){
				$(this).children('.item-list').css('top', (i-h));
			} else {
				$(this).children('.item-list').css('top', (i-h));
			}
		 } else {
			if ( s > h ) {												//判断子类的显示位置，如果滚动的高度大于所有分类列表容器的高度
				if ( i-s > 0 ){											//则 继续判断当前滑过容器的位置 是否有一半超出窗口一半在窗口内显示的Bug,
					$(this).children('.item-list').css('top', (s-h)+2 );
				} else {
					$(this).children('.item-list').css('top', (s-h)-(-(i-s))+2 );
				}
			} else {
				$(this).children('.item-list').css('top', 0 );
			}
		}	*/
	    $(this).children('.item-list').css('zIndex','9999');
		$(this).children('.item-list').css('display','block');		
		$(this).children('.item-list').find('.subitem dd').eq(0).css('borderTop','none');
	},function(){
		$(this).removeClass('hover');
		$(this).children('.item-list').css('display','none');
	});

	$('.item > .item-list > .close').click(function(){
		//$(this).parent().parent().removeClass('hover');
		$(this).parent().hide("slow");
	});
});


//保留两位小数
function changeTwoDecimal_f(x) {
    var f_x = parseFloat(x);
    if (isNaN(f_x)) {
        alert('function:changeTwoDecimal->parameter error');
        return false;
    }
    var f_x = Math.round(x * 100) / 100;
    var s_x = f_x.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
    }
    return s_x;
}

function fmoney(s, n)  
{  
   n = n >= 0 && n <= 20 ? n : 2;  
   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";  
   var l = s.split(".")[0].split("").reverse(),  
   r = s.split(".")[1];  
   t = "";  
   for(i = 0; i < l.length; i ++ )  
   {  
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
   }  
   if(n==0)
	   return t.split("").reverse().join("");
   return t.split("").reverse().join("") + "." + r;  
}
