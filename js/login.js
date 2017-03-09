var webHost;var orgId;
function login(){
	if(!validate_userName() || !validate_pwd()){
		return ;
	} 
	var method=webHost+"/"+orgId+"/doLogin.do";
	//var datas=$("#form").serializeArray();
	var chkRememberMe=document.getElementById('chkRememberPwd').checked == true;
	if(!chkRememberMe){};
	var redirect=getQueryString("redirect");//用来截取登录后要跳转的地址url\
	var isAddCart=0;
	if(redirect != null && redirect.indexOf("selectCartItem.do") != -1)
		isAddCart=1;
	var userId=$("#userName").val();
	var pwd=$("#pwd").val();
	var datas = {userId:userId,pwd:pwd,isAddCart:isAddCart,"chkRememberMe":chkRememberMe}
	private_ajax(method,datas,
	function(data){
		if(data=='1'){
			if($("#ejectLogin").length>0){
				$("#b").fadeOut(); 
		        $("#ejectLogin").fadeOut(500);
		        window.location.reload()
				return true;
			}else{						
				if(redirect==null){
					redirect=webHost+"html/"+orgId+"_index.html";
				}
				window.location.href=redirect;	
			}
		}else{
			if($(".errorPU").size()>0){
				$(".errorPU").animate({left:"-370px",opacity:"+=1"},"300");
			}else{
				$("#showMsg").html("账号或者密码错误！");
				$("#showMsg").show();
			}
		}
	});
}


function validate_userName(){
	var value=$.trim($("#userName").val());
	if(value==='用户名/手机号码')
		value ='';
	if($(".userID_valiated").size()>0){
		if(value==''){
			$(".userID_valiated").animate({left:"-220px",opacity:"+=1"},"300");
			return false;
		}
		$(".userID_valiated").animate({left:"-280px",opacity:"-=1"},"300");
	}else{
		if(value==null || value==''){
			$("#showMsg").html("请输入账号！");
			$("#showMsg").show();
			return false;
		}
	}
	
	return true;
}



function validate_pwd(){
	var value=$.trim($("#pwd").val());
	if(value==='密码')
		value ='';
	if($(".passWord_valiate").size()>0){
		if(value==''){
			$(".passWord_valiate").animate({left:"-220px",opacity:"+=1"},"slow");
			return false;
		}
		$(".passWord_valiate").animate({left:"-280px",opacity:"-=1"},"slow");
		return true;
	}else{
		if(value==null || value==''){
			$("#showMsg").html("请输入密码！");
			$("#showMsg").show();
			return false;
		}
	}
	return true;
}
	
$(document).ready(function(e) {
		/*var h = $(window).height();
		var loginH = $(".login").height();
		$(".big_login_img").css({'height':(h-92)});
		$(".loginBoxBtna a").css({'top':loginH+92});
		$(".login_img").first().css({'opacity':1});
		var aImg = $('#loginBox .login_img');		//图像集合
		var iSize = aImg.size();		//图像个数
		var index = 0;		//切换索引
		$('#prev').click(function(){		//左边按钮点击
			index--;
			if(index<0){
				index=iSize-1
			}
			change()
		})
		$('#next').click(function(){    //右边按钮点击
			index++;
			if(index>iSize-1){
				index=0
			}
			change()
		})
		
		//切换过程
		function change(){
			aPage.removeClass('active');
			aPage.eq(index).addClass('active');
			aImg.stop();
			//隐藏除了当前元素，所以图像
			aImg.eq(index).siblings().animate({
				opacity:0
			},1000)
			//显示当前图像
			aImg.eq(index).animate({
				opacity:1
			},1000)
		}
		$("#close").click(function(){
			$("#b").fadeOut();
			  $("#login_popup").fadeOut(500);
		});
		*/ 
	 $("#remember").click(
	    function(){
	    	if($(this).hasClass("checked")){
	    		$(this).removeClass("checked")
	    	}else{
	    		$(this).addClass("checked")
	    	}
	   	}); 
	   	
	 $("#remember_i").click(function(){
		$("#remember").click();
	}); 
	$("#userName").keyup(function(){
		validate_userName();
	});
	$("#pwd").keyup(function(){validate_pwd();});
			
  });
	  
function toSearch(){
	var productKey=$("#search").val();
	if(productKey!=null && productKey!=""){
		window.location.href="productSearch/1.do?productKey="+productKey;
	}
} 
function chkRememberPwd(){
	var chkRememberMe=document.getElementById('chkRememberPwd').checked;
	if(chkRememberMe){
		$('#chkRememberPwd').attr("checked","")
		$("#autoLoginIcon").removeClass("icon-ok");
	}else{
		$('#chkRememberPwd').attr("checked","checked");
		$("#autoLoginIcon").addClass("icon-ok");
	}
}
function setParms(host,id){
	webHost=host;
	orgId=id;
}