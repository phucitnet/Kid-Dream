var commentScore = "0";//记住评价等级
var currentPage = 1;//记住从后台获取的当前页
var total = "0"; //总记录数
var stockNum = "0"//记住库存
var endTime ="";
var fittingAmout=0;
var fittingMap = new Map();
$(function(){	
	$("#pic_item").attr("value",$("#ImgS img").attr("src"));//填充内容 
	$("#dn").removeClass("dn");
		
    stockNum = $("#selectStock").text();
    if(stockNum==""){//如果没有设置库存，就把显示剩余几件的文字隐藏掉
    	$("#message").hide();
    }
	//选择属性
	$(".pro_detail_item .item").mouseover(function() {
		$(this).addClass("over");
	}).mouseout(function() {
		$(this).removeClass("over");
	}).click(function() {
		var type = $(this).attr("type");
		$(".pro_detail_item .item").each(function() {
			if($(this).attr("type") == type) {				
				  $(this).parent().removeClass("on");
			}			
		});		
		$(this).parent().addClass("on");
		$("#"+type).val($(this).attr("value"));
		$(this).parent().parent().removeClass("unselect");
		});
	
//加数量
$(".pro_detail_num .jia").click(function() {
	var obj = $(this).prev();
	var num = parseInt(obj.val()) + 1;
	obj.val(num);
	var limitBuyNumber = $("#limitBuyNumber").val();
	var alone = $("#aloneId").val();
	if(limitBuyNumber!=null && limitBuyNumber!='' &&  limitBuyNumber!=undefined && alone !=='1'){
		if(num>parseFloat(limitBuyNumber)){
			$("#buyNum").val(limitBuyNumber);
			 upBox("prompt","您选购的商品只能抢购"+limitBuyNumber+"件");
			 return;
		}
	}
	if(stockNum != "") {//说明有设置库存，检验库存
		if(num <= stockNum) {
			obj.val(num);
			$("#stock").attr("value",stockNum);
			$("#message").html("<span id='message'>剩余<span id='selectStock'>" + stockNum + "</span> 件  </span>");
			
		}if(num>stockNum) {
			$("#message").html("<span id='message' style='color:red'>库存不足</span>");
		}
	}else{//说明没有设置库存，就没必要检验库存，直接允许购买
		obj.val(num);
		$("#message").hide();
	}
}); 
		 
//减数量
$(".pro_detail_num .jian").click(function() {
	var obj = $(this).next();
	var num = parseInt(obj.val()) - 1;
	 
	if(num >0) {
		obj.val(num);
	}
	
	if(num <= stockNum) {
		$("#message").html("<span id='message'>剩余<span id='selectStock'>" + stockNum + "</span> 件  </span>");
		
	}
});

			
//购买数量值变化
$(".pro_detail_num #buyNum").change(function() {
	var val = $(this).val();
	if(!validateBuyNumber(val)) {
		$(this).val("1");
	}
	
}).keypress(function(event) {
	if(event.which < 48 || event.which > 57) {
		return false;
	}
});

function tabPic(colorCode,picList){
	var dataUrl;
	  var arr = eval('(' + picList + ')'); 
	  if(arr != null &&arr.length>0){
		  dataUrl = arr[0].url;//默认第一张
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].colorCode==colorCode){	                     
				dataUrl = arr[i].url;
				break;
			}
		}
	  }
  $(".jqzoom").find("img").eq(0).attr("src",dataUrl); 
  $(".zoomWrapperImage").children("img").attr("src",dataUrl);  
}
		
