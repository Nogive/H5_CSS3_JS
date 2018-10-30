/*********************请求的URL**********************/
surveyApi='http://mjp.waiqin.co/api/v1/surveys';
//我的outlet
var premvoApi = "api/v1/outlets/premvo";
//我有权看到的mvo
var mvoApi = "api/v1/outlets/mvo";
//需要我分配的mvo
var pmvoApi = "api/v1/outlets/pendingmvo";
//需要我审批的outlet
var approveApi="api/v1/outlets/approvemvo";
var MENU = {
  create: { id: 1, name: "新建" },
  edit: { id: 2, name: "编辑" },
  assign: { id: 3, name: "分配" },
  remove: { id: 4, name: "删除" },
  approve: { id: 5, name: "通过审批" },
  deny: { id: 6, name: "拒绝审批" },
  submit: { id: 7, name: "提交" }
};


var pageSize = 20;

var currentPage = 0;

var protocol = location.protocol;
var slashes = protocol.concat("//");
//var host = slashes.concat(window.location.hostname) + ":" + window.location.port;
var host=slashes+"mjp.waiqin.co"
var mvoDetailApi = host + "/" + "api/v1/outlets";

var NewOneDetailApi = host + "/" + "api/v1/outlets/new";
/*****
 * 
 * 
 * ************************普查信息API开始**************************/
//获取普查信息
var surveysApi=host+ "/"+'api/v1/surveys';
//普查模板
var surveyTemplateApi=host+ "/"+'api/v1/surveys/templates';
/***
 * 
 * 
 * **************************普查信息API 结束**************************/

var currentFetchApi;

var currentOutletType;

var loading = false;

/*********************请求的URL  结束**********************/
var mjpApp = new Framework7({
  init: false,
  //允许webAPP记录URL，以便回退
  pushState: true,
  //ajax请求时显示加载指示器
  onAjaxStart: function(xhr) {
    mjpApp.showIndicator();
  },
  onAjaxComplete: function(xhr) {
    mjpApp.hideIndicator();
  }
});

var $$ = Dom7;
var mainView = mjpApp.addView(".view-main", { domCache: true });
//返回本地有detail的id数组

function getOutletListFromCache(outletListKey) {
  var outletList = [];
  var outletIds = JSON.parse(storage.getStorage(outletListKey));
  $$.each(outletIds, function(i, e) {
    var outlet = JSON.parse(storage.getStorage("o" + e.id));
    if (outlet != null) {
      outletList.push(outlet);
    }
  });
  return outletList;
}
//生成某个tab的列表
function generateViewItems(itemType, items) {
  var html = "";
  $$.each(items, function(i, e) {
    var outlet = e;
    if (itemType == "premvo") {
      html +=
        '<li id="' +
        outlet.id +
        '" class="item-content" action="edit" onclick="toDetail(this);">' +
        '<div class="item-inner">' +
        '<div class="item-title">' +
        outlet.outletName +
        "</div>" +
        '<div class="item-after"><span class="statusText">' +
        outlet.approvalState +
        '</span><span class="fixwidth">' +
        outlet.mvoState +
        "</span></div>" +
        "</div>" +
        "</li>";
    } else if (itemType == "mvo") {//edit?visedit?
      html +=
        '<li id="' +
        outlet.id +
        '" class="item-content" action="visedit" onclick="toDetail(this);">' +
        '<div class="item-inner">' +
        '<div class="item-title">' +
        outlet.outletName +
        "</div>" +
        "</div>" +
        "</li>";
    } else if(itemType == "pmvo"){
      html +=
        '<li id="' +
        outlet.id +
        '" class="item-content" action="assign" onclick="toDetail(this);">' +
        '<div class="item-inner">' +
        '<div class="item-title">' +
        outlet.outletName +
        "</div>" +
        "</div>" +
        "</li>";
    }else{
    	html +=
        '<li id="' +
        outlet.id +
        '" class="item-content" action="approve" onclick="toDetail(this);">' +
        '<div class="item-inner">' +
        '<div class="item-title">' +
        outlet.outletName +
        "</div>" +
        "</div>" +
        "</li>";
    }
  });
  return html;
}
//无限加载
function enableInfinitePreload() {
	$$('#nomore').hide();
	mjpApp.attachInfiniteScroll($$('.infinite-scroll'));
	$$('.infinite-scroll-preloader').show();
}
//拿某一页的数据  
function getListPageHtml(outletType, page) {
  var outletList = getOutletListFromCache(outletType);//本地有detail的id
  var startIndex = page * pageSize;//0,20,40...  20
  var html = "";
  if (outletList.length > startIndex) {
    html = generateViewItems(
      currentOutletType,
      outletList.slice(startIndex, startIndex + pageSize - 1)
    );
  } else {
    if (page == 0) {
      html = "暂无数据";
    } else {
      html = "";
    }
  }
  return html;
}
//搜索回车事件
function searchOutlet(){
	console.log('这里是搜索');
}

