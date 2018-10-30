var field = {
  create: function(str) {
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
        default:
          html += returnHtml.input(e, str);
          break;
      }
    });
    $("#baseField" + str).append(html);
  },
  display: function(obj, str) {
    str = str == undefined ? "" : str;
    var w = $("#mapWidth").attr("data-width");
    mainField.forEach(e => {
      if (e.type == "P") {
        var lng = obj.hasOwnProperty("longitude") && obj.longitude != "";
        var lat = obj.hasOwnProperty("latitude") && obj.latitude != "";
        if (lng && lat) {
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
          $("#" + e.id + str).attr({
            src: mapSrc,
            lat: obj.latitude,
            lng: obj.longitude
          });
        }
      }
      if (e.type == "I" || e.type == "T") {
        if (obj.hasOwnProperty(e.id)) {
          $("#" + e.id + str).val(obj[e.id]);
        }
      }
      if (e.type == "S") {
        if (obj.hasOwnProperty(e.id)) {
          var selectVal = obj[e.id].id == undefined ? obj[e.id] : obj[e.id].id;
          $("#" + e.id + str).val(selectVal);
        }
      }
      if (e.type == "C") {
        if (obj.hasOwnProperty(e.id)) {
          $("#" + e.id + str)
            .val(obj[e.id].code + " - " + obj[e.id].name)
            .attr("dealerId", obj[e.id].id);
        }
      }
      if (e.type == "D") {
        if (obj.hasOwnProperty(e.id)) {
          $("#" + e.id + str).val(timestamp2String(obj[e.id]));
        }
      }
    });
  },
  showRevisedOutlet: function(obj, str) {
    var map = {};
    for (var nf in obj) {
      var val = obj[nf];
      if (typeof val != "object") {
        if (nf == "latitude" || nf == "longitude") {
          map[nf] = val;
          showMap(map, str);
        } else if (nf == "reopenTimestamp" || nf == "lastClosedTimestamp") {
          $("#" + nf + str)
            .val(timestamp2String(val))
            .parents(".sameRoot")
            .addClass("compareRed");
        } else {
          $("#" + nf + str)
            .val(val)
            .parents(".sameRoot")
            .addClass("compareRed");
        }
      } else {
        if (
          nf == "wholesaler" ||
          nf == "substituteWholesaler" ||
          nf == "dealer"
        ) {
          $("#" + nf + str)
            .val(val.code + " " + val.name)
            .attr("dealerId", val.id)
            .parents(".sameRoot")
            .addClass("compareRed");
        } else {
          $("#" + nf + str)
            .val(val.id)
            .parents(".sameRoot")
            .addClass("compareRed");
        }
      }
    }
  },
  collect: function(str) {
    var outletData = {};
    mainField.forEach(e => {
      if (e.type == "P") {
        var lat = $("#" + e.id + str).attr("lat");
        var lng = $("#" + e.id + str).attr("lng");
        outletData.latitude = lat;
        outletData.longitude = lng;
      } else if (e.type == "C") {
        var v = $("#" + e.id + str).attr("dealerId");
        if (v != "" && v != undefined) {
          outletData[e.name + "Id"] = parseInt(v);
        }
      } else {
        var v = $("#" + e.id + str).val();
        if (v != "") {
          var objName = e.valueType == "select" ? e.name + "Id" : e.name;
          if (e.name == "cityCode") {
            outletData[e.name] = returnValue(e, v);
          } else {
            outletData[objName] = returnValue(e, v);
          }
        }
      }
    });
    return outletData;
  }
};
//返回拿到的数据
function returnValue(e, v) {
  var val = "";
  if (e.type == "I" || e.type == "T") {
    val = e.valueType == "number" ? parseInt(v) : v;
  }
  if (e.type == "D") {
    val = Date.parse(v);
  }
  if (e.type == "S") {
    if (e.name == "cityCode") {
      val = v;
    } else {
      val = parseInt(v);
    }
  }
  return val;
}
//显示地图 审批时
function showMap(map, str) {
  var w = $("#mapWidth").attr("data-width");
  var mapSrc =
    "http://restapi.amap.com/v3/staticmap?location=" +
    map.longitude +
    "," +
    map.latitude +
    "&zoom=14&size=" +
    w +
    "*200&markers=large,,:" +
    map.longitude +
    "," +
    map.latitude +
    "&key=b2a701a4c4e88acd8fac16bbf402484f";
  $("#location" + str)
    .attr({
      src: mapSrc,
      lat: map.latitude,
      lng: map.longitude
    })
    .parents(".sameRoot")
    .addClass("compareRed");
  $("#address" + str)
    .parents(".sameRoot")
    .addClass("compareRed");
  $("#province" + str)
    .parents(".sameRoot")
    .addClass("compareRed");
  $("#city" + str)
    .parents(".sameRoot")
    .addClass("compareRed");
  $("#region" + str)
    .parents(".sameRoot")
    .addClass("compareRed");
}

