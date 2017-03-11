
    function getByClass(oParent, sClass) {
        var aEle = oParent.getElementsByTagName('*');
        var aTmp = [];
        var i = 0;
        for (i = 0; i < aEle.length; i++) {
            if (aEle[i].className == sClass) {
                aTmp.push(aEle[i]);
            }
        }
        return aTmp;
    }

$(window).ready(function () {
    //几F
    var oCategoryf = getByClass(document, "categoryf");
    for (var i = 0; i < oCategoryf.length; i++) {
        oCategoryf[i].innerHTML = (i + 1 + "F");
    }

    $(".conlistProduct ").each(function () {
        var oIndex = $(this);
        oIndex.find('.conlist dl dd:first').attr('class', 'block');
        oIndex.find('.conlist dl dt:first').attr('class', 'none');
        var indexId = $(this).attr("id");
        $("#" + indexId + "_con").find("dl").mouseover(function () {
            $(this).parent().find('dl dd').attr('class', '');
            $(this).parent().find('dl dt').attr('class', '');
            $(this).find("dd").attr('class', 'block');
            $(this).find("dd i").text($(this).index() + 1);
            $(this).find("dt").attr('class', 'none');
        })
    });
    $(".ch_pro").each(function () {
        var oThisIndex = $(this);
        var thisId = $(this).attr("id");
        var oCH_list = $(this).find($(".ch_list"));
        var aLi = oCH_list.find("li");
        var oCH_listId = $("#" + thisId + "_con");
        var aUlBtn = $("#" + thisId + "_btn");
        var Oa = aLi.find('a');

        var aImg = $("#" + thisId + "_con li");
        var iSize = aImg.size();

        var oprve = oThisIndex.find(".lll");
        var onext = oThisIndex.find(".rrr");

        if (aLi.length == 1) {
            oprve.css({display: 'none'});
            onext.css({display: 'none'});
            aUlBtn.css({display: 'none'});
        }

        var index = 0;		//切换索引
        var timer;
        var interval = 3000;
        for (var i = 0; i < aLi.length; i++) {
            var aBtnLi = document.createElement("li");
            aBtnLi.innerHTML = (i + 1);
            aUlBtn.append(aBtnLi);
        }
        aUlBtn.find('li:first').addClass('on');
        oCH_listId.find('li:first').css({opacity: '100'});


        var aPage = $("#" + thisId + "_btn li");
        oprve.on('click', function () {		//左边按钮点击
            index--;
            if (index < 0) {
                index = iSize - 1
            }
            change();
        });
        onext.on('click', function () {    //右边按钮点击
            index++;
            if (index > iSize - 1) {
                index = 0
            }

            change();
        });


        function change() {
            aPage.removeClass('on');
            aPage.eq(index).addClass('on');
            aImg.stop();
            aImg.eq(index).siblings().animate({
                opacity: 0
            }, 1500)
            aImg.eq(index).animate({
                opacity: 1
            }, 1500)
        }

        function play() {
            timer = setTimeout(function () {
                onext.trigger('click');
                play();
            }, interval);
        }

        function stop() {
            clearTimeout(timer);
        }

        //分页按钮点击
        aPage.click(function () {
            index = $(this).index();
            change();
        });

        oThisIndex.hover(stop, play);
        play();
    });


    //选项卡
    var thisId = ($(".ch_tl").attr('id'));
    $('.clo_tea_tab_right').find(".ch_con:first").css({display: 'block'});
    $('.ch_tl').find("li:first").attr('class', 'on');
    $('.clo_tea_tab_right').find(".ch_tl").find("li").click(function () {
        var index = $(this).index();
        var thisList = $(this).parent().find("li");
        var thisId = $(this).parent().attr("id");

        thisList.attr('class', '');
        $("#" + thisId + "_con").find(".ch_con").css('display', 'none');

        $(this).attr('class', 'on');
        $("#" + thisId + "_con").find(".ch_con").eq(index).fadeIn("slow");

    });


    $(".pro ul li img").mouseenter(function () {
        $(this).stop(false, false).animate({marginLeft: '-10px'});
    });
    $(".pro ul li img").mouseout(function () {
        $(this).stop(false, false).animate({marginLeft: '0px'});
    });

//三列2行（茶多多）
    $('input[name=categoryPid]').each(function () {
        var aThis = $(this);
        var categoryPid = $(this).val();
        var datas = {"categoryPid": categoryPid};
        var str = "";
        private_ajax2("http://www.tomyniki.com/8af4f97851286013015128b2cb010000/getMallCategoryByPid.do", datas, function (data) {
            var mallCategoryData = eval("(" + data + ")");
            $.each(mallCategoryData, function (index, value) {
                if (categoryPid == value.pid) {
                    str += "<li>"
                    str += "<a href='http://www.tomyniki.com/8af4f97851286013015128b2cb010000/getProductList/1.do?mallId=" + value.productId + "&categoryname=" + value.name + "&parentId=" + value.id + "' target='_blank'>" + value.name + "<\/a>";
                    str += "<\/li>";
                    aThis.next("ul").html(str);
                }
            });
        });
    });

    var oSlide = $(".page-slide").css('height');
    //$(".all-sort-list").css({height:oSlide});
    $("#absoultDraw").click(function () {
        var drawId = $(this).find("input").val();
        var datas = {drawId: drawId};
        private_ajax2("http://www.tomyniki.com/8af4f97851286013015128b2cb010000/drawInfo.do", datas, function (data) {
            $(".drawBox").fadeIn();
            $(".drawBox").html(data);
            showForm();
            var h = $(window).height() / 2;
            var w = $(window).width() / 2;
            $("#login_popup").fadeIn();
            $(".login_popup").css({position: 'absolute'});
            $(".login_popup").css({
                top: (h - $(".login_popup").height() / 2) + 'px',
                left: (w - $(".login_popup").width()) + 'px'
            });
        });
    });
    changeImg(".new_product_adv", ".new_product_img");
    function changeImg(objId, imgId) {
        var smallimgSrc;
        var largeimgSrc;
        var smallObj = $(imgId);
        var largeObj = $(objId);
        var index;
        smallObj.find("li").mousemove(function (e) {
            index = $(this).index();
            smallimgSrc = $(this).find("img").attr("data-url");
            largeimgSrc = smallimgSrc;
            largeObj.find("li").eq(index).find("img").attr("src", largeimgSrc).end().fadeIn().siblings("li").fadeOut();

        });
    }

    var url = window.location.href;//  location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.split("?")[1];
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    var memberKey = theRequest["key"];
    if (memberKey != null && memberKey != '') {//通过接口返回的key自动登录
        var datas = {key: memberKey};
        private_ajax2("http://www.tomyniki.com/8af4f97851286013015128b2cb010000/keyLogin.do", datas, function (data) {
            if (data == '1') {
                $("#exit_span").show();
                $("#currentMember").html(data);
                $("#login_span").hide();
                $("#register_span").hide();
            }
        });
    }
});

