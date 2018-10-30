var questApis = [];
$(function() {
  var permission = opts.permission();
  if (permission.outletApproval) {
    questApis.push(questApproval());
  }
  if (permission.outletAssignation) {
    questApis.push(questAssign());
  }
  if (questApis.length > 0) {
    opts.showLoading();
    Promise.all(questApis).then(function(value) {
      for (var o of value) {
        if (o.total == 0) {
          $("#" + o.opt).text(o.total);
        } else {
          $("#" + o.opt)
            .text(o.total)
            .addClass("red");
        }
      }
      opts.hideLoading();
    });
  }
  //reload every 5minute
  reloadIndexPage();

  $(".animated").click(function() {
    $("#newMessage").hide();
  });
});
//请求待分配
function questAssign() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.PENDING_MVO_DETAIL.compose(host),
      type: "GET",
      success: function(data) {
        if (data.code == $g.API_CODE.OK) {
          var obj = {
            total: data.data.total,
            opt: "assigning"
          };
          resolve(obj);
        } else {
          codeError(data, "请求待分配的网点出错");
        }
      }
    });
  });
}
//请求待审批
function questApproval() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.UNDER_APPROVING_DETAIL.compose(host),
      type: "GET",
      success: function(data) {
        if (data.code == $g.API_CODE.OK) {
          var obj = {
            total: data.data.total,
            opt: "approving"
          };
          resolve(obj);
        } else {
          codeError(data, "请求待审批的网点出错");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "请求待审批数据出错了，请稍后刷新重试");
      }
    });
  });
}
//reload every 5minute
function reloadIndexPage() {
  setInterval(function() {
    Promise.all(questApis).then(function(value) {
      for (var o of value) {
        if (o.total == 0) {
          $("#" + o.opt).text(o.total);
        } else {
          $("#" + o.opt)
            .text(o.total)
            .addClass("red");
        }
      }
      opts.hideLoading();
    });
  }, 1000 * 60 * 5);
}
