

var global = global || globalThis || (function () { return this; }());
(function (global) {
    "use strict";           
    global.UNITY_EDITOR = false;
    global.UNITY_IOS = false;
    global.UNITY_ANDROID = false;
    global.UNITY_WEBGL = true;
}(global));