//outlet管理页面初始化
mjpApp.onPageInit("outlet", function(page) {
  mma.setActionMenus(true, [MENU.create]);
  mma.setOnActionCallback(actionWhich);
  //读取user,有没有分配mvo的权限，没有则移除待我分配的tab
  /*var oUser=JSON.parse(storage.getStorage('user')).isSS;
	if(!oUser){
		$$('#pmvo').remove();
	}*/
  //下拉刷新事件
  var ptrContent = $$(".pull-to-refresh-content");
  ptrContent.on("refresh", function(e) {
  	$$('.pull-to-refresh-layer').addClass('martop0');
    if (currentOutletType == "premvo") {
      requestRemoteOutletListAndUpdate(
        currentFetchApi,
        currentOutletType,
        function(dataUpdated) {
          if (dataUpdated) {
            currentPage = 0;
            $$("#my-outlet-list").html(
              getListPageHtml(currentOutletType, currentPage)
            );
          }
          mjpApp.pullToRefreshDone();
          $$('.pull-to-refresh-layer').removeClass('martop0');
          /*setTimeout(function(){
          	mjpApp.pullToRefreshDone();
          	$$('.pull-to-refresh-layer').removeClass('martop0');
          },2000);*/
        }
      );
    } else if (currentOutletType == "mvo") {
      requestRemoteOutletListAndUpdate(
        currentFetchApi,
        currentOutletType,
        function(dataUpdated) {
          if (dataUpdated) {
            currentPage = 0;
            $$("#my-mvo-list").html(
              getListPageHtml(currentOutletType, currentPage)
            );
          }
          mjpApp.pullToRefreshDone();
          $$('.pull-to-refresh-layer').removeClass('martop0');
        }
      );
    } else if (currentOutletType == "mvo") {
      requestRemoteOutletListAndUpdate(
        currentFetchApi,
        currentOutletType,
        function(dataUpdated) {
          if (dataUpdated) {
            currentPage = 0;
            $$("#my-pmvo-list").html(
              getListPageHtml(currentOutletType, currentPage)
            );
          }
          mjpApp.pullToRefreshDone();
          $$('.pull-to-refresh-layer').removeClass('martop0');
        }
      );
    }else{
    	requestRemoteOutletListAndUpdate(
        currentFetchApi,
        currentOutletType,
        function(dataUpdated) {
          if (dataUpdated) {
            currentPage = 0;
            $$("#my-approve-list").html(
              getListPageHtml(currentOutletType, currentPage)
            );
          }
          mjpApp.pullToRefreshDone();
          $$('.pull-to-refresh-layer').removeClass('martop0');
        }
      );
    }
  });

  //请求my outlet列表
  $$("#my-outlet").on("show", function() {
    currentOutletType = "premvo";
    currentPage = 0;
    enableInfinitePreload(currentOutletType);
    $$("#my-outlet-list").html(getListPageHtml(currentOutletType, currentPage));
		
    currentFetchApi = host + "/" + premvoApi;

    mjpApp.pullToRefreshTrigger(".pull-to-refresh-content");
  });

  mjpApp.showTab("#my-outlet");

  //我有权限看到的mvo列表
  $$("#my-mvo").on("show", function() {
    currentOutletType = "mvo";
    currentPage = 0;
    enableInfinitePreload(currentOutletType);

    $$("#my-mvo-list").html(getListPageHtml(currentOutletType, currentPage));

    currentFetchApi = host + "/" + mvoApi;
    mjpApp.pullToRefreshTrigger(".pull-to-refresh-content");
  });

  //需要我分配的mvo
  $$("#my-pmvo").on("show", function() {
    currentOutletType = "pmvo";
    currentPage = 0;
    enableInfinitePreload(currentOutletType);

    $$("#my-pmvo-list").html(getListPageHtml(currentOutletType, currentPage));

    currentFetchApi = host + "/" + pmvoApi;
    mjpApp.pullToRefreshTrigger(".pull-to-refresh-content"); //初始化下拉刷新
  });
  
  //需要我审批的outlet
  $$("#my-approve").on("show", function() {
    currentOutletType = "approve";
    currentPage = 0;
    enableInfinitePreload(currentOutletType);

    $$("#my-approve-list").html(getListPageHtml(currentOutletType, currentPage));

    currentFetchApi = host + "/" + approveApi;
    mjpApp.pullToRefreshTrigger(".pull-to-refresh-content"); //初始化下拉刷新
  });
 
	//无限滚动  loading初始为false
  $$(".infinite-scroll").on("infinite", function() {
    if (loading) return;
    loading = true;
    console.log(currentOutletType+':'+currentPage);
    //拿第二页的数据
    var html=getListPageHtml(currentOutletType, ++currentPage);
    setTimeout(function(){
    	loading = false;
    	if(html==''){
    		mjpApp.detachInfiniteScroll($$('.infinite-scroll'));
	    	$$('.infinite-scroll-preloader').hide();
	    	$$('#nomore').show();
				return;
	    }else{
				if (currentOutletType == "premvo") {
	      	$$("#my-outlet-list").append(html);
		    } else if (currentOutletType == "mvo") {
		      $$("#my-mvo-list").append(html);
		    } else if(currentOutletType == "mvo"){
		    	$$("#my-approve-list").append(html);
		    } else{
		      $$("#my-pmvo-list").append(html);
		    }
	    }
    },1000);
  });
  
  //搜索
  var mySearchbar = mjpApp.searchbar('.searchbar', {
    onEnable: function(){
    	$$('.searchbar-overlay').addClass('searchbar-overlay-active');
    	$$('#mjpsearch').addClass('bgwhite');
    },
    onDisable:function(){
    	$$('.searchbar-overlay').removeClass('searchbar-overlay-active');
    }
	}); 
});

//详情页面初始化
mjpApp.onPageInit("outletdetail", function(page) {
	console.log(1111);
	field.createField('Show');
	
  var oId = page.query.id; //ID
  var oAction = page.query.action; //参数里面是编辑还是分配
  var actionText = oAction == "assign" ? "分配" : "编辑";
  //mma.showAction(true, actionText);
  mma.setActionMenus(true, [MENU.create]);
  mma.setOnActionCallback(actionWhich);
  //通过‘o’+outlet的Id，去缓存里拿详情
  var okey = "o" + oId;
  var oInfo = JSON.parse(storage.getStorage(okey));
  console.log(oInfo);
  //mma.setTitle(oInfo.outletName);
  //showBaseData(oInfo,'Show');
  field.displayData(formVal,'Show');
  //普查信息和驳回理由是否显示
  //surveyAndrecject(oAction, oId); 
  requestSurvey();
});

//从详情页返回
mjpApp.onPageBack("outletdetail", function(page) {
  mma.setActionMenus(true, [MENU.create]);
  mma.setOnActionCallback(actionWhich);
  mma.setTitle("Outlet 管理");
});

//select时改变原生按钮
$$(document).on("page:init", ".smart-select-page", function(customEvent) {
  mma.setActionMenus(false);
  var title = customEvent.detail.page.container.dataset.selectName;
  mma.setTitle(title);
  var halfId=smartSelectNameClassMap[title];
  $$('#item-after-'+halfId).parent('.item-inner').find('.required').removeClass('color-red').text('*');
  
  var pageName = customEvent.detail.page.name;
  mjpApp.onPageBack(pageName, function() {
    mma.setActionMenus(true, [MENU.submit]);
    mma.setTitle("");
    var className = smartSelectNameClassMap[title];
    if (className != undefined && $$("." + className)[0].value == 0) {
      $$("#item-after-" + smartSelectNameClassMap[title]).text("请选择");
    }
  });
});

