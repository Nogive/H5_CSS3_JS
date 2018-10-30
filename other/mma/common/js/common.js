/* js error monitor */
!(function(c, b, d, a) {
  c[a] || (c[a] = {});
  c[a].config = {
    pid: "jk5r@7a40c1fb1cf70da",
    imgUrl: "https://arms-retcode.aliyuncs.com/r.png?"
  };
  with (b)
    with (body)
      with (insertBefore(createElement("script"), firstChild))
        setAttribute("crossorigin", "", (src = d));
})(window, document, "https://retcode.alicdn.com/retcode/bl.js", "__bl");

/* Generated from Java, Don't edit these codes. START */
var com;
(function(com) {
  var maimang;
  (function(maimang) {
    var mjp;
    (function(mjp) {
      var utils;
      (function(utils) {
        /**
         * Constants shared by mobile h5, web and backend server, use jsweet to translate this java file to
         * js file
         * @class
         */
        var CommonConstant = (function() {
          function CommonConstant() {}
          return CommonConstant;
        })();
        utils.CommonConstant = CommonConstant;
        CommonConstant["__class"] = "com.maimang.mjp.utils.CommonConstant";
        (function(CommonConstant) {
          var API_CODE = (function() {
            function API_CODE() {}
            return API_CODE;
          })();
          API_CODE.OK = 0;
          API_CODE.GENERAL_ERR = 1;
          API_CODE.INTERNAL_ERR = 2;
          API_CODE.AUTH_INVALID_ACCOUNT = 1001;
          API_CODE.AUTH_FAILED = 1002;
          API_CODE.AUTH_FORBIDDEN = 1003;
          API_CODE.AUTH_INACTIVE_ACCOUNT = 1004;
          API_CODE.OUTLET_MODIFIED = 1101;
          API_CODE.OUTLET_UNDER_APPROVING = 1102;
          API_CODE.OUTLET_NO_FIELD_MODIFIED = 1103;
          API_CODE.OUTLET_WRONG_STATE = 1104;
          API_CODE.OUTLET_INVALID_STAFF = 1105;
          API_CODE.PLAN_WRONG_STATE = 1201;
          API_CODE.STAFF_UNDER_BINDING = 1301;
          API_CODE.STAFF_CONTAIN_CHILDREN = 1302;
          API_CODE.STAFF_HAS_PREMVO = 1303;
          API_CODE.STAFF_HAS_MVO = 1304;
          API_CODE.STAFF_HAS_PENDING_MVO = 1305;
          API_CODE.STAFF_HAS_UNDER_APPROVING = 1306;
          API_CODE.STAFF_DATA_SCOPE_OVERLAPPING = 1307;
          CommonConstant.API_CODE = API_CODE;
          API_CODE["__class"] = "com.maimang.mjp.utils.CommonConstant.API_CODE";
          var ROLE = (function() {
            function ROLE() {}
            return ROLE;
          })();
          ROLE.SR = 10;
          ROLE.SS = 20;
          ROLE.ASM = 30;
          ROLE.RSM = 40;
          ROLE.GM = 50;
          ROLE.MD = 60;
          ROLE.COMMON_ROLE_BASE = 1000;
          ROLE.ADMIN = 1001;
          ROLE.SA = 1010;
          ROLE.MDM = 1020;
          ROLE.MVO_MANAGER = 1030;
          CommonConstant.ROLE = ROLE;
          ROLE["__class"] = "com.maimang.mjp.utils.CommonConstant.ROLE";
          var OUTLET_APPROVING_STATE = (function() {
            function OUTLET_APPROVING_STATE() {}
            return OUTLET_APPROVING_STATE;
          })();
          OUTLET_APPROVING_STATE.NONE = 0;
          OUTLET_APPROVING_STATE.ONGOING = 1;
          OUTLET_APPROVING_STATE.DENIED = 2;
          OUTLET_APPROVING_STATE.APPROVED = 3;
          CommonConstant.OUTLET_APPROVING_STATE = OUTLET_APPROVING_STATE;
          OUTLET_APPROVING_STATE["__class"] =
            "com.maimang.mjp.utils.CommonConstant.OUTLET_APPROVING_STATE";
          var OUTLET_STATE = (function() {
            function OUTLET_STATE() {}
            return OUTLET_STATE;
          })();
          OUTLET_STATE.OPEN = 1;
          OUTLET_STATE.PAUSE = 3;
          CommonConstant.OUTLET_STATE = OUTLET_STATE;
          OUTLET_STATE["__class"] =
            "com.maimang.mjp.utils.CommonConstant.OUTLET_STATE";
          var OUTLET_SCOPE = (function() {
            function OUTLET_SCOPE() {}
            return OUTLET_SCOPE;
          })();
          OUTLET_SCOPE.UO = 1;
          OUTLET_SCOPE.TUO = 2;
          OUTLET_SCOPE.MVO = 3;
          CommonConstant.OUTLET_SCOPE = OUTLET_SCOPE;
          OUTLET_SCOPE["__class"] =
            "com.maimang.mjp.utils.CommonConstant.OUTLET_SCOPE";
          var OUTLET_VISIT_FREQUENCY = (function() {
            function OUTLET_VISIT_FREQUENCY() {}
            return OUTLET_VISIT_FREQUENCY;
          })();
          OUTLET_VISIT_FREQUENCY.V1PM = 1;
          OUTLET_VISIT_FREQUENCY.V2PM = 2;
          OUTLET_VISIT_FREQUENCY.V4PM = 3;
          CommonConstant.OUTLET_VISIT_FREQUENCY = OUTLET_VISIT_FREQUENCY;
          OUTLET_VISIT_FREQUENCY["__class"] =
            "com.maimang.mjp.utils.CommonConstant.OUTLET_VISIT_FREQUENCY";
          var OUTLET_TYPE = (function() {
            function OUTLET_TYPE() {}
            return OUTLET_TYPE;
          })();
          OUTLET_TYPE.TYPE_OUTLET = 1;
          OUTLET_TYPE.TYPE_2P = 2;
          CommonConstant.OUTLET_TYPE = OUTLET_TYPE;
          OUTLET_TYPE["__class"] =
            "com.maimang.mjp.utils.CommonConstant.OUTLET_TYPE";
          var MESSAGE_TARGET = (function() {
            function MESSAGE_TARGET() {}
            return MESSAGE_TARGET;
          })();
          MESSAGE_TARGET.OUTLET = 1;
          MESSAGE_TARGET.PLAN = 2;
          MESSAGE_TARGET.SYSTEM = 3;
          CommonConstant.MESSAGE_TARGET = MESSAGE_TARGET;
          MESSAGE_TARGET["__class"] =
            "com.maimang.mjp.utils.CommonConstant.MESSAGE_TARGET";
          var DEALER_LEVEL = (function() {
            function DEALER_LEVEL() {}
            return DEALER_LEVEL;
          })();
          DEALER_LEVEL.LEVEL_1P = 1;
          DEALER_LEVEL.LEVEL_2P = 2;
          CommonConstant.DEALER_LEVEL = DEALER_LEVEL;
          DEALER_LEVEL["__class"] =
            "com.maimang.mjp.utils.CommonConstant.DEALER_LEVEL";
          var Province = (function() {
            function Province() {}
            return Province;
          })();
          Province.HAINAN = 460000;
          CommonConstant.Province = Province;
          Province["__class"] = "com.maimang.mjp.utils.CommonConstant.Province";
          var Channel = (function() {
            function Channel() {}
            return Channel;
          })();
          Channel.L5_DISTRIBUTOR = 99;
          Channel.L5_HAINAN_DISTRIBUTOR = 100;
          CommonConstant.Channel = Channel;
          Channel["__class"] = "com.maimang.mjp.utils.CommonConstant.Channel";
          var API_URL = (function() {
            function API_URL(api) {
              if (this.api === undefined) this.api = null;
              this.api = api;
            }
            API_URL.AUTHENTICATION_$LI$ = function() {
              if (API_URL.AUTHENTICATION == null)
                API_URL.AUTHENTICATION = new CommonConstant.API_URL(
                  "authentication"
                );
              return API_URL.AUTHENTICATION;
            };
            API_URL.PRE_MVO_LIST_$LI$ = function() {
              if (API_URL.PRE_MVO_LIST == null)
                API_URL.PRE_MVO_LIST = new CommonConstant.API_URL(
                  "outlets/premvo"
                );
              return API_URL.PRE_MVO_LIST;
            };
            API_URL.MVO_LIST_$LI$ = function() {
              if (API_URL.MVO_LIST == null)
                API_URL.MVO_LIST = new CommonConstant.API_URL("outlets/mvo");
              return API_URL.MVO_LIST;
            };
            API_URL.PENDING_MVO_LIST_$LI$ = function() {
              if (API_URL.PENDING_MVO_LIST == null)
                API_URL.PENDING_MVO_LIST = new CommonConstant.API_URL(
                  "outlets/pendingmvo"
                );
              return API_URL.PENDING_MVO_LIST;
            };
            API_URL.PENDING_MVO_DETAIL_$LI$ = function() {
              if (API_URL.PENDING_MVO_DETAIL == null)
                API_URL.PENDING_MVO_DETAIL = new CommonConstant.API_URL(
                  "outlets/pendingmvodetail"
                );
              return API_URL.PENDING_MVO_DETAIL;
            };
            API_URL.UNDER_APPROVING_LIST_$LI$ = function() {
              if (API_URL.UNDER_APPROVING_LIST == null)
                API_URL.UNDER_APPROVING_LIST = new CommonConstant.API_URL(
                  "outlets/underapproving"
                );
              return API_URL.UNDER_APPROVING_LIST;
            };
            API_URL.UNDER_APPROVING_DETAIL_$LI$ = function() {
              if (API_URL.UNDER_APPROVING_DETAIL == null)
                API_URL.UNDER_APPROVING_DETAIL = new CommonConstant.API_URL(
                  "outlets/underapprovingdetail"
                );
              return API_URL.UNDER_APPROVING_DETAIL;
            };
            API_URL.OUTLET_DETAIL_RETRIEVAL_$LI$ = function() {
              if (API_URL.OUTLET_DETAIL_RETRIEVAL == null)
                API_URL.OUTLET_DETAIL_RETRIEVAL = new CommonConstant.API_URL(
                  "outlets/retrieval"
                );
              return API_URL.OUTLET_DETAIL_RETRIEVAL;
            };
            API_URL.OUTLET_CREATING_$LI$ = function() {
              if (API_URL.OUTLET_CREATING == null)
                API_URL.OUTLET_CREATING = new CommonConstant.API_URL(
                  "outlets/new"
                );
              return API_URL.OUTLET_CREATING;
            };
            API_URL.OUTLET_EDITING_$LI$ = function() {
              if (API_URL.OUTLET_EDITING == null)
                API_URL.OUTLET_EDITING = new CommonConstant.API_URL(
                  "outlets/edit"
                );
              return API_URL.OUTLET_EDITING;
            };
            API_URL.OUTLET_DELETING_$LI$ = function() {
              if (API_URL.OUTLET_DELETING == null)
                API_URL.OUTLET_DELETING = new CommonConstant.API_URL(
                  "outlets/delete"
                );
              return API_URL.OUTLET_DELETING;
            };
            API_URL.OUTLET_BATCH_RETRIEVAL_$LI$ = function() {
              if (API_URL.OUTLET_BATCH_RETRIEVAL == null)
                API_URL.OUTLET_BATCH_RETRIEVAL = new CommonConstant.API_URL(
                  "outlets"
                );
              return API_URL.OUTLET_BATCH_RETRIEVAL;
            };
            API_URL.OUTLET_APPROVAL_$LI$ = function() {
              if (API_URL.OUTLET_APPROVAL == null)
                API_URL.OUTLET_APPROVAL = new CommonConstant.API_URL(
                  "outlets/approval"
                );
              return API_URL.OUTLET_APPROVAL;
            };
            API_URL.OUTLET_ASSIGNATION_$LI$ = function() {
              if (API_URL.OUTLET_ASSIGNATION == null)
                API_URL.OUTLET_ASSIGNATION = new CommonConstant.API_URL(
                  "outlets/assignation"
                );
              return API_URL.OUTLET_ASSIGNATION;
            };
            API_URL.OUTLET_RE_ASSIGNATION_$LI$ = function() {
              if (API_URL.OUTLET_RE_ASSIGNATION == null)
                API_URL.OUTLET_RE_ASSIGNATION = new CommonConstant.API_URL(
                  "outlets/reAssignation"
                );
              return API_URL.OUTLET_RE_ASSIGNATION;
            };
            API_URL.OUTLET_SISOWNER_$LI$ = function() {
              if (API_URL.OUTLET_SISOWNER == null)
                API_URL.OUTLET_SISOWNER = new CommonConstant.API_URL(
                  "outlets/sisOwner"
                );
              return API_URL.OUTLET_SISOWNER;
            };
            API_URL.OUTLET_UO2TUO_$LI$ = function() {
              if (API_URL.OUTLET_UO2TUO == null)
                API_URL.OUTLET_UO2TUO = new CommonConstant.API_URL(
                  "outlets/uo2tuo"
                );
              return API_URL.OUTLET_UO2TUO;
            };
            API_URL.OUTLET_TUO2PMVO_$LI$ = function() {
              if (API_URL.OUTLET_TUO2PMVO == null)
                API_URL.OUTLET_TUO2PMVO = new CommonConstant.API_URL(
                  "outlets/tuo2pmvo"
                );
              return API_URL.OUTLET_TUO2PMVO;
            };
            API_URL.OUTLET_MVO2TUO_$LI$ = function() {
              if (API_URL.OUTLET_MVO2TUO == null)
                API_URL.OUTLET_MVO2TUO = new CommonConstant.API_URL(
                  "outlets/mvo2tuo"
                );
              return API_URL.OUTLET_MVO2TUO;
            };
            API_URL.OUTLET_REVISION_$LI$ = function() {
              if (API_URL.OUTLET_REVISION == null)
                API_URL.OUTLET_REVISION = new CommonConstant.API_URL(
                  "outlets/revision"
                );
              return API_URL.OUTLET_REVISION;
            };
            API_URL.OUTLET_SEARCH_$LI$ = function() {
              if (API_URL.OUTLET_SEARCH == null)
                API_URL.OUTLET_SEARCH = new CommonConstant.API_URL(
                  "outlets/search"
                );
              return API_URL.OUTLET_SEARCH;
            };
            API_URL.MY_MVO_$LI$ = function() {
              if (API_URL.MY_MVO == null)
                API_URL.MY_MVO = new CommonConstant.API_URL("outlets/mymvo");
              return API_URL.MY_MVO;
            };
            API_URL.REGION_SUB_$LI$ = function() {
              if (API_URL.REGION_SUB == null)
                API_URL.REGION_SUB = new CommonConstant.API_URL(
                  "regions/subRegions"
                );
              return API_URL.REGION_SUB;
            };
            API_URL.REGIONS_$LI$ = function() {
              if (API_URL.REGIONS == null)
                API_URL.REGIONS = new CommonConstant.API_URL("regions");
              return API_URL.REGIONS;
            };
            API_URL.REGION_CITY_CODE_$LI$ = function() {
              if (API_URL.REGION_CITY_CODE == null)
                API_URL.REGION_CITY_CODE = new CommonConstant.API_URL(
                  "regions/cityCodes"
                );
              return API_URL.REGION_CITY_CODE;
            };
            API_URL.REGION_PROVINCE_CITY_$LI$ = function() {
              if (API_URL.REGION_PROVINCE_CITY == null)
                API_URL.REGION_PROVINCE_CITY = new CommonConstant.API_URL(
                  "regions/provinceCity"
                );
              return API_URL.REGION_PROVINCE_CITY;
            };
            API_URL.CHANNEL_LEVEL_2_$LI$ = function() {
              if (API_URL.CHANNEL_LEVEL_2 == null)
                API_URL.CHANNEL_LEVEL_2 = new CommonConstant.API_URL(
                  "channels/level2"
                );
              return API_URL.CHANNEL_LEVEL_2;
            };
            API_URL.BASE_DATA_VERSION_$LI$ = function() {
              if (API_URL.BASE_DATA_VERSION == null)
                API_URL.BASE_DATA_VERSION = new CommonConstant.API_URL("base");
              return API_URL.BASE_DATA_VERSION;
            };
            API_URL.BASE_DATA_RETRIEVAL_$LI$ = function() {
              if (API_URL.BASE_DATA_RETRIEVAL == null)
                API_URL.BASE_DATA_RETRIEVAL = new CommonConstant.API_URL(
                  "base/data"
                );
              return API_URL.BASE_DATA_RETRIEVAL;
            };
            API_URL.SURVEY_RETRIEVAL_$LI$ = function() {
              if (API_URL.SURVEY_RETRIEVAL == null)
                API_URL.SURVEY_RETRIEVAL = new CommonConstant.API_URL(
                  "surveys"
                );
              return API_URL.SURVEY_RETRIEVAL;
            };
            API_URL.SURVEY_CREATING_$LI$ = function() {
              if (API_URL.SURVEY_CREATING == null)
                API_URL.SURVEY_CREATING = new CommonConstant.API_URL(
                  "surveys/new"
                );
              return API_URL.SURVEY_CREATING;
            };
            API_URL.SURVEY_TEMPLATE_RETRIEVAL_$LI$ = function() {
              if (API_URL.SURVEY_TEMPLATE_RETRIEVAL == null)
                API_URL.SURVEY_TEMPLATE_RETRIEVAL = new CommonConstant.API_URL(
                  "surveys/templates"
                );
              return API_URL.SURVEY_TEMPLATE_RETRIEVAL;
            };
            API_URL.SURVEY_TEMPLATE_CREATING_$LI$ = function() {
              if (API_URL.SURVEY_TEMPLATE_CREATING == null)
                API_URL.SURVEY_TEMPLATE_CREATING = new CommonConstant.API_URL(
                  "surveys/templates/new"
                );
              return API_URL.SURVEY_TEMPLATE_CREATING;
            };
            API_URL.SURVEY_CLASSIFICATION_CONDITION_$LI$ = function() {
              if (API_URL.SURVEY_CLASSIFICATION_CONDITION == null)
                API_URL.SURVEY_CLASSIFICATION_CONDITION = new CommonConstant.API_URL(
                  "surveys/classification"
                );
              return API_URL.SURVEY_CLASSIFICATION_CONDITION;
            };
            API_URL.SURVEY_CLAZZ_CONDITION_$LI$ = function() {
              if (API_URL.SURVEY_CLAZZ_CONDITION == null)
                API_URL.SURVEY_CLAZZ_CONDITION = new CommonConstant.API_URL(
                  "surveys/clazz"
                );
              return API_URL.SURVEY_CLAZZ_CONDITION;
            };
            API_URL.STAFF_COMMON_RETRIEVAL_$LI$ = function() {
              if (API_URL.STAFF_COMMON_RETRIEVAL == null)
                API_URL.STAFF_COMMON_RETRIEVAL = new CommonConstant.API_URL(
                  "staffs"
                );
              return API_URL.STAFF_COMMON_RETRIEVAL;
            };
            API_URL.STAFF_COMMON_CREATING_$LI$ = function() {
              if (API_URL.STAFF_COMMON_CREATING == null)
                API_URL.STAFF_COMMON_CREATING = new CommonConstant.API_URL(
                  "staffs/new"
                );
              return API_URL.STAFF_COMMON_CREATING;
            };
            API_URL.STAFF_COMMON_EDITING_$LI$ = function() {
              if (API_URL.STAFF_COMMON_EDITING == null)
                API_URL.STAFF_COMMON_EDITING = new CommonConstant.API_URL(
                  "staffs/edit"
                );
              return API_URL.STAFF_COMMON_EDITING;
            };
            API_URL.STAFF_SALES_RETRIEVAL_$LI$ = function() {
              if (API_URL.STAFF_SALES_RETRIEVAL == null)
                API_URL.STAFF_SALES_RETRIEVAL = new CommonConstant.API_URL(
                  "staffs/sales"
                );
              return API_URL.STAFF_SALES_RETRIEVAL;
            };
            API_URL.STAFF_SALES_CREATING_$LI$ = function() {
              if (API_URL.STAFF_SALES_CREATING == null)
                API_URL.STAFF_SALES_CREATING = new CommonConstant.API_URL(
                  "staffs/sales/new"
                );
              return API_URL.STAFF_SALES_CREATING;
            };
            API_URL.STAFF_SALES_EDITING_$LI$ = function() {
              if (API_URL.STAFF_SALES_EDITING == null)
                API_URL.STAFF_SALES_EDITING = new CommonConstant.API_URL(
                  "staffs/sales/edit"
                );
              return API_URL.STAFF_SALES_EDITING;
            };
            API_URL.STAFF_ASSIGNATION_$LI$ = function() {
              if (API_URL.STAFF_ASSIGNATION == null)
                API_URL.STAFF_ASSIGNATION = new CommonConstant.API_URL(
                  "staffs/assignation"
                );
              return API_URL.STAFF_ASSIGNATION;
            };
            API_URL.STAFF_MVO_CANDIDATES_$LI$ = function() {
              if (API_URL.STAFF_MVO_CANDIDATES == null)
                API_URL.STAFF_MVO_CANDIDATES = new CommonConstant.API_URL(
                  "staffs/mvoCandidates"
                );
              return API_URL.STAFF_MVO_CANDIDATES;
            };
            API_URL.STAFF_RETRIEVAL_$LI$ = function() {
              if (API_URL.STAFF_RETRIEVAL == null)
                API_URL.STAFF_RETRIEVAL = new CommonConstant.API_URL(
                  "staffs/retrieving"
                );
              return API_URL.STAFF_RETRIEVAL;
            };
            API_URL.STAFF_REMOVING_$LI$ = function() {
              if (API_URL.STAFF_REMOVING == null)
                API_URL.STAFF_REMOVING = new CommonConstant.API_URL(
                  "staffs/removing"
                );
              return API_URL.STAFF_REMOVING;
            };
            API_URL.EMPLOYEE_RETRIEVAL_$LI$ = function() {
              if (API_URL.EMPLOYEE_RETRIEVAL == null)
                API_URL.EMPLOYEE_RETRIEVAL = new CommonConstant.API_URL(
                  "employees"
                );
              return API_URL.EMPLOYEE_RETRIEVAL;
            };
            API_URL.EMPLOYEE_COMMON_RETRIEVAL_$LI$ = function() {
              if (API_URL.EMPLOYEE_COMMON_RETRIEVAL == null)
                API_URL.EMPLOYEE_COMMON_RETRIEVAL = new CommonConstant.API_URL(
                  "employees/common"
                );
              return API_URL.EMPLOYEE_COMMON_RETRIEVAL;
            };
            API_URL.EMPLOYEE_UNBINDING_RETRIEVAL_$LI$ = function() {
              if (API_URL.EMPLOYEE_UNBINDING_RETRIEVAL == null)
                API_URL.EMPLOYEE_UNBINDING_RETRIEVAL = new CommonConstant.API_URL(
                  "employees/unbinding"
                );
              return API_URL.EMPLOYEE_UNBINDING_RETRIEVAL;
            };
            API_URL.EMPLOYEE_DATA_SCOPE_$LI$ = function() {
              if (API_URL.EMPLOYEE_DATA_SCOPE == null)
                API_URL.EMPLOYEE_DATA_SCOPE = new CommonConstant.API_URL(
                  "employees/dataScopes"
                );
              return API_URL.EMPLOYEE_DATA_SCOPE;
            };
            API_URL.EMPLOYEE_ADDING_$LI$ = function() {
              if (API_URL.EMPLOYEE_ADDING == null)
                API_URL.EMPLOYEE_ADDING = new CommonConstant.API_URL(
                  "employees/adding"
                );
              return API_URL.EMPLOYEE_ADDING;
            };
            API_URL.EMPLOYEE_INACTIVING_$LI$ = function() {
              if (API_URL.EMPLOYEE_INACTIVING == null)
                API_URL.EMPLOYEE_INACTIVING = new CommonConstant.API_URL(
                  "employees/inactiving"
                );
              return API_URL.EMPLOYEE_INACTIVING;
            };
            API_URL.EMPLOYEE_ACTIVE_$LI$ = function() {
              if (API_URL.EMPLOYEE_ACTIVE == null)
                API_URL.EMPLOYEE_ACTIVE = new CommonConstant.API_URL(
                  "employees/active"
                );
              return API_URL.EMPLOYEE_ACTIVE;
            };
            API_URL.EMPLOYEE_ACCOUNT_RETRIEVAL_$LI$ = function() {
              if (API_URL.EMPLOYEE_ACCOUNT_RETRIEVAL == null)
                API_URL.EMPLOYEE_ACCOUNT_RETRIEVAL = new CommonConstant.API_URL(
                  "employees/accounts"
                );
              return API_URL.EMPLOYEE_ACCOUNT_RETRIEVAL;
            };
            API_URL.MESSAGE_RETRIEVAL_$LI$ = function() {
              if (API_URL.MESSAGE_RETRIEVAL == null)
                API_URL.MESSAGE_RETRIEVAL = new CommonConstant.API_URL(
                  "message"
                );
              return API_URL.MESSAGE_RETRIEVAL;
            };
            API_URL.MESSAGE_READING_$LI$ = function() {
              if (API_URL.MESSAGE_READING == null)
                API_URL.MESSAGE_READING = new CommonConstant.API_URL(
                  "message/read"
                );
              return API_URL.MESSAGE_READING;
            };
            API_URL.SETTING_VISITATION_$LI$ = function() {
              if (API_URL.SETTING_VISITATION == null)
                API_URL.SETTING_VISITATION = new CommonConstant.API_URL(
                  "setting/visitation"
                );
              return API_URL.SETTING_VISITATION;
            };
            API_URL.SETTING_VISITATION_CREATING_$LI$ = function() {
              if (API_URL.SETTING_VISITATION_CREATING == null)
                API_URL.SETTING_VISITATION_CREATING = new CommonConstant.API_URL(
                  "setting/visitation/new"
                );
              return API_URL.SETTING_VISITATION_CREATING;
            };
            API_URL.SETTING_WORKDAY_$LI$ = function() {
              if (API_URL.SETTING_WORKDAY == null)
                API_URL.SETTING_WORKDAY = new CommonConstant.API_URL(
                  "setting/workday"
                );
              return API_URL.SETTING_WORKDAY;
            };
            API_URL.SETTING_WORKDAY_UPLOAD_$LI$ = function() {
              if (API_URL.SETTING_WORKDAY_UPLOAD == null)
                API_URL.SETTING_WORKDAY_UPLOAD = new CommonConstant.API_URL(
                  "setting/workday/upload"
                );
              return API_URL.SETTING_WORKDAY_UPLOAD;
            };
            API_URL.DEALER_$LI$ = function() {
              if (API_URL.DEALER == null)
                API_URL.DEALER = new CommonConstant.API_URL("dealers");
              return API_URL.DEALER;
            };
            API_URL.PLAN_$LI$ = function() {
              if (API_URL.PLAN == null)
                API_URL.PLAN = new CommonConstant.API_URL("plans");
              return API_URL.PLAN;
            };
            API_URL.PLAN_CREATING_$LI$ = function() {
              if (API_URL.PLAN_CREATING == null)
                API_URL.PLAN_CREATING = new CommonConstant.API_URL("plans/new");
              return API_URL.PLAN_CREATING;
            };
            API_URL.PLAN_EDITING_$LI$ = function() {
              if (API_URL.PLAN_EDITING == null)
                API_URL.PLAN_EDITING = new CommonConstant.API_URL("plans/edit");
              return API_URL.PLAN_EDITING;
            };
            API_URL.PLAN_APPROVING_$LI$ = function() {
              if (API_URL.PLAN_APPROVING == null)
                API_URL.PLAN_APPROVING = new CommonConstant.API_URL(
                  "plans/approve"
                );
              return API_URL.PLAN_APPROVING;
            };
            API_URL.PLAN_LIST_$LI$ = function() {
              if (API_URL.PLAN_LIST == null)
                API_URL.PLAN_LIST = new CommonConstant.API_URL("plans/list");
              return API_URL.PLAN_LIST;
            };
            API_URL.PLAN_PENDING_LIST_$LI$ = function() {
              if (API_URL.PLAN_PENDING_LIST == null)
                API_URL.PLAN_PENDING_LIST = new CommonConstant.API_URL(
                  "plans/pendingList"
                );
              return API_URL.PLAN_PENDING_LIST;
            };
            API_URL.PLAN_QUERY_BY_OUTLET_$LI$ = function() {
              if (API_URL.PLAN_QUERY_BY_OUTLET == null)
                API_URL.PLAN_QUERY_BY_OUTLET = new CommonConstant.API_URL(
                  "plans/outlet"
                );
              return API_URL.PLAN_QUERY_BY_OUTLET;
            };
            API_URL.PLAN_QUERY_BY_STAFF_$LI$ = function() {
              if (API_URL.PLAN_QUERY_BY_STAFF == null)
                API_URL.PLAN_QUERY_BY_STAFF = new CommonConstant.API_URL(
                  "plans/staff"
                );
              return API_URL.PLAN_QUERY_BY_STAFF;
            };
            API_URL.VERSION_$LI$ = function() {
              if (API_URL.VERSION == null)
                API_URL.VERSION = new CommonConstant.API_URL("versions");
              return API_URL.VERSION;
            };
            /**
             *
             * @return {string}
             */
            API_URL.prototype.toString = function() {
              return this.api;
            };
            API_URL.prototype.compose = function(host) {
              return (
                host +
                "/" +
                API_URL.API_START_PATH +
                "/" +
                API_URL.API_VERSION +
                "/" +
                this.api
              );
            };
            return API_URL;
          })();
          API_URL.API_START_PATH = "api";
          API_URL.API_VERSION = "v1";
          CommonConstant.API_URL = API_URL;
          API_URL["__class"] = "com.maimang.mjp.utils.CommonConstant.API_URL";
        })(
          (CommonConstant = utils.CommonConstant || (utils.CommonConstant = {}))
        );
      })((utils = mjp.utils || (mjp.utils = {})));
    })((mjp = maimang.mjp || (maimang.mjp = {})));
  })((maimang = com.maimang || (com.maimang = {})));
})(com || (com = {}));
com.maimang.mjp.utils.CommonConstant.API_URL.VERSION_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.PLAN_QUERY_BY_STAFF_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.PLAN_QUERY_BY_OUTLET_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.PLAN_PENDING_LIST_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.PLAN_LIST_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.PLAN_APPROVING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.PLAN_EDITING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.PLAN_CREATING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.PLAN_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.DEALER_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.SETTING_WORKDAY_UPLOAD_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.SETTING_WORKDAY_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.SETTING_VISITATION_CREATING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.SETTING_VISITATION_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.MESSAGE_READING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.MESSAGE_RETRIEVAL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.EMPLOYEE_ACCOUNT_RETRIEVAL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.EMPLOYEE_ACTIVE_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.EMPLOYEE_INACTIVING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.EMPLOYEE_ADDING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.EMPLOYEE_DATA_SCOPE_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.EMPLOYEE_UNBINDING_RETRIEVAL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.EMPLOYEE_COMMON_RETRIEVAL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.EMPLOYEE_RETRIEVAL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.STAFF_REMOVING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.STAFF_RETRIEVAL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.STAFF_MVO_CANDIDATES_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.STAFF_ASSIGNATION_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.STAFF_SALES_EDITING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.STAFF_SALES_CREATING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.STAFF_SALES_RETRIEVAL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.STAFF_COMMON_EDITING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.STAFF_COMMON_CREATING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.STAFF_COMMON_RETRIEVAL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.SURVEY_CLAZZ_CONDITION_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.SURVEY_CLASSIFICATION_CONDITION_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.SURVEY_TEMPLATE_CREATING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.SURVEY_TEMPLATE_RETRIEVAL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.SURVEY_CREATING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.SURVEY_RETRIEVAL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.BASE_DATA_RETRIEVAL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.BASE_DATA_VERSION_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.CHANNEL_LEVEL_2_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.REGION_PROVINCE_CITY_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.REGION_CITY_CODE_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.REGIONS_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.REGION_SUB_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.MY_MVO_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_SEARCH_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_REVISION_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_MVO2TUO_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_TUO2PMVO_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_UO2TUO_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_SISOWNER_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_RE_ASSIGNATION_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_ASSIGNATION_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_APPROVAL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_BATCH_RETRIEVAL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_DELETING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_EDITING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_CREATING_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_DETAIL_RETRIEVAL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.UNDER_APPROVING_DETAIL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.UNDER_APPROVING_LIST_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.PENDING_MVO_DETAIL_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.PENDING_MVO_LIST_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.MVO_LIST_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.PRE_MVO_LIST_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.AUTHENTICATION_$LI$();
/* Generated from Java, Don't edit these code. END */

