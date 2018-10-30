"use strict";
$(document).ready(function() {
  opts.showLoading();
  Promise.all([questStaffOfTree(), questDataScope()]).then(function([
    staffTree,
    dataScope
  ]) {
    InitPage(staffTree, dataScope);
    opts.hideLoading();
  });
  //日期配置
  $.fn.datetimepicker.dates["en"] = {
    days: [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
      "星期日"
    ],
    daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
    months: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月"
    ],
    monthsShort: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12"
    ],
    today: "今天",
    meridiem: false
  };
  $(".date").datetimepicker({
    language: "en",
    format: "yyyy-mm",
    autoclose: 1,
    startView: 3,
    minView: 3,
    maxView: 3,
    viewSelect: 3
  });

  //点击勾选业务员
  $("#staffInput").click(function() {
    var dataScope = $(this).attr("data-scope");
    if (dataScope == null) {
      opts.alert("抱歉，您没有权限进行选择。");
    } else {
      var selectScope = $(this).attr("select-scope");
      var areaTree = $.fn.zTree.getZTreeObj("mjpStaff");
      tree.raseTree(areaTree);
      tree.checkInDataScope(areaTree, dataScope);
      if (selectScope != null) {
        tree.showCurrentChecked(areaTree, selectScope);
      }
      $("#staffModal").modal({ backdrop: "static" });
    }
  });

  //业代+月份搜索
  $("#searchInStaff").click(function() {
    var staffId = $("#staffInput").attr("data-staff");
    var mInput =
      $("#monthOfstaff")
        .val()
        .split(" ")[0] + " 00:00:00";
    if (mInput != "" && staffId != undefined) {
      var searchData = {
        staffId: staffId,
        month: Date.parse(mInput)
      };
      searchByStaff(searchData, true);
    } else {
      opts.alert("请补充搜索条件后再搜索。");
    }
  });
  //网点名称+月份搜索
  $("#searchInOutlet").click(function() {
    var outletName = $("#outlet").val();
    var mInput =
      $("#monthOfoutlet")
        .val()
        .split(" ")[0] + " 00:00:00";
    if (outletName != "" && mInput != "") {
      var searchData = {
        name: outletName,
        month: Date.parse(mInput)
      };
      searchByOutlet(searchData, false);
    } else {
      opts.alert("请补充搜索条件后再搜索。");
    }
  });
  //suit table height
  let tableHeight = $(".right_col").height() - $(".planBox").offset().top;
  $(".planBox").css("max-height", tableHeight);
});
/**************************searchByStaff**************************** */
function searchByStaff(searchData) {
  opts.showLoading();
  $.ajax({
    url: $g.API_URL.PLAN_QUERY_BY_STAFF.compose(host),
    type: "GET",
    data: searchData,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      opts.showLoading();
    },
    success: function(data) {
      if (data.code == 0) {
        if (data.data == undefined) {
          var html = noRecord.staff;
          $("#planByStaff").html(html);
          opts.hideLoading();
        } else {
          showSearchRecords(data.data);
          //var result = data.data.data;
          //var records = returnRecords(result);
          //questOutletName(records);
        }
      } else {
        codeError(data, "查询出错");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "查询失败了");
    }
  });
}
//create search result
function showSearchRecords(resultArray) {
  let clientIds = getCliendIds(resultArray);
  questOutletName(clientIds).then(function(value) {
    console.log(value);
    let html = "";
    resultArray.forEach(e => {
      let staff = e.staff;
      let records = returnRecords(e.data);
      html += showSearchResultByStaff(value, records, staff);
    });
    $("#planByStaff").html(html);
    opts.hideLoading();
  });
}
//return client id
function getCliendIds(arr) {
  var records = [];
  arr.forEach(e => {
    let plan = e.data;
    plan.forEach(e => {
      let outlets = e.outlets;
      outlets.forEach(e => {
        if (!records.includes(e)) {
          records.push(e);
        }
      });
    });
  });
  return records;
}

function questOutletName(records) {
  var params = "";
  for (var id in records) {
    params += "id=" + id + "&";
  }
  params = params.substring(0, params.length - 1);
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.OUTLET_BATCH_RETRIEVAL.compose(host),
      type: "GET",
      data: params,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      },
      success: function(data) {
        if (data.code == $g.API_CODE.OK) {
          resolve(data.data);
          //var html = showSearchResultByStaff(records, data.data);
          //$("#planByStaff").html(html);
          //opts.hideLoading();
        } else {
          codeError(data, "查询出错");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "查询失败了");
      }
    });
  });
}
// one staff records
function returnRecords(dataObj) {
  let records = {};
  for (var p of dataObj) {
    for (var o of p.outlets) {
      if (records.hasOwnProperty(o)) {
        records[o].push(p.day);
      } else {
        records[o] = [p.day];
      }
    }
  }
  return records;
}
function showSearchResultByStaff(outlets, records, staff) {
  var html = "";
  for (var r in records) {
    let name = getOutletName(r, outlets);
    html +=
      '<tr class="even pointer">' +
      '<td class="createTime">' +
      staff.name +
      "</td>" +
      '<td class="createTime">' +
      name +
      "</td>" +
      '<td class=" ">' +
      returnDayHtml(records[r]) +
      "</td>" +
      "</tr>";
  }
  return html;
}
//current outlet name
function getOutletName(id, outlets) {
  let name;
  outlets.forEach(e => {
    if (e.id == id) {
      name = e.name;
    }
  });
  return name;
}
/**************************searchByStaff  end**************************** */

