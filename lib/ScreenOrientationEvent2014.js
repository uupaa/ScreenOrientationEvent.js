(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("ScreenOrientationEvent2014", function moduleClosure(global, WebModule, VERIFY, VERBOSE) {
"use strict";

// --- data struct / technical terms -----------------------
/*
- https://www.w3.org/TR/2014/WD-screen-orientation-20140220/
    - window.screen.orientation:String
    - window.screen.lockOrientation:Function
    - window.screen.unlockOrientation:Function
    - window.screen.onorientationchange:Function
 */
// --- dependency modules ----------------------------------
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
var _callbacks          = [];       // callback function array. [callback, ...]
var _eventType          = "";       // "orientationchange" or "resize" or "change"
var _lastOrientation    = 0;        // last orientation value.
var _isScreenLocked     = false;    // screen locked

// --- class / interfaces ----------------------------------
var ScreenOrientationEvent = {
    "_init":        ScreenOrientationEvent__init,
    "enable":       _isEnable(),                        // ScreenOrientationEvent.enable:Boolean
    "on":           ScreenOrientationEvent_on,          // ScreenOrientationEvent.on(callback:Function):void
    "off":          ScreenOrientationEvent_off,         // ScreenOrientationEvent.off(callback:Function):void
    "end":          ScreenOrientationEvent_end,         // ScreenOrientationEvent.end():void
    "orientation":  ScreenOrientationEvent_orientation, // ScreenOrientationEvent.orientation():UINT16
    // --- Screen Orientation API lock/unlock functions ---
    "enableLock":   _isEnableLock(),                    // ScreenOrientationEvent.enableLock:Boolean
    "lock":         ScreenOrientationAPI_lock,          // ScreenOrientationEvent.lock(orientations:String|StringArray, readyCallback:Function, errorCallback:Function):void
    "unlock":       ScreenOrientationAPI_unlock,        // ScreenOrientationEvent.unlock():void
    "isLocked":     ScreenOrientationAPI_isLocked,      // ScreenOrientationEvent.isLocked():Boolean
};

// --- implements ------------------------------------------
function ScreenOrientationEvent__init() {
    if (ScreenOrientationEvent["enable"]) {
        /*
        | Device         | orientation | OS  | Browser   | screen       | inner        |
        |----------------|-------------|-----|-----------|--------------|--------------|
        | iPhone 6s      | portrait    | 9.2 | Safari    | w:375, h:667 | w:375, h:559 |
        | iPhone 6s      | landscape   | 9.2 | Safari    | w:375, h:667 | w:667, h:375 |
        | Nexus 7 (2013) | portrait    | 6.0 | Chrome 50 | w:600, h:960 | w:600, h:792 |
        | Nexus 7 (2013) | landscape   | 6.0 | Chrome 50 | w:960, h:600 | w:960, h:432 |
         */
      //var screenWidth  = screen.width;
      //var screenHeight = screen.height;
      //var innerWidth   = global["innerWidth"];
      //var innerHeight  = global["innerHeight"];
        _lastOrientation = _currentOrientation();

        if ("onorientationchange" in screen) {
            _eventType = "orientationchange";           // screen.addEventListener("orientationchange")
        } else if ("onmsorientationchange" in screen) {
            _eventType = "msorientationchange";         // screen.addEventListener("msorientationchange")
        } else if ("onmozorientationchange" in screen) {
            _eventType = "mozorientationchange";        // screen.addEventListener("mozorientationchange")
        }
        screen["addEventListener"](_eventType, _handleEvent);
    }
}

function ScreenOrientationEvent_on(callback) { // @arg Function - callback(currentOrientation:Number, defaultOrientation:Number, eventType:EventTypeString):void
                                               // @desc attach ScreenOrientationEvent event.
    var pos = _callbacks.indexOf(callback); // find registered callback

    if (pos < 0) { // already -> ignore
        _callbacks.push(callback);
    }
}

function ScreenOrientationEvent_off(callback) { // @arg Function
                                                // @desc detach ScreenOrientationEvent event.
    var pos = _callbacks.indexOf(callback); // find registered callback

    if (pos >= 0) {
        _callbacks.splice(pos, 1);
    }
}

function ScreenOrientationEvent_end() { // @desc cleanup, release all events and event listeners.
    _callbacks = [];
    screen["removeEventListener"](_eventType, _handleEvent);
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

function _currentOrientation() { // @ret UINT16 - 0 or 90 or 180 or 270
    var orientationType = screen["orientation"]    ||
                          screen["msOrientation"]  ||
                          screen["mozOrientation"] || "";

    switch (orientationType) {
    case "portrait-primary":    return 0;
    case "portrait-secondary":  return 90;
    case "landscape-primary":   return 0;
    case "landscape-secondary": return 90;
    }
    return ((global["orientation"] || 0) + 360) % 360; // -90 -> 270
}

function ScreenOrientationEvent_orientation() { // @ret UINT16 - 0 or 90 or 180 or 270
    return _currentOrientation();
}

function _isEnable() {
    var screen = global["screen"];

    if (screen) {
        var orientation = screen["orientation"]    ||
                          screen["msOrientation"]  ||
                          screen["mozOrientation"];

        if (typeof orientation === "string") {
            if ("onorientationchange"    in screen ||
                "onmsorientationchange"  in screen ||
                "onmozorientationchange" in screen) {
                return true;
            }
        }
    }
    return false;
}

function _isEnableLock() {
    var screen = global["screen"];

    if (screen) {
        var api = _getLockAPIName();
        if (api) {
            return true;
        }
    }
    return false;
}

function ScreenOrientationAPI_lock(orientations,    // @arg OrientationString|OrientationStringArray - orientation or [orientation, ...]
                                   readyCallback,   // @arg Function = null - readyCallback():void - locked
                                   errorCallback) { // @arg Function = null - errorCallback(error):void - failed

    readyCallback = readyCallback || function() {};
    errorCallback = errorCallback || function() {};

    // https://www.w3.org/TR/2014/WD-screen-orientation-20140220/
    // https://www.w3.org/TR/2012/WD-screen-orientation-20121206/
    var api = _getLockAPIName();
    if (api) {
        if ( screen[api](orientations) ) {
            _isScreenLocked = true;
            readyCallback();
        } else {
            _isScreenLocked = false;
            errorCallback(new Error("NOT_IMPL"));
        }
    }
}

function ScreenOrientationAPI_unlock() {
    var api = _getUnlockAPIName();
    if (api) {
        screen[api]();
        _isScreenLocked = false;
    }
}

function ScreenOrientationAPI_isLocked() { // @ret Boolean
    return _isScreenLocked;
}

function _getLockAPIName() {
    return "lockOrientation"    in screen ? "lockOrientation"
         : "msLockOrientation"  in screen ? "msLockOrientation"
         : "mozLockOrientation" in screen ? "mozLockOrientation"
                                          : "";
}
function _getUnlockAPIName() {
    return "unlock"               in screen ? "unlock"
         : "unlockOrientation"    in screen ? "unlockOrientation"
         : "msUnlockOrientation"  in screen ? "msUnlockOrientation"
         : "mozUnlockOrientation" in screen ? "mozUnlockOrientation"
                                            : "";
}

return ScreenOrientationEvent; // return entity

});

