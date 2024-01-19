/*
 * Tencent is pleased to support the open source community by making Puerts available.
 * Copyright (C) 2020 THL A29 Limited, a Tencent company.  All rights reserved.
 * Puerts is licensed under the BSD 3-Clause License, except for the third-party components listed in the file 'LICENSE' which may be subject to their corresponding license terms. 
 * This file is subject to the terms and conditions defined in file 'LICENSE', which is part of this source code package.
 */

var global = global || globalThis || (function () { return this; }());

let Framework_Log = puerts.loadType('Babeltime.Framework.Log');

if (Framework_Log) {
    let logLevel = Framework_Log.OutputLevel
    let enableStackForNotErrorLog = Framework_Log.IsOnEditor
    const console_org = global.console;
    var console = {}

    var ELogLevel = {
        Debug: 0,
        Info: 1,
        Warn: 2,
        Error: 3
    }

    function toString(args) {
        return Array.prototype.map.call(args, x => {
            try {
                return x instanceof Error ? x.stack : x + '';
            } catch (err) {
                return err;
            }
        }).join(',');
    }

    function getJSStack() {
        let stack = new Error().stack;
        if (stack == undefined) {
            return "";
        }
        stack = stack.substr(stack.indexOf(")", stack.indexOf(")") + 1) + 1)
        // stack = stack.replace(/^ {4}/gm, ""); // remove indentation
        let logname = stack.substring(stack.indexOf('dist'), stack.indexOf(')')).replace(/dist[\\/]+/, '')
        return [stack, logname];
    }

    console.log = function () {
        if (ELogLevel.Debug < logLevel) {
            return;
        }
        if (enableStackForNotErrorLog) {
            let [jsStack, logname] = getJSStack()
            let args = Array.prototype.slice.call(arguments).concat(jsStack)
            Framework_Log.DebugForJs(logname, toString(args));
            return
        }
        let args = Array.prototype.slice.call(arguments);
        if (console_org) console_org.log.apply(null, args);
        Framework_Log.DebugForJs("debug", toString(args));
    }

    console.info = function () {
        if (ELogLevel.Info < logLevel) {
            return;
        }
        if (enableStackForNotErrorLog) {
            let [jsStack, logname] = getJSStack()
            let args = Array.prototype.slice.call(arguments).concat(jsStack)
            Framework_Log.InfoForJs(logname, toString(args));
            return
        }
        let args = Array.prototype.slice.call(arguments);
        if (console_org) console_org.info.apply(null, args);
        Framework_Log.InfoForJs("info", toString(args));
    }

    console.warn = function () {
        if (ELogLevel.Warn < logLevel) {
            return;
        }
        if (enableStackForNotErrorLog) {
            let [jsStack, logname] = getJSStack()
            let args = Array.prototype.slice.call(arguments).concat(jsStack)
            Framework_Log.WarnForJs(logname, toString(args));
            return
        }
        let args = Array.prototype.slice.call(arguments);
        if (console_org) console_org.warn.apply(null, args);
        Framework_Log.WarnForJs("warn", toString(args));
    }

    console.error = function () {
        if (ELogLevel.Error < logLevel) {
            return;
        }
        let [jsStack, logname] = getJSStack()
        let args = Array.prototype.slice.call(arguments).concat(jsStack)
        if (console_org) console_org.error.apply(null, args);
        Framework_Log.FatalForJs(logname, toString(args));
    }

    console.trace = function () {
        if (ELogLevel.Debug < logLevel) {
            return;
        }

        let args = Array.prototype.slice.call(arguments);
        if (console_org) console_org.trace.apply(null, args);
        Framework_Log.DebugForJs("trace", toString(args));
    }

    console.assert = function (condition) {
        if (console_org) console_org.assert.apply(null, Array.prototype.slice.call(arguments));
        if (condition)
            return

        let msg = ''
        if (arguments.length > 1)
            msg = "Assertion failed: " + toString(Array.prototype.slice.call(arguments, 1)) + "\n"
        else
            msg = "Assertion failed: console.assert\n"

        let [jsStack, logname] = getJSStack()
        Framework_Log.FatalForJs(logname, msg + jsStack);
    }

    const timeRecorder = new Map();
    console.time = function (name) {
        timeRecorder.set(name, +new Date);
    }
    console.timeEnd = function (name) {
        const startTime = timeRecorder.get(name);
        if (startTime) {
            console.log(String(name) + ": " + (+new Date - startTime) + " ms");
            timeRecorder.delete(name);
        } else {
            console.warn("Timer '" + String(name) + "' does not exist");
        };
    }

    global.console = console;
    puer.console = console;
}