"use strict";
/******************************************************************/
var MENU = {
  create: { id: 1, name: "新建" },
  edit: { id: 2, name: "编辑" },
  assign: { id: 3, name: "分配" },
  remove: { id: 4, name: "删除" },
  approve: { id: 5, name: "通过审批" },
  deny: { id: 6, name: "拒绝审批" },
  submit: { id: 7, name: "提交" },
  draft: { id: 9, name: "保存草稿" }
};
var currentPlan;
var currentAccount;
var currentTab;
var tabContext = {
  myPlan: {
    tabDomId: "#my-plan",
    planType: "plan",
    api: $g.API_URL.PLAN_LIST.compose(host),
    listDomId: "#my-plan-list",
    page: 0,
    items: 0
  },
  myApproval: {
    tabDomId: "#my-approve",
    planType: "approve",
    api: $g.API_URL.PLAN_PENDING_LIST.compose(host),
    listDomId: "#my-approve-list",
    page: 0,
    items: 0
  }
};
mma.setOnActionCallback(function(data) {
  if (data.id == MENU.create.id) {
    globalField.currentPlan == undefined;
    mainView.router.loadPage("create.html");
  } else if (data.id == MENU.submit.id) {
    arrangementPlan();
  } else if (data.id == MENU.draft.id) {
    saveToDraft();
  } else if (data.id == MENU.edit.id) {
    mainView.router.loadPage("create.html?id=" + globalField.currentPlan.id);
  } else if (data.id == MENU.approve.id) {
    goApproval(globalField.currentPlan.id, true);
  } else if (data.id == MENU.deny.id) {
    deny(globalField.currentPlan.id);
  }
});
//for plan
var globalField = {
  frequency: {},
  daysLoad: {},
  weeks: {},
  scaleLoad: 8.5,
  prepareLoad: 0,
  factLoad: 0,
  showName: true,
  currentVisableDay: null,
  currentPlan: {},
  maxDay: 0
};
var editSchedule;
var detailSchedule;
var mapClients;
var editSubmit = false;
const showTime = 10000;
let arrangeDateMap = []; //每个网点在哪些天有安排
var onlineDate; //请求返回的时间
var myScroll;

/*****************************************************************/
var mjpApp = new Framework7({
  init: false,
  //允许webAPP记录URL，以便回退
  pushState: true,
  notificationHold: 2000,
  modalButtonOk: "确定",
  modalButtonCancel: "取消",
  modalPreloaderTitle: "正在加载, 请稍等"
});
var $$ = Dom7;
var mainView = mjpApp.addView(".view-main", { domCache: true });

/*页面初始化****************************************************************/
//index
mjpApp.onPageInit("plan", function(page) {
  var from = GetQueryString("from");
  if (from == "home") {
    mma.setActionMenus(false);
    mma.getCache("account").then(function(value) {
      currentAccount = value;
    });
  } else {
    mma.confirmOnBack(false);

    //下拉刷新事件
    var ptrContent = $$(".pull-to-refresh-content");
    ptrContent.on("refresh", function(e) {
      $$(".pull-to-refresh-layer").addClass("martop0");
      requestRemotePlanListAndUpdate(tabContext[currentTab].api);
    });
    //请求my plan列表
    $$.each(tabContext, function(key, item) {
      $$(item.tabDomId).on("show", function() {
        onTabShow(key);
      });
    });
    currentTab = "myPlan";
    mjpApp.showTab(tabContext[currentTab].tabDomId);
    mjpApp.pullToRefreshTrigger(".pull-to-refresh-content");
  }
  /*entry detail********************************************************************* */
  //init map
  map = new AMap.Map("container", {
    resizeEnable: true,
    zoom: 15,
    center: [121.329402, 31.228667]
  });
  $$("#my-plan-list").on("click", "li", function() {
    var id = $$(this).attr("id");
    if (id != undefined) {
      id = id.substring(5);
      globalField.currentPlan.id = id;
      mainView.router.loadPage("detail.html?id=" + id);
    }
  });
  $$("#my-approve-list").on("click", "li", function() {
    var id = $$(this).attr("id");
    if (id != undefined) {
      id = id.substring(5);
      globalField.currentPlan.id = id;
      mainView.router.loadPage("detail.html?id=" + id);
    }
  });
});
mjpApp.onPageReinit("plan", function(page) {
  mma.confirmOnBack(false);

  mjpApp.pullToRefreshTrigger(".pull-to-refresh-content");
});