//查询库存和不同型号的价格
$(".clearbox .j-select-size>li").click(function(){
	var isExistPayYunFei = false;
	var size = $("#size_item").val();
	var color = $("#color_item").val();
	var model = $("#model_item").val();
	var taste = $("#taste_item").val();
	var course = $("#course_item").val();
	var productId = $("#productId").val();
	var fullAmount = $("#fullAmount").val();//满足打折的价格
	var marketDiscount = $("#marketDiscount").val();//满打折折扣	
	var memberdiscount = $("#memberdiscount").val(); //会员折扣
	var payYunFei  = $("#payYunFei").val();//是否有设置了仅需费用，如果设置了就不进入根据规格尺寸的价格查询
	if(payYunFei!=null && payYunFei!="" && payYunFei!="null"&& typeof(payYunFei) != "undefined"){
		isExistPayYunFei = true;
	}
	var datas = {model:model, color:color, size:size,taste:taste,course:course, productId:productId,memberdiscount:memberdiscount};
	private_ajax("checkStock.do",datas,function(data) {
		var stock = data.split(";")[0];
		var price =data.split(";")[1];
		var productNo = data.split(";")[2];
		//如果根据规格查询没有对应的价格和库存，就拿基础设置的
		if(stock==null || stock=="" || stock=="null"){
			//stock=$("#productStock").val();
			stock = 0;
		}
		if(price==null || price=="" || price=="null"){
			price = $("#productPrice").val();
			
		}else{
			if(marketDiscount!=null && marketDiscount!="" && marketDiscount!="null" && typeof(marketDiscount) != "undefined"){//将根据规格尺寸查询出来的价格乘以折							
				if(parseFloat(price)>=parseFloat(fullAmount)){					
				   price= price*marketDiscount;
				}
			}
		}
		$("#selectStock").text(stock);
		var point = $("#DecimalPoint").val();
		//如果有设置仅需费用，价格按照仅需费用显示
		if(isExistPayYunFei){			
			$("#product_price").text(fmoney(Number(0.00)+fittingAmout,point));
		}else{
			$("#product_price").text(fmoney(Number(price)+fittingAmout,point));
		}
		$("#productNoId").val(productNo);
		$("#toBuyForm").find("input[name=amount]").val(price);
		stockNum = stock;
	});
	$("#message").html("剩余 <span id='selectStock'>"+stockNum+"</span>件</span>");
	//$("#message").show();
});


//选颜色
$(".clearbox .j-select-color>li").click(function(){
	//选择颜色显示对应的图片
	var colorCode = $(this).attr("colorCode");
	if(picList != null && picList !=''){
		var arr = eval(picList);
		if(arr != null && arr.length>0){
			for (var i = 0; i < arr.length; i++){
				if(arr[i].colorCode==colorCode){
					var purl = arr[i].url;
					$(".MagTargetImg").attr("src",purl);
					$("#img_"+colorCode).addClass("on");
				}else{
					$("#img_"+arr[i].colorCode).removeClass("on");
				}
			}
		}
	}
	var isExistPayYunFei = false;
	var size = $("#size_item").val();
	var color = $("#color_item").val();
	var model = $("#model_item").val();
	var taste = $("#taste_item").val();
	var course = $("#course_item").val();
	var productId = $("#productId").val();
	var fullAmount = $("#fullAmount").val();//满足打折的价格
	var marketDiscount = $("#marketDiscount").val();//满打折折扣
	var memberdiscount = $("#memberdiscount").val(); //会员折扣
	var payYunFei  = $("#payYunFei").val();//是否有设置了仅需费用，如果设置了就不进入根据规格尺寸的价格查询
	if(payYunFei!=null && payYunFei!="" && payYunFei!="null"&& typeof(payYunFei) != "undefined"){
		isExistPayYunFei = true;
	}
	var point = $("#DecimalPoint").val();
	var datas = {model:model, color:color, size:size,taste:taste,course:course, productId:productId,memberdiscount:memberdiscount,alone:point};
	private_ajax("checkStock.do", datas, function(data) {
		var stock = data.split(";")[0];
		var price =data.split(";")[1];
		//如果根据规格查询没有对应的价格和库存，就拿基础设置的
		var productNo = data.split(";")[2];

		if(stock==null || stock=="" || stock=="null"){
			//stock=$("#productStock").val();
			stock = 0 ;
		}
		if(price==null || price=="" || price=="null"){
			price = $("#productPrice").val();
		}else{
			if(marketDiscount!=null && marketDiscount!="" && marketDiscount!="null" && typeof(marketDiscount) != "undefined"){//将根据规格尺寸查询出来的价格乘以折扣							
				if(parseFloat(price)>=parseFloat(fullAmount)){				
				  price= price*marketDiscount;
				}
			}
		}
		$("#selectStock").text(stock);
		$("#productNoId").val(productNo);
		//如果有设置仅需费用，价格按照仅需费用显示
		if(isExistPayYunFei){			
			$("#product_price").text(fmoney(Number(0.00)+fittingAmout,point));
		}else{
			$("#product_price").text(fmoney(Number(price)+fittingAmout,point));
		}
		var amount  = fmoney(Number(price)+fittingAmout,point);
		$("#toBuyForm").find("input[name=amount]").val(amount.replace(",",""));
		stockNum = stock;
		if($("#p_productNo").size()>0){
			$("#p_productNo").html(productNo);
		}
		if(point != null && point=='0'){
			var productName = data.split(";")[3];
			$("#toBuyForm").find("input[name=productName]").val(productName);
			//$("#productColorId").val(color);
			var pName = $("#pNameId").text();
			var nameText = productName.replace(pName+" ","");
			$("#show_product_name").text(nameText);
			
		}
	});
	//$("#message").show();
	$("#message").html("剩余 <span id='selectStock'>"+stockNum+"</span>件</span>");
	
});
		
