"use strict";
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
  opts.showLoading();
  Promise.all([questTree(), currentDataScope()]).then(function([tree, scope]) {
    showSalesTree(tree, scope);
  });

  //请求user List
  $("#bindModal").on("show.bs.modal", function() {
    userKey = "";
    var option = $(this).attr("data-opt");
    var tId = $(this).attr("tid");
    if (option) {
      getUserList();
    }
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
  //load more
  $(".modal-body").on("click", "#loadMoreUser", function() {
    loadMoreUser();
  });
  //绑定/解绑模态框里的确定
  $("#bindBtn").on("click", function() {
    bindOrNotSureBtn(this);
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
/*树结构配置*************************************************************************** */
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
//tree
function questTree() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.STAFF_SALES_RETRIEVAL.compose(host),
      type: "GET",
      success: function(data) {
        if (data.code == $g.API_CODE.OK) {
          resolve(data.data);
        } else {
          codeError(data, "请求销售人员出错");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "请求销售人员失败");
      }
    });
  });
}
//dataScope
function currentDataScope() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.STAFF_RETRIEVAL.compose(host),
      type: "GET",
      dataType: "json",
      success: function(data) {
        if (data.code == $g.API_CODE.OK) {
          resolve(data.data);
        } else {
          codeError(data, "请求当前账户数据权限出错了");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "请求当前账户数据权限失败了");
      }
    });
  });
}
function returnDataScope(arr) {
  var scope = "";
  for (var item of arr) {
    scope += item.id + ",";
  }
  return scope.substring(0, scope.length - 1);
}
/*显示职位树********************************************************************************** */
function showSalesTree(treeData, scope) {
  let dataScope = returnDataScope(scope.departments);
  let nodeList = parseTree(treeData);
  $.fn.zTree.init($("#mjpOg"), setting, nodeList);
  mjpTree = $.fn.zTree.getZTreeObj("mjpOg");
  mjpTree.expandAll(true);
  if (dataScope != "") {
    tree.checkInDataScope(mjpTree, dataScope);
  } else {
    var root = mjpTree.getNodeByParam("pId", null);
    mjpTree.setChkDisabled(root, true, false, true);
  }
  opts.hideLoading();
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
      console.log("绑定");
      console.log(data);
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
      console.log("解绑");
      console.log(data);
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

//DIY增删盖查按钮
function addDiyDom(treeId, treeNode) {
  if (treeNode.parentNode && treeNode.parentNode.id != 2) return;
  var aObj = $("#" + treeNode.tId + "_a");
  var editStr =
    "<a class='btn unbind' id='unbindBtn_" +
    treeNode.tId +
    "' data-tId='" +
    treeNode.tId +
    "' title='绑定/解绑人员' onclick='bindOrNot(this)''></a>";
  aObj.append(editStr);
}
function addHoverDom(treeId, treeNode) {
  if (!treeNode.chkDisabled) {
    $("#unbindBtn_" + treeNode.tId).addClass("inlineBlock");
  }
}
function removeHoverDom(treeId, treeNode) {
  $("#unbindBtn_" + treeNode.tId).removeClass("inlineBlock");
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