var minorVersion = 1;

var $g = com.maimang.mjp.utils.CommonConstant;
var host = window.location.protocol + "//mjp.waiqin.co"

var storage = {
  //存
  setStorage: function(key, value) {
    window.localStorage.setItem(key, value);
  },
  setSession: function(key, value) {
    window.sessionStorage.setItem(key, value);
  },
  //取
  getStorage: function(key) {
    return window.localStorage.getItem(key);
  },
  getSession: function(key) {
    return window.sessionStorage.getItem(key);
  },
  //清除某个键值
  removeStorage: function(key) {
    window.localStorage.removeItem(key);
  },
  removeSession: function(key) {
    window.sessionStorage.removeItem(key);
  },
  //清除全部的键值
  removeAll: function() {
    window.localStorage.clear();
  },
  removeSessionAll: function() {
    window.sessionStorage.clear();
  }
};
//操作cookie
var cookie = {
  setCookie: function(key, value, expires, path, domain, secure) {
    var cookieText = "";
    expires = expires * 1000 * 60 * 60 * 24;
    var expires_date = new Date(new Date().getTime() + expires);
    cookieText += encodeURIComponent(key) + "=" + encodeURIComponent(value);
    if (expires) {
      cookieText += "; expires=" + expires_date.toGMTString();
    }
    if (path) {
      cookieText += "; path=" + path;
    }
    if (domain) {
      cookieText += "; domain=" + domain;
    }
    if (secure) {
      cookieText += "; secure";
    }
    document.cookie = cookieText;
  },
  getCookie: function(key) {
    var cookieName = encodeURIComponent(key) + "=";
    var cookieStart = document.cookie.indexOf(cookieName);
    var cookieValue = "";
    if (cookieStart > -1) {
      var cookieEnd = document.cookie.indexOf(";", cookieStart);
      if (cookieEnd == -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(
        document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
      );
    }
    return cookieValue;
  },
  clearCookie: function(key) {
    this.setCookie(key, "", -1);
  },
  checkCookie: function(key) {
    var value = this.getCookie(key);
    if (value == "" || value == null) {
      return true;
    } else {
      return false;
    }
  }
};
var ajaxSet = {
  before: function(xhr) {
    xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
  },
  codeError: function(data, text) {
    var msg = text + "发生错误，错误码为：" + data.code;
    showToast(msg);
  },
  noData: function(text) {
    text = text == undefined ? "无法从服务器获取数据" : text;
    showToast(text + "，请联系管理员");
  },
  noDetailData: function() {
    showToast("无法获取详细数据，请联系管理员");
  },
  error: function(xhr) {
    if (xhr.status) {
      showToast("发生网络错误，错误码为：" + xhr.status);
    } else {
      showToast("未知网络错误, 请确保设备处在联网状态");
    }
  }
};
function showToast(text, duration) {
  duration = duration == undefined ? 2000 : duration;
  mjpApp.toast(text, "", { duration: duration }).show();
}
var $$ = Dom7;
var config = {
  headers: { Authorization: cookie.getCookie("token") }
};
var AXIOSCONFIG = {
  headers: { Authorization: cookie.getCookie("token") }
};
//dealer select plugin
Framework7.prototype.plugins.dealerSelect = function(app, params) {
  app.onPageBack("dealer-select", function(page) {
    var p = $$(page.container);
    var a = $$(".dealer-select-active");
    a.removeClass("dealer-select-active");
  });

  app.onPageInit("dealer-select", function(page) {
    mma.setActionMenus(false);
    var p = $$(page.container);
    var a = $$(".dealer-select-active");

    mma.setTitle(a.find(".item-title").text());

    var regionId = a.attr("regionId");
    var level = a.attr("dealerLevel");
    if (level == 2 && (regionId == undefined || regionId <= 0)) {
      app.alert("请先填写省市区", "警告", function() {
        page.view.router.back();
      });
      return;
    }
    var select = a.find("select");
    if (select.val() != "") {
      p
        .find(".dealer-select-page-current-value")
        .html(
          "<h3><span>" +
            select.find('option[value="' + select.val() + '"]').text() +
            "</span></h3>"
        );
    }

    p.on("click", ".toChoose", function() {
      var id = $$(this).attr("id");
      var code = $$(this)
        .find(".item-title")
        .text();
      var name = $$(this)
        .find(".item-after")
        .text();

      select.html(
        '<option value="' + id + '" selected>' + code + " " + name + "</option>"
      );
      a.find(".dealer-select-value").text(code + " " + name);
      optionsList.deleteAllItems();
      optionsList.clearCache();
      optionsList.destroy();
      page.view.router.back();
    });

    var optionsList = app.virtualList(p.find(".virtual-list"), {
      items: [],
      height: 60,
      renderItem: function(index, item) {
        if (item.level == 1) {
          return (
            '<li class="item-content toChoose" id=' +
            item.id +
            ">" +
            '<div class="item-inner row">' +
            '<div class="item-title col-20">' +
            item.code +
            "</div>" +
            '<div class="item-after col-80 textover">' +
            item.name +
            "</div>" +
            "</div>" +
            "</li>"
          );
        } else {
          return (
            '<li class="item-content toChoose" id=' +
            item.id +
            ">" +
            '<div class="item-inner row">' +
            '<div class="item-title col-20">' +
            item.code +
            "</div>" +
            '<div class="item-middle col-30 textover">' +
            item.city +
            "</div>" +
            '<div class="item-after col-50 textover">' +
            item.name +
            "</div>" +
            "</div>" +
            "</li>"
          );
        }
      }
    });

    function retrieveDealer() {
      var query = p.find("input").val();
      var level = a.attr("dealerLevel");
      var regionId = a.attr("regionId");
      if (query != "") {
        app.showPreloader("正在搜索");
        $$.ajax({
          url: $g.API_URL.DEALER.compose(host),
          type: "GET",
          data: {
            id: regionId,
            q: query,
            level: level
          },
          dataType: "json",
          beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
          },
          success: function(data) {
            mjpApp.hidePreloader();
            if (data.code == $g.API_CODE.OK) {
              optionsList.appendItems(data.data);
            } else {
              mjpApp
                .toast("联网搜索出错了, 请稍后再试", "", {
                  duration: 1000
                })
                .show();
            }
          },
          error: function(error) {
            mjpApp.hidePreloader();
            mjpApp
              .toast("联网搜索出错了, 请稍后再试", "", {
                duration: 1000
              })
              .show();
          }
        });
      }
    }

    p.find(".searchBtn").click(function(e) {
      $$(".searches").removeClass("inputfocus");
      retrieveDealer();
    });
    p.find("input").on("search", function(e) {
      $$(".searches").removeClass("inputfocus");
      retrieveDealer();
    });
    p.find("input").on("click", function(e) {
      if (!$$(".searches").hasClass("inputfocus")) {
        $$(".searches").addClass("inputfocus");
      }
    });
    p.find(".resetBtn").click(function(e) {
      p.find("input").val("");
      optionsList.deleteAllItems();
      optionsList.clearCache();
    });
  });

  var selectPageContent =
    '<div data-page="dealer-select" class="page searchPage">' +
    '<form class="searchbar searchbar-init"> ' +
    '<div class="searchbar-input"> ' +
    '<input type="search" placeholder="搜索">' +
    "</div>" +
    "<div class='searches'>" +
    '<a href="#" class="searchSame searchBtn">搜索</a>' +
    '<a href="#" class="searchSame resetBtn">重置</a>' +
    "</div>" +
    "</form>" +
    "<!-- Search Bar overlay -->" +
    '<div class="searchbar-overlay">' +
    "</div>" +
    '<div class="page-content">' +
    '<div class="list-block dealer-select-page-current-value">' +
    "<h3><span>请先搜索, 再选择</span></h3>" +
    "</div>" +
    '<div class="list-block virtual-list">' +
    "</div>" +
    "</div>" +
    "</div>";

  // Handle page init hook
  function handlePageInit(pageData) {
    if (!pageData.name.startsWith("dealer-select")) {
      //init dealer select
      var view = pageData.view;
      $$(pageData.container).on("click", ".dealer-select", function() {
        $$(this).addClass("dealer-select-active");
        view.router.loadContent(selectPageContent);
      });
    }
  }

  // Return hooks
  return {
    hooks: {
      // App init hook
      pageInit: handlePageInit
    }
  };
};

//状态文字转换
function returnStateText(state) {
  var text = "";
  switch (state) {
    case "NO":
      text = "新网点";
      break;
    case "UO":
      text = "全量网点";
      break;
    case "TUO":
      text = "目标网点";
      break;
    case "PMVO":
      text = "待处理网点";
      break;
    case "MVO":
      text = "Mvo";
      break;
  }
  return text;
}
//解析地址栏
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var param = window.location.href.split("?")[1];
  if (param != "" && param != undefined) {
    var r = param.match(reg);
    if (r != null) return unescape(r[2]);
  }
  return null;
}
//timestamp to date
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