$(".clearbox .j-select-model>li").click(function() {
	var isExistPayYunFei = false;
	var size = $("#size_item").val();
	var color = $("#color_item").val();
	var model = $("#model_item").val();
	var taste = $("#taste_item").val();
	var course = $("#course_item").val();
	var productId = $("#productId").val();
	var fullAmount = $("#fullAmount").val();//满足打折的价格
	var marketDiscount = $("#marketDiscount").val();//满打折折扣
	var memberdiscount = $("#memberdiscount").val(); //会员折扣
	var payYunFei  = $("#payYunFei").val();//是否有设置了仅需费用，如果设置了就不进入根据规格尺寸的价格查询
	if(payYunFei!=null && payYunFei!="" && payYunFei!="null"&& typeof(payYunFei) != "undefined"){
		isExistPayYunFei = true;
	}
	var datas = {model:model, color:color, size:size,taste:taste,course:course, productId:productId,memberdiscount:memberdiscount};
	private_ajax("checkStock.do", datas, function(data) {
		var stock = data.split(";")[0];
		var price =data.split(";")[1];
		var productNo = data.split(";")[2];
		//如果根据规格查询没有对应的价格和库存，就那基础设置的
		if(stock==null || stock=="" || stock=="null"){
			//stock=$("#productStock").val();
			stock = 0;
		}
		if(price==null || price=="" || price=="null"){
			price = $("#productPrice").val();
		}else{
			if(marketDiscount!=null && marketDiscount!="" && marketDiscount!="null" && typeof(marketDiscount) != "undefined"){//将根据规格尺寸查询出来的价格乘以折扣		
				if(parseFloat(price)>=parseFloat(marketDiscount)){
				  price= price*marketDiscount;
				}
			}
		}
		$("#selectStock").text(stock);
		$("#productNoId").val(productNo);
		var point = $("#DecimalPoint").val();
		//如果有设置仅需费用，价格按照仅需费用显示
		if(isExistPayYunFei){			
			$("#product_price").text(fmoney(Number(0.00)+fittingAmout,point));
		}else{
			$("#product_price").text(fmoney(Number(price)+fittingAmout,point));
		}
		$("#toBuyForm").find("input[name=amount]").val(price);
		stockNum = stock;
	});
	$("#message").show();
	$("#message").html("剩余 <span id='selectStock'>"+stockNum+"</span>件</span>");	
});

$(".clearbox .j-select-taste>li").click(function() {
	var size = $("#size_item").val();
	var color = $("#color_item").val();
	var model = $("#model_item").val();
	var taste = $("#taste_item").val();
	var course = $("#course_item").val();
	var productId = $("#productId").val();
	var fullAmount = $("#fullAmount").val();//满足打折的价格
	var marketDiscount = $("#marketDiscount").val();//满打折折扣
	var memberdiscount = $("#memberdiscount").val(); //会员折扣
	var datas = {model:model, color:color, size:size,taste:taste,course:course, productId:productId,memberdiscount:memberdiscount};
	private_ajax("checkStock.do", datas, function(data) {
		var stock = data.split(";")[0];
		var price =data.split(";")[1];
		var productNo = data.split(";")[2];
		//如果根据规格查询没有对应的价格和库存，就那基础设置的
		if(stock==null || stock=="" || stock=="null"){
			//stock=$("#productStock").val();
			stock = 0;
		}
		if(price==null || price=="" || price=="null"){
			price = $("#productPrice").val();
		}else{
			if(marketDiscount!=null && marketDiscount!="" && marketDiscount!="null" && typeof(marketDiscount) != "undefined"){//将根据规格尺寸查询出来的价格乘以折扣		
				if(parseFloat(price)>=parseFloat(marketDiscount)){
				  price= price*marketDiscount;
				}
			}
		}
		$("#selectStock").text(stock);
		$("#productNoId").val(productNo);
		var point = $("#DecimalPoint").val();
		$("#product_price").text(fmoney(Number(price)+fittingAmout,point));
		$("#toBuyForm").find("input[name=amount]").val(price);
		stockNum = stock;
	});
	$("#message").show();
	$("#message").html("剩余 <span id='selectStock'>"+stockNum+"</span>件</span>");	
});