//编辑页面初始化
var smartSelectNameClassMap = {};
mjpApp.onPageInit("edit", function(page) {
	field.createField();
	
	$$('#reopenTimestamp').val('2018/01/08');
	var mjpCalendar=mjpApp.calendar({
		input:'#reopenTimestamp',
		dateFormat:'yyyy/mm/dd',
		closeOnSelect:true,
	});
	//初始化各个选项
  initSelectOption();
  //获取传过来的参数 
  var outletId = page.query.id;
  if (outletId != undefined) {
    showValue4Outlet(outletId);
  }
  mma.setActionMenus(true, [MENU.submit]);
  //四级联动
  var china = new Object();
  china.i = 0;
  china.n = "china";
  china.s = parseOrg(xz.data);
  storage.setStorage("x0", JSON.stringify(china));
  //设置当选择“不选择”按钮时对应的json
  $$("select[class^='sss-']").each(function() {
    var okey = this.attributes["name"].value;
    var oval = this.className;
    smartSelectNameClassMap[okey] = oval;
  });
  //生成四级联动选项
  var xzItem = createItem(JSON.parse(storage.getStorage("x0")).s);
  $$(".sss-area").html(xzItem);
  $$(".sss-area").on("change", function() {
    fourLinkmove(this, ".sss-province");
  });
  $$(".sss-province").on("change", function() {
    fourLinkmove(this, ".sss-city");
  });
  $$(".sss-city").on("change", function() {
    fourLinkmove(this, ".sss-district");
  });
  //选择某个选项
  $$("select[class^='sss-']").on('change',function() {
    var oval = this.className;
    $$('#item-after-'+oval).attr('data-value',$$(this).val());
 	});
 	//点击定位按钮
  $$("#position").on("click", function() {
    mjpApp.showPreloader("正在定位...");
    mma.getLocation(onLocation);
  });
  //点击删除按钮
  $$("#resetPosition").on("click", function() {
    $$("#omap").attr("src", "");
    $$("#locationHint").show();
    $$("#address").val("");
  });
  //点击提交按钮
  mma.setOnActionCallback(function() {
  	//表单验证  validate();
  	//提交数据  submitBaseInfo(outletId);
  	if(field.validate()){
  		console.log(field.collectData());
  	}else{
  		mjpApp.alert('有必填项未填写，请检查并填写后提交。','提示')
  	}
  });
  //点击输入时验证提示隐藏
  cancleEles.forEach(e=>{
		cancleErroeText(e);
	});
});
//从编辑页返回
mjpApp.onPageBack("edit", function(page) {
  mma.setActionMenus(true, [MENU.edit]);
  mma.setOnActionCallback(actionWhich);
});
//分配页面初始化
mjpApp.onPageInit("assign", function(page) {
  mma.setActionMenus(false);
  mma.setOnActionCallback(actionWhich);
  mma.setTitle("选择人员");
  //获取传过来的参数
  var detailId = page.query.id;
  $$.ajax({
    url: "http://rap2api.taobao.org/app/mock/1020/GET/api/v1/assignman",
    type: "GET",
    data: {
      id: detailId
    },
    dataType: "json",
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
    },
    success: function(data) {
      console.log(data);
      if (data.code == 0) {
        var personList = data.data;
        $$("#personlist").html(createPersonList(personList, detailId));
      }
    },
    error: requestFailed
  });
});
//从分配页返回
mjpApp.onPageBack("assign", function(page) {
  mma.setTitle("xxx酒吧");
  var key = "o" + page.query.id;
  var val = JSON.parse(storage.getStorage(key));
  if (val.eoename) {
    mma.setActionMenus(false);
  } else {
    mma.setActionMenus(true, [MENU.assign]);
    mma.setOnActionCallback(actionWhich);
  }
});
//审批页面初始化
mjpApp.onPageInit("approve", function(page) {
	field.createField('Left');
	field.createField('Right');
	
	var outletId=page.query.id;
	var oInfo=JSON.parse(storage.getStorage('o'+outletId));
	//showBaseData(oInfo,'Left');
  field.displayData(formVal,'Left','Right');
  questNewBaseInfoAndShow(outletId,oInfo);
  
  mma.setActionMenus(true, [MENU.approve,MENU.deny]);
  mma.setOnActionCallback(function(){
  	onApprove(outletId);
  });
  $$('body').on('click','textarea#reject',function(){
  	$$(this).removeClass('red').next().hide();
  });
  $$('body').on('click','#cancleApprove',function(){
  	mjpApp.closeModal();
  });
});
mjpApp.onPageBack('approve',function(page){
	mma.setActionMenus(true, [MENU.create]);
});
mjpApp.init();
//审批时 请求右半边部分
function questNewBaseInfoAndShow(outletId,oldInfo){
	$$.ajax({
		//url:NewOneDetailApi,
		url:'http://rap2api.taobao.org/app/mock/1020/POST/api/v1/authentication',
		type:'POST',
		data:{
			outletId:outletId
		},
		dataType: "json",
	  beforeSend: function(xhr) {
	    xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
	  },
	  success: function(data) {//提交成功
	  	if(data.code==0){
	  		var newInfo=data.data;
	  		console.log(newInfo);
	  		compareDifferInfo(formVal,newFormVal);
	  		field.displayData(newFormVal,'Right');
	  	}
	  },
	  error: requestFailed
	});
}
//比较新detail与原来detail的不同
function compareDifferInfo(oldInfo,newInfo){
	var diffInput=[];var sameInput=[];
	for(var obj in newInfo){
		if(typeof newInfo[obj]=="object"){//对象
			newInfo[obj].id!=oldInfo[obj].id?diffInput.push(obj):sameInput.push(obj);
		}else{
			newInfo[obj]!=oldInfo[obj]?diffInput.push(obj):sameInput.push(obj);
		}
	}
	if(diffInput.length>0){
		differToRed(diffInput);
	}
}
//不同的地方标红
function differToRed(arr){
	for(var id of arr){
		if(id=="longtitude"||id=="latitude"){
			$$('#addressRight').parents('.sameRoot').addClass('border-red');
			$$('#provinceRight').parents('.sameRoot').addClass('border-red');
			$$('#cityRight').parents('.sameRoot').addClass('border-red');
			$$('#regionRight').parents('.sameRoot').addClass('border-red');
		}else{
			$$('#'+id+'Right').parents('.sameRoot').addClass('border-red')
		}
	}
}
//原生右上角按钮点击动作
function actionWhich() {
	//mainView.router.loadPage("edit.html");
	mainView.router.loadPage("outletdetail.html");
	//mainView.router.loadPage("approve.html");
	/*
  var str = window.location.href;
  var index = str.indexOf("?");
  if (index == -1) {
    //新建
    mainView.router.loadPage("edit.html");
  } else {
    //编辑或者分配
    var aQuery = str.substring(index + 1).split("&&");
    var oId = aQuery[0].split("=")[1];
    var aAction = aQuery[1].split("=")[1];
    if (aQuery.length > 1) {
      //在详情页点击
      aAction == "assign"
        ? mainView.router.loadPage("assign.html?id=" + oId)
        : mainView.router.loadPage("edit.html?id=" + oId);
    }
  }
  */
}
//审批页面的审批按钮
function onApprove(outletId){
	mjpApp.modal({
    title:  '<b>是否通过审批？</b>',
    text:'<div class="item-content">'+
    			'<p>若驳回，请填写驳回理由：</p>'+
  				'<div class="item-inner">'+
  					'<div class="item-input marb10">'+
  						'<textarea class="rejectbox" id="reject"></textarea>'+
  						'<span class="color-red disnone">* 请输入驳回理由。</span>'+
  					'</div>'+
  				'</div>'+
  			'</div>',
  	afterText:'<a href="javascript:;" class="cancleModel icon" id="cancleApprove">close</a>',
    buttons: [
      {
        text: '驳回',
        close:false,
        onClick: function() {
          rejectAction(outletId);
        }
      },
      {
        text: '通过',
        onClick: function() {
        	mjpApp.showPreloader('正在提交...');
        	var upData={
        		id:outletId
        	};
          uploadApprove(upData);
        }
      }
    ]
  })
}
function rejectAction(outletId){
	var rejectText=$$('#reject').val();
	if(rejectText==''){
		$$('#reject').addClass('red').next().show();
	}else{
		mjpApp.closeModal();
		mjpApp.showPreloader('正在提交...');
		var upData={
			outletId:outletId,
			rejectText:rejectText
		};
		uploadApprove(upData);
	}
}
function uploadApprove(upData){
	console.log(upData);
	$$.ajax({
      url: "http://rap2api.taobao.org/app/mock/1020/POST/api/vi/submitperson",
      type: "POST",
      data: upData,
      dataType: "json",
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      },
      success: function(data) {//提交成功
      	mjpApp.hidePreloader();
        if (data.code == 0) {
        	mainView.router.back();
        }
      },
      error: requestFailed
    });
}
//点击列表进入每个详情页面
function toDetail(obj) {
  var outletId = $$(obj).attr("id");
  var action = $$(obj).attr("action");
  if(action=='approve'){
  	mainView.router.loadPage(
	    "approve.html?id=" + outletId + "&&action=" + action
	  );
  }else{
  	mainView.router.loadPage(
	    "outletdetail.html?id=" + outletId + "&&action=" + action
	  );
  }
}
//定位获取地址
function onLocation(data) {
  /*{"lng":121.40645,
	"lat":31.17979,
	"acr":29,
	"tme":1512441269101,
	"lot":5,
	"adr":"上海市徐汇区钦州北路1058号靠近钦汇园",
	"prv":"上海市","cty":"上海市","dst":"徐汇区"}*/
  if (data) {
  	$$('#item-location .required').removeClass('color-red').text('*');
    $$("#locationHint").hide();
    mjpApp.hidePreloader();
    if (data != "") {
      var oData = JSON.parse(data);
      var oSrc =
        "http://restapi.amap.com/v3/staticmap?location=" +
        oData.lng +
        "," +
        oData.lat +
        "&zoom=14&size=686*200&markers=large,,:" +
        oData.lng +
        "," +
        oData.lat +
        "&key=b2a701a4c4e88acd8fac16bbf402484f";
      $$("#omap").attr("src", oSrc);
      $$("#omap").attr("data-lng", oData.lng).attr("data-lat",oData.lat);
      $$("#address").val(oData.adr);//地址
      $$("#item-after-sss-province").text(oData.prv);//省
      $$("#item-after-sss-city").text(oData.cty);//市
      $$("#item-after-sss-district").text(oData.dst);//区域
    } else {
      mjpApp.alert("定位失败。");
    }
  }
}
//请求失败
function requestFailed(err) {
  console.log("请求失败，出错了。");
  console.log(err);
}
//显示基本数据
function showBaseData(obj,str){
	$$("#outletName"+str).val(inputHasOrnot(obj.outletName));
	$$("#outletCode"+str).val(inputHasOrnot(obj.outletCode));
	$$("#address"+str).val(inputHasOrnot(obj.address));
	$$("#pgNumber"+str).val(inputHasOrnot(obj.pgNumber));
	$$("#totalVolume"+str).val(inputHasOrnot(obj.totalVolume));
	$$("#fridgeNumber"+str).val(inputHasOrnot(obj.fridgeNumber));
	$$("#dbiNumber"+str).val(inputHasOrnot(obj.dbiNumber));
	$$("#boss"+str).val(inputHasOrnot(obj.boss));
	$$("#shopKeeper"+str).val(inputHasOrnot(obj.shopKeeper));
	$$("#mobile"+str).val(inputHasOrnot(obj.mobile));
	$$("#phone"+str).val(inputHasOrnot(obj.phone));
	$$("#reopenTimestamp"+str).val(inputHasOrnot(obj.reopenTimestamp));
	$$("#contractStartTimestamp"+str).val(inputHasOrnot(obj.contractStartTimestamp));
	$$("#contractEndTimestamp"+str).val(inputHasOrnot(obj.createdTimestamp));
	var w=parseInt($$("#omap"+str).parent(".mapimg").width());
	var mapSrc =
	  "http://restapi.amap.com/v3/staticmap?location=" +
	  inputHasOrnot(obj.longitude) +
	  "," +
	  inputHasOrnot(obj.latitude) +
	  "&zoom=14&size="+w+"*200&markers=large,,:" +
	  inputHasOrnot(obj.longitude) +
	  "," +
	  inputHasOrnot(obj.latitude) +
	  "&key=b2a701a4c4e88acd8fac16bbf402484f";
	$$("#omap"+str).attr("src", mapSrc); 
	
	$$("#eoeChannel"+str).html(selectHasOrnot(obj.eoeChannel));
  $$("#scale"+str).html(selectHasOrnot(obj.scale));
  $$("#scope"+str).html(selectHasOrnot(obj.scope));
  $$("#subScope"+str).html(selectHasOrnot(obj.subScope));
  $$("#averageConsumption"+str).html(selectHasOrnot(obj.averageConsumption));
  $$("#competitorBrands"+str).html(selectHasOrnot(obj.competitorBrands));
  $$("#traffic"+str).html(selectHasOrnot(obj.traffic));
  $$("#agreementsType"+str).html(selectHasOrnot(obj.agreementsType));
  $$("#duixiangType"+str).html(selectHasOrnot(obj.duixiangType));
  $$("#state"+str).html(selectHasOrnot(obj.state));
}
//判断选项值是否存在，并返回第一个
function selectHasOrnot(obj){
	if(obj!=null&&obj!= undefined){
		return obj.length>1?obj[0].name:obj.name;
	}else{
		return '';
	}
}
function inputHasOrnot(str){
	if(str!=null&&str!= undefined){
		return str;
	}else{
		return '';
	}
}
//初始化编辑页选项
function initSelectOption() {
  $$("#eoeChannel").html(generateOption("eoeChannel", true));
  $$("#scale").html(generateOption("all", true));
  $$("#scope").html(generateOption("all", true));
  $$("#subScope").html(generateOption("all", true));
  $$("#averageConsumption").html(generateOption("all", true));
  $$("#competitorBrands").html(generateOption("competitorBrands"));
  $$("#traffic").html(generateOption("all", true));
  $$("#agreementsType").html(generateOption("all", true));
  $$("#duixiangType").html(generateOption("all", true));
  $$("#state").html(generateOption("all", true));
}
//generate options for smart select
function generateOption(key, withNoOption) {
  // get option cache
  var options = JSON.parse(storage.getStorage(key));
  if (options != undefined) {
    if (withNoOption) {
      var html = '<option value="0">不选择</option>';
    }

    for (var i = 0; i < options.length; i++) {
      var v = options[i];
      html += '<option value="' + v.i + '">' + v.n + "</option>";
    }
  }
  return html;
}
//设置编辑页的smart数据
function setMultiSmartSelectValue(key, values) {
  var text = "";
  $$.each(values, function(i, e) {
    $$("#" + key + " option[value='" + e.id + "']").prop("selected", true);
    text += "," + e.name;
  });
  text = text.substring(1);
  $$("#item-after-sss-" + key).text(text);
}
function setSmartSelectValue(key, id, name) {
  $$("#" + key).val(id);
  $$("#item-after-sss-" + key).text(name);
}
//初始化编辑页面数据
function showValue4Outlet() {
  var outlet = currentOutlet;
  if (outlet.name != undefined) {
    $$("#name").val(outlet.name);
  }

  if (outlet.code != undefined) {
    $$("#code").val(outlet.code);
  }

  if (outlet.longitude != undefined && outlet.latitude != undefined) {
    var w = $$("#location")
      .parent(".mapimg")
      .width();
    var mapSrc =
      "http://restapi.amap.com/v3/staticmap?location=" +
      outlet.longitude +
      "," +
      outlet.latitude +
      "&zoom=14&size=" +
      w +
      "*200&markers=large,,:" +
      outlet.longitude +
      "," +
      outlet.latitude +
      "&key=b2a701a4c4e88acd8fac16bbf402484f";
    $$("#location").attr("src", mapSrc);
    $$("#location")
      .attr("data-lat", outlet.latitude)
      .attr("data-lng", outlet.longitude);
    $$("#locationHint").hide();
  }

  if (outlet.address != undefined) {
    $$("#address").val(outlet.address);
  }
  $$("#scaleSpace").val(
    outlet.scaleSpace == undefined ? "" : outlet.scaleSpace
  );

  $$("#scaleTableNumber").val(
    outlet.scaleTableNumber == undefined ? "" : outlet.scaleTableNumber
  );

  $$("#scaleBoxNumber").val(
    outlet.scaleBoxNumber == undefined ? "" : outlet.scaleBoxNumber
  );

  $$("#scaleCashierNumber").val(
    outlet.scaleCashierNumber == undefined ? "" : outlet.scaleCashierNumber
  );

  if (outlet.region != undefined) {
    mma.getCache("r" + outlet.region.parentId).then(function(v) {
      var city = v;
      if (city != undefined) {
        getChildrenRegions(city.id).then(function(v) {
          var region = v;
          $$(".sss-region").html(generateOptionWithArray(region, true));
          setSmartSelectValue("region", outlet.region.id, outlet.region.name);
          mma.getCache("r" + city.parentId).then(function(v) {
            var province = v;
            if (province != undefined) {
              getChildrenRegions(province.id).then(function(v) {
                var cities = v;
                $$(".sss-city").html(generateOptionWithArray(cities, true));
                setSmartSelectValue("city", city.id, city.name);
              });
              setSmartSelectValue("province", province.id, province.name);
              $$("#province").attr("hock", province.id);
              mma.getCache("channel").then(function(v) {
                var channels = v;
                var channelArray = [];
                if (province.id == $g.Province.HAINAN) {
                  $$.each(channels, function(key, item) {
                    if (item.just4Hainan) {
                      channelArray.push(item);
                    }
                  });
                } else {
                  $$.each(channels, function(key, item) {
                    if (!item.just4Hainan) {
                      channelArray.push(item);
                    }
                  });
                }
                $$("#channel").html(
                  generateOptionWithArray(channelArray, true)
                );
                if (outlet.channel != undefined) {
                  setSmartSelectValue(
                    "channel",
                    outlet.channel.id,
                    outlet.channel.name
                  );
                  let scale = outlet.channel.scaleField.split(" ");
                  mainField.forEach(e => {
                    if (scale.includes(e.name)) {
                      e.required = true;
                      $$("#" + e.name)
                        .parents(".sameRoot")
                        .children("p")
                        .html(e.text + ' <span class="required">*</span>');
                      $$("#" + e.name)
                        .parents(".sameRoot")
                        .show();
                    }
                  });
                }
              });
            }
          });
        });
      }
    });

    $$("#item-wholesaler")
      .find("a")
      .attr("regionId", outlet.region.id);
    $$("#item-dealer")
      .find("a")
      .attr("regionId", outlet.region.id);
    $$("#item-substituteWholesaler")
      .find("a")
      .attr("regionId", outlet.region.id);
  }

  if (outlet.postalCode != undefined) {
    $$("#postalCode").val(outlet.postalCode);
  }

  if (outlet.pgNumber != undefined) {
    $$("#pgNumber").val(outlet.pgNumber);
  }

  if (outlet.totalVolume != undefined) {
    $$("#totalVolume").val(outlet.totalVolume);
  }

  if (outlet.fridgeNumber != undefined) {
    $$("#fridgeNumber").val(outlet.fridgeNumber);
  }

  if (outlet.dbiNumber != undefined) {
    $$("#dbiNumber").val(outlet.dbiNumber);
  }

  if (outlet.owner != undefined) {
    $$("#owner").val(outlet.owner);
  }

  if (outlet.contactPerson != undefined) {
    $$("#contactPerson").val(outlet.contactPerson);
  }

  if (outlet.mobileOrTel != undefined) {
    $$("#mobileOrTel").val(outlet.mobileOrTel);
  }

  if (outlet.telephone != undefined) {
    $$("#telephone").val(outlet.telephone);
  }

  if (outlet.averageConsumption != undefined) {
    $$("#averageConsumption").val(outlet.averageConsumption);
  }

  if (outlet.scope != undefined) {
    setSmartSelectValue("scope", outlet.scope.id, outlet.scope.name);
  }

  if (outlet.chain != undefined) {
    setSmartSelectValue("chain", outlet.chain.id, outlet.chain.name);
  }

  if (outlet.demographicRegion != undefined) {
    setSmartSelectValue(
      "demographicRegion",
      outlet.demographicRegion.id,
      outlet.demographicRegion.name
    );
  }

  if (outlet.visitFrequency != undefined) {
    setSmartSelectValue(
      "visitFrequency",
      outlet.visitFrequency.id,
      outlet.visitFrequency.name
    );
  }

  if (outlet.dealerType != undefined) {
    setSmartSelectValue(
      "dealerType",
      outlet.dealerType.id,
      outlet.dealerType.name
    );
  }

  if (outlet.contractType != undefined) {
    setSmartSelectValue(
      "contractType",
      outlet.contractType.id,
      outlet.contractType.name
    );
  }

  if (outlet.type != undefined) {
    setSmartSelectValue("type", outlet.type.id, outlet.type.name);
  }

  if (outlet.wholesaler != undefined) {
    setDealerSelectValue(
      "wholesaler ",
      outlet.wholesaler.id,
      outlet.wholesaler.code + " " + outlet.wholesaler.name
    );
  }

  if (outlet.dealer != undefined) {
    setDealerSelectValue(
      "dealer ",
      outlet.dealer.id,
      outlet.dealer.code + " " + outlet.dealer.name
    );
  }

  if (outlet.substituteWholesaler != undefined) {
    setDealerSelectValue(
      "substituteWholesaler ",
      outlet.substituteWholesaler.id,
      outlet.substituteWholesaler.code + " " + outlet.substituteWholesaler.name
    );
  }

  if (outlet.state != undefined) {
    setSmartSelectValue("state", outlet.state.id, outlet.state.name);
  }

  if (outlet.reopenTimestamp != undefined) {
    $$("#item-reopenTimestamp")
      .parent()
      .show();
    $$("#reopenTimestamp").show();
    $$("#reopenTimestamp").val(timestamp2String(outlet.reopenTimestamp));
  }

  if (outlet.lastClosedTimestamp != undefined) {
    $$("#item-lastClosedTimestamp").show();
    $$("#lastClosedTimestamp").show();
    $$("#lastClosedTimestamp").val(
      timestamp2String(outlet.lastClosedTimestamp)
    );
  }

  if (outlet.contractStartTimestamp != undefined) {
    $$("#contractStartTimestamp").val(
      timestamp2String(outlet.contractStartTimestamp)
    );
  }

  if (outlet.contractEndTimestamp != undefined) {
    $$("#contractEndTimestamp").val(
      timestamp2String(outlet.contractEndTimestamp)
    );
  }
}

