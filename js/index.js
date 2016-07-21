// 公用函数：
// ajax方法；
// 元素注册事件的兼容；
// 判断element有无className,增加、删除className；
// 设置cookie、获取cookie值、删除cookie；
// 通过class获取节点；
// addLoadEvent函数，把多个javascript函数绑定到onload事件。

// ajax方法
function ajax(url,data,method,success,error){ 
    var req = new XMLHttpRequest(),
        resA = '',
        data = data || {},
        method = method || 'get',
        success = success || function(){},
        error =  error || function (f){ alert(url+'发生错误！')};
    req.onreadystatechange = function(){
        if (req.readyState == 4){
            if (req.status  >= 200 && req.status < 300 || req.status == 304){
              success && success(req.responseText);
            } else {
                error && error(req.status);
              }                   
        }
    };
    if(data){
        var res = [];
        for(var i in data){
            res.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
        }
        resA = res.join('&');
    }
    if(method === 'get'){
        if (data){
            url += '?' + resA;
        } 
        req.open(method,url,true);      
        req.send(null);
    }
    if(method === 'post') {
        req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        req.open(method,url,true);
        req.send(resA);
    }      
}
// 元素注册事件的兼容（IE8.0及其以下版本使用ele.attachEvent）
function addFuc(ele, event, listener){
    if (ele.addEventListener){
        ele.addEventListener(event, listener, false);
    } else if (ele.attachEvent){
          ele.attachEvent("on"+event, listener);
      } else {
            ele["on"+event] = listener;
        }
}
// 判断element是否有className
function hasClass(ele, className){
    var list = ele.className.split(/\s+/);
    for (var i = 0; i < list.length; i++){
        if (list[i] == className){
            return true;
        }
    }
    return false;
}
// 为element增加一个className
function addClass(ele, className){
    var list = ele.className.split(/\s+/);
    if (!list[0]){
        ele.className = className;
    } else {
        ele.className += ' ' + className;
    }
};
// 删除element中的className
function removeClass(ele, className){
    var list = ele.className.split(/\s+/);
    if (!list[0]) return;
    for (var i = 0; i < list.length; i++){
        if (list[i] == className){
            list.splice(i, 1);
            ele.className = list.join(' ');
        }
    }
};
// 设置cookie
function setCookie(name, value, days){
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    var exp = new Date();
    exp.setTime(exp.getTime() + days*24*60*60*1000);
    cookie += '; expires=' + exp.toGMTString();
    document.cookie = cookie;
}
// 获取cookie值
function getCookie() {
    var cookie = {};
    var all = document.cookie;
    if (all === '') return cookie;
    var list = all.split(';');
    for (var i = 0; i < list.length; i++){
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}
// 删除cookie
function removeCookie (name) {  
  setCookie(name,'',-1); 
}
//通过class获取节点(IE8以下浏览器兼容方法)
function getElementsByClassName(className){ 
    var classArr = [];
    var tags = document.getElementsByTagName('*');
    for(var i=0; i<tags.length; i++){ 
        if(tags[i].nodeType == 1){ 
            if(tags[i].getAttribute('class') == className){ 
                classArr.push(tags[i]);
            }
        }
    }
    return classArr; 
}
// addLoadEvent函数，把多个javascript函数绑定到onload事件
function addLoadEvent(func){
    var oldonload = window.onload;
    if (typeof window.onload != 'function'){
        window.onload = func;
    } else {
          window.onload = function(){
          oldonload();
          func();
          }
     }
}


//顶部通知条:
//隐藏顶部通知条；
//加载页面前检查cookie。

//添加closeTips点击事件，并检查cookie
function closeTips(){
    var closeTips = document.getElementById("closeTips");  
    addFuc(closeTips,"click",function(){
    var topTips = document.getElementById("topTips");
    topTips.style.display = "none";
    setCookie("tipsCookie","tipsCookieValue",30);
    });
}
addLoadEvent(closeTips);
//加载页面前检查cookie
function checkCookie(){
    if (getCookie().tipsCookie) {
        var topTips = document.getElementById("topTips");
        topTips.style.display = "none";
    }
    if ((getCookie().loginSuc) &&(getCookie().followSuc)){
        hideFollow();
        showFollowSuc();
    }
}
addFuc(window,"unbeforeunload",checkCookie());

 
//头部:
//关注与登陆弹框。
function userLogin(){
    var follow = document.getElementById("follow");
    addFuc(follow,"click",function(){ //为关注按钮添加点击事件
        if (!getCookie().loginSuc) {
            //若未设置cookie则弹出登录框            
            document.getElementById("mask").style.display = "block";
            document.getElementById("login").style.display = "block";
            var closeLogin = document.getElementById("closeLogin");
            addFuc(closeLogin,"click",function(){// 为关闭按钮添加点击事件，点击后关闭登陆弹窗
                closeLoginForm();
            });            
            var loginButton = document.getElementById("loginButton");
            addFuc(loginButton,"click",function(){// 为登陆弹窗里的登陆按钮添加点击事件，并做表单验证,
                                                  // 验证成功后ajax提交表单，失败后提示请正确输入                                      
                if (validate()) {
                    //ajax登陆
                    ajax(
                        url = 'http://study.163.com/webDev/login.htm',
                        data = {
                          userName: md5("studyOnline"),
                          password: md5("study.163.com")
                        },
                        method = 'get',
                        success = function(res){
                            if(res==1){
                                closeLoginForm();
                                setCookie("loginSuc","loginSucValue",30);
                                ajax(
                                    url = 'http://study.163.com/webDev/attention.htm',
                                    data = {},
                                    method = 'get',
                                    success = function(res) {
                                        alert("关注API的返回：" + res);
                                        hideFollow();
                                        showFollowSuc();
                                        setCookie("followSuc","followSucValue",30);
                                    }
                                )
                            }
                        },
                        error = function() {alert("登陆错误，请重新登陆")}
                    )
                }
            });      
        } else {
                // 若已设置loginSuc cookie，调用关注API，并设置followSuc cookie
              ajax(
                  url = 'http://study.163.com/webDev/attention.htm',
                  data = {},
                  method = 'get',
                  success = function(){
                    hideFollow();
                    showFollowSuc();
                    setCookie("followSuc","followSucValue",30);
                  }
              )
          }  
    });   
    // 表单验证函数：
    function validate(){
        var userName = document.getElementById("userName").value,
            password = document.getElementById("password").value;    
        if ((userName == null || userName == "") && password !== ""){
            alert("请输入用户名！");
        }
        if ((password == null || password == "") && userName !==""){
            alert("请输入密码！");
        } 
        if ((userName == "studyOnline") && (password == "study.163.com")){ //用户名和密码
            return true;
        }
        if (userName == "" && password == "") {
            alert("请输入用户名和密码！");
        };

    }
    //关闭登陆框
    function closeLoginForm(){  
        document.getElementById("mask").style.display = "none";
        document.getElementById("login").style.display = "none";
    }
    //隐藏关注按钮
    function hideFollow(){
        var follow = document.getElementById("follow");
        follow.style.display = "none";
    }
    //显示已关注按钮
    function showFollowSuc(){
        var followSuc = document.getElementById("followSuc");
        followSuc.style.display = "block";
    }
}
addLoadEvent(userLogin);


//轮播图
function circleBanner(){
    var controlImg = 0,
        bannerArr = getElementsByClassName("bannerList")[0].getElementsByTagName("li"), 
        controlArr = getElementsByClassName("controlList")[0].getElementsByTagName("li"); 
    // 定时器每5秒自动变换一次banner
    var autoChange = setInterval(function(){ 
        if(controlImg < bannerArr.length -1){ 
            controlImg ++; 
        }else{ 
            controlImg = 0;
        }
        changeBanner(controlImg); 
    },5000);
    addEvent(); 
    //变换处理函数
    function changeBanner(num){ 
        var curBanner = getElementsByClassName("firstBanner")[0];
        fadeOut(curBanner); //淡出当前banner
        removeClass(curBanner,"firstBanner");
        addClass(bannerArr[num],"firstBanner");
        fadeIn(bannerArr[num]); //淡入目标banner
        var curControlOn = getElementsByClassName("firstControl")[0];
        removeClass(curControlOn,"firstControl");
        addClass(controlArr[num],"firstControl");
    } 
    //调用控制按钮点击和鼠标悬浮事件处理函数
    function addEvent(){
        for(var i=0;i<bannerArr.length;i++){ 
            (function(j){ //鼠标点击控制按钮作变换处理
                addFuc(controlArr[j],"click",function(){ 
                    changeBanner(j);
                    controlImg = j;
                });
              })(i);
            (function(j){ //鼠标悬浮图片上方则清除定时器
              addFuc(bannerArr[j],"mouseover",function(){ 
                clearTimeout(autoChange);
                controlImg = j;
              });
        //鼠标滑出图片则重置定时器
            addFuc(bannerArr[j],"mouseout",function(){ 
                autoChange = setInterval(function(){ 
                    if(controlImg < bannerArr.length -1){ 
                        controlImg ++;
                    }else{ 
                        controlImg = 0;
                    }
                  //调用变换处理函数
                    changeBanner(controlImg); 
                    },5000);
                });
            })(i);
        }
    }
    //淡入效果函数
    function fadeIn(elem){ 
        setOpacity(elem,0); //初始化透明度为100%
        for(var i = 0;i<=20;i++){ //透明度改变 20 * 5 = 100
            (function(){ 
              var level = i * 5;  //透明度每次变化值
              setTimeout(function(){ 
                setOpacity(elem, level)
              },i*25); //i * 25 即为每次改变透明度的时间间隔
            })(i);     
        }
    } 
    //淡出效果函数
    function fadeOut(elem){ 
        for(var i = 0;i<=20;i++){
            (function(){ 
                var level = 100 - i * 5; 
                setTimeout(function(){ 
                  setOpacity(elem, level)
                },i*25); 
            })(i);     
        }
    } 
    //透明度兼容函数（IE8及以下版本只能用滤镜实现透明,ie9、火狐等用opacity属性）
    function setOpacity(elem,level){ 
        if(elem.filters){ 
            elem.style.filter = "alpha(opacity="+level+")";
        }else{ 
            elem.style.opacity = level / 100;
        }
    } 
}
addLoadEvent(circleBanner);


// 右侧内容区:
// 点击图片弹出视频弹窗；
// 获取“最热排行”。

// 点击图片弹出视频弹窗
function videoPlay(){
    var videoImg = document.getElementById("videoImg"),
        closeVideo = document.getElementById("closeVideo");
    addFuc(videoImg,"click",function(){// 弹出视频弹窗
        document.getElementById("mask").style.display = "block";
        document.getElementById("watchVideo").style.display = "block";
    });
    addFuc(closeVideo,"click",function(){// 点击关闭视频弹窗
        document.getElementById("mask").style.display = "none";
        var watchVideo = document.getElementById("watchVideo"),
            video = document.getElementById("video");
        watchVideo.style.display = "none";
        video.pause(); //停止视频播放
    });
}
addLoadEvent(videoPlay);
// 获取“最热排行”
function showHotList(){
    var returnData = null,
        elementLi = '',
        num = 0,
        hotListUl = document.getElementById("hotList");
    // 构造单个热门课程项
    function createNode (opt){
      return '<img src="' + opt.smallPhotoUrl + '" alt="' 
              + opt.name + '" class="hotListPic"><div><p class="hotListTitle">' 
              + opt.name + '</p><span class="hotListUserCount">' 
              + opt.learnerCount + '</span></div>';
    }
    //ajax请求数据，从服务器请求数据，默认展示前 10 门课程
    ajax(
        url = 'http://study.163.com/webDev/hotcouresByCategory.htm',
        data = {},
        method = 'get',
        success = function(res){      
            returnData = JSON.parse(res);
            for (var i=0; i<10; i++){
              elementLi += '<li class="hotListLi">' + createNode(returnData[i]) + '</li>';
            }
            hotListUl.innerHTML = elementLi;
        }
    )
    // 隔 5 秒更新一门排行
    var updateCourse = setInterval(function func(){
        hotListUl.removeChild(hotListUl.childNodes[0]); 
        var liNode = document.createElement('li');
            liNode.setAttribute('class','hotListLi');
            liNode.innerHTML = createNode(returnData[num]);
        hotListUl.appendChild(liNode);
        num == 19 ? num = 0 : num++;
    }, 5000);
}
addLoadEvent(showHotList);


// 左侧内容区：
// 产品设计和编程语言的切换函数；
// 获取课程列表；
// 显示课程详情函数；
// 页码导航功能函数；
// 自适应窗口大小调整每页显示的课程数。
 
// 产品设计和编程语言的切换函数
function tabSwitch(size) {
    var productBtn = document.getElementsByClassName('product')[0],
        programBtn = document.getElementsByClassName('program')[0],
        data = null;
    addFuc(productBtn,"click",function (){
        if (hasClass(programBtn, 'current')){
            removeClass(programBtn,'current');
            addClass(productBtn,'current');
            initCourse(1, size, 10);
        }
    });
    addFuc(programBtn,"click",function (){
        if (hasClass(productBtn, 'current')){
            removeClass(productBtn,'current');
            addClass(programBtn,'current');
            initCourse(1, size, 20);
        }
    });
    // 初始和刷新时自动加载产品设计
    initCourse(1, size, 10);
}
// 获取课程列表
function initCourse(pageNo, psize, type){
    var rootDom = document.getElementsByClassName("course");
    // 构造单个课程和课程浮层
    function segment(opt){
        return '<li class="courseLi"><div class="img"><img src="' 
              + opt.middlePhotoUrl + '"></div><div class="title">'
              + opt.name + '</div><div class="orgName">' 
              + opt.provider + '</div><span class="hot">'
              + opt.learnerCount + '</span><div class="discount">¥ <span>' 
              + opt.price + '</span></div>'+ '<div class="courseInfo"><div class="uHead"><img src="'
              + opt.middlePhotoUrl + '" class="pic"><div class="uInfo"><h3 class="uTit">'
              + opt.name +'</h3><div class="uHot"><span class="uNum">'
              + opt.learnerCount +'</span>人在学</div><div class="uPub">发布者：<span class="uOri">'
              + opt.provider + '</span></div><div class="uCategory">分类：<span class="uTag">'
              + opt.categoryName + '</span></div></div></div><div class="uIntro">'
              + opt.description + '</div></div></li>';
    }
    //将课程写入html
    function courseRender(arr, num){
        var courseTemplate = '';
        for (var i = 0; i < num; i++){
            courseTemplate += segment(arr[i]);
        }
        rootDom[0].innerHTML = courseTemplate;
    }
    // ajax请求数据
    ajax(
        url = 'http://study.163.com/webDev/couresByCategory.htm',
        data = {
            pageNo: pageNo,
            psize: psize,
            type: type
        },
        method = 'get',
        success = function(res){      
            var result = JSON.parse(res);
            courseRender(result.list, result.pagination.pageSize);
            pagination(result, courseRender, type, psize);
            showCourse();
        }
    )   
}
//显示课程详情函数
function showCourse(){
    var courseCell = document.getElementsByClassName('courseLi');
    for (var i = 0; i < courseCell.length; i++){
      addFuc(courseCell[i],"mouseover",function (){
         var dialog = this.getElementsByClassName('courseInfo')[0];
         dialog.style.display = 'block';
      });
      addFuc(courseCell[i],"mouseout",function (){
         var dialog = this.getElementsByClassName('courseInfo')[0];
         dialog.style.display = 'none';
      });
    }
}
//页码导航功能函数
function pagination(data, render, courseType, size) {
    var paginationDom = document.getElementsByClassName('pagination'),
        paginationList = null,
        prevBtn = null,
        nextBtn = null,
        index = 1; // 当前页码
    // 页码切换函数
    function reCourse (n){
        ajax(
            url = 'http://study.163.com/webDev/couresByCategory.htm',
            data = {
                pageNo: n,
                psize: size,
                type: courseType
            },
            method = 'get',
            success = function(res) {      
                var result = JSON.parse(res);
                render(result.list, result.pagination.pageSize);
                showCourse();
            }
        )  
        // 页码样式变换
        for (var i = 1; i < paginationList.length-1; i++){
            removeClass(paginationList[i],'on');
        }
        addClass(paginationList[n], 'on');
    }
    paginationList = document.getElementsByClassName('ele');
    prevBtn = paginationList[0];
    nextBtn = paginationList[paginationList.length-1];
    // 初始化页码1的样式
    addClass(paginationList[1], 'on');
    addFuc(prevBtn,"click",function (){//“上一页”点击事件
        if (index > 1) {
            reCourse(--index);
        }
    });
    addFuc(nextBtn,"click",function (){//“下一页”点击事件
        if (index < 8) {
            reCourse(++index);
        }
    });
    for (var i = 1; i < paginationList.length-1; i++){
        paginationList[i].id = i;
        addFuc(paginationList[i],"click",function (){// 页码数字点击事件
            index = this.id;
            reCourse(this.id);
        });
    }
}
// 自适应窗口大小调整每页显示的课程数
function mainContent(){
    var  tag = null; // 记录当前的每页课程数   
    if (document.body.clientWidth >= 1205){
        tag = 20;
        tabSwitch(20);
    } else {
        tag = 15;
        tabSwitch(15);
    }
    // 根据窗口大小，做动态的布局改变
    addFuc(window,"resize",function (){
        if (tag == 15){
            if (document.body.clientWidth >= 1205){
                tag = 20;
                tabSwitch(20);
            }
        } else{
              if (document.body.clientWidth <= 1205){
                  tag = 15;
                  tabSwitch(15);
              }
        }
    });
}
addLoadEvent(mainContent);