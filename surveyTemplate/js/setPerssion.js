"use strict";
var res = {
  noUser:
    '<li><a href="javascript:;" class="nobg">暂时没有人员可以绑定，请联系管理员</a></li>',
  loadMoreUser: '<a id="loadMoreStaff" href="javascript:;">加载更多...</a>'
};
var userNextPageSign;
var size = constant.mvoNum;
var setView = { fontCss: { color: "#333", "font-weight": "normal" } };
var searchKey = "";

var staffMap=[];
var employeeMap=[];
var optionForBind;
var currentstaffId;//bind or unbind staffId
var unbindEoeId;//unbind eoeId

$(document).ready(function() {
  //请求人员列表
  questPersonList();
  //新增按钮
  $("#pageAdd").on("click", function() {
    $("#addNotSalesModal").modal({backdrop:'static'});
  });
  //新增设置数据权限
  $('#setScope').click(function(){
  	$(this).prev().find('.red').hide();
  	$("#sitName").text('新增岗位');
  	$("#treeModal").modal({backdrop:'static'});
  });
  $("#addNotSalesModal").on("show.bs.modal", function() {
    $("#staffName")
      .removeAttr("tarId")
      .val("");
    $(this)
      .find("#theRole")
      .removeAttr("tarId")
      .text(" ");
    questNotSaleRole();
  });
  $("#pageAddBtn").on("click", function() {
    addModalSureBtn(this);
  });
  //绑定或解绑某个人
  //请求user List
  $("#pageBindModal").on("show.bs.modal", function() {
    searchKey = "";
    if (optionForBind) {
      getUserList();
    }
  });
  //人员列表搜索
  $("#tipText").on("click", "#searchBtn", function() {
    let searchText = $("#searchUser").val();
    searchPerson(searchText);
  });
  //load more
  $(".modal-body").on("click", "#loadMoreStaff", function() {
    loadMoreUser();
  });
	//TODO：绑定，解绑
  $("#staffList").on("click", ".bindPerson", function() {
  	optionForBind=true;
  	currentstaffId=$(this).parents('tr').attr('id').substring(7);
    bindModal();
  });
  $("#staffList").on("click", ".unbindPerson", function() {
  	optionForBind=false;
  	currentstaffId=$(this).parents('tr').attr('id').substring(7);
  	unbindEoeId=$(this).parent().attr('id').substring(3);
    unbindModal();
  });
  
  $("#pageBindBtn").on("click", function() {
    bindModalSureBtn(this);
  });
  //设置数据权限
  $("#staffList").on("click", ".setRange", function() {
    var id = $(this).attr("data-sit"); //整个岗位的ID
    var currentStaff = staffMap[id];
    var sitName = currentStaff.name + " " + currentStaff.roleName;
    $("#sitName").text(sitName);
    $("#treeModal")
      .attr("data-sit",id)
      .modal();
  });
  //数据权限里面的modal Tree
  $("#treeModal").on("show.bs.modal", function() {
    var id = $(this).attr("data-sit");
    var curScope="";
    if(id==undefined){
    	let addScope=$('#setScope').attr('data-scope');
    	if(addScope!=undefined){
    		curScope=addScope;
    	}
    }else{
    	var staff = staffMap[id];
    	if(staff.departments != undefined){
    		curScope=joinScopeId(staff.departments);
    	} 
    }
    var mjpTree = $.fn.zTree.getZTreeObj("mjpOg");
    mjpTree.setting.check.enable = true;
    mjpTree.setting.view = setView;
    mjpTree.refresh();
    reseTreeStatus(mjpTree);
    if (curScope != null && curScope != "") {
      selectedCurrentNode(mjpTree, curScope);
    }
  });
  $("#setBtn").click(function() {
    setPermissSureBtn(this);
  });
  //删除按钮
  $("#staffList").on("click", ".deleteStaff", function() {
    deleteStaff(this);
  });
  //suit height
  let fillH = $(".right_col").height() - $("#fillHeight").offset().top;
  $("#fillHeight").css("height", fillH);
});
function deleteStaff(obj) {
  var id = $(obj).parents('tr').attr('id').substring(7);
  var currentStaff = staffMap[id];
  if (currentStaff.employees != undefined) {
    opts.alert(
      "该职位上有绑定的人员，请先进行解绑。"
    );
  } else {
    var text = '是否对"' + currentStaff.name + '"职位进行删除操作？';
    opts.tip(text, "delete", id);
  }
}
//是否确定进行删除操作
function questWhich(action, parameter) {
  var parData = new FormData();
  parData.append("id", parseInt(parameter));
  $.ajax({
    url: $g.API_URL.STAFF_REMOVING.compose(host),
    type: "DELETE",
    data: parData,
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    success: function(data) {
      if (data.code == $g.API_CODE.OK) {
        $("#perObj_" + data.data).remove();
        staffMap.splice(data.data,1);
        showNotify("success", "删除成功", "该职位被删除");
      } else {
        var resText = matchResCode(data.code);
        showNotify("error", "删除失败", resText);
      }
    }
  });
}
function reseTreeStatus(mjpTree) {
  mjpTree.expandAll(true);
  var nodes = mjpTree.getCheckedNodes(true);
  if (nodes != null) {
    for (var node of nodes) {
      mjpTree.checkNode(node, false, false);
    }
  }

  var root = mjpTree.getNodeByParam("pId", null);
  mjpTree.setChkDisabled(root, false, true, true);
}

