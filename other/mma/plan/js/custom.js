"use strict";
/* 显示日历 */
function showCanledar(timestamp, page) {
  var holidays = [];
  for (var ts of globalField.workdays) {
    holidays.push(new Date(ts).getDate());
  }
  var nstr = new Date(timestamp); // 获取当前日期
  var changedYear = nstr.getFullYear(); // 年份
  var month = nstr.getMonth(); // 月份
  var dnow = new Date().getDate(); // 今日日期
  var n1str = new Date(changedYear, month, 1); // 当月第一天Date
  var firstday = n1str.getDay(); // 当月第一天星期几
  var allday = getMonthAllDay(month, changedYear);
  globalField.maxDay = allday;
  var rows = requiredRows(allday, firstday);
  var curYm = changedYear + "/" + checkNum(month + 1);
  $$("#currentMonth" + page).text(curYm);
  var tb =
    "<table class='the_date'><tr><th>周日</th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th></tr>";
  for (var i = 0; i < rows; i++) {
    tb += "<tr data-week='" + i + "'>";
    for (var k = 0; k < 7; k++) {
      // 表格每行的单元格
      var idx = i * 7 + k; // 单元格自然序列号
      var date_str = idx - firstday + 1; // 计算日期
      if (date_str <= 0 || date_str > allday) {
        tb += "<td> </td>";
      } else {
        createWeeks(i, date_str, curYm);
        var holidayClass = "";
        if (holidays != null && holidays.includes(date_str)) {
          holidayClass = "validcolor";
        }
        var bgClass = bgColorOfDay(globalField.daysLoad[date_str]);
        if (bgClass != "") {
          bgClass = "bg_" + bgClass;
        }
        tb +=
          "<td id='day" +
          page +
          date_str +
          "' class='" +
          holidayClass +
          " " +
          bgClass +
          "'>" +
          date_str +
          "</td>";
      }
      // 打印日期：今天底色为红
      // 查询月签到情况
    }
    tb += "</tr>";
    // 表格的行结束
  }
  tb += "</table>";
  return tb;
}
// 是否为闰年
function is_leap(year) {
  return year % 100 == 0 ? (year % 400 == 0 ? 1 : 0) : year % 4 == 0 ? 1 : 0;
}
// 获得下拉列表的年
function getNewYear() {
  return $("#currentyear").text();
}
// 获得下拉列表的月
function getNewMonth() {
  // alert("得到月");
  return $("#currentmonth").text();
}
// 获取当月的天数
function getMonthAllDay(month, year) {
  var m_days = new Array(
    31,
    28 + is_leap(year),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  );
  return m_days[month];
}
// 获得某年某月某日是星期几
function getFirstWeekDay(year, month, day) {
  var date = new Date();
  date.setFullYear(year);
  date.setMonth(month);
  date.setDate(day);
  return date.getDay();
}
// 获得表格行数
function requiredRows(allday, firstday) {
  var trstr = Math.ceil((allday + firstday) / 7);
  return trstr;
}
//自己选择月份和年份的时候刷新日历和列表
var reg = new RegExp("^[0-9]*$");

//生成周 日期
function createWeeks(w, d, curYm) {
  var timestamp = returnTimeStamp(curYm + "/" + checkNum(d), true);
  if (globalField.weeks.hasOwnProperty(w)) {
    globalField.weeks[w].push(timestamp);
  } else {
    globalField.weeks[w] = [timestamp];
  }
}

/*地图部分开始***************************************************************/
let markerMap = {};
var map;
function initMap(page) {
  map = new AMap.Map("container" + page, {
    resizeEnable: true,
    zoom: 13
  });
}
//地图生成 n 个点
function showClientsInMap(arr, page, resolve) {
  map = new AMap.Map("container" + page, {
    resizeEnable: true,
    zoom: 13
  });
  //加载SimpleMarker——多个
  AMapUI.loadUI(["overlay/SimpleMarker"], function(SimpleMarker) {
    var iconTheme = "default";
    for (var i = 0; i < arr.length; i++) {
      let id = arr[i].id;
      var name = globalField.showName ? arr[i].name : "";
      var freNum = globalField.frequency[arr[i].id];
      var noLng = arr[i].longitude == undefined || arr[i].longitude == 0;
      var noLat = arr[i].latitude == undefined || arr[i].latitude == 0;
      var bgClass = "red";
      if (freNum != undefined) {
        bgClass = returnEnoughClass(arr[i].visitFrequency.id, freNum);
      }
      if (noLng || noLat) {
        continue;
      } else {
        var oMarker = new SimpleMarker({
          iconTheme: iconTheme,
          position: [arr[i].longitude, arr[i].latitude],
          iconStyle: bgClass,
          map: map,
          showPositionPoint: true,
          label: {
            content: name,
            offset: new AMap.Pixel(26, 28)
          }
        });
        markerMap[id] = oMarker;
      }
    }
    resolve();
  });
}
function showOnePointInMap(obj, page, resolve) {
  var name = globalField.showName ? obj.name : "";
  var freNum = globalField.frequency[obj.id];
  var bgClass = returnEnoughClass(obj.visitFrequency.id, freNum);
  AMapUI.loadUI(["overlay/SimpleMarker"], function(SimpleMarker) {
    var iconTheme = "default";
    var oMarker = new SimpleMarker({
      iconTheme: iconTheme,
      position: [obj.longitude, obj.latitude],
      iconStyle: bgClass,
      map: map,
      showPositionPoint: true,
      label: {
        content: name,
        offset: new AMap.Pixel(27, 25)
      }
    });
    resolve();
  });
}

function showMaps(obj, flag, page) {
  //flag=true：地图上显示多个点，否则显示一个点
  return new Promise(function(resolve, reject) {
    if (flag) {
      showClientsInMap(obj, page, resolve);
    } else {
      showOnePointInMap(obj, page, reject);
    }
  });
}

//*****************************其他需要用到的方法
//月份，日期补‘0’
function checkNum(i) {
  return i < 10 ? "0" + i : i;
}
//时间戳转换
function returnTimeStamp(date, flag) {
  var theDate = new Date(date);
  var result = null;
  if (flag) {
    result = theDate.getTime();
  } else {
    var y = theDate.getFullYear();
    var m = theDate.getMonth() + 1;
    var d = theDate.getDay();
    result = y + "/" + checkNum(m) + "/" + checkNum(d);
  }
  return result;
}
//****************其他需要用到的方法 end*************
