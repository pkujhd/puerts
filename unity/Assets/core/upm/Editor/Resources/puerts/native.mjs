

var global = global || globalThis || (function () { return this; }());
(function (global) {
    "use strict";
            
    function Namespace() {}
    function createTypeProxy(namespace) {
        return new Proxy(new Namespace, {
            get: function(cache, name) {
                if (!(name in cache)) {
                    let fullName = namespace ? (namespace + '.' + name) : name;                
                    let cls = _LoadNativeType(fullName);
                    cache[name] = cls                
                }
                return cache[name];
            }
        });
    }

    const native = createTypeProxy(undefined)
    //加载部分native到global中
    global.RNG = native.RNG
    global.native = native
    puerts.registerBuildinModule("native", native)
}(global));


