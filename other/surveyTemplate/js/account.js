"use strict";
var size = constant.mvoNum; //每页多少条数据
var staffMap = [];
var userMap = [];
var userNextPageSign;
var staffNextPageSign;
var userKey = ""; //search current key
var staffKey = ""; //search old  key
var loadAll = false;
var res = {
  noUser: '<tr><td colspan="5"><b>暂无记录</b></td></tr>',
  noStaff: "<li><p>暂无记录。</p></li>",
  loadMoreUser:
    '<a id="loadMore" href="javascript:;" class="btn btn-default">加载更多...</a>',
  loadMoreSatff: '<a id="loadMoreStaff" href="javascript:;">加载更多...</a>'
};
var selectAccount;
$(document).ready(function() {
  //suit table height
  let tableHeight =
    $(".right_col").height() -
    $(".accIndic").offset().top -
    $(".pageAndbtn ").height() -
    30;
  $(".accIndic").css("height", tableHeight);
  let trH = $(".headings").height();
  size = Math.floor(tableHeight / trH);

  questAccountList();
	questAreaTree();
	
  //loadmore user
  $("#moreUser").on("click", "#loadMore", function() {
    loadMoreUser();
  });
  //search
  $("#goSearch").click(function() {
    let searchText = $("#searchUser").val();
    searchUserInCurrent(searchText);
  });
  $("#searchUser").on("keypress", function(event) {
    if (event.keyCode === 13) {
      let searchText = $("#searchUser").val();
      searchUserInCurrent(searchText);
    }
  });
  /*添加账户按钮******************************************************************/
  $("#addBySource").click(function() {
    questSystemAccount();
  });
  $("#addVirtual").click(function() {
    $("#virtureModal").modal({ backdrop: "static" });
  });
  $("#virtureModal").on("show.bs.modal", function() {
    staffKey = "";
    $(".writeItem .error")
      .text("")
      .removeClass("required");
    $("#fullname,#hrCode,#password,#jedAddress,#passagain").val("");
  });
  $("#virtureSure").click(function() {
    if (validateVirtureAccount()) {
      addVirtureAccount();
    }
  });
  /*从原系统modal btn*****************************************************************************/
  $("#systemModal").on("show.bs.modal", function() {
    $("#searchTip").text("");
    $("#searchText")
      .val("")
      .attr("placeholder", "输入关键字搜索");
  });
  $("#oldSystem").on("click", ".fromOriginal", function(e) {
    e.stopPropagation();
    $("#searchTip").text("");
    if ($(this).hasClass("checked")) {
      $(this).removeClass("checked");
    } else {
      $(this).addClass("checked");
    }
  });
  $("#systemAll").click(function() {
    $("#searchTip").text("");
    $(".fromOriginal").addClass("checked");
  });
  $("#noOne").click(function() {
    $(".fromOriginal").removeClass("checked");
  });
  $("#systemSure").click(function() {
    let params = returnCheckedId(".fromOriginal");
    if (params.length == 0) {
      $("#searchTip").text("请选择要添加的账户");
    } else {
      importFormStaff(params);
    }
  });
  //search
  $("#searchBtn").click(function() {
    let search = $("#searchText").val();
    searchAccount(search);
  });
  $("#searchText").on("keypress", function(event) {
    if (event.keyCode === 13) {
      let searchText = $("#searchText").val();
      searchAccount(searchText);
    }
  });
  //loadmore staff
  $("#more").on("click", "#loadMoreStaff", function() {
    loadMoreSatff();
  });
  /*关闭、选中、开启、全选******************************************************************************** */
  //one close or open
  $("#accountBox").on("click", ".turn", function() {
    let id = parseInt(
      $(this)
        .parents("tr")
        .attr("id")
        .substring(4)
    );
    //let param = [id];
    selectAccount = [id];
    let inactive = userMap[id].inactive;
    let msg = inactive ? "是否执行开启账户的操作？" : "是否执行关闭账户的操作";
    opts.tip(msg, inactive, "");
  });
  //multi close or open
  $("#closeAccount").click(function() {
    selectAccount = checkSatisfaction(false);
    if (selectAccount.length > 0) {
      opts.tip("是否执行批量关闭账户的操作？", false, "");
    }
  });
  $("#openAccount").click(function() {
    selectAccount = checkSatisfaction(true);
    if (selectAccount.length > 0) {
      opts.tip("是否执行批量开启账户的操作？", true, "");
    }
  });
  $("#accountBox").on("click", ".delete", function() {
    let id = parseInt(
      $(this)
        .parents("tr")
        .attr("id")
        .substring(4)
    );
    let msg = "是否执行删除账户的操作？";
    opts.tip(msg, "delete", id);
  });
  $("#accountBox").on("click", ".changeProvinces", function() {
    let id = parseInt(
      $(this)
        .parents("tr")
        .attr("id")
        .substring(4)
    );
    $('#areaModal').modal({backdrop:'static'}).attr('accountId',id)
  });
  $('#areaModal').on('show.bs.modal',function(){
  	let areaTree = $.fn.zTree.getZTreeObj('mjpArea');
  	tree.raseTree(areaTree);
		let pNodes = areaTree.getNodesByParam("pId", null);
		pNodes.forEach(function(e){
			areaTree.setChkDisabled(e,true,false,false);
		})
  });
  $('#districtBtn').click(function(){
  	let accountId=$(this).parents('.modal').attr('accountId');
  	let areaTree = $.fn.zTree.getZTreeObj('mjpArea');
  	let nodes=areaTree.getCheckedNodes();
  	if(nodes.length>0){
  		let params={
  			id:accountId,
  			regionId:nodes[0].id
  		}
  		editProvinces(params);
  	}else{
  		opts.alert('请勾选要更改的城市');
  	}
  });
  /*效果部分*********************************************************************/
  //全选
  $("#checkAll").click(function() {
    let check = $(this).attr("data-check");
    if (check == "true") {
      $(this)
        .attr("data-check", "false")
        .children()
        .removeClass("checked");
      $(".fromCurrent").removeClass("checked");
    } else {
      $(this)
        .attr("data-check", "true")
        .children()
        .addClass("checked");
      $(".fromCurrent").addClass("checked");
    }
  });
  //单个勾选
  $("#accountBox").on("click", ".fromCurrent", function() {
    let check = $(this).hasClass("checked");
    if (check) {
      $(this).removeClass("checked");
    } else {
      $(this).addClass("checked");
    }
  });
  //取消输入提示
  $(".writeItem input").click(function() {
    $(this)
      .prev()
      .find(".error")
      .text("")
      .removeClass("required");
  });
});


