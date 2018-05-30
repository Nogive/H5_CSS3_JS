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
         * Constants shared by mobile h5, web and backend server,
         * use jsweet to translate this java file to js file
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
          API_CODE.PLAN_WRONG_STATE = 1201;
          API_CODE.STAFF_UNDER_BINDING = 1301;
          API_CODE.STAFF_CONTAIN_CHILDREN = 1302;
          API_CODE.STAFF_HAS_PREMVO = 1303;
          API_CODE.STAFF_HAS_MVO = 1304;
          API_CODE.STAFF_HAS_PENDING_MVO = 1305;
          API_CODE.STAFF_HAS_UNDER_APPROVING = 1306;
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
          var OUTLET_STATE = (function() {
            function OUTLET_STATE() {}
            return OUTLET_STATE;
          })();
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
            API_URL.EMPLOYEE_UNBINDING_RETRIEVAL_$LI$ = function() {
              if (API_URL.EMPLOYEE_UNBINDING_RETRIEVAL == null)
                API_URL.EMPLOYEE_UNBINDING_RETRIEVAL = new CommonConstant.API_URL(
                  "employees/unbinding"
                );
              return API_URL.EMPLOYEE_UNBINDING_RETRIEVAL;
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
com.maimang.mjp.utils.CommonConstant.API_URL.EMPLOYEE_UNBINDING_RETRIEVAL_$LI$();
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
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_REVISION_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_MVO2TUO_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_TUO2PMVO_$LI$();
com.maimang.mjp.utils.CommonConstant.API_URL.OUTLET_UO2TUO_$LI$();
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

/*common*******************************************************************/
var $g = com.maimang.mjp.utils.CommonConstant;
var hostName = window.location.hostname;
var host = window.location.protocol + "//" + hostName + window.location.port;
var host = window.location.protocol + "//mjp.waiqin.co";
//常量
var constant = {
  pageSize: 20, //每次请求多少条
  approveNum: 15, //审批每页显示数量
  mvoNum: 15, //查询分配每页显示数量
  pageBtnNum: 4, //多少个分页按钮
  baseDropMenu: [
    "type",
    "scope",
    "state",
    "visitFrequency",
    "demographicRegion",
    "classification",
    "clazz",
    "chain",
    "contractType",
    "channel",
    "dealerType"
  ],
  search: [""],
  assign: ["Show"],
  approval: ["Left", "Right"],
  noEmployeeName: "空缺",
  noEmployeeId: "暂无"
};

/**************************************/
//ajax全局配置
$.ajaxSetup({
  dataType: "json",
  beforeSend: function(xhr) {
    xhr.setRequestHeader("Authorization", cookie.getCookie("token"));
  },
  error: function(xhr) {
    failResponse(xhr);
  }
});
//本地存储
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
  deleteCookie: function(key) {
    document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};
//弹出框和正在加载
var opts = {
  showLoading: function() {
    $("#loadingModal").modal({ backdrop: "static" });
  },
  hideLoading: function() {
    $("#loadingModal").modal("hide");
  },
  alert: function(msg) {
    $("#alertText").text(msg);
    $("#alertModal").modal({ backdrop: "static" });
  },
  tip: function(msg, action, parameter) {
    var paHtml =
      parameter == undefined
        ? ""
        : '<input type="hidden" id="tipParameter" value="' + parameter + '">';
    $("#tipContent").text(msg);
    $("#hidePara").html(paHtml);
    $("#tipModal")
      .modal({ backdrop: "static" })
      .attr("data-action", action);
  },
  tipSureBtn: function(obj) {
    $("#tipModal").modal("hide");
    var action = $(obj)
      .parents(".modal")
      .attr("data-action");
    var parameter = $("#tipParameter").val();
    questWhich(action, parameter);
  },
  permission: function() {
    var permissContent = $('meta[name="permission"]').attr("content");
    if (permissContent != undefined) {
      return JSON.parse(permissContent);
    } else {
      return {};
    }
  }
};

//操作数结构
var tree = {
  beforeClick: function clickNode(treeId, treeNode, clickFlag) {
    return false;
  },
  raseTree: function(mjpTree, onOff) {
    onOff = onOff == undefined ? true : onOff;
    //清空树上的选中 恢复所有的状态
    mjpTree.expandAll(onOff);
    var nodes = mjpTree.getCheckedNodes(true);
    if (nodes != null) {
      for (var node of nodes) {
        mjpTree.checkNode(node, false, false);
      }
    }
    var root = mjpTree.getNodeByParam("pId", null);
    mjpTree.setChkDisabled(root, false, true, true);
  },
  checkInDataScope: function(mjpTree, dataScope) {
    //dataScope范围内可选
    var root = mjpTree.getNodeByParam("pId", null);
    mjpTree.setChkDisabled(root, true, false, true);
    dataScope = dataScope.split(",");
    for (var id of dataScope) {
      var node = mjpTree.getNodeByParam("id", id);
      mjpTree.setChkDisabled(node, false, false, true);
    }
  },
  showCurrentChecked: function(mjpTree, selectScope) {
    //显示当前选中的
    selectScope = selectScope.split(",");
    for (var id of selectScope) {
      var node = mjpTree.getNodeByParam("id", id);
      var pNode = node.getParentNode();
      var cNodes = node.children;
      if (pNode != null) {
        var pOpt = judgeParent(pNode, true);
        mjpTree.setChkDisabled(pNode, true, pOpt, false);
      }
      if (cNodes != undefined) {
        for (var child of cNodes) {
          var cOpt = judgeParent(child, false);
          mjpTree.setChkDisabled(child, true, false, cOpt);
        }
      }
      mjpTree.checkNode(node, true, false);
    }
  },
  checkNode: function(treeId, treeNode, dataScope) {
    //根据datascope 选中节点
    var currentCheckStatus = treeNode.checked;
    var mjpTree = $.fn.zTree.getZTreeObj(treeId);
    var tId = treeNode.tId;
    var pTid = treeNode.parentTId;
    var pNode = mjpTree.getNodeByTId(pTid);
    var notCheckDataScope = true;

    if (currentCheckStatus) {
      //firstly, we enable current node and its children;
      mjpTree.setChkDisabled(treeNode, false, false, true);
      for (var id of dataScope) {
        if (id == treeNode.id) {
          notCheckDataScope = false;
        }
      }
      if (pNode != null && notCheckDataScope) {
        enableParentNode(mjpTree, pNode, treeNode, dataScope, treeNode.id);
      }
    } else {
      //firstly disable all the children node
      var childNodes = treeNode.children;
      if (childNodes != undefined) {
        for (var node of childNodes) {
          mjpTree.setChkDisabled(node, true, false, true);
        }
      }

      if (pNode != null) {
        mjpTree.setChkDisabled(pNode, true, true, false);
      }
    }
  },
  checkOne: function(mjpTree, treeNode) {
    var brotherNode = mjpTree.getNodesByParam("pId", treeNode.pId);
    var checked = treeNode.checked;
    for (var d of brotherNode) {
      if (d.id != treeNode.id) {
        if (checked) {
          mjpTree.setChkDisabled(d, false, false, false);
        } else {
          mjpTree.setChkDisabled(d, true, true, true);
        }
      }
    }
  }
};
//判断是否存在父节点或子节点
function judgeParent(node, flag) {
  if (flag) {
    var pNode = node.getParentNode();
    return pNode == null ? false : true;
  } else {
    var cNode = node.children;
    return cNode == undefined ? false : true;
  }
}
//父节点勾选
function enableParentNode(tree, pNode, cNode, dataScope, currId) {
  var checkedNodes = tree.getNodesByParam("checked", true, pNode);
  var pId = pNode.id;
  for (var node of checkedNodes) {
    if (node.id != cNode.id) {
      return;
    }
  }
  //only the current node is checked
  if (dataScope != undefined) {
    var cancleParent = true;
    for (var id of dataScope) {
      if (id == pId) {
        cancleParent = false;
      }
    }
    tree.setChkDisabled(pNode, false, false, false);
    if (cancleParent) {
      if (pNode.getParentNode() != null) {
        enableParentNode(tree, pNode.getParentNode(), cNode, dataScope, currId);
      }
    }
  } else {
    tree.setChkDisabled(pNode, false, false, false);
    if (pNode.getParentNode() != null) {
      enableParentNode(tree, pNode.getParentNode(), cNode);
    }
  }
}

//日期与timeStamp之间转换
function returnTheDate(timeStamp, flag) {
  var date = new Date(timeStamp);
  if (flag) {
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = date.getDate();
    var str = y + "-" + check(m + 1) + "-" + check(d);
  } else {
    var str = date.getTime();
  }
  return str;
}
function check(i) {
  return i < 10 ? "0" + i : i;
}
//alert , tip  and  loading
var htmls =
  '<div class="modal fade" role="dialog" aria-hidden="true" id="alertModal">' +
  '<div class="modal-dialog">' +
  '<div class="modal-content">' +
  '<div class="modal-header">' +
  '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>' +
  '<h4 class="modal-title">警告</h4>' +
  "</div>" +
  '<div class="modal-body">' +
  '<p id="alertText" class="alert text-center"></p>' +
  "</div>" +
  "</div>" +
  "</div>" +
  "</div>" +
  '<div class="modal fade bs-example-modal-sm" role="dialog" aria-hidden="true" id="loadingModal">' +
  '<div class="modal-dialog modal-sm loadingModal">' +
  '<div class="modal-content">' +
  '<div class="modal-body loadingBody">' +
  '<p class="text-center">请稍候...</p>' +
  '<div class="loading">' +
  '<span class="fa fa-spinner fa-spin"></span>' +
  "</div>" +
  "</div>" +
  "</div>" +
  "</div>" +
  "</div>" +
  '<div class="modal fade" role="dialog" aria-hidden="true" id="tipModal">' +
  '<div class="modal-dialog">' +
  '<div class="modal-content">' +
  '<div class="modal-header">' +
  '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>' +
  '<h4 class="modal-title">提示</h4>' +
  "</div>" +
  '<div class="modal-body">' +
  '<p id="tipContent" class="alert text-center"></p>' +
  '<p id="hidePara"></p>' +
  "</div>" +
  '<div class="modal-footer">' +
  '<button type="button" class="btn btn-default cancleBtn" data-dismiss="modal">取消</button>' +
  '<button type="button" class="btn btn-primary" onclick="opts.tipSureBtn(this);" >确定</button>' +
  "</div>" +
  "</div>" +
  "</div>" +
  "</div>";
$(document).ready(function() {
  $("body").append(htmls);
  $(".dark").remove(); //移除默认notify
  //点击退出
  $("#logout").click(function() {
    $.cookie("token", null, { path: "/" });
    storage.removeSessionAll();
    window.location.href = "login";
  });
  refreshEvery5minutes();
  setInterval(function() {
    refreshEvery5minutes();
  }, 1000 * 60 * 5);
});
//每5分钟刷新消息
function refreshEvery5minutes() {
  var permission = opts.permission();
  var questApis = [];
  if (permission.outletApproval) {
    questApis.push(questApproval());
  }
  if (permission.outletAssignation) {
    questApis.push(questAssign());
  }
  if (questApis.length > 0) {
    Promise.all(questApis).then(function(value) {
      var messages = 0;
      value.forEach(e => {
        if (e != undefined) {
          messages += e.total;
        }
      });
      if (messages > 0) {
        $("#newMessage").show();
      } else {
        $("#newMessage").hide();
      }
    });
  }
}

//请求待分配
function questAssign() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.PENDING_MVO_DETAIL.compose(host),
      type: "GET",
      success: function(data) {
        if (data.code == $g.API_CODE.OK) {
          resolve(data.data.total);
        } else {
          codeError(data, "请求待分配的网点出错");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "请求待分配数据出错了，请稍后刷新重试");
      }
    });
  });
}
//请求待审批
function questApproval() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: $g.API_URL.UNDER_APPROVING_DETAIL.compose(host),
      type: "GET",
      success: function(data) {
        if (data.code == $g.API_CODE.OK) {
          resolve(data.data.total);
        } else {
          codeError(data, "请求待审批的网点出错");
        }
      },
      error: function(xhr) {
        failResponse(xhr, "请求待审批数据出错了，请稍后刷新重试");
      }
    });
  });
}