$(".clearbox .j-select-course>li").click(function() {
	var size = $("#size_item").val();
	var color = $("#color_item").val();
	var model = $("#model_item").val();
	var taste = $("#taste_item").val();
	var course = $("#course_item").val();
	var productId = $("#productId").val();
	var fullAmount = $("#fullAmount").val();//满足打折的价格
	var marketDiscount = $("#marketDiscount").val();//满打折折扣
	var memberdiscount = $("#memberdiscount").val(); //会员折扣
	var datas = {model:model, color:color, size:size,taste:taste,course:course, productId:productId,memberdiscount:memberdiscount};
	private_ajax("checkStock.do", datas, function(data) {
		var stock = data.split(";")[0];
		var price =data.split(";")[1];
		var productNo = data.split(";")[2];
		//如果根据规格查询没有对应的价格和库存，就那基础设置的
		if(stock==null || stock=="" || stock=="null"){
			//stock=$("#productStock").val();
			stock = 0;
		}
		if(price==null || price=="" || price=="null"){
			price = $("#productPrice").val();
		}else{
			if(marketDiscount!=null && marketDiscount!="" && marketDiscount!="null" && typeof(marketDiscount) != "undefined"){//将根据规格尺寸查询出来的价格乘以折扣		
				if(parseFloat(price)>=parseFloat(marketDiscount)){
				  price= price*marketDiscount;
				}
			}
		}
		$("#selectStock").text(stock);
		$("#productNoId").val(productNo);
		var point = $("#DecimalPoint").val();
		$("#product_price").text(fmoney(Number(price)+fittingAmout,point));
		$("#toBuyForm").find("input[name=amount]").val(price);
		stockNum = stock;
	});
	$("#message").show();
	$("#message").html("剩余 <span id='selectStock'>"+stockNum+"</span>件</span>");	
});

//库存
var stock;
if($("#sizeStr").val()>0 || $("#colorStr").val()>0 || $("#modelStr").val()>0 ){
	$("li").click(function(){
		$("#stock").val(stockNum);
		stock = $("#stock").val();
	});
}
stock = $("#stock").val();
//加入购物车
$("#addCart").click(function (event){
	var add = true;
	//判断是否有选择型号尺寸
	$(".choose_input").each(function() {
	  if($(this).val() == '') {
		var id = $(this).attr("id") + "_div";
		if($("#"+id).length > 0) {
			$("#"+id).addClass("unselect");
				add=false;
			}
		}
	});
	var quantity = parseInt($(".pro_detail_amount").find("input:text").val());
	if(stockNum != "" ) {
	   if(quantity > stockNum) {
		  $("#message").html("<span id='message' style='color:red'>库存不足</span>");
			add = false;
		  $("#message").addClass("show").removeClass("smghd");
		}
	}else if(add) {		//说明没有设置库存，就没必要检验库存，直接允许购买
	  $("#message").hide();			
	}
	var minNum = parseInt($("#min_num").val());
	var buyNum = parseInt($("#buyNum").val());
	if(minNum > buyNum){
		alert("亲，此商品"+minNum+"件起购哦");
		return;
	}
    if(add) {
	var productId = $("#toBuyForm").find("input[name=productId]").val();
	var productName = $.trim($("#toBuyForm").find("input[name=productName]").val());
	var size = $("#size_item").val();
	var color = $("#color_item").val();
	var model = $("#model_item").val();
	var goods_weight = $("#goods_weight").val();
	var payTaxes = $("#toBuyForm").find("input[name=payTaxes]").val();
	var amount = $.trim($("#toBuyForm").find("input[name=amount]").val());
	var taxrate = $.trim($("#toBuyForm").find("input[name=taxrate]").val());
	var costPrice = $.trim($("#toBuyForm").find("input[name=costPrice]").val());
	var addedValueTax = $.trim($("#toBuyForm").find("input[name=addedValueTax]").val());
	var consumptionTax = $.trim($("#toBuyForm").find("input[name=consumptionTax]").val()); 
	var payYunFei = $("#toBuyForm").find("input[name=payYunFei]").val();
	var url =$("#addCartUrl").val();
	var minPurchaseNum =$("#min_num").val();
	if(amount == "") {
		alert("该商品暂时不能购买，请选购其他商品！");
		return ;
	}
	var assembleStr="";
	if(fittingMap != null && !fittingMap.isEmpty()){
		var keyArry = fittingMap.keys();
		for (i = 0; i < keyArry.length; i++) {
			if(i ==0){
				assembleStr = keyArry[i]+"=="+fittingMap.get(keyArry[i]);
			}else{
				assembleStr += ";"+keyArry[i]+"=="+fittingMap.get(keyArry[i]);
			}
		}
	}
	var pic = $("#samllPicId").val();
	var supplierId =$("#supplierId").val();
	var productNo = $("#productNoId").val();
	var restrictionId = $("#restrictionId").val();
	var markPrice = $.trim($("#toBuyForm").find("input[name=martPrice]").val());
	var productRemark = $("#productRemarkId").val();
	var  membLogin = $("#membLoginId").val();
	var alone = $("#aloneId").val();
	if(quantity==null || quantity=='' ||isNaN(quantity)){
		quantity=1;
	}
	var datas = {
		productId:productId,
		assembleStr:assembleStr,
		productName:productName,
		size:size,
		color:color,
		model:model,
		quantity:quantity,
		amount:amount,
		pictureUrl:pic,
		stock:stockNum==""?-1:stockNum,
		goods_weight:goods_weight,
		payTaxes:payTaxes,
		minPurchaseNum:minPurchaseNum,
		supplierId:supplierId,
		productNo:productNo,
		product_taxrate:taxrate,
		markPrice:markPrice,
		productRemark:productRemark,
		costPrice:costPrice,
		addedValueTax:addedValueTax,
		consumptionTax:consumptionTax,
		memberLogin:membLogin,
		payYunFei:payYunFei,
		restrictionId:restrictionId,
		alone:alone
	};
	private_ajax(url, datas, function(data) {
		//还没登陆
		if(data=="login"){
			$(".login_popup").fadeIn();
			var h = document.body.scrollHeight;			
	        $("#b").fadeIn(); 
	        $("#b").css("height", h);
	        var h = $(window).height()/2;
			var w = $(window).width()/2;
		    var k = $(".login_popup").width();
			$(".login_popup").css({top:(h-$(".login_popup").height()/2)+'px',left:(w-k/2)+'px'});
	        $(".login_popup").css({position:"fixed"}); 	      
		}else if(data==='3'){
			upBox("prompt","不符合限购的时间条件 ！");
			 return; 
		 }else if(data=="4"){
			 upBox("prompt","您选购的商品不符合限购的条件,只能抢购"+limitBuyNumber+"件");
			 return;
		 }else if(data==='9'){
			 upBox("prompt","超过限制购买总次数！");
			 return; 
		}else if(data==='11'){
			upBox("prompt","超过该商品总购买量！");
			 return; 
		}else if(data==='12'){
			upBox("prompt","超出单次购买限量！");
			return; 
		}else{
			var array = data.split("_");	
			if(array[0]==="0"){
				$(".page-head .cart_right").html(data);
				var h = document.body.scrollHeight;
			    $("#b").fadeIn(); 
			    $("#b").css("height",h);
			    $("#carBox").css({position:"fixed"}); 
			    $("#carBox").fadeIn(1000);
			    if($("#tk_cartgoods_num")){
			    	$("#tk_cartgoods_num").show();
			    }
			}else
				upBox("prompt","您已领取过，需要再过"+array[1]+"天才能领取！");
		}
	 });
	}
});