//必填验证
function validate(){
	//所有的输入框
	$$("input").each(function(){
		var req=$$(this).attr('required');
		if(req!=null){//是否为必填框
			if($$(this).val()==''){
				$$(this).parents('.inbox').find('.required').addClass('color-red').text('* 此项为必填项');
			};
		}
	});
	//所有的选项"select[class^='sss-']"
	$$("#baseForm .item-after").each(function(){
		var str=$$(this).attr('data-value');
		console.log($$(this).attr('id')+':'+str);
		if(str==null||str==0){
			$$(this).parent('.item-inner').find('.required').addClass('color-red').text('* 此项为必选项');
		}
	});
	//地图是否获取
	var map=$$('#omap').attr('src');
	if(map==''){
		$$('#item-location .required').addClass('color-red').text('* 请点击右侧进行定位');
	}
}
//提交基本信息
function submitBaseInfo(outletId){
	var subFlag=true;
	$$('.required').each(function(){
		if($$(this).hasClass('color-red')){
			subFlag=false;
			console.log($$(this).parent().text());
		}
	});
	if(subFlag){
		mjpApp.showPreloader('正在提交');
		//输入框数据
		var inputData1 = mjpApp.formToJSON('#info1');
		var inputData2 = mjpApp.formToJSON('#info2');
		var inputData3 = mjpApp.formToJSON('#info3');
  	var baseObj=Object.assign(inputData1,inputData2,inputData3);
  	//选项数据
  	$$("#baseForm .item-after").each(function(){
  		var id=$$(this).parents('li').attr('id').split('-')[1];
  		var value=$$(this).attr('data-value');
			if(id=='competitorBrands'){
				value=value.split(',');
			}
  		baseObj[id]=value;
  	});
  	//经纬度
  	baseObj.latitude=$$('#omap').attr('data-lat');
  	baseObj.longitude=$$('#omap').attr('data-lng');
  	console.log(baseObj);
  	if(outletId!=undefined){//编辑
  		var last=JSON.parse(storage.getStorage("o"+outletId)).lastModified;
  		baseObj.id=outletId;
  		baseObj.lastModified=last;
  	}
  	console.log(baseObj);
  	$$.ajax({
      url: "http://rap2api.taobao.org/app/mock/1020/POST/api/vi/submitperson",
      type: "POST",
      data: baseObj,
      dataType: "json",
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      },
      success: function(data) {
      	mjpApp.hidePreloader();
        if (data.code == 0) {
          if (data.data.quest) {
            mjpApp.confirm("outlet被更新，是否重新刷新。", "mjp", function() {
              requestAgain(outletId);//重新请求
            },function(){
            	mainView.router.back();
            });
          }
        }
      },
      error: requestFailed
    });
	}else{
		mjpApp.alert('有信息未填写完整，请检查。','');
	}
}
function requestAgain(outletId){
	mjpApp.showPreloader('正在刷新');
	$$.ajax({
	  url: "http://rap2api.taobao.org/app/mock/1020/GET/api/v1/outlet/edit/refresh",
	  type: "GET",
	  data: outletId,
	  dataType: "json",
	  beforeSend: function(xhr) {
	    xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
	  },
	  success: function(data) {
	  	mjpApp.hidePreloader();
	    if (data.code == 0) {
	    	//将数据更新到本地
	    	//storage.setStorage('o'+outletId,JSON.stringify(data.data));
	      if (data.data.msg==1) {//判断是否是审批状态
	        mjpApp.alert("outlet正在审批中", "", function() {
	          mainView.router.back();
	        });
	      }else{
	      	mainView.refreshPage();//刷新当前页面
	      }
	    }
	  },
	  error: requestFailed
	});
}
function computerOutletIdsTobeUpdate(items) {
  if (items != undefined && items != null) {
    var outletIdList = [];
    $$.each(items, function(i, e) {
      var outlet = JSON.parse(storage.getStorage("o" + e.id));
      if (outlet == null) {
        outletIdList.push(e.id);
      } else {
        if (outlet.lastmodified != e.lastmodified) {
          outletIdList.push(e.id);
        }
      }
    });

    return outletIdList;
  }
}

