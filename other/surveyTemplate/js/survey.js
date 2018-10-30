var survey = {
  //增加字段代码
  returnField: function(id) {
    var html =
      '<div class="control clearfix ui-state-default" draggable="true" id="' +
      id +
      '">' +
      '<a href="javascript:;" class="close-link"><i class="fa fa-close"></i></a>' +
      '<div class="col-md-6">' +
      '<input type="text" placeholder="字段名" class="form-control namets"/>' +
      "</div>" +
      '<div class="col-md-4">' +
      '<select name="" class="form-control typets choosetype">' +
      '<option value="">请选择</option>' +
      '<option value="文本">文本</option>' +
      '<option value="多行文本">多行文本</option>' +
      '<option value="数字">数字</option>' +
      '<option value="日期">日期</option>' +
      '<option value="单选框">单选框</option>' +
      '<option value="多选框">多选框</option>' +
      '<option value="明细">明细</option>' +
      "</select>" +
      "</div>" +
      '<div class="checkbox col-md-2 col-xs-12">' +
      "<label>" +
      '<input type="checkbox" class="flat" checked=""> 必填' +
      "</label>" +
      "</div>" +
      '<div class="mulbox">' +
      "</div>" +
      "</div>";
    return html;
  },
  //选项框代码
  returnItem: function() {
    var html =
      '<div class="col-md-6 sameitem">' +
      '<input type="text" placeholder="选项名" class="col-md-10 selectItem" />' +
      '<a href="javascript:;" class="col-md-2 close-opt"><i class="fa fa-times-circle"></i></a>' +
      "</div>" +
      '<div class="col-md-6 sameitem">' +
      '<input type="text" placeholder="选项名" class="col-md-10 selectItem"  />' +
      '<a href="javascript:;" class="col-md-2 close-opt"><i class="fa fa-times-circle"></i></a>' +
      "</div>" +
      '<div class="col-md-6 sameitem">' +
      '<a href="javascript:;" class="col-md-10 additem"><i class="fa fa-plus"></i></a>' +
      "</div>";
    return html;
  },
  //增加选项
  addItem: function() {
    var html =
      '<div class="col-md-6 sameitem">' +
      '<input type="text" placeholder="选项名" class="col-md-10 selectItem" />' +
      '<a href="javascript:;" class="col-md-2 close-opt"><i class="fa fa-times-circle"></i></a>' +
      "</div>";
    return html;
  },
  //增加明细
  returnDetail: function(id) {
    var html =
      '<div class="detailbox col-md-12 col-xs-12" id="' +
      id +
      '">' +
      '<div class="col-md-6">' +
      '<input type="text" placeholder="字段名" class="form-control denamets"/>' +
      "</div>" +
      '<div class="col-md-4">' +
      '<select name="" class="form-control detypets datailtype">' +
      '<option value="">请选择</option>' +
      '<option value="文本">文本</option>' +
      '<option value="多行文本">多行文本</option>' +
      '<option value="数字">数字</option>' +
      '<option value="日期">日期</option>' +
      '<option value="单选框">单选框</option>' +
      '<option value="多选框">多选框</option>' +
      "</select>" +
      "</div>" +
      '<div class="checkbox col-md-2 col-xs-12">' +
      "<label>" +
      '<input type="checkbox" class="deflat" checked="none">必填' +
      "</label>" +
      "</div>" +
      '<div class="detailMulbox clearfix"></div>' +
      "</div>";
    return html;
  }
};
var addDetail =
  '<a class="col-md-12 paddleft20" id="addDetail">添加明细字段</a>';