var returnHtml = {
  input: function(obj, str) {
    var colClass = str == "Left" || str == "Right" ? "col-md-12" : "col-md-4";
    var html =
      '<div class="sameRoot ' +
      colClass +
      " " +
      obj.outClass +
      '">' +
      "<p>" +
      obj.text +
      this.isRequired(obj).reqText +
      "</p>" +
      '<input id="' +
      obj.id +
      str +
      '" name="' +
      obj.name +
      '" class="' +
      obj.innerClass +
      '" type="' +
      obj.valueType +
      '" ' +
      this.isRequired(obj).req +
      " disabled/>" +
      "</div>";
    return html;
  },
  select: function(obj, str) {
    var colClass = str == "Left" || str == "Right" ? "col-md-12" : "col-md-4";
    var html =
      '<div class="sameRoot ' +
      colClass +
      " " +
      obj.outClass +
      '">' +
      "<p>" +
      obj.text +
      this.isRequired(obj).reqText +
      "</p>" +
      '<select id="' +
      obj.id +
      str +
      '" name="' +
      obj.name +
      '" class="' +
      obj.innerClass +
      '" ' +
      this.isRequired(obj).req +
      " disabled>" +
      "</select>" +
      "</div>";
    return html;
  },
  textarea: function(obj, str) {
    var html =
      '<div class="sameRoot col-md-12 ' +
      obj.outClass +
      '">' +
      "<p>" +
      obj.text +
      this.isRequired(obj).reqText +
      "</p>" +
      '<textarea id="' +
      obj.id +
      str +
      '" name="' +
      obj.name +
      '" ' +
      this.isRequired(obj).req +
      " disabled/>" +
      "</textarea></div>";
    return html;
  },
  date: function(obj, str) {
    var colClass = str == "Left" || str == "Right" ? "col-md-12" : "col-md-4";
    var html =
      '<div class="sameRoot ' +
      colClass +
      " " +
      obj.outClass +
      '">' +
      "<p>" +
      obj.text +
      this.isRequired(obj).reqText +
      "</p>" +
      '<div class="input-group date ' +
      obj.innerClass +
      '">' +
      '<input type="text" class="form-control" id="' +
      obj.id +
      str +
      '" name="' +
      obj.name +
      '" />' +
      '<span class="input-group-addon">' +
      '<span class="glyphicon glyphicon-calendar"></span>' +
      "</span>" +
      "</div>" +
      "</div>";
    return html;
  },
  img: function(obj, str) {
    var html =
      '<div class="sameRoot col-md-12 ' +
      obj.outClass +
      '">' +
      "<p>" +
      obj.text +
      this.isRequired(obj).reqText +
      "</p>" +
      '<img src="" id="' +
      obj.id +
      str +
      '" name="' +
      obj.name +
      '" class="' +
      obj.innerClass +
      '" alt="" />' +
      "</div>";
    return html;
  },
  isRequired: function(obj) {
    var valid = {
      req: "",
      reqText: ""
    };
    if (obj.required) {
      valid.req = "required";
      valid.reqText = " <span class='torequired'>*</span>";
    }
    return valid;
  }
};

