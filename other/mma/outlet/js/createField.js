/*****************
 * I:input
 * D:date
 * S:select
 * T:textarea
 * P:img
 * C:dealer
 * ******************/
var field = {
  createField: function(str) {
    str = str == undefined ? "" : str;
    var html = "";
    mainField.forEach(e => {
      switch (e.type) {
        case "D":
          html += returnHtml.date(e, str);
          break;
        case "S":
          html += returnHtml.select(e, str);
          break;
        case "T":
          html += returnHtml.textarea(e, str);
          break;
        case "P":
          html += returnHtml.img(e, str);
          break;
        case "C":
          html += returnHtml.dealer(e, str);
          break;
        default:
          html += returnHtml.input(e, str);
          break;
      }
    });
    $$("#allField" + str).append(html);
  },
  validate: function() {
    mainField.forEach(e => {
      if (e.required) {
        var id = e.id;
        e.type == "P"
          ? validGeneralField(id, false)
          : validGeneralField(id, true);
      }
    });
    var pass = true;
    $$(".required").each(function() {
      if ($$(this).hasClass("red")) {
        pass = false;
      }
    });
    return true;
  },
  collectData: function() {
    var outletData = {};
    mainField.forEach(e => {
      if (e.type == "P") {
        outletData.latitude = returnValue(e).split("&")[0];
        outletData.longitude = returnValue(e).split("&")[1];
      } else {
        outletData[e.name] = returnValue(e);
      }
    });
    return outletData;
  },
  displayData:function(obj,str1,str2){
  	var w = parseInt(
    $$("#location" + str1)
      .parent(".mapimg")
      .width()
  	);
  	mainField.forEach(e => {
      if (e.type == "P") {
      	var lng=obj.hasOwnProperty('longitude')&&obj.longitude!='';
      	var lat=obj.hasOwnProperty('latitude')&&obj.latitude!='';
      	if(lng&&lat){
      		var mapSrc =
		      "http://restapi.amap.com/v3/staticmap?location=" +
		      obj.longitude +
		      "," +
		      obj.latitude +
		      "&zoom=14&size=" +
		      w +
		      "*200&markers=large,,:" +
		      obj.longitude +
		      "," +
		      obj.latitude +
		      "&key=b2a701a4c4e88acd8fac16bbf402484f";
		    $$('#'+e.id+str1).attr('src',mapSrc);
	    	$$('#'+e.id+str2).attr('src',mapSrc);
      	}
      };
      if(e.type == "I"||e.type == "T"){
      	if(obj.hasOwnProperty(e.id)){
      		$$('#'+e.id+str1).val(obj[e.id]);
      		$$('#'+e.id+str2).val(obj[e.id]);
      	}
      };
      if(e.type=='S'||e.type=='C'){
      	if(obj.hasOwnProperty(e.id)){
      		if(e.name=='state'&&obj[e.id].id==1){
      			$$('#reopenTimestamp'+str1).parents('.sameRoot').show();
      			$$('#reopenTimestamp'+str2).parents('.sameRoot').show();
      		}
      		$$('#'+e.id+str1).text(obj[e.id].name);
      		$$('#'+e.id+str2).text(obj[e.id].name);
      	}
      };
      if(e.type=="D"){
      	if(obj.hasOwnProperty(e.id)){
      		$$('#'+e.id+str1).val(timestamp2String(obj[e.id]));
      		$$('#'+e.id+str2).val(timestamp2String(obj[e.id]));
      	}
      }
   });
  }
};
function validGeneralField(id, flag) {
  var value = flag ? $$("#" + id).val() : $$("#" + id).attr("src");
  if (value == "" || value == 0 || value.length == 0) {
    $$("#" + id)
      .parents(".sameRoot")
      .find(".required")
      .text("*必填")
      .addClass("red");
  }
}
var cancleEles = ["input", "textarea", "li"];
//点击取消验证报错信息
function cancleErroeText(obj) {
  $$("#allField").on("click", obj, function() {
    $$(this)
      .parents(".sameRoot")
      .find(".required")
      .text("*")
      .removeClass("red");
  });
}
//返回拿到的数据
function returnValue(e) {
  var singleVal = "";
  if (e.type == "I" || e.type == "T") {
    var v = $$("#" + e.id).val();
    if (v == "") {
      singleVal = "";
    } else {
      singleVal = e.valueType == "text" ? v : parseInt(v);
    }
  }
  if (e.type == "D") {
    var v = $$("#" + e.id).val();
    singleVal = Date.parse(v);
  }
  if (e.type == "S" || e.type == "C") {
    var v = $$("#" + e.id).val();
    if (v == "" || v == 0) {
      singleVal = "";
    } else {
      singleVal = parseInt(v);
    }
  }
  if (e.type == "P") {
    var lat = $$("#" + e.id).attr("data-lat");
    var lng = $$("#" + e.id).attr("data-lng");
    singleVal = lat + "&" + lng;
  }

  return singleVal;
}
//时间戳==>指定时间格式
function timestamp2String(timestamp) {
  var date = new Date(timestamp);
  var mm = date.getMonth() + 1;
  var dd = date.getDate();

  return [
    date.getFullYear(),
    "-",
    (mm > 9 ? "" : "0") + mm,
    "-",
    (dd > 9 ? "" : "0") + dd
  ].join("");
}
//字段
var returnHtml = {
  input: function(obj, str) {
    var html = "";
    if (str == "") {
      html =
        '<div class="sameRoot inbox ' +
        obj.outClass +
        '" id="item-' +
        obj.id +
        '">' +
        "<p>" +
        obj.text +
        " " +
        this.isRequired(obj).reqText +
        "</p>" +
        '<input type="' +
        obj.valueType +
        '" name="' +
        obj.name +
        '" id="' +
        obj.id +
        '" class="' +
        obj.innerClass +
        '" placeholder="' +
        obj.placeholder +
        '" ' +
        this.isRequired(obj).req +
        ' autocomplete="off">' +
        "</div>";
    } else {
      html =
        '<div class="sameRoot inbox ' +
        obj.outClass +
        '">' +
        "<p>" +
        obj.text +
        "</p>" +
        '<input type="' +
        obj.valueType +
        '" class="' +
        obj.innerClass +
        '" readonly="readonly" id="' +
        obj.id +
        str +
        '" placeholder="' +
        obj.placeholder +
        '" />' +
        "</div>";
    }
    return html;
  },
  select: function(obj, str) {
    var html = "";
    if (str == "") {
      html =
        '<div class="sameRoot list-block ' +
        obj.outClass +
        '">' +
        "<ul>" +
        '<li id="item-' +
        obj.id +
        '">' +
        '<a href="#" class="item-link smart-select" data-back-on-select="true">' +
        '<div class="item-content">' +
        '<div class="item-inner">' +
        '<div class="item-title">' +
        obj.text +
        " " +
        this.isRequired(obj).reqText +
        "</div>" +
        '<div class="item-after smart-select-value" id="item-after-sss-' +
        obj.id +
        '">请选择</div>' +
        "</div>" +
        "</div>" +
        "<select " +
        this.isRequired(obj).req +
        ' name="' +
        obj.text +
        '" class="sss-' +
        obj.id +
        '" id="' +
        obj.id +
        '" data-type="' +
        obj.valueType +
        '">' +
        "</select>" +
        "</a>" +
        "</li>" +
        "</ul>" +
        "</div>";
    } else {
      html =
        '<div class="sameRoot list-block ' +
        obj.outClass +
        '">' +
        "<ul>" +
        '<li class="item-content">' +
        '<div class="item-inner">' +
        '<div class="item-title">' +
        obj.text +
        "</div>" +
        '<div class="after" id="' +
        obj.id +
        str +
        '"></div>' +
        "</div>" +
        "</li>" +
        "</ul>" +
        "</div>";
    }
    return html;
  },
  textarea: function(obj, str) {
    var html = "";
    if (str == "") {
      html =
        '<div class="sameRoot inbox ' +
        obj.outClass +
        '" id="item-' +
        obj.id +
        '">' +
        "<p>" +
        obj.text +
        " " +
        this.isRequired(obj).reqText +
        "</p>" +
        '<textarea name="' +
        obj.name +
        '" id="' +
        obj.id +
        '" class="' +
        obj.innerClass +
        '" value="" ' +
        this.isRequired(obj).req +
        ' autocomplete="off"></textarea>' +
        "</div>";
    } else {
      html =
        '<div class="sameRoot inbox ' +
        obj.outClass +
        '">' +
        "<p>" +
        obj.text +
        "</p>" +
        '<textarea class="' +
        obj.innerClass +
        '" readonly="readonly" id="' +
        obj.id +
        str +
        '"></textarea>' +
        "</div>";
    }
    return html;
  },
  date: function(obj, str) {
    var html = "";
    if (str == "") {
      html =
        '<div class="sameRoot about-data ' +
        obj.outClass +
        '">' +
        '<div class="inbox" id="item-' +
        obj.id +
        '">' +
        "<p>" +
        obj.text +
        " " +
        this.isRequired(obj).reqText +
        "</p>" +
        '<input type="' +
        obj.valueType +
        '" name="' +
        obj.name +
        '" data-type="' +
        obj.valueType +
        '" placeholder="点击此处, 选择日期" id="' +
        obj.id +
        '">' +
        "</div>" +
        "</div>";
    } else {
      html =
        '<div class="sameRoot inbox ' +
        obj.outClass +
        '">' +
        "<p>" +
        obj.text +
        "</p>" +
        '<input type="text" readonly="readonly" id="' +
        obj.id +
        str +
        '" />' +
        "</div>";
    }
    return html;
  },
  img: function(obj, str) {
    var html = "";
    if (str == "") {
      html =
        '<div class="sameRoot inbox ' +
        obj.outClass +
        '" id="item-location">' +
        "<p>" +
        obj.text +
        " " +
        this.isRequired(obj).reqText +
        "</p>" +
        '<div class="mapbox clearfix row">' +
        '<div class="fleft ' +
        obj.innerClass +
        '">' +
        '<p id="locationHint">点击右侧按钮开始定位</p>' +
        '<img src="" id="' +
        obj.id +
        '" />' +
        "</div>" +
        '<div class="fleft mapbtn">' +
        '<i class="iconfont" id="position">&#xe600;</i>' +
        '<i class="iconfont" id="resetPosition">&#xe6a3;</i>' +
        "</div>" +
        "</div>" +
        "</div>";
    } else {
      html =
        '<div class="sameRoot inbox ' +
        obj.outClass +
        '">' +
        "<p>" +
        obj.text +
        "</p>" +
        '<div class="mapbox clearfix">' +
        '<div class="fleft ' +
        obj.innerClass +
        ' demapimg">' +
        '<img src="" id="' +
        obj.id +
        str +
        '" />' +
        "</div>" +
        "</div>" +
        "</div>";
    }
    return html;
  },
  dealer: function(obj, str) {
    var html = "";
    if (str == "") {
      html =
        '<div class="sameRoot list-block' +
        obj.outClass +
        '">' +
        "<ul>" +
        '<li id="item-' +
        obj.id +
        '">' +
        '<a href="#" class="item-link dealer-select" dealerLevel="' +
        obj.dealerLevel +
        '" regionId="' +
        obj.regionId +
        '">' +
        '<div class="item-content">' +
        '<div class="item-inner">' +
        '<div class="item-title">' +
        obj.text +
        " " +
        this.isRequired(obj).reqText +
        "</div>" +
        '<div class="item-after dealer-select-value" id="item-after-' +
        obj.id +
        '">请选择</div>' +
        "</div>" +
        "</div>" +
        '<select name="' +
        obj.text +
        '" data-type="' +
        obj.valueType +
        '" class="sss-' +
        obj.id +
        '" id="' +
        obj.id +
        '">' +
        "</select>" +
        "</a>" +
        "</li>" +
        "</ul>" +
        "</div>";
    } else {
      html =
        '<div class="sameRoot list-block ' +
        obj.outClass +
        '">' +
        "<ul>" +
        '<li class="item-content">' +
        '<div class="item-inner">' +
        '<div class="item-title">' +
        obj.text +
        "</div>" +
        '<div class="after" id="' +
        obj.id +
        str +
        '"></div>' +
        "</div>" +
        "</li>" +
        "</ul>" +
        "</div>";
    }
    return html;
  },
  isRequired: function(obj) {
    var valid = {
      req: "",
      reqText: ""
    };
    if (obj.required) {
      valid.req = 'required="required"';
      valid.reqText = '<span class="required">*</span>';
    }
    return valid;
  }
};
//网点字段
var mainField = [
  {
    text: "网点编号",
    type: "I",
    required: false,
    name: "code",
    outClass: "backgrey",
    innerClass: "disabled",
    id: "code",
    valueType: "text",
    placeholder: "系统自动产生"
  },
  {
    text: "对象类型",
    type: "S",
    required: true,
    name: "type",
    outClass: "",
    innerClass: "",
    id: "type",
    valueType: "select"
  },
  {
    text: "网点类型",
    type: "S",
    required: true,
    name: "scope",
    outClass: "",
    innerClass: "",
    id: "scope",
    valueType: "select"
  },
  {
    text: "网点名称",
    type: "I",
    required: true,
    name: "name",
    outClass: "",
    innerClass: "",
    id: "name",
    valueType: "text",
    placeholder: ""
  },
  {
    text: "GPS位置",
    type: "P",
    required: true,
    name: "location",
    outClass: "mappos",
    innerClass: "mapimg",
    id: "location",
    valueType: "text"
  },
  {
    text: "网点地址",
    type: "T",
    required: true,
    name: "address",
    outClass: "",
    innerClass: "",
    id: "address",
    valueType: "text",
    placeholder: ""
  },
  {
    text: "省/直辖市",
    type: "S",
    required: true,
    name: "province",
    outClass: "",
    innerClass: "",
    id: "province",
    valueType: "select"
  },
  {
    text: "城市",
    type: "S",
    required: true,
    name: "city",
    outClass: "",
    innerClass: "",
    id: "city",
    valueType: "select"
  },
  {
    text: "区/县",
    type: "S",
    required: true,
    name: "region",
    outClass: "",
    innerClass: "",
    id: "region",
    valueType: "select"
  },
  {
    text: "邮编",
    type: "I",
    required: false,
    name: "postalCode",
    outClass: "",
    innerClass: "",
    id: "postalCode",
    valueType: "number",
    placeholder: ""
  },
  {
    text: "开关店状态",
    type: "S",
    required: true,
    name: "state",
    outClass: "",
    innerClass: "",
    id: "state",
    valueType: "select"
  },
  {
    text: "最近关店时间",
    type: "D",
    required: false,
    name: "lastClosedTimestamp",
    outClass: "",
    innerClass: "",
    id: "lastClosedTimestamp",
    valueType: "date",
    placeholder: "点击选择即将重开日期"
  },
  {
    text: "重开日期",
    type: "D",
    required: true,
    name: "reopenTimestamp",
    outClass: "disnone",
    innerClass: "",
    id: "reopenTimestamp",
    valueType: "date",
    placeholder: "点击选择即将重开日期"
  },
  {
    text: "二批类别",
    type: "S",
    required: false,
    name: "dealerType",
    outClass: "",
    innerClass: "",
    id: "dealerType",
    valueType: "select"
  },
  {
    text: "EOE执行人",
    type: "I",
    required: false,
    name: "eoeExecutor",
    outClass: "",
    innerClass: "",
    id: "eoeExecutor",
    valueType: "text",
    placeholder: ""
  },
  {
    text: "SIS网点归属人",
    type: "I",
    required: true,
    name: "sisOwner;",
    outClass: "",
    innerClass: "",
    id: "sisOwner;",
    valueType: "text",
    placeholder: ""
  },
  {
    text: "1p经销商",
    type: "C",
    required: true,
    name: "wholesaler",
    outClass: "",
    innerClass: "",
    id: "wholesaler",
    valueType: "select",
    dealerLevel: "1",
    regionId: ""
  },
  {
    text: "1p备用经销商",
    type: "C",
    required: false,
    name: "substituteWholesaler",
    outClass: "",
    innerClass: "",
    id: "substituteWholesaler",
    valueType: "select",
    dealerLevel: "1",
    regionId: ""
  },
  {
    text: "2p经销商",
    type: "C",
    required: false,
    name: "dealer",
    outClass: "",
    innerClass: "",
    id: "dealer",
    valueType: "select",
    dealerLevel: "2",
    regionId: ""
  },
  {
    text: "网点负责人（老板）",
    type: "I",
    required: false,
    name: "owner",
    outClass: "",
    innerClass: "",
    id: "owner",
    valueType: "text",
    placeholder: ""
  },
  {
    text: "网点负责人（店长）",
    type: "I",
    required: true,
    name: "contactPerson",
    outClass: "",
    innerClass: "",
    id: "contactPerson",
    valueType: "text",
    placeholder: ""
  },
  {
    text: "网点负责人联系电话",
    type: "I",
    required: true,
    name: "mobileOrTel",
    outClass: "",
    innerClass: "",
    id: "mobileOrTel",
    valueType: "number",
    placeholder: ""
  },
  {
    text: "网点负责人办公室电话",
    type: "I",
    required: false,
    name: "telephone",
    outClass: "",
    innerClass: "",
    id: "telephone",
    valueType: "number",
    placeholder: ""
  },
  {
    text: "EOE标准渠道",
    type: "S",
    required: true,
    name: "channel",
    outClass: "",
    innerClass: "",
    id: "channel",
    valueType: "select"
  },
  {
    text: "拜访频率",
    type: "S",
    required: false,
    name: "visitFrequency",
    outClass: "",
    innerClass: "",
    id: "visitFrequency",
    valueType: "select"
  },
  {
    text: "(区块)人流量",
    type: "S",
    required: true,
    name: "demographicRegion",
    outClass: "",
    innerClass: "",
    id: "demographicRegion",
    valueType: "select"
  },
  {
    text: "网点等级",
    type: "S",
    required: false,
    name: "classification",
    outClass: "",
    innerClass: "",
    id: "classification",
    valueType: "select"
  },
  {
    text: "网点分类",
    type: "S",
    required: false,
    name: "clazz",
    outClass: "",
    innerClass: "",
    id: "clazz",
    valueType: "select"
  },
  {
    text: "是否连锁店",
    type: "S",
    required: false,
    name: "chain",
    outClass: "",
    innerClass: "",
    id: "chain",
    valueType: "select"
  },
  {
    text: "喜力PG数量",
    type: "I",
    required: false,
    name: "pgNumber",
    outClass: "",
    innerClass: "",
    id: "pgNumber",
    valueType: "number",
    placeholder: ""
  },
  {
    text: "人均消费",
    type: "I",
    required: false,
    name: "averageConsumption",
    outClass: "",
    innerClass: "",
    id: "averageConsumption",
    valueType: "number",
    placeholder: ""
  },
  {
    text: "冰箱数量",
    type: "I",
    required: false,
    name: "fridgeNumber",
    outClass: "",
    innerClass: "",
    id: "fridgeNumber",
    valueType: "number",
    placeholder: ""
  },
  {
    text: "桶啤机数量",
    type: "I",
    required: false,
    name: "dbiNumber",
    outClass: "",
    innerClass: "",
    id: "dbiNumber",
    valueType: "number",
    placeholder: ""
  },
  {
    text: "网点合约类型",
    type: "S",
    required: false,
    name: "contractType",
    outClass: "",
    innerClass: "",
    id: "contractType",
    valueType: "select"
  },
  {
    text: "网点体量",
    type: "I",
    required: false,
    name: "totalVolume",
    outClass: "",
    innerClass: "",
    id: "totalVolume",
    valueType: "text",
    placeholder: ""
  },
  {
    text: "店的规模 面积",
    type: "I",
    required: false,
    name: "scaleSpace",
    outClass: "",
    innerClass: "",
    id: "scaleSpace",
    valueType: "number",
    placeholder: ""
  },
  {
    text: "店的规模 桌数",
    type: "I",
    required: false,
    name: "scaleTableNumber",
    outClass: "",
    innerClass: "",
    id: "scaleTableNumber",
    valueType: "number",
    placeholder: ""
  },
  {
    text: "店的规模 包厢或卡数",
    type: "I",
    required: false,
    name: "scaleBoxNumber",
    outClass: "",
    innerClass: "",
    id: "scaleBoxNumber",
    valueType: "number",
    placeholder: ""
  },
  {
    text: "店的规模 收银台数",
    type: "I",
    required: false,
    name: "scaleCashierNumber",
    outClass: "",
    innerClass: "",
    id: "scaleCashierNumber",
    valueType: "number",
    placeholder: ""
  }
];