//地区树
  var areaSetting = {
	  edit: {
	    enable: false
	  },
	  data: {
	    simpleData: {
	      enable: true //使用简单模式
	    }
	  },
	  check: {
	    enable: true, //节点上是否显示选中框
	    chkStyle: "checkbox"
	  },
	  callback: {
	    beforeClick: function(treeId, treeNode) {
	      return false;
	    },
	    beforeCheck: function(treeId, treeNode) {
	      clickOneNode(treeId, treeNode);
	    }
	  }
	};
  //请求省市区树
  function questAreaTree(){
  	$.ajax({
      url: $g.API_URL.REGION_PROVINCE_CITY.compose(host),
      type: "GET",
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      },
      success: function(data) {
        if (data == undefined) {
          noData("无法从服务器获取省市区数据");
        } else if (data.code == $g.API_CODE.OK) {
          $.fn.zTree.init($("#mjpArea"), areaSetting, data.data);
  				var areaTree = $.fn.zTree.getZTreeObj("mjpArea");
        } else {
          codeError(data, "加载省市区");
        }
      },
      error: function(xhr) {
        failResponse(xhr);
      }
    });
  }
  function clickOneNode(treeId, treeNode) {
  	let areaTree = $.fn.zTree.getZTreeObj(treeId);
		var roots = areaTree.getNodesByParam("pId", null);
		roots.forEach(function(e){
			if(e.id==treeNode.pId){
				let brothers=e.children;
				brothers.forEach(function(b){
					if(b.id!=treeNode.id){
						if(treeNode.checked){
							areaTree.setChkDisabled(b,false,false,false);
						}else{
							areaTree.setChkDisabled(b,true,true,false);
						}
					}
				})
			}else{
				if(treeNode.checked){//取消
					areaTree.setChkDisabled(e,false,false,true);
					areaTree.setChkDisabled(e,true,false,false);
				}else{
					areaTree.setChkDisabled(e,true,false,true);
				}
				
			}
		})
  }
  
  function editProvinces(params){
  	$('#areaModal').modal('hide');
  	opts.showLoading();
	  $.ajax({
	    type: "GET",
	    url: $g.API_URL.EMPLOYEE_RETRIEVAL.compose(host),
	    data: params,
	    success: function(data) {
	      if (data == undefined) {
	        noData();
	      } else if (data.code == $g.API_CODE.OK) {
	      	console.log(data.data);
	        showNotify('success','成功','更改省市区成功')
	      } else {
	        codeError(data, "更改省市区");
	      }
	      opts.hideLoading();
	    },
	    error: function(xhr) {
	      opts.hideLoading();
	      failResponse(xhr);
	    }
	  });
  }
