var ModuleTestScreenOrientationEvent = (function(global) {

var test = new Test(["ScreenOrientationEvent"], { // Add the ModuleName to be tested here (if necessary).
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     false,  // enable worker test.
        node:       false,  // enable node test.
        nw:         true,  // enable nw.js test.
        el:         true,  // enable electron (render process) test.
        button:     true,  // show button.
        both:       true,  // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
            console.error(error.message);
        }
    });

if (IN_BROWSER || IN_NW || IN_EL) {
    test.add([
        testScreenOrientationEvent,
    ]);
}

// var ENABLE_ORIENTATION_API      = _isEnableScreenOrientationAPI();
// var ENABLE_ORIENTATION_FUNCTION = _isEnableScreenOrientationFunction();

// --- test cases ------------------------------------------
function testScreenOrientationEvent(test, pass, miss) {
    if (!ScreenOrientationEvent.enable) {
        test.done(miss());
    }
    _setBodyColor(ScreenOrientationEvent.orientation());

    ScreenOrientationEvent.on(function(currentOrientation, eventType) {
        _setBodyColor(currentOrientation);
        //test.done(pass());
    });

/*
    var userAgent = new UserAgent();
    var eventType = ENABLE_ORIENTATION_API ? "change"    // API:    screen.orientation.addEventListener("change")
                  : userAgent.iOS ? "orientationchange"  // Safari: window.addEventListener("orientationchange")
                                  : "resize";            // Chrome: window.addEventListener("resize")

    if (ENABLE_ORIENTATION_API) {
        var event = new CustomEvent(eventType);
        event.detail = 1;
        event.angle = 90;
        screen.orientation.dispatchEvent(event);
    } else if (ENABLE_ORIENTATION_FUNCTION) {
        var event = new CustomEvent(eventType);
        event.detail = 1;
        global.dispatchEvent(event);
    }
 */
}

/*
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

 */

function _setBodyColor(orientation) {
    var color = "white";
    switch (orientation) {
    case   0: color = "white"; break;
    case  90: color = "red";   break;
    case 180: color = "green"; break;
    case 270: color = "blue";  break;
    }
    document.body.style.backgroundColor = color;
}

return test.run();

})(GLOBAL);