uParse('#content', {rootPath: 'http://www.tomyniki.com//ueditor/'});




    $(function () {
        var houseSize = '4';
        for (var size = 0; size < houseSize; size++) {
            var id = $("#house_item_" + size).val();
            var alig = $("#house_item_" + size).attr("alig");
            if (alig === 'fr') {
                houseLoop("#tk_house_item" + id, null, "#tk_house_arrow" + id);
            } else
                houseLoop("#tk_house_item" + id, "#tk_house_arrow" + id, null);
        }
        window.onresize = function () {
            for (var size = 0; size < houseSize; size++) {
                var id = $("#house_item_" + size).val();
                var alig = $("#house_item_" + size).attr("alig");
                if (alig === 'fr') {
                    reSizeHouseLoop("#tk_house_item" + id, null, "#tk_house_arrow" + id);
                } else
                    reSizeHouseLoop("#tk_house_item" + id, "#tk_house_arrow" + id, null);
            }
        }
    })

function houseLoop(parentId, arrowRId, arrowLId) {
    var _index = 0;
    var _src;
    var imgBox;
    var parentBox;
    var houseContainer;
    var houseContainerWidth;
    var houseItem;
    var arrowRObj;
    var arrowLObj;
    var length;
    var width;
    imgBox = $(".tk_house_img");
    parentBox = $(parentId);
    houseContainer = parentBox.find($(".tk_house_container"));
    houseItem = parentBox.find($(".tk_house_item"));
    createItem();
    width = imgBox.width();//houseItem的宽度
    length = houseContainer.children(houseItem).length;
    houseContainerWidth = length * width;//获取容器的总宽度
    houseContainer.width(houseContainerWidth);//设置容器的宽度
    //重新设置houseItem的宽度
    houseContainer.children(houseItem).width(imgBox.width());

    arrowR($(arrowRId));
    arrowL($(arrowLId));

    //点击事件
    function arrowR(arrowRObj) {
        arrowRObj.click(function (e) {
            _index++;
            if (_index > length - 1) {
                _index = 1;
                houseContainer.css({left: 0});
            }
            houseContainer.stop().animate({left: -(_index) * width})
        });
    }

    function arrowL(arrowLObj) {
        arrowLObj.click(function (e) {
            _index--;

            if (_index < 0) {
                _index = length - 2;
                houseContainer.css({left: -(length - 1) * width});
            }
            houseContainer.stop().animate({left: -(_index) * width})
        })
    }

    function createItem() {
        _src = houseItem.eq(0).find("img").attr("src");
        var ItemHtml = $("<div></div>")
        ItemHtml.addClass("tk_house_item");
        var img = $("<img/>");
        img.appendTo(ItemHtml);
        img.attr("src", _src);
        ItemHtml.appendTo(houseContainer);
    }
}

function reSizeHouseLoop(parentId, arrowRId, arrowLId) {
    var _index = 0;
    var imgBox;
    var parentBox;
    var houseContainer;
    var houseContainerWidth;
    var houseItem;
    var length;
    var width;
    imgBox = $(".tk_house_img");
    parentBox = $(parentId);
    houseContainer = parentBox.find($(".tk_house_container"));
    houseItem = parentBox.find($(".tk_house_item"));
    length = houseContainer.children(houseItem).length;
    width = imgBox.width();//houseItem的宽度
    houseContainerWidth = length * width;//获取容器的总宽度
    houseContainer.width(houseContainerWidth);//设置容器的宽度
    //重新设置houseItem的宽度
    houseContainer.children(houseItem).width(imgBox.width());

    arrowR($(arrowRId));
    arrowL($(arrowLId));

    //点击事件
    function arrowR(arrowRObj) {

        arrowRObj.click(function (e) {

            _index++;
            if (_index > length - 1) {
                _index = 1;
                houseContainer.css({left: 0});
            }
            houseContainer.stop().animate({left: -(_index) * width})
        });
    }

    function arrowL(arrowLObj) {

        arrowLObj.click(function (e) {
            _index--;
            if (_index < 0) {
                _index = length - 2;
                houseContainer.css({left: -(length - 1) * width});
            }
            houseContainer.stop().animate({left: -(_index) * width})
        })
    }
}
