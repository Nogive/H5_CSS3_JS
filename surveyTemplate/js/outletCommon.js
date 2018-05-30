"use strict";
$(document).ready(function() {
  //多选
  $(".mulInput").click(function(e) {
    e.stopPropagation();
    $(this)
      .next()
      .toggle();
  });
  //多选OK
  $(".mulItem").on("click", "#mulSure", function() {
    var ids = [];
    var texts = [];
    $(this)
      .parents(".mulItem")
      .hide();
    $(".mulItem input").each(function() {
      if ($(this).is(":checked")) {
        ids.push($(this).attr("id"));
        texts.push(
          $(this)
            .parent()
            .text()
        );
      }
    });
    var sId = ids.length == 0 ? null : ids.join(",");
    var sText = ids.length == 0 ? "" : texts.join(",");
    $(this)
      .parent()
      .prev(".mulInput")
      .val(sText)
      .attr("data-id", sId);
  });
  $(".mulItem").on("focus", "input[type=checkbox]", function() {
    $(this)
      .parents(".mulBox")
      .find("label.error")
      .remove();
    $(this)
      .parents(".mulBox")
      .find("input.error")
      .removeClass("error");
  });
  $(".mulItem").on("click", function(e) {
    e.stopPropagation();
  });
  $(":not(.mulItem)").on("click", function() {
    var flag = $(this).hasClass("mulInput");
    if (!flag) {
      $(".mulItem").hide();
    }
  });
  //单个分配
  $(".recordBox").on("click", ".toAssign", function(e) {
    e.stopPropagation();
    var id = $(this)
      .parents("tr")
      .attr("id");
    $("#treeModal")
      .attr("data-assignIds", id)
      .modal();
  });
  //分配给...里面的modal Tree
  $("#treeModal").on("show.bs.modal", function() {
    var staffId = JSON.parse(storage.getStorage("user")).staffId;
    var mjpTree = $.fn.zTree.getZTreeObj("mjpOg");
    var currentNode = mjpTree.getNodeByParam("staffId", staffId);
    tree.raseTree(mjpTree);
    tree.checkInDataScope(mjpTree, currentNode.id.toString());
    //mjpTree.checkNode(currentNode, true);
    mjpTree.setChkDisabled(currentNode, true, false, false);
  });
  $("#setBtn").click(function() {
    goToAssign(this);
  });
  //选择组织层级
  $("#chooseSales").click(function() {
    var dataScope = $(this).attr("data-scope");
    if (dataScope == null) {
      opts.alert("抱歉，您没有权限进行选择");
    } else {
      var selectScope = $(this).attr("select-scope");
      var mjpTree = $.fn.zTree.getZTreeObj("mjpLayer");
      tree.raseTree(mjpTree);
      tree.checkInDataScope(mjpTree, dataScope);
      if (selectScope != null) {
        tree.showCurrentChecked(mjpTree, selectScope);
      }
      $("#layerModal").modal();
    }
  });
  //全选
  $("#allBtn").click(function() {
    var mjpTree = $.fn.zTree.getZTreeObj("mjpLayer");
    mjpTree.checkAllNodes(true);
  });
  //全不选
  $("#notBtn").click(function() {
    var mjpTree = $.fn.zTree.getZTreeObj("mjpLayer");
    mjpTree.checkAllNodes(false);
  });
});
/**************************普查信息部分开始************************************/
//请求 最近一次普查信息
function questSurvey(outletId) {
  $.ajax({
    url: $g.API_URL.SURVEY_RETRIEVAL.compose(host),
    type: "GET",
    data: { outletId: outletId },
    success: function(data) {
      if (data.code == 0) {
        if (data.data != undefined) {
          var survey = data.data;
          $("#modeTime").text(timestamp2String(survey.createdTimestamp));
          var tem = survey.data;
          if (tem.sku != undefined) {
            var skus = tem.sku;
            $("#mjp").html(createSurverItem("mjp", skus));
          }
          if (tem.competitorSku != undefined) {
            var brands = tem.competitorSku;
            $("#brands").html(createSurverItem("brands", brands));
          }
        } else {
          $("#modeTime").text("暂无");
          $("#mjp,#brands").html("");
        }
      }
      opts.hideLoading();
    }
  });
}
function createSurverItem(o, arr) {
  var html = o == "mjp" ? headOfHtml.mjp() : headOfHtml.brands();
  for (var line of arr) {
    html +=
      '<div class="col-md-12 sameStruct" data-item="' +
      o +
      '">' +
      '<div class="col-md-4">' +
      "<p>" +
      line.key +
      "</p>" +
      "</div>" +
      '<div class="col-md-4">' +
      '<input type="text" data-item="sales" value="' +
      line.volume +
      '" readOnly />' +
      "</div>" +
      '<div class="col-md-4">' +
      '<input type="text" data-item="price" value="' +
      line.price +
      '" readOnly />' +
      "</div>" +
      "</div>";
  }
  return html;
}
var headOfHtml = {
  mjp: function() {
    var html =
      "<h2>喜力铺货</h2>" +
      '<div class="col-md-12">' +
      '<div class="col-md-4">' +
      "<p>SKU类别</p>" +
      "</div>" +
      '<div class="col-md-4">' +
      "<p>销量 (瓶)</p>" +
      "</div>" +
      '<div class="col-md-4">' +
      "<p>售价 (元)</p>" +
      "</div>" +
      "</div>";
    return html;
  },
  brands: function() {
    var html =
      "<h2>竞品信息</h2>" +
      '<div class="col-md-12">' +
      '<div class="col-md-4">' +
      "<p>名称</p>" +
      "</div>" +
      '<div class="col-md-4">' +
      "<p>销量 (瓶)</p>" +
      "</div>" +
      '<div class="col-md-4">' +
      "<p>售价 (元)</p>" +
      "</div>" +
      "</div>";
    return html;
  }
};
/******************************普查信息部分结束**********************************/