//当前有scope的默认选中
function selectedCurrentNode(mjpTree, departments) {
  if (departments != null) {
    departments = departments.split(",");
    for (var department of departments) {
      var node = mjpTree.getNodeByParam("id", department);
      mjpTree.checkNode(node, true, false);

      if (node.getParentNode() != null) {
        mjpTree.setChkDisabled(node.getParentNode(), true, true, false);
      }

      var childNodes = node.children;
      if (childNodes != null) {
        for (var child of childNodes) {
          mjpTree.setChkDisabled(child, true, false, true);
        }
      }
    }
  }
}

function questNotSaleRole() {
  $.ajax({
    url: $g.API_URL.BASE_DATA_RETRIEVAL.compose(host),
    type: "GET",
    data: { dataType: "role" },
    success: function(data) {
      if (data.code == 0) {
        var html = "";
        var objData = returnSales(data.data, false);
        $("#noSalesroleList").html(generateRoleList(objData));
      }
    }
  });
}
//新增modal  确定
function addModalSureBtn(obj) {
  var flag = true;
  //表单验证
  var staffName = $("#staffName").val();
  var chooseId = $("#theRole").attr("tarId");
  let scope=$('#setScope').attr('data-scope');
  if (staffName == "") {
    $("#staffName")
      .next()
      .show();
    flag = false;
  }
  if (chooseId == undefined) {
    $("#theRole")
      .next()
      .show();
    flag = false;
  }
  if (scope == undefined) {
    $("#setScope")
      .prev().find('.red')
      .show();
    flag = false;
  }
  //验证通过
  if (flag) {
    $("#addNotSalesModal").modal("hide");
    opts.showLoading();
    let departments=scope.split(',');
    let newData=new FormData();
    newData.append('name',staffName);
    newData.append('roleId',chooseId);
    departments.forEach(e=>{
    	newData.append('departmentId',e);
    });
    $.ajax({
      url: $g.API_URL.STAFF_COMMON_CREATING.compose(host),
      type: "POST",
      data: newData,
      processData:false,
      contentType:false,
      mineType:"multipart/form-data",
      success: function(data) {
        if (data.code == 0) {
          staffMap[data.data.id]=data.data;
          let addStaff=[];
          addStaff.push(data.data);
          $("#staffList").append(returnPersonListContent(addStaff));
          opts.hideLoading();
        } else {
          codeError(data, "新增出错");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "新增岗位失败");
      }
    });
  }
}
//数据权限modal  确定
function setPermissSureBtn(obj) {
  var mjpTree = $.fn.zTree.getZTreeObj("mjpOg");
  var id = $(obj)
    .parents(".modal")
    .attr("data-sit"); 
  var checkedNodes = mjpTree.getCheckedNodes(true);
  if(checkedNodes.length==0){
  	opts.alert('数据权限不能为空，请设置数据权限。');
  }else{
  	if(id==undefined){
	  	setDataScopeForAdd(checkedNodes);
	  }else{
	  	opts.showLoading();
	  	changeDataScope(id,checkedNodes)
	  }
  }
}
function setDataScopeForAdd(checkedNodes){
	let checks=[];
	checkedNodes.forEach(e=>{
		checks.push(e.id);
	})
	let dataText = joinTextTogetherForAdd(checkedNodes);
	$('#setScope').html(dataText).attr('data-scope',checks);
	$("#treeModal").modal("hide");
}
function changeDataScope(id,checkedNodes){
	var data = new FormData();
  data.append("id", id);
  checkedNodes.forEach(e=>{
  	data.append("departmentId", e.id);
  });
  $("#treeModal").modal("hide");
  $.ajax({
    url: $g.API_URL.STAFF_COMMON_EDITING.compose(host),
    type: "PUT",
    data: data,
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    success: function(data) {
      if (data.code == 0) {
      	console.log(data.data);
      	let staff=data.data;
      	staffMap[staff.id]=staff;
        let newScope = data.data.departments;
        if (newScope.length > 0) {
          var scopeText = joinTextTogether(newScope);
        } else {
          var scopeText = "暂无";
        }
        $("#perObj_" + id + " td:eq(3)")
          .find("span")
          .html(scopeText);
        opts.hideLoading();
      } else {
        codeError(data, "设置权限出错");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "设置数据权限失败");
    }
  });
}
function joinTextTogether(arr) {
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    str += "<cite>" + arr[i].name + "</cite>";
  }
  return str;
}
function joinTextTogetherForAdd(arr) {
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    str += "<span>" + arr[i].staffName + "</span>";
  }
  return str;
}
function questPersonList() {
  opts.showLoading();
  $.ajax({
    url: $g.API_URL.STAFF_COMMON_RETRIEVAL.compose(host),
    type: "GET",
    success: function(data) {
      if (data.code == $g.API_CODE.OK) {
        var staffList = data.data;
        staffList.forEach(function(e){
        	staffMap[e.id]=e;
        	if(e.employees!=undefined){
        		let eoes=e.employees;
        		eoes.forEach(e=>{
        			employeeMap[e.employeeId]=e;
        		})
        	}
        });
        console.log(staffMap);
        console.log(employeeMap);
        $("#staffList").append(returnPersonListContent(staffList));
        opts.hideLoading();
      } else {
        codeError(data, "出错了");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "请求其他人员列表失败了");
    }
  });
}
//返回列表内容
function returnPersonListContent(staffList) {
  var html = "";
  if(staffList==undefined||staffList.length==0){
  	html='<tr><td colspan="4">暂无<td><tr>';
  }else{
  	staffList.forEach(function(e){
  		let scope = e.departments == undefined ? "暂无" : joinTextTogether(e.departments);
  		//TODO:employees 数据
  		let employ='';
  		if(e.employees!=undefined){
  			let eoes=e.employees;
  			eoes.forEach(function(e){
  				employ+='<p id="eoe'+e.employeeId+'">'+e.employeeName+'('+e.employeeId+')<a class="fa fa-unlink pull-right unbindPerson" href="javascript:;">解绑</a></p>'
  			})
  		}else{
  			employ='<p>空缺</p>'
  		}
      let deleteBtn;
      let setScopeBtn;
      if (e.roleId == $g.ROLE.ADMIN) {
        deleteBtn = "";
        setScopeBtn = "";
      } else {
        deleteBtn =
          '<a  class="pull-right deleteStaff" href="javascript:;"><i class="fa fa-trash"></i>删除</a>';
        setScopeBtn =
          '<a  data-sit="' +
          e.id +
          '" data-user="' +
          e.employeeId +
          '" class="pull-right setRange" href="javascript:;"><i class="iconfont">&#xe60b;</i>设置</a>';
      }
      html +=
        '<tr id="perObj_' +
        e.id +
        '">' +
        "<td><span>" +
        e.name +
        "</span>" +
        deleteBtn +
        "</td>" +
        '<td>' +
        e.roleName +
        "</td>" +
        "<td>" +
        '<p><a class="fa fa-link bindPerson" href="javascript:;">绑定</a></p>'+
        employ +
        "</td>" +
        "<td><span>" +
        scope +
        "</span>" +
        setScopeBtn +
        "</td>" +
        "</tr>";
  	});
  }
  return html;
}
function joinTogether(arr) {
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    str += arr[i].name + " ";
  }
  return str;
}
function joinScopeId(arr) {
  var ids = [];
  for (var i = 0; i < arr.length; i++) {
    ids.push(arr[i].id);
  }
  return ids.join(",");
}
//绑定蒙版上面的内容
function bindModal(){
	let staff=staffMap[currentstaffId];
	let tips="对角色为" + staff.roleName + " 的岗位:" + staff.name;
	let html =
      "<p><b>" +
      tips +
      "</b> 进行人员绑定</p>" +
      '<div class="form-group top_search">' +
      '<div class="input-group">' +
      '<input type="text" class="form-control" placeholder="输入关键字搜索" id="searchUser">' +
      '<span class="input-group-btn">' +
      '<button class="btn btn-default" type="button" id="searchBtn">搜索</button>' +
      "</span>" +
      "</div>" +
      "</div>" +
      '<p>请选择要绑定的人员: <input class="endItem" id="theUser" /><span class="red paddleft10 display-none">*请选择角色</span></p>' +
      '<div class="col-md-12 col-sm-12 col-xs-12">' +
      '<ul class="to_do" id="userList"></ul>' +
      '<p class="loadMore" id="more"></p>' +
      "</div>";
  $("#bindLabel").text('绑定人员');
  $("#tipText").html(html);
  $("#pageBindModal")
    .modal({ backdrop: "static" });
}
function unbindModal(){
	let staff=staffMap[currentstaffId];
	let tips="是否对角色为" + staff.roleName + " 的岗位:" + staff.name;
	let html =
      "<p><b>" +
      tips +
      "</b> 上绑定的人员:<b>" +
      employeeMap[unbindEoeId].employeeName +
      "</b><br>进行解绑？</p>";
  $("#bindLabel").text('解绑人员');
  $("#tipText").html(html);
  $("#pageBindModal")
    .modal({ backdrop: "static" });
}