//立即购买
$("#toBuy").click(function() {
	//宜家
	var isFamily = $("#isFamily").val();
	if(isFamily!=null && isFamily!= "" && isFamily=="1"){ //走宜家那套
		$("#popup_bg1").slideDown("fast");
	}else{  //普通产品立即购买
		toBuyNow();
	}
	
});

//宜家配送方式 1配送，，2自提
$(".sendType li").click(function(){
	var thisValue = $(this).attr("value");
	$("#sendType").val(thisValue); //宜家配送方式 1配送，，2自提
	if(thisValue==1){  //配送即立即购买
		toBuyNow();
		$("#popup_bg1").slideUp("fast");
	}
	if(thisValue==2){ // 自提显示门店
		$("#popup_bg1").slideUp("fast",function(){ 
		$("#popup_bg2").slideDown("slow");  			
			setTimeout(function(){   			 
			 $(".store_big_box").addClass("active");
				$(".jspContainer").addClass("active"); 
			     $(".scroll-pane").addClass("active");	
			     $("#close_btn_2").css("display","block");		
			},"slow");     			
		});
	}
})


//门店选择
$("#store_lsit li").click(function(){
	var thisValue = $(this).attr("value"); //门店ID
	var thisName  = $(this).find(".store_name").text(); //门店名称 
	var thisAddress = $(this).find(".store_address").text(); //，门店地址
	var thisPhone = $(this).find(".store_phone").text(); //门店电话
	$("#store_list li").find("p").removeClass("p_hover");
	$(this).find("p").addClass("p_hover");
	$("#streetId").val(thisValue);
	$("#street").val(thisAddress);
	$("#storePhone").val(thisPhone);
	$("#serviceStores").val(thisValue)
	toBuyNow();
})