/*页面请求******************************************************************/
//获取当前账号
function questAccountList() {
  opts.showLoading();
  $.ajax({
    type: "GET",
    url: $g.API_URL.EMPLOYEE_RETRIEVAL.compose(host),
    data: { pageSize: size },
    success: function(data) {
      opts.hideLoading();
      if (data == undefined) {
        noData();
      } else if (data.code == $g.API_CODE.OK) {
        if (data.data == undefined || data.data.length == 0) {
          noDetailData();
        } else {
          let html = showAccount(data.data);
          $("#accountBox").html(html);
        }
      } else {
        codeError(data, "加载账户列表");
      }
    },
    error: function(xhr) {
      opts.hideLoading();
      failResponse(xhr);
    }
  });
}
function showAccount(obj) {
  let html = "";
  userNextPageSign = obj.nextPageSign; //下一页的pageSign
  if (obj.total == 0) {
    html = res.noUser;
    $("#moreUser").html("");
  } else {
    let records = obj.records; //返回的记录数组
    saveToMap(records, userMap);
    let loadBtn = "";
    if (userNextPageSign != undefined) {
      loadBtn = res.loadMoreUser;
    }
    $("#moreUser").html(loadBtn);
    html = generateUserList(records);
  }
  return html;
}
//generate user
function generateUserList(arr) {
  let html = "";
  arr.forEach(e => {
    let bgColor = e.inactive ? "enableBg" : "";
    let btn = getCurrentOption(e.inactive);
    let jedAddress =
      e.jedAddress == undefined || e.jedAddress == "" ? "暂无" : e.jedAddress;
    let ldapId = e.ldapId == undefined ? "" : e.ldapId;
    let provinces=e.provinces==undefined?'暂无':e.provinces;
    html +=
      '<tr class="idElem ' +
      bgColor +
      '" id="acc_' +
      e.employeeId +
      '">' +
      '<td class="a-center ">' +
      '<div class="icheckbox_flat-green fromCurrent" style="position: relative;">' +
      '<ins class="iCheck-helper"></ins>' +
      "</div>" +
      "</td>" +
      "<td>" +
      e.name +
      "</td>" +
      "<td>" +
      ldapId +
      "</td>" +
      "<td>" +
      e.employeeId +
      "</td>" +
      "<td>" +
      jedAddress +
      "</td>" +
      "<td>" +
      provinces +
      "</td>" +
      "<td>" +
      btn +
      "</td>" +
      "</tr>";
  });
  return html;
}
//search in current system
function searchUserInCurrent(text) {
  opts.showLoading();
  $.ajax({
    type: "GET",
    url: $g.API_URL.EMPLOYEE_RETRIEVAL.compose(host),
    data: { pageSize: size, q: text },
    success: function(data) {
      opts.hideLoading();
      if (data == undefined) {
        noData();
      } else if (data.code == $g.API_CODE.OK) {
        let html = showAccount(data.data);
        $("#accountBox").html(html);
        userKey = text;
      } else {
        codeError(data, "搜索账户");
      }
    },
    error: function(xhr) {
      opts.hideLoading();
      failResponse(xhr);
    }
  });
}
//load more user
function loadMoreUser() {
  let nextPageSign = userNextPageSign;
  let searchData = { pageSize: size, pageSign: nextPageSign };
  if (userKey != "") {
    searchData.q = userKey;
  }
  opts.showLoading();
  $.ajax({
    type: "GET",
    url: $g.API_URL.EMPLOYEE_RETRIEVAL.compose(host),
    data: searchData,
    success: function(data) {
      if (data == undefined) {
        noData();
      } else if (data.code == $g.API_CODE.OK) {
        if (data.data == undefined) {
          noDetailData();
        } else {
          let html = showAccount(data.data);
          $("#accountBox").append(html);
        }
      } else {
        codeError(data, "加载更多");
      }
      opts.hideLoading();
    },
    error: function(xhr) {
      opts.hideLoading();
      failResponse(xhr);
    }
  });
}
function questWhich(action, param) {
  if (action == "delete") {
    deleteAccount(param);
  } else {
    var inactive = action == "true" ? true : false;
    handleAccount(selectAccount, inactive);
  }
}
//delete account
function deleteAccount(param) {
  opts.showLoading();
  var data = new FormData();
  data.append("employeeId", param);
  $.ajax({
    url: $g.API_URL.EMPLOYEE_REMOVING.compose(host),
    type: "DELETE",
    data: data,
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    success: function(data) {
      if (data == undefined) {
        noData();
      } else if (data.code == $g.API_CODE.OK) {
        let employeeId = data.data;
        userMap[employeeId] = undefined;
        $("#acc_" + employeeId).remove();
        showNotify("success", "成功", "删除账号成功");
      } else if (data.code == $g.API_CODE.USER_HAS_STAFFS) {
        showNotify("info", "失败", "该账户仍绑定着职位，不允许删除");
      } else {
        codeError(data, "删除账户");
      }
      opts.hideLoading();
    },
    error: function(xhr) {
      opts.hideLoading();
      failResponse(xhr);
    }
  });
}
//close or open account  inactive=true(状态为关闭，执行开启操作) inactive=false(状态为开启，执行关闭操作)
function handleAccount(params, inactive) {
  opts.showLoading();
  let url = inactive
    ? $g.API_URL.EMPLOYEE_ACTIVE.compose(host)
    : $g.API_URL.EMPLOYEE_INACTIVING.compose(host);
  let formData = new FormData();
  params.forEach(e => {
    formData.append("employeeId", e);
  });
  $.ajax({
    url: url,
    type: "PUT",
    data: formData,
    cache: false,
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    success: function(data) {
      if (data == undefined) {
        noData();
      } else if (data.code == $g.API_CODE.OK) {
        let employs = data.data.succeed;
        let currentInactive = !inactive;
        let option = getCurrentOption(currentInactive);
        employs.forEach(e => {
          $("#acc_" + e + " td:eq(5)").html(option);
          currentInactive
            ? $("#acc_" + e).addClass("enableBg")
            : $("#acc_" + e).removeClass("enableBg");
          userMap[e].inactive = currentInactive;
        });
        $("#checkAll")
          .attr("data-check", "false")
          .children()
          .removeClass("checked");
        $(".fromCurrent").removeClass("checked");
      } else {
        codeError(data, "操作账户");
      }
      opts.hideLoading();
    },
    error: function(xhr) {
      opts.hideLoading();
      failResponse(xhr);
    }
  });
}
//current option
function getCurrentOption(currentInactive) {
  let html = "";
  if (currentInactive) {
    html =
      '<a href="javascript:;" class="turn">开启</a><a href="javascript:;" class="delete">删除</a><a href="javascript:;" class="changeProvinces">更改省市区</a>';
  } else {
    html =
      '<a href="javascript:;" class="turn">关闭</a><a href="javascript:;" class="delete">删除</a><a href="javascript:;" class="changeProvinces">更改省市区</a>';
  }
  return html;
}
//check for Satisfaction
function checkSatisfaction(inactive) {
  let params = returnCheckedId(".fromCurrent");
  let temp = true;
  if (params.length == 0) {
    opts.alert("您还没有选中任何账户，请先选择要进行操作的账户。");
  } else {
    params.forEach(e => {
      if (userMap[e].inactive != inactive) {
        temp = false;
      }
    });
  }
  if (!temp) {
    opts.alert("选中的账户中,有无法进行此操作的，请检查。");
    params = [];
  }
  return params;
}
/*模态框里************************************************************************/
//请求原系统的账户列表
function questSystemAccount() {
  $.ajax({
    type: "GET",
    url: $g.API_URL.EMPLOYEE_ACCOUNT_RETRIEVAL.compose(host),
    data: { pageSize: size },
    success: function(data) {
      if (data == undefined) {
        noData();
      } else if (data.code == $g.API_CODE.OK) {
        let html = showStaff(data.data);
        $("#oldSystem").html(html);
        $("#systemModal").modal({ backdrop: "static" });
      } else {
        codeError(data, "获取原系统账户");
      }
    },
    error: function(xhr) {
      failResponse(xhr);
    }
  });
}
function showStaff(obj) {
  let html = "";
  staffNextPageSign = obj.nextPageSign;
  if (obj.total == 0) {
    html = res.noStaff;
    $("#more").html("");
  } else {
    let records = obj.records;
    let loadBtn = "";
    saveToMap(records, staffMap);
    if (staffNextPageSign != undefined) {
      loadBtn = res.loadMoreSatff;
    }
    $("#more").html(loadBtn);
    html = generateStaffList(records);
  }
  return html;
}
function generateStaffList(records) {
  let html = "";
  records.forEach(e => {
    let jedAddress =
      e.jedAddress == undefined || e.jedAddress == "" ? "暂无" : e.jedAddress;
    html +=
      '<li class="idElem" id="old_' +
      e.employeeId +
      '">' +
      "<p>" +
      '<div class="icheckbox_flat-green fromOriginal" style="position: relative;">' +
      '<input type="checkbox" class="flat" style="position: absolute; opacity: 0;">' +
      '<ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins>' +
      "</div>" +
      e.name +
      "_" +
      e.employeeId +
      "_" +
      jedAddress +
      "</p>" +
      "</li>";
  });
  return html;
}
//搜索
function searchAccount(key) {
  opts.showLoading();
  $.ajax({
    type: "GET",
    url: $g.API_URL.EMPLOYEE_ACCOUNT_RETRIEVAL.compose(host),
    data: { pageSize: size, q: key },
    success: function(data) {
      if (data == undefined) {
        noData();
      } else if (data.code == $g.API_CODE.OK) {
        let html = showStaff(data.data);
        $("#oldSystem").html(html);
        staffKey = key;
      } else {
        codeError(data, "搜索");
      }
      opts.hideLoading();
    },
    error: function(xhr) {
      opts.hideLoading();
      failResponse(xhr);
    }
  });
}
//load more staff
function loadMoreSatff() {
  let nextPageSign = staffNextPageSign;
  let searchData = { pageSize: size, pageSign: nextPageSign };
  if (staffKey != "") {
    searchData.q = staffKey;
  }
  opts.showLoading();
  $.ajax({
    type: "GET",
    url: $g.API_URL.EMPLOYEE_ACCOUNT_RETRIEVAL.compose(host),
    data: searchData,
    success: function(data) {
      if (data == undefined) {
        noData();
      } else if (data.code == $g.API_CODE.OK) {
        let html = showStaff(data.data);
        $("#oldSystem").append(html);
      } else {
        codeError(data, "加载更多");
      }
      opts.hideLoading();
    },
    error: function(xhr) {
      opts.hideLoading();
      failResponse(xhr);
    }
  });
}
//添加账户
function importFormStaff(params) {
  $("#systemModal").modal("hide");
  opts.showLoading();
  let formData = new FormData();
  formData.append("importFromEmployee", "true");
  params.forEach(e => {
    formData.append("employeeId", e);
  });
  $.ajax({
    url: $g.API_URL.EMPLOYEE_ADDING.compose(host),
    type: "POST",
    data: formData,
    cache: false,
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    success: function(data) {
      if (data == undefined) {
        noData();
      } else if (data.code == $g.API_CODE.OK) {
        showNotify("success", "成功啦", "账号导入成功");
        questAccountList();
      } else {
        codeError(data, "导入账户");
      }
      opts.hideLoading();
    },
    error: function(xhr) {
      opts.hideLoading();
      failResponse(xhr);
    }
  });
}
/*虚拟账号******************************************************************************* */
//验证输入的虚拟账号是否合法
function validateVirtureAccount() {
  let valid = true;
  let $name = $("#fullname");
  let $hrId = $("#hrCode");
  let $pass = $("#password");
  let $rePass = $("#passagain");
  let name = $name.val();
  let hrId = $hrId.val();
  let passw = $pass.val();
  let rePassw = $rePass.val();
  let reg = /^2[\d]{6}$/;
  if (name == "") {
    valid = false;
    $name
      .prev()
      .find(".error")
      .text("请填写姓名")
      .addClass("required");
  }
  if (hrId == "") {
    valid = false;
    $hrId
      .prev()
      .find(".error")
      .text("请填写账户")
      .addClass("required");
  } else if (!reg.test(hrId)) {
    valid = false;
    $hrId
      .prev()
      .find(".error")
      .text("账户格式填写不正确")
      .addClass("required");
  }
  if (passw == "") {
    valid = false;
    $pass
      .prev()
      .find(".error")
      .text("请填写密码")
      .addClass("required");
  } else if (passw.length < 6) {
    valid = false;
    $pass
      .prev()
      .find(".error")
      .text("密码位数不够")
      .addClass("required");
  }
  if (rePassw == "") {
    valid = false;
    $rePass
      .prev()
      .find(".error")
      .text("请再次填写密码")
      .addClass("required");
  } else if (rePassw != passw) {
    valid = false;
    $rePass
      .prev()
      .find(".error")
      .text("两次填写密码不一致")
      .addClass("required");
  }
  return valid;
}
//提交虚拟账号
function addVirtureAccount() {
  $("#virtureModal").modal("hide");
  opts.showLoading();
  let name = $("#fullname").val();
  let hrId = $("#hrCode").val();
  let password = $("#password").val();
  let jedAddress = $("#jedAddress").val();
  let formData = new FormData();
  formData.append("name", name);
  formData.append("importFromEmployee", "false");
  formData.append("employeeId", hrId);
  formData.append("password", password);
  if (jedAddress != "") {
    formData.append("jedAddress", jedAddress);
  }
  $.ajax({
    url: $g.API_URL.EMPLOYEE_ADDING.compose(host),
    type: "POST",
    data: formData,
    cache: false,
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    success: function(data) {
      if (data == undefined) {
        noData();
      } else if (data.code == $g.API_CODE.OK) {
        questAccountList();
        showNotify("success", "成功啦", "新增虚拟账号成功");
      } else {
        codeError(data, "新增虚拟账号");
      }
      opts.hideLoading();
    },
    error: function(xhr) {
      opts.hideLoading();
      failResponse(xhr);
    }
  });
}
/*common************************************************************************** */
//save to map
function saveToMap(records, map) {
  records.forEach(e => {
    map[e.employeeId] = e;
  });
}
//返回勾选的employeeId
function returnCheckedId(obj) {
  let ids = [];
  $(obj).each(function() {
    if ($(this).hasClass("checked")) {
      var id = $(this)
        .parents(".idElem")
        .attr("id")
        .substring(4);
      ids.push(id);
    }
  });
  return ids;
}
