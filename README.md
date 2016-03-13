# ScreenOrientationEvent.js [![Build Status](https://travis-ci.org/uupaa/ScreenOrientationEvent.js.svg)](https://travis-ci.org/uupaa/ScreenOrientationEvent.js)

[![npm](https://nodei.co/npm/uupaa.screenorientationevent.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.screenorientationevent.js/)

Screen orientation handler.

This module made of [WebModule](https://github.com/uupaa/WebModule).

## Documentation
- [Spec](https://github.com/uupaa/ScreenOrientationEvent.js/wiki/)
- [API Spec](https://github.com/uupaa/ScreenOrientationEvent.js/wiki/ScreenOrientationEvent)


## Browser compatibility

|                       | ScreenOrientation.on | ScreenOrientation.lock |
|-----------------------|----------------------|------------------------|
| Chrome                | YES                  | YES                    |
| Chrome for Android    | YES                  | YES                    |
| Firefox for Android   | YES                  | YES                    |
| Edge                  | YES                  | NO                     |
| Mobile Safari         | YES                  | NO                     |
| IE10                  | NO                   | NO                     |
| IE11 (Windows 8.1)    | NO                   | NO                     |
| IE11 (Windows 7)      | NO                   | NO                     |
| Safari                | NO                   | NO                     |
| Android Browser       | NO                   | NO                     |

## Browser, NW.js and Electron

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/lib/ScreenOrientationEvent.js"></script>
<script>

window.onload = function() {
    if (ScreenOrientationEvent.enable) {
        _setBodyColor(ScreenOrientationEvent.orientation());

        ScreenOrientationEvent.on(function(currentOrientation, eventType) {
            console.log(currentOrientation, eventType);

            _setBodyColor(currentOrientation);
        });
    }
};

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

</script>
```

## WebWorkers

```js
importScripts("<module-dir>lib/WebModule.js");
importScripts("<module-dir>lib/ScreenOrientationEvent.js");

```

## Node.js

```js
require("<module-dir>lib/WebModule.js");
require("<module-dir>lib/ScreenOrientationEvent.js");

```