//立即购买
function toBuyNow(){
	if(endTime!=null && endTime!="" ){
		if($("#payAppValue").val()<=0){
			 upBox("prompt","预售已经结束！");
			 return;
		 }
	}
	var add = true;
	var minNum = parseInt($("#min_num").val());
	var buyNum = parseInt($("#buyNum").val());
	
	$(".on").click();
	if(stock!=""){
			if(buyNum < minNum && parseInt(stock) > minNum && buyNum < parseInt(stock)){
				add=false;
				upBox("prompt","亲，此商品"+minNum+"件起购哦");
			}else if(buyNum<parseInt(stock) && buyNum < minNum){
				add=false;
				upBox("prompt","亲，此商品"+minNum+"件起购哦");
			}else if(buyNum==parseInt(stock) && buyNum<minNum){
				add=false;
				upBox("prompt","亲，此商品"+minNum+"件起购哦");
			}
	}else{
		if(buyNum < minNum){
			add=false;
			upBox("prompt","亲，此商品"+minNum+"件起购哦");
		}
	}
	$(".choose_input").each(function() {
		if($(this).val() == '') {
			var id = $(this).attr("id") + "_div";
			if($("#"+id).length > 0) {
				$("#"+id).addClass("unselect");
				add = false;
			}
		}
	});
	var quantity = parseInt($(".pro_detail_amount").find("input:text").val());
	if(quantity==null || quantity=='' ||isNaN(quantity)){
		quantity=1;
	}
	if(stockNum != "") {//说明没有设置库存，就没必要检验库存，直接允许购买
		if(quantity > stockNum) {	
			$("#message").html("<span id='message' style='color:red'>库存不足</span>");
			add = false;
		}
	}else if(add) {
		$("#message").hide();
	}
		
if(add) {
	var productId = $("#toBuyForm").find("input[name=productId]").val();
	var productName = $.trim($("#toBuyForm").find("input[name=productName]").val());
	var size = $("#size_item").val();
	var color = $("#color_item").val();
	var model = $("#model_item").val();
	var amount = $.trim($("#toBuyForm").find("input[name=amount]").val());
	var pic = $("#samllPicId").val();
	$("#picId").val(pic);
	//var quantity = parseInt($(".pro_detail_amount").find("input:text").val());
	$("#quantityId").val(quantity);
	if(amount == ""|| parseInt(amount)<0) {
		alert("该商品暂时不能购买，请选购其他商品！");
		return ;
	}
	
	var restrictionId = $("#restrictionId").val();
	var alone= $("#aloneId").val();
	//判断是否符合限购条件
	var datas ={quantity:quantity,productId:productId,alone:alone,restrictionId:restrictionId};
	private_ajax("judgeLimitBuy.do", datas, function(data) {	
		 if(data=="login"){
				$(".login_popup").fadeIn();
				var h = document.body.scrollHeight;			
		        $("#b").fadeIn(); 
		        $("#b").css("height", h);
		        var h = $(window).height()/2;
				var w = $(window).width()/2;
			    var k = $(".login_popup").width();
				$(".login_popup").css({top:(h-$(".login_popup").height()/2)+'px',left:(w-k/2)+'px'});
		        $(".login_popup").css({position:"fixed"}); 	      
		 }else if(data=="3"){
			 upBox("prompt","不符合限购的时间条件 ！");
			 return; 
		 }else if(data=="4"){
			 var limitBuyNumber = $("#limitBuyNumber").val();
			 upBox("prompt","您选购的商品不符合限购的条件,只能抢购"+limitBuyNumber+"件");
			 return;
		 }else if(data == "2"){
			 upBox("prompt","您已购买过该抢购商品,已经超过限购数量，无法购买");
			 return; 
		 }else if(data == "0"){		
			 $("#toBuyForm").submit();				
		 }else if(data==='9'){
			 upBox("prompt","超过限制购买总次数！");
			 return; 
		}else if(data==='11'){
			upBox("prompt","超过该商品总购买量！");
			 return; 
		}else{
			var array = data.split("_");		
			upBox("prompt","您已领取过，需要再过"+array[1]+"天才能领取！");
		}
	});				
 }
}