/**************************searchByName**************************** */
function searchByOutlet(searchData) {
  opts.showLoading();
  $.ajax({
    url: $g.API_URL.PLAN_QUERY_BY_OUTLET.compose(host),
    type: "GET",
    data: searchData,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      opts.showLoading();
    },
    success: function(data) {
      console.log(data);
      if (data.code == 0) {
        if (data.data == undefined) {
          var html = noRecord.name;
        } else {
          var result = data.data;
          var records = {};
          for (var p of result) {
            var id = p.outlet.id;
            records[id] = { name: p.outlet.name };
            if (p.plan == undefined) {
              records[id].staffName = "无";
              records[id].month = " ";
            } else {
              records[id].staffName = p.plan.staff.name;
              var planning = p.plan.data;
              records[id].month = returnPlanDate(planning, id);
            }
          }
          var html = showSearchResultByName(records);
        }
        $("#planByOutlet").html(html);
        opts.hideLoading();
      } else {
        codeError(data, "查询出错");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "查询失败了");
    }
  });
}
function returnPlanDate(plan, id) {
  var month = [];
  for (var o of plan) {
    if (o.outlets.includes(id)) {
      month.push(o.day);
    }
  }
  return month;
}
function showSearchResultByName(obj) {
  var html = "";
  for (var item in obj) {
    var months = obj[item].month == " " ? "无" : returnDayHtml(obj[item].month);
    html +=
      '<tr class="even pointer">' +
      '<td class="createTime">' +
      obj[item].name +
      "</td>" +
      '<td class="createTime">' +
      obj[item].staffName +
      "</td>" +
      '<td class=" ">' +
      months +
      "</td>" +
      "</tr>";
  }
  return html;
}
/**************************searchByName    end**************************** */
function returnDayHtml(arr) {
  var html = "";
  for (var d of arr) {
    html += '<span class="day">' + timestamp2String(d) + "</span>";
  }
  return html;
}
var noRecord = {
  staff: function() {
    return (
      '<tr class="even pointer">' +
      '<td class="">暂无记录</td>' +
      '<td class=" "></td>' +
      "</tr>"
    );
  },
  name: function() {
    return (
      '<tr class="even pointer">' +
      '<td class="">暂无记录</td>' +
      '<td class=" "></td>' +
      '<td class=" "></td>' +
      "</tr>"
    );
  }
};
//init  Tree**********************************************************************/
var staffSetting = {
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
    beforeClick: function() {
      return true;
    },
    beforeCheck: function(treeId, treeNode) {
      clickOneNode(treeId, treeNode);
    },
    onClick: function(e, treeId, treeNode) {
      if (treeNode.chkDisabled) {
        opts.alert("抱歉，您没有权限查看该业务员的计划。");
      } else {
        clickOneNode(treeId, treeNode);
      }
    }
  }
};
function clickOneNode(treeId, treeNode) {
  var name =
    treeNode.employeeName == undefined ? "空缺" : treeNode.employeeName;
  var dataScope = $("#staffInput").attr("data-scope");
  if (dataScope != null) {
    dataScope = dataScope.split(",");
    tree.checkNode(treeId, treeNode, dataScope);
  } else {
    tree.checkNode(treeId, treeNode);
  }
  $("#staffInput")
    .val(treeNode.staffName + ":" + name)
    .attr("data-staff", treeNode.staffId);
  $("#staffModal").modal("hide");
}
function questStaffOfTree() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.STAFF_SALES_RETRIEVAL.compose(host),
      type: "GET",
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      },
      success: function(data) {
        if (data.code == 0) {
          resolve(data.data);
        }
      },
      error: function() {
        throw new Error("加载失败了，请稍后重试。");
      }
    });
  });
}
function questDataScope() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.STAFF_RETRIEVAL.compose(host),
      type: "GET",
      dataType: "json",
      success: function(data) {
        if (data.code == $g.API_CODE.OK) {
          resolve(data.data);
        }
      },
      error: function() {
        throw new Error("加载失败了，请稍后重试。");
      }
    });
  });
}
function InitPage(staffTree, dataScope) {
  staffTree = parseTree(staffTree);
  $.fn.zTree.init($("#mjpStaff"), staffSetting, staffTree);
  var mjpTree = $.fn.zTree.getZTreeObj("mjpStaff");
  mjpTree.expandAll(true);
  var depart = dataScope.departments;
  let scope;
  if (depart == undefined) {
    scope = null;
  } else {
    scope = returnDataScope(depart);
  }
  $("#staffInput").attr("data-scope", scope);
}
function returnDataScope(arr) {
  var scope = "";
  for (var item of arr) {
    scope += item.id + ",";
  }
  return scope.substring(0, scope.length - 1);
}
//************  init**end****************************************************************/