function getRequestParams(ids) {
  if (ids != undefined && ids != null) {
    var params = "";

    $$.each(ids, function(i, e) {
      params += "&id=" + e;
    });

    return params.substring(1);
  }
}

function requestRemoteOutletListAndUpdate(
  listApiUrl,
  cacheKey,
  dataUpdatedCallBack
) {
  var outletIdList;
  axios
    .get(listApiUrl, config)
    .then(function(res) {
      if (res.data.code == 0) {
        outletIdList = res.data.data;
        if (outletIdList != undefined && outletIdList != null) {
          storage.setStorage(cacheKey, JSON.stringify(outletIdList));
        }
      } else {
        console.log("无数据，请检查。");
      }
    })
    .then(function(res) {
      if (outletIdList != undefined && outletIdList != null) {
        var outletIdsTobeUpdate = computerOutletIdsTobeUpdate(outletIdList);
        if (
          outletIdsTobeUpdate != undefined &&
          outletIdsTobeUpdate != null &&
          outletIdsTobeUpdate.length > 0
        ) {
          var params = getRequestParams(outletIdsTobeUpdate);
          axios
            .get(mvoDetailApi + "?" + params, config)
            .then(function(res) {
              if (res.data.code == 0) {
                if (res.data.data != undefined && res.data.data != null) {
                  saveToCache(res.data.data);
                  if (
                    dataUpdatedCallBack != undefined &&
                    dataUpdatedCallBack != null
                  ) {
                    dataUpdatedCallBack(true);
                  }
                }
              } else {
                console.log("无数据，请检查。");
                return;
              }
            })
            .catch(requestFailed);
        } else {
          if (dataUpdatedCallBack != undefined && dataUpdatedCallBack != null) {
            dataUpdatedCallBack(true);
          }
        }
      } else {
        if (dataUpdatedCallBack != undefined && dataUpdatedCallBack != null) {
          dataUpdatedCallBack(false);
        }
      }
    })
    .catch(requestFailed);
}