mjpApp.onPageInit("create", function(page) {
  myScroll = new IScroll("#iscroll");
  var planId = page.query.id;
  globalField.currentPlan.id = planId;
  if (planId == undefined) {
    mma.setActionMenus(true, [MENU.submit, MENU.draft]);
    questPlanInCreate();
  } else {
    editSchedule = detailSchedule;
    if (editSchedule.state == "draft") {
      mma.setActionMenus(true, [MENU.submit, MENU.draft]);
    } else {
      mma.setActionMenus(true, [MENU.submit]);
    }
    showEditPage(editSchedule);
  }
  mma.confirmOnBack(true);

  /*****************隐藏按钮 和清空按钮****************/
  $$("#hideLabel").click(function() {
    if (globalField.showName) {
      $$(this).text("显示");
      globalField.showName = false;
    } else {
      $$(this).text("隐藏");
      globalField.showName = true;
    }
    if (globalField.currentVisableDay != null) {
      var showDay = globalField.currentVisableDay;
      showPlanedClient(showDay, "create");
    }
  });
  $$("#clearAll").click(function() {
    mjpApp.confirm("确定清空已经排好的计划?", "提示", function() {
      var currentPlan = editSchedule;
      currentPlan.data = [];
      globalField.daysLoad = {};
      globalField.factLoad = 0;
      globalField.frequency = {};
      arrangeDateMap = [];
      $$("#calendar td").removeClass("bg_red bg_orange bg_green");
      $$("#clientList .isFill").removeClass("col_red col_orange col_green");
      $$("#factLoad").text(globalField.factLoad.toFixed(2));
      map.clearMap();
      $$("#planedClient").hide();
    });
  });
  /*****************隐藏按钮 和清空按钮  end****************/

  //点击某个日期
  var timer = null; //定时器
  $$("#calendar").on("click", "td", function(e) {
    e.stopPropagation();
    markerMap = {};
    var isWorkday = $$(this).hasClass("validcolor");
    var day = $$(this).text();
    var key = $$("#currentMonth").text();
    if (isWorkday) {
      globalField.currentVisableDay = parseInt(day);
      $$("#calendar td").removeClass("today");
      $$(this).addClass("today");
      $$("#currentDate").text(key + "/" + checkNum(day));
      $$("#planedClient").attr({ "data-key": key, "data-day": day });
      showPlanedClient(day, "create");
      clearTimeout(timer);
      timer = setTimeout(function() {
        $$("#planedClient").hide();
      }, showTime);
    }
  });
  //点击某个MVO
  $$("#clientList").on("click", "li", function() {
    let id = $$(this)
      .attr("id")
      .substring(6);
    showPlanedDay(id, "create");
  });
  /***********定时器效果部分 start*********************/
  $$("#cancle").on("click", function() {
    $$(this)
      .parent()
      .hide();
  });
  $$("#planedClient").on("click", function(e) {
    e.stopPropagation();
  });
  $$("#planedClient").on("touchstart", function() {
    clearTimeout(timer);
  });
  $$("#planedClient").on("touchend", function() {
    timer = setTimeout(function() {
      $$("#planedClient").hide();
    }, showTime);
  });
  /***********定时器效果部分 end*********************/

  //移除某一个客户
  $$("#planedList").on("click", ".deleteClient", function() {
    var id = $$(this)
      .parents("li")
      .attr("id")
      .substring(5);
    deleteOneClient(id);
    $$(this)
      .parents("li")
      .remove();
  });

  //添加计划到某一天
  $$("#clientList").on("click", ".addToplan", function(e) {
    e.stopPropagation();
    var id = $$(this)
      .parents("li")
      .attr("id")
      .substring(6);
    if (globalField.currentVisableDay == null) {
      showToast("尚未选择日期，请先在右上角的日历里面选择日期，再进行添加");
    } else {
      var checkDay = globalField.currentVisableDay;
      var dayTimestamp = Date.parse(
        $$("#currentMonth").text() + "/" + checkNum(checkDay)
      );
      if (globalField.workdays.includes(dayTimestamp)) {
        arrangePlanInCache(id, checkDay);
      } else {
        showToast("非工作日不允许排班，请另选日期进行安排");
      }
    }
  });
});

mjpApp.onPageInit("detail", function(page) {
  myScroll = new IScroll("#iscollWrap");
  mjpApp.showPreloader("正在加载，请稍候。");
  var planId = page.query.id;
  if (page.query.from == "home") {
    mma.setActionMenus(false);
  }
  mma.confirmOnBack(false);

  globalField.currentPlan.id = planId;
  questPlanInDetail(planId);

  /*****************隐藏按钮****************/
  $$("#hideLabelDetail").click(function() {
    if (globalField.showName) {
      $$(this).text("显示");
      globalField.showName = false;
    } else {
      $$(this).text("隐藏");
      globalField.showName = true;
    }
    if (globalField.currentVisableDay != null) {
      var showDay = globalField.currentVisableDay;
      showPlanedClient(showDay, "detail");
    }
  });
  /*****************隐藏按钮end****************/

  //点击某个日期
  var timer = null; //定时器
  $$("#calendarDetail").on("click", "td", function(e) {
    e.stopPropagation();
    var isWorkday = $$(this).hasClass("validcolor");
    var day = $$(this).text();
    var key = $$("#currentMonthDetail").text();
    if (isWorkday) {
      var day = $$(this).text();
      globalField.currentVisableDay = parseInt(day);
      $$("#calendarDetail td").removeClass("today");
      $$(this).addClass("today");
      $$("#currentDateDetal").text(key + "/" + checkNum(day));
      $$("#planedClientDetail").attr({ "data-key": key, "data-day": day });
      //生成已排列表
      showPlanedClient(day, "detail");
      clearTimeout(timer);
      timer = setTimeout(function() {
        $$("#planedClientDetail").hide();
      }, showTime);
    }
  });
  //点击某个MVO
  $$("#clientListDetail").on("click", "li", function() {
    let id = $$(this)
      .attr("id")
      .substring(6);
    showPlanedDay(id, "detail");
  });

  /***********定时器效果部分 start*********************/
  $$("#cancleDetail").on("click", function() {
    $$(this)
      .parent()
      .hide();
  });
  $$("#planedClientDetail").on("click", function(e) {
    e.stopPropagation();
  });
  $$("#planedClientDetail").on("touchstart", function() {
    clearTimeout(timer);
  });
  $$("#planedClientDetail").on("touchend", function() {
    timer = setTimeout(function() {
      $$("#planedClientDetail").hide();
    }, showTime);
  });
  /***********定时器效果部分 end*********************/
  $$("body").on("click", "#reject", function() {
    $$("#reject")
      .removeClass("red")
      .next()
      .hide();
  });
});
mjpApp.onPageReinit("detail", function(page) {
  if (editSubmit) {
    mma.setActionMenus(false);
  } else {
    mma.setActionMenus(true, [MENU.edit]);
  }
  mma.confirmOnBack(false);
  myScroll = new IScroll("#iscollWrap");
  mjpApp.showPreloader("正在加载，请稍候。");
  var planId = page.query.id;
  if (page.query.from == "home") {
    mma.setActionMenus(false);
  }
  globalField.currentPlan.id = planId;
  questPlanInDetail(planId);
});
mjpApp.init();

