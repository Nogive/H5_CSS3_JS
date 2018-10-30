$(document).ready(function() {
  field.create("Show");
  opts.showLoading();
  Promise.all([
    questAssignList(),
    salesTree(),
    currentDataScope(),
    questAndShowBaseSelectData(constant.assign)
  ]).then(function([list, tree, scope]) {
    questListSuccess(list, "pmvo");
    initAssignTree(tree); //分配Tree
    initSearchTree(tree); //组织层级Tree
    putDataScope(scope, "#chooseSales");
    opts.hideLoading();
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
  //点击某一行
  $("#assignBox").on("click", ".pointer", function() {
    var id = $(this).attr("id");
    questOutletDetail(id, constant.assign);
    var detail = JSON.parse(storage.getSession("o" + id));
    $("#curName").text(detail.name);
    $("#base").tab("show");
    $("#detailModal")
      .modal()
      .attr("data-outletId", id);
    questSurvey(id);
  });

  //分配给...
  $("#assignTo").click(function() {
    var cordNum = $("#recordTotal").text();
    if (cordNum == 0) {
      opts.alert("您还未选中任何outlet，请勾选要分配的outlet。");
    } else {
      var assignIds = returnCheckedId().join(",");
      $("#treeModal")
        .attr("data-assignIds", assignIds)
        .modal();
    }
  });

  //点击下一页
  $("#pageAll").on("click", "#to_next", function() {
    questOnePage($g.API_URL.PENDING_MVO_DETAIL.compose(host), "pmvo");
  });
  //点击上一页
  $("#pageAll").on("click", "#to_prev", function() {
    questOnePage($g.API_URL.PENDING_MVO_DETAIL.compose(host), "pmvo");
  });
  //点击某一页
  $("#pageAll").on("click", ".pageBtn", function() {
    currentPage = $(this).text();
    questOnePage($g.API_URL.PENDING_MVO_DETAIL.compose(host), "pmvo");
  });
});
/*****************页面加载时请求的数据************************************************** */
//请求列表
function questAssignList(param) {
  var data = param ? param : { pageSize: constant.pageSize };
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.PENDING_MVO_DETAIL.compose(host),
      type: "GET",
      data: data,
      success: function(data) {
        if (data.code == 0) {
          resolve(data.data);
        } else {
          codeError(data, "请求需要分配的网点列表出错");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "请求需要分配的网点列表出错");
      }
    });
  });
}
//*根据条件检索页面***********************************************************************/
function questNewRecordsByTree() {
  var data = { pageSize: constant.pageSize };
  var ids = $("#chooseSales").attr("select-scope");
  if (ids != undefined) {
    data.departmentIds = JSON.stringify(ids.split(","));
  }

  questAssignList(data).then(function(value) {
    questListSuccess(value, "pmvo");
  });
}
