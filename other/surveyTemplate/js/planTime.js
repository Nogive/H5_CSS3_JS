$(document).ready(function() {
  opts.showLoading();
  Promise.all([questAreaOfTree(), questChannel(), questClassification()])
    .then(function([trees, channels, classifications]) {
      createDomInPage(trees, channels, classifications);
      opts.hideLoading();
    })
    .catch(function(error) {
      opts.alert(error);
    });
  //选择地区
  $("#district").click(function() {
    $("#areaModal").modal({ backdrop: "static" });
  });
  $("#areaModal").on("show.bs.modal", function() {
    var areaTree = $.fn.zTree.getZTreeObj("mjpArea");
    tree.raseTree(areaTree);
    var roots = areaTree.getNodesByParam("pId", null);
    for (var node of roots) {
      areaTree.setChkDisabled(node, true, false, false);
    }
  });
  //点击搜索按钮
  $("#toSearch").click(function() {
    searchSurveyTeplate();
  });
  //点击新增按钮
  $("#toNew").click(function() {
    $("#visitTime").val("");
    $("#tripTime").val("");
    $("#tripTime")
      .parents(".skuBox")
      .find(".tip")
      .text("*")
      .removeClass("required");
  });
  //点击提交按钮
  $("#subTime").click(function() {
    if (validate()) {
      submitSurveyTemplate();
    }
  });

  $(".skuBox input").click(function() {
    $(this)
      .parents(".skuBox")
      .find(".tip")
      .text("*")
      .removeClass("required");
  });
});
//搜索
function searchSurveyTeplate() {
  var regionId = $("#district").attr("data-region");
  var channelId = $("#channel_glo").val();
  var classificationId = $("#classification_glo").val();
  if (regionId == undefined || channelId == null || classificationId == null) {
    opts.alert("请补充完整搜索条件后再进行搜索。");
  } else {
    opts.showLoading();
    $.ajax({
      url: $g.API_URL.SETTING_VISITATION.compose(host),
      type: "GET",
      data: {
        regionId: parseInt(regionId),
        channelId: parseInt(channelId),
        classificationId: parseInt(classificationId)
      },
      success: function(data) {
        if (data.code == 0) {
          if (data.data == undefined) {
            $("#visitTime").val(0);
            $("#tripTime").val(0);
          } else {
            $("#visitTime").val(data.data.callTime);
            $("#tripTime").val(data.data.travelTime);
          }
          opts.hideLoading();
        } else {
          codeError(data, "查询出错");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "搜索失败了");
      }
    });
  }
}
/********************新建   start******************************** */
//验证必填
function validate() {
  var valid = true;
  var regionId = $("#district").attr("data-region");
  var channelId = $("#channel_glo").val();
  var classificationId = $("#classification_glo").val();
  if (regionId == "" || regionId == undefined || channelId == null) {
    valid = false;
    opts.alert("请选择正确的渠道、城市以及等级后再进行提交。");
  } else {
    valid = validInput();
  }
  return valid;
}
function validInput() {
  var reg = /^\d+(\.\d+)?$/;
  var visit = false;
  var trip = false;
  var visitTime = $("#visitTime").val();
  var tripTime = $("#tripTime").val();
  if (visitTime == "" || visitTime == 0) {
    $("#visitTime")
      .parents(".skuBox")
      .find(".tip")
      .text("* 请填写拜访时间。")
      .addClass("required");
  } else if (reg.test(visitTime)) {
    visit = true;
  } else {
    $("#visitTime")
      .parents(".skuBox")
      .find(".tip")
      .text("* 请填写正确格式的拜访时间。")
      .addClass("required");
  }
  if (tripTime == "" || tripTime == 0) {
    $("#tripTime")
      .parents(".skuBox")
      .find(".tip")
      .text("* 请填写路上时间。")
      .addClass("required");
  } else if (reg.test(tripTime)) {
    trip = true;
  } else {
    $("#tripTime")
      .parents(".skuBox")
      .find(".tip")
      .text("* 请填写正确格式的路上时间。")
      .addClass("required");
  }
  return visit && trip;
}
//提交
function submitSurveyTemplate() {
  opts.showLoading();
  var regionId = $("#district").attr("data-region");
  var channelId = $("#channel_glo").val();
  var classificationId = $("#classification_glo").val();
  var visitTime = $("#visitTime").val();
  var tripTime = $("#tripTime").val();
  var subData = {
    regionId: parseInt(regionId),
    channelId: parseInt(channelId),
    classificationId: parseInt(classificationId),
    callTime: parseFloat(visitTime),
    travelTime: parseFloat(tripTime)
  };
  $.ajax({
    url: $g.API_URL.SETTING_VISITATION_CREATING.compose(host),
    type: "POST",
    data: JSON.stringify(subData),
    contentType: "application/json; charset=utf-8",
    success: function(data) {
      if (data.code == 0) {
        showNotify("success", "成功", "拜访时间设置成功了。");
        opts.hideLoading();
      } else {
        codeError(data, "出错了");
      }
    },
    error: function(xhr) {
      failResponse(xhr, "保存拜访时间出错了");
    }
  });
}
/********************新建   end******************************** */

//**********************请求基础数据**********************************/
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
    beforeClick: function() {
      return true;
    },
    beforeCheck: function(treeId, treeNode) {
      clickOneNode(treeId, treeNode);
    },
    onClick: function(e, treeId, treeNode) {
      if (!treeNode.chkDisabled) {
        clickOneNode(treeId, treeNode);
      }
    }
  }
};
function clickOneNode(treeId, treeNode) {
  var areaTree = $.fn.zTree.getZTreeObj(treeId);
  var value = "";
  if (treeNode.pId == null) {
    value = treeNode.name;
  } else {
    var pNode = treeNode.getParentNode();
    if (pNode.name == treeNode.name) {
      value = treeNode.name;
    } else {
      value = pNode.name + " " + treeNode.name;
    }
  }
  $("#district")
    .val(value)
    .attr("data-region", treeNode.id);
  $("#areaModal").modal("hide");
}
function questAreaOfTree() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.REGION_PROVINCE_CITY.compose(host),
      type: "GET",
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      },
      success: function(data) {
        if (data.code == 0) {
          resolve(data.data);
        } else {
          codeError(data, "请求失败");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "加载失败了");
      }
    });
  });
}
function questClassification() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.BASE_DATA_RETRIEVAL.compose(host),
      type: "GET",
      data: { dataType: "classification" },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      },
      success: function(data) {
        if (data.code == 0) {
          resolve(data.data);
        } else {
          codeError(data, "请求失败");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "加载失败了");
      }
    });
  });
}
function questChannel() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.BASE_DATA_RETRIEVAL.compose(host),
      type: "GET",
      data: { dataType: "channel" },
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      },
      success: function(data) {
        if (data.code == 0) {
          resolve(data.data);
        } else {
          codeError(data, "请求失败");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "加载失败了");
      }
    });
  });
}
function createDomInPage(trees, channels, classifications) {
  $.fn.zTree.init($("#mjpArea"), areaSetting, trees);
  var areaTree = $.fn.zTree.getZTreeObj("mjpArea");
  areaTree.expandAll(true);
  $("#channel_glo").html(returnOptionHtml(channels));
  $("#classification_glo").html(returnOptionHtml(classifications));
}
function returnOptionHtml(arr) {
  var html = "";
  for (var item of arr) {
    html += '<option value="' + item.id + '">' + item.name + "</option>";
  }
  return html;
}
//***********请求基础数据**end****************************************************************/
