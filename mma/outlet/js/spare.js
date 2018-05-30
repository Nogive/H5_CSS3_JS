function requestSurvey(outletId){
  $$.ajax({
		url:surveysApi,
		type:'GET',
		data:{
			'id':10
		},
		beforeSend:function(xhr){
	  		var token='7565d360-c57c-4eb3-8598-d26ab99c3b64';
	  		//xhr.setRequestHeader('Authorization',cookie.getCookie('token')); 
	  		xhr.setRequestHeader('Authorization',token);  
	  	},
	  dataType:'json',
  	success:function(data){
  		console.log(data);
  		if(data.code==0){
  			var templateId=data.data.templateId;
  			var sVal=data.data.data;
  			for(var v in sVal){
  				var type=v.split('-')[0];
  				if(type=='MingXi'){
  					var detail=sVal[v];//数组
  					for(var item of detail){
  						for(var o in item){
  							storage.setSession(o,JSON.stringify(item[o]));
  						}
  					}
  				}else{
  					storage.setSession(v,JSON.stringify(sVal[v]));
  				}
  			}
  			createAndShowSurvey(templateId);
  		}else{
  			mjpApp.alert(data.msg,'MJP');
  		}
  	},
  	error:requestFailed
	});
}
//请求普查模板，并显示数据
function createAndShowSurvey(templateId){
	$$.ajax({
		url:surveyTemplateApi,
		type:'GET',
		data:{
			templateId:templateId
		},
		dataType:'json',
		beforeSend:function(xhr){
			var token='7565d360-c57c-4eb3-8598-d26ab99c3b64';
	  		//xhr.setRequestHeader('Authorization',cookie.getCookie('token')); 
	  		xhr.setRequestHeader('Authorization',token); 
	  	},
		success:function(data){
			if(data.code==0){
				var oData=data.data[0];
				$$('.recenttime').text(oData.name+" "+returnTheDate(oData.createdTimestamp,true));
				var aList=JSON.parse(oData.template);
				//console.log(aList);
				var ohtml='';
  			for(var i=0;i<aList.length;i++){
  				if(aList[i].type=='DuoXingWenBen'||aList[i].type=='DuoXuanKuang'){
  					ohtml+=create.showMul(aList[i]);
  				}else if(aList[i].type=='MingXi'){
  					ohtml+=create.showDetail(aList[i]);
  				}else{
  					ohtml+=create.showSingle(aList[i]);
  				}
  			}
  			$$('#infoBox').html(ohtml);
			}else{
				mjpApp.alert(data.msg,'MJP');
			}
		},
		error:requestFailed
	});
};


/*请求value成功存入本地
				var oData=data.data[0];
				$$('.recenttime').text(oData.name+" "+returnTheDate(oData.createdTimestamp,true));
				var aList=JSON.parse(oData.template);
				//console.log(aList);
				var ohtml='';
	  			for(var i=0;i<aList.length;i++){
	  				if(aList[i].type=='DuoXingWenBen'||aList[i].type=='DuoXuanKuang'){
	  					ohtml+=create.showMul(aList[i]);
	  				}else if(aList[i].type=='MingXi'){
	  					ohtml+=create.showDetail(aList[i]);
	  				}else{
	  					ohtml+=create.showSingle(aList[i]);
	  				}
	  			}
	  			$$('#infoBox').html(ohtml);
	  			*/
	  			
/*common里面
	showMul:function(obj){
		var key=obj.id;
		var value=JSON.parse(storage.getSession(key));
		value=typeof value=='string'?value:value.name;
		var ohtml='';
		ohtml='<li class="row bigbox">'+
				'<div class="col-33">'+obj.name+'</div>'+
				'<div class="col-66 textDir">'+value+'</div>'+
			'</li>';
		return ohtml;
	},
	showDetail:function(obj){
		var ohtml='';
		var aDetail=obj.details;
		for(var i=0;i<aDetail.length;i++){
			if(aDetail[i].type=='DuoXingWenBen'||aDetail[i].type=='DuoXuanKuang'){
				ohtml+=create.showMul(aDetail[i]);
			}else{
				ohtml+=create.showSingle(aDetail[i]);
			}
		}
		return '<li>'+
				'<h2>'+obj.name+'</h2>'+
				'<div class="childTable"><ul>'+ohtml
				+'<ul></div>'
			'</li>';
	}
	*/