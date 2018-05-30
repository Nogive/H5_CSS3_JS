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
  noStaff: "<li><p>暂无记录，请联系管理员。</p></li>",
  loadMoreUser:
    '<a id="loadMore" href="javascript:;" class="btn btn-default">加载更多...</a>',
  loadMoreSatff: '<a id="loadMoreStaff" href="javascript:;">加载更多...</a>'
};
$(document).ready(function() {
  questAccountList();
  //loadmore user
  $("#moreUser").on("click", "#loadMore", function() {
    loadMoreUser();
  });
  //search
  $("#goSearch").click(function() {
    let searchText = $("#searchUser").val();
    searchUserInCurrent(searchText);
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
    let param = [id];
    let inactive = userMap[id].inactive;
    handleAccount(param, inactive);
  });
  //multi close or open
  $("#closeAccount").click(function() {
    let parames = checkSatisfaction(false);
    if (parames.length > 0) {
      handleAccount(parames, false);
    }
  });
  $("#openAccount").click(function() {
    let parames = checkSatisfaction(true);
    if (parames.length > 0) {
      handleAccount(parames, true);
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
  //suit table height
  let tableHeight =
    $(".right_col").height() -
    $(".accIndic").offset().top -
    $(".pageAndbtn ").height() -
    30;
  $(".accIndic").css("height", tableHeight);
});
/*页面请求******************************************************************/
//获取当前账号
function questAccountList() {
  opts.showLoading();
  $.ajax({
    type: "GET",
    url: $g.API_URL.EMPLOYEE_RETRIEVAL.compose(host),
    data: { pageSize: size },
    success: function(data) {
      if (data.code == $g.API_CODE.OK) {
        let html = showAccount(data.data);
        $("#accountBox").html(html);
        opts.hideLoading();
      } else {
        codeError(data, "加载账户列表出错");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "加载账户列表失败。");
    }
  });
}
function showAccount(obj) {
  let html = "";
  userNextPageSign = obj.nextPageSign; //下一页的pageSign
  if (obj.total == 0) {
    html = res.noUser;
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
      if (data.code == $g.API_CODE.OK) {
        let html = showAccount(data.data);
        $("#accountBox").html(html);
        userKey = text;
        opts.hideLoading();
      } else {
        codeError(data, "加载账户列表出错");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "加载账户列表失败。");
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
      if (data.code == $g.API_CODE.OK) {
        let html = showAccount(data.data);
        $("#accountBox").append(html);
        opts.hideLoading();
      } else {
        codeError(data, "加载更多出错了");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "加载更多失败了");
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
      console.log(data);
      if (data.code == $g.API_CODE.OK) {
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
        opts.hideLoading();
      } else {
        codeError(data, "操作账户出错了");
      }
    }
  });
}
//current option
function getCurrentOption(currentInactive) {
  let html = "";
  if (currentInactive) {
    html =
      '<a href="javascript:;" class="turn"><i class="fa fa-check-circle"></i>开启</a>';
  } else {
    html =
      '<a href="javascript:;" class="turn"><i class="fa fa-times-circle">关闭</i></a>';
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
      if (data.code == $g.API_CODE.OK) {
        let html = showStaff(data.data);
        $("#oldSystem").html(html);
        $("#systemModal").modal({ backdrop: "static" });
      } else {
        codeError(data, "获取原系统账户出错");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "获取原系统账户列表失败");
    }
  });
}
function showStaff(obj) {
  let html = "";
  staffNextPageSign = obj.nextPageSign;
  if (obj.total == 0) {
    html = res.noStaff;
  } else {
    let records = obj.records;
    let loadBtn = "";
    saveToMap(records, staffMap);
    if (staffNextPageSign != undefined) {
      loadBtn = res.loadMoreSatff;
    }
    $("#more").html(loadBtn);
    html = generateStaffList(records);
    return html;
  }
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
      if (data.code == $g.API_CODE.OK) {
        let html = showStaff(data.data);
        $("#oldSystem").html(html);
        staffKey = key;
        opts.hideLoading();
      } else {
        codeError(data, "搜索出错");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "搜索账号失败");
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
      if (data.code == $g.API_CODE.OK) {
        let html = showStaff(data.data);
        $("#oldSystem").append(html);
        opts.hideLoading();
      } else {
        codeError(data, "加载更多出错了");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "加载更多失败了");
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
      console.log(data);
      if (data.code == $g.API_CODE.OK) {
        showNotify("success", "成功啦", "账号导入成功");
        questAccountList();
      } else {
        codeError(data, "导入账户出错了");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "导入账户失败了");
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
      console.log(data);
      if (data.code == $g.API_CODE.OK) {
        questAccountList();
        showNotify("success", "成功啦", "新增虚拟账号成功");
      } else {
        codeError(data, "新增虚拟账号出错了");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "新增虚拟账号失败了");
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