//绑定——确定按钮
function bindModalSureBtn(obj) {
  var flag = true;
  if (optionForBind) {
    //绑定
    var chooseId = $("#theUser").attr("tarId"); //验证
    if (chooseId == undefined) {
      $("#theUser")
        .next()
        .show();
      flag = false;
    }
    if (flag) {
      var data = {
        id: currentstaffId, //id
        employeeId: chooseId,
        unbinding: false,
        employeeName: $("#theUser").val()
      };
    }
  } else {
    var data = {
      id: currentstaffId,
      employeeId: unbindEoeId,
      unbinding: true
    };
  }
  toBindOrNot(data);
}
//发送绑定人员请求
function toBindOrNot(data) {
  $("#pageBindModal").modal("hide");
  opts.showLoading();
  let unbind = data.unbinding;
  let eoeId=data.employeeId;
  $.ajax({
    url: $g.API_URL.STAFF_ASSIGNATION.compose(host),
    type: "PUT",
    data: data,
    success: function(data) {
      if (data.code == 0) {
        console.log(data.data);
        let staff=data.data;
        staffMap[staff.id]=staff;
        if(unbind){
        	if(staff.employees!=undefined){
        		$('#eoe'+eoeId).remove();
        	}else{
        		let html='<p><a class="fa fa-link bindPerson" href="javascript:;">绑定</a></p><p>空缺</p>';
        		$('#perObj_'+staff.id+' td:eq(2)').html(html);
        	}
        }else{
        	let eoes=staff.employees;
        	let html='<p><a class="fa fa-link bindPerson" href="javascript:;">绑定</a></p>';
        	eoes.forEach(e=>{
        		employeeMap[e.employeeId]=e;
        		html+='<p id="eoe'+e.employeeId+'">'+e.employeeName+' ('+e.employeeId+')<a class="fa fa-unlink pull-right unbindPerson" href="javascript:;">解绑</a></p>';
        	});
        	$('#perObj_'+staff.id+' td:eq(2)').html(html);
        }
        opts.hideLoading();
      } else {
        var text = unbind ? "解绑出错了" : "绑定出错了";
        codeError(data, text);
      }
    },
    error: function(xhr) {
      var text = unbind ? "解绑失败了" : "绑定失败了";
      failResponse(xhr, text);
    }
  });
}
/************************************************************************************************ */
//请求person列表
function getUserList() {
  $.ajax({
    url: $g.API_URL.EMPLOYEE_UNBINDING_RETRIEVAL.compose(host),
    data: { pageSize: size },
    type: "GET",
    success: function(data) {
      if (data.code == $g.API_CODE.OK) {
        let html = showCurrentUsers(data.data);
        $("#userList").html(html);
      } else {
        codeError(data, "人员列表请求出错");
      }
    }
  });
}

function showCurrentUsers(obj) {
  let html = "";
  userNextPageSign = obj.nextPageSign; //下一页的pageSign
  if (obj.total == 0) {
    html = res.noUser;
  } else {
    let records = obj.records; //返回的记录数组
    let loadBtn = "";
    if (userNextPageSign != undefined) {
      loadBtn = res.loadMoreUser;
    }
    $("#more").html(loadBtn);
    html = getPersonHtml(records);
  }
  return html;
}
//返回列表的HTMl代码
function getPersonHtml(arr) {
  let html = "";
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    let jedAddress =
      arr[i].jedAddress == undefined || arr[i].jedAddress == ""
        ? "暂无"
        : arr[i].jedAddress;
    html +=
      "<li>" +
      '<a href="javascript:;" data-roleId="' +
      arr[i].employeeId +
      '">' +
      arr[i].name +
      "_" +
      arr[i].employeeId +
      "_" +
      jedAddress +
      "</a>" +
      "</li>";
  }
  return html;
}
