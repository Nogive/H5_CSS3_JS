"use strict";
//树结构配置
var setting = {
  edit: {
    enable: false
  },
  data: {
    simpleData: {
      enable: true //使用简单模式
    }
  },
  view: {
    fontCss: { color: "#333", "font-weight": "normal" },
    addHoverDom: addHoverDom,
    removeHoverDom: removeHoverDom,
    addDiyDom: addDiyDom
  },
  check: {
    enable: false, //节点上是否显示选中框
    chkStyle: "checkbox"
  },
  callback: {
    beforeClick: clickNode,
    beforeCheck: checkNode
  }
};
var res = {
  noUser:
    '<li><a href="javascript:;" class="nobg">暂时没有人员可以绑定，请联系管理员</a></li>',
  loadMoreUser: '<a id="loadMoreUser" href="javascript:;">加载更多...</a>'
};
var size = constant.mvoNum;
var userNextPageSign;
var userKey = "";
var mjpTree; //所有节点对象
$(document).ready(function() {
  //页面加载好后请求树结构
  questTreeData();

  //请求role List
  $("#addModal").on("show.bs.modal", function() {
    var tId = $(this).attr("tid");
    var opt = $(this).attr("data-opt");
    var curNode = mjpTree.getNodeByTId(tId);
    var roleId = curNode.roleId;
    if (opt == "edit") {
      $("#staffName")
        .attr("tarId", curNode.staffId)
        .val(curNode.staffName);
      $(this)
        .find("#theRole")
        .attr("tarId", curNode.roleId)
        .text(curNode.roleName)
        .next().hide;
      $("#roleList").html("");
    } else {
      $("#staffName")
        .removeAttr("tarId")
        .val("");
      $(this)
        .find("#theRole")
        .removeAttr("tarId")
        .text(" ")
        .next()
        .hide();
      questRoleList(roleId);
    }
  });
  //请求user List
  $("#bindModal").on("show.bs.modal", function() {
    userKey = "";
    var option = $(this).attr("data-opt");
    var tId = $(this).attr("tid");
    var roleId = mjpTree.getNodeByTId(tId).roleId;
    if (option) {
      questUserList(roleId);
    }
  });
  //load more
  $(".modal-body").on("click", "#loadMoreUser", function() {
    loadMoreUser();
  });
  //点击列表的某一项选中
  $(".modal-body").on("click", "ul a", function() {
    var objText = $(this)
      .parents(".to_do")
      .attr("id");
    var tarId = $(this).attr("data-roleId");
    var tarName = $(this).text();
    var $obj = $(this)
      .parents(".modal-body")
      .find(".endItem");
    $obj
      .attr("tarId", tarId)
      .next()
      .hide();
    objText == "userList" ? $obj.val(tarName) : $obj.text(tarName);
  });
  //新建/编辑职位模态框里的确定
  $("#addBtn").on("click", function() {
    addOrEditSureBtn(this);
  });
  //绑定/解绑模态框里的确定
  $("#bindBtn").on("click", function() {
    bindOrNotSureBtn(this);
  });
  //删除模态框里的确定
  $("#removeBtn").on("click", function() {
    $("#removeModal").modal("hide");
    opts.showLoading();
    var tId = $(this)
      .parents(".modal")
      .attr("tId");
    var curNode = mjpTree.getNodeByTId(tId);
    var parData = new FormData();
    parData.append("id", curNode.staffId);
    $.ajax({
      url: $g.API_URL.STAFF_REMOVING.compose(host),
      type: "DELETE",
      data: parData,
      processData: false,
      contentType: false,
      mimeType: "multipart/form-data",
      success: function(data) {
        if (data.code == $g.API_CODE.OK) {
          mjpTree.removeNode(curNode);
          opts.hideLoading();
          showNotify("success", "删除成功", "该职位被删除");
        } else {
          var resText = matchResCode(data.code);
          opts.hideLoading();
          showNotify("error", "删除失败", resText);
        }
      },
      error: function(xhr) {
        failResponse(xhr, "删除失败");
      }
    });
  });
  //清除表单验证
  $("input").on("focus", function() {
    $(this)
      .next(".red")
      .hide();
  });
  //人员列表搜索
  $("#tipText").on("click", "#searchBtn", function() {
    let searchText = $("#searchUser").val();
    searchPerson(searchText);
  });

  //高度适应
  var clientH = $(".right_col").height();
  $(".ogBox").css("max-height", clientH);
});
//请求树结构,并以展开的方式呈现。
function questTreeData() {
  opts.showLoading();
  $.ajax({
    url: $g.API_URL.STAFF_SALES_RETRIEVAL.compose(host),
    type: "GET",
    success: function(data) {
      if (data.code == 0) {
        var mjpNodes = data.data;
        let nodeList = parseTree(data.data);
        $.fn.zTree.init($("#mjpOg"), setting, nodeList);
        mjpTree = $.fn.zTree.getZTreeObj("mjpOg");
        mjpTree.expandAll(true);
        opts.hideLoading();
      } else {
        codeError(data, "请求销售人员失败");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "请求销售人员失败");
    }
  });
}
//新建/编辑节点
function addOrEditSureBtn(obj) {
  var flag = true;
  var tId = $(obj)
    .parents(".modal")
    .attr("tId");
  var option = $(obj)
    .parents(".modal")
    .attr("data-opt");
  var curNode = mjpTree.getNodeByTId(tId);
  //表单验证
  var staffName = $("#staffName").val();
  var chooseId = $("#theRole").attr("tarId");
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
  //验证通过
  if (flag) {
    if (option == "add") {
      var data = {
        parentId: curNode.id,
        name: staffName, //岗位描述
        roleId: chooseId,
        roleName: $("#theRole").text()
      };
      questAdd(data, curNode);
    } else {
      var data = {
        id: curNode.id,
        name: staffName, //岗位描述
        roleId: chooseId,
        roleName: $("#theRole").text()
      };
      questEdit(data, curNode);
    }
  }
}
//发送新增请求
function questAdd(data, curNode) {
  $("#addModal").modal("hide");
  opts.showLoading();
  var releData = data;
  $.ajax({
    url: $g.API_URL.STAFF_SALES_CREATING.compose(host),
    type: "POST",
    data: data,
    success: function(data) {
      console.log("新增");
      console.log(data);
      if (data.code == 0) {
        var newData = data.data;
        var nodes = {
          id: newData.id,
          staffId: newData.staffId,
          pId: releData.parentId,
          open: true,
          staffName: newData.staffName,
          roleId: newData.roleId,
          roleName: releData.roleName,
          name:
            newData.staffName +
            "_" +
            releData.roleName +
            "_" +
            constant.noEmployeeName +
            "_" +
            constant.noEmployeeId
        };
        mjpTree.addNodes(curNode, nodes);
        opts.hideLoading();
      } else {
        codeError(data, "添加失败了");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "添加失败了");
    }
  });
}
//发送编辑请求
function questEdit(data, curNode) {
  $("#addModal").modal("hide");
  opts.showLoading();
  var editData = data;
  $.ajax({
    url: $g.API_URL.STAFF_SALES_EDITING.compose(host),
    type: "PUT",
    data: data,
    success: function(data) {
      console.log("编辑");
      console.log(data);
      if (data.code == 0) {
        let employeeId =
          curNode.employeeId == undefined
            ? constant.noEmployeeId
            : curNode.noEmployeeId;
        var userName =
          curNode.employeeName == undefined
            ? constant.noEmployeeName
            : curNode.employeeName;
        curNode.staffName = editData.name;
        curNode.roleId = editData.roleId;
        curNode.roleName = editData.roleName;
        curNode.name =
          curNode.staffName +
          "_" +
          curNode.roleName +
          "_" +
          userName +
          "_" +
          employeeId;
        mjpTree.updateNode(curNode);
        opts.hideLoading();
      } else {
        codeError(data, "编辑职位失败了");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "编辑职位失败了");
    }
  });
}