function saveToCache(items) {
  if (items != undefined && items != null) {
    $$.each(items, function(i, e) {
      storage.setStorage("o" + e.id, JSON.stringify(e));
    });
  }
}
//驳回理由与普查信息是否显示
function surveyAndrecject(action, id) {
	var key = "o" + id;
  var val = JSON.parse(storage.getStorage(key));
  if (action == "assign") {//分配页面不显示
  	!val.recent?requestSurvey(id):$$("#recentsurvey").remove();
    $$("#rejectreason").remove();
  } else if (action == "visedit") {//编辑页面
    $$("#rejectreason").remove();
  } else {//detail页面
    val.approvalState=="ONGOING"?requestRejectReason(id):$$("#rejectreason").remove();
    !val.recent?requestSurvey(id):$$("#recentsurvey").remove();
  }
}
/***
 * 
 * 
 * ***********************普查信息部分开始************************************/
//请求 最近一次普查信息
function requestSurvey(outletId){
	 	$$.ajax({
	  url:surveyApi,
		type:'GET',
		data:{'outletId':2},
		beforeSend:function(xhr){
	  		xhr.setRequestHeader('Authorization',cookie.getCookie('token'));  
	  	},
  	dataType:'json',
    success:function(data){
    	console.log(data);
  		if(data.code==0){
  			var survey=data.data;
				$$('#recenttime').text(timestamp2String(survey.createdTimestamp));
				var tem=survey.data;
				if(tem.sku!=undefined){
					var skus=tem.sku;
					$$('#mjp').html(createSurverItem('mjp',skus));
				}
				if(tem.competitorSku!=undefined){
					var brands=tem.competitorSku;
					$$('#brands').html(createSurverItem('brands',brands));
				}
  		}else{
  			mjpApp.alert(data.msg,'提示');
  		}
    },
    error:function(xhr){
    	ajaxSet.error(xhr,'最近一次普查信息请求失败，请稍后再试。')
    }
	});
}
function createSurverItem(o,arr){
	var html=o=='mjp'?headOfHtml.mjp():headOfHtml.brands();
	for(var line of arr){
		html+='<div class="item-content sameStruct" data-item="'+o+'">'+
	          '<div class="item-inner">'+
	          	'<p>'+line.key+'</p>'+
	          '</div>'+
	          '<div class="item-inner">'+
	            '<input type="text" data-item="sales" value="'+line.volume+'" readOnly />'+
	          '</div>'+
	          '<div class="item-inner">'+
	          	'<input type="text" data-item="price" value="'+line.price+'" readOnly />'+
	          '</div>'+
	        '</div>'
	}
	return html;
}
var headOfHtml={
	mjp:function(){
		var html='<h2>喜力铺货</h2>'+
		        '<div class="item-content">'+
		          '<div class="item-inner">'+
		          	'<p>SKU类别</p>'+
		          '</div>'+
		          '<div class="item-inner">'+
		            '<p>销量 (瓶)</p>'+
		          '</div>'+
		          '<div class="item-inner">'+
		          	'<p>售价 (元)</p>'+
		          '</div>'+
		        '</div>';
		return html;
	},
	brands:function(){
		var html='<h2>竞品信息</h2>'+
		        '<div class="item-content">'+
		          '<div class="item-inner">'+
		          	'<p>名称</p>'+
		          '</div>'+
		          '<div class="item-inner">'+
		            '<p>销量 (瓶)</p>'+
		          '</div>'+
		          '<div class="item-inner">'+
		          	'<p>售价 (元)</p>'+
		          '</div>'+
		        '</div>';
		return html;
	}
}
/***
 * 
 * 
 * ***************************普查信息部分结束**********************************/
