var tempUrl='http://rap2api.taobao.org/app/mock/1020/api/v1/mjpTree/add';
"use strict";
var file;
$(document).ready(function() {
//计划同步
//日期配置
  $(".date").datetimepicker({
    language: "zh-CN",
    format: "yyyy-mm",
    autoclose: 1,
    startView: 3,
    minView: 3,
    maxView: 3,
    viewSelect: 3
  });
$('#asyncPlan').click(function(){
    var mInput =$("#monthOfplan").val();
    if (mInput == "") {
    	opts.alert("请选择要进行同步的月份。");
    } else {
    	mInput = mInput.split(" ")[0] + " 00:00:00";
      var timestamp = Date.parse(mInput);
      synchronizePlan(timestamp);
    }
});
//基础数据同步
	$('#basicBtn button').click(function(){
		let name=$(this).text();
		let obj={
			title:name+'被点击了',
			msg:'同步'+name+'的内容'
		}
		openPromptModal(obj);
	});
//网点数据上传
  $("#inputfile").change(function() {
    file = this.files[0];
    $(".fileTip")
      .hide()
      .removeClass("required");
  });
  $("#upload").click(function() {
    if (file == undefined) {
      $(".fileTip")
        .addClass("required")
        .show();
    } else {
      var formData = new FormData();
      formData.append("file", file);
      uploadOutlet(formData);
    }
  });
});
function uploadOutlet(formData){
	var formData={};
	$.ajax({
        url: tempUrl,
        type: "POST",
        //cache: false,
        data: formData,
        //processData: false,
        //contentType: false,
        //mimeType: "multipart/form-data",
        success: function(data) {
          if (data == undefined) {
            noData();
          } else if (data.code == $g.API_CODE.OK) {
            file = undefined;
            $("#inputfile").val("");
            let obj={
            	title:'网点数据上传',
            	msg:'网点数据上传请求已发送，正在导入'
            }
            openPromptModal(obj);
          } else {
            codeError(data, "网点数据上传");
          }
          opts.hideLoading();
        },
        error: function(xhr) {
          opts.hideLoading();
          failResponse(xhr);
        }
    });
}
//async plan
function synchronizePlan(timestamp) {
  $.ajax({
    url: $g.API_URL.PLAN_QUERY_BY_STAFF.compose(host),
    type: "GET",
    data: {month:timestamp},
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      opts.showLoading();
    },
    success: function(data) {
      if (data == undefined) {
        noData();
      } else if (data.code == $g.API_CODE.OK) {
        let obj={
        	title:'同步拜访计划',
        	msg:'同步拜访计划请求已发送'
        }
        openPromptModal(obj);
      } else {
        codeError(data, "同步拜访计划");
      }
      opts.hideLoading();
    },
    error: function(xhr) {
      opts.hideLoading();
      failResponse(xhr);
    }
  });
}


function openPromptModal(obj){
	$('#asyncTitle').text(obj.title);
	$('#asyncMsg').text(obj.msg);
	$('#asyncModal').modal({backdrop:'static'});
}