/*点击某一行 填好省市区*************************************************************/
function showBaseRegion(obj, action) {
  var region = obj.region;
  new Promise(function(resolve, reject) {
    for (var act of action) {
      showSubRegion("#region" + act, region, resolve); //请求区县
    }
  }).then(function(value) {
    new Promise(function(resolve, reject) {
      for (var act of action) {
        accordIdGetRegion("#city" + act, value, resolve);
      }
    }).then(function(v) {
      for (var act of action) {
        accordIdGetRegion("#province" + act, v);
      }
    });
  });
}
function showSubRegion(obj, region, resolve) {
  $.ajax({
    type: "GET",
    url: $g.API_URL.REGION_SUB.compose(host),
    data: { id: region.parentId },
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
    },
    success: function(data) {
      if (data.code == 0) {
        var oData = data.data;
        $(obj).html(returnSingleOption(oData));
        $(obj).val(region.id);
        if (resolve) {
          resolve(region.parentId);
        }
      }
    }
  });
}
function accordIdGetRegion(obj, id, resolve) {
  $.ajax({
    url: $g.API_URL.REGIONS.compose(host),
    type: "GET",
    data: { id: id },
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", $.cookie("token"));
    },
    success: function(data) {
      if (data.code == 0) {
        var oData = data.data;
        showSubRegion(obj, oData);
        $(obj).val(oData.id);
        if (resolve) {
          resolve(oData.parentId);
        }
      }
    }
  });
}

/*获取城市编号并显示***********************************************************************/
function showCityCodes(id, action) {
  return new Promise(function(resolve, reject) {
    $.ajax({
      type: "GET",
      url: $g.API_URL.REGION_CITY_CODE.compose(host),
      data: { id: id },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      },
      success: function(data) {
        if (data.code == 0) {
          var oData = data.data;
          if (oData == null || oData == undefined) {
            for (var act of action) {
              $("#cityCode" + act).html("");
            }
          } else {
            oData = oData.cityCodes;
            for (var act of action) {
              $("#cityCode" + act)
                .html(returnCityCode(oData))
                .val("");
            }
          }
          resolve();
        }
      }
    });
  });
}
function returnCityCode(arr) {
  var html = "";
  for (var a of arr) {
    html += '<option value="' + a + '">' + a + "</option>";
  }
  return html;
}