//请求驳回的理由 
function requestRejectReason(outletId){
	$$.ajax({
		url:'http://rap2api.taobao.org/app/mock/1020/GET/api/v1/outlet/reject',
		type:'GET',
		data:{
			'outletId':outletId
		},
		dataType:'json',
		/*beforeSend:function(xhr){
	  		xhr.setRequestHeader('Authorization',cookie.getCookie('token')); 
	  	},*/
	  	success:function(data){
	  		if(data.code==0){
	  			var oData=data.data;
	  			$$('#reText').text(oData.msg);
	  		}
	  	},
	  	error:requestFailed
	});
}
//生成分配人员列表
function createPersonList(arr, detailId) {
  var len = arr.length;
  var ohtml = "";
  for (var i = 0; i < len; i++) {
    ohtml +=
      '<li id="' +
      arr[i].id +
      '" class="item-content" onclick="chooseOneperson(this,' +
      detailId +
      ');">' +
      '<div class="item-inner">' +
      '<div class="item-title">' +
      arr[i].name +
      "</div>" +
      '<div class="after">负荷量：' +
      arr[i].load +
      "小时/月</div>" +
      "</div>" +
      "</li>";
  }
  return ohtml;
}
//分配选中某一个人后事件。
function chooseOneperson(obj, detailId) {
  var oDetail = JSON.parse(storage.getStorage("o" + detailId));
  var personId = $$(obj).attr("id"); //被分配的人的ID
  var perName = $$(obj)
    .find(".item-title")
    .text(); //被分配的人的name
  mjpApp.showPreloader("正在提交...");
  $$.ajax({
    url: "http://rap2api.taobao.org/app/mock/1020/POST/api/vi/submitperson",
    type: "POST",
    data: {
      personId: personId,
      detailId: detailId
    },
    dataType: "json",
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
    },
    success: function(data) {
      mjpApp.hidePreloader();
      if (data.code == 0) {
        if (data.data.status) {
          oDetail.eoename = perName;
          storage.setStorage("o" + detailId, JSON.stringify(oDetail));
          mainView.router.back();
          mjpApp.hidePreloader();
        } else {
          mjpApp.alert("分配失败，请重新分配");
          mjpApp.hidePreloader();
        }
      }
    },
    error: requestFailed
  });
}
//解析四级联动数据
function parseOrg(data) {
  var ids = [];
  for (var i = 0; i < data.length; i++) {
    var o = new Object();
    o.i = data[i].id;
    o.n = data[i].name;
    ids.push(o.i);
    if (data[i].sub != undefined) {
      o.s = parseOrg(data[i].sub);
    }
    storage.setStorage("x" + o.i, JSON.stringify(o));
  }
  return ids;
}
//生成选项
function createItem(arr) {
  var ohtml = '<option value="0">不选择</option>';
  var len = arr.length;
  for (var k = 0; k < len; k++) {
    var val = JSON.parse(storage.getStorage("x" + arr[k]));
    ohtml += '<option value="' + val.i + '">' + val.n + "</option>";
  }
  return ohtml;
}

