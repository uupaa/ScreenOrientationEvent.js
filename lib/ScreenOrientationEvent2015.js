(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (typeof module !== "undefined") {
    module["exports"] = entity;
}
return entity;

})("ScreenOrientationEvent2015", function moduleClosure(global, WebModule, VERIFY, VERBOSE) {
"use strict";

// --- data struct / technical terms -----------------------
/*
- https://w3c.github.io/screen-orientation/#idl-def-ScreenOrientation - Draft 24 December 2015
    - ScreenOrientation: Object
        - lock(lockType:String):Promise
        - unlock():void
        - type:String - "portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary"
        - angle:UINT16
        - onchange():void
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
        _eventType = "change";

        screen["orientation"]["addEventListener"](_eventType, _handleEvent);
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
    screen["orientation"]["removeEventListener"](_eventType, _handleEvent);
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
    return screen["orientation"]["angle"];
}

function ScreenOrientationEvent_orientation() { // @ret UINT16 - 0 or 90 or 180 or 270
    return _currentOrientation();
}

function _isEnable() {
    var screen = global["screen"];

    if (screen) {
        var orientation = screen["orientation"];

        if (typeof orientation === "object") {
            if ("type"     in orientation &&
                "angle"    in orientation &&
                "onchange" in orientation) {
                return true;
            }
        }
    }
    return false;
}

function _isEnableLock() {
    var screen = global["screen"];

    if (screen) {
        var orientation = screen["orientation"];

        if (typeof orientation === "object") {
            if ("lock"   in orientation &&
                "unlock" in orientation) {
                return true;
            }
        }
    }
    return false;
}

function ScreenOrientationAPI_lock(orientations,    // @arg OrientationString|OrientationStringArray - orientation or [orientation, ...]
                                   readyCallback,   // @arg Function = null - readyCallback():void - locked
                                   errorCallback) { // @arg Function = null - errorCallback(error):void - failed

    readyCallback = readyCallback || function() {};
    errorCallback = errorCallback || function() {};

    screen["orientation"]["lock"](orientations).then(function() {
        _isScreenLocked = true;
        readyCallback();
    }, function(error) {
        _isScreenLocked = false;
        errorCallback(error);
    });
}

function ScreenOrientationAPI_unlock() {
    screen["orientation"]["unlock"]();
    _isScreenLocked = false;
}

function ScreenOrientationAPI_isLocked() { // @ret Boolean
    return _isScreenLocked;
}

return ScreenOrientationEvent; // return entity

});

