var currentPage = 1; //当前是第几页
var btnSize = constant.pageBtnNum; //最多显示多少个分页按钮
var size = constant.mvoNum; //每页多少条数据
var pageNum = 0; //总共有多少页
$(document).ready(function() {
  size =
    $("body").attr("data-num") == undefined
      ? constant.mvoNum
      : constant.approveNum;
  var recordNum = 0;
  $("#checkAll").click(function() {
    var reLen = $(".recordBox").find("tr").length;
    var flag = $(this).attr("data-check");
    if (reLen > 0) {
      if (flag == "true") {
        recordNum = 0;
        cancleCheckAll(recordNum);
      } else {
        //全选
        $(".icheckbox_flat-green").addClass("checked");
        $(this).attr("data-check", "true");
        recordNum = returnCheckNum();
        $("#recordTotal").text(recordNum);
      }
    }
  });
  $(".recordBox").on("click", ".a-center .icheckbox_flat-green", function(e) {
    e.stopPropagation();
    $("#checkAll")
      .attr("data-check", "false")
      .children()
      .removeClass("checked");
    if ($(this).hasClass("checked")) {
      $(this).removeClass("checked");
      recordNum > 0 ? recordNum-- : recordNum;
    } else {
      $(this).addClass("checked");
      recordNum < size ? recordNum++ : recordNum;
    }
    $("#recordTotal").text(recordNum);
  });
  //点击某一页按钮
  $("#pageAll").on("click", ".pageBtn", function() {
    $(this)
      .addClass("current")
      .parent()
      .siblings()
      .children()
      .removeClass("current");
  });
  //点击上一页
  $("#pageAll").on("click", "#to_prev", function() {
    clickPrevOrNext(true);
  });
  //点击下一页
  $("#pageAll").on("click", "#to_next", function() {
    clickPrevOrNext(false);
  });
});
//全选有多少条数据
function returnCheckNum() {
  var i = 0;
  $(".icheckbox_flat-green").each(function() {
    i = i + 1;
  });
  return i - 1;
}
//取消全选
function cancleCheckAll(recordNum) {
  $(".icheckbox_flat-green").removeClass("checked");
  $("#checkAll").attr("data-check", "false");
  $("#recordTotal").text(recordNum);
}
//点击上一页
function clickPrevOrNext(flag) {
  if (flag) {
    //prev
    if (currentPage > 1) {
      currentPage--;
      changePageBtn(flag);
    } else {
      opts.alert("已经是第一页了");
    }
  } else {
    //next
    if (currentPage < pageNum) {
      currentPage++;
      changePageBtn(flag);
    } else {
      opts.alert("已经是最后一页了");
    }
  }
  $(".pageBtn").each(function() {
    $(this).removeClass("current");
    if ($(this).text() == currentPage) {
      $(this).addClass("current");
    }
  });
}
function changePageBtn(flag) {
  var btnNum = 0;
  var start = 0;
  var n = Math.ceil(pageNum / btnSize); //有几组按钮
  var o = new Object();
  for (var i = 1; i <= n; i++) {
    o[i] = btnSize * i + 1;
  }
  if (flag) {
    //prev
    for (var obj in o) {
      if (currentPage + 1 == o[obj]) {
        start = o[obj] - btnSize;
        btnNum = btnSize;
        $("#pageAll").html(returnPartBtn(start, btnNum));
      }
    }
  } else {
    for (var obj in o) {
      if (currentPage == o[obj]) {
        start = o[obj];
        btnNum = parseInt(obj) < n ? btnSize : pageNum % btnSize;
        $("#pageAll").html(returnPartBtn(start, btnNum));
      }
    }
  }
}
//返回勾选的ID
function returnCheckedId() {
  var ids = [];
  $(".a-center div").each(function() {
    if ($(this).hasClass("checked")) {
      var id = $(this)
        .parents("tr")
        .attr("id");
      ids.push(id);
    }
  });
  return ids;
}
//分页按钮显示
function returnPartBtn(start, btnNum) {
  var html = "";
  for (var i = 0; i < btnNum; i++) {
    html +=
      '<li><a href="javascript:;" class="pageBtn">' + (start + i) + "</a></li>";
  }
  var endHtml =
    '<li><a href="javascript:;" id="to_prev">&laquo;</a></li>' +
    html +
    '<li><a href="javascript:;" id="to_next">&raquo;</a></li>';
  return endHtml;
}

//初始分页按钮
function returnPageBtn(pageNum) {
  var html = "";
  var endHtml = "";
  var start = pageNum <= btnSize ? 0 : Math.floor(pageNum / btnSize) * btnSize;
  var len = pageNum > btnSize ? start + btnSize : pageNum;
  if (len == 1) {
    endHtml = '<li><a href="#">' + len + "</a></li>";
  } else {
    for (var i = start; i < len; i++) {
      if (i == start) {
        html +=
          '<li><a href="javascript:;" class="pageBtn current">' +
          (i + 1) +
          "</a></li>";
      } else {
        html +=
          '<li><a href="javascript:;" class="pageBtn">' + (i + 1) + "</a></li>";
      }
    }
    endHtml =
      '<li><a href="javascript:;" id="to_prev">&laquo;</a></li>' +
      html +
      '<li><a href="javascript:;" id="to_next">&raquo;</a></li>';
  }
  return endHtml;
}