var formVal = {
  address: "上海市徐汇区钦州北路1066号钦汇园",
  averageConsumption: {id:1,name:"1-50"},
  boss: "boss",
  chain: {id:2,name:"否"},
  channel: {id:1,name:"渠道"},
  city: {id:1,name:"上海"},
  dbiNumber: 121,
  dealer1p: {id:1,name:"1-50"},
  dealer2p: {id:1,name:"1-50"},
  duixiangType: {id:1,name:"1-50"},
  fridgeNumber: 22,
  latitude: "121.096532",
  longitude: "136.987654",
  mobile: 13414152345,
  outletCode: "001",
  outletName: "测试网点",
  pgNumber: 22,
  phone: 02134372345,
  postCode: "432416",
  province: {id:1,name:"上海"},
  region: {id:1,name:"1徐汇区"},
  reopenTimestamp: 1519747200000,
  scaleBoxNumber: 34,
  scaleCashierNumber: 44,
  scaleSpace: "1212",
  scaleTableNumber: 55,
  shopkeeper: "shop",
  standbyDealer1p: {id:1,name:"1-50"},
  state: {id:1,name:"正常"},
  totalVolume: "1000",
  traffic: {id:1,name:"10-50"}
};
var newFormVal = {
  averageConsumption: {id:2,name:"50-100"},
  boss: "dd",
  dbiNumber: 345,
  latitude: "121.043532",
  longitude: "136.187654"
};