/*页面初始化  END****************************************************************/

/*index 页**********************************************************************/
function requestRemotePlanListAndUpdate(listApiUrl) {
  $$.ajax({
    url: listApiUrl,
    type: "GET",
    dataType: "json",
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
    },
    success: function(data, status, xhr) {
      onlineDate = new Date(xhr.getResponseHeader("Date"));
      if (data == undefined) {
        ajaxSet.noData("无法从服务器获取拜访计划数据");
      } else if (data.code == $g.API_CODE.OK) {
        //当有记录且没有下个月的记录，才允许新建
        mma.getCache("account").then(function(value) {
          currentAccount = value;
          if (currentAccount.roleId == $g.ROLE.SR) {
            $$("#planNav").hide();
            if (data.data == undefined || data.data.length == 0) {
              mma.setActionMenus(true, [MENU.create]);
            } else {
              let totals = data.data;
              let nextMonth = getNextMonthTimeStamp(onlineDate);
              if (totals[0].month == nextMonth) {
                mma.setActionMenus(false);
              } else {
                mma.setActionMenus(true, [MENU.create]);
              }
            }
          } else {
            $$("#planNav").show();
            mma.setActionMenus(false);
          }
          showPlanList(data.data);
        });
      } else {
        ajaxSet.codeError(data, "加载拜访计划");
      }
      mjpApp.hidePreloader();
    },
    error: function(xhr) {
      mjpApp.hidePreloader();
      ajaxSet.error(xhr);
    }
  });
}
function showPlanList(totalItems) {
  let html = "";
  if (totalItems != undefined && totalItems.length > 0) {
    html = generateViewItems(tabContext[currentTab].planType, totalItems);
  } else {
    html = '<li class="item-content"><div class="item-inner">暂无</div></li>';
  }
  $$(tabContext[currentTab].listDomId).html(html);
  mjpApp.pullToRefreshDone();
  $$(".pull-to-refresh-layer").removeClass("martop0");
}
//生成某个tab的列表
function generateViewItems(itemType, items) {
  var html = "";
  $$.each(items, function(i, e) {
    var plan = e;
    let month = getYearMonth(plan.month);
    if (itemType == "plan") {
      html +=
        '<li class="item-content" id="mplan' +
        plan.id +
        '">' +
        '<div class="item-inner">' +
        '<div class="item-title">' +
        month +
        "</div>" +
        '<div class="item-title">' +
        plan.staff.name +
        "</div>" +
        '<div class="item-after"><span data-state="' +
        plan.state +
        '" class="statusText">' +
        whichState(plan.state) +
        "</span></div>" +
        "</div>" +
        "</li>";
    } else {
      html +=
        '<li class="item-content" id="appro' +
        plan.id +
        '">' +
        '<div class="item-inner">' +
        '<div class="item-title">' +
        month +
        "</div>" +
        '<div class="item-after"><span class="emName">' +
        plan.staff.name +
        "</span></div>" +
        "</div>" +
        "</li>";
    }
  });
  return html;
}
function whichState(str) {
  var state = "";
  switch (str) {
    case "ongoing":
      state = "审批中";
      break;
    case "denied":
      state = "驳回";
      break;
    case "draft":
      state = "草稿";
      break;
    default:
      state = "通过";
      break;
  }
  return state;
}
function getYearMonth(timestamp) {
  var date = new Date(timestamp);
  var mm = date.getMonth() + 1;
  var dd = date.getDate();

  return [date.getFullYear(), "-", (mm > 9 ? "" : "0") + mm].join("");
}
function onTabShow(tab) {
  currentTab = tab;
  mjpApp.pullToRefreshTrigger(".pull-to-refresh-content");
}
/*index end********************************************************************************** */

