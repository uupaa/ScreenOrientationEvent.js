(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("ScreenOrientationEvent", function moduleClosure(global, WebModule, VERIFY /*, VERBOSE */) {
"use strict";

// --- data struct / technical terms -----------------------
/*
   - https://w3c.github.io/screen-orientation/ Screen Orientation API - Draft 24 December 2015
    - ScreenOrientation: Object
        - lock: Function
        - unlock: Function
        - type: String - "portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary"
        - angle: UINT16
        - onchange: Function
 */
// --- dependency modules ----------------------------------
var ScreenOrientationEvent2015 = WebModule["ScreenOrientationEvent2015"];
var ScreenOrientationEvent2014 = WebModule["ScreenOrientationEvent2014"];
var ScreenOrientationEvent2010 = WebModule["ScreenOrientationEvent2010"];
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
var _instance = _getInstance();

// --- class / interfaces ----------------------------------
var ScreenOrientationEvent = {
    "enable":       !!_instance,
    "on":           ScreenOrientationEvent_on,          // ScreenOrientationEvent.on(callback:Function):void
    "off":          ScreenOrientationEvent_off,         // ScreenOrientationEvent.off(callback:Function):void
    "end":          ScreenOrientationEvent_end,         // ScreenOrientationEvent.end():void
    "orientation":  ScreenOrientationEvent_orientation, // ScreenOrientationEvent.orientation():UINT16
    // --- Screen Orientation API lock/unlock functions ---
    "enableLock":   _instance ? _instance["enableLock"] // ScreenOrientationEvent.enableLock:Boolean
                              : false,
    "lock":         ScreenOrientationAPI_lock,          // ScreenOrientationEvent.lock(orientations:String|StringArray, readyCallback:Function, errorCallback:Function):void
    "unlock":       ScreenOrientationAPI_unlock,        // ScreenOrientationEvent.unlock():void
    "isLocked":     ScreenOrientationAPI_isLocked,      // ScreenOrientationEvent.isLocked():Boolean
    "repository":   "https://github.com/uupaa/ScreenOrientationEvent.js",
};

// --- implements ------------------------------------------
function _getInstance() {
    var instance = null;

    if (ScreenOrientationEvent2015 && ScreenOrientationEvent2015["enable"]) {
        instance = ScreenOrientationEvent2015;
    } else if (ScreenOrientationEvent2014 && ScreenOrientationEvent2014["enable"]) {
        instance = ScreenOrientationEvent2014;
    } else if (ScreenOrientationEvent2010 && ScreenOrientationEvent2010["enable"]) {
        instance = ScreenOrientationEvent2010;
    }
    if (instance) {
        instance["_init"]();
    }
    return instance;
}

function ScreenOrientationEvent_on(callback) { // @arg Function - callback(currentOrientation:Number, defaultOrientation:Number, eventType:EventTypeString):void
                                               // @desc attach ScreenOrientationEvent event.
//{@dev
    if (VERIFY) {
        $valid($type(callback, "Function"), ScreenOrientationEvent_on, "callback");
    }
//}@dev

    if (_instance) {
        _instance["on"](callback);
    }
}

function ScreenOrientationEvent_off(callback) { // @arg Function
                                                // @desc detach ScreenOrientationEvent event.
//{@dev
    if (VERIFY) {
        $valid($type(callback, "Function"), ScreenOrientationEvent_off, "callback");
    }
//}@dev

    if (_instance) {
        _instance["off"](callback);
    }
}

function ScreenOrientationEvent_end() { // @desc cleanup, release all events and event listeners.
    if (_instance) {
        _instance["end"]();
    }
}

function ScreenOrientationEvent_orientation() { // @ret UINT16 - 0 or 90 or 180 or 270
    if (_instance) {
        return _instance["orientation"]();
    }
    return 0;
}

function ScreenOrientationAPI_lock(orientations,    // @arg OrientationString|OrientationStringArray - orientation or [orientation, ...]
                                   readyCallback,   // @arg Function = null - readyCallback():void
                                   errorCallback) { // @arg Function = null - errorCallback():void
//{@dev
    if (VERIFY) {
        $valid($type(orientations, "OrientationString|OrientationStringArray"), ScreenOrientationAPI_lock, "orientations");
        $valid($some(orientations, "portrait-primary|portrait-secondary|landscape-primary|landscape-secondary|portrait|landscape|default"), ScreenOrientationAPI_lock, "orientations");
        $valid($type(readyCallback, "Function|omit"), ScreenOrientationAPI_lock, "readyCallback");
        $valid($type(errorCallback, "Function|omit"), ScreenOrientationAPI_lock, "errorCallback");
    }
//}@dev

    if (_instance) {
        _instance["lock"](orientations, readyCallback, errorCallback);
    }
}

function ScreenOrientationAPI_unlock() {
    if (_instance) {
        _instance["unlock"]();
    }
}

function ScreenOrientationAPI_isLocked() { // @ret Boolean
    if (_instance) {
        return _instance["isLocked"]();
    }
    return false;
}

return ScreenOrientationEvent; // return entity

});

