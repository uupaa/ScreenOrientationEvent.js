(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("ScreenOrientationEvent", function moduleClosure(global) {
"use strict";

// --- dependency modules ----------------------------------
// --- define / local variables ----------------------------
var VERIFY  = global["WebModule"]["verify"]  || false;
var VERBOSE = global["WebModule"]["verbose"] || false;

var ENABLE_ORIENTATION_API      = _isEnableScreenOrientationAPI();
var ENABLE_ORIENTATION_FUNCTION = _isEnableScreenOrientationFunction();

var _callbacks          = [];       // callback function array. [callback, ...]
var _eventType          = "";       // "orientationchange" or "resize"
var _isScreenLocked     = false;    // screen locked
var _lastOrientation    = 0;        // last orientation value.
var _orientationObject  = _getOrientationObject();

// --- class / interfaces ----------------------------------
var ScreenOrientationEvent = {
    "enable":       ENABLE_ORIENTATION_API || ENABLE_ORIENTATION_FUNCTION,
    "on":           ScreenOrientationEvent_on,          // ScreenOrientationEvent.on(callback:Function):void
    "off":          ScreenOrientationEvent_off,         // ScreenOrientationEvent.off(callback:Function):void
    "clear":        ScreenOrientationEvent_clear,       // ScreenOrientationEvent.clear():void
    "orientation":  ScreenOrientationEvent_orientation, // ScreenOrientationEvent.orientation():Number
    // --- Screen Orientation API lock/unlock functions ---
    "lock":         ScreenOrientationAPI_lock,          // ScreenOrientationEvent.lock():void
    "unlock":       ScreenOrientationAPI_unlock,        // ScreenOrientationEvent.unlock():void
    "isLocked":     ScreenOrientationAPI_isLocked,      // ScreenOrientationEvent.isLocked():Boolean
    "repository":   "https://github.com/uupaa/ScreenOrientationEvent.js",
};

if (ENABLE_ORIENTATION_API || ENABLE_ORIENTATION_FUNCTION) {
    _init();
}

// --- implements ------------------------------------------
function ScreenOrientationEvent_on(callback) { // @arg Function - callback(currentOrientation:Number, defaultOrientation:Number, eventType:EventTypeString):void
                                               // @desc attach ScreenOrientationEvent event.
//{@dev
    if (VERIFY) {
        $valid($type(callback, "Function"), ScreenOrientationEvent_on, "callback");
    }
//}@dev

    var pos = _callbacks.indexOf(callback); // find registered callback

    if (pos < 0) { // already -> ignore
        _callbacks.push(callback);
    }
}

function ScreenOrientationEvent_off(callback) { // @arg Function
                                                // @desc detach ScreenOrientationEvent event.
//{@dev
    if (VERIFY) {
        $valid($type(callback, "Function"), ScreenOrientationEvent_off, "callback");
    }
//}@dev

    var pos = _callbacks.indexOf(callback); // find registered callback

    if (pos >= 0) {
        _callbacks.splice(pos, 1);
    }
}

function ScreenOrientationEvent_clear() { // @desc cleanup, release all events and event listeners.
    _callbacks = [];
    _orientationObject["removeEventListener"](_eventType, _handleEvent);
}

function _handleEvent() {
    var currentOrientation = _currentOrientation();

    if (_lastOrientation !== currentOrientation) {
        _lastOrientation = currentOrientation; // update current state.

        if (VERBOSE) {
            console.info("onorientationchange", currentOrientation);
        }
        for (var i = 0, iz = _callbacks.length; i < iz; ++i) {
            if (_callbacks[i]) {
                _callbacks[i](currentOrientation, _eventType);
            }
        }
    }
}

function _currentOrientation() { // @ret Number - 0 or 90 or 180 or 270
    if (ENABLE_ORIENTATION_API) {
        return _orientationObject["angle"];
    } else if (ENABLE_ORIENTATION_FUNCTION) {
        return (global["orientation"] + 360) % 360; // -90 -> 270
    }
    return 0;
}

function ScreenOrientationEvent_orientation() { // @ret Number - 0 or 90 or 180 or 270
    return _currentOrientation();
}

//function _isPortraitMode() {
//    return _currentOrientation() % 180 === 0; // 0 or 180
//}

function _isEnableScreenOrientationAPI() {
    if (global["screen"]) {
        return !!(screen["orientation"]    ||
                  screen["msOrientation"]  ||
                  screen["mozOrientation"] || null);
    }
    return false;
}

function _isEnableScreenOrientationFunction() {
    return "orientation" in global;
}

function _getOrientationObject() {
    if (ENABLE_ORIENTATION_API) {
        return screen["orientation"]   ||
               screen["msOrientation"] ||
               screen["mozOrientation"];
    }
    if (ENABLE_ORIENTATION_FUNCTION) {
        return global;
    }
    return null;
}

/*
| Device         | orientation | OS  | Browser   | screen       | inner        |
|----------------|-------------|-----|-----------|--------------|--------------|
| iPhone 6s      | portrait    | 9.2 | Safari    | w:375, h:667 | w:375, h:559 |
| iPhone 6s      | landscape   | 9.2 | Safari    | w:375, h:667 | w:667, h:375 |
| Nexus 7 (2013) | portrait    | 6.0 | Chrome 50 | w:600, h:960 | w:600, h:792 |
| Nexus 7 (2013) | landscape   | 6.0 | Chrome 50 | w:960, h:600 | w:960, h:432 |
 */
function _init() {
  //var screenWidth  = screen.width;
  //var screenHeight = screen.height;
  //var innerWidth   = global["innerWidth"];
  //var innerHeight  = global["innerHeight"];
    var iOS          = /iPhone|iPad|iPod/.test(navigator.userAgent);

    _lastOrientation = _currentOrientation();

    _eventType = ENABLE_ORIENTATION_API ? "change"  // API:    screen.orientation.addEventListener("change")
               : iOS ? "orientationchange"          // Safari: window.addEventListener("orientationchange")
                     : "resize";                    // Chrome: window.addEventListener("resize")

    _orientationObject["addEventListener"](_eventType, _handleEvent);
}

function ScreenOrientationAPI_lock(orientations) { // @arg OrientationString|OrientationStringArray - orientation or [orientation, ...]
//{@dev
    if (VERIFY) {
        $valid($type(orientations, "OrientationString|OrientationStringArray"), ScreenOrientationAPI_lock, "orientations");
        $valid($some(orientations, "portrait-primary|portrait-secondary|landscape-primary|landscape-secondary|portrait|landscape|default"), ScreenOrientationAPI_lock, orientations);
    }
//}@dev
    var api = "lock"               in screen ? "lock"
            : "lockOrientation"    in screen ? "lockOrientation"
            : "msLockOrientation"  in screen ? "msLockOrientation"
            : "mozLockOrientation" in screen ? "mozLockOrientation"
            : "";

    if (api) {
        screen[api](orientations);
        _isScreenLocked = true;
    }
}

function ScreenOrientationAPI_unlock() {
    var api = "unlock"               in screen ? "unlock"
            : "unlockOrientation"    in screen ? "unlockOrientation"
            : "msUnlockOrientation"  in screen ? "msUnlockOrientation"
            : "mozUnlockOrientation" in screen ? "mozUnlockOrientation"
            : "";

    if (api) {
        screen[api]();
        _isScreenLocked = false;
    }
}

function ScreenOrientationAPI_isLocked() { // @ret Boolean
    return _isScreenLocked;
}

return ScreenOrientationEvent; // return entity

});

