$(function(){
	goTopEx();
	new SellerScroll();
});

function getByClass(oParent, sClass)
{
	var aEle=oParent.getElementsByTagName('*');
	var aTmp=[];
	var i=0;
	for(i=0;i<aEle.length;i++)
	{
		if(aEle[i].className==sClass)
		{
			aTmp.push(aEle[i]);
		}
	}
	return aTmp;
}


/*window.onload=function(){
	var ff = new SellerScroll();
	goTopEx();
	var arr = [];
	var zIndex = 1;	
	var oUl = document.getElementById('product_list');
	var aLi = oUl.getElementsByTagName('li');
	var aDiv = oUl.getElementsByTagName('product_img');
	var aImg = oUl.getElementsByTagName('img');
	var aText = oUl.getElementsByTagName('product_txt');
	var aProduct = getByClass(oUl,"product_add");
	//中心放大
	for (var i=0; i<aImg.length; i++) {
		arr.push( {marginLeft: aImg[i].style.marginLeft, marginTop: aImg[i].style.marginTop} );
	}
	for (var i=0; i<aLi.length; i++) {		
		aLi[i].index = i;
		aImg[i].style.margin = '0px';
		$(aImg[i]).css({zIndex:'0'});		
		$(aLi[i]).hover(function(){
			$(this).addClass("active");
			   //$(".product_btnW").eq([this.index]).stop(false,false).animate({width:"216"},400);
			    $(".product_add").eq([this.index]).animate({bottom:"0"},200);		   
				$(aImg[this.index]).stop(false,false).animate({
					width :'200',
					height : '200',
					marginLeft : arr[this.index].marginLeft - 20,
					marginTop : arr[this.index].marginTop - 20	
				},400);
				
		},function(){	
			$(this).removeClass("active");
			//$(".product_btnW").eq([this.index]).stop(false,false).animate({width:"124"},400);
			$(".product_add").stop(false,false).animate({bottom:"-20"},200);					
			$(aImg[this.index]).stop(false,false).animate({
				width :'160',
				height : '160',
				marginLeft : arr[this.index].marginLeft,
				marginTop : arr[this.index].marginTop 
			},400);
			    $(aDiv[i]).css({position:'relative'});				
		});	
     }
}*/


//回顶部
function goTopEx() { 	
	var obj = document.getElementById("top");
	if(obj){
		$("#top").fadeIn("1000");
	    timer1=setInterval(function(){
	    	$("#top").fadeOut("1000");
		},1000);
		function getScrollTop() { 
		   return document.documentElement.scrollTop + document.body.scrollTop; 
		} 
		function setScrollTop(value) { 
			if (document.documentElement.scrollTop) { 
			document.documentElement.scrollTop = value; 
			} else { 
			document.body.scrollTop = value; 
			} 
		} 
		window.onscroll = function() { 
			clearInterval(timer1);
		    getScrollTop() > 0 ? obj.style.display = "": obj.style.display = "none"; 
		} 
		obj.onclick = function() { 
		var goTop = setInterval(scrollMove, 10); 
		function scrollMove() { 
			setScrollTop(getScrollTop() / 1.1); 
			if (getScrollTop() < 1) clearInterval(goTop); 
		} 
	  } 
	}
} 

var SellerScroll = function(options){
	this.SetOptions(options);
	this.lButton = this.options.lButton;
	this.rButton = this.options.rButton;
	this.oList = this.options.oList;
	this.showSum = this.options.showSum;
	
	this.iList = $("#" + this.options.oList + " > li");
	this.iListSum = this.iList.length;
	this.iListWidth = this.iList.outerWidth(true);
	this.moveWidth = this.iListWidth * this.showSum;
	
	this.dividers = Math.ceil(this.iListSum / this.showSum);	//共分为多少块
	this.moveMaxOffset = (this.dividers - 1) * this.moveWidth;
	this.LeftScroll();
	this.RightScroll();
};
SellerScroll.prototype = {
		SetOptions: function(options){
			this.options = {
				lButton: "left",
				rButton: "right",
				oList: "carousel_ul",
				showSum: 5	//一次滚动多少个items
			};
			$.extend(this.options, options || {});
		},
		ReturnLeft: function(){
			return isNaN(parseInt($("#" + this.oList).css("left"))) ? 0 : parseInt($("#" + this.oList).css("left"));
		},
		LeftScroll: function(){
			if(this.dividers == 1) return;
			var _this = this, currentOffset;
			$("#" + this.lButton).click(function(){
				currentOffset = _this.ReturnLeft();
				if(currentOffset == 0){
					for(var i = 1; i <= _this.showSum; i++){
						$(_this.iList[_this.iListSum - i]).prependTo($("#" + _this.oList));
					}
					$("#" + _this.oList).css({ left: -_this.moveWidth });
					$("#" + _this.oList + ":not(:animated)").animate( { left: "+=" + _this.moveWidth }, { duration: "slow", complete: function(){
						for(var j = _this.showSum + 1; j <= _this.iListSum; j++){
							$(_this.iList[_this.iListSum - j]).prependTo($("#" + _this.oList));
						}
						$("#" + _this.oList).css({ left: -_this.moveWidth * (_this.dividers - 1) });
					} } );
				}else{
					$("#" + _this.oList + ":not(:animated)").animate( { left: "+=" + _this.moveWidth }, "slow" );
				}
			});
		},
		RightScroll: function(){
			if(this.dividers == 1) return;
			var _this = this, currentOffset;
			$("#" + this.rButton).click(function(){
				currentOffset = _this.ReturnLeft();
				if(Math.abs(currentOffset) >= _this.moveMaxOffset){
					for(var i = 0; i < _this.showSum; i++){
						$(_this.iList[i]).appendTo($("#" + _this.oList));
					}
					$("#" + _this.oList).css({ left: -_this.moveWidth * (_this.dividers - 2) });
					
					$("#" + _this.oList + ":not(:animated)").animate( { left: "-=" + _this.moveWidth }, { duration: "slow", complete: function(){
						for(var j = _this.showSum; j < _this.iListSum; j++){
							$(_this.iList[j]).appendTo($("#" + _this.oList));
						}
						$("#" + _this.oList).css({ left: 0 });
					} } );
				}else{
					$("#" + _this.oList + ":not(:animated)").animate( { left: "-=" + _this.moveWidth }, "slow" );
				}
			});
		}
	};


function setSB(v, el) {
    var ie5 = (document.all  &&  document.getElementsByTagName);
    if (ie5 || document.readyState == "complete")     {
      filterEl = el.children[0];
      valueEl = el.children[1];
      filterEl.style.width = v + "%";
     /* valueEl.innerText = v + "%";*/
    }
  }
  function fakeProgress(v, el) {
    if (v < 100)
   setSB(v, el);
    window.setTimeout("fakeProgress(" + (++v) + ", document.all['" + el.id + "'])", 10);

  }  
		
		
  

		
		
		
		