//四级联动
function fourLinkmove(obj, select) {
  if ($$(obj).val() == 0) {
    var str = select.substring(1);
    if (str == "sss-province") {
      $$(".sss-province").html("");
      $$(".sss-city").html("");
      $$(".sss-district").html("");
    } else {
      $$(".sss-district").html("");
    }
  } else {
    var key = "x" + $$(obj).val();
    var aval = JSON.parse(storage.getStorage(key)).s;
    $$(select).html(createItem(aval));
  }
}
//行政区/省/市/区 数据
var xz = {
  data: [
    {
      id: 1,
      name: "华东",
      sub: [
        {
          id: 3,
          name: "上海市",
          sub: [
            {
              id: 4,
              name: "上海市",
              org_level: "city",
              sub: [
                {
                  id: 5,
                  name: "黄浦区"
                },
                {
                  id: 6,
                  name: "徐汇区"
                },
                {
                  id: 7,
                  name: "长宁区"
                },
                {
                  id: 8,
                  name: "静安区"
                },
                {
                  id: 9,
                  name: "普陀区"
                },
                {
                  id: 10,
                  name: "虹口区"
                },
                {
                  id: 11,
                  name: "杨浦区"
                },
                {
                  id: 12,
                  name: "闵行区"
                },
                {
                  id: 13,
                  name: "宝山区"
                },
                {
                  id: 14,
                  name: "嘉定区"
                },
                {
                  id: 15,
                  name: "浦东新区"
                },
                {
                  id: 16,
                  name: "金山区"
                },
                {
                  id: 17,
                  name: "松江区"
                },
                {
                  id: 18,
                  name: "青浦区"
                },
                {
                  id: 19,
                  name: "奉贤区"
                }
              ]
            }
          ]
        },
        {
          id: 20,
          name: "浙江"
        }
      ]
    },
    {
      id: 2,
      name: "华南"
    }
  ]
};