//秒杀，与立即购买一样
$("#seckill").click(function() {
	if($("#payAppValue").val()<=0){
		 upBox("prompt","预售已经结束！");
		 return;
	 }
	
	var add = true;
	$(".choose_input").each(function() {
		if($(this).val() == '') {
			var id = $(this).attr("id") + "_div";
			if($("#"+id).length > 0) {
				$("#"+id).addClass("unselect");
				add = false;
			}
		}
	});
	var quantity = parseInt($(".pro_detail_amount").find("input:text").val());
	if(stockNum != "") {//说明没有设置库存，就没必要检验库存，直接允许购买
		if(quantity > stockNum) {	
			$("#message").html("<span id='message' style='color:red'>库存不足</span>");
			add = false;
		}
	}else if(add) {
		$("#message").hide();
	}
	
if(add) {
	var productId = $("#toBuyForm").find("input[name=productId]").val();
	var productName = $.trim($("#toBuyForm").find("input[name=productName]").val());
	var size = $("#size_item").val();
	var color = $("#color_item").val();
	var model = $("#model_item").val();
	var amount = $.trim($("#toBuyForm").find("input[name=amount]").val());
	var pic = $("#samllPicId").val();
	var limitBuyNumber = $("#limitBuyNumber").val();
	$("#picId").val(pic);
	var quantity = parseInt($(".pro_detail_amount").find("input:text").val());
	$("#quantityId").val(quantity);
	if(amount == ""|| parseInt(amount)<0) {
		upBox("该商品暂时不能购买，请选购其他商品！");
		return ;
	}
	var restrictionId = $("#restrictionId").val();
	var alone= $("#aloneId").val();
	//判断是否符合限购条件
	var datas ={quantity:quantity,productId:productId,alone:alone,restrictionId:restrictionId};
	private_ajax("judgeLimitBuy.do", datas, function(data) {	
		 if(data=="login"){
				$(".login_popup").fadeIn();
				var h = document.body.scrollHeight;			
		        $("#b").fadeIn(); 
		        $("#b").css("height", h);
		        var h = $(window).height()/2;
				var w = $(window).width()/2;
			    var k = $(".login_popup").width();
				$(".login_popup").css({top:(h-$(".login_popup").height()/2)+'px',left:(w-k/2)+'px'});
		        $(".login_popup").css({position:"fixed"}); 	      
		 }else if(data=="3"){
			 upBox("prompt","不符合限购的时间条件 ！");
			 return; 
		 }else if(data=="4"){
			 upBox("prompt","您选购的商品不符合限购的条件,只能抢购"+limitBuyNumber+"件");
			 return;
		 }else if(data == "2"){
			 upBox("prompt","您已购买过该抢购商品,已经超过限购数量，无法购买");
			 return; 
		 }else if(data == "0"){		
			 $("#toBuyForm").submit();				
		 }else if(data==='9'){
			 upBox("prompt","超过限制购买总次数！");
			 return; 
		}else if(data==='11'){
			upBox("prompt","超过该商品总购买量！");
			 return; 
		}else{
			var array = data.split("_");
			upBox("prompt","您已领取过，需要再过"+array[1]+"天才能领取！");
		}
	});	
   }
});



//宜家产品购买
$("#toBuyFamily").click(function() {	
	var streetName = $("#btn_select_street").find("span").text();
	if(streetName=="" || streetName=="请选择街道"){
		upBox("prompt","请先选择街道");
		return;
	}
	
	var communityName = $("#btn_select_community").find("span").text();
	if(communityName=="" || communityName=="请选择社区"){
		upBox("prompt","请先选择社区");
		return;
	}
	
	var add = true;
	var minNum = parseInt($("#min_num").val());
	var buyNum = parseInt($("#buyNum").val());
	
	$(".on").click();
	
	$(".choose_input").each(function() {
		if($(this).val() == '') {
			var id = $(this).attr("id") + "_div";
			if($("#"+id).length > 0) {
				$("#"+id).addClass("unselect");
				add = false;
			}
		}
	});
	var quantity = parseInt($(".pro_detail_amount").find("input:text").val());
	stockNum = Number($("#selectStock").text()); //宜家要选择街道才显示库存，要重新拿值
		if(quantity > stockNum) {	
			$("#message").html("<span id='message' style='color:red'>库存不足</span>");
			add = false;
		}
	
if(add) {
	var productId = $("#toBuyForm").find("input[name=productId]").val();
	var productName = $.trim($("#toBuyForm").find("input[name=productName]").val());
	var size = $("#size_item").val();
	var color = $("#color_item").val();
	var model = $("#model_item").val();
	var amount = $.trim($("#toBuyForm").find("input[name=amount]").val());
	var pic = $("#samllPicId").val();
	$("#picId").val(pic);
	var quantity = parseInt($(".pro_detail_amount").find("input:text").val());
	$("#quantityId").val(quantity);
	if(amount == ""|| parseInt(amount)<0) {
		alert("该商品暂时不能购买，请选购其他商品！");
		return ;
	}
	
	$("#toBuyForm").submit();
	//window.location.href="toBuy.do?productId="+productId+"&productName="+productName+"&size="+size+"&color="+color+"&model="+model+"&quantity="+quantity+"&amount="+amount+"&pic="+pic+"&productAttr=0";				
	 }
});

			
$("#keepOn").click(function() {
	 $("#b").fadeOut();
	 $("#carBox").fadeOut(500);
});
	