/*新建页面*************************************************************************/
//请求计划
function questPlanInCreate() {
  mjpApp.showPreloader("正在加载，请稍候。");
  promiseAjax($g.API_URL.PLAN_CREATING.compose(host), "GET", {
    month: getNextMonthTimeStamp(onlineDate)
  }).then(
    function(value) {
      if (value == undefined) {
        ajaxSet.noData();
      } else if (value.code == $g.API_CODE.OK) {
        editSchedule = value.data;
        initGlobalField(editSchedule);
        $$("#factLoad").text(globalField.factLoad.toFixed(2));
        var month = editSchedule.month;
        Promise.all([
          promiseAjax($g.API_URL.SETTING_WORKDAY.compose(host), "GET", {
            monthTimestamp: month
          }),
          promiseAjax($g.API_URL.MY_MVO.compose(host), "GET", {})
        ])
          .then(function([works, mvos]) {
            if (works == undefined || mvos == undefined) {
              ajaxSet.noData();
            } else if (
              works.code == $g.API_CODE.OK &&
              mvos.code == $g.API_CODE.OK
            ) {
              showPage(works, mvos, "create");
              mjpApp.hidePreloader();
            } else if (works.code != $g.API_CODE.OK) {
              throw new Error(works.code);
            } else {
              throw new Error(mvos.code);
            }
          })
          .catch(function(e) {
            mjpApp.hidePreloader();
            mjpApp.alert(
              "加载预排计划出错了，错误码：" + e.status,
              "",
              function() {
                mainView.router.back();
              }
            );
          });
      } else {
        mjpApp.alert(
          "加载预排计划出错了，错误码：" + value.code,
          "",
          function() {
            mainView.router.back();
          }
        );
      }
    },
    function(err) {
      mjpApp.hidePreloader();
      mjpApp.alert("加载预排计划失败了，错误码：" + err.status, "", function() {
        mainView.router.back();
      });
      console.log(err);
    }
  );
}
//预排计划
function arrangePlanInCache(id, day) {
  let currentDay = day;
  var id = parseInt(id);
  var $client = $$("#create" + id);
  var $day = $$("#day" + day);
  var month = $$("#currentMonth").text();
  var whichWeek = parseInt($day.parent().attr("data-week"));
  var thisWeek = globalField.weeks[whichWeek];
  var currentClient = returnCurrentClient(id);
  var frequentNum = returnFrequencyNum(currentClient.visitFrequency.id); //拜访次数
  var sysPlan = editSchedule;
  var sysDays = sysPlan.data;
  var isRepeat = false;
  for (var dt of sysDays) {
    if (thisWeek.includes(dt.day)) {
      if (dt.outlets.includes(id)) {
        isRepeat = true;
      }
    }
  }
  if (isRepeat) {
    showToast("该网点本周已有排班");
  } else {
    var rangeDays = [];
    if (isArrangeAuto(id) > 0) {
      //自动安排
      rangeDays.push(day);
      var visitNum = 1;
      while (
        day + isArrangeAuto(id) <= globalField.maxDay &&
        visitNum < frequentNum
      ) {
        day += isArrangeAuto(id);
        visitNum++;
        rangeDays.push(day);
      }
    } else {
      rangeDays.push(day);
    }
    var mvoCapacity = parseFloat(currentClient.visitingTime.toFixed(2));
    for (var ed of rangeDays) {
      var isExist = globalField.daysLoad.hasOwnProperty(ed);
      var curDayCapacity = globalField.daysLoad[ed];
      var ymd = month + "/" + checkNum(ed);
      var timeStamp = Date.parse(ymd);
      if (globalField.workdays.includes(timeStamp)) {
        if (isExist) {
          globalField.daysLoad[ed] = curDayCapacity + mvoCapacity;
          for (var d of sysDays) {
            if (d.day == timeStamp) {
              d.dayCapacity = globalField.daysLoad[ed];
              d.outlets.push(id);
            }
          }
        } else {
          globalField.daysLoad[ed] = mvoCapacity;
          var nd = {
            day: timeStamp,
            dayCapacity: globalField.daysLoad[ed],
            outlets: [id]
          };
          sysDays.push(nd);
        }
        sysPlan.data = sysDays;
        editSchedule = sysPlan;
        if (arrangeDateMap[id] != undefined) {
          arrangeDateMap[id].push(timeStamp);
        } else {
          arrangeDateMap[id] = [timeStamp];
        }
        /****************效果部分   start*********************/
        //client
        if (globalField.frequency.hasOwnProperty(id)) {
          globalField.frequency[id] += 1;
        } else {
          globalField.frequency[id] = 1;
        }
        var frequentId = currentClient.visitFrequency.id;
        var bgClass =
          "col_" + returnEnoughClass(frequentId, globalField.frequency[id]);
        $client.find(".isFill").addClass(bgClass);

        //date
        globalField.factLoad += mvoCapacity;
        var tdBdClass = "bg_" + bgColorOfDay(globalField.daysLoad[ed]);
        $$("#factLoad").text(globalField.factLoad.toFixed(2));
        $$("#day" + ed).addClass(tdBdClass);
        /****************效果部分   end*********************/
      }
    }
    showPlanedClient(currentDay, "create");
  }
}
//间隔多少天自动安排一次
function isArrangeAuto(id) {
  var hz = returnCurrentClient(id).visitFrequency.id;
  var isRange = globalField.frequency.hasOwnProperty(id); //是否安排过
  if (!isRange || globalField.frequency[id] == 0) {
    if (hz > $g.OUTLET_VISIT_FREQUENCY.V1PM) {
      return hz == $g.OUTLET_VISIT_FREQUENCY.V2PM ? 14 : 7;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}
//移除某个客户
function deleteOneClient(id) {
  id = parseInt(id);
  let currentClient = returnCurrentClient(id);
  var temTime =
    $$("#planedClient").attr("data-key") +
    "/" +
    checkNum($$("#planedClient").attr("data-day"));
  var timestamp = returnTimeStamp(temTime, true);
  var clientIds;
  var planedDay = editSchedule.data;
  for (var d of planedDay) {
    if (d.day == timestamp) {
      d.dayCapacity =
        d.dayCapacity - parseFloat(currentClient.visitingTime.toFixed(2));
      var index = d.outlets.indexOf(id);
      d.outlets.splice(index, 1);
      clientIds = d.outlets;
    }
  }
  editSchedule.data = planedDay;
  //频率
  var curDay = globalField.currentVisableDay;
  var newClients = [];
  globalField.frequency[id] = globalField.frequency[id] - 1;
  //实际总负荷
  globalField.factLoad =
    globalField.factLoad - parseFloat(currentClient.visitingTime.toFixed(2));
  //当天负荷
  globalField.daysLoad[curDay] =
    globalField.daysLoad[curDay] -
    parseFloat(currentClient.visitingTime.toFixed(2));
  var newBgClass =
    "col_" +
    returnEnoughClass(
      currentClient.visitFrequency.id,
      globalField.frequency[id]
    );
  $$("#create" + id)
    .find(".isFill ")
    .removeClass("col_green col_orange col_red")
    .addClass(newBgClass);

  for (var c of globalField.mvoList) {
    if (clientIds.includes(c.id)) {
      newClients.push(c);
    }
  }
  $$("#factLoad").text(globalField.factLoad.toFixed(2));
  var newDayClass =
    globalField.daysLoad[curDay] == 0
      ? ""
      : "bg_" + bgColorOfDay(globalField.daysLoad[curDay]);
  $$("#day" + curDay).removeClass("bg_green bg_orange bg_red");
  if (newDayClass != "") {
    $$("#day" + curDay).addClass(newDayClass);
  } else {
    $$("#planedList").html("暂无。");
  }
  let newDecribeTitle =
    temTime + " 当日负荷：" + globalField.daysLoad[curDay] + "小时";
  if (newDayClass == "") {
    $$("#decribeTitle")
      .html(newDecribeTitle)
      .removeClass("bg_green bg_orange bg_red");
  } else {
    $$("#decribeTitle")
      .html(newDecribeTitle)
      .removeClass("bg_green bg_orange bg_red")
      .addClass(newDayClass);
  }

  markerMap[id].hide();
  //删除日期map中对应的日期
  let dateIndex = arrangeDateMap[id].indexOf(timestamp);
  arrangeDateMap[id].splice(dateIndex, 1);
}
// 提交/保存计划
function arrangementPlan() {
  var enough = true;
  var fullLoad = true;
  for (var c of globalField.mvoList) {
    if (
      !globalField.frequency.hasOwnProperty(c.id) ||
      globalField.frequency[c.id] == 0
    ) {
      if (c.state.id != $g.OUTLET_STATE.PAUSE) {
        enough = false;
      }
    }
  }
  if (globalField.factLoad < globalField.workdayNum * 6.4) {
    fullLoad = false;
  }
  var prePlan = editSchedule;
  var subDate = {
    id: prePlan.id,
    month: prePlan.month,
    staffId: globalField.staffId,
    data: prePlan.data,
    draft: false
  };
  if (enough && fullLoad) {
    $$.ajax({
      url: $g.API_URL.PLAN_EDITING.compose(host),
      type: "PUT",
      dataType: "json",
      data: JSON.stringify(subDate),
      contentType: "application/json; charset=utf-8",
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
        mjpApp.showPreloader("正在安排，请稍候");
      },
      success: function(data) {
        mjpApp.hidePreloader();
        if (data == undefined) {
          ajaxSet.noData();
        } else if (data.code == $g.API_CODE.OK) {
          mma.setActionMenus(true, [MENU.submit]);
          editSubmit = true;
          showToast("提交计划成功了", 1000);
        } else {
          ajaxSet(data, "提交拜访计划");
        }
      },
      error: function(xhr) {
        mjpApp.hidePreloader();
        ajaxSet.error(xhr);
      }
    });
  } else if (!enough) {
    showToast("仍有网点没有被排班，请确保所有网点都被排班后再提交");
  } else {
    let msg =
      "本月所排计划负荷低于最低负荷：" +
      globalField.workdayNum * 6.4 +
      "，请合理安排后再提交";
    showToast(msg);
  }
}
//保存为草稿
function saveToDraft() {
  var prePlan = editSchedule;
  var subDate = {
    id: prePlan.id,
    month: prePlan.month,
    staffId: globalField.staffId,
    data: prePlan.data,
    draft: true
  };
  $$.ajax({
    url: $g.API_URL.PLAN_EDITING.compose(host),
    type: "PUT",
    dataType: "json",
    data: JSON.stringify(subDate),
    contentType: "application/json; charset=utf-8",
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      mjpApp.showPreloader("正在保存，请稍后");
    },
    success: function(data) {
      mjpApp.hidePreloader();
      if (data.code == $g.API_CODE.OK) {
        showToast("保存草稿成功");
      } else {
        showToast("保存草稿出错");
      }
    },
    error: function(xhr) {
      mjpApp.hidePreloader();
      showToast("保存草稿失败了, 请稍后再试");
    }
  });
}
/*edit页面********************************************************************** */
function showEditPage(value) {
  mjpApp.showPreloader("正在加载，请稍候");
  initGlobalField(value);
  $$("#factLoad").text(globalField.factLoad.toFixed(2));
  var month = value.month;
  Promise.all([
    promiseAjax($g.API_URL.SETTING_WORKDAY.compose(host), "GET", {
      monthTimestamp: month
    }),
    promiseAjax($g.API_URL.MY_MVO.compose(host), "GET", {})
  ])
    .then(function([works, mvos]) {
      if (works == undefined || mvos == undefined) {
        ajaxSet.noData();
      } else if (works.code == $g.API_CODE.OK && mvos.code == $g.API_CODE.OK) {
        showPage(works, mvos, "create");
        mjpApp.hidePreloader();
      } else if (works.code != $g.API_CODE.OK) {
        throw new Error(works.msg);
      } else {
        throw new Error(mvos.msg);
      }
    })
    .catch(function(e) {
      mjpApp.hidePreloader();
      mjpApp.alert("加载计划失败了，错误码：" + e.status, "", function() {
        mainView.router.back();
      });
    });
}
/*详情页面*************************************************************************/
function questPlanInDetail(id) {
  promiseAjax($g.API_URL.PLAN.compose(host), "GET", { id: id }).then(
    function(value) {
      if (value.code == $g.API_CODE.OK) {
        if (value.data == undefined) {
          mjpApp.hidePreloader();
          mjpApp.alert("该计划已被删除", "", function() {
            mainView.router.back();
          });
        }
        detailSchedule = value.data;
        initGlobalField(detailSchedule);
        var data = new URLSearchParams();
        data.append("withVt", "true");
        var mvoIds = [];
        for (var d of detailSchedule.data) {
          var outlets = d.outlets;
          for (var o of outlets) {
            if (!mvoIds.includes(o)) {
              mvoIds.push(o);
              data.append("id", o);
            }
          }
        }
        $$("#factLoadDetail").text(globalField.factLoad.toFixed(2));
        var month = detailSchedule.month;
        Promise.all([
          promiseAjax($g.API_URL.SETTING_WORKDAY.compose(host), "GET", {
            monthTimestamp: month
          }),
          axios.post(
            $g.API_URL.OUTLET_BATCH_RETRIEVAL.compose(host),
            data,
            AXIOSCONFIG
          )
        ])
          .then(function([works, mvos]) {
            if (works == undefined || mvos == undefined) {
              ajaxSet.noData();
            } else if (
              works.code == $g.API_CODE.OK &&
              mvos.data.code == $g.API_CODE.OK
            ) {
              showPage(works, mvos.data, "detail");
              mjpApp.hidePreloader();
            } else if (works.code != $g.API_CODE.OK) {
              throw new Error(works.msg);
            } else {
              throw new Error(mvos.msg);
            }
          })
          .catch(function(e) {
            mjpApp.hidePreloader();
            mjpApp.alert("加载计划出错了，错误码：" + e.status, "", function() {
              mainView.router.back();
            });
          });
      } else {
        mjpApp.hidePreloader();
        mjpApp.alert("加载计划出错了，错误码：" + value.code, "", function() {
          mainView.router.back();
        });
      }
    },
    function(err) {
      mjpApp.hidePreloader();
      mjpApp.alert("加载计划失败了，错误码：" + err.status, "", function() {
        mainView.router.back();
      });
    }
  );
}
//审批页面的审批按钮
function goApproval(planId, approve, message) {
  if (message == undefined) {
    var approveData = {
      month: globalField.currentMonth,
      staffId: globalField.staffId,
      approved: approve
    };
  } else {
    var approveData = {
      month: globalField.currentMonth,
      staffId: globalField.staffId,
      approved: approve,
      reason: message
    };
  }
  mjpApp.closeModal();
  $$.ajax({
    url: $g.API_URL.PLAN_APPROVING.compose(host),
    type: "PUT",
    data: approveData,
    dataType: "json",
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      mjpApp.showPreloader("正在提交审批结果...");
    },
    success: function(data) {
      mjpApp.hidePreloader();
      if (data == undefined) {
        ajaxSet.noData();
      } else if (data.code == $g.API_CODE.OK) {
        showToast("提交审批结果成功", 1000);
        mainView.router.back();
      } else {
        ajaxSet.codeError(data, "提交审批结果");
      }
    },
    error: function(err) {
      mjpApp.hidePreloader();
      ajaxSet.error(err);
    }
  });
}
function deny(planId) {
  mjpApp.modal({
    title: "<b>审批</b>",
    text:
      '<div class="item-content">' +
      "<p>请填写驳回理由</p>" +
      '<div class="item-inner">' +
      '<div class="item-input marb10">' +
      '<textarea class="rejectbox" id="reject"></textarea>' +
      '<span class="color-red disnone">* 请输入驳回理由。</span>' +
      "</div>" +
      "</div>" +
      "</div>",
    afterText:
      '<a href="javascript:;" class="cancleModel icon" id="cancelApprove">close</a>',
    buttons: [
      {
        text: "取消",
        close: false,
        onClick: function() {
          mjpApp.closeModal();
        }
      },
      {
        text: "确定",
        close: false,
        onClick: function() {
          var rejectText = $$("#reject").val();
          if (rejectText == "") {
            $$("#reject")
              .addClass("red")
              .next()
              .show();
          } else {
            goApproval(planId, false, rejectText);
          }
        }
      }
    ]
  });
}
/*公用方法*************************************************************************/
//init Page
function showPage(w, m, page) {
  var works = w.data;
  var clients;
  let mvoTotal = 0;
  if (page == "create") {
    page = "";
    clients = m.data.records;
  } else {
    page = "Detail";
    clients = m.data;
    if (currentAccount.staffId == detailSchedule.staff.id) {
      if (detailSchedule.state == "approved") {
        mma.setActionMenus(false);
      } else {
        mma.setActionMenus(true, [MENU.edit]);
      }
    } else {
      if (detailSchedule.state == "ongoing") {
        mma.setActionMenus(true, [MENU.approve, MENU.deny]);
      } else {
        mma.setActionMenus(false);
      }
    }
  }
  if (clients.length > 0) {
    mvoTotal = clients.length;
  }
  globalField.scaleLoad = works.workingTimePerDay; //每日标准负荷
  globalField.workdayNum = works.days; //一个月工作日数
  globalField.prepareLoad = works.days * works.workingTimePerDay; //一个月预期负荷
  globalField.workdays = works.workdays; //一个月的具体工作日数组
  $$("#mvoTotal" + page).text(mvoTotal);
  $$("#prepareLoad" + page).text(globalField.prepareLoad);
  $$("#calendar" + page).html(showCanledar(works.monthTimestamp, page)); //生成日历
  globalField.mvoList = clients;
  $$("#clientList" + page).html(returnClientListHtml(clients, page));
  initMap(page);
  myScroll.refresh();
}
//根据拜访是否满足进行分类
function sortClientByFrequebcy(list) {
  let redList = [];
  let orangeList = [];
  let greenList = [];
  list.forEach(e => {
    if (globalField.frequency.hasOwnProperty(e.id)) {
      let bgClass = returnEnoughClass(
        e.visitFrequency.id,
        globalField.frequency[e.id]
      );
      if (bgClass == "red") {
        redList.push(e);
      }
      if (bgClass == "orange") {
        orangeList.push(e);
      }
      if (bgClass == "green") {
        greenList.push(e);
      }
    } else {
      redList.push(e);
    }
  });
  return redList.concat(orangeList).concat(greenList);
}
//返回客户列表代码
function returnClientListHtml(arr, page) {
  var html = "";
  if (arr.length > 0) {
    arr = sortClientByFrequebcy(arr);
    let icon = "&#xe75b;";
    let idText = "detail";
    if (page == "") {
      idText = "create";
      icon = "&#xe659;";
    }
    var bgClass = "red";
    for (var item of arr) {
      var id = item.id;
      if (globalField.frequency.hasOwnProperty(id)) {
        bgClass = returnEnoughClass(
          item.visitFrequency.id,
          globalField.frequency[id]
        );
      } else {
        bgClass = "red";
      }
      html +=
        '<li id="' +
        idText +
        item.id +
        '">' +
        '<p class="clientName"><span class="cliBdge" data-callId="' +
        item.visitFrequency.id +
        '">' +
        returnFrequencyNum(item.visitFrequency.id) +
        "</span>" +
        item.name +
        "</p>" +
        '<p class="cliAddr">' +
        item.address +
        "</p>" +
        '<i class="iconfont isFill col_' +
        bgClass +
        ' addToplan">' +
        icon +
        "</i>" +
        "</li>";
    }
  } else {
    html = "<li>暂无</li>";
  }
  return html;
}
//显示已经排了的客户
function showPlanedClient(day, page) {
  page = page == "create" ? "" : "Detail";
  var time = $$("#currentMonth" + page).text() + "/" + checkNum(day);
  var timeStamp = returnTimeStamp(time, true);
  var html = "";
  var curDayLoad = 0;
  var isHasClient = globalField.daysLoad.hasOwnProperty(day);
  var planed = page == "" ? editSchedule : detailSchedule;
  if (isHasClient) {
    for (var d of planed.data) {
      if (d.day == timeStamp) {
        if (d.outlets.length == 0) {
          html = "暂无。";
          mapClients = [];
        } else {
          html = planedHtml(d.outlets, page);
          curDayLoad = globalField.daysLoad[day];
        }
      }
    }
  } else {
    html = "暂无。";
    mapClients = [];
  }
  var bgClass =
    globalField.daysLoad[day] == 0
      ? ""
      : bgColorOfDay(globalField.daysLoad[day]);
  let describeTitle = time + " 当日负荷：" + curDayLoad + "小时";
  if (bgClass != "") {
    bgClass = "bg_" + bgClass;
    $$("#decribeTitle" + page)
      .html(describeTitle)
      .removeClass("bg_green bg_orange bg_red")
      .addClass(bgClass);
  } else {
    $$("#decribeTitle" + page)
      .html(describeTitle)
      .removeClass("bg_green bg_orange bg_red");
  }

  $$("#planedList" + page).html(html);
  $$("#planedClient" + page).show();
  var promise = showMaps(mapClients, true, page);
  promise.then(function(value) {
    map.setFitView();
  });
}
function planedHtml(arr, page) {
  var deleteIcon =
    page == "" ? '<i class="iconfont deleteClient">&#xe613;</i>' : "";
  var clients = [];
  var html = "";
  for (var client of globalField.mvoList) {
    if (arr.includes(client.id)) {
      clients.push(client);
      html +=
        '<li id="range' +
        client.id +
        '" data-lat="' +
        client.latitude +
        '" data-log="' +
        client.longitude +
        '">' +
        '<a href="javascript:;">' +
        client.name +
        "</a>" +
        deleteIcon +
        "</li>";
    }
  }
  mapClients = clients;
  return html;
}

