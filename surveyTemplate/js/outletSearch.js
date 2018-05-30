$(document).ready(function() {
  field.create();
  opts.showLoading();
  Promise.all([
    questOutletList(),
    salesTree(),
    currentDataScope(),
    questAndShowBaseSelectData(constant.search)
  ]).then(function([list, tree, scope]) {
    questListSuccess(list, "search");
    initAssignTree(tree); //分配Tree
    initSearchTree(tree); //组织层级Tree
    putDataScope(scope, "#chooseSales");
    opts.hideLoading();
  });
  //根据条件检索
  $(".searchItem").change(function() {
    questNewRecordsByTree();
  });
  $("#layerBtn").click(function() {
    var mjpTree = $.fn.zTree.getZTreeObj("mjpLayer");
    var checked = mjpTree.getCheckedNodes();
    var a = [];
    var text = [];
    for (var node of checked) {
      a.push(node.id);
      text.push(node.staffName);
    }
    text = text.length == 0 ? "所有" : text.join(",");
    $("#chooseSales")
      .attr("select-scope", a.join(","))
      .val(text);
    $("#layerModal").modal("hide");
    questNewRecordsByTree();
  });
  //UO——TUO
  $("#transBox").on("click", "#uo2tuo", function() {
    var text = "是否确定要执行：" + $(this).text() + " 操作？";
    var checkedoutlet = returnCheckedId();
    if (checkedoutlet.length == 0) {
      opts.alert("您还为选择任何outlet，请先勾选outlet.");
    } else {
      checkValid("UO")
        ? opts.tip(text, "uo2tuo", checkedoutlet)
        : opts.alert('抱歉，选择了状态不是"UO"的记录，请重新选择.');
    }
  });
  //TUO——PMVO
  $("#transBox").on("click", "#tuo2pmvo", function() {
    var text = "是否确定要执行：" + $(this).text() + " 操作？";
    var checkedoutlet = returnCheckedId();
    if (checkedoutlet.length == 0) {
      opts.alert("您还为选择任何网点，请先勾选网点.");
    } else {
      checkValid("TUO")
        ? opts.tip(text, "tuo2pmvo", checkedoutlet)
        : opts.alert(
            '抱歉，选择了状态不是"Target Universe"的记录，请重新选择.'
          );
    }
  });
  //MVO——TUO
  $("#transBox").on("click", "#mvo2tuo", function() {
    var text = "是否确定要执行：" + $(this).text() + " 操作？";
    var checkedoutlet = returnCheckedId();
    if (checkedoutlet.length == 0) {
      opts.alert("您还为选择任何网点，请先勾选网点.");
    } else {
      checkValid("MVO")
        ? opts.tip(text, "mvo2tuo", checkedoutlet)
        : opts.alert('抱歉，选择了状态不是"MVO"的记录，请重新选择.');
    }
  });
  //单个UO->TUO/TUO->PMVO
  $("#outletBox").on("click", ".translate", function(e) {
    e.stopPropagation();
    var id = $(this)
      .parents("tr")
      .attr("id");
    var status = $(this).attr("data-status");
    if (status == "UO") {
      opts.tip(
        "是否确定要执行：Universe转为Target Universe 操作？",
        "uo2tuo",
        id
      );
    }
    if (status == "TUO") {
      opts.tip(
        "是否确定要执行：Target Universe转为Pending MVO 操作？",
        "tuo2pmvo",
        id
      );
    }
    if (status == "MVO") {
      opts.tip("是否确定要执行：MVO转为Target Universe 操作？", "mvo2tuo", id);
    }
  });
  //分配给...
  $("#optBox").on("click", "#assignTo", function() {
    var cordNum = $("#recordTotal").text();
    if (cordNum == 0) {
      opts.alert("您还未选中任何网点，请勾选要分配的网点。");
    } else {
      var assignIds = returnCheckedId().join(",");
      checkValid("PMVO")
        ? $("#treeModal")
            .attr("data-assignIds", assignIds)
            .modal()
        : opts.alert(
            "抱歉，有不能被分配的网点被勾选了，请根据状态进行重新勾选。"
          );
    }
  });
  //点击下一页
  $("#pageAll").on("click", "#to_next", function() {
    questOnePage($g.API_URL.OUTLET_DETAIL_RETRIEVAL.compose(host), "search");
  });
  //点击上一页
  $("#pageAll").on("click", "#to_prev", function() {
    questOnePage($g.API_URL.OUTLET_DETAIL_RETRIEVAL.compose(host), "search");
  });
  //点击某一页
  $("#pageAll").on("click", ".pageBtn", function() {
    currentPage = $(this).text();
    questOnePage($g.API_URL.OUTLET_DETAIL_RETRIEVAL.compose(host), "search");
  });
  //点击某一行
  $("#outletBox").on("click", ".pointer", function() {
    var id = $(this).attr("id");
    questOutletDetail(id, constant.search);
    var detail = JSON.parse(storage.getSession("o" + id));
    $("#curName").text(detail.name);
    $("#base").tab("show");
    $("#detailModal")
      .modal()
      .attr("data-outletId", id);
    questSurvey(id);
  });
});
//检查多选操作是否合法
function checkValid(state) {
  var res = true;
  $(".a-center div").each(function() {
    if ($(this).hasClass("checked")) {
      var status = $(this)
        .parents("tr")
        .find(".c_state")
        .attr("data-status");
      if (status != state) {
        res = false;
      }
    }
  });
  return res;
}

//是否确定进行状态转换操作
function questWhich(action, parameter) {
  switch (action) {
    case "uo2tuo":
      parameter = parameter.split(",");
      translateState($g.API_URL.OUTLET_UO2TUO.compose(host), parameter);
      break;
    case "tuo2pmvo":
      parameter = parameter.split(",");
      translateState($g.API_URL.OUTLET_TUO2PMVO.compose(host), parameter);
      break;
    case "mvo2tuo":
      parameter = parameter.split(",");
      translateState($g.API_URL.OUTLET_MVO2TUO.compose(host), parameter);
      break;
  }
}
/*****************页面加载时请求的数据************************************************** */
//列表数据
function questOutletList(param) {
  var data = param ? param : { pageSize: constant.pageSize };
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.OUTLET_DETAIL_RETRIEVAL.compose(host),
      type: "GET",
      data: data,
      success: function(data) {
        if (data.code == $g.API_CODE.OK) {
          resolve(data.data);
        } else {
          codeError(data, "请求网点列表出错了");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "请求网点列表出错了");
      }
    });
  });
}
//*根据条件检索页面***********************************************************************/
function questNewRecordsByTree() {
  opts.showLoading();
  var data = { pageSize: constant.pageSize };
  $(".searchItem").each(function() {
    var w = $(this)
      .attr("id")
      .split("_")[0];
    var val = $(this).val();
    if (val != "") {
      w == "mvoState" ? (data[w] = val) : (data[w + "Id"] = val);
    }
  });
  var ids = $("#chooseSales").attr("select-scope");
  if (ids != undefined && ids != "") {
    data.departmentIds = JSON.stringify(ids.split(","));
  }

  questOutletList(data).then(function(value) {
    questListSuccess(value, "search");
    opts.hideLoading();
  });
}
