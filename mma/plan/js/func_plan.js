"use strict";
/*constant*********************************************************/
/*----------------------------------------------------------------*/
/*index page*******************************************************/
function requestRemotePlanListAndUpdate(listApiUrl) {
  $$.ajax({
    url: listApiUrl,
    type: "GET",
    dataType: "json",
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
    },
    success: function(data, status, xhr) {
      //onlineDate = new Date(xhr.getResponseHeader("Date"));
      onlineDate = new Date();
      if (data.code == $g.API_CODE.OK) {
        //当有记录且没有下个月的记录，才允许新建
        //mma.getCache("account").then(function(value) {
          //currentAccount = value;
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
        //});
      } else {
        mjpApp.toast("请求计划列表出错", "", { duration: 1000 }).show();
      }
      mjpApp.hidePreloader();
    },
    error: function(xhr) {
      ajaxSet.error(xhr, "加载拜访计划数据出错了, 请稍后再试。");
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
//generate tab
function generateViewItems(itemType, items) {
  let html = "";
  $$.each(items, function(i, e) {
    let plan = e;
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
//YYYY-MM
function getYearMonth(timestamp) {
  var date = new Date(timestamp);
  var mm = date.getMonth() + 1;
  var dd = date.getDate();

  return [date.getFullYear(), "-", (mm > 9 ? "" : "0") + mm].join("");
}
//current plan state
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
//load some tab
function onTabShow(tab) {
  currentTab = tab;
  mjpApp.pullToRefreshTrigger(".pull-to-refresh-content");
}
//enter detail page
function enterDetailPage(id){
	if (id != undefined) {
      id = id.substring(5);
      currentPlanId = id;
      mainView.router.loadPage("detail.html?id=" + id);
    }
}
/*----------------------------------------------------------------*/

/*create page*******************************************************/
function questPlanInCreate() {
	initGlobal();
  //mjpApp.showPreloader("正在加载，请稍候。");
  promiseAjax($g.API_URL.PLAN_CREATING.compose(host), "GET", {
    month: getNextMonthTimeStamp(onlineDate)
  }).then(function(value) {
  	if(value==undefined){
  		ajaxSet.noData();
  	}else if (value.code == $g.API_CODE.OK) {
	  	if(value.data==undefined){
	  		showToast("无法获取详细计划数据，请联系管理员");
	  		mainView.router.back();
	  	}else{
	  		currentPlan=value.data;
	  		initConstantfromPlan(currentPlan);
	  		Promise.all([
          promiseAjax($g.API_URL.SETTING_WORKDAY.compose(host), "GET", {
            monthTimestamp: currentPlan.month
          }),
          promiseAjax($g.API_URL.MY_MVO.compose(host), "GET", {})
        ])
	      .then(function([works, mvos]) {
	      	let [wFlag,mFlag]=[false,false];
	      	if(works==undefined){
	      		ajax.noData('无法从服务器获取工作日数据');
	      	}else if(works.code==$g.API_CODE.OK){
	      		wFlag=true;
	      		initConstantfromWorks(works.data);
	      	}else{
	      		ajax.codeError(works);
	      	}
	      	if(mvos==undefined){
	      		ajax.noData('无法从服务器获取mvo数据');
	      	}else if(mvos.code==$g.API_CODE.OK){
	      		mFlag=true;
	      		initConstantfromMvos(mvos.data);
	      	}else{
	      		ajax.codeError(mvos);
	      	}
	      	if(wFlag&&mFlag){
	      		renderThePage(works.data,mvos.data,'create');
	      	}
	        mjpApp.hidePreloader();
	      })
	      .catch(function(e) {
	        mjpApp.hidePreloader();
	        mjpApp.alert("加载计划出错了，错误码：" + e.status, "", function() {
	          mainView.router.back();
	        });
	      });
	  	}
    }
  },function(err) {
    mjpApp.hidePreloader();
	  mjpApp.alert("加载计划失败了，错误码：" + err.status, "", function() {
	    mainView.router.back();
	  });
    }
  );
}

/*-----------------------------------------------------------------*/

/*detail page*******************************************************/
function questPlanInDetail(id){
	initGlobal();
	promiseAjax($g.API_URL.PLAN.compose(host), "GET", { id: id }).then(
    function(value) {
    	if(value==undefined){
  		ajaxSet.noData();
  	}else if (value.code == $g.API_CODE.OK) {
	    if (value.data == undefined) {
	      mjpApp.hidePreloader();
	      mjpApp.alert("该计划已被删除", "", function() {
	        mainView.router.back();
	      });
	    }else{
	    	currentPlan=value.data;
	    	initConstantfromPlan(currentPlan);
	    	let data = new URLSearchParams();
        data.append("withVt", "true");
        let mvoIds = [];
        for (let d of currentPlan.data) {
          let outlets = d.outlets;
          for (let o of outlets) {
            if (!mvoIds.includes(o)) {
              mvoIds.push(o);
              data.append("id", o);
            }
          }
        }
        Promise.all([
          promiseAjax($g.API_URL.SETTING_WORKDAY.compose(host), "GET", {
            monthTimestamp: currentPlan.month
          }),
          axios.post(
            $g.API_URL.OUTLET_BATCH_RETRIEVAL.compose(host),
            data,
            AXIOSCONFIG
          )
        ]).then(function([works, mvos]){
        	mvos=mvos.data;
        	let [wFlag,mFlag]=[false,false];
	      	if(works==undefined){
	      		ajax.noData('无法从服务器获取工作日数据');
	      	}else if(works.code==$g.API_CODE.OK){
	      		wFlag=true;
	      		initConstantfromWorks(works.data);
	      	}else{
	      		ajax.codeError(works);
	      	}
	      	if(mvos==undefined){
	      		ajax.noData('无法从服务器获取mvo数据');
	      	}else if(mvos.code==$g.API_CODE.OK){
	      		mFlag=true;
	      		initConstantfromMvos(mvos.data);
	      	}else{
	      		ajax.codeError(mvos);
	      	}
	      	if(wFlag&&mFlag){
	      		renderThePage(works.data,mvos.data,'detail');
	      	}
	        mjpApp.hidePreloader();
        })
        .catch(function(e) {
          mjpApp.hidePreloader();
	        mjpApp.alert("加载计划出错了，错误码：" + e.status, "", function() {
	          mainView.router.back();
	        });
        });
	    }     
	  } else {
	    mjpApp.hidePreloader();
	    mjpApp.alert("加载计划出错了，错误码：" + value.code, "", function() {
	      mainView.router.back();
	    });
	  }
  },function(err) {
    mjpApp.hidePreloader();
	  mjpApp.alert("加载计划失败了，错误码：" + err.status, "", function() {
	    mainView.router.back();
	  });
  });
}
/*-----------------------------------------------------------------*/


/*click func********************************************************/
//arrange one 
function arrangeOneClient(id){
	id=parseInt(id);
	let client=mvoMap[id];
	let timestamp=currentDay;
	let capacity=keep2Decimal(client.visitingTime); 
	let $client = $$("#create" + id);
	let $day = $$("#day" + timestamp);
	let weekNum = parseInt($day.parent().attr("data-week"));
	let frequentNum=getFrequentNumByFrequentId(client.visitFrequency.id);
	let isRepeat=arrangeInSomeWeek(id,weekNum);//此周排班
	if(isRepeat){
		showToast("该网点本周已有排班");
	}else{
		let intervalDays=howManyDaysAutoArrange(id);
		let arrangeDays=[];
		if(intervalDays>0){
			let ms=intervalDays*24 * 3600 * 1000
			arrangeDays.push(timestamp);
			let visitNum=1;	
			let maxTimestamp=new Date(timestamp).setDate(maxDay);
			while(visitNum<frequentNum&&timestamp<=maxTimestamp){
				timestamp+=ms;
				if(workday.includes(timestamp)){
					arrangeDays.push(timestamp);
					visitNum++;
				}
			}
		}else{
			arrangeDays.push(timestamp);
		}
		arrangeDays.forEach(e=>{
			//频率
			if(frequentMap[id]==undefined){
				frequentMap[id]=1;
			}else{
				frequentMap[id]+=1;
			}
			//日负荷
			if(dayloadMap[e]==undefined){
				dayloadMap[e]=capacity;
			}else{
				dayloadMap[e]+=capacity;
			}
			//已排日期
			if(dateMap[id]==undefined){
				dateMap[id]=[e];
			}else{
				dateMap[id].push(e);
			}
			//已排网点
			if(dayMap[e]==undefined){
				dayMap[e]=[id];
			}else{
				dayMap.push(id);
			}
			//实际负荷
			factLoad+=capacity;
			$$("#factLoad").text(keep2Decimal(factLoad));
			//日期颜色
			let $date = $$("#day" + e);
			let dayColor="bg_"+getColorOfDate(dayloadMap[e]);
			$date.removeClass("bg_red bg_orange bg_green").addClass(dayColor);
		})
		//网点颜色
		let mvoColor="col_"+getColorOfMVO(client.visitFrequency.id,frequentMap[id]);
		$client.find(".isFill").removeClass("bg_red bg_orange bg_green").addClass(mvoColor);
		showPlanedClient(currentDay,"create");
	}
}


//自动安排几次
function howManyDaysAutoArrange(id){
	let num=0;
	let frequentId=mvoMap[id].visitFrequency.id
	let isRange=false;
	if(frequentMap[id]!=undefined&&frequentMap[id]>0){
		let isRange=true;
	}
	if(!isRange&&frequentId > $g.OUTLET_VISIT_FREQUENCY.V1PM){
		num = frequentId == $g.OUTLET_VISIT_FREQUENCY.V2PM ? 14 : 7;
	}
	return num;
}

//某周是否排班
function arrangeInSomeWeek(id,weekNum){
	let arrange=false;
	let weeks=weekMap[weekNum];
	weeks.forEach(e=>{
		let ids=dayMap[e];
		if(ids!=undefined&&ids.includes(id)){
			arrange=true;
		}
	})
	return arrange;
}

//delete one
function deleteOneClient(id) {
	id=parseInt(id);
  let client=mvoMap[id];
  let timestamp=currentDay;
  let capacity=keep2Decimal(client.visitingTime);
  frequentMap[id]-=1;//频率减一
  dayloadMap[timestamp]-=capacity;//当日负荷减去
  //已排日期里删除
  let idx=dateMap[id].indexOf(timestamp);
  dateMap[id].splice(idx,1);
  //已排网点中剔除
  let ixd=dayMap[timestamp].indexOf(id);
  dayMap[timestamp].splice(ixd,1);
  factLoad-=capacity;//实际总负荷减去
  
  let mvoColor="col_"+getColorOfMVO(client.visitFrequency.id,frequentMap[id]);
  let dayColor="bg_"+getColorOfDate(dayloadMap[timestamp]);
  
  $$("#factLoad").text(keep2Decimal(factLoad));
  $$("#create" + id)
    .find(".isFill ")
    .removeClass("col_green col_orange col_red")
    .addClass(mvoColor); 
  $$("#day" + timestamp).removeClass("bg_green bg_orange bg_red").addClass(dayColor);
  let newDecribeTitle =
    timestamp2String(timestamp) + " 当日负荷：" + dayloadMap[timestamp] + "小时";
  $$("#decribeTitle")
      .text(newDecribeTitle)
      .removeClass("bg_green bg_orange bg_red")
      .addClass(dayColor);
  if(dayMap[timestamp].length==0){
  	$$("#planedList").html("<li>暂无</li>");
  }
  markerMap[id].hide();
}

// show planed
function showPlanedDay(id, page) {
  page = page == "create" ? "" : "Detail";
  let client=mvoMap[id];
  let html = "";
  let describeTitle = "该网点还未安排拜访计划";
  let days = dateMap[id];
  if (days == undefined || days.length == 0) {
    html = "<li>暂未排班</li>";
  } else {
  	days.sort();
    days.forEach(e => {
      let day = timestamp2String(e);
      html += "<li>" + day + "</li>";
    });
    describeTitle = "该网点安排的拜访日期如下：";
  }
  let mvoColor="bg_"+getColorOfMVO(client.visitFrequency.id,frequentMap[id]);
  $$("#decribeTitle" + page)
    .text(describeTitle)
    .removeClass("bg_red bg_green bg_orange")
    .addClass(mvoColor);
  $$("#planedList" + page).html(html);
  $$("#planedClient" + page).show();
}


function showPlanedClient(timestamp,page){
	page = page == "create" ? "" : "Detail";
	let html="";
	let thisLoad=0;
	let ids=[];
	if(dayMap[timestamp]!=undefined&&dayMap[timestamp].length>0){
		ids=dayMap[timestamp];
		thisLoad=dayloadMap[timestamp];
		html=generateArrangedMvo(ids,page);
	}else{
		html = "暂无。";
	}
	let dayColor="bg_"+getColorOfDate(dayloadMap[timestamp]);
	let describeTitle = timestamp2String(timestamp) + " 当日负荷：" + keep2Decimal(thisLoad) + "小时";
  $$("#decribeTitle" + page)
      .html(describeTitle)
      .removeClass("bg_green bg_orange bg_red")
      .addClass(dayColor);
  $$("#planedList" + page).html(html);
  $$("#planedClient" + page).show();
  if(ids.length>0){
  	showMarkersInMap(ids,page).then(function(){
			map.setFitView();
		})
  }
}
//已安排的 in some day
function generateArrangedMvo(ids,page){
	let html="";
	let deleteIcon =
    page == "" ? '<i class="iconfont deleteClient">&#xe613;</i>' : "";
  ids.forEach(e=>{
  	let client=mvoMap[e];
  	html +=
        '<li id="range' +
        client.id +
        '">' +
        '<a href="javascript:;">' +
        client.name +
        "</a>" +
        deleteIcon +
        "</li>";
  });
  return html;
}

//show map and marker
function showMarkersInMap(points, page) {
  return new Promise(function(resolve, reject) {
    map = new AMap.Map("container" + page, {
	    resizeEnable: true,
	    zoom: 13
	  });
	  //加载SimpleMarker——多个
	  AMapUI.loadUI(["overlay/SimpleMarker"], function(SimpleMarker) {
	    var iconTheme = "default";
	    points.forEach(e=>{
	    	let point=mvoMap[e];
	    	let name=showMarkerName?point.name:'';
	    	let noLng = point.longitude == undefined || point.longitude == 0;
	      let noLat = point.latitude == undefined || point.latitude == 0; 
	      let mvoColor=getColorOfMVO(point.visitFrequency.id,frequentMap[point.id]);
	      if (noLng || noLat) {
	        return;
	      } else {
	        var oMarker = new SimpleMarker({
	          iconTheme: iconTheme,
	          position: [point.longitude, point.latitude],
	          iconStyle: mvoColor,
	          map: map,
	          showPositionPoint: true,
	          label: {
	            content: name,
	            offset: new AMap.Pixel(26, 28)
	          }
	        });
	        if(page==""){
	        	markerMap[e] = oMarker;
	        }
	      }
	    })
	    resolve();
	  });
  });
}
/*-----------------------------------------------------------------*/


/*common func*******************************************************/
function renderThePage(w,m,page){
	if (page == "create") {
    page = "";
    clients = m.records;
  } else {
    page = "Detail";
    clients = m;
    if (currentAccount.staffId == currentPlan.staff.id) {
      if (currentPlan.state == "approved") {
        mma.setActionMenus(false);
      } else {
        mma.setActionMenus(true, [MENU.edit]);
      }
    } else {
      if (currentPlan.state == "ongoing") {
        mma.setActionMenus(true, [MENU.approve, MENU.deny]);
      } else {
        mma.setActionMenus(false);
      }
    }
  }
  $$("#factLoad" + page).text(keep2Decimal(factLoad));
  $$("#prepareLoad" + page).text(keep2Decimal(preLoad));
  generateMvoList(clients,page);
  generateCalendar(w.monthTimestamp,page);
  initLocationMap(page);
  myScroll.refresh();
}

//保留两位小数
function keep2Decimal(number){
	return parseFloat(number.toFixed(2));
}

function generateMvoList(clients,page){
	let mvoTotal=0;//mvo 个数
	let html="";
	if (clients.length > 0) {
		mvoTotal=clients.length;
    clients = sortClientByFrequency(clients);
    let icon = "&#xe75b;";
    let idText = "detail";
    if (page == "") {
      idText = "create";
      icon = "&#xe659;";
    }
    for (var item of clients) {
      let id = item.id;
      let bgColor=getColorOfMVO(item.visitFrequency.id,frequentMap[id]);
      html +=
        '<li id="' +
        idText +
        item.id +
        '">' +
        '<p class="clientName"><span class="cliBdge">' +
        getFrequentNumByFrequentId(item.visitFrequency.id) +
        "</span>" +
        item.name +
        "</p>" +
        '<p class="cliAddr">' +
        item.address +
        "</p>" +
        '<i class="iconfont isFill col_' +
        bgColor +
        ' addToplan">' +
        icon +
        "</i>" +
        "</li>";
    }
  } else {
    html = "<li>暂无</li>";
  }
  $$("#mvoTotal" + page).text(mvoTotal);
  $$("#clientList" + page).html(html);
}
//根据拜访是否满足进行分类
function sortClientByFrequency(list) {
  let redList = [];
  let orangeList = [];
  let greenList = [];
  list.forEach(e => {
  	let id=e.id;
  	let bgClass = getColorOfMVO(e.visitFrequency.id,frequentMap[id]);
  	if (bgClass == "red") {
	    redList.push(e);
	  }
	  if (bgClass == "orange") {
	    orangeList.push(e);
	  }
	  if (bgClass == "green") {
	    greenList.push(e);
	  }
  });
  return redList.concat(orangeList).concat(greenList);
}

//mvo 颜色
function getColorOfMVO(id,num){
	let scale = getFrequentNumByFrequentId(id);
  let eClass = "red";
  if (num == 0||num==undefined) {
    eClass = "red";
  } else if (num < scale) {
    eClass = "orange";
  } else {
    eClass = "green";
  }
  return eClass;
};
//拜访频率id 对应次数
function getFrequentNumByFrequentId(id){
	let num = 0;
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

//generate calendar
function generateCalendar(timestamp,page){
	let n=new Date(timestamp)
	let y=n.getFullYear();//年份
	let m=n.getMonth();//月
	let firstDay=new Date(y,m,1).getDay();//当月第一天date
	let weekNum = Math.ceil((maxDay + firstDay) / 7);
	let tb =
    "<table class='the_date'><tr><th>周日</th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th></tr>";
	for(let i=0;i<weekNum;i++){
		tb += "<tr data-week='" + i + "'>";
		for(let j=0;j<7;j++){
			let idx=i*7+j;
			let d=idx-firstDay+1;
			if(d<=0||d>maxDay){
				tb += "<td> </td>";
			}else{
				let currentTimestamp=timestampMap[d];
				let workdayClass=workday.includes(currentTimestamp)?"validcolor":"";
				let dateColor="bg_"+getColorOfDate(dayloadMap[currentTimestamp]);
				tb +=
          "<td id='day" +
          page +
          currentTimestamp +
          "' class='" +
          workdayClass +
          " " +
          dateColor +
          "'>" +
          d +
          "</td>";
			}
		}
		tb += "</tr>";
	}
	tb += "</table>";
	$$("#currentMonth" + page).text(y+'-'+checkNum(m+1));
	$$("#calendar" + page).html(tb); //生成日历
}

//date 颜色
function getColorOfDate(load){
	var eClass = "red";
  if (load == undefined || load == 0) {
    eClass = "red";
  } else if (load < scaleLoad) {
    eClass = "orange";
  } else {
    eClass = "green";
  }
  return eClass;
};

function initLocationMap(page){
	map = new AMap.Map("container" + page, {
    resizeEnable: true,
    zoom: 13
  });
}

//init global constant
function initGlobal(){
	[frequentMap,dayloadMap,mvoMap,dateMap,dayMap,weekMap,workday,timestampMap]=[[],[],[],[],[],[],[],[]];
	[factLoad,scaleLoad,preLoad,currentDay,maxDay,clients,currentPlan]=[0,0,0];
}
function initConstantfromPlan(data){
	console.log(data);
	let plan=data.data;
	plan.forEach(e=>{
		let timestamp=e.day;
		let capacity=parseFloat(e.dayCapacity.toFixed(2));//保留两位小数
		let outlets=e.outlets;
		dayloadMap[timestamp]=capacity;
		dayMap[timestamp]=outlets;
		factLoad+=capacity;
		outlets.forEach(e=>{
			let id=e;
			if(frequentMap[id]==undefined){
				frequentMap[id]=1;
			}else{
				frequentMap[id]+=1;
			}
			if(dateMap[id]==undefined){
				dateMap[id]=[timestamp];
			}else{
				dateMap[id].push(timestamp);
			}
		})
	});
}
function initConstantfromWorks(w){
	console.log(w);
	workday=w.workdays;
	scaleLoad=w.workingTimePerDay;
	preLoad=scaleLoad*w.days;
	let timestamp=w.monthTimestamp;
	let n=new Date(timestamp)
	let y=n.getFullYear();//年份
	let m=n.getMonth();//月
	let firstDay=new Date(y,m,1).getDay();//当月第一天date
	maxDay=getMonthAllDay(m, y);
	let weekNum = Math.ceil((maxDay + firstDay) / 7);
	for(let i=0;i<weekNum;i++){
		for(let j=0;j<7;j++){
			let idx=i*7+j;
			let d=idx-firstDay+1;
			if(d>0&&d<=maxDay){
				let currentTimestamp=new Date(y,m,d).getTime();
				timestampMap[d]=currentTimestamp;
				if(weekMap[i]==undefined){
					weekMap[i]=[currentTimestamp];
				}else{
					weekMap[i].push(currentTimestamp);
				}
			}
		}
	}
}
function initConstantfromMvos(m){
	console.log(m);
	let mvos=m.records==undefined?m:m.records;
	if(mvos.length!=0){
		mvos.forEach(e=>{
			let id=e.id;
			mvoMap[id]=e;
		})
	}
}

//get maxDay in month
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
// 是否为闰年
function is_leap(year) {
  return year % 100 == 0 ? (year % 400 == 0 ? 1 : 0) : year % 4 == 0 ? 1 : 0;
}
//补 0
function checkNum(i){
	return i<10?"0"+i:i;
}
/*----------------------------------------------------------------*/


/*approve deny*****************************************************/
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
/*----------------------------------------------------------------*/

/*for edit ********************************************************/
function questForEdit(detailPlan){
	mjpApp.showPreloader("正在加载，请稍候");
  initGlobal();
  currentPlan=detailPlan;
  initConstantfromPlan(currentPlan);
  Promise.all([
    promiseAjax($g.API_URL.SETTING_WORKDAY.compose(host), "GET", {
      monthTimestamp: currentPlan.month
    }),
    promiseAjax($g.API_URL.MY_MVO.compose(host), "GET", {})
  ])
	.then(function([works, mvos]) {
	  let [wFlag,mFlag]=[false,false];
  	if(works==undefined){
  		ajax.noData('无法从服务器获取工作日数据');
  	}else if(works.code==$g.API_CODE.OK){
  		wFlag=true;
  		initConstantfromWorks(works.data);
  	}else{
  		ajax.codeError(works);
  	}
  	if(mvos==undefined){
  		ajax.noData('无法从服务器获取mvo数据');
  	}else if(mvos.code==$g.API_CODE.OK){
  		mFlag=true;
  		initConstantfromMvos(mvos.data);
  	}else{
  		ajax.codeError(mvos);
  	}
  	if(wFlag&&mFlag){
  		renderThePage(works.data,mvos.data,'create');
  	}
    mjpApp.hidePreloader();
	})
	.catch(function(e) {
	  mjpApp.hidePreloader();
	  mjpApp.alert("加载计划失败了，错误码：" + e.status, "", function() {
	    mainView.router.back();
	  });
	});
}

/*----------------------------------------------------------------*/

/*submit   save draft**********************************************/
function submitPlan(){
	console.log(currentPlan);
	let [enough,fullLoad]=[true,true];
	mvoMap.forEach((e,i)=>{
		if((frequentMap[i]==undefined||frequentMap[i]==0)&&e.state.id!=$g.OUTLET_STATE.PAUSE){
			enough=false;
		}
	})
	if (enough && fullLoad) {
		let subData=getPlanDataForSubmit(true);
		console.log(subData);
    $$.ajax({
      url: $g.API_URL.PLAN_EDITING.compose(host),
      type: "PUT",
      dataType: "json",
      data: JSON.stringify(subData),
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
      preLoad +
      "，请合理安排后再提交";
    showToast(msg);
  }
	
}
function getPlanDataForSubmit(flag){
	let dataArr=[];
	let data={
		id:currentPlan.id,
		month: currentPlan.month,
    staffId: currentPlan.staff.id,
	};
	if(flag){
		data.draft=false;
	}else{
		data.draft=true;
	}
	workday.forEach(e=>{
		let obj={
			day:e,
			outlets:dayMap[e],
			dayCapacity:dayloadMap[e]
		}
		dataArr.push(obj);
	})
	data.data=dataArr;
	return data;
}

//保存为草稿
function saveToDraft() {
  let subDate = getPlanDataForSubmit(false);
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
/*----------------------------------------------------------------*/

/*common func in create & detail***********************************/
//ajax promise
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
/*----------------------------------------------------------------*/