puer.registerBuildinModule("path", {
    dirname(path) {
        return CS.System.IO.Path.GetDirectoryName(path);
    },
    resolve(dir, url) {
        url = url.replace(/\\/g, "/");
        while (url.startsWith("../")) {
            dir = CS.System.IO.Path.GetDirectoryName(dir);
            url = url.substr(3);
        }
        return CS.System.IO.Path.Combine(dir, url);
    },
});
puer.registerBuildinModule("fs", {
    existsSync(path) {
        return CS.System.IO.File.Exists(path);
    },
    readFileSync(path) {
        return CS.System.IO.File.ReadAllText(path);
    },
});
(function () {
    let global = this || globalThis;
    global["Buffer"] = global["Buffer"] ?? {};
    //使用inline-source-map模式, 需要额外安装buffer模块
    //global["Buffer"] = global["Buffer"] ?? require("buffer").Buffer;
})();
require('source-map-support').install();