//*去分配***********************************************************************/
function goToAssign(obj) {
  var assignIds = $(obj)
    .parents(".modal")
    .attr("data-assignIds")
    .split(",");
  $("#treeModal").modal("hide");
  var mjpTree = $.fn.zTree.getZTreeObj("mjpOg");
  var node = mjpTree.getCheckedNodes();
  var data = new FormData();
  data.append("pendingMvoOwner", true);
  data.append("staffId", node[0].staffId);
  for (var i = 0; i < assignIds.length; i++) {
    data.append("id", assignIds[i]);
  }
  $.ajax({
    url: $g.API_URL.OUTLET_ASSIGNATION.compose(host),
    type: "put",
    data: data,
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    success: function(data) {
      console.log(data);
      if (data.code == 0) {
        $("#mainPart").hide();
        var oData = data.data;
        $("#" + oData.id).addClass("notFocus");
      } else {
        opts.alert(data.msg);
      }
    }
  });
}

//*状态转换***********************************************************************/
function translateState(url, arr) {
  var ids = new FormData();
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    ids.append("id", arr[i]);
  }
  $.ajax({
    type: "put",
    url: url,
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    data: ids,
    success: function(data) {
      if (data.code == $g.API_CODE.OK) {
        var oData = data.data;
        for (var record of oData) {
          var key = "o" + record.id;
          var state = record.mvoState;
          var btnH =
            returnSwitchHTML(state) == "" ? "" : returnSwitchHTML(state);
          var oldV = JSON.parse(storage.getSession(key));
          for (var item in record) {
            oldV[item] = record[item];
          }
          storage.setSession(key, JSON.stringify(oldV));
          $("#" + record.id + " td:eq(2)").text(returnStateText(state));
          $("#" + record.id)
            .find(".c_state")
            .attr("data-status", record.mvoState);
          $("#" + record.id)
            .find(".translate")
            .attr("data-status", record.mvoState)
            .html(btnH);
        }
      } else {
        opts.alert(data.msg);
      }
    }
  });
}
function returnSwitchHTML(state) {
  if (state == "UO") {
    return 'Universe<i class="fa fa-long-arrow-right"></i>Target Universe';
  }
  if (state == "TUO") {
    return 'Target Universe<i class="fa fa-long-arrow-right"></i>Pending MVO';
  }
  if (state == "MVO") {
    return 'MVO<i class="fa fa-long-arrow-right"></i>Target Universe';
  }
  if (state == "PMVO") {
    return "";
  }
}