function bindOrNotSureBtn(obj) {
  var flag = true;
  var tId = $(obj)
    .parents(".modal")
    .attr("tId");
  var option = $(obj)
    .parents(".modal")
    .attr("data-opt");
  var curNode = mjpTree.getNodeByTId(tId);
  if (option == "true") {
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
        id: curNode.staffId,
        employeeId: chooseId,
        unbinding: false,
        employeeName: $("#theUser").val()
      };
      questBind(data, curNode);
    }
  } else {
    var data = {
      id: curNode.staffId,
      employeeId: curNode.employeeId,
      unbinding: true
    };
    questUnbind(data, curNode);
  }
}
//发送绑定人员请求
function questBind(data, curNode) {
  $("#bindModal").modal("hide");
  opts.showLoading();
  var perData = data;
  $.ajax({
    url: $g.API_URL.STAFF_ASSIGNATION.compose(host),
    type: "PUT",
    data: data,
    success: function(data) {
      if (data.code == 0) {
        var oData = data.data;
        curNode.employeeId = oData.employeeId;
        curNode.employeeName = oData.employeeName;
        var text =
          curNode.staffName +
          "_" +
          curNode.roleName +
          "_" +
          oData.employeeName +
          "_" +
          oData.employeeId;
        curNode.name = text;
        mjpTree.updateNode(curNode);
        opts.hideLoading();
      } else {
        codeError(data, "绑定失败了");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "绑定失败了");
    }
  });
}
//发送解绑人员请求
function questUnbind(data, curNode) {
  $("#bindModal").modal("hide");
  opts.showLoading();
  $.ajax({
    url: $g.API_URL.STAFF_ASSIGNATION.compose(host),
    type: "PUT",
    data: data,
    success: function(data) {
      if (data.code == 0) {
        curNode.employeeId = null;
        curNode.employeeName = constant.noEmployeeName;
        var text =
          curNode.staffName +
          "_" +
          curNode.roleName +
          "_" +
          constant.noEmployeeName +
          "_" +
          constant.noEmployeeId;
        curNode.name = text;
        mjpTree.updateNode(curNode);
        opts.hideLoading();
      } else {
        codeError(data, "解绑失败了");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "解绑失败了");
    }
  });
}
/*role list **************************************************************************************** */
function questRoleList(roleId) {
  $.ajax({
    url: $g.API_URL.BASE_DATA_RETRIEVAL.compose(host) + "?dataType=role",
    type: "GET",
    success: function(data) {
      if (data.code == 0) {
        let roles = returnSales(data.data, true, roleId);
        $("#roleList").html(generateRoleList(roles));
      } else {
        codeError(data, "职位列表请求出错");
      }
    }
  });
}
function generateRoleList(arr) {
  let html = "";
  var len = arr.length;
  if (len < 1)
    html =
      '<li><a href="javascript:;" class="nobg">暂时没有角色可选，请联系管理员</a></li>';
  for (var i = 0; i < len; i++) {
    html +=
      "<li>" +
      '<a href="javascript:;" data-roleId="' +
      arr[i].id +
      '">' +
      arr[i].name +
      "</a>" +
      "</li>";
  }
  return html;
}
function returnSales(arr, flag, roleId) {
  var sales = [];
  var suitSales = [];
  var notSales = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].id != $g.ROLE.ADMIN) {
      arr[i].id > $g.ROLE.COMMON_ROLE_BASE
        ? notSales.push(arr[i])
        : sales.push(arr[i]);
    }
  }
  if (flag) {
    for (var j = 0; j < sales.length; j++) {
      if (sales[j].id < roleId) {
        suitSales.push(sales[j]);
      }
    }
    return suitSales;
  } else {
    return notSales;
  }
}
/*user list**************************************************************************************** */
function questUserList() {
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
    html = getUserHtml(records);
  }
  return html;
}
//返回列表的HTMl代码
function getUserHtml(arr) {
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
//搜索人员
function searchPerson(searchText) {
  $.ajax({
    type: "GET",
    url: $g.API_URL.EMPLOYEE_UNBINDING_RETRIEVAL.compose(host),
    data: { pageSize: size, q: searchText },
    success: function(data) {
      if (data.code == $g.API_CODE.OK) {
        let html = showCurrentUsers(data.data);
        $("#userList").html(html);
        userKey = searchText;
      } else {
        codeError(data, "搜索出错了");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "搜索账号失败");
    }
  });
}
//load more user
function loadMoreUser() {
  let pageSign = userNextPageSign;
  let searchData = { pageSize: size, pageSign: pageSign };
  if (userKey != "") {
    searchData.q = userKey;
  }
  $.ajax({
    type: "GET",
    url: $g.API_URL.EMPLOYEE_RETRIEVAL.compose(host),
    data: searchData,
    success: function(data) {
      if (data.code == $g.API_CODE.OK) {
        let html = showCurrentUsers(data.data);
        $("#userList").append(html);
      } else {
        codeError(data, "加载更多出错了");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "加载更多失败了");
    }
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////
//DIY增删盖查按钮
function addDiyDom(treeId, treeNode) {
  if (treeNode.parentNode && treeNode.parentNode.id != 2) return;
  var aObj = $("#" + treeNode.tId + "_a");
  var editStr =
    "<a class='btn add' id='addBtn_" +
    treeNode.tId +
    "' data-tId='" +
    treeNode.tId +
    "' title='新增职位' onclick='addAndEdit(this)''></a>" +
    "<a class='btn edit' id='editBtn_" +
    treeNode.tId +
    "' data-tId='" +
    treeNode.tId +
    "' title='编辑职位' onclick='addAndEdit(this)''></a>" +
    /*
    "<a class='btn unbind' id='unbindBtn_" +
    treeNode.tId +
    "' data-tId='" +
    treeNode.tId +
    "' title='绑定/解绑人员' onclick='bindOrNot(this)''></a>" +*/
    "<a class='btn remove' id='removeBtn_" +
    treeNode.tId +
    "' data-tId='" +
    treeNode.tId +
    "' title='删除职位' onclick='removeNode(this)''></a>";
  aObj.append(editStr);
}
function addHoverDom(treeId, treeNode) {
  showOrHideBtns(treeNode.tId, 0);
}
function removeHoverDom(treeId, treeNode) {
  showOrHideBtns(treeNode.tId, 1);
}
function showOrHideBtns(tId, flag) {
  if (flag == 0) {
    $("#addBtn_" + tId).addClass("inlineBlock");
    $("#editBtn_" + tId).addClass("inlineBlock");
    //$("#unbindBtn_" + tId).addClass("inlineBlock");
    $("#removeBtn_" + tId).addClass("inlineBlock");
  } else {
    $("#addBtn_" + tId).removeClass("inlineBlock");
    $("#editBtn_" + tId).removeClass("inlineBlock");
    //$("#unbindBtn_" + tId).removeClass("inlineBlock");
    $("#removeBtn_" + tId).removeClass("inlineBlock");
  }
}
//点击增加和编辑按钮触发模态框
function addAndEdit(obj) {
  var title, tips;
  var opt = $(obj)
    .attr("class")
    .split(" ")[1];
  var tId = $(obj).attr("data-tId");
  var treeNode = mjpTree.getNodeByTId(tId);
  var srNode = treeNode.roleId;
  if (opt == "add") {
    if (srNode > $g.ROLE.SR) {
      title = "新增职位";
      tips =
        '您将在"' +
        treeNode.staffName +
        " " +
        treeNode.roleName +
        '"下新增职位，具体如下：';
    } else {
      $("#alertText").text(
        "抱歉，当前职位下不允许添加新的职位。若需进一步操作，请联系管理员！"
      );
      $("#alertModal").modal({ backdrop: "static" });
      return false;
    }
  } else {
    title = "编辑职位";
    tips =
      '您将对"' +
      treeNode.staffName +
      " " +
      treeNode.roleName +
      '"所在的职位进行编辑，具体如下：';
  }
  $("#modalLabel").text(title);
  $("#friendlyTip").text(tips);
  $("#addModal")
    .attr({ tId: treeNode.tId, "data-opt": opt })
    .modal();
}
//点击绑定/解绑按钮触发模态框
function bindOrNot(obj) {
  var html, title;
  var option = null; //区分绑定和解绑
  var tId = $(obj).attr("data-tId");
  var treeNode = mjpTree.getNodeByTId(tId);
  var userId = treeNode.employeeId;
  if (userId == undefined || userId == null) {
    //当前职位空缺
    title = "绑定";
    option = true;
    html =
      "<p><b>" +
      treeNode.staffName +
      " " +
      treeNode.roleName +
      "</b>上的人员空缺，请直接进行绑定</p>" +
      '<div class="form-group top_search">' +
      '<div class="input-group">' +
      '<input type="text" class="form-control" placeholder="输入关键字搜索" id="searchUser">' +
      '<span class="input-group-btn">' +
      '<button class="btn btn-default" type="button" id="searchBtn">搜索</button>' +
      "</span>" +
      "</div>" +
      "</div>" +
      '<p>请选择要绑定的人员:<input class="endItem" id="theUser" /><span class="red paddleft10 display-none">*请选择角色</span></p>' +
      '<div class="col-md-12 col-sm-12 col-xs-12">' +
      '<ul class="to_do" id="userList"></ul>' +
      '<p class="loadMore" id="more"></p>' +
      "</div>";
  } else {
    title = "解绑";
    option = false;
    var name =
      treeNode.employeeName == undefined ? "无" : treeNode.employeeName;
    html =
      "<p><b>" +
      treeNode.staffName +
      " " +
      treeNode.roleName +
      '</b>上绑定的员工是:"' +
      name +
      '"。是否对其进行解绑？</p>';
  }
  $("#bindLabel").text(title);
  $("#tipText").html(html);
  $("#bindModal")
    .attr({ tId: treeNode.tId, "data-opt": option })
    .modal();
  return false;
}

//***********************删除职位开始****************************************************/
function removeNode(obj) {
  var tId = $(obj).attr("data-tId");
  var treeNode = mjpTree.getNodeByTId(tId);
  if (treeNode.isParent) {
    opts.alert("该职位下面有子职位，不允许删除。");
  } else if (treeNode.employeeId != undefined) {
    var eoeName = treeNode.employeeName;
    opts.alert("该职位上绑定了：" + eoeName + "，请先进行解绑。");
  } else {
    $("#deJob").text(treeNode.staffName + " " + treeNode.roleName);
    $("#removeModal")
      .attr("tId", tId)
      .modal();
  }
}
//***********************删除职位结束***********************************************/

/**********************选择某个节点部分*********************************************/
//点击节点
function clickNode(treeId, treeNode, clickFlag) {
  return false;
}
//选中选框（选中某个节点）
function checkNode(treeId, treeNode) {
  var currentCheckStatus = treeNode.checked;
  var mjpTree = $.fn.zTree.getZTreeObj(treeId);
  var tId = treeNode.tId;
  var pTid = treeNode.parentTId;
  var pNode = mjpTree.getNodeByTId(pTid);

  if (currentCheckStatus) {
    //firstly, we enable current node and its children;
    mjpTree.setChkDisabled(treeNode, false, false, true);

    if (pNode != null) {
      enableParentNode(mjpTree, pNode, treeNode);
    }
  } else {
    //firstly disable all the children node
    var childNodes = treeNode.children;
    if (childNodes != undefined) {
      for (var node of childNodes) {
        mjpTree.setChkDisabled(node, true, false, true);
      }
    }

    if (pNode != null) {
      mjpTree.setChkDisabled(pNode, true, true, false);
    }
  }
}

function enableParentNode(tree, pNode, cNode) {
  var checkedNodes = tree.getNodesByParam("checked", true, pNode);
  for (var node of checkedNodes) {
    if (node.id != cNode.id) {
      return;
    }
  }

  //only the current node is checked
  tree.setChkDisabled(pNode, false, false, false);
  if (pNode.getParentNode() != null) {
    enableParentNode(tree, pNode.getParentNode(), cNode);
  }
}
/**********************删除返回code匹配************************************************************ */
function matchResCode(code) {
  var text = "";
  switch (code) {
    case $g.API_CODE.STAFF_UNDER_BINDING:
      text = "该职位上有人员绑定，不允许删除";
      break;
    case $g.API_CODE.STAFF_CONTAIN_CHILDREN:
      text = "该职位上有其他下属，不允许删除";
      break;
    case $g.API_CODE.STAFF_HAS_PREMVO:
      text = "该职位上outlet未处理，不允许删除";
      break;
    case $g.API_CODE.STAFF_HAS_MVO:
      text = "该职位上有MVO未处理，不允许删除";
      break;
    case $g.API_CODE.STAFF_HAS_PENDING_MVO:
      text = "该职位上有待分配的MVO未处理，不允许删除";
      break;
    case $g.API_CODE.STAFF_HAS_UNDER_APPROVING:
      text = "该职位上有需要审批的记录未处理，不允许删除";
      break;
  }
  return text;
}
/**解析获取的sales数据****************************************************************** */
function parseTree(obj) {
  let newObj = {};
  for (let field in obj) {
    if (field == "children") {
      newObj[field] = parseChildren(obj[field]);
    } else if (field == "name") {
      let employeeName =
        obj.employeeName == undefined
          ? constant.noEmployeeName
          : obj.employeeName;
      let employeeId =
        obj.employeeId == undefined ? constant.noEmployeeId : obj.employeeId;
      newObj[field] =
        obj.staffName +
        "_" +
        obj.roleName +
        "_" +
        employeeName +
        "_" +
        employeeId;
    } else {
      newObj[field] = obj[field];
    }
  }
  return newObj;
}
function parseChildren(arr) {
  let children = [];
  arr.forEach(e => {
    children.push(parseTree(e));
  });
  return children;
}