var mainField = [
  {
    text: "编号",
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
    required: false,
    name: "type",
    outClass: "",
    innerClass: "",
    id: "type",
    valueType: "select"
  },
  {
    text: "名称",
    type: "I",
    required: false,
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
    required: false,
    name: "location",
    outClass: "mappos",
    innerClass: "mapimg",
    id: "location",
    valueType: "text"
  },
  {
    text: "地址",
    type: "T",
    required: false,
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
    required: false,
    name: "province",
    outClass: "",
    innerClass: "",
    id: "province",
    valueType: "select"
  },
  {
    text: "城市",
    type: "S",
    required: false,
    name: "city",
    outClass: "",
    innerClass: "",
    id: "city",
    valueType: "select"
  },
  {
    text: "区/县",
    type: "S",
    required: false,
    name: "region",
    outClass: "",
    innerClass: "",
    id: "region",
    valueType: "select"
  },
  {
    text: "城市编号",
    type: "S",
    required: true,
    name: "cityCode",
    outClass: "",
    innerClass: "",
    id: "cityCode",
    valueType: "select"
  },
  {
    text: "类型",
    type: "S",
    required: false,
    name: "scope",
    outClass: "",
    innerClass: "",
    id: "scope",
    valueType: "select"
  },
  {
    text: "状态",
    type: "S",
    required: false,
    name: "state",
    outClass: "",
    innerClass: "",
    id: "state",
    valueType: "select"
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
    text: "最近关店时间",
    type: "D",
    required: false,
    name: "lastClosedTimestamp",
    outClass: "disabled",
    innerClass: "",
    id: "lastClosedTimestamp",
    valueType: "date",
    placeholder: "点击选择即将重开日期"
  },
  {
    text: "重开日期",
    type: "D",
    required: false,
    name: "reopenTimestamp",
    outClass: "disabled",
    innerClass: "",
    id: "reopenTimestamp",
    valueType: "date",
    placeholder: "点击选择即将重开日期"
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
    text: "1P经销商",
    type: "C",
    required: false,
    name: "wholesaler",
    outClass: "dealerOnly",
    innerClass: "",
    id: "wholesaler",
    valueType: "text",
    placeholder: ""
  },
  {
    text: "备用1P经销商",
    type: "C",
    required: false,
    name: "substituteWholesaler",
    outClass: "dealerOnly",
    innerClass: "",
    id: "substituteWholesaler",
    valueType: "text",
    placeholder: ""
  },
  {
    text: "2P经销商",
    type: "C",
    required: false,
    name: "dealer",
    outClass: "dealerOnly",
    innerClass: "",
    id: "dealer",
    valueType: "text",
    placeholder: ""
  },
  {
    text: "老板",
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
    text: "联系人",
    type: "I",
    required: false,
    name: "contactPerson",
    outClass: "",
    innerClass: "",
    id: "contactPerson",
    valueType: "text",
    placeholder: ""
  },
  {
    text: "联系人电话",
    type: "I",
    required: false,
    name: "mobileOrTel",
    outClass: "",
    innerClass: "",
    id: "mobileOrTel",
    valueType: "tel",
    placeholder: ""
  },
  {
    text: "办公室电话",
    type: "I",
    required: false,
    name: "telephone",
    outClass: "",
    innerClass: "",
    id: "telephone",
    valueType: "tel",
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
    text: "区块",
    type: "S",
    required: false,
    name: "demographicRegion",
    outClass: "",
    innerClass: "",
    id: "demographicRegion",
    valueType: "select"
  },
  {
    text: "等级",
    type: "S",
    required: false,
    name: "classification",
    outClass: "",
    innerClass: "",
    id: "classification",
    valueType: "select"
  },
  {
    text: "分类",
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
    text: "合约类型",
    type: "S",
    required: false,
    name: "contractType",
    outClass: "",
    innerClass: "",
    id: "contractType",
    valueType: "select"
  },
  {
    text: "体量",
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
    text: "店的规模 包厢或卡座",
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