//清空已选
$(".choose_input").each(function() {
	$(this).val("");
});
$(".count_box .num").val("1");		
			

//点击商品评价
$("#comment").click(function(){
	//查询全部评论
	var productId = $("#productId").val();
	var score = 0;
	var datas = {productId:productId, score:score};
	total = $("#total").val();//初始化总记录数
	private_ajax("getProductComment\/1.do", datas, function(data) {
		buildComentDiv(data);
	});			
 });		
});	

//获取各等级评价(显示第一页)
function getCommentByScore(score,count) {
    commentScore = score;	//将当前的评价等级记住
    total = count;
	var productId = $("#productId").val();
	var datas = {productId:productId,score:score};
	if(score == '0') {
		private_ajax("getProductComment\/1.do", datas, function(data) {
			buildComentDiv(data);
		});	
	}else{
		private_ajax("getProductCommentByScore\/1.do", datas, function(data) {
			buildComentDiv(data);
		});
	}
}

//获取各等级分页数据（点击上一页)
function pagePrev() {
	var productId = $("#productId").val();
	var score = commentScore;
	var page = currentPage - 1;
	if(parseInt(currentPage) < (parseInt(total)/10)) {
		var datas = {productId:productId, score:score};
		private_ajax("getProductCommentByScore\/"+page+".do", datas, function(data) {
			buildComentDiv(data);
		});
	}
}

//获取各等级分页数据（点击下一页)
function pageNext() {
	var productId = $("#productId").val();
	var score = commentScore;
	var page = currentPage + 1;
	if(parseInt(currentPage)<(parseInt(total)/10)) {
		var datas = {productId:productId, score:score};
		private_ajax("getProductCommentByScore\/"+page+".do", datas, function(data) {
			buildComentDiv(data);
		});
	}
}

function buildComentDiv(json){
	var obj = eval("("+json+")");
	var str = "";
	if($.isEmptyObject(obj)){
		    str+="<li>"
		    str+="<div class='m_appraise_con_l'>"
		    str+="<p>还没有评论哦，亲</p>"
		    str+="<div class='m_appraise_img'>"
		    str+="";
		    str+="</div>"
		    str+="<div class='m_appraise_time'></div>";
		    str+="</div>";
		    str+="<div class='m_appraise_con_r'>"
		    str+="<span class='m_appraise_user'></span>"
		    str+="<span class='m_user_star'></span>"
		    str+="<span class='m_user_mobile'></span>"
		    str+="</div></li>"; 
	}
	$.each(obj, function(index,value){
		str+="<li>"
	    str+="<div class='m_appraise_con_l'>"
	    str+="<p><label>精华评价</label>"+value.commentContent+"</p>"
	    str+="<div class='m_appraise_img'>"
	    str+="";
	    str+="</div>"
	    str+="<div class='m_appraise_time'>"+value.createTime+"</div>";
	    str+="</div>";
	    str+="<div class='m_appraise_con_r'>"
	    str+="<span class='m_appraise_user'>"+value.memberName+"</span>"
	    str+="<span class='m_user_star'>★★★★★</span>"
	    if(value.commentMode ==1){
	    	str+="<span class='m_user_mobile'>匿名评论</span>"
	    }else{
	    	str+="<span class='m_user_mobile'>"+value.memberName+"</span>"
	    }
	    str+="</div></li>";
	});
	$("#m_appraise_con").html(str);
}

//检查限购的产品是否能购买，不能购买将加入购物车和立即领取按钮置为灰色
function checkProductRestriction(){
	var productId = $("#toBuyForm").find("input[name=productId]").val();
	var restrictionId = $("#restrictionId").val();
	var alone= $("#aloneId").val();
	var quantity = parseInt($(".pro_detail_amount").find("input:text").val());
	if(quantity==null || quantity=='' ||isNaN(quantity)){
		quantity=1;
	}
	//判断是否符合限购条件
	var datas ={quantity:quantity,productId:productId,alone:alone,restrictionId:restrictionId};
	private_ajax("judgeLimitBuy.do", datas, function(data) {
		if(data==='login'){
			return;
		}else{
			if(data==='9' || data==='11' || data.indexOf("_")>0){				
				$("#addCart").css("background","#C2B6B4");
				$("#toBuy").css("background","#C2B6B4");
				$("#toBuy").css("color","#fff");			
			}
		}
	});	
}



