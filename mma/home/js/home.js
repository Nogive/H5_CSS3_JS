/****************URL  begin*******************/
var loginApi='http://mjp.waiqin.co/api/v1/authentication';

//消息列表
var messages='http://mjp.waiqin.co/api/v1/message';
//var messages='http://rap2api.taobao.org/app/mock/1020/GET/api/v1/home/news';
var msgRead='http://mjp.waiqin.co/api/v1/message/read';

var loading = false;
var currentPage=0;
var size=30;

/****************URL  end*******************/
var mjpApp=new Framework7({
	init:false,
	//允许webAPP记录URL，以便回退
	pushState:true,
	//所有模态框的标题
	madalTitle:'mjp',
	//ajax请求时显示加载指示器
	onAjaxStart:function(xhr){
		mjpApp.showIndicator();
	},
	onAjaxComplete:function(xhr){
		mjpApp.hideIndicator();
	},
	modalPreloaderTitle: "正在加载, 请稍等"
});
var $$=Dom7;
var mainView=mjpApp.addView('.view-main');
//判断是否有token，没有去登录
mjpApp.onPageInit('home',function(page){
	var noToken=cookie.checkCookie('token');
	if(noToken){
		mainView.router.loadPage({
			url:'login.html',
			pushState:false
		});
		$$('.toolbar').hide();
	}
	//请求消息列表并存入缓存
	questMessages();
	var ptrContent = $$(".pull-to-refresh-content");
	mjpApp.destroyPullToRefresh(ptrContent)
	ptrContent.on("refresh", function(e) {
		new Promise(function(resolve,reject){
	    	questMessages();
	    	resolve();
	    }).then(function(){
	    	showNews();
	    	setTimeout(function(){mjpApp.pullToRefreshDone();},1000);
	    })
	});
	//消息页面
	$$('#message').on('show',function(){
		currentPage=0;
		$$('#newsTip').hide();
		showNews();
		mjpApp.pullToRefreshTrigger(ptrContent);
		mjpApp.initPullToRefresh(ptrContent);
	});
	$$('#message').on('hide',function(){
		mjpApp.destroyPullToRefresh(ptrContent)
		enableInfinitePreload(false);
		$$('#nomore').hide();
	});
	//设置页面
	$$('#setting').on('show',function(){
		var userData=JSON.parse(storage.getStorage('user'));
		$$('#userCount').text(userData.name);
		$$('#appVersion').text(userData.version);
	});
	//退出登录
	$$('#backtologin').on('click',function(){
		cookie.clearCookie('token');
		mainView.router.loadPage({url:'login.html',pushState:false});
	});
	
  //无限滚动  loading初始为false
  $$(".infinite-scroll").on("infinite", function() {
    if (loading) return;
    loading = true;
    currentPage=currentPage+1;
    console.log('wuxian******************');
	var mList=JSON.parse(storage.getStorage('mList'));
	var html='';
	var start=currentPage*size;
	var end=start+size;
	if(end>mList.length){
		end=mList.length;
		enableInfinitePreload(false);
        $$("#nomore").show();
	}else{
		loading = false;
	}
	for(var i=start;i<end;i++){
		var key='m'+mList[i];
		var value=JSON.parse(storage.getStorage(key));
		html+=returnNewsContent(value);
	}
	$$('#newsBox').append(html);
   });
});
//登录模块
mjpApp.onPageInit('login',function(page){
	var pubKey="MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIGetsuNPeHHbKWutJYmpz2aB6F/3uqq/5HhzuI8Sicz32g9ZkpgelcWJeFNBocfEYzpLgp0fHDz+/PStp23ClUCAwEAAQ==";
	$$('#gologin').on('click',function(){
		mjpApp.showPreloader('正在登录...');
		var encrypt=new JSEncrypt();
		encrypt.setPublicKey(pubKey);
		var encrypted = encrypt.encrypt($$('#passw').val());
		$$.ajax({
			url:loginApi,
			type:'POST',
			contentType:'application/x-www-form-urlencoded',
			dataType:'json',
			data:{
				account:$$("#username").val(),
				password:encrypted
			},
			success:function(data){
				if(data.code==0){
					cookie.setCookie('token',data.data.token,0.5,'/');
					storage.setStorage('user',JSON.stringify(data.data));
					mjpApp.hidePreloader();
					mainView.router.back();
				}
			},
			error:function(xhr){
				mjpApp.hidePreloader();
				console.log('请求失败');
				console.log(xhr);
			}
		});
	});
});
//登录成功进入home页，显示toolbar
mjpApp.onPageBack('login',function(page){
	$$('.toolbar').show();
});
mjpApp.init();

//请求消息并存入本地
function questMessages(){
	console.log('mess1');
	$$.ajax({
		url:messages,
		type:'GET',
		dataType:'json',
		beforeSend:ajaxSet.before,
		success:function(data){
			if(data.code==0){
				var messages=data.data;
				var empty=messages === undefined || messages.length == 0;
				if(empty){
					enableInfinitePreload(false);
					$$('#nomore').hide();
				}else{
					var mList=storage.getStorage('mList');
					if(mList==null){//本地没有
						$$('#newsTip').show();
						mList=[];
						for(var m of messages){
							mList.push(m.id);
							var key="m"+m.id;
							storage.setStorage(key,JSON.stringify(m));
						}
						storage.setStorage('mList',JSON.stringify(mList));
					}else{//本地有
						var localMl=JSON.parse(mList);
						for(var m of messages){
							var id=m.id;
							storage.setStorage("m"+id,JSON.stringify(m));
							if(!localMl.includes(id)){
								$$('#newsTip').show();
								localMl.unshift(id);
							}
						}
						storage.setStorage('mList',JSON.stringify(localMl));
					}
				}
			}else{
				mjpApp.alert(data.msg,'MJP');
			}
		},
		error:ajaxSet.error
	});
}
//点击消息 显示消息
function showNews(page){
	console.log('mess2');
	var mList=storage.getStorage('mList');
	var html='暂无消息';
	if(mList!=null){
		html='';
		mList=JSON.parse(mList);
		var end=mList.length>size?size:mList.length;
		if(end<=size){
			enableInfinitePreload(false);
		}else{
			enableInfinitePreload(true);
			loading=false;
		}
		for(var i=0;i<end;i++){
			var key='m'+mList[i];
			var value=JSON.parse(storage.getStorage(key));
			html+=returnNewsContent(value);
		}
	}
	$$('#newsBox').html(html);
}
//返回消息列表
function returnNewsContent(obj){
	var isRead='';
	if(!obj.hasOwnProperty('readTimestamp')){
		isRead='notRead'
	}
	var html='<div class="card '+isRead+'" id="'+obj.id+'">'+
			  '<div class="card-content">'+
			    '<div class="card-content-inner">'+obj.content+'</div>'+
			  '</div>'+
			'</div>';
	return html;
}
//无限加载
function enableInfinitePreload(enabled) {
  if (enabled) {
    var html =
      '<div class="infinite-scroll-preloader">' +
      '<div class="preloader"></div>' +
      "</div>";

    $$(".infinite-scroll-preloader").remove();
    $$(".infinite-scroll").append(html);
    mjpApp.attachInfiniteScroll(".infinite-scroll");
  } else {
    mjpApp.detachInfiniteScroll($$(".infinite-scroll"));
    $$(".infinite-scroll-preloader").remove();
  }
}