//*Tree配置***********************************************************************/
//assign
var setting = {
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
    beforeClick: tree.beforeClick,
    beforeCheck: function(treeId, treeNode) {
      var mjpTree = $.fn.zTree.getZTreeObj(treeId);
      tree.checkOne(mjpTree, treeNode);
    }
  }
};
//search
var layerSetting = {
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
    beforeClick: tree.beforeClick,
    beforeCheck: function(treeId, treeNode) {
      var dataScope = $("#chooseSales").attr("data-scope");
      if (dataScope != null) {
        dataScope = dataScope.split(",");
        tree.checkNode(treeId, treeNode, dataScope);
      } else {
        tree.checkNode(treeId, treeNode);
      }
    }
  }
};
/***************************公用请求************************************************ */
//salesTree
function salesTree() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.STAFF_SALES_RETRIEVAL.compose(host),
      type: "GET",
      success: function(data) {
        if (data.code == $g.API_CODE.OK) {
          resolve(data.data);
        } else {
          codeError(data, "请求销售人员树出错了");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "请求销售人员树出错了");
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
          codeError(data, "请求数据权限出错了");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "请求数据权限出错了");
      }
    });
  });
}
//初始化下拉框内容
function questAndShowBaseSelectData(action) {
  const quest = new Promise(function(resove, reject) {
    $.ajax({
      url: $g.API_URL.BASE_DATA_VERSION.compose(host),
      type: "GET",
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", $.cookie("token"));
      },
      success: function(data) {
        if (data.code == 0) {
          var allData = [];
          for (var obj in data.data) {
            if (constant.baseDropMenu.includes(obj)) {
              allData.push(obj);
            }
          }
          resove(allData);
        }
      },
      error: function(xhr) {
        reject(xhr);
      }
    });
  });
  quest.then(
    function(value) {
      if (value.length > 0) {
        for (var i = 0; i < value.length; i++) {
          questSingleSelect(value[i], action);
        }
      }
    },
    function(value) {
      console.log(value);
    }
  );
}
function questSingleSelect(obj, action) {
  $.ajax({
    url: $g.API_URL.BASE_DATA_RETRIEVAL.compose(host),
    type: "GET",
    data: { dataType: obj },
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", $.cookie("token"));
    },
    success: function(data) {
      if (data.code == 0) {
        var oData = data.data;
        if (obj == "channel" || obj == "classification") {
          $("#" + obj + "_glo").append(returnSingleOption(oData));
        }
        for (var act of action) {
          $("#" + obj + act)
            .html(returnSingleOption(oData))
            .val("");
        }
      }
    }
  });
}
function returnSingleOption(arr) {
  var html = "";
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    html += "<option value=" + arr[i].id + ">" + arr[i].name + "</option>";
  }
  return html;
}
//初始化分配树
function initAssignTree(tree) {
  tree = parseTree(tree);
  $.fn.zTree.init($("#mjpOg"), setting, tree);
  var mjpTree = $.fn.zTree.getZTreeObj("mjpOg");
  mjpTree.expandAll(true);
  var leafNodes = mjpTree.getNodesByParam("children", null);
  for (var obj of leafNodes) {
    mjpTree.removeNode(obj);
  }
}
//初始化层级搜索树
function initSearchTree(tree) {
  tree = parseTree(tree);
  $.fn.zTree.init($("#mjpLayer"), layerSetting, tree);
  var mjpTree = $.fn.zTree.getZTreeObj("mjpLayer");
  mjpTree.expandAll(true);
}
//写入datascope
function putDataScope(scope, obj) {
  var depart = scope.departments;
  var dataScope = depart == undefined ? null : returnDataScope(depart);
  $(obj).attr("data-scope", dataScope);
}
function returnDataScope(arr) {
  var scope = "";
  for (var item of arr) {
    scope += item.id + ",";
  }
  return scope.substring(0, scope.length - 1);
}
//请求详情
function questOutletDetail(id, action) {
  var key = "o" + id;
  var value = JSON.parse(storage.getSession(key));
  showBaseRegion(value, action);
  showCityCodes(value.region.id, action).then(function() {
    for (var fl of action) {
      field.display(value, fl);
    }
  });
}
//请求列表成功后显示    obj：请求成功的data； page：'pmvo/search/approval'******************/
var maxPage = 0;
var loadAll = false;
function questListSuccess(obj, page) {
  var nextPageSign = obj.nextPageSign; //下一页的pageSign
  var total = obj.total; //总共有多少条记录
  var records = obj.records; //返回的记录数组
  maxPage = Math.ceil(records.length / size); //返回的记录一共有多少页
  if (nextPageSign != undefined) {
    storage.setSession(page + "PageSign", nextPageSign);
  }
  cacheMvoDetail(records, page); //获取到的记录存入session
  //显示一共有多少页
  pageNum = Math.ceil(total / size);
  $("#pageTotal").text(pageNum);

  //显示第一页的数据
  var html = "";
  if (pageNum == 0) {
    html = '<b class="nodatatip">暂无数据!<b>';
    $("table").addClass("border-none");
    $(".pageAndbtn").hide();
  } else {
    html = returnOutletTable(1, page);
    $("table").removeClass("border-none");
    $(".pageAndbtn").show();
  }
  if (page == "pmvo") {
    $("#assignBox").html(html);
  }
  if (page == "approval") {
    $("#approveBox").html(html);
  }
  if (page == "search") {
    $("#outletBox").html(html);
  }
  //显示分页按钮
  var pageBtn = pageNum > btnSize ? btnSize : pageNum;
  var btnHtml = pageBtn == 0 ? "" : returnPageBtn(pageBtn);
  $("#pageAll").html(btnHtml);
}
//详情存入本地
function cacheMvoDetail(arr, page) {
  var ids = [];
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    ids.push(arr[i].id);
    var key = "o" + arr[i].id;
    var value = JSON.stringify(arr[i]);
    storage.setSession(key, value);
  }
  storage.setSession(page, JSON.stringify(ids));
}
//返回列表代码
function returnOutletTable(currentPage, page) {
  var ids = JSON.parse(storage.getSession(page));
  var start = (currentPage - 1) * size;
  var end = start + size - 1;
  if (currentPage == maxPage && loadAll) {
    end = ids.length - 1;
  }
  var curIds = [];
  for (var i = start; i <= end; i++) {
    if (ids[i] != undefined) {
      curIds.push(ids[i]);
    }
  }
  if (page == "pmvo") {
    return pmvoHtml(curIds);
  }
  if (page == "approval") {
    return approveHtml(curIds);
  }
  if (page == "search") {
    return searchHtml(curIds);
  }
}
//请求某一页数据
function questOnePage(url, page) {
  let ids = JSON.parse(storage.getSession(page));
  let start = (currentPage - 1) * size;
  let end = start + size - 1;
  if (end <= ids.length - 1) {
    var html = returnOutletTable(currentPage, page);
    if (page == "pmvo") {
      $("#assignBox").html(html);
    }
    if (page == "approval") {
      $("#approveBox").html(html);
    }
    if (page == "search") {
      $("#outletBox").html(html);
    }
  } else {
    var nextPageSign = storage.getSession(page + "PageSign");
    $.ajax({
      url: url,
      type: "GET",
      data: {
        pageSize: constant.pageSize,
        pageSign: nextPageSign
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", $.cookie("token"));
        opts.showLoading();
      },
      success: function(data) {
        if (data.code == 0) {
          var oData = data.data;
          var nextPageSign = oData.nextPageSign;
          var records = oData.records;
          maxPage = maxPage + Math.ceil(records.length / size);
          if (nextPageSign == undefined) {
            //后面没有数据
            loadAll = true;
          } else {
            storage.setSession(page + "PageSign", nextPageSign);
          }
          var oldIds = JSON.parse(storage.getSession(page));
          for (var i = 0; i < records.length; i++) {
            var key = "o" + records[i].id;
            storage.setSession(key, JSON.stringify(records[i]));
            oldIds.push(records[i].id);
          }
          storage.setSession(page, JSON.stringify(oldIds));
          var html = returnOutletTable(currentPage, page);
          if (page == "pmvo") {
            $("#assignBox").html(html);
          }
          if (page == "approval") {
            $("#approveBox").html(html);
          }
          if (page == "search") {
            $("#outletBox").html(html);
          }
          opts.hideLoading();
        } else {
          codeError(data, "请求此页数据出错");
        }
      }
    });
  }
}
function pmvoHtml(arr) {
  var html = "";
  for (var j = 0; j < arr.length; j++) {
    var key = "o" + arr[j];
    var value = JSON.parse(storage.getSession(key));
    var regionId = value.region == undefined ? null : value.region.id;
    var regionText = value.region == undefined ? "待定" : value.region.name;
    html +=
      '<tr class="even pointer" id="' +
      value.id +
      '">' +
      '<td class="a-center ">' +
      '<div class="icheckbox_flat-green" style="position: relative;">' +
      '<ins class="iCheck-helper"></ins>' +
      "</div>" +
      "</td>" +
      '<td class=" ">' +
      value.name +
      "</td>" +
      '<td class=" ">' +
      returnStateText(value.mvoState) +
      "</td>" +
      '<td class=" " data-region="' +
      regionId +
      '">' +
      regionText +
      "</td>" +
      '<td class=" ">' +
      '<a class="toAssign" href="javascript:;"><i class="fa fa-share-square-o"></i>分配</a>' +
      "</td>" +
      "</tr>";
  }
  return html;
}
function approveHtml(arr) {
  var html = "";
  for (var j = 0; j < arr.length; j++) {
    var key = "o" + arr[j];
    var value = JSON.parse(storage.getSession(key));
    var regionId = value.region == undefined ? null : value.region.id;
    var regionText = value.region == undefined ? "待定" : value.region.name;
    html +=
      '<tr class="even pointer" id="' +
      value.id +
      '">' +
      '<td class=" ">' +
      value.name +
      "</td>" +
      '<td class=" ">' +
      returnStateText(value.mvoState) +
      "</td>" +
      '<td class=" " data-region="' +
      regionId +
      '">' +
      regionText +
      "</td>" +
      "</tr>";
  }
  return html;
}
function searchHtml(arr) {
  var html = "";
  for (var j = 0; j < arr.length; j++) {
    var key = "o" + arr[j];
    var value = JSON.parse(storage.getSession(key));
    var state = value.mvoState;
    var underApproving = value.underApproving;
    var regionId = value.region == undefined ? null : value.region.id;
    var regionText = value.region == undefined ? "待定" : value.region.name;
    var employeeId =
      value.eoeExecutor == undefined ? null : value.eoeExecutor.id;
    var employeeName =
      value.eoeExecutor == undefined ? "暂无" : value.eoeExecutor.name;
    var switchBtn = returnOptionBtn(state, "switch", underApproving); //分配按钮
    var assignBtn = returnOptionBtn(state, "assign", underApproving); //状态转换按钮
    html +=
      '<tr class="pointer" id="' +
      value.id +
      '">' +
      '<td class="a-center ">' +
      '<div class="icheckbox_flat-green" style="position: relative;">' +
      '<ins class="iCheck-helper"></ins>' +
      "</div>" +
      "</td>" +
      '<td class=" ">' +
      value.name +
      "</td>" +
      '<td class="c_state" data-status="' +
      state +
      '">' +
      returnStateText(state) +
      "</td>" +
      '<td class=" " data-region="' +
      regionId +
      '">' +
      regionText +
      "</td>" +
      '<td data-eoeCode="' +
      employeeId +
      '" class=" ">' +
      employeeName +
      "</td>" +
      '<td class=" ">' +
      // editBtn +
      switchBtn +
      assignBtn +
      "</td>" +
      "</tr>";
  }
  return html;
}
//每一行显示哪些操作按钮
function returnOptionBtn(state, opt, underApproving) {
  var html = "";
  var permission = opts.permission();
  if (opt == "assign" && permission.outletAssignation && state == "PMVO") {
    html =
      '<a class="toAssign" href="javascript:;"><i class="fa fa-share-square-o"></i>分配</a>';
  }
  if (opt == "switch") {
    var text = "";
    if (permission.uo2tuo && state == "UO") {
      text = 'Universe<i class="fa fa-long-arrow-right"></i>Target Universe';
    }
    if (permission.tuo2pmvo && state == "TUO") {
      text = 'Target Universe<i class="fa fa-long-arrow-right"></i>Pending MVO';
    }
    if (permission.mvo2tuo && state == "MVO") {
      text = 'MVO<i class="fa fa-long-arrow-right"></i>Target Universe';
    }
    html =
      '<a data-status="' +
      state +
      '" class="translate" href="javascript:;">' +
      text +
      "</a>";
  }
  return html;
}