//显示在哪些天有安排拜访
function showPlanedDay(id, page) {
  page = page == "create" ? "" : "Detail";
  let currentMvo = returnCurrentClient(id);
  let html = "";
  let describeTitle = "该网点还未安排拜访计划";
  let days = arrangeDateMap[id];
  days.sort();
  if (days == undefined || days.length == 0) {
    html = "<li>暂未排班</li>";
  } else {
    days.forEach(e => {
      let day = timestamp2String(e);
      html += "<li>" + day + "</li>";
    });
    describeTitle = "该网点安排的拜访日期如下：";
  }
  var bgClass =
    "bg_" +
    returnEnoughClass(currentMvo.visitFrequency.id, globalField.frequency[id]);
  $$("#decribeTitle" + page)
    .text(describeTitle)
    .removeClass("bg_red bg_green bg_orange")
    .addClass(bgClass);
  $$("#planedList" + page).html(html);
  $$("#planedClient" + page).show();
}

//common promise ajax
function promiseAjax(url, type, param, headers) {
  return new Promise(function(resolve, reject) {
    $$.ajax({
      url: url,
      type: type,
      data: param,
      dataType: "json",
      headers: headers,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
      },
      success: function(data) {
        resolve(data);
      },
      error: function(e) {
        reject(e);
      }
    });
  });
}
//clients color
function returnEnoughClass(callId, planNum) {
  var callNum = returnFrequencyNum(callId);
  var eClass = "";
  if (planNum == undefined || planNum == 0) {
    eClass = "red";
  } else if (planNum < callNum) {
    eClass = "orange";
  } else {
    eClass = "green";
  }
  return eClass;
}
//day color
function bgColorOfDay(now) {
  var eClass = "";
  var scale = globalField.scaleLoad;
  if (now == undefined || now == 0) {
    eClass = "";
  } else if (now < scale) {
    eClass = "orange";
  } else {
    eClass = "green";
  }
  return eClass;
}
//current clients
function returnCurrentClient(id) {
  for (var client of globalField.mvoList) {
    if (client.id == id) {
      return client;
    }
  }
}
//return visitFrequency number
function returnFrequencyNum(id) {
  var num = null;
  switch (id) {
    case $g.OUTLET_VISIT_FREQUENCY.V1PM:
      num = 1;
      break;
    case $g.OUTLET_VISIT_FREQUENCY.V2PM:
      num = 2;
      break;
    case $g.OUTLET_VISIT_FREQUENCY.V4PM:
      num = 4;
      break;
  }
  return num;
}
//init globalField
function initGlobalField(schedule) {
  arrangeDateMap = [];
  globalField.frequency = {};
  globalField.daysLoad = {};
  globalField.weeks = {};
  globalField.factLoad = 0;
  globalField.currentMonth = schedule.month;
  globalField.staffId = schedule.staff.id;
  for (var d of schedule.data) {
    var day = new Date(d.day).getDate();
    globalField.daysLoad[day] = parseFloat(d.dayCapacity.toFixed(2));
    globalField.factLoad += parseFloat(d.dayCapacity.toFixed(2));
    var outlets = d.outlets;
    for (var o of outlets) {
      globalField.frequency[o] =
        globalField.frequency[o] == undefined
          ? 1
          : globalField.frequency[o] + 1;
      if (arrangeDateMap[o] != undefined) {
        arrangeDateMap[o].push(d.day);
      } else {
        arrangeDateMap[o] = [d.day];
      }
    }
  }
}
//Next Month TimeStamp
function getNextMonthTimeStamp(now) {
  //var now = new Date();
  if (now.getMonth() == 11) {
    var current = new Date(now.getFullYear() + 1, 0, 1);
  } else {
    var current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }
  return current.getTime();
}
