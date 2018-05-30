$(document).ready(function() {
  opts.showLoading();
  field.create("Left");
  field.create("Right");
  Promise.all([
    questApprovalList(),
    questAndShowBaseSelectData(constant.approval)
  ]).then(function([list]) {
    console.log(list);
    questListSuccess(list, "approval");
    opts.hideLoading();
  });
  //点击某一行 (显示驳回信息)
  $("#approveBox").on("click", ".pointer", function() {
    var id = $(this).attr("id");
    $("#optBox .btn").attr("data-id", id);

    var status = JSON.parse(storage.getSession("o" + id)).mvoState;
    if (status == "NO") {
      questOutletDetail(id, constant.approval); //原数据
      $("#mapWidth").attr("data-width", "600");
      $(".leftInfo,#leftTitle").remove();
      $("#newPart,#rightTitle")
        .addClass("col-md-12")
        .removeClass("col-md-6");
      questNewBaseInfoAndShow(id); //新数据
    } else {
      questOutletDetail(id, constant.approval); //原数据
      questNewBaseInfoAndShow(id); //新数据
    }
    $("#mainPart").show();
  });
  //点击驳回
  $("#reject").click(function() {
    var cordId = $(this).attr("data-id");
    cordId == undefined
      ? opts.alert("您还未选择要进行审批的outlet，请先选择。")
      : $("#rejectModal").modal();
  });
  $("#rejectModal").on("show.bs.modal", function() {
    $("#reText").val("");
  });
  $("#rejectBtn").click(function() {
    var cordId = $("#reject").attr("data-id");
    toApprove(cordId, false);
  });
  $("#reText").click(function() {
    $(this)
      .removeClass("border-color")
      .next()
      .remove();
  });
  //点击通过
  $("#pass").click(function() {
    var cordId = $(this).attr("data-id");
    cordId == undefined
      ? opts.alert("您还未选择要进行审批的outlet，请先选择。")
      : toApprove(cordId, true);
  });
  //edit
  $("#optBox").on("click", "#edit", function() {
    var cordId = $(this).attr("data-id");
    var status = $(this).attr("data-status");
    if (status == "true") {
      cordId == undefined
        ? opts.alert("您还未选择要进行审批的outlet，请先选择。")
        : editClick(this, true);
    } else {
      editClick(this, false);
    }
  });
  //提交
  $("#submit").click(function() {
    var id = $("#edit").attr("data-id");
    validateAndSubmit(id);
  });
  //日期格式
  $(".date").datetimepicker({
    format: "YYYY-MM-DD"
  });
  //点击下一页
  $("#pageAll").on("click", "#to_next", function() {
    questOnePage($g.API_URL.UNDER_APPROVING_DETAIL.compose(host), "approval");
  });
  //点击上一页
  $("#pageAll").on("click", "#to_prev", function() {
    questOnePage($g.API_URL.UNDER_APPROVING_DETAIL.compose(host), "approval");
  });
  //点击某一页
  $("#pageAll").on("click", ".pageBtn", function() {
    currentPage = $(this).text();
    questOnePage($g.API_URL.UNDER_APPROVING_DETAIL.compose(host), "approval");
  });
  //详情高度自适应
  var detailH = $(".right_col").height() - $(".approveDetal").offset().top;
  $(".approveDetal").css("max-height", detailH);
  $("#baseFieldRight").on("click", "#cityCodeRight", function() {
    $(this)
      .parents(".sameRoot")
      .find(".torequired")
      .text("*")
      .removeClass("red");
  });
});
//点击编辑按钮
function editClick(obj, flag) {
  if (flag) {
    $(".approveBtn").hide();
    $("#submit").show();
    $("#cityCodeRight")
      .removeAttr("disabled")
      .addClass("border-orange");
    $(obj).text("取消");
    $(obj).attr("data-status", "false");
  } else {
    $("#submit").hide();
    $(".approveBtn").show();
    $("#cityCodeRight")
      .val("")
      .attr("disabled", "disabled")
      .removeClass("border-orange");
    $(obj).text("编辑");
    $(obj).attr("data-status", "true");
  }
}
//审批
function toApprove(id, flag) {
  var valid = true;
  if (flag) {
    //pass
    var approveDate = {
      id: id,
      approval: true
    };
  } else {
    var reText = $("#reText").val();
    if (reText == "") {
      var html = '<p class="required">* 请输入驳回理由。</p>';
      $("#reText")
        .addClass("border-red")
        .after(html);
      valid = false;
    } else {
      $("#rejectModal").modal("hide");
      var approveDate = {
        id: id,
        approval: false,
        message: reText
      };
    }
  }
  if (valid) {
    $.ajax({
      type: "post",
      url: $g.API_URL.OUTLET_APPROVAL.compose(host),
      data: approveDate,
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
}

//请求右边数据 (显示驳回信息)
function questNewBaseInfoAndShow(id) {
  $.ajax({
    url: $g.API_URL.OUTLET_REVISION.compose(host),
    type: "GET",
    data: {
      id: id
    },
    success: function(data) {
      //提交成功
      if (data.code == 0) {
        if (data.data.type == 1) {
          $("#reasonText").show();
          $("#reasonText")
            .find(".red")
            .text(data.data.message);
        }
        var newInfo = data.data.data;
        if (newInfo.region) {
          showBaseRegion(newInfo, ["Right"]);
          showCityCodes(newInfo.region.id, ["Right"]).then(function() {
            field.showRevisedOutlet(newInfo, "Right");
          });
        }
      }
    }
  });
}
/*******************加载页面需要数据********************************************* */
//请求列表
function questApprovalList(param) {
  var data = param ? param : { pageSize: constant.approveNum };
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.UNDER_APPROVING_DETAIL.compose(host),
      type: "GET",
      data: data,
      success: function(data) {
        if (data.code == 0) {
          resolve(data.data);
        } else {
          codeError(data, "请求需要审批的网点列表出错");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "请求需要审批的网点列表出错");
      }
    });
  });
}
//验证表单并提交 提交***********************************************************************
function validateAndSubmit(id) {
  var lastModified = JSON.parse(storage.getSession("o" + id)).lastModified;
  var cityCode = $("#cityCodeRight").val();
  if (cityCode == "" || cityCode == null) {
    $("#cityCodeRight")
      .parents(".sameRoot")
      .find(".torequired")
      .text("* 请填写城市编号！")
      .addClass("red");
    opts.alert("城市编号为必填项，请填写城市编号后再进行保存。");
  } else {
    var formData = {
      id: id,
      lastModified: lastModified,
      cityCode: cityCode
    };
    $.ajax({
      type: "PUT",
      url: $g.API_URL.OUTLET_EDITING.compose(host),
      data: JSON.stringify(formData),
      contentType: "application/json; charset=utf-8",
      success: function(data) {
        if (data.code == 0) {
          var oData = data.data;
          $("#mainPart").hide();
          $("#" + oData.id).addClass("notFocus");
          editClick("#edit", false);
        } else {
          opts.alert(data.msg);
        }
      }
    });
  }
}