$(document).ready(function() {
  //点击添加普查字段
  $("#addfield").click(function() {
    $("#refield")
      .removeClass("required")
      .html("*");
    var cTime = new Date();
    var timeStamp = cTime.getTime();
    $("#sortable").append(survey.returnField(timeStamp));
  });
  //删除普查字段
  $("#sortable").on("click", ".close-link", function() {
    $(this)
      .parents(".control")
      .remove();
  });

  //切换选项时
  $("#sortable").on("change", ".choosetype", function() {
    var oType = $(this).val();
    if (oType == "单选框" || oType == "多选框") {
      $(this)
        .parents(".control")
        .find(".mulbox")
        .html(survey.returnItem());
    } else if (oType == "明细") {
      var cTime = new Date();
      var timeStamp = cTime.getTime();
      $(this)
        .parents(".control")
        .find(".mulbox")
        .html(survey.returnDetail(timeStamp) + addDetail);
    } else {
      $(this)
        .parents(".control")
        .find(".mulbox")
        .html("");
    }
  });
  //明细里面的切换选项
  $("#sortable").on("change", ".datailtype", function() {
    var oType = $(this).val();
    if (oType == "单选框" || oType == "多选框") {
      $(this)
        .parents(".detailbox")
        .find(".detailMulbox")
        .html(survey.returnItem());
    } else {
      $(this)
        .parents(".detailbox")
        .find(".detailMulbox")
        .html("");
    }
  });
  //添加明细字段
  $("#sortable").on("click", "#addDetail", function() {
    var cTime = new Date();
    var timeStamp = cTime.getTime();
    $(this).before(survey.returnDetail(timeStamp));
  });

  //删除新增项
  $("#sortable").on("click", ".close-opt", function() {
    $(this)
      .parents(".sameitem")
      .remove();
  });
  //新增某一项
  $("#sortable").on("click", ".additem", function() {
    $(this)
      .parents(".sameitem")
      .before(survey.addItem());
  });

  //拖拽
  $("#sortable").sortable({
    revert: true
  });
  $("#draggable").draggable({
    connectToSortable: "#sortable",
    helper: "clone",
    revert: "invalid"
  });

  //点击保存
  $("#goSave").click(function() {
    /***************表单验证部分开始**************/
    var oFlag = true;
    var obj = $("#objname").val();
    var oWord = $("#sortable").children().length;
    if (obj == "") {
      $("#objname").addClass("border-red");
      $("#rename")
        .addClass("required")
        .html("* 请填写普查对象名称");
      oFlag = false;
    }
    if (oWord == 0) {
      $("#refield")
        .addClass("required")
        .html("* 请添加普查字段");
      oFlag = false;
    }
    $(".namets").each(function() {
      if ($(this).val() == "") {
        $(this)
          .addClass("border-red")
          .attr("placeholder", "此项为必填项");
        oFlag = false;
      }
    });
    $(".typets").each(function() {
      if ($(this).val() == "") {
        $(this)
          .addClass("border-red")
          .val("此项为必选项");
        oFlag = false;
      }
    });
    $(".selectItem").each(function() {
      if ($(this).val() == "") {
        $(this)
          .addClass("border-red")
          .attr("placeholder", "此项为必填项");
        oFlag = false;
      }
    });
    /***************表单验证部分结束**************/
    //封装要提交的数据
    var oData = new Object();
    var aItem = [];
    if (oFlag) {
      //验证通过
      oData.name = $("#objname").val();
      $(".control").each(function() {
        var idNum = $(this).attr("id");
        var oItem = new Object();
        var oName = $(this)
          .find(".namets")
          .val(); //字段名
        var oType = chineseToPinYin(
          $(this)
            .find(".typets")
            .val()
        ); //字段类型
        var oId = oType + "-" + idNum; //字段ID
        var oReq = $(this)
          .find(".flat")
          .is(":checked")
          ? true
          : false; //是否选中
        oItem.id = oId;
        oItem.name = oName;
        oItem.type = oType;
        oItem.require = oReq;
        if (oType == "DanXuanKuang" || oType == "DuoXuanKuang") {
          var aOpt = []; //单选或多选里面的选项
          var obj = $(this).find(".selectItem");
          obj.each(function(i, e) {
            var oOpt = {
              id: i + 1,
              name: $(e).val()
            };
            aOpt.push(oOpt);
          });
          oItem.options = aOpt;
        }
        if (oType == "MingXi") {
          var aDetail = [];
          detailBox = $(this).find(".detailbox");
          detailBox.each(function() {
            var idNum1 = $(this).attr("id");
            var oItem1 = new Object();
            var oName1 = $(this)
              .find(".denamets")
              .val(); //字段名
            var oType1 = chineseToPinYin(
              $(this)
                .find(".detypets")
                .val()
            ); //字段类型
            var oId1 = oType1 + "-" + idNum1; //字段ID
            var oReq1 = $(this)
              .find(".deflat")
              .is(":checked")
              ? true
              : false; //是否选中
            oItem1.id = oId1;
            oItem1.name = oName1;
            oItem1.type = oType1;
            oItem1.require = oReq1;
            if (oType1 == "DanXuanKuang" || oType1 == "DuoXuanKuang") {
              var aOpt1 = []; //单选或多选里面的选项
              var obj1 = $(this).find(".selectItem");
              obj1.each(function(i, e) {
                var oOpt1 = {
                  id: i + 1,
                  name: $(e).val()
                };
                aOpt1.push(oOpt1);
              });
              oItem1.options = aOpt1;
            }
            aDetail.push(oItem1);
          });
          oItem.details = aDetail;
        }
        aItem.push(oItem);
      });
      oData.template = aItem;
      console.log(oData);
      //ajax请求，并发送数据
      $.ajax({
        url: $g.API_URL.SURVEY_TEMPLATE_CREATING.compose(host),
        type: "POST",
        data: JSON.stringify(oData),
        contentType: "application/json; charset=utf-8",
        success: function(data) {
          console.log(data);
          if (data.code == 0) {
            location.reload();
          } else {
            opts.alert(data.msg);
          }
        }
      });
    }
  });

  //点击的时候取消表单验证的错误提示
  $("#objname").on("focus", function() {
    $("#objname").removeClass("border-red");
    $("#rename")
      .removeClass("required")
      .html("*");
  });
  $(".namets").on("focus", function() {
    $(this)
      .removeClass("border-red")
      .attr("placeholder", "字段名");
  });
  $(".typets").on("focus", function() {
    $(this).removeClass("border-red");
  });
  $(".selectItem").on("focus", function() {
    $(this)
      .removeClass("border-red")
      .attr("placeholder", "选项名");
  });
});
