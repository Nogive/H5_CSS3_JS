/**************请求    URL**************************/
//普查列表
var surveyListApi="http://rap2api.taobao.org/app/mock/1020/GET/api/v1/survey/surveyList";
//var surveyTemplate="http://rap2api.taobao.org/app/mock/1020/GET/api/v1/surveyTemplate";
//var submitApi="http://rap2api.taobao.org/app/mock/1020/GET/api/v1/surveyTemplate";

var surveyTemplate='http://mjp.waiqin.co/api/v1/surveys/templates';
var submitApi='http://mjp.waiqin.co/api/v1/surveys/new';
/**************请求    URL  结束**************************/
var mjpApp=new Framework7({
	init:false,
	//允许webAPP记录URL，以便回退
	pushState:true
});
var $$=Dom7;
var mainView=mjpApp.addView('.view-main',{domCache:true});
//普查列表页面初始化
mjpApp.onPageInit('survey',function(){
	//请求普查列表
	questSurveyList();
	//点击列表去普查
	$$('#surveyList').on('click','.goTosurvey',function(){
		var outletId=$$(this).attr('outletId');
		//判断是否有普查模板
		mainView.router.loadPage('survey.html?id='+outletId);
	});
});
//普查模板页面初始化
mjpApp.onPageInit('surveyTemplate',function(page){
	var outletId=page.query.id;
	mma.setActionMenus(true, [MENU.submit]);
	questSurveyTemplate();
	
	//点击提交按钮
  	mma.setOnActionCallback(function() {
  		outletId=parseInt(outletId);
  		submitSurvey(outletId);
  	});
  	$$('.surBox').on('input propertychange','.comSales input',function(){
  		$$('#salesTotal').text(computeTotal());
  		$$('#mjpTotal').text(computemjpTotal());
  	});
  	
});
mjpApp.onPageBack('surveyTemplate',function(page){
	mma.setActionMenus(false);
});
mjpApp.init();
//请求普查列表
function questSurveyList(){
	$$.ajax({
		url:surveyListApi,
		type:'GET',
		dataType:'json',
		beforeSend:function(xhr){
	  		xhr.setRequestHeader('Authorization',cookie.getCookie('token')); 
	  		mjpApp.showPreloader('正在加载，请稍候。')
		},
		success:function(data){
			if(data.code==0){
				var surverList=data.data;
				$$('#surveyList').html(returnSurveyList(surverList));
			}
			mjpApp.hidePreloader();
		},
		error:function(xhr){
			ajaxSet.error(xhr,'加载失败了，请稍后重试。')
		}
	});
}
function returnSurveyList(arr){
	var html='';
	var len=arr.length;
	if(len>0){
		for(var i=0;i<len;i++){
			html+='<li class="item-content goTosurvey" outletId="'+arr[i].id+'">'+
					'<div class="item-inner">'+
						'<div class="item-title">'+arr[i].name+'</div>'+
						'<div class="item-after"></div>'+
					'</div>'+
				'</li>';
		}
	}
	return html;
}
//请求普查模板
function questSurveyTemplate(id){
	$$.ajax({
		url:surveyTemplate,
		type:'GET',
		data:{"channelId":98,"regionId":861,"recursively":true},
		dataType:'json',
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization",cookie.getCookie('token'));
			mjpApp.showPreloader('正在加载，请稍候。');
		},
		success:function(data){
			if(data.code==0){
				var survey=data.data;
				//$$('#shopname').text(survey.name);
				$$('#cur_template').val(survey.id);
				if(survey.sku!=''&&survey.sku!=undefined){
					var skus=survey.sku.split(',');
					$$('#mjp').html(createSurverItem('mjp',skus));
				}
				if(survey.competitorSku!=''&&survey.competitorSku!=undefined){
					var brands=survey.competitorSku.split(',');
					$$('#brands').html(createSurverItem('brands',brands));
				}
			}
			mjpApp.hidePreloader();
		},
		error:function(xhr){
			ajaxSet.error(xhr,'请求出错了，请稍后再试。');
		}
	});
}
function createSurverItem(o,arr){
	var html=o=='mjp'?headOfHtml.mjp():headOfHtml.brands();
	for(var sku of arr){
		html+='<div class="item-content sameStruct" data-item="'+o+'">'+
	          '<div class="item-inner">'+
	          	'<p class="keyName">'+sku+'</p>'+
	          '</div>'+
	          '<div class="item-inner comSales">'+
	            '<input type="number" data-item="sales" />'+
	          '</div>'+
	          '<div class="item-inner">'+
	          	'<input type="number" data-item="price" />'+
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

//提交数据
function submitSurvey(outletId){
	var templateId=parseInt($$('#cur_template').val());
	var surData={
		'outletId':outletId,
		'templateId':templateId,
		data:collectSurveyData()
	};
	console.log(surData);
	$$.ajax({
		url:submitApi,
		type:'POST',
		data:JSON.stringify(surData),
		dataType:'json',
		contentType: "application/json; charset=utf-8",
		beforeSend:function(xhr){
			xhr.setRequestHeader("Authorization",cookie.getCookie('token'));
			mjpApp.showPreloader('正在提交，请稍候。');
		},
		success:function(data){
			console.log(data);
			mjpApp.hidePreloader();
			if(data.code==0){
				mainView.router.back();
			}else{
				mjpApp.alert(data.msg,'提示');
			}
		},
		error:function(xhr){
			ajaxSet.error(xhr,'提交失败了，请稍后重试。')
		}
	});
}
//收集普查数据
function collectSurveyData(){
	var allData={
		sku:[],
		competitorSku:[],
		totalVolume:parseInt($$('#salesTotal').text()),
		skuVolume:parseInt($$('#mjpTotal').text())
	};
	$$(".sameStruct").each(function() {
	    var dataItem = $$(this).attr("data-item");
	    var o = {};
	    o.key = $$(this)
	      .find(".keyName")
	      .text();
	    var $input = $$(this).find("input");
	    $input.each(function() {
	      var val = $$(this).val();
	      var inputItem = $$(this).attr("data-item");
	      var v = 0;
	      if (val != "") {
	        if (inputItem == "sales") {
	          o.volume = parseInt(val);
	        } else {
	          o.price = parseFloat(val);
	        }
	      }
	    });
	    dataItem == "mjp" ? allData.sku.push(o) : allData.competitorSku.push(o);
	});
	return allData;
}

//时间戳==>指定时间格式
function timestamp2String(timestamp) {
  var date = new Date(timestamp);
  var mm = date.getMonth() + 1;
  var dd = date.getDate();

  return [
    date.getFullYear(),
    "-",
    (mm > 9 ? "" : "0") + mm,
    "-",
    (dd > 9 ? "" : "0") + dd
  ].join("");
}
//计算体量
function computeTotal(){
	var total=0;
	$$('.comSales input').each(function(){
		var value=$$(this).val();
		var v=value==''?0:parseInt(value);
		total+=v;
  	});
  	return total;
}
function computemjpTotal(){
	var total=0;
	$$('.comSales input').each(function(){
		var value=$$(this).val();
		var type=$$(this).parents('.sameStruct').attr('data-item');
		var v=value==''?0:parseInt(value);
		if(type=='mjp'){
			total+=v;
		}
  	});
  	return total;
}