/*   notify 配置*  使用
showNotify("info", "提示", "这是提示语句");
showNotify("success", "成功啦", "这是成功语句");
showNotify("error", "失败", "这是失败语句");
*****************************************************************/
function showNotify(type, title, text) {
  var icons;
  if (type == "success") {
    icons = "fa fa-check-circle";
  }
  if (type == "error") {
    icons = "fa fa-exclamation-triangle";
  }
  if (type == "info") {
    icons = "fa fa-exclamation-circle";
  }
  var notice = new PNotify({
    title: title,
    text: text,
    type: type,
    delay: 2000,
    icon: icons,
    addclass: "notifyOnly",
    styling: "fontawesome",
    buttons: {
      closer: true,
      sticker: true
    }
  });
  notice.get().click(function() {
    notice.remove();
  });
}

//状态文字转换
function returnStateText(state) {
  var text = "";
  switch (state) {
    case "NO":
      text = "New";
      break;
    case "UO":
      text = "Universe";
      break;
    case "TUO":
      text = "Target Universe";
      break;
    case "PMVO":
      text = "Pending MVO";
      break;
    case "MVO":
      text = "Mvo";
      break;
  }
  return text;
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
/*树结构解析************************************************************************* */
function parseTree(obj) {
  var newObj = {};
  for (var field in obj) {
    if (field == "children") {
      newObj[field] = parseChildren(obj[field]);
    } else if (field == "name") {
      var employeeName =
        obj.employeeName == undefined
          ? constant.noEmployeeName
          : obj.employeeName;
      var employeeId =
        obj.employeeId == undefined ? constant.noEmployeeId : obj.employeeId;
      newObj[field] =
        obj.staffName +
        "_" +
        obj.roleName +
        "_" +
        employeeName +
        "_" +
        employeeId;
    } else {
      newObj[field] = obj[field];
    }
  }
  return newObj;
}
function parseChildren(arr) {
  var children = [];
  arr.forEach(e => {
    children.push(parseTree(e));
  });
  return children;
}
//解析地址栏
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
/************************请求失败函数***************************************** */
//error:
function failResponse(xhr, str) {
  opts.hideLoading();
  var reayState = xhr.reayState;
  var status = xhr.status;
  if (reayState == 4) {
    if (status == 404) {
      window.location = "page_error?errorCode=404";
    } else {
      showNotify("error", str, "发生网络错误");
    }
  }
  if (reayState == 5) {
    if (status == 500) {
      window.location = "page_error?errorCode=500";
    } else {
      showNotify("error", str, "服务器出错");
    }
  }
  showNotify("error", str, "发生网络错误");
}
//code!=0
function codeError(data, str) {
  opts.hideLoading();
  showNotify("info", str, "出错信息：" + data.msg);
}
