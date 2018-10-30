(function() {
  function registerHandler(handlerName, handler) {
    mmaJsBridge._messageHandlers[handlerName] = handler;
  }

  function _onReturnValue(data, callbackId) {
    mmaJsBridge._responseCallbacks[callbackId](data);
  }

  function callHandler(handlerName, data, responseCallback) {
    if (responseCallback) {
      var callbackId =
        "cb_" + mmaJsBridge._uniqueId++ + "_" + new Date().getTime();
      mmaJsBridge._responseCallbacks[callbackId] = responseCallback;
      //_bridge[handlerName](data, callbackId);
    } else {
      //_bridge[handlerName](data);
    }
  }

  var mmaJsBridge = (window.mmaJsBridge = {
    _messageHandlers: {},
    _responseCallbacks: {},
    _uniqueId: 1,
    _onReturnValue: _onReturnValue,
    callHandler: callHandler,
    registerHandler: registerHandler
  });

  function setOnActionCallback(callback) {
    mma.onAction = callback;
  }

  function setTitle(title) {
    window.mmaJsBridge.callHandler("setTitle", title);
  }

  function setActionMenus(show, actions) {
    window.mmaJsBridge.callHandler(
      "setActionMenus",
      JSON.stringify({ show: show, actions: actions })
    );
  }

  function getLocation(callback) {
    window.mmaJsBridge.callHandler("getLocation", {}, callback);
  }

  function syncBaseData(callback) {
    window.mmaJsBridge.callHandler("syncBaseData", {}, callback);
  }

  function putCache(key, value) {
    var stringConstructor = "test".constructor;
    var arrayConstructor = [].constructor;
    var objectConstructor = {}.constructor;

    var cache = { key: key };
    if (value === null) {
      return;
    } else if (value === undefined) {
      return;
    } else if (value.constructor === stringConstructor) {
      cache.value = value;
    } else if (
      value.constructor === arrayConstructor ||
      value.constructor === objectConstructor
    ) {
      cache.value = JSON.stringify(value);
    }
    window.mmaJsBridge.callHandler("putCache", JSON.stringify(cache));
  }

  function getCache(key) {
    return new Promise(function(resolve, reject) {
      var cacheKey;
      if (typeof key == "string") {
        cacheKey = key;
      } else {
        cacheKey = JSON.stringify(key);
      }
      window.mmaJsBridge.callHandler("getCache", cacheKey, function(data) {
        var value;
        //return from java
        if (data == "null") {
          resolve(null);
          return;
        }

        try {
          value = JSON.parse(data);
        } catch (error) {}

        if (value != undefined) {
          resolve(value);
        } else {
          resolve(data);
        }
      });
    });
  }

  function delCache(key) {
    window.mmaJsBridge.callHandler("delCache", key);
  }

  function setToken(token) {
    window.mmaJsBridge.callHandler("setToken", token);
  }

  function majorVersion() {
    return new Promise(function(resolve, reject) {
      window.mmaJsBridge.callHandler("majorVersion", "", function(data){
        resolve(Number.parseFloat(data));
      });
    });
  }

  function cleanH5AppCache() {
    return new Promise(function(resolve, reject) {
      window.mmaJsBridge.callHandler("cleanH5AppCache", "", function(data){
        resolve(data);
      });
    });
  }

  function restart() {
    window.mmaJsBridge.callHandler("restart", "");
  }

  var mma = (window.mma = {
    setOnActionCallback: setOnActionCallback,
    setTitle: setTitle,
    setActionMenus: setActionMenus,
    getLocation: getLocation,
    putCache: putCache,
    getCache: getCache,
    delCache: delCache,
    setToken: setToken,
    syncBaseData: syncBaseData,
    majorVersion: majorVersion,
    cleanH5AppCache: cleanH5AppCache,
    restart: restart
  });

  mmaJsBridge.registerHandler("actionMenuPressed", function(
    data,
    responseCallback
  ) {
    mma.onAction(JSON.parse(data));
  });
})();
