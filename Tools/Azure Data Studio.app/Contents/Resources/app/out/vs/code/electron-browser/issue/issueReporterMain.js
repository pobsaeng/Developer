/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["require","exports","vs/base/common/event","vs/base/common/winjs.base","vs/base/common/platform","vs/base/common/strings","vs/base/common/lifecycle","vs/platform/instantiation/common/instantiation","vs/base/common/uri","vs/base/common/types","vs/base/common/paths","path","vs/base/common/async","vs/base/common/objects","vs/platform/log/common/log","os","vs/base/browser/dom","vs/nls!vs/code/electron-browser/issue/issueReporterMain","vs/platform/registry/common/platform","vs/base/common/errors","vs/css!vs/code/electron-browser/issue/issueReporterMain","vs/base/browser/browser","vs/base/parts/ipc/common/ipc","vs/base/common/network","vs/nls","vs/base/common/decorators","vs/platform/node/product","vs/base/common/assert","vs/base/common/functional","vs/base/common/uuid","fs","vs/base/common/arrays","vs/base/common/map","vs/platform/instantiation/common/serviceCollection","vs/platform/issue/common/issue","vs/base/common/collections","vs/platform/node/package","vs/base/common/resources","vs/base/browser/keyboardEvent","vs/platform/configuration/common/configurationRegistry","vs/platform/configuration/common/configuration","vs/base/node/paths","vs/base/node/stream","vs/base/common/keyCodes","vs/base/node/encoding","vs/platform/workspaces/common/workspaces","vs/platform/windows/common/windows","vs/platform/telemetry/node/commonProperties","vs/base/node/extfs","vs/base/common/graph","vs/base/node/pfs","vs/base/browser/iframe","vs/base/common/date","vs/base/parts/ipc/common/ipc.electron","vs/base/parts/ipc/electron-browser/ipc.electron-browser","electron","vs/base/parts/ipc/node/ipc.net","vs/platform/telemetry/common/telemetryUtils","vs/code/electron-browser/issue/issueReporterUtil","vs/css!vs/base/browser/builder","vs/base/common/labels","vs/base/browser/builder","vs/css!vs/base/browser/ui/button/button","vs/base/browser/ui/button/button","vs/css!vs/base/browser/ui/octiconLabel/octicons/octicons","vs/css!vs/base/browser/ui/octiconLabel/octicons/octicons-animations","vs/base/browser/ui/octiconLabel/octiconLabel","vs/css!vs/code/electron-browser/issue/media/issueReporter","vs/nls!vs/code/electron-browser/issue/issueReporterPage","vs/base/browser/event","vs/base/common/linkedList","vs/code/electron-browser/issue/issueReporterPage","vs/nls!vs/platform/configuration/common/configurationRegistry","vs/nls!vs/platform/telemetry/common/telemetryService","vs/nls!vs/platform/workspaces/common/workspaces","vs/platform/instantiation/common/descriptors","vs/base/browser/mouseEvent","vs/platform/files/common/files","vs/base/common/cancellation","vs/platform/instantiation/common/instantiationService","vs/base/common/normalization","vs/code/electron-browser/issue/issueReporterModel","vs/platform/keybinding/common/keybinding","vs/base/common/color","vs/platform/log/common/logIpc","vs/platform/log/node/spdlogService","vs/base/browser/touch","vs/base/common/glob","vs/platform/environment/node/environmentService","vs/platform/telemetry/common/telemetryService","vs/base/common/mime","vs/platform/jsonschemas/common/jsonContributionRegistry","vs/base/node/flow","vs/platform/windows/common/windowsIpc","vs/platform/telemetry/common/telemetryIpc","crypto","net","stream","child_process","iconv-lite","assert","vs/code/electron-browser/issue/issueReporterMain"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
define(__m[51/*vs/base/browser/iframe*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var hasDifferentOriginAncestorFlag = false;
    var sameOriginWindowChainCache = null;
    function getParentWindowIfSameOrigin(w) {
        if (!w.parent || w.parent === w) {
            return null;
        }
        // Cannot really tell if we have access to the parent window unless we try to access something in it
        try {
            var location_1 = w.location;
            var parentLocation = w.parent.location;
            if (location_1.protocol !== parentLocation.protocol || location_1.hostname !== parentLocation.hostname || location_1.port !== parentLocation.port) {
                hasDifferentOriginAncestorFlag = true;
                return null;
            }
        }
        catch (e) {
            hasDifferentOriginAncestorFlag = true;
            return null;
        }
        return w.parent;
    }
    function findIframeElementInParentWindow(parentWindow, childWindow) {
        var parentWindowIframes = parentWindow.document.getElementsByTagName('iframe');
        var iframe;
        for (var i = 0, len = parentWindowIframes.length; i < len; i++) {
            iframe = parentWindowIframes[i];
            if (iframe.contentWindow === childWindow) {
                return iframe;
            }
        }
        return null;
    }
    var IframeUtils = /** @class */ (function () {
        function IframeUtils() {
        }
        /**
         * Returns a chain of embedded windows with the same origin (which can be accessed programmatically).
         * Having a chain of length 1 might mean that the current execution environment is running outside of an iframe or inside an iframe embedded in a window with a different origin.
         * To distinguish if at one point the current execution environment is running inside a window with a different origin, see hasDifferentOriginAncestor()
         */
        IframeUtils.getSameOriginWindowChain = function () {
            if (!sameOriginWindowChainCache) {
                sameOriginWindowChainCache = [];
                var w = window, parent_1;
                do {
                    parent_1 = getParentWindowIfSameOrigin(w);
                    if (parent_1) {
                        sameOriginWindowChainCache.push({
                            window: w,
                            iframeElement: findIframeElementInParentWindow(parent_1, w)
                        });
                    }
                    else {
                        sameOriginWindowChainCache.push({
                            window: w,
                            iframeElement: null
                        });
                    }
                    w = parent_1;
                } while (w);
            }
            return sameOriginWindowChainCache.slice(0);
        };
        /**
         * Returns true if the current execution environment is chained in a list of iframes which at one point ends in a window with a different origin.
         * Returns false if the current execution environment is not running inside an iframe or if the entire chain of iframes have the same origin.
         */
        IframeUtils.hasDifferentOriginAncestor = function () {
            if (!sameOriginWindowChainCache) {
                this.getSameOriginWindowChain();
            }
            return hasDifferentOriginAncestorFlag;
        };
        /**
         * Returns the position of `childWindow` relative to `ancestorWindow`
         */
        IframeUtils.getPositionOfChildWindowRelativeToAncestorWindow = function (childWindow, ancestorWindow) {
            if (!ancestorWindow || childWindow === ancestorWindow) {
                return {
                    top: 0,
                    left: 0
                };
            }
            var top = 0, left = 0;
            var windowChain = this.getSameOriginWindowChain();
            for (var i = 0; i < windowChain.length; i++) {
                var windowChainEl = windowChain[i];
                if (windowChainEl.window === ancestorWindow) {
                    break;
                }
                if (!windowChainEl.iframeElement) {
                    break;
                }
                var boundingRect = windowChainEl.iframeElement.getBoundingClientRect();
                top += boundingRect.top;
                left += boundingRect.left;
            }
            return {
                top: top,
                left: left
            };
        };
        return IframeUtils;
    }());
    exports.IframeUtils = IframeUtils;
});

define(__m[27/*vs/base/common/assert*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Throws an error with the provided message if the provided value does not evaluate to a true Javascript value.
     */
    function ok(value, message) {
        if (!value || value === null) {
            throw new Error(message ? 'Assertion failed (' + message + ')' : 'Assertion Failed');
        }
    }
    exports.ok = ok;
});

define(__m[35/*vs/base/common/collections*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    /**
     * Returns an array which contains all values that reside
     * in the given set.
     */
    function values(from) {
        var result = [];
        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                result.push(from[key]);
            }
        }
        return result;
    }
    exports.values = values;
    function size(from) {
        var count = 0;
        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                count += 1;
            }
        }
        return count;
    }
    exports.size = size;
    function first(from) {
        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                return from[key];
            }
        }
        return undefined;
    }
    exports.first = first;
    /**
     * Iterates over each entry in the provided set. The iterator allows
     * to remove elements and will stop when the callback returns {{false}}.
     */
    function forEach(from, callback) {
        var _loop_1 = function (key) {
            if (hasOwnProperty.call(from, key)) {
                var result = callback({ key: key, value: from[key] }, function () {
                    delete from[key];
                });
                if (result === false) {
                    return { value: void 0 };
                }
            }
        };
        for (var key in from) {
            var state_1 = _loop_1(key);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    }
    exports.forEach = forEach;
    /**
     * Removes an element from the dictionary. Returns {{false}} if the property
     * does not exists.
     */
    function remove(from, key) {
        if (!hasOwnProperty.call(from, key)) {
            return false;
        }
        delete from[key];
        return true;
    }
    exports.remove = remove;
    /**
     * Groups the collection into a dictionary based on the provided
     * group function.
     */
    function groupBy(data, groupFn) {
        var result = Object.create(null);
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var element = data_1[_i];
            var key = groupFn(element);
            var target = result[key];
            if (!target) {
                target = result[key] = [];
            }
            target.push(element);
        }
        return result;
    }
    exports.groupBy = groupBy;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[83/*vs/base/common/color*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function roundFloat(number, decimalPoints) {
        var decimal = Math.pow(10, decimalPoints);
        return Math.round(number * decimal) / decimal;
    }
    var RGBA = /** @class */ (function () {
        function RGBA(r, g, b, a) {
            if (a === void 0) { a = 1; }
            this.r = Math.min(255, Math.max(0, r)) | 0;
            this.g = Math.min(255, Math.max(0, g)) | 0;
            this.b = Math.min(255, Math.max(0, b)) | 0;
            this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
        }
        RGBA.equals = function (a, b) {
            return a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;
        };
        return RGBA;
    }());
    exports.RGBA = RGBA;
    var HSLA = /** @class */ (function () {
        function HSLA(h, s, l, a) {
            this.h = Math.max(Math.min(360, h), 0) | 0;
            this.s = roundFloat(Math.max(Math.min(1, s), 0), 3);
            this.l = roundFloat(Math.max(Math.min(1, l), 0), 3);
            this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
        }
        HSLA.equals = function (a, b) {
            return a.h === b.h && a.s === b.s && a.l === b.l && a.a === b.a;
        };
        /**
         * Converts an RGB color value to HSL. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
         * Assumes r, g, and b are contained in the set [0, 255] and
         * returns h in the set [0, 360], s, and l in the set [0, 1].
         */
        HSLA.fromRGBA = function (rgba) {
            var r = rgba.r / 255;
            var g = rgba.g / 255;
            var b = rgba.b / 255;
            var a = rgba.a;
            var max = Math.max(r, g, b);
            var min = Math.min(r, g, b);
            var h = 0;
            var s = 0;
            var l = (min + max) / 2;
            var chroma = max - min;
            if (chroma > 0) {
                s = Math.min((l <= 0.5 ? chroma / (2 * l) : chroma / (2 - (2 * l))), 1);
                switch (max) {
                    case r:
                        h = (g - b) / chroma + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / chroma + 2;
                        break;
                    case b:
                        h = (r - g) / chroma + 4;
                        break;
                }
                h *= 60;
                h = Math.round(h);
            }
            return new HSLA(h, s, l, a);
        };
        HSLA._hue2rgb = function (p, q, t) {
            if (t < 0) {
                t += 1;
            }
            if (t > 1) {
                t -= 1;
            }
            if (t < 1 / 6) {
                return p + (q - p) * 6 * t;
            }
            if (t < 1 / 2) {
                return q;
            }
            if (t < 2 / 3) {
                return p + (q - p) * (2 / 3 - t) * 6;
            }
            return p;
        };
        /**
         * Converts an HSL color value to RGB. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
         * Assumes h in the set [0, 360] s, and l are contained in the set [0, 1] and
         * returns r, g, and b in the set [0, 255].
         */
        HSLA.toRGBA = function (hsla) {
            var h = hsla.h / 360;
            var s = hsla.s, l = hsla.l, a = hsla.a;
            var r, g, b;
            if (s === 0) {
                r = g = b = l; // achromatic
            }
            else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = HSLA._hue2rgb(p, q, h + 1 / 3);
                g = HSLA._hue2rgb(p, q, h);
                b = HSLA._hue2rgb(p, q, h - 1 / 3);
            }
            return new RGBA(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a);
        };
        return HSLA;
    }());
    exports.HSLA = HSLA;
    var HSVA = /** @class */ (function () {
        function HSVA(h, s, v, a) {
            this.h = Math.max(Math.min(360, h), 0) | 0;
            this.s = roundFloat(Math.max(Math.min(1, s), 0), 3);
            this.v = roundFloat(Math.max(Math.min(1, v), 0), 3);
            this.a = roundFloat(Math.max(Math.min(1, a), 0), 3);
        }
        HSVA.equals = function (a, b) {
            return a.h === b.h && a.s === b.s && a.v === b.v && a.a === b.a;
        };
        // from http://www.rapidtables.com/convert/color/rgb-to-hsv.htm
        HSVA.fromRGBA = function (rgba) {
            var r = rgba.r / 255;
            var g = rgba.g / 255;
            var b = rgba.b / 255;
            var cmax = Math.max(r, g, b);
            var cmin = Math.min(r, g, b);
            var delta = cmax - cmin;
            var s = cmax === 0 ? 0 : (delta / cmax);
            var m;
            if (delta === 0) {
                m = 0;
            }
            else if (cmax === r) {
                m = ((((g - b) / delta) % 6) + 6) % 6;
            }
            else if (cmax === g) {
                m = ((b - r) / delta) + 2;
            }
            else {
                m = ((r - g) / delta) + 4;
            }
            return new HSVA(Math.round(m * 60), s, cmax, rgba.a);
        };
        // from http://www.rapidtables.com/convert/color/hsv-to-rgb.htm
        HSVA.toRGBA = function (hsva) {
            var h = hsva.h, s = hsva.s, v = hsva.v, a = hsva.a;
            var c = v * s;
            var x = c * (1 - Math.abs((h / 60) % 2 - 1));
            var m = v - c;
            var _a = [0, 0, 0], r = _a[0], g = _a[1], b = _a[2];
            if (h < 60) {
                r = c;
                g = x;
            }
            else if (h < 120) {
                r = x;
                g = c;
            }
            else if (h < 180) {
                g = c;
                b = x;
            }
            else if (h < 240) {
                g = x;
                b = c;
            }
            else if (h < 300) {
                r = x;
                b = c;
            }
            else if (h < 360) {
                r = c;
                b = x;
            }
            r = Math.round((r + m) * 255);
            g = Math.round((g + m) * 255);
            b = Math.round((b + m) * 255);
            return new RGBA(r, g, b, a);
        };
        return HSVA;
    }());
    exports.HSVA = HSVA;
    var Color = /** @class */ (function () {
        function Color(arg) {
            if (!arg) {
                throw new Error('Color needs a value');
            }
            else if (arg instanceof RGBA) {
                this.rgba = arg;
            }
            else if (arg instanceof HSLA) {
                this._hsla = arg;
                this.rgba = HSLA.toRGBA(arg);
            }
            else if (arg instanceof HSVA) {
                this._hsva = arg;
                this.rgba = HSVA.toRGBA(arg);
            }
            else {
                throw new Error('Invalid color ctor argument');
            }
        }
        Color.fromHex = function (hex) {
            return Color.Format.CSS.parseHex(hex) || Color.red;
        };
        Object.defineProperty(Color.prototype, "hsla", {
            get: function () {
                if (this._hsla) {
                    return this._hsla;
                }
                else {
                    return HSLA.fromRGBA(this.rgba);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color.prototype, "hsva", {
            get: function () {
                if (this._hsva) {
                    return this._hsva;
                }
                return HSVA.fromRGBA(this.rgba);
            },
            enumerable: true,
            configurable: true
        });
        Color.prototype.equals = function (other) {
            return !!other && RGBA.equals(this.rgba, other.rgba) && HSLA.equals(this.hsla, other.hsla) && HSVA.equals(this.hsva, other.hsva);
        };
        /**
         * http://www.w3.org/TR/WCAG20/#relativeluminancedef
         * Returns the number in the set [0, 1]. O => Darkest Black. 1 => Lightest white.
         */
        Color.prototype.getRelativeLuminance = function () {
            var R = Color._relativeLuminanceForComponent(this.rgba.r);
            var G = Color._relativeLuminanceForComponent(this.rgba.g);
            var B = Color._relativeLuminanceForComponent(this.rgba.b);
            var luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;
            return roundFloat(luminance, 4);
        };
        Color._relativeLuminanceForComponent = function (color) {
            var c = color / 255;
            return (c <= 0.03928) ? c / 12.92 : Math.pow(((c + 0.055) / 1.055), 2.4);
        };
        /**
         * http://www.w3.org/TR/WCAG20/#contrast-ratiodef
         * Returns the contrast ration number in the set [1, 21].
         */
        Color.prototype.getContrastRatio = function (another) {
            var lum1 = this.getRelativeLuminance();
            var lum2 = another.getRelativeLuminance();
            return lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
        };
        /**
         *	http://24ways.org/2010/calculating-color-contrast
         *  Return 'true' if darker color otherwise 'false'
         */
        Color.prototype.isDarker = function () {
            var yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1000;
            return yiq < 128;
        };
        /**
         *	http://24ways.org/2010/calculating-color-contrast
         *  Return 'true' if lighter color otherwise 'false'
         */
        Color.prototype.isLighter = function () {
            var yiq = (this.rgba.r * 299 + this.rgba.g * 587 + this.rgba.b * 114) / 1000;
            return yiq >= 128;
        };
        Color.prototype.isLighterThan = function (another) {
            var lum1 = this.getRelativeLuminance();
            var lum2 = another.getRelativeLuminance();
            return lum1 > lum2;
        };
        Color.prototype.isDarkerThan = function (another) {
            var lum1 = this.getRelativeLuminance();
            var lum2 = another.getRelativeLuminance();
            return lum1 < lum2;
        };
        Color.prototype.lighten = function (factor) {
            return new Color(new HSLA(this.hsla.h, this.hsla.s, this.hsla.l + this.hsla.l * factor, this.hsla.a));
        };
        Color.prototype.darken = function (factor) {
            return new Color(new HSLA(this.hsla.h, this.hsla.s, this.hsla.l - this.hsla.l * factor, this.hsla.a));
        };
        Color.prototype.transparent = function (factor) {
            var _a = this.rgba, r = _a.r, g = _a.g, b = _a.b, a = _a.a;
            return new Color(new RGBA(r, g, b, a * factor));
        };
        Color.prototype.isTransparent = function () {
            return this.rgba.a === 0;
        };
        Color.prototype.isOpaque = function () {
            return this.rgba.a === 1;
        };
        Color.prototype.opposite = function () {
            return new Color(new RGBA(255 - this.rgba.r, 255 - this.rgba.g, 255 - this.rgba.b, this.rgba.a));
        };
        Color.prototype.blend = function (c) {
            var rgba = c.rgba;
            // Convert to 0..1 opacity
            var thisA = this.rgba.a;
            var colorA = rgba.a;
            var a = thisA + colorA * (1 - thisA);
            if (a < 1.0e-6) {
                return Color.transparent;
            }
            var r = this.rgba.r * thisA / a + rgba.r * colorA * (1 - thisA) / a;
            var g = this.rgba.g * thisA / a + rgba.g * colorA * (1 - thisA) / a;
            var b = this.rgba.b * thisA / a + rgba.b * colorA * (1 - thisA) / a;
            return new Color(new RGBA(r, g, b, a));
        };
        Color.prototype.flatten = function () {
            var backgrounds = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                backgrounds[_i] = arguments[_i];
            }
            var background = backgrounds.reduceRight(function (accumulator, color) {
                return Color._flatten(color, accumulator);
            });
            return Color._flatten(this, background);
        };
        Color._flatten = function (foreground, background) {
            var backgroundAlpha = 1 - foreground.rgba.a;
            return new Color(new RGBA(backgroundAlpha * background.rgba.r + foreground.rgba.a * foreground.rgba.r, backgroundAlpha * background.rgba.g + foreground.rgba.a * foreground.rgba.g, backgroundAlpha * background.rgba.b + foreground.rgba.a * foreground.rgba.b));
        };
        Color.prototype.toString = function () {
            return Color.Format.CSS.format(this);
        };
        Color.getLighterColor = function (of, relative, factor) {
            if (of.isLighterThan(relative)) {
                return of;
            }
            factor = factor ? factor : 0.5;
            var lum1 = of.getRelativeLuminance();
            var lum2 = relative.getRelativeLuminance();
            factor = factor * (lum2 - lum1) / lum2;
            return of.lighten(factor);
        };
        Color.getDarkerColor = function (of, relative, factor) {
            if (of.isDarkerThan(relative)) {
                return of;
            }
            factor = factor ? factor : 0.5;
            var lum1 = of.getRelativeLuminance();
            var lum2 = relative.getRelativeLuminance();
            factor = factor * (lum1 - lum2) / lum1;
            return of.darken(factor);
        };
        Color.white = new Color(new RGBA(255, 255, 255, 1));
        Color.black = new Color(new RGBA(0, 0, 0, 1));
        Color.red = new Color(new RGBA(255, 0, 0, 1));
        Color.blue = new Color(new RGBA(0, 0, 255, 1));
        Color.green = new Color(new RGBA(0, 255, 0, 1));
        Color.cyan = new Color(new RGBA(0, 255, 255, 1));
        Color.lightgrey = new Color(new RGBA(211, 211, 211, 1));
        Color.transparent = new Color(new RGBA(0, 0, 0, 0));
        return Color;
    }());
    exports.Color = Color;
    (function (Color) {
        var Format;
        (function (Format) {
            var CSS;
            (function (CSS) {
                function formatRGB(color) {
                    if (color.rgba.a === 1) {
                        return "rgb(" + color.rgba.r + ", " + color.rgba.g + ", " + color.rgba.b + ")";
                    }
                    return Color.Format.CSS.formatRGBA(color);
                }
                CSS.formatRGB = formatRGB;
                function formatRGBA(color) {
                    return "rgba(" + color.rgba.r + ", " + color.rgba.g + ", " + color.rgba.b + ", " + +(color.rgba.a).toFixed(2) + ")";
                }
                CSS.formatRGBA = formatRGBA;
                function formatHSL(color) {
                    if (color.hsla.a === 1) {
                        return "hsl(" + color.hsla.h + ", " + (color.hsla.s * 100).toFixed(2) + "%, " + (color.hsla.l * 100).toFixed(2) + "%)";
                    }
                    return Color.Format.CSS.formatHSLA(color);
                }
                CSS.formatHSL = formatHSL;
                function formatHSLA(color) {
                    return "hsla(" + color.hsla.h + ", " + (color.hsla.s * 100).toFixed(2) + "%, " + (color.hsla.l * 100).toFixed(2) + "%, " + color.hsla.a.toFixed(2) + ")";
                }
                CSS.formatHSLA = formatHSLA;
                function _toTwoDigitHex(n) {
                    var r = n.toString(16);
                    return r.length !== 2 ? '0' + r : r;
                }
                /**
                 * Formats the color as #RRGGBB
                 */
                function formatHex(color) {
                    return "#" + _toTwoDigitHex(color.rgba.r) + _toTwoDigitHex(color.rgba.g) + _toTwoDigitHex(color.rgba.b);
                }
                CSS.formatHex = formatHex;
                /**
                 * Formats the color as #RRGGBBAA
                 * If 'compact' is set, colors without transparancy will be printed as #RRGGBB
                 */
                function formatHexA(color, compact) {
                    if (compact === void 0) { compact = false; }
                    if (compact && color.rgba.a === 1) {
                        return Color.Format.CSS.formatHex(color);
                    }
                    return "#" + _toTwoDigitHex(color.rgba.r) + _toTwoDigitHex(color.rgba.g) + _toTwoDigitHex(color.rgba.b) + _toTwoDigitHex(Math.round(color.rgba.a * 255));
                }
                CSS.formatHexA = formatHexA;
                /**
                 * The default format will use HEX if opaque and RGBA otherwise.
                 */
                function format(color) {
                    if (!color) {
                        return null;
                    }
                    if (color.isOpaque()) {
                        return Color.Format.CSS.formatHex(color);
                    }
                    return Color.Format.CSS.formatRGBA(color);
                }
                CSS.format = format;
                /**
                 * Converts an Hex color value to a Color.
                 * returns r, g, and b are contained in the set [0, 255]
                 * @param hex string (#RGB, #RGBA, #RRGGBB or #RRGGBBAA).
                 */
                function parseHex(hex) {
                    if (!hex) {
                        // Invalid color
                        return null;
                    }
                    var length = hex.length;
                    if (length === 0) {
                        // Invalid color
                        return null;
                    }
                    if (hex.charCodeAt(0) !== 35 /* Hash */) {
                        // Does not begin with a #
                        return null;
                    }
                    if (length === 7) {
                        // #RRGGBB format
                        var r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
                        var g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
                        var b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
                        return new Color(new RGBA(r, g, b, 1));
                    }
                    if (length === 9) {
                        // #RRGGBBAA format
                        var r = 16 * _parseHexDigit(hex.charCodeAt(1)) + _parseHexDigit(hex.charCodeAt(2));
                        var g = 16 * _parseHexDigit(hex.charCodeAt(3)) + _parseHexDigit(hex.charCodeAt(4));
                        var b = 16 * _parseHexDigit(hex.charCodeAt(5)) + _parseHexDigit(hex.charCodeAt(6));
                        var a = 16 * _parseHexDigit(hex.charCodeAt(7)) + _parseHexDigit(hex.charCodeAt(8));
                        return new Color(new RGBA(r, g, b, a / 255));
                    }
                    if (length === 4) {
                        // #RGB format
                        var r = _parseHexDigit(hex.charCodeAt(1));
                        var g = _parseHexDigit(hex.charCodeAt(2));
                        var b = _parseHexDigit(hex.charCodeAt(3));
                        return new Color(new RGBA(16 * r + r, 16 * g + g, 16 * b + b));
                    }
                    if (length === 5) {
                        // #RGBA format
                        var r = _parseHexDigit(hex.charCodeAt(1));
                        var g = _parseHexDigit(hex.charCodeAt(2));
                        var b = _parseHexDigit(hex.charCodeAt(3));
                        var a = _parseHexDigit(hex.charCodeAt(4));
                        return new Color(new RGBA(16 * r + r, 16 * g + g, 16 * b + b, (16 * a + a) / 255));
                    }
                    // Invalid color
                    return null;
                }
                CSS.parseHex = parseHex;
                function _parseHexDigit(charCode) {
                    switch (charCode) {
                        case 48 /* Digit0 */: return 0;
                        case 49 /* Digit1 */: return 1;
                        case 50 /* Digit2 */: return 2;
                        case 51 /* Digit3 */: return 3;
                        case 52 /* Digit4 */: return 4;
                        case 53 /* Digit5 */: return 5;
                        case 54 /* Digit6 */: return 6;
                        case 55 /* Digit7 */: return 7;
                        case 56 /* Digit8 */: return 8;
                        case 57 /* Digit9 */: return 9;
                        case 97 /* a */: return 10;
                        case 65 /* A */: return 10;
                        case 98 /* b */: return 11;
                        case 66 /* B */: return 11;
                        case 99 /* c */: return 12;
                        case 67 /* C */: return 12;
                        case 100 /* d */: return 13;
                        case 68 /* D */: return 13;
                        case 101 /* e */: return 14;
                        case 69 /* E */: return 14;
                        case 102 /* f */: return 15;
                        case 70 /* F */: return 15;
                    }
                    return 0;
                }
            })(CSS = Format.CSS || (Format.CSS = {}));
        })(Format = Color.Format || (Color.Format = {}));
    })(Color = exports.Color || (exports.Color = {}));
    exports.Color = Color;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[25/*vs/base/common/decorators*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function createDecorator(mapFn) {
        return function (target, key, descriptor) {
            var fnKey = null;
            var fn = null;
            if (typeof descriptor.value === 'function') {
                fnKey = 'value';
                fn = descriptor.value;
            }
            else if (typeof descriptor.get === 'function') {
                fnKey = 'get';
                fn = descriptor.get;
            }
            if (!fn) {
                throw new Error('not supported');
            }
            descriptor[fnKey] = mapFn(fn, key);
        };
    }
    exports.createDecorator = createDecorator;
    function memoize(target, key, descriptor) {
        var fnKey = null;
        var fn = null;
        if (typeof descriptor.value === 'function') {
            fnKey = 'value';
            fn = descriptor.value;
            if (fn.length !== 0) {
                console.warn('Memoize should only be used in functions with zero parameters');
            }
        }
        else if (typeof descriptor.get === 'function') {
            fnKey = 'get';
            fn = descriptor.get;
        }
        if (!fn) {
            throw new Error('not supported');
        }
        var memoizeKey = "$memoize$" + key;
        descriptor[fnKey] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!this.hasOwnProperty(memoizeKey)) {
                Object.defineProperty(this, memoizeKey, {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: fn.apply(this, args)
                });
            }
            return this[memoizeKey];
        };
    }
    exports.memoize = memoize;
    function debounce(delay, reducer, initialValueProvider) {
        return createDecorator(function (fn, key) {
            var timerKey = "$debounce$" + key;
            var resultKey = "$debounce$result$" + key;
            return function () {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (!this[resultKey]) {
                    this[resultKey] = initialValueProvider ? initialValueProvider() : void 0;
                }
                clearTimeout(this[timerKey]);
                if (reducer) {
                    this[resultKey] = reducer.apply(void 0, [this[resultKey]].concat(args));
                    args = [this[resultKey]];
                }
                this[timerKey] = setTimeout(function () {
                    fn.apply(_this, args);
                    _this[resultKey] = initialValueProvider ? initialValueProvider() : void 0;
                }, delay);
            };
        });
    }
    exports.debounce = debounce;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[28/*vs/base/common/functional*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function once(fn) {
        var _this = this;
        var didCall = false;
        var result;
        return function () {
            if (didCall) {
                return result;
            }
            didCall = true;
            result = fn.apply(_this, arguments);
            return result;
        };
    }
    exports.once = once;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[43/*vs/base/common/keyCodes*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Virtual Key Codes, the value does not hold any inherent meaning.
     * Inspired somewhat from https://msdn.microsoft.com/en-us/library/windows/desktop/dd375731(v=vs.85).aspx
     * But these are "more general", as they should work across browsers & OS`s.
     */
    var KeyCode;
    (function (KeyCode) {
        /**
         * Placed first to cover the 0 value of the enum.
         */
        KeyCode[KeyCode["Unknown"] = 0] = "Unknown";
        KeyCode[KeyCode["Backspace"] = 1] = "Backspace";
        KeyCode[KeyCode["Tab"] = 2] = "Tab";
        KeyCode[KeyCode["Enter"] = 3] = "Enter";
        KeyCode[KeyCode["Shift"] = 4] = "Shift";
        KeyCode[KeyCode["Ctrl"] = 5] = "Ctrl";
        KeyCode[KeyCode["Alt"] = 6] = "Alt";
        KeyCode[KeyCode["PauseBreak"] = 7] = "PauseBreak";
        KeyCode[KeyCode["CapsLock"] = 8] = "CapsLock";
        KeyCode[KeyCode["Escape"] = 9] = "Escape";
        KeyCode[KeyCode["Space"] = 10] = "Space";
        KeyCode[KeyCode["PageUp"] = 11] = "PageUp";
        KeyCode[KeyCode["PageDown"] = 12] = "PageDown";
        KeyCode[KeyCode["End"] = 13] = "End";
        KeyCode[KeyCode["Home"] = 14] = "Home";
        KeyCode[KeyCode["LeftArrow"] = 15] = "LeftArrow";
        KeyCode[KeyCode["UpArrow"] = 16] = "UpArrow";
        KeyCode[KeyCode["RightArrow"] = 17] = "RightArrow";
        KeyCode[KeyCode["DownArrow"] = 18] = "DownArrow";
        KeyCode[KeyCode["Insert"] = 19] = "Insert";
        KeyCode[KeyCode["Delete"] = 20] = "Delete";
        KeyCode[KeyCode["KEY_0"] = 21] = "KEY_0";
        KeyCode[KeyCode["KEY_1"] = 22] = "KEY_1";
        KeyCode[KeyCode["KEY_2"] = 23] = "KEY_2";
        KeyCode[KeyCode["KEY_3"] = 24] = "KEY_3";
        KeyCode[KeyCode["KEY_4"] = 25] = "KEY_4";
        KeyCode[KeyCode["KEY_5"] = 26] = "KEY_5";
        KeyCode[KeyCode["KEY_6"] = 27] = "KEY_6";
        KeyCode[KeyCode["KEY_7"] = 28] = "KEY_7";
        KeyCode[KeyCode["KEY_8"] = 29] = "KEY_8";
        KeyCode[KeyCode["KEY_9"] = 30] = "KEY_9";
        KeyCode[KeyCode["KEY_A"] = 31] = "KEY_A";
        KeyCode[KeyCode["KEY_B"] = 32] = "KEY_B";
        KeyCode[KeyCode["KEY_C"] = 33] = "KEY_C";
        KeyCode[KeyCode["KEY_D"] = 34] = "KEY_D";
        KeyCode[KeyCode["KEY_E"] = 35] = "KEY_E";
        KeyCode[KeyCode["KEY_F"] = 36] = "KEY_F";
        KeyCode[KeyCode["KEY_G"] = 37] = "KEY_G";
        KeyCode[KeyCode["KEY_H"] = 38] = "KEY_H";
        KeyCode[KeyCode["KEY_I"] = 39] = "KEY_I";
        KeyCode[KeyCode["KEY_J"] = 40] = "KEY_J";
        KeyCode[KeyCode["KEY_K"] = 41] = "KEY_K";
        KeyCode[KeyCode["KEY_L"] = 42] = "KEY_L";
        KeyCode[KeyCode["KEY_M"] = 43] = "KEY_M";
        KeyCode[KeyCode["KEY_N"] = 44] = "KEY_N";
        KeyCode[KeyCode["KEY_O"] = 45] = "KEY_O";
        KeyCode[KeyCode["KEY_P"] = 46] = "KEY_P";
        KeyCode[KeyCode["KEY_Q"] = 47] = "KEY_Q";
        KeyCode[KeyCode["KEY_R"] = 48] = "KEY_R";
        KeyCode[KeyCode["KEY_S"] = 49] = "KEY_S";
        KeyCode[KeyCode["KEY_T"] = 50] = "KEY_T";
        KeyCode[KeyCode["KEY_U"] = 51] = "KEY_U";
        KeyCode[KeyCode["KEY_V"] = 52] = "KEY_V";
        KeyCode[KeyCode["KEY_W"] = 53] = "KEY_W";
        KeyCode[KeyCode["KEY_X"] = 54] = "KEY_X";
        KeyCode[KeyCode["KEY_Y"] = 55] = "KEY_Y";
        KeyCode[KeyCode["KEY_Z"] = 56] = "KEY_Z";
        KeyCode[KeyCode["Meta"] = 57] = "Meta";
        KeyCode[KeyCode["ContextMenu"] = 58] = "ContextMenu";
        KeyCode[KeyCode["F1"] = 59] = "F1";
        KeyCode[KeyCode["F2"] = 60] = "F2";
        KeyCode[KeyCode["F3"] = 61] = "F3";
        KeyCode[KeyCode["F4"] = 62] = "F4";
        KeyCode[KeyCode["F5"] = 63] = "F5";
        KeyCode[KeyCode["F6"] = 64] = "F6";
        KeyCode[KeyCode["F7"] = 65] = "F7";
        KeyCode[KeyCode["F8"] = 66] = "F8";
        KeyCode[KeyCode["F9"] = 67] = "F9";
        KeyCode[KeyCode["F10"] = 68] = "F10";
        KeyCode[KeyCode["F11"] = 69] = "F11";
        KeyCode[KeyCode["F12"] = 70] = "F12";
        KeyCode[KeyCode["F13"] = 71] = "F13";
        KeyCode[KeyCode["F14"] = 72] = "F14";
        KeyCode[KeyCode["F15"] = 73] = "F15";
        KeyCode[KeyCode["F16"] = 74] = "F16";
        KeyCode[KeyCode["F17"] = 75] = "F17";
        KeyCode[KeyCode["F18"] = 76] = "F18";
        KeyCode[KeyCode["F19"] = 77] = "F19";
        KeyCode[KeyCode["NumLock"] = 78] = "NumLock";
        KeyCode[KeyCode["ScrollLock"] = 79] = "ScrollLock";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the ';:' key
         */
        KeyCode[KeyCode["US_SEMICOLON"] = 80] = "US_SEMICOLON";
        /**
         * For any country/region, the '+' key
         * For the US standard keyboard, the '=+' key
         */
        KeyCode[KeyCode["US_EQUAL"] = 81] = "US_EQUAL";
        /**
         * For any country/region, the ',' key
         * For the US standard keyboard, the ',<' key
         */
        KeyCode[KeyCode["US_COMMA"] = 82] = "US_COMMA";
        /**
         * For any country/region, the '-' key
         * For the US standard keyboard, the '-_' key
         */
        KeyCode[KeyCode["US_MINUS"] = 83] = "US_MINUS";
        /**
         * For any country/region, the '.' key
         * For the US standard keyboard, the '.>' key
         */
        KeyCode[KeyCode["US_DOT"] = 84] = "US_DOT";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the '/?' key
         */
        KeyCode[KeyCode["US_SLASH"] = 85] = "US_SLASH";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the '`~' key
         */
        KeyCode[KeyCode["US_BACKTICK"] = 86] = "US_BACKTICK";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the '[{' key
         */
        KeyCode[KeyCode["US_OPEN_SQUARE_BRACKET"] = 87] = "US_OPEN_SQUARE_BRACKET";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the '\|' key
         */
        KeyCode[KeyCode["US_BACKSLASH"] = 88] = "US_BACKSLASH";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the ']}' key
         */
        KeyCode[KeyCode["US_CLOSE_SQUARE_BRACKET"] = 89] = "US_CLOSE_SQUARE_BRACKET";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         * For the US standard keyboard, the ''"' key
         */
        KeyCode[KeyCode["US_QUOTE"] = 90] = "US_QUOTE";
        /**
         * Used for miscellaneous characters; it can vary by keyboard.
         */
        KeyCode[KeyCode["OEM_8"] = 91] = "OEM_8";
        /**
         * Either the angle bracket key or the backslash key on the RT 102-key keyboard.
         */
        KeyCode[KeyCode["OEM_102"] = 92] = "OEM_102";
        KeyCode[KeyCode["NUMPAD_0"] = 93] = "NUMPAD_0";
        KeyCode[KeyCode["NUMPAD_1"] = 94] = "NUMPAD_1";
        KeyCode[KeyCode["NUMPAD_2"] = 95] = "NUMPAD_2";
        KeyCode[KeyCode["NUMPAD_3"] = 96] = "NUMPAD_3";
        KeyCode[KeyCode["NUMPAD_4"] = 97] = "NUMPAD_4";
        KeyCode[KeyCode["NUMPAD_5"] = 98] = "NUMPAD_5";
        KeyCode[KeyCode["NUMPAD_6"] = 99] = "NUMPAD_6";
        KeyCode[KeyCode["NUMPAD_7"] = 100] = "NUMPAD_7";
        KeyCode[KeyCode["NUMPAD_8"] = 101] = "NUMPAD_8";
        KeyCode[KeyCode["NUMPAD_9"] = 102] = "NUMPAD_9";
        KeyCode[KeyCode["NUMPAD_MULTIPLY"] = 103] = "NUMPAD_MULTIPLY";
        KeyCode[KeyCode["NUMPAD_ADD"] = 104] = "NUMPAD_ADD";
        KeyCode[KeyCode["NUMPAD_SEPARATOR"] = 105] = "NUMPAD_SEPARATOR";
        KeyCode[KeyCode["NUMPAD_SUBTRACT"] = 106] = "NUMPAD_SUBTRACT";
        KeyCode[KeyCode["NUMPAD_DECIMAL"] = 107] = "NUMPAD_DECIMAL";
        KeyCode[KeyCode["NUMPAD_DIVIDE"] = 108] = "NUMPAD_DIVIDE";
        /**
         * Cover all key codes when IME is processing input.
         */
        KeyCode[KeyCode["KEY_IN_COMPOSITION"] = 109] = "KEY_IN_COMPOSITION";
        KeyCode[KeyCode["ABNT_C1"] = 110] = "ABNT_C1";
        KeyCode[KeyCode["ABNT_C2"] = 111] = "ABNT_C2";
        /**
         * Placed last to cover the length of the enum.
         * Please do not depend on this value!
         */
        KeyCode[KeyCode["MAX_VALUE"] = 112] = "MAX_VALUE";
    })(KeyCode = exports.KeyCode || (exports.KeyCode = {}));
    var KeyCodeStrMap = /** @class */ (function () {
        function KeyCodeStrMap() {
            this._keyCodeToStr = [];
            this._strToKeyCode = Object.create(null);
        }
        KeyCodeStrMap.prototype.define = function (keyCode, str) {
            this._keyCodeToStr[keyCode] = str;
            this._strToKeyCode[str.toLowerCase()] = keyCode;
        };
        KeyCodeStrMap.prototype.keyCodeToStr = function (keyCode) {
            return this._keyCodeToStr[keyCode];
        };
        KeyCodeStrMap.prototype.strToKeyCode = function (str) {
            return this._strToKeyCode[str.toLowerCase()] || 0 /* Unknown */;
        };
        return KeyCodeStrMap;
    }());
    var uiMap = new KeyCodeStrMap();
    var userSettingsUSMap = new KeyCodeStrMap();
    var userSettingsGeneralMap = new KeyCodeStrMap();
    (function () {
        function define(keyCode, uiLabel, usUserSettingsLabel, generalUserSettingsLabel) {
            if (usUserSettingsLabel === void 0) { usUserSettingsLabel = uiLabel; }
            if (generalUserSettingsLabel === void 0) { generalUserSettingsLabel = usUserSettingsLabel; }
            uiMap.define(keyCode, uiLabel);
            userSettingsUSMap.define(keyCode, usUserSettingsLabel);
            userSettingsGeneralMap.define(keyCode, generalUserSettingsLabel);
        }
        define(0 /* Unknown */, 'unknown');
        define(1 /* Backspace */, 'Backspace');
        define(2 /* Tab */, 'Tab');
        define(3 /* Enter */, 'Enter');
        define(4 /* Shift */, 'Shift');
        define(5 /* Ctrl */, 'Ctrl');
        define(6 /* Alt */, 'Alt');
        define(7 /* PauseBreak */, 'PauseBreak');
        define(8 /* CapsLock */, 'CapsLock');
        define(9 /* Escape */, 'Escape');
        define(10 /* Space */, 'Space');
        define(11 /* PageUp */, 'PageUp');
        define(12 /* PageDown */, 'PageDown');
        define(13 /* End */, 'End');
        define(14 /* Home */, 'Home');
        define(15 /* LeftArrow */, 'LeftArrow', 'Left');
        define(16 /* UpArrow */, 'UpArrow', 'Up');
        define(17 /* RightArrow */, 'RightArrow', 'Right');
        define(18 /* DownArrow */, 'DownArrow', 'Down');
        define(19 /* Insert */, 'Insert');
        define(20 /* Delete */, 'Delete');
        define(21 /* KEY_0 */, '0');
        define(22 /* KEY_1 */, '1');
        define(23 /* KEY_2 */, '2');
        define(24 /* KEY_3 */, '3');
        define(25 /* KEY_4 */, '4');
        define(26 /* KEY_5 */, '5');
        define(27 /* KEY_6 */, '6');
        define(28 /* KEY_7 */, '7');
        define(29 /* KEY_8 */, '8');
        define(30 /* KEY_9 */, '9');
        define(31 /* KEY_A */, 'A');
        define(32 /* KEY_B */, 'B');
        define(33 /* KEY_C */, 'C');
        define(34 /* KEY_D */, 'D');
        define(35 /* KEY_E */, 'E');
        define(36 /* KEY_F */, 'F');
        define(37 /* KEY_G */, 'G');
        define(38 /* KEY_H */, 'H');
        define(39 /* KEY_I */, 'I');
        define(40 /* KEY_J */, 'J');
        define(41 /* KEY_K */, 'K');
        define(42 /* KEY_L */, 'L');
        define(43 /* KEY_M */, 'M');
        define(44 /* KEY_N */, 'N');
        define(45 /* KEY_O */, 'O');
        define(46 /* KEY_P */, 'P');
        define(47 /* KEY_Q */, 'Q');
        define(48 /* KEY_R */, 'R');
        define(49 /* KEY_S */, 'S');
        define(50 /* KEY_T */, 'T');
        define(51 /* KEY_U */, 'U');
        define(52 /* KEY_V */, 'V');
        define(53 /* KEY_W */, 'W');
        define(54 /* KEY_X */, 'X');
        define(55 /* KEY_Y */, 'Y');
        define(56 /* KEY_Z */, 'Z');
        define(57 /* Meta */, 'Meta');
        define(58 /* ContextMenu */, 'ContextMenu');
        define(59 /* F1 */, 'F1');
        define(60 /* F2 */, 'F2');
        define(61 /* F3 */, 'F3');
        define(62 /* F4 */, 'F4');
        define(63 /* F5 */, 'F5');
        define(64 /* F6 */, 'F6');
        define(65 /* F7 */, 'F7');
        define(66 /* F8 */, 'F8');
        define(67 /* F9 */, 'F9');
        define(68 /* F10 */, 'F10');
        define(69 /* F11 */, 'F11');
        define(70 /* F12 */, 'F12');
        define(71 /* F13 */, 'F13');
        define(72 /* F14 */, 'F14');
        define(73 /* F15 */, 'F15');
        define(74 /* F16 */, 'F16');
        define(75 /* F17 */, 'F17');
        define(76 /* F18 */, 'F18');
        define(77 /* F19 */, 'F19');
        define(78 /* NumLock */, 'NumLock');
        define(79 /* ScrollLock */, 'ScrollLock');
        define(80 /* US_SEMICOLON */, ';', ';', 'OEM_1');
        define(81 /* US_EQUAL */, '=', '=', 'OEM_PLUS');
        define(82 /* US_COMMA */, ',', ',', 'OEM_COMMA');
        define(83 /* US_MINUS */, '-', '-', 'OEM_MINUS');
        define(84 /* US_DOT */, '.', '.', 'OEM_PERIOD');
        define(85 /* US_SLASH */, '/', '/', 'OEM_2');
        define(86 /* US_BACKTICK */, '`', '`', 'OEM_3');
        define(110 /* ABNT_C1 */, 'ABNT_C1');
        define(111 /* ABNT_C2 */, 'ABNT_C2');
        define(87 /* US_OPEN_SQUARE_BRACKET */, '[', '[', 'OEM_4');
        define(88 /* US_BACKSLASH */, '\\', '\\', 'OEM_5');
        define(89 /* US_CLOSE_SQUARE_BRACKET */, ']', ']', 'OEM_6');
        define(90 /* US_QUOTE */, '\'', '\'', 'OEM_7');
        define(91 /* OEM_8 */, 'OEM_8');
        define(92 /* OEM_102 */, 'OEM_102');
        define(93 /* NUMPAD_0 */, 'NumPad0');
        define(94 /* NUMPAD_1 */, 'NumPad1');
        define(95 /* NUMPAD_2 */, 'NumPad2');
        define(96 /* NUMPAD_3 */, 'NumPad3');
        define(97 /* NUMPAD_4 */, 'NumPad4');
        define(98 /* NUMPAD_5 */, 'NumPad5');
        define(99 /* NUMPAD_6 */, 'NumPad6');
        define(100 /* NUMPAD_7 */, 'NumPad7');
        define(101 /* NUMPAD_8 */, 'NumPad8');
        define(102 /* NUMPAD_9 */, 'NumPad9');
        define(103 /* NUMPAD_MULTIPLY */, 'NumPad_Multiply');
        define(104 /* NUMPAD_ADD */, 'NumPad_Add');
        define(105 /* NUMPAD_SEPARATOR */, 'NumPad_Separator');
        define(106 /* NUMPAD_SUBTRACT */, 'NumPad_Subtract');
        define(107 /* NUMPAD_DECIMAL */, 'NumPad_Decimal');
        define(108 /* NUMPAD_DIVIDE */, 'NumPad_Divide');
    })();
    var KeyCodeUtils;
    (function (KeyCodeUtils) {
        function toString(keyCode) {
            return uiMap.keyCodeToStr(keyCode);
        }
        KeyCodeUtils.toString = toString;
        function fromString(key) {
            return uiMap.strToKeyCode(key);
        }
        KeyCodeUtils.fromString = fromString;
        function toUserSettingsUS(keyCode) {
            return userSettingsUSMap.keyCodeToStr(keyCode);
        }
        KeyCodeUtils.toUserSettingsUS = toUserSettingsUS;
        function toUserSettingsGeneral(keyCode) {
            return userSettingsGeneralMap.keyCodeToStr(keyCode);
        }
        KeyCodeUtils.toUserSettingsGeneral = toUserSettingsGeneral;
        function fromUserSettings(key) {
            return userSettingsUSMap.strToKeyCode(key) || userSettingsGeneralMap.strToKeyCode(key);
        }
        KeyCodeUtils.fromUserSettings = fromUserSettings;
    })(KeyCodeUtils = exports.KeyCodeUtils || (exports.KeyCodeUtils = {}));
    /**
     * Binary encoding strategy:
     * ```
     *    1111 11
     *    5432 1098 7654 3210
     *    ---- CSAW KKKK KKKK
     *  C = bit 11 = ctrlCmd flag
     *  S = bit 10 = shift flag
     *  A = bit 9 = alt flag
     *  W = bit 8 = winCtrl flag
     *  K = bits 0-7 = key code
     * ```
     */
    var BinaryKeybindingsMask;
    (function (BinaryKeybindingsMask) {
        BinaryKeybindingsMask[BinaryKeybindingsMask["CtrlCmd"] = 2048] = "CtrlCmd";
        BinaryKeybindingsMask[BinaryKeybindingsMask["Shift"] = 1024] = "Shift";
        BinaryKeybindingsMask[BinaryKeybindingsMask["Alt"] = 512] = "Alt";
        BinaryKeybindingsMask[BinaryKeybindingsMask["WinCtrl"] = 256] = "WinCtrl";
        BinaryKeybindingsMask[BinaryKeybindingsMask["KeyCode"] = 255] = "KeyCode";
    })(BinaryKeybindingsMask || (BinaryKeybindingsMask = {}));
    var KeyMod;
    (function (KeyMod) {
        KeyMod[KeyMod["CtrlCmd"] = 2048] = "CtrlCmd";
        KeyMod[KeyMod["Shift"] = 1024] = "Shift";
        KeyMod[KeyMod["Alt"] = 512] = "Alt";
        KeyMod[KeyMod["WinCtrl"] = 256] = "WinCtrl";
    })(KeyMod = exports.KeyMod || (exports.KeyMod = {}));
    function KeyChord(firstPart, secondPart) {
        var chordPart = ((secondPart & 0x0000ffff) << 16) >>> 0;
        return (firstPart | chordPart) >>> 0;
    }
    exports.KeyChord = KeyChord;
    function createKeybinding(keybinding, OS) {
        if (keybinding === 0) {
            return null;
        }
        var firstPart = (keybinding & 0x0000ffff) >>> 0;
        var chordPart = (keybinding & 0xffff0000) >>> 16;
        if (chordPart !== 0) {
            return new ChordKeybinding(createSimpleKeybinding(firstPart, OS), createSimpleKeybinding(chordPart, OS));
        }
        return createSimpleKeybinding(firstPart, OS);
    }
    exports.createKeybinding = createKeybinding;
    function createSimpleKeybinding(keybinding, OS) {
        var ctrlCmd = (keybinding & 2048 /* CtrlCmd */ ? true : false);
        var winCtrl = (keybinding & 256 /* WinCtrl */ ? true : false);
        var ctrlKey = (OS === 2 /* Macintosh */ ? winCtrl : ctrlCmd);
        var shiftKey = (keybinding & 1024 /* Shift */ ? true : false);
        var altKey = (keybinding & 512 /* Alt */ ? true : false);
        var metaKey = (OS === 2 /* Macintosh */ ? ctrlCmd : winCtrl);
        var keyCode = (keybinding & 255 /* KeyCode */);
        return new SimpleKeybinding(ctrlKey, shiftKey, altKey, metaKey, keyCode);
    }
    exports.createSimpleKeybinding = createSimpleKeybinding;
    var KeybindingType;
    (function (KeybindingType) {
        KeybindingType[KeybindingType["Simple"] = 1] = "Simple";
        KeybindingType[KeybindingType["Chord"] = 2] = "Chord";
    })(KeybindingType = exports.KeybindingType || (exports.KeybindingType = {}));
    var SimpleKeybinding = /** @class */ (function () {
        function SimpleKeybinding(ctrlKey, shiftKey, altKey, metaKey, keyCode) {
            this.type = 1 /* Simple */;
            this.ctrlKey = ctrlKey;
            this.shiftKey = shiftKey;
            this.altKey = altKey;
            this.metaKey = metaKey;
            this.keyCode = keyCode;
        }
        SimpleKeybinding.prototype.equals = function (other) {
            if (other.type !== 1 /* Simple */) {
                return false;
            }
            return (this.ctrlKey === other.ctrlKey
                && this.shiftKey === other.shiftKey
                && this.altKey === other.altKey
                && this.metaKey === other.metaKey
                && this.keyCode === other.keyCode);
        };
        SimpleKeybinding.prototype.getHashCode = function () {
            var ctrl = this.ctrlKey ? '1' : '0';
            var shift = this.shiftKey ? '1' : '0';
            var alt = this.altKey ? '1' : '0';
            var meta = this.metaKey ? '1' : '0';
            return "" + ctrl + shift + alt + meta + this.keyCode;
        };
        SimpleKeybinding.prototype.isModifierKey = function () {
            return (this.keyCode === 0 /* Unknown */
                || this.keyCode === 5 /* Ctrl */
                || this.keyCode === 57 /* Meta */
                || this.keyCode === 6 /* Alt */
                || this.keyCode === 4 /* Shift */);
        };
        /**
         * Does this keybinding refer to the key code of a modifier and it also has the modifier flag?
         */
        SimpleKeybinding.prototype.isDuplicateModifierCase = function () {
            return ((this.ctrlKey && this.keyCode === 5 /* Ctrl */)
                || (this.shiftKey && this.keyCode === 4 /* Shift */)
                || (this.altKey && this.keyCode === 6 /* Alt */)
                || (this.metaKey && this.keyCode === 57 /* Meta */));
        };
        return SimpleKeybinding;
    }());
    exports.SimpleKeybinding = SimpleKeybinding;
    var ChordKeybinding = /** @class */ (function () {
        function ChordKeybinding(firstPart, chordPart) {
            this.type = 2 /* Chord */;
            this.firstPart = firstPart;
            this.chordPart = chordPart;
        }
        ChordKeybinding.prototype.getHashCode = function () {
            return this.firstPart.getHashCode() + ";" + this.chordPart.getHashCode();
        };
        return ChordKeybinding;
    }());
    exports.ChordKeybinding = ChordKeybinding;
    var ResolvedKeybindingPart = /** @class */ (function () {
        function ResolvedKeybindingPart(ctrlKey, shiftKey, altKey, metaKey, kbLabel, kbAriaLabel) {
            this.ctrlKey = ctrlKey;
            this.shiftKey = shiftKey;
            this.altKey = altKey;
            this.metaKey = metaKey;
            this.keyLabel = kbLabel;
            this.keyAriaLabel = kbAriaLabel;
        }
        return ResolvedKeybindingPart;
    }());
    exports.ResolvedKeybindingPart = ResolvedKeybindingPart;
    /**
     * A resolved keybinding. Can be a simple keybinding or a chord keybinding.
     */
    var ResolvedKeybinding = /** @class */ (function () {
        function ResolvedKeybinding() {
        }
        return ResolvedKeybinding;
    }());
    exports.ResolvedKeybinding = ResolvedKeybinding;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[6/*vs/base/common/lifecycle*/], __M([0/*require*/,1/*exports*/,28/*vs/base/common/functional*/]), function (require, exports, functional_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function isDisposable(thing) {
        return typeof thing.dispose === 'function'
            && thing.dispose.length === 0;
    }
    exports.isDisposable = isDisposable;
    function dispose(first) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        if (Array.isArray(first)) {
            first.forEach(function (d) { return d && d.dispose(); });
            return [];
        }
        else if (rest.length === 0) {
            if (first) {
                first.dispose();
                return first;
            }
            return undefined;
        }
        else {
            dispose(first);
            dispose(rest);
            return [];
        }
    }
    exports.dispose = dispose;
    function combinedDisposable(disposables) {
        return { dispose: function () { return dispose(disposables); } };
    }
    exports.combinedDisposable = combinedDisposable;
    function toDisposable(fn) {
        return { dispose: function () { fn(); } };
    }
    exports.toDisposable = toDisposable;
    var Disposable = /** @class */ (function () {
        function Disposable() {
            this._toDispose = [];
        }
        Object.defineProperty(Disposable.prototype, "toDispose", {
            get: function () { return this._toDispose; },
            enumerable: true,
            configurable: true
        });
        Disposable.prototype.dispose = function () {
            this._toDispose = dispose(this._toDispose);
        };
        Disposable.prototype._register = function (t) {
            this._toDispose.push(t);
            return t;
        };
        Disposable.None = Object.freeze({ dispose: function () { } });
        return Disposable;
    }());
    exports.Disposable = Disposable;
    var ReferenceCollection = /** @class */ (function () {
        function ReferenceCollection() {
            this.references = Object.create(null);
        }
        ReferenceCollection.prototype.acquire = function (key) {
            var _this = this;
            var reference = this.references[key];
            if (!reference) {
                reference = this.references[key] = { counter: 0, object: this.createReferencedObject(key) };
            }
            var object = reference.object;
            var dispose = functional_1.once(function () {
                if (--reference.counter === 0) {
                    _this.destroyReferencedObject(reference.object);
                    delete _this.references[key];
                }
            });
            reference.counter++;
            return { object: object, dispose: dispose };
        };
        return ReferenceCollection;
    }());
    exports.ReferenceCollection = ReferenceCollection;
    var ImmortalReference = /** @class */ (function () {
        function ImmortalReference(object) {
            this.object = object;
        }
        ImmortalReference.prototype.dispose = function () { };
        return ImmortalReference;
    }());
    exports.ImmortalReference = ImmortalReference;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[70/*vs/base/common/linkedList*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Node = /** @class */ (function () {
        function Node(element) {
            this.element = element;
        }
        return Node;
    }());
    var LinkedList = /** @class */ (function () {
        function LinkedList() {
        }
        LinkedList.prototype.isEmpty = function () {
            return !this._first;
        };
        LinkedList.prototype.clear = function () {
            this._first = undefined;
            this._last = undefined;
        };
        LinkedList.prototype.unshift = function (element) {
            return this.insert(element, false);
        };
        LinkedList.prototype.push = function (element) {
            return this.insert(element, true);
        };
        LinkedList.prototype.insert = function (element, atTheEnd) {
            var _this = this;
            var newNode = new Node(element);
            if (!this._first) {
                this._first = newNode;
                this._last = newNode;
            }
            else if (atTheEnd) {
                // push
                var oldLast = this._last;
                this._last = newNode;
                newNode.prev = oldLast;
                oldLast.next = newNode;
            }
            else {
                // unshift
                var oldFirst = this._first;
                this._first = newNode;
                newNode.next = oldFirst;
                oldFirst.prev = newNode;
            }
            return function () {
                for (var candidate = _this._first; candidate instanceof Node; candidate = candidate.next) {
                    if (candidate !== newNode) {
                        continue;
                    }
                    if (candidate.prev && candidate.next) {
                        // middle
                        var anchor = candidate.prev;
                        anchor.next = candidate.next;
                        candidate.next.prev = anchor;
                    }
                    else if (!candidate.prev && !candidate.next) {
                        // only node
                        _this._first = undefined;
                        _this._last = undefined;
                    }
                    else if (!candidate.next) {
                        // last
                        _this._last = _this._last.prev;
                        _this._last.next = undefined;
                    }
                    else if (!candidate.prev) {
                        // first
                        _this._first = _this._first.next;
                        _this._first.prev = undefined;
                    }
                    // done
                    break;
                }
            };
        };
        LinkedList.prototype.iterator = function () {
            var element = {
                done: undefined,
                value: undefined,
            };
            var node = this._first;
            return {
                next: function () {
                    if (!node) {
                        element.done = true;
                        element.value = undefined;
                    }
                    else {
                        element.done = false;
                        element.value = node.element;
                        node = node.next;
                    }
                    return element;
                }
            };
        };
        LinkedList.prototype.toArray = function () {
            var result = [];
            for (var node = this._first; node instanceof Node; node = node.next) {
                result.push(node.element);
            }
            return result;
        };
        return LinkedList;
    }());
    exports.LinkedList = LinkedList;
});

define(__m[23/*vs/base/common/network*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Schemas;
    (function (Schemas) {
        /**
         * A schema that is used for models that exist in memory
         * only and that have no correspondence on a server or such.
         */
        Schemas.inMemory = 'inmemory';
        /**
         * A schema that is used for setting files
         */
        Schemas.vscode = 'vscode';
        /**
         * A schema that is used for internal private files
         */
        Schemas.internal = 'private';
        /**
         * A walk-through document.
         */
        Schemas.walkThrough = 'walkThrough';
        /**
         * An embedded code snippet.
         */
        Schemas.walkThroughSnippet = 'walkThroughSnippet';
        Schemas.http = 'http';
        Schemas.https = 'https';
        Schemas.file = 'file';
        Schemas.mailto = 'mailto';
        Schemas.untitled = 'untitled';
        Schemas.data = 'data';
    })(Schemas = exports.Schemas || (exports.Schemas = {}));
});

define(__m[4/*vs/base/common/platform*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var _isWindows = false;
    var _isMacintosh = false;
    var _isLinux = false;
    var _isNative = false;
    var _isWeb = false;
    var _locale = undefined;
    var _language = undefined;
    var _translationsConfigFile = undefined;
    exports.LANGUAGE_DEFAULT = 'en';
    // OS detection
    if (typeof process === 'object' && typeof process.nextTick === 'function' && typeof process.platform === 'string') {
        _isWindows = (process.platform === 'win32');
        _isMacintosh = (process.platform === 'darwin');
        _isLinux = (process.platform === 'linux');
        _locale = exports.LANGUAGE_DEFAULT;
        _language = exports.LANGUAGE_DEFAULT;
        var rawNlsConfig = process.env['VSCODE_NLS_CONFIG'];
        if (rawNlsConfig) {
            try {
                var nlsConfig = JSON.parse(rawNlsConfig);
                var resolved = nlsConfig.availableLanguages['*'];
                _locale = nlsConfig.locale;
                // VSCode's default language is 'en'
                _language = resolved ? resolved : exports.LANGUAGE_DEFAULT;
                _translationsConfigFile = nlsConfig._translationsConfigFile;
            }
            catch (e) {
            }
        }
        _isNative = true;
    }
    else if (typeof navigator === 'object') {
        var userAgent = navigator.userAgent;
        _isWindows = userAgent.indexOf('Windows') >= 0;
        _isMacintosh = userAgent.indexOf('Macintosh') >= 0;
        _isLinux = userAgent.indexOf('Linux') >= 0;
        _isWeb = true;
        _locale = navigator.language;
        _language = _locale;
    }
    var Platform;
    (function (Platform) {
        Platform[Platform["Web"] = 0] = "Web";
        Platform[Platform["Mac"] = 1] = "Mac";
        Platform[Platform["Linux"] = 2] = "Linux";
        Platform[Platform["Windows"] = 3] = "Windows";
    })(Platform = exports.Platform || (exports.Platform = {}));
    var _platform = Platform.Web;
    if (_isNative) {
        if (_isMacintosh) {
            _platform = Platform.Mac;
        }
        else if (_isWindows) {
            _platform = Platform.Windows;
        }
        else if (_isLinux) {
            _platform = Platform.Linux;
        }
    }
    exports.isWindows = _isWindows;
    exports.isMacintosh = _isMacintosh;
    exports.isLinux = _isLinux;
    exports.isNative = _isNative;
    exports.isWeb = _isWeb;
    exports.platform = _platform;
    function isRootUser() {
        return _isNative && !_isWindows && (process.getuid() === 0);
    }
    exports.isRootUser = isRootUser;
    /**
     * The language used for the user interface. The format of
     * the string is all lower case (e.g. zh-tw for Traditional
     * Chinese)
     */
    exports.language = _language;
    /**
     * The OS locale or the locale specified by --locale. The format of
     * the string is all lower case (e.g. zh-tw for Traditional
     * Chinese). The UI is not necessarily shown in the provided locale.
     */
    exports.locale = _locale;
    /**
     * The translatios that are available through language packs.
     */
    exports.translationsConfigFile = _translationsConfigFile;
    var _globals = (typeof self === 'object' ? self : typeof global === 'object' ? global : {});
    exports.globals = _globals;
    var _setImmediate = null;
    function setImmediate(callback) {
        if (_setImmediate === null) {
            if (exports.globals.setImmediate) {
                _setImmediate = exports.globals.setImmediate.bind(exports.globals);
            }
            else if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
                _setImmediate = process.nextTick.bind(process);
            }
            else {
                _setImmediate = exports.globals.setTimeout.bind(exports.globals);
            }
        }
        return _setImmediate(callback);
    }
    exports.setImmediate = setImmediate;
    var OperatingSystem;
    (function (OperatingSystem) {
        OperatingSystem[OperatingSystem["Windows"] = 1] = "Windows";
        OperatingSystem[OperatingSystem["Macintosh"] = 2] = "Macintosh";
        OperatingSystem[OperatingSystem["Linux"] = 3] = "Linux";
    })(OperatingSystem = exports.OperatingSystem || (exports.OperatingSystem = {}));
    exports.OS = (_isMacintosh ? 2 /* Macintosh */ : (_isWindows ? 1 /* Windows */ : 3 /* Linux */));
    var AccessibilitySupport;
    (function (AccessibilitySupport) {
        /**
         * This should be the browser case where it is not known if a screen reader is attached or no.
         */
        AccessibilitySupport[AccessibilitySupport["Unknown"] = 0] = "Unknown";
        AccessibilitySupport[AccessibilitySupport["Disabled"] = 1] = "Disabled";
        AccessibilitySupport[AccessibilitySupport["Enabled"] = 2] = "Enabled";
    })(AccessibilitySupport = exports.AccessibilitySupport || (exports.AccessibilitySupport = {}));
});

define(__m[5/*vs/base/common/strings*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The empty string.
     */
    exports.empty = '';
    function isFalsyOrWhitespace(str) {
        if (!str || typeof str !== 'string') {
            return true;
        }
        return str.trim().length === 0;
    }
    exports.isFalsyOrWhitespace = isFalsyOrWhitespace;
    /**
     * @returns the provided number with the given number of preceding zeros.
     */
    function pad(n, l, char) {
        if (char === void 0) { char = '0'; }
        var str = '' + n;
        var r = [str];
        for (var i = str.length; i < l; i++) {
            r.push(char);
        }
        return r.reverse().join('');
    }
    exports.pad = pad;
    var _formatRegexp = /{(\d+)}/g;
    /**
     * Helper to produce a string with a variable number of arguments. Insert variable segments
     * into the string using the {n} notation where N is the index of the argument following the string.
     * @param value string to which formatting is applied
     * @param args replacements for {n}-entries
     */
    function format(value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (args.length === 0) {
            return value;
        }
        return value.replace(_formatRegexp, function (match, group) {
            var idx = parseInt(group, 10);
            return isNaN(idx) || idx < 0 || idx >= args.length ?
                match :
                args[idx];
        });
    }
    exports.format = format;
    /**
     * Converts HTML characters inside the string to use entities instead. Makes the string safe from
     * being used e.g. in HTMLElement.innerHTML.
     */
    function escape(html) {
        return html.replace(/[<|>|&]/g, function (match) {
            switch (match) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                default: return match;
            }
        });
    }
    exports.escape = escape;
    /**
     * Escapes regular expression characters in a given string
     */
    function escapeRegExpCharacters(value) {
        return value.replace(/[\-\\\{\}\*\+\?\|\^\$\.\[\]\(\)\#]/g, '\\$&');
    }
    exports.escapeRegExpCharacters = escapeRegExpCharacters;
    /**
     * Removes all occurrences of needle from the beginning and end of haystack.
     * @param haystack string to trim
     * @param needle the thing to trim (default is a blank)
     */
    function trim(haystack, needle) {
        if (needle === void 0) { needle = ' '; }
        var trimmed = ltrim(haystack, needle);
        return rtrim(trimmed, needle);
    }
    exports.trim = trim;
    /**
     * Removes all occurrences of needle from the beginning of haystack.
     * @param haystack string to trim
     * @param needle the thing to trim
     */
    function ltrim(haystack, needle) {
        if (!haystack || !needle) {
            return haystack;
        }
        var needleLen = needle.length;
        if (needleLen === 0 || haystack.length === 0) {
            return haystack;
        }
        var offset = 0, idx = -1;
        while ((idx = haystack.indexOf(needle, offset)) === offset) {
            offset = offset + needleLen;
        }
        return haystack.substring(offset);
    }
    exports.ltrim = ltrim;
    /**
     * Removes all occurrences of needle from the end of haystack.
     * @param haystack string to trim
     * @param needle the thing to trim
     */
    function rtrim(haystack, needle) {
        if (!haystack || !needle) {
            return haystack;
        }
        var needleLen = needle.length, haystackLen = haystack.length;
        if (needleLen === 0 || haystackLen === 0) {
            return haystack;
        }
        var offset = haystackLen, idx = -1;
        while (true) {
            idx = haystack.lastIndexOf(needle, offset - 1);
            if (idx === -1 || idx + needleLen !== offset) {
                break;
            }
            if (idx === 0) {
                return '';
            }
            offset = idx;
        }
        return haystack.substring(0, offset);
    }
    exports.rtrim = rtrim;
    function convertSimple2RegExpPattern(pattern) {
        return pattern.replace(/[\-\\\{\}\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, '\\$&').replace(/[\*]/g, '.*');
    }
    exports.convertSimple2RegExpPattern = convertSimple2RegExpPattern;
    function stripWildcards(pattern) {
        return pattern.replace(/\*/g, '');
    }
    exports.stripWildcards = stripWildcards;
    /**
     * Determines if haystack starts with needle.
     */
    function startsWith(haystack, needle) {
        if (haystack.length < needle.length) {
            return false;
        }
        if (haystack === needle) {
            return true;
        }
        for (var i = 0; i < needle.length; i++) {
            if (haystack[i] !== needle[i]) {
                return false;
            }
        }
        return true;
    }
    exports.startsWith = startsWith;
    /**
     * Determines if haystack ends with needle.
     */
    function endsWith(haystack, needle) {
        var diff = haystack.length - needle.length;
        if (diff > 0) {
            return haystack.indexOf(needle, diff) === diff;
        }
        else if (diff === 0) {
            return haystack === needle;
        }
        else {
            return false;
        }
    }
    exports.endsWith = endsWith;
    function createRegExp(searchString, isRegex, options) {
        if (options === void 0) { options = {}; }
        if (!searchString) {
            throw new Error('Cannot create regex from empty string');
        }
        if (!isRegex) {
            searchString = escapeRegExpCharacters(searchString);
        }
        if (options.wholeWord) {
            if (!/\B/.test(searchString.charAt(0))) {
                searchString = '\\b' + searchString;
            }
            if (!/\B/.test(searchString.charAt(searchString.length - 1))) {
                searchString = searchString + '\\b';
            }
        }
        var modifiers = '';
        if (options.global) {
            modifiers += 'g';
        }
        if (!options.matchCase) {
            modifiers += 'i';
        }
        if (options.multiline) {
            modifiers += 'm';
        }
        return new RegExp(searchString, modifiers);
    }
    exports.createRegExp = createRegExp;
    function regExpLeadsToEndlessLoop(regexp) {
        // Exit early if it's one of these special cases which are meant to match
        // against an empty string
        if (regexp.source === '^' || regexp.source === '^$' || regexp.source === '$' || regexp.source === '^\\s*$') {
            return false;
        }
        // We check against an empty string. If the regular expression doesn't advance
        // (e.g. ends in an endless loop) it will match an empty string.
        var match = regexp.exec('');
        return (match && regexp.lastIndex === 0);
    }
    exports.regExpLeadsToEndlessLoop = regExpLeadsToEndlessLoop;
    function regExpContainsBackreference(regexpValue) {
        return !!regexpValue.match(/([^\\]|^)(\\\\)*\\\d+/);
    }
    exports.regExpContainsBackreference = regExpContainsBackreference;
    /**
     * Returns first index of the string that is not whitespace.
     * If string is empty or contains only whitespaces, returns -1
     */
    function firstNonWhitespaceIndex(str) {
        for (var i = 0, len = str.length; i < len; i++) {
            var chCode = str.charCodeAt(i);
            if (chCode !== 32 /* Space */ && chCode !== 9 /* Tab */) {
                return i;
            }
        }
        return -1;
    }
    exports.firstNonWhitespaceIndex = firstNonWhitespaceIndex;
    /**
     * Returns the leading whitespace of the string.
     * If the string contains only whitespaces, returns entire string
     */
    function getLeadingWhitespace(str, start, end) {
        if (start === void 0) { start = 0; }
        if (end === void 0) { end = str.length; }
        for (var i = start; i < end; i++) {
            var chCode = str.charCodeAt(i);
            if (chCode !== 32 /* Space */ && chCode !== 9 /* Tab */) {
                return str.substring(start, i);
            }
        }
        return str.substring(start, end);
    }
    exports.getLeadingWhitespace = getLeadingWhitespace;
    /**
     * Returns last index of the string that is not whitespace.
     * If string is empty or contains only whitespaces, returns -1
     */
    function lastNonWhitespaceIndex(str, startIndex) {
        if (startIndex === void 0) { startIndex = str.length - 1; }
        for (var i = startIndex; i >= 0; i--) {
            var chCode = str.charCodeAt(i);
            if (chCode !== 32 /* Space */ && chCode !== 9 /* Tab */) {
                return i;
            }
        }
        return -1;
    }
    exports.lastNonWhitespaceIndex = lastNonWhitespaceIndex;
    function compare(a, b) {
        if (a < b) {
            return -1;
        }
        else if (a > b) {
            return 1;
        }
        else {
            return 0;
        }
    }
    exports.compare = compare;
    function compareIgnoreCase(a, b) {
        var len = Math.min(a.length, b.length);
        for (var i = 0; i < len; i++) {
            var codeA = a.charCodeAt(i);
            var codeB = b.charCodeAt(i);
            if (codeA === codeB) {
                // equal
                continue;
            }
            if (isUpperAsciiLetter(codeA)) {
                codeA += 32;
            }
            if (isUpperAsciiLetter(codeB)) {
                codeB += 32;
            }
            var diff = codeA - codeB;
            if (diff === 0) {
                // equal -> ignoreCase
                continue;
            }
            else if (isLowerAsciiLetter(codeA) && isLowerAsciiLetter(codeB)) {
                //
                return diff;
            }
            else {
                return compare(a.toLowerCase(), b.toLowerCase());
            }
        }
        if (a.length < b.length) {
            return -1;
        }
        else if (a.length > b.length) {
            return 1;
        }
        else {
            return 0;
        }
    }
    exports.compareIgnoreCase = compareIgnoreCase;
    function isLowerAsciiLetter(code) {
        return code >= 97 /* a */ && code <= 122 /* z */;
    }
    exports.isLowerAsciiLetter = isLowerAsciiLetter;
    function isUpperAsciiLetter(code) {
        return code >= 65 /* A */ && code <= 90 /* Z */;
    }
    exports.isUpperAsciiLetter = isUpperAsciiLetter;
    function isAsciiLetter(code) {
        return isLowerAsciiLetter(code) || isUpperAsciiLetter(code);
    }
    function equalsIgnoreCase(a, b) {
        var len1 = a ? a.length : 0;
        var len2 = b ? b.length : 0;
        if (len1 !== len2) {
            return false;
        }
        return doEqualsIgnoreCase(a, b);
    }
    exports.equalsIgnoreCase = equalsIgnoreCase;
    function doEqualsIgnoreCase(a, b, stopAt) {
        if (stopAt === void 0) { stopAt = a.length; }
        if (typeof a !== 'string' || typeof b !== 'string') {
            return false;
        }
        for (var i = 0; i < stopAt; i++) {
            var codeA = a.charCodeAt(i);
            var codeB = b.charCodeAt(i);
            if (codeA === codeB) {
                continue;
            }
            // a-z A-Z
            if (isAsciiLetter(codeA) && isAsciiLetter(codeB)) {
                var diff = Math.abs(codeA - codeB);
                if (diff !== 0 && diff !== 32) {
                    return false;
                }
            }
            // Any other charcode
            else {
                if (String.fromCharCode(codeA).toLowerCase() !== String.fromCharCode(codeB).toLowerCase()) {
                    return false;
                }
            }
        }
        return true;
    }
    function startsWithIgnoreCase(str, candidate) {
        var candidateLength = candidate.length;
        if (candidate.length > str.length) {
            return false;
        }
        return doEqualsIgnoreCase(str, candidate, candidateLength);
    }
    exports.startsWithIgnoreCase = startsWithIgnoreCase;
    /**
     * @returns the length of the common prefix of the two strings.
     */
    function commonPrefixLength(a, b) {
        var i, len = Math.min(a.length, b.length);
        for (i = 0; i < len; i++) {
            if (a.charCodeAt(i) !== b.charCodeAt(i)) {
                return i;
            }
        }
        return len;
    }
    exports.commonPrefixLength = commonPrefixLength;
    /**
     * @returns the length of the common suffix of the two strings.
     */
    function commonSuffixLength(a, b) {
        var i, len = Math.min(a.length, b.length);
        var aLastIndex = a.length - 1;
        var bLastIndex = b.length - 1;
        for (i = 0; i < len; i++) {
            if (a.charCodeAt(aLastIndex - i) !== b.charCodeAt(bLastIndex - i)) {
                return i;
            }
        }
        return len;
    }
    exports.commonSuffixLength = commonSuffixLength;
    function substrEquals(a, aStart, aEnd, b, bStart, bEnd) {
        while (aStart < aEnd && bStart < bEnd) {
            if (a[aStart] !== b[bStart]) {
                return false;
            }
            aStart += 1;
            bStart += 1;
        }
        return true;
    }
    /**
     * Return the overlap between the suffix of `a` and the prefix of `b`.
     * For instance `overlap("foobar", "arr, I'm a pirate") === 2`.
     */
    function overlap(a, b) {
        var aEnd = a.length;
        var bEnd = b.length;
        var aStart = aEnd - bEnd;
        if (aStart === 0) {
            return a === b ? aEnd : 0;
        }
        else if (aStart < 0) {
            bEnd += aStart;
            aStart = 0;
        }
        while (aStart < aEnd && bEnd > 0) {
            if (substrEquals(a, aStart, aEnd, b, 0, bEnd)) {
                return bEnd;
            }
            bEnd -= 1;
            aStart += 1;
        }
        return 0;
    }
    exports.overlap = overlap;
    // --- unicode
    // http://en.wikipedia.org/wiki/Surrogate_pair
    // Returns the code point starting at a specified index in a string
    // Code points U+0000 to U+D7FF and U+E000 to U+FFFF are represented on a single character
    // Code points U+10000 to U+10FFFF are represented on two consecutive characters
    //export function getUnicodePoint(str:string, index:number, len:number):number {
    //	let chrCode = str.charCodeAt(index);
    //	if (0xD800 <= chrCode && chrCode <= 0xDBFF && index + 1 < len) {
    //		let nextChrCode = str.charCodeAt(index + 1);
    //		if (0xDC00 <= nextChrCode && nextChrCode <= 0xDFFF) {
    //			return (chrCode - 0xD800) << 10 + (nextChrCode - 0xDC00) + 0x10000;
    //		}
    //	}
    //	return chrCode;
    //}
    function isHighSurrogate(charCode) {
        return (0xD800 <= charCode && charCode <= 0xDBFF);
    }
    exports.isHighSurrogate = isHighSurrogate;
    function isLowSurrogate(charCode) {
        return (0xDC00 <= charCode && charCode <= 0xDFFF);
    }
    exports.isLowSurrogate = isLowSurrogate;
    /**
     * Generated using https://github.com/alexandrudima/unicode-utils/blob/master/generate-rtl-test.js
     */
    var CONTAINS_RTL = /(?:[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05F4\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u0710\u0712-\u072F\u074D-\u07A5\u07B1-\u07EA\u07F4\u07F5\u07FA-\u0815\u081A\u0824\u0828\u0830-\u0858\u085E-\u08BD\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFD3D\uFD50-\uFDFC\uFE70-\uFEFC]|\uD802[\uDC00-\uDD1B\uDD20-\uDE00\uDE10-\uDE33\uDE40-\uDEE4\uDEEB-\uDF35\uDF40-\uDFFF]|\uD803[\uDC00-\uDCFF]|\uD83A[\uDC00-\uDCCF\uDD00-\uDD43\uDD50-\uDFFF]|\uD83B[\uDC00-\uDEBB])/;
    /**
     * Returns true if `str` contains any Unicode character that is classified as "R" or "AL".
     */
    function containsRTL(str) {
        return CONTAINS_RTL.test(str);
    }
    exports.containsRTL = containsRTL;
    /**
     * Generated using https://github.com/alexandrudima/unicode-utils/blob/master/generate-emoji-test.js
     */
    var CONTAINS_EMOJI = /(?:[\u231A\u231B\u23F0\u23F3\u2600-\u27BF\u2B50\u2B55]|\uD83C[\uDDE6-\uDDFF\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEF8]|\uD83E[\uDD00-\uDDE6])/;
    function containsEmoji(str) {
        return CONTAINS_EMOJI.test(str);
    }
    exports.containsEmoji = containsEmoji;
    var IS_BASIC_ASCII = /^[\t\n\r\x20-\x7E]*$/;
    /**
     * Returns true if `str` contains only basic ASCII characters in the range 32 - 126 (including 32 and 126) or \n, \r, \t
     */
    function isBasicASCII(str) {
        return IS_BASIC_ASCII.test(str);
    }
    exports.isBasicASCII = isBasicASCII;
    function containsFullWidthCharacter(str) {
        for (var i = 0, len = str.length; i < len; i++) {
            if (isFullWidthCharacter(str.charCodeAt(i))) {
                return true;
            }
        }
        return false;
    }
    exports.containsFullWidthCharacter = containsFullWidthCharacter;
    function isFullWidthCharacter(charCode) {
        // Do a cheap trick to better support wrapping of wide characters, treat them as 2 columns
        // http://jrgraphix.net/research/unicode_blocks.php
        //          2E80 — 2EFF   CJK Radicals Supplement
        //          2F00 — 2FDF   Kangxi Radicals
        //          2FF0 — 2FFF   Ideographic Description Characters
        //          3000 — 303F   CJK Symbols and Punctuation
        //          3040 — 309F   Hiragana
        //          30A0 — 30FF   Katakana
        //          3100 — 312F   Bopomofo
        //          3130 — 318F   Hangul Compatibility Jamo
        //          3190 — 319F   Kanbun
        //          31A0 — 31BF   Bopomofo Extended
        //          31F0 — 31FF   Katakana Phonetic Extensions
        //          3200 — 32FF   Enclosed CJK Letters and Months
        //          3300 — 33FF   CJK Compatibility
        //          3400 — 4DBF   CJK Unified Ideographs Extension A
        //          4DC0 — 4DFF   Yijing Hexagram Symbols
        //          4E00 — 9FFF   CJK Unified Ideographs
        //          A000 — A48F   Yi Syllables
        //          A490 — A4CF   Yi Radicals
        //          AC00 — D7AF   Hangul Syllables
        // [IGNORE] D800 — DB7F   High Surrogates
        // [IGNORE] DB80 — DBFF   High Private Use Surrogates
        // [IGNORE] DC00 — DFFF   Low Surrogates
        // [IGNORE] E000 — F8FF   Private Use Area
        //          F900 — FAFF   CJK Compatibility Ideographs
        // [IGNORE] FB00 — FB4F   Alphabetic Presentation Forms
        // [IGNORE] FB50 — FDFF   Arabic Presentation Forms-A
        // [IGNORE] FE00 — FE0F   Variation Selectors
        // [IGNORE] FE20 — FE2F   Combining Half Marks
        // [IGNORE] FE30 — FE4F   CJK Compatibility Forms
        // [IGNORE] FE50 — FE6F   Small Form Variants
        // [IGNORE] FE70 — FEFF   Arabic Presentation Forms-B
        //          FF00 — FFEF   Halfwidth and Fullwidth Forms
        //               [https://en.wikipedia.org/wiki/Halfwidth_and_fullwidth_forms]
        //               of which FF01 - FF5E fullwidth ASCII of 21 to 7E
        // [IGNORE]    and FF65 - FFDC halfwidth of Katakana and Hangul
        // [IGNORE] FFF0 — FFFF   Specials
        charCode = +charCode; // @perf
        return ((charCode >= 0x2E80 && charCode <= 0xD7AF)
            || (charCode >= 0xF900 && charCode <= 0xFAFF)
            || (charCode >= 0xFF01 && charCode <= 0xFF5E));
    }
    exports.isFullWidthCharacter = isFullWidthCharacter;
    /**
     * Given a string and a max length returns a shorted version. Shorting
     * happens at favorable positions - such as whitespace or punctuation characters.
     */
    function lcut(text, n) {
        if (text.length < n) {
            return text;
        }
        var re = /\b/g;
        var i = 0;
        while (re.test(text)) {
            if (text.length - re.lastIndex < n) {
                break;
            }
            i = re.lastIndex;
            re.lastIndex += 1;
        }
        return text.substring(i).replace(/^\s/, exports.empty);
    }
    exports.lcut = lcut;
    // Escape codes
    // http://en.wikipedia.org/wiki/ANSI_escape_code
    var EL = /\x1B\x5B[12]?K/g; // Erase in line
    var COLOR_START = /\x1b\[\d+m/g; // Color
    var COLOR_END = /\x1b\[0?m/g; // Color
    function removeAnsiEscapeCodes(str) {
        if (str) {
            str = str.replace(EL, '');
            str = str.replace(COLOR_START, '');
            str = str.replace(COLOR_END, '');
        }
        return str;
    }
    exports.removeAnsiEscapeCodes = removeAnsiEscapeCodes;
    // -- UTF-8 BOM
    exports.UTF8_BOM_CHARACTER = String.fromCharCode(65279 /* UTF8_BOM */);
    function startsWithUTF8BOM(str) {
        return (str && str.length > 0 && str.charCodeAt(0) === 65279 /* UTF8_BOM */);
    }
    exports.startsWithUTF8BOM = startsWithUTF8BOM;
    function stripUTF8BOM(str) {
        return startsWithUTF8BOM(str) ? str.substr(1) : str;
    }
    exports.stripUTF8BOM = stripUTF8BOM;
    function safeBtoa(str) {
        return btoa(encodeURIComponent(str)); // we use encodeURIComponent because btoa fails for non Latin 1 values
    }
    exports.safeBtoa = safeBtoa;
    function repeat(s, count) {
        var result = '';
        for (var i = 0; i < count; i++) {
            result += s;
        }
        return result;
    }
    exports.repeat = repeat;
    /**
     * Checks if the characters of the provided query string are included in the
     * target string. The characters do not have to be contiguous within the string.
     */
    function fuzzyContains(target, query) {
        if (!target || !query) {
            return false; // return early if target or query are undefined
        }
        if (target.length < query.length) {
            return false; // impossible for query to be contained in target
        }
        var queryLen = query.length;
        var targetLower = target.toLowerCase();
        var index = 0;
        var lastIndexOf = -1;
        while (index < queryLen) {
            var indexOf = targetLower.indexOf(query[index], lastIndexOf + 1);
            if (indexOf < 0) {
                return false;
            }
            lastIndexOf = indexOf;
            index++;
        }
        return true;
    }
    exports.fuzzyContains = fuzzyContains;
    function containsUppercaseCharacter(target, ignoreEscapedChars) {
        if (ignoreEscapedChars === void 0) { ignoreEscapedChars = false; }
        if (!target) {
            return false;
        }
        if (ignoreEscapedChars) {
            target = target.replace(/\\./g, '');
        }
        return target.toLowerCase() !== target;
    }
    exports.containsUppercaseCharacter = containsUppercaseCharacter;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[52/*vs/base/common/date*/], __M([0/*require*/,1/*exports*/,5/*vs/base/common/strings*/]), function (require, exports, strings_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function toLocalISOString(date) {
        return date.getFullYear() +
            '-' + strings_1.pad(date.getMonth() + 1, 2) +
            '-' + strings_1.pad(date.getDate(), 2) +
            'T' + strings_1.pad(date.getHours(), 2) +
            ':' + strings_1.pad(date.getMinutes(), 2) +
            ':' + strings_1.pad(date.getSeconds(), 2) +
            '.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
            'Z';
    }
    exports.toLocalISOString = toLocalISOString;
});

define(__m[10/*vs/base/common/paths*/], __M([0/*require*/,1/*exports*/,4/*vs/base/common/platform*/,5/*vs/base/common/strings*/]), function (require, exports, platform_1, strings_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The forward slash path separator.
     */
    exports.sep = '/';
    /**
     * The native path separator depending on the OS.
     */
    exports.nativeSep = platform_1.isWindows ? '\\' : '/';
    /**
     * @returns the directory name of a path.
     */
    function dirname(path) {
        var idx = ~path.lastIndexOf('/') || ~path.lastIndexOf('\\');
        if (idx === 0) {
            return '.';
        }
        else if (~idx === 0) {
            return path[0];
        }
        else if (~idx === path.length - 1) {
            return dirname(path.substring(0, path.length - 1));
        }
        else {
            var res = path.substring(0, ~idx);
            if (platform_1.isWindows && res[res.length - 1] === ':') {
                res += exports.nativeSep; // make sure drive letters end with backslash
            }
            return res;
        }
    }
    exports.dirname = dirname;
    /**
     * @returns the base name of a path.
     */
    function basename(path) {
        var idx = ~path.lastIndexOf('/') || ~path.lastIndexOf('\\');
        if (idx === 0) {
            return path;
        }
        else if (~idx === path.length - 1) {
            return basename(path.substring(0, path.length - 1));
        }
        else {
            return path.substr(~idx + 1);
        }
    }
    exports.basename = basename;
    /**
     * @returns `.far` from `boo.far` or the empty string.
     */
    function extname(path) {
        path = basename(path);
        var idx = ~path.lastIndexOf('.');
        return idx ? path.substring(~idx) : '';
    }
    exports.extname = extname;
    var _posixBadPath = /(\/\.\.?\/)|(\/\.\.?)$|^(\.\.?\/)|(\/\/+)|(\\)/;
    var _winBadPath = /(\\\.\.?\\)|(\\\.\.?)$|^(\.\.?\\)|(\\\\+)|(\/)/;
    function _isNormal(path, win) {
        return win
            ? !_winBadPath.test(path)
            : !_posixBadPath.test(path);
    }
    function normalize(path, toOSPath) {
        if (path === null || path === void 0) {
            return path;
        }
        var len = path.length;
        if (len === 0) {
            return '.';
        }
        var wantsBackslash = platform_1.isWindows && toOSPath;
        if (_isNormal(path, wantsBackslash)) {
            return path;
        }
        var sep = wantsBackslash ? '\\' : '/';
        var root = getRoot(path, sep);
        // skip the root-portion of the path
        var start = root.length;
        var skip = false;
        var res = '';
        for (var end = root.length; end <= len; end++) {
            // either at the end or at a path-separator character
            if (end === len || path.charCodeAt(end) === 47 /* Slash */ || path.charCodeAt(end) === 92 /* Backslash */) {
                if (streql(path, start, end, '..')) {
                    // skip current and remove parent (if there is already something)
                    var prev_start = res.lastIndexOf(sep);
                    var prev_part = res.slice(prev_start + 1);
                    if ((root || prev_part.length > 0) && prev_part !== '..') {
                        res = prev_start === -1 ? '' : res.slice(0, prev_start);
                        skip = true;
                    }
                }
                else if (streql(path, start, end, '.') && (root || res || end < len - 1)) {
                    // skip current (if there is already something or if there is more to come)
                    skip = true;
                }
                if (!skip) {
                    var part = path.slice(start, end);
                    if (res !== '' && res[res.length - 1] !== sep) {
                        res += sep;
                    }
                    res += part;
                }
                start = end + 1;
                skip = false;
            }
        }
        return root + res;
    }
    exports.normalize = normalize;
    function streql(value, start, end, other) {
        return start + other.length === end && value.indexOf(other, start) === start;
    }
    /**
     * Computes the _root_ this path, like `getRoot('c:\files') === c:\`,
     * `getRoot('files:///files/path') === files:///`,
     * or `getRoot('\\server\shares\path') === \\server\shares\`
     */
    function getRoot(path, sep) {
        if (sep === void 0) { sep = '/'; }
        if (!path) {
            return '';
        }
        var len = path.length;
        var code = path.charCodeAt(0);
        if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
            code = path.charCodeAt(1);
            if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                // UNC candidate \\localhost\shares\ddd
                //               ^^^^^^^^^^^^^^^^^^^
                code = path.charCodeAt(2);
                if (code !== 47 /* Slash */ && code !== 92 /* Backslash */) {
                    var pos_1 = 3;
                    var start = pos_1;
                    for (; pos_1 < len; pos_1++) {
                        code = path.charCodeAt(pos_1);
                        if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                            break;
                        }
                    }
                    code = path.charCodeAt(pos_1 + 1);
                    if (start !== pos_1 && code !== 47 /* Slash */ && code !== 92 /* Backslash */) {
                        pos_1 += 1;
                        for (; pos_1 < len; pos_1++) {
                            code = path.charCodeAt(pos_1);
                            if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                                return path.slice(0, pos_1 + 1) // consume this separator
                                    .replace(/[\\/]/g, sep);
                            }
                        }
                    }
                }
            }
            // /user/far
            // ^
            return sep;
        }
        else if ((code >= 65 /* A */ && code <= 90 /* Z */) || (code >= 97 /* a */ && code <= 122 /* z */)) {
            // check for windows drive letter c:\ or c:
            if (path.charCodeAt(1) === 58 /* Colon */) {
                code = path.charCodeAt(2);
                if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                    // C:\fff
                    // ^^^
                    return path.slice(0, 2) + sep;
                }
                else {
                    // C:
                    // ^^
                    return path.slice(0, 2);
                }
            }
        }
        // check for URI
        // scheme://authority/path
        // ^^^^^^^^^^^^^^^^^^^
        var pos = path.indexOf('://');
        if (pos !== -1) {
            pos += 3; // 3 -> "://".length
            for (; pos < len; pos++) {
                code = path.charCodeAt(pos);
                if (code === 47 /* Slash */ || code === 92 /* Backslash */) {
                    return path.slice(0, pos + 1); // consume this separator
                }
            }
        }
        return '';
    }
    exports.getRoot = getRoot;
    exports.join = function () {
        // Not using a function with var-args because of how TS compiles
        // them to JS - it would result in 2*n runtime cost instead
        // of 1*n, where n is parts.length.
        var value = '';
        for (var i = 0; i < arguments.length; i++) {
            var part = arguments[i];
            if (i > 0) {
                // add the separater between two parts unless
                // there already is one
                var last = value.charCodeAt(value.length - 1);
                if (last !== 47 /* Slash */ && last !== 92 /* Backslash */) {
                    var next = part.charCodeAt(0);
                    if (next !== 47 /* Slash */ && next !== 92 /* Backslash */) {
                        value += exports.sep;
                    }
                }
            }
            value += part;
        }
        return normalize(value);
    };
    /**
     * Check if the path follows this pattern: `\\hostname\sharename`.
     *
     * @see https://msdn.microsoft.com/en-us/library/gg465305.aspx
     * @return A boolean indication if the path is a UNC path, on none-windows
     * always false.
     */
    function isUNC(path) {
        if (!platform_1.isWindows) {
            // UNC is a windows concept
            return false;
        }
        if (!path || path.length < 5) {
            // at least \\a\b
            return false;
        }
        var code = path.charCodeAt(0);
        if (code !== 92 /* Backslash */) {
            return false;
        }
        code = path.charCodeAt(1);
        if (code !== 92 /* Backslash */) {
            return false;
        }
        var pos = 2;
        var start = pos;
        for (; pos < path.length; pos++) {
            code = path.charCodeAt(pos);
            if (code === 92 /* Backslash */) {
                break;
            }
        }
        if (start === pos) {
            return false;
        }
        code = path.charCodeAt(pos + 1);
        if (isNaN(code) || code === 92 /* Backslash */) {
            return false;
        }
        return true;
    }
    exports.isUNC = isUNC;
    // Reference: https://en.wikipedia.org/wiki/Filename
    var INVALID_FILE_CHARS = platform_1.isWindows ? /[\\/:\*\?"<>\|]/g : /[\\/]/g;
    var WINDOWS_FORBIDDEN_NAMES = /^(con|prn|aux|clock\$|nul|lpt[0-9]|com[0-9])$/i;
    function isValidBasename(name) {
        if (!name || name.length === 0 || /^\s+$/.test(name)) {
            return false; // require a name that is not just whitespace
        }
        INVALID_FILE_CHARS.lastIndex = 0; // the holy grail of software development
        if (INVALID_FILE_CHARS.test(name)) {
            return false; // check for certain invalid file characters
        }
        if (platform_1.isWindows && WINDOWS_FORBIDDEN_NAMES.test(name)) {
            return false; // check for certain invalid file names
        }
        if (name === '.' || name === '..') {
            return false; // check for reserved values
        }
        if (platform_1.isWindows && name[name.length - 1] === '.') {
            return false; // Windows: file cannot end with a "."
        }
        if (platform_1.isWindows && name.length !== name.trim().length) {
            return false; // Windows: file cannot end with a whitespace
        }
        return true;
    }
    exports.isValidBasename = isValidBasename;
    function isEqual(pathA, pathB, ignoreCase) {
        var identityEquals = (pathA === pathB);
        if (!ignoreCase || identityEquals) {
            return identityEquals;
        }
        if (!pathA || !pathB) {
            return false;
        }
        return strings_1.equalsIgnoreCase(pathA, pathB);
    }
    exports.isEqual = isEqual;
    function isEqualOrParent(path, candidate, ignoreCase, separator) {
        if (separator === void 0) { separator = exports.nativeSep; }
        if (path === candidate) {
            return true;
        }
        if (!path || !candidate) {
            return false;
        }
        if (candidate.length > path.length) {
            return false;
        }
        if (ignoreCase) {
            var beginsWith = strings_1.startsWithIgnoreCase(path, candidate);
            if (!beginsWith) {
                return false;
            }
            if (candidate.length === path.length) {
                return true; // same path, different casing
            }
            var sepOffset = candidate.length;
            if (candidate.charAt(candidate.length - 1) === separator) {
                sepOffset--; // adjust the expected sep offset in case our candidate already ends in separator character
            }
            return path.charAt(sepOffset) === separator;
        }
        if (candidate.charAt(candidate.length - 1) !== separator) {
            candidate += separator;
        }
        return path.indexOf(candidate) === 0;
    }
    exports.isEqualOrParent = isEqualOrParent;
    /**
     * Adapted from Node's path.isAbsolute functions
     */
    function isAbsolute(path) {
        return platform_1.isWindows ?
            isAbsolute_win32(path) :
            isAbsolute_posix(path);
    }
    exports.isAbsolute = isAbsolute;
    function isAbsolute_win32(path) {
        if (!path) {
            return false;
        }
        var char0 = path.charCodeAt(0);
        if (char0 === 47 /* Slash */ || char0 === 92 /* Backslash */) {
            return true;
        }
        else if ((char0 >= 65 /* A */ && char0 <= 90 /* Z */) || (char0 >= 97 /* a */ && char0 <= 122 /* z */)) {
            if (path.length > 2 && path.charCodeAt(1) === 58 /* Colon */) {
                var char2 = path.charCodeAt(2);
                if (char2 === 47 /* Slash */ || char2 === 92 /* Backslash */) {
                    return true;
                }
            }
        }
        return false;
    }
    exports.isAbsolute_win32 = isAbsolute_win32;
    function isAbsolute_posix(path) {
        return path && path.charCodeAt(0) === 47 /* Slash */;
    }
    exports.isAbsolute_posix = isAbsolute_posix;
});

define(__m[37/*vs/base/common/resources*/], __M([0/*require*/,1/*exports*/,10/*vs/base/common/paths*/,5/*vs/base/common/strings*/,23/*vs/base/common/network*/,4/*vs/base/common/platform*/]), function (require, exports, paths, strings_1, network_1, platform_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function getComparisonKey(resource) {
        return hasToIgnoreCase(resource) ? resource.toString().toLowerCase() : resource.toString();
    }
    exports.getComparisonKey = getComparisonKey;
    function hasToIgnoreCase(resource) {
        // A file scheme resource is in the same platform as code, so ignore case for non linux platforms
        // Resource can be from another platform. Lowering the case as an hack. Should come from File system provider
        return resource && resource.scheme === network_1.Schemas.file ? !platform_1.isLinux : true;
    }
    exports.hasToIgnoreCase = hasToIgnoreCase;
    function basenameOrAuthority(resource) {
        return paths.basename(resource.path) || resource.authority;
    }
    exports.basenameOrAuthority = basenameOrAuthority;
    function isEqualOrParent(resource, candidate, ignoreCase) {
        if (resource.scheme === candidate.scheme && resource.authority === candidate.authority) {
            if (resource.scheme === 'file') {
                return paths.isEqualOrParent(resource.fsPath, candidate.fsPath, ignoreCase);
            }
            return paths.isEqualOrParent(resource.path, candidate.path, ignoreCase, '/');
        }
        return false;
    }
    exports.isEqualOrParent = isEqualOrParent;
    function isEqual(first, second, ignoreCase) {
        var identityEquals = (first === second);
        if (identityEquals) {
            return true;
        }
        if (!first || !second) {
            return false;
        }
        if (ignoreCase) {
            return strings_1.equalsIgnoreCase(first.toString(), second.toString());
        }
        return first.toString() === second.toString();
    }
    exports.isEqual = isEqual;
    function dirname(resource) {
        var dirname = paths.dirname(resource.path);
        if (resource.authority && dirname && !paths.isAbsolute(dirname)) {
            return null; // If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character
        }
        return resource.with({
            path: dirname
        });
    }
    exports.dirname = dirname;
    function joinPath(resource, pathFragment) {
        var joinedPath = paths.join(resource.path || '/', pathFragment);
        return resource.with({
            path: joinedPath
        });
    }
    exports.joinPath = joinPath;
    function distinctParents(items, resourceAccessor) {
        var distinctParents = [];
        var _loop_1 = function (i) {
            var candidateResource = resourceAccessor(items[i]);
            if (items.some(function (otherItem, index) {
                if (index === i) {
                    return false;
                }
                return isEqualOrParent(candidateResource, resourceAccessor(otherItem));
            })) {
                return "continue";
            }
            distinctParents.push(items[i]);
        };
        for (var i = 0; i < items.length; i++) {
            _loop_1(i);
        }
        return distinctParents;
    }
    exports.distinctParents = distinctParents;
});

define(__m[9/*vs/base/common/types*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var _typeof = {
        number: 'number',
        string: 'string',
        undefined: 'undefined',
        object: 'object',
        function: 'function'
    };
    /**
     * @returns whether the provided parameter is a JavaScript Array or not.
     */
    function isArray(array) {
        if (Array.isArray) {
            return Array.isArray(array);
        }
        if (array && typeof (array.length) === _typeof.number && array.constructor === Array) {
            return true;
        }
        return false;
    }
    exports.isArray = isArray;
    /**
     * @returns whether the provided parameter is a JavaScript String or not.
     */
    function isString(str) {
        if (typeof (str) === _typeof.string || str instanceof String) {
            return true;
        }
        return false;
    }
    exports.isString = isString;
    /**
     * @returns whether the provided parameter is a JavaScript Array and each element in the array is a string.
     */
    function isStringArray(value) {
        return isArray(value) && value.every(function (elem) { return isString(elem); });
    }
    exports.isStringArray = isStringArray;
    /**
     *
     * @returns whether the provided parameter is of type `object` but **not**
     *	`null`, an `array`, a `regexp`, nor a `date`.
     */
    function isObject(obj) {
        // The method can't do a type cast since there are type (like strings) which
        // are subclasses of any put not positvely matched by the function. Hence type
        // narrowing results in wrong results.
        return typeof obj === _typeof.object
            && obj !== null
            && !Array.isArray(obj)
            && !(obj instanceof RegExp)
            && !(obj instanceof Date);
    }
    exports.isObject = isObject;
    /**
     * In **contrast** to just checking `typeof` this will return `false` for `NaN`.
     * @returns whether the provided parameter is a JavaScript Number or not.
     */
    function isNumber(obj) {
        if ((typeof (obj) === _typeof.number || obj instanceof Number) && !isNaN(obj)) {
            return true;
        }
        return false;
    }
    exports.isNumber = isNumber;
    /**
     * @returns whether the provided parameter is a JavaScript Boolean or not.
     */
    function isBoolean(obj) {
        return obj === true || obj === false;
    }
    exports.isBoolean = isBoolean;
    /**
     * @returns whether the provided parameter is undefined.
     */
    function isUndefined(obj) {
        return typeof (obj) === _typeof.undefined;
    }
    exports.isUndefined = isUndefined;
    /**
     * @returns whether the provided parameter is undefined or null.
     */
    function isUndefinedOrNull(obj) {
        return isUndefined(obj) || obj === null;
    }
    exports.isUndefinedOrNull = isUndefinedOrNull;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    /**
     * @returns whether the provided parameter is an empty JavaScript Object or not.
     */
    function isEmptyObject(obj) {
        if (!isObject(obj)) {
            return false;
        }
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }
    exports.isEmptyObject = isEmptyObject;
    /**
     * @returns whether the provided parameter is a JavaScript Function or not.
     */
    function isFunction(obj) {
        return typeof obj === _typeof.function;
    }
    exports.isFunction = isFunction;
    /**
     * @returns whether the provided parameters is are JavaScript Function or not.
     */
    function areFunctions() {
        var objects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objects[_i] = arguments[_i];
        }
        return objects && objects.length > 0 && objects.every(isFunction);
    }
    exports.areFunctions = areFunctions;
    function validateConstraints(args, constraints) {
        var len = Math.min(args.length, constraints.length);
        for (var i = 0; i < len; i++) {
            validateConstraint(args[i], constraints[i]);
        }
    }
    exports.validateConstraints = validateConstraints;
    function validateConstraint(arg, constraint) {
        if (isString(constraint)) {
            if (typeof arg !== constraint) {
                throw new Error("argument does not match constraint: typeof " + constraint);
            }
        }
        else if (isFunction(constraint)) {
            if (arg instanceof constraint) {
                return;
            }
            if (!isUndefinedOrNull(arg) && arg.constructor === constraint) {
                return;
            }
            if (constraint.length === 1 && constraint.call(undefined, arg) === true) {
                return;
            }
            throw new Error("argument does not match one of these constraints: arg instanceof constraint, arg.constructor === constraint, nor constraint(arg) === true");
        }
    }
    exports.validateConstraint = validateConstraint;
    /**
     * Creates a new object of the provided class and will call the constructor with
     * any additional argument supplied.
     */
    function create(ctor) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var obj = Object.create(ctor.prototype);
        ctor.apply(obj, args);
        return obj;
    }
    exports.create = create;
});

define(__m[49/*vs/base/common/graph*/], __M([0/*require*/,1/*exports*/,9/*vs/base/common/types*/,35/*vs/base/common/collections*/]), function (require, exports, types_1, collections_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function newNode(data) {
        return {
            data: data,
            incoming: Object.create(null),
            outgoing: Object.create(null)
        };
    }
    var Graph = /** @class */ (function () {
        function Graph(_hashFn) {
            this._hashFn = _hashFn;
            this._nodes = Object.create(null);
            // empty
        }
        Graph.prototype.roots = function () {
            var ret = [];
            collections_1.forEach(this._nodes, function (entry) {
                if (types_1.isEmptyObject(entry.value.outgoing)) {
                    ret.push(entry.value);
                }
            });
            return ret;
        };
        Graph.prototype.traverse = function (start, inwards, callback) {
            var startNode = this.lookup(start);
            if (!startNode) {
                return;
            }
            this._traverse(startNode, inwards, Object.create(null), callback);
        };
        Graph.prototype._traverse = function (node, inwards, seen, callback) {
            var _this = this;
            var key = this._hashFn(node.data);
            if (seen[key]) {
                return;
            }
            seen[key] = true;
            callback(node.data);
            var nodes = inwards ? node.outgoing : node.incoming;
            collections_1.forEach(nodes, function (entry) { return _this._traverse(entry.value, inwards, seen, callback); });
        };
        Graph.prototype.insertEdge = function (from, to) {
            var fromNode = this.lookupOrInsertNode(from), toNode = this.lookupOrInsertNode(to);
            fromNode.outgoing[this._hashFn(to)] = toNode;
            toNode.incoming[this._hashFn(from)] = fromNode;
        };
        Graph.prototype.removeNode = function (data) {
            var key = this._hashFn(data);
            delete this._nodes[key];
            collections_1.forEach(this._nodes, function (entry) {
                delete entry.value.outgoing[key];
                delete entry.value.incoming[key];
            });
        };
        Graph.prototype.lookupOrInsertNode = function (data) {
            var key = this._hashFn(data);
            var node = this._nodes[key];
            if (!node) {
                node = newNode(data);
                this._nodes[key] = node;
            }
            return node;
        };
        Graph.prototype.lookup = function (data) {
            return this._nodes[this._hashFn(data)];
        };
        Object.defineProperty(Graph.prototype, "length", {
            get: function () {
                return Object.keys(this._nodes).length;
            },
            enumerable: true,
            configurable: true
        });
        Graph.prototype.toString = function () {
            var data = [];
            collections_1.forEach(this._nodes, function (entry) {
                data.push(entry.key + ", (incoming)[" + Object.keys(entry.value.incoming).join(', ') + "], (outgoing)[" + Object.keys(entry.value.outgoing).join(',') + "]");
            });
            return data.join('\n');
        };
        return Graph;
    }());
    exports.Graph = Graph;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[13/*vs/base/common/objects*/], __M([0/*require*/,1/*exports*/,9/*vs/base/common/types*/]), function (require, exports, types_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function deepClone(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        if (obj instanceof RegExp) {
            // See https://github.com/Microsoft/TypeScript/issues/10990
            return obj;
        }
        var result = Array.isArray(obj) ? [] : {};
        Object.keys(obj).forEach(function (key) {
            if (obj[key] && typeof obj[key] === 'object') {
                result[key] = deepClone(obj[key]);
            }
            else {
                result[key] = obj[key];
            }
        });
        return result;
    }
    exports.deepClone = deepClone;
    function deepFreeze(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        var stack = [obj];
        while (stack.length > 0) {
            var obj_1 = stack.shift();
            Object.freeze(obj_1);
            for (var key in obj_1) {
                if (_hasOwnProperty.call(obj_1, key)) {
                    var prop = obj_1[key];
                    if (typeof prop === 'object' && !Object.isFrozen(prop)) {
                        stack.push(prop);
                    }
                }
            }
        }
        return obj;
    }
    exports.deepFreeze = deepFreeze;
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    function cloneAndChange(obj, changer) {
        return _cloneAndChange(obj, changer, []);
    }
    exports.cloneAndChange = cloneAndChange;
    function _cloneAndChange(obj, changer, encounteredObjects) {
        if (types_1.isUndefinedOrNull(obj)) {
            return obj;
        }
        var changed = changer(obj);
        if (typeof changed !== 'undefined') {
            return changed;
        }
        if (types_1.isArray(obj)) {
            var r1 = [];
            for (var i1 = 0; i1 < obj.length; i1++) {
                r1.push(_cloneAndChange(obj[i1], changer, encounteredObjects));
            }
            return r1;
        }
        if (types_1.isObject(obj)) {
            if (encounteredObjects.indexOf(obj) >= 0) {
                throw new Error('Cannot clone recursive data-structure');
            }
            encounteredObjects.push(obj);
            var r2 = {};
            for (var i2 in obj) {
                if (_hasOwnProperty.call(obj, i2)) {
                    r2[i2] = _cloneAndChange(obj[i2], changer, encounteredObjects);
                }
            }
            encounteredObjects.pop();
            return r2;
        }
        return obj;
    }
    /**
     * Copies all properties of source into destination. The optional parameter "overwrite" allows to control
     * if existing properties on the destination should be overwritten or not. Defaults to true (overwrite).
     */
    function mixin(destination, source, overwrite) {
        if (overwrite === void 0) { overwrite = true; }
        if (!types_1.isObject(destination)) {
            return source;
        }
        if (types_1.isObject(source)) {
            Object.keys(source).forEach(function (key) {
                if (key in destination) {
                    if (overwrite) {
                        if (types_1.isObject(destination[key]) && types_1.isObject(source[key])) {
                            mixin(destination[key], source[key], overwrite);
                        }
                        else {
                            destination[key] = source[key];
                        }
                    }
                }
                else {
                    destination[key] = source[key];
                }
            });
        }
        return destination;
    }
    exports.mixin = mixin;
    function assign(destination) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        sources.forEach(function (source) { return Object.keys(source).forEach(function (key) { return destination[key] = source[key]; }); });
        return destination;
    }
    exports.assign = assign;
    function equals(one, other) {
        if (one === other) {
            return true;
        }
        if (one === null || one === undefined || other === null || other === undefined) {
            return false;
        }
        if (typeof one !== typeof other) {
            return false;
        }
        if (typeof one !== 'object') {
            return false;
        }
        if ((Array.isArray(one)) !== (Array.isArray(other))) {
            return false;
        }
        var i;
        var key;
        if (Array.isArray(one)) {
            if (one.length !== other.length) {
                return false;
            }
            for (i = 0; i < one.length; i++) {
                if (!equals(one[i], other[i])) {
                    return false;
                }
            }
        }
        else {
            var oneKeys = [];
            for (key in one) {
                oneKeys.push(key);
            }
            oneKeys.sort();
            var otherKeys = [];
            for (key in other) {
                otherKeys.push(key);
            }
            otherKeys.sort();
            if (!equals(oneKeys, otherKeys)) {
                return false;
            }
            for (i = 0; i < oneKeys.length; i++) {
                if (!equals(one[oneKeys[i]], other[oneKeys[i]])) {
                    return false;
                }
            }
        }
        return true;
    }
    exports.equals = equals;
    function arrayToHash(array) {
        var result = {};
        for (var i = 0; i < array.length; ++i) {
            result[array[i]] = true;
        }
        return result;
    }
    exports.arrayToHash = arrayToHash;
    /**
     * Given an array of strings, returns a function which, given a string
     * returns true or false whether the string is in that array.
     */
    function createKeywordMatcher(arr, caseInsensitive) {
        if (caseInsensitive === void 0) { caseInsensitive = false; }
        if (caseInsensitive) {
            arr = arr.map(function (x) { return x.toLowerCase(); });
        }
        var hash = arrayToHash(arr);
        if (caseInsensitive) {
            return function (word) {
                return hash[word.toLowerCase()] !== undefined && hash.hasOwnProperty(word.toLowerCase());
            };
        }
        else {
            return function (word) {
                return hash[word] !== undefined && hash.hasOwnProperty(word);
            };
        }
    }
    exports.createKeywordMatcher = createKeywordMatcher;
    /**
     * Calls JSON.Stringify with a replacer to break apart any circular references.
     * This prevents JSON.stringify from throwing the exception
     *  "Uncaught TypeError: Converting circular structure to JSON"
     */
    function safeStringify(obj) {
        var seen = [];
        return JSON.stringify(obj, function (key, value) {
            if (types_1.isObject(value) || Array.isArray(value)) {
                if (seen.indexOf(value) !== -1) {
                    return '[Circular]';
                }
                else {
                    seen.push(value);
                }
            }
            return value;
        });
    }
    exports.safeStringify = safeStringify;
    function getOrDefault(obj, fn, defaultValue) {
        if (defaultValue === void 0) { defaultValue = null; }
        var result = fn(obj);
        return typeof result === 'undefined' ? defaultValue : result;
    }
    exports.getOrDefault = getOrDefault;
    /**
     * Returns an object that has keys for each value that is different in the base object. Keys
     * that do not exist in the target but in the base object are not considered.
     *
     * Note: This is not a deep-diffing method, so the values are strictly taken into the resulting
     * object if they differ.
     *
     * @param base the object to diff against
     * @param obj the object to use for diffing
     */
    function distinct(base, target) {
        var result = Object.create(null);
        if (!base || !target) {
            return result;
        }
        var targetKeys = Object.keys(target);
        targetKeys.forEach(function (k) {
            var baseValue = base[k];
            var targetValue = target[k];
            if (!equals(baseValue, targetValue)) {
                result[k] = targetValue;
            }
        });
        return result;
    }
    exports.distinct = distinct;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(__m[8/*vs/base/common/uri*/], __M([0/*require*/,1/*exports*/,4/*vs/base/common/platform*/]), function (require, exports, platform_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var _a;
    var _schemePattern = /^\w[\w\d+.-]*$/;
    var _singleSlashStart = /^\//;
    var _doubleSlashStart = /^\/\//;
    function _validateUri(ret) {
        // scheme, https://tools.ietf.org/html/rfc3986#section-3.1
        // ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
        if (ret.scheme && !_schemePattern.test(ret.scheme)) {
            throw new Error('[UriError]: Scheme contains illegal characters.');
        }
        // path, http://tools.ietf.org/html/rfc3986#section-3.3
        // If a URI contains an authority component, then the path component
        // must either be empty or begin with a slash ("/") character.  If a URI
        // does not contain an authority component, then the path cannot begin
        // with two slash characters ("//").
        if (ret.path) {
            if (ret.authority) {
                if (!_singleSlashStart.test(ret.path)) {
                    throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
                }
            }
            else {
                if (_doubleSlashStart.test(ret.path)) {
                    throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
                }
            }
        }
    }
    // implements a bit of https://tools.ietf.org/html/rfc3986#section-5
    function _referenceResolution(scheme, path) {
        // the slash-character is our 'default base' as we don't
        // support constructing URIs relative to other URIs. This
        // also means that we alter and potentially break paths.
        // see https://tools.ietf.org/html/rfc3986#section-5.1.4
        switch (scheme) {
            case 'https':
            case 'http':
            case 'file':
                if (!path) {
                    path = _slash;
                }
                else if (path[0] !== _slash) {
                    path = _slash + path;
                }
                break;
        }
        return path;
    }
    var _empty = '';
    var _slash = '/';
    var _regexp = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
    /**
     * Uniform Resource Identifier (URI) http://tools.ietf.org/html/rfc3986.
     * This class is a simple parser which creates the basic component paths
     * (http://tools.ietf.org/html/rfc3986#section-3) with minimal validation
     * and encoding.
     *
     *       foo://example.com:8042/over/there?name=ferret#nose
     *       \_/   \______________/\_________/ \_________/ \__/
     *        |           |            |            |        |
     *     scheme     authority       path        query   fragment
     *        |   _____________________|__
     *       / \ /                        \
     *       urn:example:animal:ferret:nose
     *
     *
     */
    var URI = /** @class */ (function () {
        /**
         * @internal
         */
        function URI(schemeOrData, authority, path, query, fragment) {
            if (typeof schemeOrData === 'object') {
                this.scheme = schemeOrData.scheme || _empty;
                this.authority = schemeOrData.authority || _empty;
                this.path = schemeOrData.path || _empty;
                this.query = schemeOrData.query || _empty;
                this.fragment = schemeOrData.fragment || _empty;
                // no validation because it's this URI
                // that creates uri components.
                // _validateUri(this);
            }
            else {
                this.scheme = schemeOrData || _empty;
                this.authority = authority || _empty;
                this.path = _referenceResolution(this.scheme, path || _empty);
                this.query = query || _empty;
                this.fragment = fragment || _empty;
                _validateUri(this);
            }
        }
        URI.isUri = function (thing) {
            if (thing instanceof URI) {
                return true;
            }
            if (!thing) {
                return false;
            }
            return typeof thing.authority === 'string'
                && typeof thing.fragment === 'string'
                && typeof thing.path === 'string'
                && typeof thing.query === 'string'
                && typeof thing.scheme === 'string';
        };
        Object.defineProperty(URI.prototype, "fsPath", {
            // ---- filesystem path -----------------------
            /**
             * Returns a string representing the corresponding file system path of this URI.
             * Will handle UNC paths and normalize windows drive letters to lower-case. Also
             * uses the platform specific path separator. Will *not* validate the path for
             * invalid characters and semantics. Will *not* look at the scheme of this URI.
             */
            get: function () {
                return _makeFsPath(this);
            },
            enumerable: true,
            configurable: true
        });
        // ---- modify to new -------------------------
        URI.prototype.with = function (change) {
            if (!change) {
                return this;
            }
            var scheme = change.scheme, authority = change.authority, path = change.path, query = change.query, fragment = change.fragment;
            if (scheme === void 0) {
                scheme = this.scheme;
            }
            else if (scheme === null) {
                scheme = _empty;
            }
            if (authority === void 0) {
                authority = this.authority;
            }
            else if (authority === null) {
                authority = _empty;
            }
            if (path === void 0) {
                path = this.path;
            }
            else if (path === null) {
                path = _empty;
            }
            if (query === void 0) {
                query = this.query;
            }
            else if (query === null) {
                query = _empty;
            }
            if (fragment === void 0) {
                fragment = this.fragment;
            }
            else if (fragment === null) {
                fragment = _empty;
            }
            if (scheme === this.scheme
                && authority === this.authority
                && path === this.path
                && query === this.query
                && fragment === this.fragment) {
                return this;
            }
            return new _URI(scheme, authority, path, query, fragment);
        };
        // ---- parse & validate ------------------------
        URI.parse = function (value) {
            var match = _regexp.exec(value);
            if (!match) {
                return new _URI(_empty, _empty, _empty, _empty, _empty);
            }
            return new _URI(match[2] || _empty, decodeURIComponent(match[4] || _empty), decodeURIComponent(match[5] || _empty), decodeURIComponent(match[7] || _empty), decodeURIComponent(match[9] || _empty));
        };
        URI.file = function (path) {
            var authority = _empty;
            // normalize to fwd-slashes on windows,
            // on other systems bwd-slashes are valid
            // filename character, eg /f\oo/ba\r.txt
            if (platform_1.isWindows) {
                path = path.replace(/\\/g, _slash);
            }
            // check for authority as used in UNC shares
            // or use the path as given
            if (path[0] === _slash && path[1] === _slash) {
                var idx = path.indexOf(_slash, 2);
                if (idx === -1) {
                    authority = path.substring(2);
                    path = _slash;
                }
                else {
                    authority = path.substring(2, idx);
                    path = path.substring(idx) || _slash;
                }
            }
            return new _URI('file', authority, path, _empty, _empty);
        };
        URI.from = function (components) {
            return new _URI(components.scheme, components.authority, components.path, components.query, components.fragment);
        };
        // ---- printing/externalize ---------------------------
        /**
         *
         * @param skipEncoding Do not encode the result, default is `false`
         */
        URI.prototype.toString = function (skipEncoding) {
            if (skipEncoding === void 0) { skipEncoding = false; }
            return _asFormatted(this, skipEncoding);
        };
        URI.prototype.toJSON = function () {
            return this;
        };
        URI.revive = function (data) {
            if (!data) {
                return data;
            }
            else if (data instanceof URI) {
                return data;
            }
            else {
                var result = new _URI(data);
                result._fsPath = data.fsPath;
                result._formatted = data.external;
                return result;
            }
        };
        return URI;
    }());
    exports.default = URI;
    // tslint:disable-next-line:class-name
    var _URI = /** @class */ (function (_super) {
        __extends(_URI, _super);
        function _URI() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._formatted = null;
            _this._fsPath = null;
            return _this;
        }
        Object.defineProperty(_URI.prototype, "fsPath", {
            get: function () {
                if (!this._fsPath) {
                    this._fsPath = _makeFsPath(this);
                }
                return this._fsPath;
            },
            enumerable: true,
            configurable: true
        });
        _URI.prototype.toString = function (skipEncoding) {
            if (skipEncoding === void 0) { skipEncoding = false; }
            if (!skipEncoding) {
                if (!this._formatted) {
                    this._formatted = _asFormatted(this, false);
                }
                return this._formatted;
            }
            else {
                // we don't cache that
                return _asFormatted(this, true);
            }
        };
        _URI.prototype.toJSON = function () {
            var res = {
                $mid: 1
            };
            // cached state
            if (this._fsPath) {
                res.fsPath = this._fsPath;
            }
            if (this._formatted) {
                res.external = this._formatted;
            }
            // uri components
            if (this.path) {
                res.path = this.path;
            }
            if (this.scheme) {
                res.scheme = this.scheme;
            }
            if (this.authority) {
                res.authority = this.authority;
            }
            if (this.query) {
                res.query = this.query;
            }
            if (this.fragment) {
                res.fragment = this.fragment;
            }
            return res;
        };
        return _URI;
    }(URI));
    // reserved characters: https://tools.ietf.org/html/rfc3986#section-2.2
    var encodeTable = (_a = {},
        _a[58 /* Colon */] = '%3A',
        _a[47 /* Slash */] = '%2F',
        _a[63 /* QuestionMark */] = '%3F',
        _a[35 /* Hash */] = '%23',
        _a[91 /* OpenSquareBracket */] = '%5B',
        _a[93 /* CloseSquareBracket */] = '%5D',
        _a[64 /* AtSign */] = '%40',
        _a[33 /* ExclamationMark */] = '%21',
        _a[36 /* DollarSign */] = '%24',
        _a[38 /* Ampersand */] = '%26',
        _a[39 /* SingleQuote */] = '%27',
        _a[40 /* OpenParen */] = '%28',
        _a[41 /* CloseParen */] = '%29',
        _a[42 /* Asterisk */] = '%2A',
        _a[43 /* Plus */] = '%2B',
        _a[44 /* Comma */] = '%2C',
        _a[59 /* Semicolon */] = '%3B',
        _a[61 /* Equals */] = '%3D',
        _a[32 /* Space */] = '%20',
        _a);
    function encodeURIComponentFast(uriComponent, allowSlash) {
        var res = undefined;
        var nativeEncodePos = -1;
        for (var pos = 0; pos < uriComponent.length; pos++) {
            var code = uriComponent.charCodeAt(pos);
            // unreserved characters: https://tools.ietf.org/html/rfc3986#section-2.3
            if ((code >= 97 /* a */ && code <= 122 /* z */)
                || (code >= 65 /* A */ && code <= 90 /* Z */)
                || (code >= 48 /* Digit0 */ && code <= 57 /* Digit9 */)
                || code === 45 /* Dash */
                || code === 46 /* Period */
                || code === 95 /* Underline */
                || code === 126 /* Tilde */
                || (allowSlash && code === 47 /* Slash */)) {
                // check if we are delaying native encode
                if (nativeEncodePos !== -1) {
                    res += encodeURIComponent(uriComponent.substring(nativeEncodePos, pos));
                    nativeEncodePos = -1;
                }
                // check if we write into a new string (by default we try to return the param)
                if (res !== undefined) {
                    res += uriComponent.charAt(pos);
                }
            }
            else {
                // encoding needed, we need to allocate a new string
                if (res === undefined) {
                    res = uriComponent.substr(0, pos);
                }
                // check with default table first
                var escaped = encodeTable[code];
                if (escaped !== undefined) {
                    // check if we are delaying native encode
                    if (nativeEncodePos !== -1) {
                        res += encodeURIComponent(uriComponent.substring(nativeEncodePos, pos));
                        nativeEncodePos = -1;
                    }
                    // append escaped variant to result
                    res += escaped;
                }
                else if (nativeEncodePos === -1) {
                    // use native encode only when needed
                    nativeEncodePos = pos;
                }
            }
        }
        if (nativeEncodePos !== -1) {
            res += encodeURIComponent(uriComponent.substring(nativeEncodePos));
        }
        return res !== undefined ? res : uriComponent;
    }
    function encodeURIComponentMinimal(path) {
        var res = undefined;
        for (var pos = 0; pos < path.length; pos++) {
            var code = path.charCodeAt(pos);
            if (code === 35 /* Hash */ || code === 63 /* QuestionMark */) {
                if (res === undefined) {
                    res = path.substr(0, pos);
                }
                res += encodeTable[code];
            }
            else {
                if (res !== undefined) {
                    res += path[pos];
                }
            }
        }
        return res !== undefined ? res : path;
    }
    /**
     * Compute `fsPath` for the given uri
     * @param uri
     */
    function _makeFsPath(uri) {
        var value;
        if (uri.authority && uri.path.length > 1 && uri.scheme === 'file') {
            // unc path: file://shares/c$/far/boo
            value = "//" + uri.authority + uri.path;
        }
        else if (uri.path.charCodeAt(0) === 47 /* Slash */
            && (uri.path.charCodeAt(1) >= 65 /* A */ && uri.path.charCodeAt(1) <= 90 /* Z */ || uri.path.charCodeAt(1) >= 97 /* a */ && uri.path.charCodeAt(1) <= 122 /* z */)
            && uri.path.charCodeAt(2) === 58 /* Colon */) {
            // windows drive letter: file:///c:/far/boo
            value = uri.path[1].toLowerCase() + uri.path.substr(2);
        }
        else {
            // other path
            value = uri.path;
        }
        if (platform_1.isWindows) {
            value = value.replace(/\//g, '\\');
        }
        return value;
    }
    /**
     * Create the external version of a uri
     */
    function _asFormatted(uri, skipEncoding) {
        var encoder = !skipEncoding
            ? encodeURIComponentFast
            : encodeURIComponentMinimal;
        var res = '';
        var scheme = uri.scheme, authority = uri.authority, path = uri.path, query = uri.query, fragment = uri.fragment;
        if (scheme) {
            res += scheme;
            res += ':';
        }
        if (authority || scheme === 'file') {
            res += _slash;
            res += _slash;
        }
        if (authority) {
            var idx = authority.indexOf('@');
            if (idx !== -1) {
                // <user>@<auth>
                var userinfo = authority.substr(0, idx);
                authority = authority.substr(idx + 1);
                idx = userinfo.indexOf(':');
                if (idx === -1) {
                    res += encoder(userinfo, false);
                }
                else {
                    // <user>:<pass>@<auth>
                    res += encoder(userinfo.substr(0, idx), false);
                    res += ':';
                    res += encoder(userinfo.substr(idx + 1), false);
                }
                res += '@';
            }
            authority = authority.toLowerCase();
            idx = authority.indexOf(':');
            if (idx === -1) {
                res += encoder(authority, false);
            }
            else {
                // <auth>:<port>
                res += encoder(authority.substr(0, idx), false);
                res += authority.substr(idx);
            }
        }
        if (path) {
            // lower-case windows drive letters in /C:/fff or C:/fff
            if (path.length >= 3 && path.charCodeAt(0) === 47 /* Slash */ && path.charCodeAt(2) === 58 /* Colon */) {
                var code = path.charCodeAt(1);
                if (code >= 65 /* A */ && code <= 90 /* Z */) {
                    path = "/" + String.fromCharCode(code + 32) + ":" + path.substr(3); // "/c:".length === 3
                }
            }
            else if (path.length >= 2 && path.charCodeAt(1) === 58 /* Colon */) {
                var code = path.charCodeAt(0);
                if (code >= 65 /* A */ && code <= 90 /* Z */) {
                    path = String.fromCharCode(code + 32) + ":" + path.substr(2); // "/c:".length === 3
                }
            }
            // encode the rest of the path
            res += encoder(path, true);
        }
        if (query) {
            res += '?';
            res += encoder(query, false);
        }
        if (fragment) {
            res += '#';
            res += !skipEncoding ? encodeURIComponentFast(fragment, false) : fragment;
        }
        return res;
    }
});

define(__m[60/*vs/base/common/labels*/], __M([0/*require*/,1/*exports*/,8/*vs/base/common/uri*/,10/*vs/base/common/paths*/,5/*vs/base/common/strings*/,23/*vs/base/common/network*/,4/*vs/base/common/platform*/,37/*vs/base/common/resources*/]), function (require, exports, uri_1, paths_1, strings_1, network_1, platform_1, resources_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @deprecated use UriLabelService instead
     */
    function getPathLabel(resource, userHomeProvider, rootProvider) {
        if (!resource) {
            return null;
        }
        if (typeof resource === 'string') {
            resource = uri_1.default.file(resource);
        }
        // return early if we can resolve a relative path label from the root
        var baseResource = rootProvider ? rootProvider.getWorkspaceFolder(resource) : null;
        if (baseResource) {
            var hasMultipleRoots = rootProvider.getWorkspace().folders.length > 1;
            var pathLabel = void 0;
            if (resources_1.isEqual(baseResource.uri, resource, !platform_1.isLinux)) {
                pathLabel = ''; // no label if paths are identical
            }
            else {
                pathLabel = paths_1.normalize(strings_1.ltrim(resource.path.substr(baseResource.uri.path.length), paths_1.sep), true);
            }
            if (hasMultipleRoots) {
                var rootName = (baseResource && baseResource.name) ? baseResource.name : paths_1.basename(baseResource.uri.fsPath);
                pathLabel = pathLabel ? (rootName + ' • ' + pathLabel) : rootName; // always show root basename if there are multiple
            }
            return pathLabel;
        }
        // return if the resource is neither file:// nor untitled:// and no baseResource was provided
        if (resource.scheme !== network_1.Schemas.file && resource.scheme !== network_1.Schemas.untitled) {
            return resource.with({ query: null, fragment: null }).toString(true);
        }
        // convert c:\something => C:\something
        if (hasDriveLetter(resource.fsPath)) {
            return paths_1.normalize(normalizeDriveLetter(resource.fsPath), true);
        }
        // normalize and tildify (macOS, Linux only)
        var res = paths_1.normalize(resource.fsPath, true);
        if (!platform_1.isWindows && userHomeProvider) {
            res = tildify(res, userHomeProvider.userHome);
        }
        return res;
    }
    exports.getPathLabel = getPathLabel;
    function getBaseLabel(resource) {
        if (!resource) {
            return null;
        }
        if (typeof resource === 'string') {
            resource = uri_1.default.file(resource);
        }
        var base = paths_1.basename(resource.path) || (resource.scheme === network_1.Schemas.file ? resource.fsPath : resource.path) /* can be empty string if '/' is passed in */;
        // convert c: => C:
        if (hasDriveLetter(base)) {
            return normalizeDriveLetter(base);
        }
        return base;
    }
    exports.getBaseLabel = getBaseLabel;
    function hasDriveLetter(path) {
        return platform_1.isWindows && path && path[1] === ':';
    }
    function normalizeDriveLetter(path) {
        if (hasDriveLetter(path)) {
            return path.charAt(0).toUpperCase() + path.slice(1);
        }
        return path;
    }
    exports.normalizeDriveLetter = normalizeDriveLetter;
    var normalizedUserHomeCached = Object.create(null);
    function tildify(path, userHome) {
        if (platform_1.isWindows || !path || !userHome) {
            return path; // unsupported
        }
        // Keep a normalized user home path as cache to prevent accumulated string creation
        var normalizedUserHome = normalizedUserHomeCached.original === userHome ? normalizedUserHomeCached.normalized : void 0;
        if (!normalizedUserHome) {
            normalizedUserHome = "" + strings_1.rtrim(userHome, paths_1.sep) + paths_1.sep;
            normalizedUserHomeCached = { original: userHome, normalized: normalizedUserHome };
        }
        // Linux: case sensitive, macOS: case insensitive
        if (platform_1.isLinux ? strings_1.startsWith(path, normalizedUserHome) : strings_1.startsWithIgnoreCase(path, normalizedUserHome)) {
            path = "~/" + path.substr(normalizedUserHome.length);
        }
        return path;
    }
    exports.tildify = tildify;
    function untildify(path, userHome) {
        return path.replace(/^~($|\/|\\)/, userHome + "$1");
    }
    exports.untildify = untildify;
    /**
     * Shortens the paths but keeps them easy to distinguish.
     * Replaces not important parts with ellipsis.
     * Every shorten path matches only one original path and vice versa.
     *
     * Algorithm for shortening paths is as follows:
     * 1. For every path in list, find unique substring of that path.
     * 2. Unique substring along with ellipsis is shortened path of that path.
     * 3. To find unique substring of path, consider every segment of length from 1 to path.length of path from end of string
     *    and if present segment is not substring to any other paths then present segment is unique path,
     *    else check if it is not present as suffix of any other path and present segment is suffix of path itself,
     *    if it is true take present segment as unique path.
     * 4. Apply ellipsis to unique segment according to whether segment is present at start/in-between/end of path.
     *
     * Example 1
     * 1. consider 2 paths i.e. ['a\\b\\c\\d', 'a\\f\\b\\c\\d']
     * 2. find unique path of first path,
     * 	a. 'd' is present in path2 and is suffix of path2, hence not unique of present path.
     * 	b. 'c' is present in path2 and 'c' is not suffix of present path, similarly for 'b' and 'a' also.
     * 	c. 'd\\c' is suffix of path2.
     *  d. 'b\\c' is not suffix of present path.
     *  e. 'a\\b' is not present in path2, hence unique path is 'a\\b...'.
     * 3. for path2, 'f' is not present in path1 hence unique is '...\\f\\...'.
     *
     * Example 2
     * 1. consider 2 paths i.e. ['a\\b', 'a\\b\\c'].
     * 	a. Even if 'b' is present in path2, as 'b' is suffix of path1 and is not suffix of path2, unique path will be '...\\b'.
     * 2. for path2, 'c' is not present in path1 hence unique path is '..\\c'.
     */
    var ellipsis = '\u2026';
    var unc = '\\\\';
    var home = '~';
    function shorten(paths) {
        var shortenedPaths = new Array(paths.length);
        // for every path
        var match = false;
        for (var pathIndex = 0; pathIndex < paths.length; pathIndex++) {
            var path = paths[pathIndex];
            if (path === '') {
                shortenedPaths[pathIndex] = "." + paths_1.nativeSep;
                continue;
            }
            if (!path) {
                shortenedPaths[pathIndex] = path;
                continue;
            }
            match = true;
            // trim for now and concatenate unc path (e.g. \\network) or root path (/etc, ~/etc) later
            var prefix = '';
            if (path.indexOf(unc) === 0) {
                prefix = path.substr(0, path.indexOf(unc) + unc.length);
                path = path.substr(path.indexOf(unc) + unc.length);
            }
            else if (path.indexOf(paths_1.nativeSep) === 0) {
                prefix = path.substr(0, path.indexOf(paths_1.nativeSep) + paths_1.nativeSep.length);
                path = path.substr(path.indexOf(paths_1.nativeSep) + paths_1.nativeSep.length);
            }
            else if (path.indexOf(home) === 0) {
                prefix = path.substr(0, path.indexOf(home) + home.length);
                path = path.substr(path.indexOf(home) + home.length);
            }
            // pick the first shortest subpath found
            var segments = path.split(paths_1.nativeSep);
            for (var subpathLength = 1; match && subpathLength <= segments.length; subpathLength++) {
                for (var start = segments.length - subpathLength; match && start >= 0; start--) {
                    match = false;
                    var subpath = segments.slice(start, start + subpathLength).join(paths_1.nativeSep);
                    // that is unique to any other path
                    for (var otherPathIndex = 0; !match && otherPathIndex < paths.length; otherPathIndex++) {
                        // suffix subpath treated specially as we consider no match 'x' and 'x/...'
                        if (otherPathIndex !== pathIndex && paths[otherPathIndex] && paths[otherPathIndex].indexOf(subpath) > -1) {
                            var isSubpathEnding = (start + subpathLength === segments.length);
                            // Adding separator as prefix for subpath, such that 'endsWith(src, trgt)' considers subpath as directory name instead of plain string.
                            // prefix is not added when either subpath is root directory or path[otherPathIndex] does not have multiple directories.
                            var subpathWithSep = (start > 0 && paths[otherPathIndex].indexOf(paths_1.nativeSep) > -1) ? paths_1.nativeSep + subpath : subpath;
                            var isOtherPathEnding = strings_1.endsWith(paths[otherPathIndex], subpathWithSep);
                            match = !isSubpathEnding || isOtherPathEnding;
                        }
                    }
                    // found unique subpath
                    if (!match) {
                        var result = '';
                        // preserve disk drive or root prefix
                        if (strings_1.endsWith(segments[0], ':') || prefix !== '') {
                            if (start === 1) {
                                // extend subpath to include disk drive prefix
                                start = 0;
                                subpathLength++;
                                subpath = segments[0] + paths_1.nativeSep + subpath;
                            }
                            if (start > 0) {
                                result = segments[0] + paths_1.nativeSep;
                            }
                            result = prefix + result;
                        }
                        // add ellipsis at the beginning if neeeded
                        if (start > 0) {
                            result = result + ellipsis + paths_1.nativeSep;
                        }
                        result = result + subpath;
                        // add ellipsis at the end if needed
                        if (start + subpathLength < segments.length) {
                            result = result + paths_1.nativeSep + ellipsis;
                        }
                        shortenedPaths[pathIndex] = result;
                    }
                }
            }
            if (match) {
                shortenedPaths[pathIndex] = path; // use full path if no unique subpaths found
            }
        }
        return shortenedPaths;
    }
    exports.shorten = shorten;
    var Type;
    (function (Type) {
        Type[Type["TEXT"] = 0] = "TEXT";
        Type[Type["VARIABLE"] = 1] = "VARIABLE";
        Type[Type["SEPARATOR"] = 2] = "SEPARATOR";
    })(Type || (Type = {}));
    /**
     * Helper to insert values for specific template variables into the string. E.g. "this $(is) a $(template)" can be
     * passed to this function together with an object that maps "is" and "template" to strings to have them replaced.
     * @param value string to which templating is applied
     * @param values the values of the templates to use
     */
    function template(template, values) {
        if (values === void 0) { values = Object.create(null); }
        var segments = [];
        var inVariable = false;
        var char;
        var curVal = '';
        for (var i = 0; i < template.length; i++) {
            char = template[i];
            // Beginning of variable
            if (char === '$' || (inVariable && char === '{')) {
                if (curVal) {
                    segments.push({ value: curVal, type: Type.TEXT });
                }
                curVal = '';
                inVariable = true;
            }
            // End of variable
            else if (char === '}' && inVariable) {
                var resolved = values[curVal];
                // Variable
                if (typeof resolved === 'string') {
                    if (resolved.length) {
                        segments.push({ value: resolved, type: Type.VARIABLE });
                    }
                }
                // Separator
                else if (resolved) {
                    var prevSegment = segments[segments.length - 1];
                    if (!prevSegment || prevSegment.type !== Type.SEPARATOR) {
                        segments.push({ value: resolved.label, type: Type.SEPARATOR }); // prevent duplicate separators
                    }
                }
                curVal = '';
                inVariable = false;
            }
            // Text or Variable Name
            else {
                curVal += char;
            }
        }
        // Tail
        if (curVal && !inVariable) {
            segments.push({ value: curVal, type: Type.TEXT });
        }
        return segments.filter(function (segment, index) {
            // Only keep separator if we have values to the left and right
            if (segment.type === Type.SEPARATOR) {
                var left = segments[index - 1];
                var right = segments[index + 1];
                return [left, right].every(function (segment) { return segment && (segment.type === Type.VARIABLE || segment.type === Type.TEXT) && segment.value.length > 0; });
            }
            // accept any TEXT and VARIABLE
            return true;
        }).map(function (segment) { return segment.value; }).join('');
    }
    exports.template = template;
    /**
     * Handles mnemonics for menu items. Depending on OS:
     * - Windows: Supported via & character (replace && with &)
     * -   Linux: Supported via & character (replace && with &)
     * -   macOS: Unsupported (replace && with empty string)
     */
    function mnemonicMenuLabel(label, forceDisableMnemonics) {
        if (platform_1.isMacintosh || forceDisableMnemonics) {
            return label.replace(/\(&&\w\)|&&/g, '');
        }
        return label.replace(/&&/g, '&');
    }
    exports.mnemonicMenuLabel = mnemonicMenuLabel;
    /**
     * Handles mnemonics for buttons. Depending on OS:
     * - Windows: Supported via & character (replace && with &)
     * -   Linux: Supported via _ character (replace && with _)
     * -   macOS: Unsupported (replace && with empty string)
     */
    function mnemonicButtonLabel(label) {
        if (platform_1.isMacintosh) {
            return label.replace(/\(&&\w\)|&&/g, '');
        }
        return label.replace(/&&/g, platform_1.isWindows ? '&' : '_');
    }
    exports.mnemonicButtonLabel = mnemonicButtonLabel;
    function unmnemonicLabel(label) {
        return label.replace(/&/g, '&&');
    }
    exports.unmnemonicLabel = unmnemonicLabel;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/










define(__m[32/*vs/base/common/map*/], __M([0/*require*/,1/*exports*/,8/*vs/base/common/uri*/]), function (require, exports, uri_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function values(forEachable) {
        var result = [];
        forEachable.forEach(function (value) { return result.push(value); });
        return result;
    }
    exports.values = values;
    function keys(map) {
        var result = [];
        map.forEach(function (value, key) { return result.push(key); });
        return result;
    }
    exports.keys = keys;
    function getOrSet(map, key, value) {
        var result = map.get(key);
        if (result === void 0) {
            result = value;
            map.set(key, result);
        }
        return result;
    }
    exports.getOrSet = getOrSet;
    var StringIterator = /** @class */ (function () {
        function StringIterator() {
            this._value = '';
            this._pos = 0;
        }
        StringIterator.prototype.reset = function (key) {
            this._value = key;
            this._pos = 0;
            return this;
        };
        StringIterator.prototype.next = function () {
            this._pos += 1;
            return this;
        };
        StringIterator.prototype.hasNext = function () {
            return this._pos < this._value.length - 1;
        };
        StringIterator.prototype.cmp = function (a) {
            var aCode = a.charCodeAt(0);
            var thisCode = this._value.charCodeAt(this._pos);
            return aCode - thisCode;
        };
        StringIterator.prototype.value = function () {
            return this._value[this._pos];
        };
        return StringIterator;
    }());
    exports.StringIterator = StringIterator;
    var PathIterator = /** @class */ (function () {
        function PathIterator() {
        }
        PathIterator.prototype.reset = function (key) {
            this._value = key.replace(/\\$|\/$/, '');
            this._from = 0;
            this._to = 0;
            return this.next();
        };
        PathIterator.prototype.hasNext = function () {
            return this._to < this._value.length;
        };
        PathIterator.prototype.next = function () {
            // this._data = key.split(/[\\/]/).filter(s => !!s);
            this._from = this._to;
            var justSeps = true;
            for (; this._to < this._value.length; this._to++) {
                var ch = this._value.charCodeAt(this._to);
                if (ch === 47 /* Slash */ || ch === 92 /* Backslash */) {
                    if (justSeps) {
                        this._from++;
                    }
                    else {
                        break;
                    }
                }
                else {
                    justSeps = false;
                }
            }
            return this;
        };
        PathIterator.prototype.cmp = function (a) {
            var aPos = 0;
            var aLen = a.length;
            var thisPos = this._from;
            while (aPos < aLen && thisPos < this._to) {
                var cmp = a.charCodeAt(aPos) - this._value.charCodeAt(thisPos);
                if (cmp !== 0) {
                    return cmp;
                }
                aPos += 1;
                thisPos += 1;
            }
            if (aLen === this._to - this._from) {
                return 0;
            }
            else if (aPos < aLen) {
                return -1;
            }
            else {
                return 1;
            }
        };
        PathIterator.prototype.value = function () {
            return this._value.substring(this._from, this._to);
        };
        return PathIterator;
    }());
    exports.PathIterator = PathIterator;
    var TernarySearchTreeNode = /** @class */ (function () {
        function TernarySearchTreeNode() {
        }
        TernarySearchTreeNode.prototype.isEmpty = function () {
            return !this.left && !this.mid && !this.right && !this.value;
        };
        return TernarySearchTreeNode;
    }());
    var TernarySearchTree = /** @class */ (function () {
        function TernarySearchTree(segments) {
            this._iter = segments;
        }
        TernarySearchTree.forPaths = function () {
            return new TernarySearchTree(new PathIterator());
        };
        TernarySearchTree.forStrings = function () {
            return new TernarySearchTree(new StringIterator());
        };
        TernarySearchTree.prototype.clear = function () {
            this._root = undefined;
        };
        TernarySearchTree.prototype.set = function (key, element) {
            var iter = this._iter.reset(key);
            var node;
            if (!this._root) {
                this._root = new TernarySearchTreeNode();
                this._root.segment = iter.value();
            }
            node = this._root;
            while (true) {
                var val = iter.cmp(node.segment);
                if (val > 0) {
                    // left
                    if (!node.left) {
                        node.left = new TernarySearchTreeNode();
                        node.left.segment = iter.value();
                    }
                    node = node.left;
                }
                else if (val < 0) {
                    // right
                    if (!node.right) {
                        node.right = new TernarySearchTreeNode();
                        node.right.segment = iter.value();
                    }
                    node = node.right;
                }
                else if (iter.hasNext()) {
                    // mid
                    iter.next();
                    if (!node.mid) {
                        node.mid = new TernarySearchTreeNode();
                        node.mid.segment = iter.value();
                    }
                    node = node.mid;
                }
                else {
                    break;
                }
            }
            var oldElement = node.value;
            node.value = element;
            node.key = key;
            return oldElement;
        };
        TernarySearchTree.prototype.get = function (key) {
            var iter = this._iter.reset(key);
            var node = this._root;
            while (node) {
                var val = iter.cmp(node.segment);
                if (val > 0) {
                    // left
                    node = node.left;
                }
                else if (val < 0) {
                    // right
                    node = node.right;
                }
                else if (iter.hasNext()) {
                    // mid
                    iter.next();
                    node = node.mid;
                }
                else {
                    break;
                }
            }
            return node ? node.value : undefined;
        };
        TernarySearchTree.prototype.delete = function (key) {
            var iter = this._iter.reset(key);
            var stack = [];
            var node = this._root;
            // find and unset node
            while (node) {
                var val = iter.cmp(node.segment);
                if (val > 0) {
                    // left
                    stack.push([1, node]);
                    node = node.left;
                }
                else if (val < 0) {
                    // right
                    stack.push([-1, node]);
                    node = node.right;
                }
                else if (iter.hasNext()) {
                    // mid
                    iter.next();
                    stack.push([0, node]);
                    node = node.mid;
                }
                else {
                    // remove element
                    node.value = undefined;
                    // clean up empty nodes
                    while (stack.length > 0 && node.isEmpty()) {
                        var _a = stack.pop(), dir = _a[0], parent_1 = _a[1];
                        switch (dir) {
                            case 1:
                                parent_1.left = undefined;
                                break;
                            case 0:
                                parent_1.mid = undefined;
                                break;
                            case -1:
                                parent_1.right = undefined;
                                break;
                        }
                        node = parent_1;
                    }
                    break;
                }
            }
        };
        TernarySearchTree.prototype.findSubstr = function (key) {
            var iter = this._iter.reset(key);
            var node = this._root;
            var candidate;
            while (node) {
                var val = iter.cmp(node.segment);
                if (val > 0) {
                    // left
                    node = node.left;
                }
                else if (val < 0) {
                    // right
                    node = node.right;
                }
                else if (iter.hasNext()) {
                    // mid
                    iter.next();
                    candidate = node.value || candidate;
                    node = node.mid;
                }
                else {
                    break;
                }
            }
            return node && node.value || candidate;
        };
        TernarySearchTree.prototype.findSuperstr = function (key) {
            var iter = this._iter.reset(key);
            var node = this._root;
            while (node) {
                var val = iter.cmp(node.segment);
                if (val > 0) {
                    // left
                    node = node.left;
                }
                else if (val < 0) {
                    // right
                    node = node.right;
                }
                else if (iter.hasNext()) {
                    // mid
                    iter.next();
                    node = node.mid;
                }
                else {
                    // collect
                    if (!node.mid) {
                        return undefined;
                    }
                    else {
                        return this._nodeIterator(node.mid);
                    }
                }
            }
            return undefined;
        };
        TernarySearchTree.prototype._nodeIterator = function (node) {
            var _this = this;
            var res = {
                done: false,
                value: undefined
            };
            var idx;
            var data;
            var next = function () {
                if (!data) {
                    // lazy till first invocation
                    data = [];
                    idx = 0;
                    _this._forEach(node, function (value) { return data.push(value); });
                }
                if (idx >= data.length) {
                    res.done = true;
                    res.value = undefined;
                }
                else {
                    res.done = false;
                    res.value = data[idx++];
                }
                return res;
            };
            return { next: next };
        };
        TernarySearchTree.prototype.forEach = function (callback) {
            this._forEach(this._root, callback);
        };
        TernarySearchTree.prototype._forEach = function (node, callback) {
            if (node) {
                // left
                this._forEach(node.left, callback);
                // node
                if (node.value) {
                    // callback(node.value, this._iter.join(parts));
                    callback(node.value, node.key);
                }
                // mid
                this._forEach(node.mid, callback);
                // right
                this._forEach(node.right, callback);
            }
        };
        return TernarySearchTree;
    }());
    exports.TernarySearchTree = TernarySearchTree;
    var ResourceMap = /** @class */ (function () {
        function ResourceMap() {
            this.map = new Map();
            this.ignoreCase = false; // in the future this should be an uri-comparator
        }
        ResourceMap.prototype.set = function (resource, value) {
            this.map.set(this.toKey(resource), value);
        };
        ResourceMap.prototype.get = function (resource) {
            return this.map.get(this.toKey(resource));
        };
        ResourceMap.prototype.has = function (resource) {
            return this.map.has(this.toKey(resource));
        };
        Object.defineProperty(ResourceMap.prototype, "size", {
            get: function () {
                return this.map.size;
            },
            enumerable: true,
            configurable: true
        });
        ResourceMap.prototype.clear = function () {
            this.map.clear();
        };
        ResourceMap.prototype.delete = function (resource) {
            return this.map.delete(this.toKey(resource));
        };
        ResourceMap.prototype.forEach = function (clb) {
            this.map.forEach(clb);
        };
        ResourceMap.prototype.values = function () {
            return values(this.map);
        };
        ResourceMap.prototype.toKey = function (resource) {
            var key = resource.toString();
            if (this.ignoreCase) {
                key = key.toLowerCase();
            }
            return key;
        };
        ResourceMap.prototype.keys = function () {
            return keys(this.map).map(uri_1.default.parse);
        };
        ResourceMap.prototype.clone = function () {
            var resourceMap = new ResourceMap();
            this.map.forEach(function (value, key) { return resourceMap.map.set(key, value); });
            return resourceMap;
        };
        return ResourceMap;
    }());
    exports.ResourceMap = ResourceMap;
    var Touch;
    (function (Touch) {
        Touch[Touch["None"] = 0] = "None";
        Touch[Touch["AsOld"] = 1] = "AsOld";
        Touch[Touch["AsNew"] = 2] = "AsNew";
    })(Touch = exports.Touch || (exports.Touch = {}));
    var LinkedMap = /** @class */ (function () {
        function LinkedMap() {
            this._map = new Map();
            this._head = undefined;
            this._tail = undefined;
            this._size = 0;
        }
        LinkedMap.prototype.clear = function () {
            this._map.clear();
            this._head = undefined;
            this._tail = undefined;
            this._size = 0;
        };
        LinkedMap.prototype.isEmpty = function () {
            return !this._head && !this._tail;
        };
        Object.defineProperty(LinkedMap.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        LinkedMap.prototype.has = function (key) {
            return this._map.has(key);
        };
        LinkedMap.prototype.get = function (key, touch) {
            if (touch === void 0) { touch = Touch.None; }
            var item = this._map.get(key);
            if (!item) {
                return undefined;
            }
            if (touch !== Touch.None) {
                this.touch(item, touch);
            }
            return item.value;
        };
        LinkedMap.prototype.set = function (key, value, touch) {
            if (touch === void 0) { touch = Touch.None; }
            var item = this._map.get(key);
            if (item) {
                item.value = value;
                if (touch !== Touch.None) {
                    this.touch(item, touch);
                }
            }
            else {
                item = { key: key, value: value, next: undefined, previous: undefined };
                switch (touch) {
                    case Touch.None:
                        this.addItemLast(item);
                        break;
                    case Touch.AsOld:
                        this.addItemFirst(item);
                        break;
                    case Touch.AsNew:
                        this.addItemLast(item);
                        break;
                    default:
                        this.addItemLast(item);
                        break;
                }
                this._map.set(key, item);
                this._size++;
            }
        };
        LinkedMap.prototype.delete = function (key) {
            return !!this.remove(key);
        };
        LinkedMap.prototype.remove = function (key) {
            var item = this._map.get(key);
            if (!item) {
                return undefined;
            }
            this._map.delete(key);
            this.removeItem(item);
            this._size--;
            return item.value;
        };
        LinkedMap.prototype.shift = function () {
            if (!this._head && !this._tail) {
                return undefined;
            }
            if (!this._head || !this._tail) {
                throw new Error('Invalid list');
            }
            var item = this._head;
            this._map.delete(item.key);
            this.removeItem(item);
            this._size--;
            return item.value;
        };
        LinkedMap.prototype.forEach = function (callbackfn, thisArg) {
            var current = this._head;
            while (current) {
                if (thisArg) {
                    callbackfn.bind(thisArg)(current.value, current.key, this);
                }
                else {
                    callbackfn(current.value, current.key, this);
                }
                current = current.next;
            }
        };
        LinkedMap.prototype.values = function () {
            var result = [];
            var current = this._head;
            while (current) {
                result.push(current.value);
                current = current.next;
            }
            return result;
        };
        LinkedMap.prototype.keys = function () {
            var result = [];
            var current = this._head;
            while (current) {
                result.push(current.key);
                current = current.next;
            }
            return result;
        };
        /* VS Code / Monaco editor runs on es5 which has no Symbol.iterator
        public keys(): IterableIterator<K> {
            let current = this._head;
            let iterator: IterableIterator<K> = {
                [Symbol.iterator]() {
                    return iterator;
                },
                next():IteratorResult<K> {
                    if (current) {
                        let result = { value: current.key, done: false };
                        current = current.next;
                        return result;
                    } else {
                        return { value: undefined, done: true };
                    }
                }
            };
            return iterator;
        }
    
        public values(): IterableIterator<V> {
            let current = this._head;
            let iterator: IterableIterator<V> = {
                [Symbol.iterator]() {
                    return iterator;
                },
                next():IteratorResult<V> {
                    if (current) {
                        let result = { value: current.value, done: false };
                        current = current.next;
                        return result;
                    } else {
                        return { value: undefined, done: true };
                    }
                }
            };
            return iterator;
        }
        */
        LinkedMap.prototype.trimOld = function (newSize) {
            if (newSize >= this.size) {
                return;
            }
            if (newSize === 0) {
                this.clear();
                return;
            }
            var current = this._head;
            var currentSize = this.size;
            while (current && currentSize > newSize) {
                this._map.delete(current.key);
                current = current.next;
                currentSize--;
            }
            this._head = current;
            this._size = currentSize;
            current.previous = void 0;
        };
        LinkedMap.prototype.addItemFirst = function (item) {
            // First time Insert
            if (!this._head && !this._tail) {
                this._tail = item;
            }
            else if (!this._head) {
                throw new Error('Invalid list');
            }
            else {
                item.next = this._head;
                this._head.previous = item;
            }
            this._head = item;
        };
        LinkedMap.prototype.addItemLast = function (item) {
            // First time Insert
            if (!this._head && !this._tail) {
                this._head = item;
            }
            else if (!this._tail) {
                throw new Error('Invalid list');
            }
            else {
                item.previous = this._tail;
                this._tail.next = item;
            }
            this._tail = item;
        };
        LinkedMap.prototype.removeItem = function (item) {
            if (item === this._head && item === this._tail) {
                this._head = void 0;
                this._tail = void 0;
            }
            else if (item === this._head) {
                this._head = item.next;
            }
            else if (item === this._tail) {
                this._tail = item.previous;
            }
            else {
                var next = item.next;
                var previous = item.previous;
                if (!next || !previous) {
                    throw new Error('Invalid list');
                }
                next.previous = previous;
                previous.next = next;
            }
        };
        LinkedMap.prototype.touch = function (item, touch) {
            if (!this._head || !this._tail) {
                throw new Error('Invalid list');
            }
            if ((touch !== Touch.AsOld && touch !== Touch.AsNew)) {
                return;
            }
            if (touch === Touch.AsOld) {
                if (item === this._head) {
                    return;
                }
                var next = item.next;
                var previous = item.previous;
                // Unlink the item
                if (item === this._tail) {
                    // previous must be defined since item was not head but is tail
                    // So there are more than on item in the map
                    previous.next = void 0;
                    this._tail = previous;
                }
                else {
                    // Both next and previous are not undefined since item was neither head nor tail.
                    next.previous = previous;
                    previous.next = next;
                }
                // Insert the node at head
                item.previous = void 0;
                item.next = this._head;
                this._head.previous = item;
                this._head = item;
            }
            else if (touch === Touch.AsNew) {
                if (item === this._tail) {
                    return;
                }
                var next = item.next;
                var previous = item.previous;
                // Unlink the item.
                if (item === this._head) {
                    // next must be defined since item was not tail but is head
                    // So there are more than on item in the map
                    next.previous = void 0;
                    this._head = next;
                }
                else {
                    // Both next and previous are not undefined since item was neither head nor tail.
                    next.previous = previous;
                    previous.next = next;
                }
                item.next = void 0;
                item.previous = this._tail;
                this._tail.next = item;
                this._tail = item;
            }
        };
        LinkedMap.prototype.toJSON = function () {
            var data = [];
            this.forEach(function (value, key) {
                data.push([key, value]);
            });
            return data;
        };
        LinkedMap.prototype.fromJSON = function (data) {
            this.clear();
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var _a = data_1[_i], key = _a[0], value = _a[1];
                this.set(key, value);
            }
        };
        return LinkedMap;
    }());
    exports.LinkedMap = LinkedMap;
    var LRUCache = /** @class */ (function (_super) {
        __extends(LRUCache, _super);
        function LRUCache(limit, ratio) {
            if (ratio === void 0) { ratio = 1; }
            var _this = _super.call(this) || this;
            _this._limit = limit;
            _this._ratio = Math.min(Math.max(0, ratio), 1);
            return _this;
        }
        Object.defineProperty(LRUCache.prototype, "limit", {
            get: function () {
                return this._limit;
            },
            set: function (limit) {
                this._limit = limit;
                this.checkTrim();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LRUCache.prototype, "ratio", {
            get: function () {
                return this._ratio;
            },
            set: function (ratio) {
                this._ratio = Math.min(Math.max(0, ratio), 1);
                this.checkTrim();
            },
            enumerable: true,
            configurable: true
        });
        LRUCache.prototype.get = function (key) {
            return _super.prototype.get.call(this, key, Touch.AsNew);
        };
        LRUCache.prototype.peek = function (key) {
            return _super.prototype.get.call(this, key, Touch.None);
        };
        LRUCache.prototype.set = function (key, value) {
            _super.prototype.set.call(this, key, value, Touch.AsNew);
            this.checkTrim();
        };
        LRUCache.prototype.checkTrim = function () {
            if (this.size > this._limit) {
                this.trimOld(Math.round(this._limit * this._ratio));
            }
        };
        return LRUCache;
    }(LinkedMap));
    exports.LRUCache = LRUCache;
});

define(__m[80/*vs/base/common/normalization*/], __M([0/*require*/,1/*exports*/,32/*vs/base/common/map*/]), function (require, exports, map_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The normalize() method returns the Unicode Normalization Form of a given string. The form will be
     * the Normalization Form Canonical Composition.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize}
     */
    exports.canNormalize = typeof (''.normalize) === 'function';
    var nfcCache = new map_1.LRUCache(10000); // bounded to 10000 elements
    function normalizeNFC(str) {
        return normalize(str, 'NFC', nfcCache);
    }
    exports.normalizeNFC = normalizeNFC;
    var nfdCache = new map_1.LRUCache(10000); // bounded to 10000 elements
    function normalizeNFD(str) {
        return normalize(str, 'NFD', nfdCache);
    }
    exports.normalizeNFD = normalizeNFD;
    var nonAsciiCharactersPattern = /[^\u0000-\u0080]/;
    function normalize(str, form, normalizedCache) {
        if (!exports.canNormalize || !str) {
            return str;
        }
        var cached = normalizedCache.get(str);
        if (cached) {
            return cached;
        }
        var res;
        if (nonAsciiCharactersPattern.test(str)) {
            res = str.normalize(form);
        }
        else {
            res = str;
        }
        // Use the cache for fast lookup
        normalizedCache.set(str, res);
        return res;
    }
});











define(__m[29/*vs/base/common/uuid*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValueUUID = /** @class */ (function () {
        function ValueUUID(_value) {
            this._value = _value;
            // empty
        }
        ValueUUID.prototype.asHex = function () {
            return this._value;
        };
        return ValueUUID;
    }());
    var V4UUID = /** @class */ (function (_super) {
        __extends(V4UUID, _super);
        function V4UUID() {
            return _super.call(this, [
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                '-',
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                '-',
                '4',
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                '-',
                V4UUID._oneOf(V4UUID._timeHighBits),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                '-',
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
                V4UUID._randomHex(),
            ].join('')) || this;
        }
        V4UUID._oneOf = function (array) {
            return array[Math.floor(array.length * Math.random())];
        };
        V4UUID._randomHex = function () {
            return V4UUID._oneOf(V4UUID._chars);
        };
        V4UUID._chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        V4UUID._timeHighBits = ['8', '9', 'a', 'b'];
        return V4UUID;
    }(ValueUUID));
    function v4() {
        return new V4UUID();
    }
    exports.v4 = v4;
    var _UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    function isUUID(value) {
        return _UUIDPattern.test(value);
    }
    exports.isUUID = isUUID;
    /**
     * Parses a UUID that is of the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.
     * @param value A uuid string.
     */
    function parse(value) {
        if (!isUUID(value)) {
            throw new Error('invalid uuid');
        }
        return new ValueUUID(value);
    }
    exports.parse = parse;
    function generateUuid() {
        return v4().asHex();
    }
    exports.generateUuid = generateUuid;
});

/**
 * Extracted from https://github.com/winjs/winjs
 * Version: 4.4.0(ec3258a9f3a36805a187848984e3bb938044178d)
 * Copyright (c) Microsoft Corporation.
 * All Rights Reserved.
 * Licensed under the Source EULA.
 */
var __winjs_exports;

(function() {

var _modules = Object.create(null);//{};
_modules["WinJS/Core/_WinJS"] = {};

var _winjs = function(moduleId, deps, factory) {
    var exports = {};
    var exportsPassedIn = false;

    var depsValues = deps.map(function(dep) {
        if (dep === 'exports') {
            exportsPassedIn = true;
            return exports;
        }
        return _modules[dep];
    });

    var result = factory.apply({}, depsValues);

    _modules[moduleId] = exportsPassedIn ? exports : result;
};


_winjs("WinJS/Core/_Global", [], function () {
    "use strict";

    // Appease jshint
    /* global window, self, global */

    var globalObject =
        typeof window !== 'undefined' ? window :
        typeof self !== 'undefined' ? self :
        typeof global !== 'undefined' ? global :
        {};
    return globalObject;
});

_winjs("WinJS/Core/_BaseCoreUtils", ["WinJS/Core/_Global"], function baseCoreUtilsInit(_Global) {
    "use strict";

    var hasWinRT = !!_Global.Windows;

    function markSupportedForProcessing(func) {
        /// <signature helpKeyword="WinJS.Utilities.markSupportedForProcessing">
        /// <summary locid="WinJS.Utilities.markSupportedForProcessing">
        /// Marks a function as being compatible with declarative processing, such as WinJS.UI.processAll
        /// or WinJS.Binding.processAll.
        /// </summary>
        /// <param name="func" type="Function" locid="WinJS.Utilities.markSupportedForProcessing_p:func">
        /// The function to be marked as compatible with declarative processing.
        /// </param>
        /// <returns type="Function" locid="WinJS.Utilities.markSupportedForProcessing_returnValue">
        /// The input function.
        /// </returns>
        /// </signature>
        func.supportedForProcessing = true;
        return func;
    }

    var actualSetImmediate = null;

    return {
        hasWinRT: hasWinRT,
        markSupportedForProcessing: markSupportedForProcessing,
        _setImmediate: function (callback) {
            // BEGIN monaco change
            if (actualSetImmediate === null) {
                if (_Global.setImmediate) {
                    actualSetImmediate = _Global.setImmediate.bind(_Global);
                } else if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
                    actualSetImmediate = process.nextTick.bind(process);
                } else {
                    actualSetImmediate = _Global.setTimeout.bind(_Global);
                }
            }
            actualSetImmediate(callback);
            // END monaco change
        }
    };
});
_winjs("WinJS/Core/_WriteProfilerMark", ["WinJS/Core/_Global"], function profilerInit(_Global) {
    "use strict";

    return _Global.msWriteProfilerMark || function () { };
});
_winjs("WinJS/Core/_Base", ["WinJS/Core/_WinJS","WinJS/Core/_Global","WinJS/Core/_BaseCoreUtils","WinJS/Core/_WriteProfilerMark"], function baseInit(_WinJS, _Global, _BaseCoreUtils, _WriteProfilerMark) {
    "use strict";

    function initializeProperties(target, members, prefix) {
        var keys = Object.keys(members);
        var isArray = Array.isArray(target);
        var properties;
        var i, len;
        for (i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            var enumerable = key.charCodeAt(0) !== /*_*/95;
            var member = members[key];
            if (member && typeof member === 'object') {
                if (member.value !== undefined || typeof member.get === 'function' || typeof member.set === 'function') {
                    if (member.enumerable === undefined) {
                        member.enumerable = enumerable;
                    }
                    if (prefix && member.setName && typeof member.setName === 'function') {
                        member.setName(prefix + "." + key);
                    }
                    properties = properties || {};
                    properties[key] = member;
                    continue;
                }
            }
            if (!enumerable) {
                properties = properties || {};
                properties[key] = { value: member, enumerable: enumerable, configurable: true, writable: true };
                continue;
            }
            if (isArray) {
                target.forEach(function (target) {
                    target[key] = member;
                });
            } else {
                target[key] = member;
            }
        }
        if (properties) {
            if (isArray) {
                target.forEach(function (target) {
                    Object.defineProperties(target, properties);
                });
            } else {
                Object.defineProperties(target, properties);
            }
        }
    }

    (function () {

        var _rootNamespace = _WinJS;
        if (!_rootNamespace.Namespace) {
            _rootNamespace.Namespace = Object.create(Object.prototype);
        }

        function createNamespace(parentNamespace, name) {
            var currentNamespace = parentNamespace || {};
            if (name) {
                var namespaceFragments = name.split(".");
                if (currentNamespace === _Global && namespaceFragments[0] === "WinJS") {
                    currentNamespace = _WinJS;
                    namespaceFragments.splice(0, 1);
                }
                for (var i = 0, len = namespaceFragments.length; i < len; i++) {
                    var namespaceName = namespaceFragments[i];
                    if (!currentNamespace[namespaceName]) {
                        Object.defineProperty(currentNamespace, namespaceName,
                            { value: {}, writable: false, enumerable: true, configurable: true }
                        );
                    }
                    currentNamespace = currentNamespace[namespaceName];
                }
            }
            return currentNamespace;
        }

        function defineWithParent(parentNamespace, name, members) {
            /// <signature helpKeyword="WinJS.Namespace.defineWithParent">
            /// <summary locid="WinJS.Namespace.defineWithParent">
            /// Defines a new namespace with the specified name under the specified parent namespace.
            /// </summary>
            /// <param name="parentNamespace" type="Object" locid="WinJS.Namespace.defineWithParent_p:parentNamespace">
            /// The parent namespace.
            /// </param>
            /// <param name="name" type="String" locid="WinJS.Namespace.defineWithParent_p:name">
            /// The name of the new namespace.
            /// </param>
            /// <param name="members" type="Object" locid="WinJS.Namespace.defineWithParent_p:members">
            /// The members of the new namespace.
            /// </param>
            /// <returns type="Object" locid="WinJS.Namespace.defineWithParent_returnValue">
            /// The newly-defined namespace.
            /// </returns>
            /// </signature>
            var currentNamespace = createNamespace(parentNamespace, name);

            if (members) {
                initializeProperties(currentNamespace, members, name || "<ANONYMOUS>");
            }

            return currentNamespace;
        }

        function define(name, members) {
            /// <signature helpKeyword="WinJS.Namespace.define">
            /// <summary locid="WinJS.Namespace.define">
            /// Defines a new namespace with the specified name.
            /// </summary>
            /// <param name="name" type="String" locid="WinJS.Namespace.define_p:name">
            /// The name of the namespace. This could be a dot-separated name for nested namespaces.
            /// </param>
            /// <param name="members" type="Object" locid="WinJS.Namespace.define_p:members">
            /// The members of the new namespace.
            /// </param>
            /// <returns type="Object" locid="WinJS.Namespace.define_returnValue">
            /// The newly-defined namespace.
            /// </returns>
            /// </signature>
            return defineWithParent(_Global, name, members);
        }

        var LazyStates = {
            uninitialized: 1,
            working: 2,
            initialized: 3,
        };

        function lazy(f) {
            var name;
            var state = LazyStates.uninitialized;
            var result;
            return {
                setName: function (value) {
                    name = value;
                },
                get: function () {
                    switch (state) {
                        case LazyStates.initialized:
                            return result;

                        case LazyStates.uninitialized:
                            state = LazyStates.working;
                            try {
                                _WriteProfilerMark("WinJS.Namespace._lazy:" + name + ",StartTM");
                                result = f();
                            } finally {
                                _WriteProfilerMark("WinJS.Namespace._lazy:" + name + ",StopTM");
                                state = LazyStates.uninitialized;
                            }
                            f = null;
                            state = LazyStates.initialized;
                            return result;

                        case LazyStates.working:
                            throw "Illegal: reentrancy on initialization";

                        default:
                            throw "Illegal";
                    }
                },
                set: function (value) {
                    switch (state) {
                        case LazyStates.working:
                            throw "Illegal: reentrancy on initialization";

                        default:
                            state = LazyStates.initialized;
                            result = value;
                            break;
                    }
                },
                enumerable: true,
                configurable: true,
            };
        }

        // helper for defining AMD module members
        function moduleDefine(exports, name, members) {
            var target = [exports];
            var publicNS = null;
            if (name) {
                publicNS = createNamespace(_Global, name);
                target.push(publicNS);
            }
            initializeProperties(target, members, name || "<ANONYMOUS>");
            return publicNS;
        }

        // Establish members of the "WinJS.Namespace" namespace
        Object.defineProperties(_rootNamespace.Namespace, {

            defineWithParent: { value: defineWithParent, writable: true, enumerable: true, configurable: true },

            define: { value: define, writable: true, enumerable: true, configurable: true },

            _lazy: { value: lazy, writable: true, enumerable: true, configurable: true },

            _moduleDefine: { value: moduleDefine, writable: true, enumerable: true, configurable: true }

        });

    })();

    (function () {

        function define(constructor, instanceMembers, staticMembers) {
            /// <signature helpKeyword="WinJS.Class.define">
            /// <summary locid="WinJS.Class.define">
            /// Defines a class using the given constructor and the specified instance members.
            /// </summary>
            /// <param name="constructor" type="Function" locid="WinJS.Class.define_p:constructor">
            /// A constructor function that is used to instantiate this class.
            /// </param>
            /// <param name="instanceMembers" type="Object" locid="WinJS.Class.define_p:instanceMembers">
            /// The set of instance fields, properties, and methods made available on the class.
            /// </param>
            /// <param name="staticMembers" type="Object" locid="WinJS.Class.define_p:staticMembers">
            /// The set of static fields, properties, and methods made available on the class.
            /// </param>
            /// <returns type="Function" locid="WinJS.Class.define_returnValue">
            /// The newly-defined class.
            /// </returns>
            /// </signature>
            constructor = constructor || function () { };
            _BaseCoreUtils.markSupportedForProcessing(constructor);
            if (instanceMembers) {
                initializeProperties(constructor.prototype, instanceMembers);
            }
            if (staticMembers) {
                initializeProperties(constructor, staticMembers);
            }
            return constructor;
        }

        function derive(baseClass, constructor, instanceMembers, staticMembers) {
            /// <signature helpKeyword="WinJS.Class.derive">
            /// <summary locid="WinJS.Class.derive">
            /// Creates a sub-class based on the supplied baseClass parameter, using prototypal inheritance.
            /// </summary>
            /// <param name="baseClass" type="Function" locid="WinJS.Class.derive_p:baseClass">
            /// The class to inherit from.
            /// </param>
            /// <param name="constructor" type="Function" locid="WinJS.Class.derive_p:constructor">
            /// A constructor function that is used to instantiate this class.
            /// </param>
            /// <param name="instanceMembers" type="Object" locid="WinJS.Class.derive_p:instanceMembers">
            /// The set of instance fields, properties, and methods to be made available on the class.
            /// </param>
            /// <param name="staticMembers" type="Object" locid="WinJS.Class.derive_p:staticMembers">
            /// The set of static fields, properties, and methods to be made available on the class.
            /// </param>
            /// <returns type="Function" locid="WinJS.Class.derive_returnValue">
            /// The newly-defined class.
            /// </returns>
            /// </signature>
            if (baseClass) {
                constructor = constructor || function () { };
                var basePrototype = baseClass.prototype;
                constructor.prototype = Object.create(basePrototype);
                _BaseCoreUtils.markSupportedForProcessing(constructor);
                Object.defineProperty(constructor.prototype, "constructor", { value: constructor, writable: true, configurable: true, enumerable: true });
                if (instanceMembers) {
                    initializeProperties(constructor.prototype, instanceMembers);
                }
                if (staticMembers) {
                    initializeProperties(constructor, staticMembers);
                }
                return constructor;
            } else {
                return define(constructor, instanceMembers, staticMembers);
            }
        }

        function mix(constructor) {
            /// <signature helpKeyword="WinJS.Class.mix">
            /// <summary locid="WinJS.Class.mix">
            /// Defines a class using the given constructor and the union of the set of instance members
            /// specified by all the mixin objects. The mixin parameter list is of variable length.
            /// </summary>
            /// <param name="constructor" locid="WinJS.Class.mix_p:constructor">
            /// A constructor function that is used to instantiate this class.
            /// </param>
            /// <returns type="Function" locid="WinJS.Class.mix_returnValue">
            /// The newly-defined class.
            /// </returns>
            /// </signature>
            constructor = constructor || function () { };
            var i, len;
            for (i = 1, len = arguments.length; i < len; i++) {
                initializeProperties(constructor.prototype, arguments[i]);
            }
            return constructor;
        }

        // Establish members of "WinJS.Class" namespace
        _WinJS.Namespace.define("WinJS.Class", {
            define: define,
            derive: derive,
            mix: mix
        });

    })();

    return {
        Namespace: _WinJS.Namespace,
        Class: _WinJS.Class
    };

});
_winjs("WinJS/Core/_ErrorFromName", ["WinJS/Core/_Base"], function errorsInit(_Base) {
    "use strict";

    var ErrorFromName = _Base.Class.derive(Error, function (name, message) {
        /// <signature helpKeyword="WinJS.ErrorFromName">
        /// <summary locid="WinJS.ErrorFromName">
        /// Creates an Error object with the specified name and message properties.
        /// </summary>
        /// <param name="name" type="String" locid="WinJS.ErrorFromName_p:name">The name of this error. The name is meant to be consumed programmatically and should not be localized.</param>
        /// <param name="message" type="String" optional="true" locid="WinJS.ErrorFromName_p:message">The message for this error. The message is meant to be consumed by humans and should be localized.</param>
        /// <returns type="Error" locid="WinJS.ErrorFromName_returnValue">Error instance with .name and .message properties populated</returns>
        /// </signature>
        this.name = name;
        this.message = message || name;
    }, {
        /* empty */
    }, {
        supportedForProcessing: false,
    });

    _Base.Namespace.define("WinJS", {
        // ErrorFromName establishes a simple pattern for returning error codes.
        //
        ErrorFromName: ErrorFromName
    });

    return ErrorFromName;

});


_winjs("WinJS/Core/_Events", ["exports","WinJS/Core/_Base"], function eventsInit(exports, _Base) {
    "use strict";


    function createEventProperty(name) {
        var eventPropStateName = "_on" + name + "state";

        return {
            get: function () {
                var state = this[eventPropStateName];
                return state && state.userHandler;
            },
            set: function (handler) {
                var state = this[eventPropStateName];
                if (handler) {
                    if (!state) {
                        state = { wrapper: function (evt) { return state.userHandler(evt); }, userHandler: handler };
                        Object.defineProperty(this, eventPropStateName, { value: state, enumerable: false, writable:true, configurable: true });
                        this.addEventListener(name, state.wrapper, false);
                    }
                    state.userHandler = handler;
                } else if (state) {
                    this.removeEventListener(name, state.wrapper, false);
                    this[eventPropStateName] = null;
                }
            },
            enumerable: true
        };
    }

    function createEventProperties() {
        /// <signature helpKeyword="WinJS.Utilities.createEventProperties">
        /// <summary locid="WinJS.Utilities.createEventProperties">
        /// Creates an object that has one property for each name passed to the function.
        /// </summary>
        /// <param name="events" locid="WinJS.Utilities.createEventProperties_p:events">
        /// A variable list of property names.
        /// </param>
        /// <returns type="Object" locid="WinJS.Utilities.createEventProperties_returnValue">
        /// The object with the specified properties. The names of the properties are prefixed with 'on'.
        /// </returns>
        /// </signature>
        var props = {};
        for (var i = 0, len = arguments.length; i < len; i++) {
            var name = arguments[i];
            props["on" + name] = createEventProperty(name);
        }
        return props;
    }

    var EventMixinEvent = _Base.Class.define(
        function EventMixinEvent_ctor(type, detail, target) {
            this.detail = detail;
            this.target = target;
            this.timeStamp = Date.now();
            this.type = type;
        },
        {
            bubbles: { value: false, writable: false },
            cancelable: { value: false, writable: false },
            currentTarget: {
                get: function () { return this.target; }
            },
            defaultPrevented: {
                get: function () { return this._preventDefaultCalled; }
            },
            trusted: { value: false, writable: false },
            eventPhase: { value: 0, writable: false },
            target: null,
            timeStamp: null,
            type: null,

            preventDefault: function () {
                this._preventDefaultCalled = true;
            },
            stopImmediatePropagation: function () {
                this._stopImmediatePropagationCalled = true;
            },
            stopPropagation: function () {
            }
        }, {
            supportedForProcessing: false,
        }
    );

    var eventMixin = {
        _listeners: null,

        addEventListener: function (type, listener, useCapture) {
            /// <signature helpKeyword="WinJS.Utilities.eventMixin.addEventListener">
            /// <summary locid="WinJS.Utilities.eventMixin.addEventListener">
            /// Adds an event listener to the control.
            /// </summary>
            /// <param name="type" locid="WinJS.Utilities.eventMixin.addEventListener_p:type">
            /// The type (name) of the event.
            /// </param>
            /// <param name="listener" locid="WinJS.Utilities.eventMixin.addEventListener_p:listener">
            /// The listener to invoke when the event is raised.
            /// </param>
            /// <param name="useCapture" locid="WinJS.Utilities.eventMixin.addEventListener_p:useCapture">
            /// if true initiates capture, otherwise false.
            /// </param>
            /// </signature>
            useCapture = useCapture || false;
            this._listeners = this._listeners || {};
            var eventListeners = (this._listeners[type] = this._listeners[type] || []);
            for (var i = 0, len = eventListeners.length; i < len; i++) {
                var l = eventListeners[i];
                if (l.useCapture === useCapture && l.listener === listener) {
                    return;
                }
            }
            eventListeners.push({ listener: listener, useCapture: useCapture });
        },
        dispatchEvent: function (type, details) {
            /// <signature helpKeyword="WinJS.Utilities.eventMixin.dispatchEvent">
            /// <summary locid="WinJS.Utilities.eventMixin.dispatchEvent">
            /// Raises an event of the specified type and with the specified additional properties.
            /// </summary>
            /// <param name="type" locid="WinJS.Utilities.eventMixin.dispatchEvent_p:type">
            /// The type (name) of the event.
            /// </param>
            /// <param name="details" locid="WinJS.Utilities.eventMixin.dispatchEvent_p:details">
            /// The set of additional properties to be attached to the event object when the event is raised.
            /// </param>
            /// <returns type="Boolean" locid="WinJS.Utilities.eventMixin.dispatchEvent_returnValue">
            /// true if preventDefault was called on the event.
            /// </returns>
            /// </signature>
            var listeners = this._listeners && this._listeners[type];
            if (listeners) {
                var eventValue = new EventMixinEvent(type, details, this);
                // Need to copy the array to protect against people unregistering while we are dispatching
                listeners = listeners.slice(0, listeners.length);
                for (var i = 0, len = listeners.length; i < len && !eventValue._stopImmediatePropagationCalled; i++) {
                    listeners[i].listener(eventValue);
                }
                return eventValue.defaultPrevented || false;
            }
            return false;
        },
        removeEventListener: function (type, listener, useCapture) {
            /// <signature helpKeyword="WinJS.Utilities.eventMixin.removeEventListener">
            /// <summary locid="WinJS.Utilities.eventMixin.removeEventListener">
            /// Removes an event listener from the control.
            /// </summary>
            /// <param name="type" locid="WinJS.Utilities.eventMixin.removeEventListener_p:type">
            /// The type (name) of the event.
            /// </param>
            /// <param name="listener" locid="WinJS.Utilities.eventMixin.removeEventListener_p:listener">
            /// The listener to remove.
            /// </param>
            /// <param name="useCapture" locid="WinJS.Utilities.eventMixin.removeEventListener_p:useCapture">
            /// Specifies whether to initiate capture.
            /// </param>
            /// </signature>
            useCapture = useCapture || false;
            var listeners = this._listeners && this._listeners[type];
            if (listeners) {
                for (var i = 0, len = listeners.length; i < len; i++) {
                    var l = listeners[i];
                    if (l.listener === listener && l.useCapture === useCapture) {
                        listeners.splice(i, 1);
                        if (listeners.length === 0) {
                            delete this._listeners[type];
                        }
                        // Only want to remove one element for each call to removeEventListener
                        break;
                    }
                }
            }
        }
    };

    _Base.Namespace._moduleDefine(exports, "WinJS.Utilities", {
        _createEventProperty: createEventProperty,
        createEventProperties: createEventProperties,
        eventMixin: eventMixin
    });

});


_winjs("WinJS/Core/_Trace", ["WinJS/Core/_Global"], function traceInit(_Global) {
    "use strict";

    function nop(v) {
        return v;
    }

    return {
        _traceAsyncOperationStarting: (_Global.Debug && _Global.Debug.msTraceAsyncOperationStarting && _Global.Debug.msTraceAsyncOperationStarting.bind(_Global.Debug)) || nop,
        _traceAsyncOperationCompleted: (_Global.Debug && _Global.Debug.msTraceAsyncOperationCompleted && _Global.Debug.msTraceAsyncOperationCompleted.bind(_Global.Debug)) || nop,
        _traceAsyncCallbackStarting: (_Global.Debug && _Global.Debug.msTraceAsyncCallbackStarting && _Global.Debug.msTraceAsyncCallbackStarting.bind(_Global.Debug)) || nop,
        _traceAsyncCallbackCompleted: (_Global.Debug && _Global.Debug.msTraceAsyncCallbackCompleted && _Global.Debug.msTraceAsyncCallbackCompleted.bind(_Global.Debug)) || nop
    };
});
_winjs("WinJS/Promise/_StateMachine", ["WinJS/Core/_Global","WinJS/Core/_BaseCoreUtils","WinJS/Core/_Base","WinJS/Core/_ErrorFromName","WinJS/Core/_Events","WinJS/Core/_Trace"], function promiseStateMachineInit(_Global, _BaseCoreUtils, _Base, _ErrorFromName, _Events, _Trace) {
    "use strict";

    _Global.Debug && (_Global.Debug.setNonUserCodeExceptions = true);

    var ListenerType = _Base.Class.mix(_Base.Class.define(null, { /*empty*/ }, { supportedForProcessing: false }), _Events.eventMixin);
    var promiseEventListeners = new ListenerType();
    // make sure there is a listeners collection so that we can do a more trivial check below
    promiseEventListeners._listeners = {};
    var errorET = "error";
    var canceledName = "Canceled";
    var tagWithStack = false;
    var tag = {
        promise: 0x01,
        thenPromise: 0x02,
        errorPromise: 0x04,
        exceptionPromise: 0x08,
        completePromise: 0x10,
    };
    tag.all = tag.promise | tag.thenPromise | tag.errorPromise | tag.exceptionPromise | tag.completePromise;

    //
    // Global error counter, for each error which enters the system we increment this once and then
    // the error number travels with the error as it traverses the tree of potential handlers.
    //
    // When someone has registered to be told about errors (WinJS.Promise.callonerror) promises
    // which are in error will get tagged with a ._errorId field. This tagged field is the
    // contract by which nested promises with errors will be identified as chaining for the
    // purposes of the callonerror semantics. If a nested promise in error is encountered without
    // a ._errorId it will be assumed to be foreign and treated as an interop boundary and
    // a new error id will be minted.
    //
    var error_number = 1;

    //
    // The state machine has a interesting hiccup in it with regards to notification, in order
    // to flatten out notification and avoid recursion for synchronous completion we have an
    // explicit set of *_notify states which are responsible for notifying their entire tree
    // of children. They can do this because they know that immediate children are always
    // ThenPromise instances and we can therefore reach into their state to access the
    // _listeners collection.
    //
    // So, what happens is that a Promise will be fulfilled through the _completed or _error
    // messages at which point it will enter a *_notify state and be responsible for to move
    // its children into an (as appropriate) success or error state and also notify that child's
    // listeners of the state transition, until leaf notes are reached.
    //

    var state_created,              // -> working
        state_working,              // -> error | error_notify | success | success_notify | canceled | waiting
        state_waiting,              // -> error | error_notify | success | success_notify | waiting_canceled
        state_waiting_canceled,     // -> error | error_notify | success | success_notify | canceling
        state_canceled,             // -> error | error_notify | success | success_notify | canceling
        state_canceling,            // -> error_notify
        state_success_notify,       // -> success
        state_success,              // -> .
        state_error_notify,         // -> error
        state_error;                // -> .

    // Noop function, used in the various states to indicate that they don't support a given
    // message. Named with the somewhat cute name '_' because it reads really well in the states.

    function _() { }

    // Initial state
    //
    state_created = {
        name: "created",
        enter: function (promise) {
            promise._setState(state_working);
        },
        cancel: _,
        done: _,
        then: _,
        _completed: _,
        _error: _,
        _notify: _,
        _progress: _,
        _setCompleteValue: _,
        _setErrorValue: _
    };

    // Ready state, waiting for a message (completed/error/progress), able to be canceled
    //
    state_working = {
        name: "working",
        enter: _,
        cancel: function (promise) {
            promise._setState(state_canceled);
        },
        done: done,
        then: then,
        _completed: completed,
        _error: error,
        _notify: _,
        _progress: progress,
        _setCompleteValue: setCompleteValue,
        _setErrorValue: setErrorValue
    };

    // Waiting state, if a promise is completed with a value which is itself a promise
    // (has a then() method) it signs up to be informed when that child promise is
    // fulfilled at which point it will be fulfilled with that value.
    //
    state_waiting = {
        name: "waiting",
        enter: function (promise) {
            var waitedUpon = promise._value;
            // We can special case our own intermediate promises which are not in a
            //  terminal state by just pushing this promise as a listener without
            //  having to create new indirection functions
            if (waitedUpon instanceof ThenPromise &&
                waitedUpon._state !== state_error &&
                waitedUpon._state !== state_success) {
                pushListener(waitedUpon, { promise: promise });
            } else {
                var error = function (value) {
                    if (waitedUpon._errorId) {
                        promise._chainedError(value, waitedUpon);
                    } else {
                        // Because this is an interop boundary we want to indicate that this
                        //  error has been handled by the promise infrastructure before we
                        //  begin a new handling chain.
                        //
                        callonerror(promise, value, detailsForHandledError, waitedUpon, error);
                        promise._error(value);
                    }
                };
                error.handlesOnError = true;
                waitedUpon.then(
                    promise._completed.bind(promise),
                    error,
                    promise._progress.bind(promise)
                );
            }
        },
        cancel: function (promise) {
            promise._setState(state_waiting_canceled);
        },
        done: done,
        then: then,
        _completed: completed,
        _error: error,
        _notify: _,
        _progress: progress,
        _setCompleteValue: setCompleteValue,
        _setErrorValue: setErrorValue
    };

    // Waiting canceled state, when a promise has been in a waiting state and receives a
    // request to cancel its pending work it will forward that request to the child promise
    // and then waits to be informed of the result. This promise moves itself into the
    // canceling state but understands that the child promise may instead push it to a
    // different state.
    //
    state_waiting_canceled = {
        name: "waiting_canceled",
        enter: function (promise) {
            // Initiate a transition to canceling. Triggering a cancel on the promise
            // that we are waiting upon may result in a different state transition
            // before the state machine pump runs again.
            promise._setState(state_canceling);
            var waitedUpon = promise._value;
            if (waitedUpon.cancel) {
                waitedUpon.cancel();
            }
        },
        cancel: _,
        done: done,
        then: then,
        _completed: completed,
        _error: error,
        _notify: _,
        _progress: progress,
        _setCompleteValue: setCompleteValue,
        _setErrorValue: setErrorValue
    };

    // Canceled state, moves to the canceling state and then tells the promise to do
    // whatever it might need to do on cancelation.
    //
    state_canceled = {
        name: "canceled",
        enter: function (promise) {
            // Initiate a transition to canceling. The _cancelAction may change the state
            // before the state machine pump runs again.
            promise._setState(state_canceling);
            promise._cancelAction();
        },
        cancel: _,
        done: done,
        then: then,
        _completed: completed,
        _error: error,
        _notify: _,
        _progress: progress,
        _setCompleteValue: setCompleteValue,
        _setErrorValue: setErrorValue
    };

    // Canceling state, commits to the promise moving to an error state with an error
    // object whose 'name' and 'message' properties contain the string "Canceled"
    //
    state_canceling = {
        name: "canceling",
        enter: function (promise) {
            var error = new Error(canceledName);
            error.name = error.message;
            promise._value = error;
            promise._setState(state_error_notify);
        },
        cancel: _,
        done: _,
        then: _,
        _completed: _,
        _error: _,
        _notify: _,
        _progress: _,
        _setCompleteValue: _,
        _setErrorValue: _
    };

    // Success notify state, moves a promise to the success state and notifies all children
    //
    state_success_notify = {
        name: "complete_notify",
        enter: function (promise) {
            promise.done = CompletePromise.prototype.done;
            promise.then = CompletePromise.prototype.then;
            if (promise._listeners) {
                var queue = [promise];
                var p;
                while (queue.length) {
                    p = queue.shift();
                    p._state._notify(p, queue);
                }
            }
            promise._setState(state_success);
        },
        cancel: _,
        done: null, /*error to get here */
        then: null, /*error to get here */
        _completed: _,
        _error: _,
        _notify: notifySuccess,
        _progress: _,
        _setCompleteValue: _,
        _setErrorValue: _
    };

    // Success state, moves a promise to the success state and does NOT notify any children.
    // Some upstream promise is owning the notification pass.
    //
    state_success = {
        name: "success",
        enter: function (promise) {
            promise.done = CompletePromise.prototype.done;
            promise.then = CompletePromise.prototype.then;
            promise._cleanupAction();
        },
        cancel: _,
        done: null, /*error to get here */
        then: null, /*error to get here */
        _completed: _,
        _error: _,
        _notify: notifySuccess,
        _progress: _,
        _setCompleteValue: _,
        _setErrorValue: _
    };

    // Error notify state, moves a promise to the error state and notifies all children
    //
    state_error_notify = {
        name: "error_notify",
        enter: function (promise) {
            promise.done = ErrorPromise.prototype.done;
            promise.then = ErrorPromise.prototype.then;
            if (promise._listeners) {
                var queue = [promise];
                var p;
                while (queue.length) {
                    p = queue.shift();
                    p._state._notify(p, queue);
                }
            }
            promise._setState(state_error);
        },
        cancel: _,
        done: null, /*error to get here*/
        then: null, /*error to get here*/
        _completed: _,
        _error: _,
        _notify: notifyError,
        _progress: _,
        _setCompleteValue: _,
        _setErrorValue: _
    };

    // Error state, moves a promise to the error state and does NOT notify any children.
    // Some upstream promise is owning the notification pass.
    //
    state_error = {
        name: "error",
        enter: function (promise) {
            promise.done = ErrorPromise.prototype.done;
            promise.then = ErrorPromise.prototype.then;
            promise._cleanupAction();
        },
        cancel: _,
        done: null, /*error to get here*/
        then: null, /*error to get here*/
        _completed: _,
        _error: _,
        _notify: notifyError,
        _progress: _,
        _setCompleteValue: _,
        _setErrorValue: _
    };

    //
    // The statemachine implementation follows a very particular pattern, the states are specified
    // as static stateless bags of functions which are then indirected through the state machine
    // instance (a Promise). As such all of the functions on each state have the promise instance
    // passed to them explicitly as a parameter and the Promise instance members do a little
    // dance where they indirect through the state and insert themselves in the argument list.
    //
    // We could instead call directly through the promise states however then every caller
    // would have to remember to do things like pumping the state machine to catch state transitions.
    //

    var PromiseStateMachine = _Base.Class.define(null, {
        _listeners: null,
        _nextState: null,
        _state: null,
        _value: null,

        cancel: function () {
            /// <signature helpKeyword="WinJS.PromiseStateMachine.cancel">
            /// <summary locid="WinJS.PromiseStateMachine.cancel">
            /// Attempts to cancel the fulfillment of a promised value. If the promise hasn't
            /// already been fulfilled and cancellation is supported, the promise enters
            /// the error state with a value of Error("Canceled").
            /// </summary>
            /// </signature>
            this._state.cancel(this);
            this._run();
        },
        done: function Promise_done(onComplete, onError, onProgress) {
            /// <signature helpKeyword="WinJS.PromiseStateMachine.done">
            /// <summary locid="WinJS.PromiseStateMachine.done">
            /// Allows you to specify the work to be done on the fulfillment of the promised value,
            /// the error handling to be performed if the promise fails to fulfill
            /// a value, and the handling of progress notifications along the way.
            ///
            /// After the handlers have finished executing, this function throws any error that would have been returned
            /// from then() as a promise in the error state.
            /// </summary>
            /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.done_p:onComplete">
            /// The function to be called if the promise is fulfilled successfully with a value.
            /// The fulfilled value is passed as the single argument. If the value is null,
            /// the fulfilled value is returned. The value returned
            /// from the function becomes the fulfilled value of the promise returned by
            /// then(). If an exception is thrown while executing the function, the promise returned
            /// by then() moves into the error state.
            /// </param>
            /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onError">
            /// The function to be called if the promise is fulfilled with an error. The error
            /// is passed as the single argument. If it is null, the error is forwarded.
            /// The value returned from the function is the fulfilled value of the promise returned by then().
            /// </param>
            /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onProgress">
            /// the function to be called if the promise reports progress. Data about the progress
            /// is passed as the single argument. Promises are not required to support
            /// progress.
            /// </param>
            /// </signature>
            this._state.done(this, onComplete, onError, onProgress);
        },
        then: function Promise_then(onComplete, onError, onProgress) {
            /// <signature helpKeyword="WinJS.PromiseStateMachine.then">
            /// <summary locid="WinJS.PromiseStateMachine.then">
            /// Allows you to specify the work to be done on the fulfillment of the promised value,
            /// the error handling to be performed if the promise fails to fulfill
            /// a value, and the handling of progress notifications along the way.
            /// </summary>
            /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.then_p:onComplete">
            /// The function to be called if the promise is fulfilled successfully with a value.
            /// The value is passed as the single argument. If the value is null, the value is returned.
            /// The value returned from the function becomes the fulfilled value of the promise returned by
            /// then(). If an exception is thrown while this function is being executed, the promise returned
            /// by then() moves into the error state.
            /// </param>
            /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onError">
            /// The function to be called if the promise is fulfilled with an error. The error
            /// is passed as the single argument. If it is null, the error is forwarded.
            /// The value returned from the function becomes the fulfilled value of the promise returned by then().
            /// </param>
            /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onProgress">
            /// The function to be called if the promise reports progress. Data about the progress
            /// is passed as the single argument. Promises are not required to support
            /// progress.
            /// </param>
            /// <returns type="WinJS.Promise" locid="WinJS.PromiseStateMachine.then_returnValue">
            /// The promise whose value is the result of executing the complete or
            /// error function.
            /// </returns>
            /// </signature>
            // BEGIN monaco change
            if (this.then !== Promise_then) {
                this.then(onComplete, onError, onProgress);
                return;
            }
            // END monaco change
            return this._state.then(this, onComplete, onError, onProgress);
        },

        _chainedError: function (value, context) {
            var result = this._state._error(this, value, detailsForChainedError, context);
            this._run();
            return result;
        },
        _completed: function (value) {
            var result = this._state._completed(this, value);
            this._run();
            return result;
        },
        _error: function (value) {
            var result = this._state._error(this, value, detailsForError);
            this._run();
            return result;
        },
        _progress: function (value) {
            this._state._progress(this, value);
        },
        _setState: function (state) {
            this._nextState = state;
        },
        _setCompleteValue: function (value) {
            this._state._setCompleteValue(this, value);
            this._run();
        },
        _setChainedErrorValue: function (value, context) {
            var result = this._state._setErrorValue(this, value, detailsForChainedError, context);
            this._run();
            return result;
        },
        _setExceptionValue: function (value) {
            var result = this._state._setErrorValue(this, value, detailsForException);
            this._run();
            return result;
        },
        _run: function () {
            while (this._nextState) {
                this._state = this._nextState;
                this._nextState = null;
                this._state.enter(this);
            }
        }
    }, {
        supportedForProcessing: false
    });

    //
    // Implementations of shared state machine code.
    //

    function completed(promise, value) {
        var targetState;
        if (value && typeof value === "object" && typeof value.then === "function") {
            targetState = state_waiting;
        } else {
            targetState = state_success_notify;
        }
        promise._value = value;
        promise._setState(targetState);
    }
    function createErrorDetails(exception, error, promise, id, parent, handler) {
        return {
            exception: exception,
            error: error,
            promise: promise,
            handler: handler,
            id: id,
            parent: parent
        };
    }
    function detailsForHandledError(promise, errorValue, context, handler) {
        var exception = context._isException;
        var errorId = context._errorId;
        return createErrorDetails(
            exception ? errorValue : null,
            exception ? null : errorValue,
            promise,
            errorId,
            context,
            handler
        );
    }
    function detailsForChainedError(promise, errorValue, context) {
        var exception = context._isException;
        var errorId = context._errorId;
        setErrorInfo(promise, errorId, exception);
        return createErrorDetails(
            exception ? errorValue : null,
            exception ? null : errorValue,
            promise,
            errorId,
            context
        );
    }
    function detailsForError(promise, errorValue) {
        var errorId = ++error_number;
        setErrorInfo(promise, errorId);
        return createErrorDetails(
            null,
            errorValue,
            promise,
            errorId
        );
    }
    function detailsForException(promise, exceptionValue) {
        var errorId = ++error_number;
        setErrorInfo(promise, errorId, true);
        return createErrorDetails(
            exceptionValue,
            null,
            promise,
            errorId
        );
    }
    function done(promise, onComplete, onError, onProgress) {
        var asyncOpID = _Trace._traceAsyncOperationStarting("WinJS.Promise.done");
        pushListener(promise, { c: onComplete, e: onError, p: onProgress, asyncOpID: asyncOpID });
    }
    function error(promise, value, onerrorDetails, context) {
        promise._value = value;
        callonerror(promise, value, onerrorDetails, context);
        promise._setState(state_error_notify);
    }
    function notifySuccess(promise, queue) {
        var value = promise._value;
        var listeners = promise._listeners;
        if (!listeners) {
            return;
        }
        promise._listeners = null;
        var i, len;
        for (i = 0, len = Array.isArray(listeners) ? listeners.length : 1; i < len; i++) {
            var listener = len === 1 ? listeners : listeners[i];
            var onComplete = listener.c;
            var target = listener.promise;

            _Trace._traceAsyncOperationCompleted(listener.asyncOpID, _Global.Debug && _Global.Debug.MS_ASYNC_OP_STATUS_SUCCESS);

            if (target) {
                _Trace._traceAsyncCallbackStarting(listener.asyncOpID);
                try {
                    target._setCompleteValue(onComplete ? onComplete(value) : value);
                } catch (ex) {
                    target._setExceptionValue(ex);
                } finally {
                    _Trace._traceAsyncCallbackCompleted();
                }
                if (target._state !== state_waiting && target._listeners) {
                    queue.push(target);
                }
            } else {
                CompletePromise.prototype.done.call(promise, onComplete);
            }
        }
    }
    function notifyError(promise, queue) {
        var value = promise._value;
        var listeners = promise._listeners;
        if (!listeners) {
            return;
        }
        promise._listeners = null;
        var i, len;
        for (i = 0, len = Array.isArray(listeners) ? listeners.length : 1; i < len; i++) {
            var listener = len === 1 ? listeners : listeners[i];
            var onError = listener.e;
            var target = listener.promise;

            var errorID = _Global.Debug && (value && value.name === canceledName ? _Global.Debug.MS_ASYNC_OP_STATUS_CANCELED : _Global.Debug.MS_ASYNC_OP_STATUS_ERROR);
            _Trace._traceAsyncOperationCompleted(listener.asyncOpID, errorID);

            if (target) {
                var asyncCallbackStarted = false;
                try {
                    if (onError) {
                        _Trace._traceAsyncCallbackStarting(listener.asyncOpID);
                        asyncCallbackStarted = true;
                        if (!onError.handlesOnError) {
                            callonerror(target, value, detailsForHandledError, promise, onError);
                        }
                        target._setCompleteValue(onError(value));
                    } else {
                        target._setChainedErrorValue(value, promise);
                    }
                } catch (ex) {
                    target._setExceptionValue(ex);
                } finally {
                    if (asyncCallbackStarted) {
                        _Trace._traceAsyncCallbackCompleted();
                    }
                }
                if (target._state !== state_waiting && target._listeners) {
                    queue.push(target);
                }
            } else {
                ErrorPromise.prototype.done.call(promise, null, onError);
            }
        }
    }
    function callonerror(promise, value, onerrorDetailsGenerator, context, handler) {
        if (promiseEventListeners._listeners[errorET]) {
            if (value instanceof Error && value.message === canceledName) {
                return;
            }
            promiseEventListeners.dispatchEvent(errorET, onerrorDetailsGenerator(promise, value, context, handler));
        }
    }
    function progress(promise, value) {
        var listeners = promise._listeners;
        if (listeners) {
            var i, len;
            for (i = 0, len = Array.isArray(listeners) ? listeners.length : 1; i < len; i++) {
                var listener = len === 1 ? listeners : listeners[i];
                var onProgress = listener.p;
                if (onProgress) {
                    try { onProgress(value); } catch (ex) { }
                }
                if (!(listener.c || listener.e) && listener.promise) {
                    listener.promise._progress(value);
                }
            }
        }
    }
    function pushListener(promise, listener) {
        var listeners = promise._listeners;
        if (listeners) {
            // We may have either a single listener (which will never be wrapped in an array)
            // or 2+ listeners (which will be wrapped). Since we are now adding one more listener
            // we may have to wrap the single listener before adding the second.
            listeners = Array.isArray(listeners) ? listeners : [listeners];
            listeners.push(listener);
        } else {
            listeners = listener;
        }
        promise._listeners = listeners;
    }
    // The difference beween setCompleteValue()/setErrorValue() and complete()/error() is that setXXXValue() moves
    // a promise directly to the success/error state without starting another notification pass (because one
    // is already ongoing).
    function setErrorInfo(promise, errorId, isException) {
        promise._isException = isException || false;
        promise._errorId = errorId;
    }
    function setErrorValue(promise, value, onerrorDetails, context) {
        promise._value = value;
        callonerror(promise, value, onerrorDetails, context);
        promise._setState(state_error);
    }
    function setCompleteValue(promise, value) {
        var targetState;
        if (value && typeof value === "object" && typeof value.then === "function") {
            targetState = state_waiting;
        } else {
            targetState = state_success;
        }
        promise._value = value;
        promise._setState(targetState);
    }
    function then(promise, onComplete, onError, onProgress) {
        var result = new ThenPromise(promise);
        var asyncOpID = _Trace._traceAsyncOperationStarting("WinJS.Promise.then");
        pushListener(promise, { promise: result, c: onComplete, e: onError, p: onProgress, asyncOpID: asyncOpID });
        return result;
    }

    //
    // Internal implementation detail promise, ThenPromise is created when a promise needs
    // to be returned from a then() method.
    //
    var ThenPromise = _Base.Class.derive(PromiseStateMachine,
        function (creator) {

            if (tagWithStack && (tagWithStack === true || (tagWithStack & tag.thenPromise))) {
                this._stack = Promise._getStack();
            }

            this._creator = creator;
            this._setState(state_created);
            this._run();
        }, {
            _creator: null,

            _cancelAction: function () { if (this._creator) { this._creator.cancel(); } },
            _cleanupAction: function () { this._creator = null; }
        }, {
            supportedForProcessing: false
        }
    );

    //
    // Slim promise implementations for already completed promises, these are created
    // under the hood on synchronous completion paths as well as by WinJS.Promise.wrap
    // and WinJS.Promise.wrapError.
    //

    var ErrorPromise = _Base.Class.define(
        function ErrorPromise_ctor(value) {

            if (tagWithStack && (tagWithStack === true || (tagWithStack & tag.errorPromise))) {
                this._stack = Promise._getStack();
            }

            this._value = value;
            callonerror(this, value, detailsForError);
        }, {
            cancel: function () {
                /// <signature helpKeyword="WinJS.PromiseStateMachine.cancel">
                /// <summary locid="WinJS.PromiseStateMachine.cancel">
                /// Attempts to cancel the fulfillment of a promised value. If the promise hasn't
                /// already been fulfilled and cancellation is supported, the promise enters
                /// the error state with a value of Error("Canceled").
                /// </summary>
                /// </signature>
            },
            done: function ErrorPromise_done(unused, onError) {
                /// <signature helpKeyword="WinJS.PromiseStateMachine.done">
                /// <summary locid="WinJS.PromiseStateMachine.done">
                /// Allows you to specify the work to be done on the fulfillment of the promised value,
                /// the error handling to be performed if the promise fails to fulfill
                /// a value, and the handling of progress notifications along the way.
                ///
                /// After the handlers have finished executing, this function throws any error that would have been returned
                /// from then() as a promise in the error state.
                /// </summary>
                /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.done_p:onComplete">
                /// The function to be called if the promise is fulfilled successfully with a value.
                /// The fulfilled value is passed as the single argument. If the value is null,
                /// the fulfilled value is returned. The value returned
                /// from the function becomes the fulfilled value of the promise returned by
                /// then(). If an exception is thrown while executing the function, the promise returned
                /// by then() moves into the error state.
                /// </param>
                /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onError">
                /// The function to be called if the promise is fulfilled with an error. The error
                /// is passed as the single argument. If it is null, the error is forwarded.
                /// The value returned from the function is the fulfilled value of the promise returned by then().
                /// </param>
                /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onProgress">
                /// the function to be called if the promise reports progress. Data about the progress
                /// is passed as the single argument. Promises are not required to support
                /// progress.
                /// </param>
                /// </signature>
                var value = this._value;
                if (onError) {
                    try {
                        if (!onError.handlesOnError) {
                            callonerror(null, value, detailsForHandledError, this, onError);
                        }
                        var result = onError(value);
                        if (result && typeof result === "object" && typeof result.done === "function") {
                            // If a promise is returned we need to wait on it.
                            result.done();
                        }
                        return;
                    } catch (ex) {
                        value = ex;
                    }
                }
                if (value instanceof Error && value.message === canceledName) {
                    // suppress cancel
                    return;
                }
                // force the exception to be thrown asyncronously to avoid any try/catch blocks
                //
                Promise._doneHandler(value);
            },
            then: function ErrorPromise_then(unused, onError) {
                /// <signature helpKeyword="WinJS.PromiseStateMachine.then">
                /// <summary locid="WinJS.PromiseStateMachine.then">
                /// Allows you to specify the work to be done on the fulfillment of the promised value,
                /// the error handling to be performed if the promise fails to fulfill
                /// a value, and the handling of progress notifications along the way.
                /// </summary>
                /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.then_p:onComplete">
                /// The function to be called if the promise is fulfilled successfully with a value.
                /// The value is passed as the single argument. If the value is null, the value is returned.
                /// The value returned from the function becomes the fulfilled value of the promise returned by
                /// then(). If an exception is thrown while this function is being executed, the promise returned
                /// by then() moves into the error state.
                /// </param>
                /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onError">
                /// The function to be called if the promise is fulfilled with an error. The error
                /// is passed as the single argument. If it is null, the error is forwarded.
                /// The value returned from the function becomes the fulfilled value of the promise returned by then().
                /// </param>
                /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onProgress">
                /// The function to be called if the promise reports progress. Data about the progress
                /// is passed as the single argument. Promises are not required to support
                /// progress.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.PromiseStateMachine.then_returnValue">
                /// The promise whose value is the result of executing the complete or
                /// error function.
                /// </returns>
                /// </signature>

                // If the promise is already in a error state and no error handler is provided
                // we optimize by simply returning the promise instead of creating a new one.
                //
                if (!onError) { return this; }
                var result;
                var value = this._value;
                try {
                    if (!onError.handlesOnError) {
                        callonerror(null, value, detailsForHandledError, this, onError);
                    }
                    result = new CompletePromise(onError(value));
                } catch (ex) {
                    // If the value throw from the error handler is the same as the value
                    // provided to the error handler then there is no need for a new promise.
                    //
                    if (ex === value) {
                        result = this;
                    } else {
                        result = new ExceptionPromise(ex);
                    }
                }
                return result;
            }
        }, {
            supportedForProcessing: false
        }
    );

    var ExceptionPromise = _Base.Class.derive(ErrorPromise,
        function ExceptionPromise_ctor(value) {

            if (tagWithStack && (tagWithStack === true || (tagWithStack & tag.exceptionPromise))) {
                this._stack = Promise._getStack();
            }

            this._value = value;
            callonerror(this, value, detailsForException);
        }, {
            /* empty */
        }, {
            supportedForProcessing: false
        }
    );

    var CompletePromise = _Base.Class.define(
        function CompletePromise_ctor(value) {

            if (tagWithStack && (tagWithStack === true || (tagWithStack & tag.completePromise))) {
                this._stack = Promise._getStack();
            }

            if (value && typeof value === "object" && typeof value.then === "function") {
                var result = new ThenPromise(null);
                result._setCompleteValue(value);
                return result;
            }
            this._value = value;
        }, {
            cancel: function () {
                /// <signature helpKeyword="WinJS.PromiseStateMachine.cancel">
                /// <summary locid="WinJS.PromiseStateMachine.cancel">
                /// Attempts to cancel the fulfillment of a promised value. If the promise hasn't
                /// already been fulfilled and cancellation is supported, the promise enters
                /// the error state with a value of Error("Canceled").
                /// </summary>
                /// </signature>
            },
            done: function CompletePromise_done(onComplete) {
                /// <signature helpKeyword="WinJS.PromiseStateMachine.done">
                /// <summary locid="WinJS.PromiseStateMachine.done">
                /// Allows you to specify the work to be done on the fulfillment of the promised value,
                /// the error handling to be performed if the promise fails to fulfill
                /// a value, and the handling of progress notifications along the way.
                ///
                /// After the handlers have finished executing, this function throws any error that would have been returned
                /// from then() as a promise in the error state.
                /// </summary>
                /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.done_p:onComplete">
                /// The function to be called if the promise is fulfilled successfully with a value.
                /// The fulfilled value is passed as the single argument. If the value is null,
                /// the fulfilled value is returned. The value returned
                /// from the function becomes the fulfilled value of the promise returned by
                /// then(). If an exception is thrown while executing the function, the promise returned
                /// by then() moves into the error state.
                /// </param>
                /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onError">
                /// The function to be called if the promise is fulfilled with an error. The error
                /// is passed as the single argument. If it is null, the error is forwarded.
                /// The value returned from the function is the fulfilled value of the promise returned by then().
                /// </param>
                /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.done_p:onProgress">
                /// the function to be called if the promise reports progress. Data about the progress
                /// is passed as the single argument. Promises are not required to support
                /// progress.
                /// </param>
                /// </signature>
                if (!onComplete) { return; }
                try {
                    var result = onComplete(this._value);
                    if (result && typeof result === "object" && typeof result.done === "function") {
                        result.done();
                    }
                } catch (ex) {
                    // force the exception to be thrown asynchronously to avoid any try/catch blocks
                    Promise._doneHandler(ex);
                }
            },
            then: function CompletePromise_then(onComplete) {
                /// <signature helpKeyword="WinJS.PromiseStateMachine.then">
                /// <summary locid="WinJS.PromiseStateMachine.then">
                /// Allows you to specify the work to be done on the fulfillment of the promised value,
                /// the error handling to be performed if the promise fails to fulfill
                /// a value, and the handling of progress notifications along the way.
                /// </summary>
                /// <param name='onComplete' type='Function' locid="WinJS.PromiseStateMachine.then_p:onComplete">
                /// The function to be called if the promise is fulfilled successfully with a value.
                /// The value is passed as the single argument. If the value is null, the value is returned.
                /// The value returned from the function becomes the fulfilled value of the promise returned by
                /// then(). If an exception is thrown while this function is being executed, the promise returned
                /// by then() moves into the error state.
                /// </param>
                /// <param name='onError' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onError">
                /// The function to be called if the promise is fulfilled with an error. The error
                /// is passed as the single argument. If it is null, the error is forwarded.
                /// The value returned from the function becomes the fulfilled value of the promise returned by then().
                /// </param>
                /// <param name='onProgress' type='Function' optional='true' locid="WinJS.PromiseStateMachine.then_p:onProgress">
                /// The function to be called if the promise reports progress. Data about the progress
                /// is passed as the single argument. Promises are not required to support
                /// progress.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.PromiseStateMachine.then_returnValue">
                /// The promise whose value is the result of executing the complete or
                /// error function.
                /// </returns>
                /// </signature>
                try {
                    // If the value returned from the completion handler is the same as the value
                    // provided to the completion handler then there is no need for a new promise.
                    //
                    var newValue = onComplete ? onComplete(this._value) : this._value;
                    return newValue === this._value ? this : new CompletePromise(newValue);
                } catch (ex) {
                    return new ExceptionPromise(ex);
                }
            }
        }, {
            supportedForProcessing: false
        }
    );

    //
    // Promise is the user-creatable WinJS.Promise object.
    //

    function timeout(timeoutMS) {
        var id;
        return new Promise(
            function (c) {
                if (timeoutMS) {
                    id = _Global.setTimeout(c, timeoutMS);
                } else {
                    _BaseCoreUtils._setImmediate(c);
                }
            },
            function () {
                if (id) {
                    _Global.clearTimeout(id);
                }
            }
        );
    }

    function timeoutWithPromise(timeout, promise) {
        var cancelPromise = function () { promise.cancel(); };
        var cancelTimeout = function () { timeout.cancel(); };
        timeout.then(cancelPromise);
        promise.then(cancelTimeout, cancelTimeout);
        return promise;
    }

    var staticCanceledPromise;

    var Promise = _Base.Class.derive(PromiseStateMachine,
        function Promise_ctor(init, oncancel) {
            /// <signature helpKeyword="WinJS.Promise">
            /// <summary locid="WinJS.Promise">
            /// A promise provides a mechanism to schedule work to be done on a value that
            /// has not yet been computed. It is a convenient abstraction for managing
            /// interactions with asynchronous APIs.
            /// </summary>
            /// <param name="init" type="Function" locid="WinJS.Promise_p:init">
            /// The function that is called during construction of the  promise. The function
            /// is given three arguments (complete, error, progress). Inside this function
            /// you should add event listeners for the notifications supported by this value.
            /// </param>
            /// <param name="oncancel" optional="true" locid="WinJS.Promise_p:oncancel">
            /// The function to call if a consumer of this promise wants
            /// to cancel its undone work. Promises are not required to
            /// support cancellation.
            /// </param>
            /// </signature>

            if (tagWithStack && (tagWithStack === true || (tagWithStack & tag.promise))) {
                this._stack = Promise._getStack();
            }

            this._oncancel = oncancel;
            this._setState(state_created);
            this._run();

            try {
                var complete = this._completed.bind(this);
                var error = this._error.bind(this);
                var progress = this._progress.bind(this);
                init(complete, error, progress);
            } catch (ex) {
                this._setExceptionValue(ex);
            }
        }, {
            _oncancel: null,

            _cancelAction: function () {
                // BEGIN monaco change
                try {
                    if (this._oncancel) {
                        this._oncancel();
                    } else {
                        throw new Error('Promise did not implement oncancel');
                    }
                } catch (ex) {
                    // Access fields to get them created
                    var msg = ex.message;
                    var stack = ex.stack;
                    promiseEventListeners.dispatchEvent('error', ex);
                }
                // END monaco change
            },
            _cleanupAction: function () { this._oncancel = null; }
        }, {

            addEventListener: function Promise_addEventListener(eventType, listener, capture) {
                /// <signature helpKeyword="WinJS.Promise.addEventListener">
                /// <summary locid="WinJS.Promise.addEventListener">
                /// Adds an event listener to the control.
                /// </summary>
                /// <param name="eventType" locid="WinJS.Promise.addEventListener_p:eventType">
                /// The type (name) of the event.
                /// </param>
                /// <param name="listener" locid="WinJS.Promise.addEventListener_p:listener">
                /// The listener to invoke when the event is raised.
                /// </param>
                /// <param name="capture" locid="WinJS.Promise.addEventListener_p:capture">
                /// Specifies whether or not to initiate capture.
                /// </param>
                /// </signature>
                promiseEventListeners.addEventListener(eventType, listener, capture);
            },
            any: function Promise_any(values) {
                /// <signature helpKeyword="WinJS.Promise.any">
                /// <summary locid="WinJS.Promise.any">
                /// Returns a promise that is fulfilled when one of the input promises
                /// has been fulfilled.
                /// </summary>
                /// <param name="values" type="Array" locid="WinJS.Promise.any_p:values">
                /// An array that contains promise objects or objects whose property
                /// values include promise objects.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.any_returnValue">
                /// A promise that on fulfillment yields the value of the input (complete or error).
                /// </returns>
                /// </signature>
                return new Promise(
                    function (complete, error) {
                        var keys = Object.keys(values);
                        if (keys.length === 0) {
                            complete();
                        }
                        var canceled = 0;
                        keys.forEach(function (key) {
                            Promise.as(values[key]).then(
                                function () { complete({ key: key, value: values[key] }); },
                                function (e) {
                                    if (e instanceof Error && e.name === canceledName) {
                                        if ((++canceled) === keys.length) {
                                            complete(Promise.cancel);
                                        }
                                        return;
                                    }
                                    error({ key: key, value: values[key] });
                                }
                            );
                        });
                    },
                    function () {
                        var keys = Object.keys(values);
                        keys.forEach(function (key) {
                            var promise = Promise.as(values[key]);
                            if (typeof promise.cancel === "function") {
                                promise.cancel();
                            }
                        });
                    }
                );
            },
            as: function Promise_as(value) {
                /// <signature helpKeyword="WinJS.Promise.as">
                /// <summary locid="WinJS.Promise.as">
                /// Returns a promise. If the object is already a promise it is returned;
                /// otherwise the object is wrapped in a promise.
                /// </summary>
                /// <param name="value" locid="WinJS.Promise.as_p:value">
                /// The value to be treated as a promise.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.as_returnValue">
                /// A promise.
                /// </returns>
                /// </signature>
                if (value && typeof value === "object" && typeof value.then === "function") {
                    return value;
                }
                return new CompletePromise(value);
            },
            /// <field type="WinJS.Promise" helpKeyword="WinJS.Promise.cancel" locid="WinJS.Promise.cancel">
            /// Canceled promise value, can be returned from a promise completion handler
            /// to indicate cancelation of the promise chain.
            /// </field>
            cancel: {
                get: function () {
                    return (staticCanceledPromise = staticCanceledPromise || new ErrorPromise(new _ErrorFromName(canceledName)));
                }
            },
            dispatchEvent: function Promise_dispatchEvent(eventType, details) {
                /// <signature helpKeyword="WinJS.Promise.dispatchEvent">
                /// <summary locid="WinJS.Promise.dispatchEvent">
                /// Raises an event of the specified type and properties.
                /// </summary>
                /// <param name="eventType" locid="WinJS.Promise.dispatchEvent_p:eventType">
                /// The type (name) of the event.
                /// </param>
                /// <param name="details" locid="WinJS.Promise.dispatchEvent_p:details">
                /// The set of additional properties to be attached to the event object.
                /// </param>
                /// <returns type="Boolean" locid="WinJS.Promise.dispatchEvent_returnValue">
                /// Specifies whether preventDefault was called on the event.
                /// </returns>
                /// </signature>
                return promiseEventListeners.dispatchEvent(eventType, details);
            },
            is: function Promise_is(value) {
                /// <signature helpKeyword="WinJS.Promise.is">
                /// <summary locid="WinJS.Promise.is">
                /// Determines whether a value fulfills the promise contract.
                /// </summary>
                /// <param name="value" locid="WinJS.Promise.is_p:value">
                /// A value that may be a promise.
                /// </param>
                /// <returns type="Boolean" locid="WinJS.Promise.is_returnValue">
                /// true if the specified value is a promise, otherwise false.
                /// </returns>
                /// </signature>
                return value && typeof value === "object" && typeof value.then === "function";
            },
            join: function Promise_join(values) {
                /// <signature helpKeyword="WinJS.Promise.join">
                /// <summary locid="WinJS.Promise.join">
                /// Creates a promise that is fulfilled when all the values are fulfilled.
                /// </summary>
                /// <param name="values" type="Object" locid="WinJS.Promise.join_p:values">
                /// An object whose fields contain values, some of which may be promises.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.join_returnValue">
                /// A promise whose value is an object with the same field names as those of the object in the values parameter, where
                /// each field value is the fulfilled value of a promise.
                /// </returns>
                /// </signature>
                return new Promise(
                    function (complete, error, progress) {
                        var keys = Object.keys(values);
                        var errors = Array.isArray(values) ? [] : {};
                        var results = Array.isArray(values) ? [] : {};
                        var undefineds = 0;
                        var pending = keys.length;
                        var argDone = function (key) {
                            if ((--pending) === 0) {
                                var errorCount = Object.keys(errors).length;
                                if (errorCount === 0) {
                                    complete(results);
                                } else {
                                    var canceledCount = 0;
                                    keys.forEach(function (key) {
                                        var e = errors[key];
                                        if (e instanceof Error && e.name === canceledName) {
                                            canceledCount++;
                                        }
                                    });
                                    if (canceledCount === errorCount) {
                                        complete(Promise.cancel);
                                    } else {
                                        error(errors);
                                    }
                                }
                            } else {
                                progress({ Key: key, Done: true });
                            }
                        };
                        keys.forEach(function (key) {
                            var value = values[key];
                            if (value === undefined) {
                                undefineds++;
                            } else {
                                Promise.then(value,
                                    function (value) { results[key] = value; argDone(key); },
                                    function (value) { errors[key] = value; argDone(key); }
                                );
                            }
                        });
                        pending -= undefineds;
                        if (pending === 0) {
                            complete(results);
                            return;
                        }
                    },
                    function () {
                        Object.keys(values).forEach(function (key) {
                            var promise = Promise.as(values[key]);
                            if (typeof promise.cancel === "function") {
                                promise.cancel();
                            }
                        });
                    }
                );
            },
            removeEventListener: function Promise_removeEventListener(eventType, listener, capture) {
                /// <signature helpKeyword="WinJS.Promise.removeEventListener">
                /// <summary locid="WinJS.Promise.removeEventListener">
                /// Removes an event listener from the control.
                /// </summary>
                /// <param name='eventType' locid="WinJS.Promise.removeEventListener_eventType">
                /// The type (name) of the event.
                /// </param>
                /// <param name='listener' locid="WinJS.Promise.removeEventListener_listener">
                /// The listener to remove.
                /// </param>
                /// <param name='capture' locid="WinJS.Promise.removeEventListener_capture">
                /// Specifies whether or not to initiate capture.
                /// </param>
                /// </signature>
                promiseEventListeners.removeEventListener(eventType, listener, capture);
            },
            supportedForProcessing: false,
            then: function Promise_then(value, onComplete, onError, onProgress) {
                /// <signature helpKeyword="WinJS.Promise.then">
                /// <summary locid="WinJS.Promise.then">
                /// A static version of the promise instance method then().
                /// </summary>
                /// <param name="value" locid="WinJS.Promise.then_p:value">
                /// the value to be treated as a promise.
                /// </param>
                /// <param name="onComplete" type="Function" locid="WinJS.Promise.then_p:complete">
                /// The function to be called if the promise is fulfilled with a value.
                /// If it is null, the promise simply
                /// returns the value. The value is passed as the single argument.
                /// </param>
                /// <param name="onError" type="Function" optional="true" locid="WinJS.Promise.then_p:error">
                /// The function to be called if the promise is fulfilled with an error. The error
                /// is passed as the single argument.
                /// </param>
                /// <param name="onProgress" type="Function" optional="true" locid="WinJS.Promise.then_p:progress">
                /// The function to be called if the promise reports progress. Data about the progress
                /// is passed as the single argument. Promises are not required to support
                /// progress.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.then_returnValue">
                /// A promise whose value is the result of executing the provided complete function.
                /// </returns>
                /// </signature>
                return Promise.as(value).then(onComplete, onError, onProgress);
            },
            thenEach: function Promise_thenEach(values, onComplete, onError, onProgress) {
                /// <signature helpKeyword="WinJS.Promise.thenEach">
                /// <summary locid="WinJS.Promise.thenEach">
                /// Performs an operation on all the input promises and returns a promise
                /// that has the shape of the input and contains the result of the operation
                /// that has been performed on each input.
                /// </summary>
                /// <param name="values" locid="WinJS.Promise.thenEach_p:values">
                /// A set of values (which could be either an array or an object) of which some or all are promises.
                /// </param>
                /// <param name="onComplete" type="Function" locid="WinJS.Promise.thenEach_p:complete">
                /// The function to be called if the promise is fulfilled with a value.
                /// If the value is null, the promise returns the value.
                /// The value is passed as the single argument.
                /// </param>
                /// <param name="onError" type="Function" optional="true" locid="WinJS.Promise.thenEach_p:error">
                /// The function to be called if the promise is fulfilled with an error. The error
                /// is passed as the single argument.
                /// </param>
                /// <param name="onProgress" type="Function" optional="true" locid="WinJS.Promise.thenEach_p:progress">
                /// The function to be called if the promise reports progress. Data about the progress
                /// is passed as the single argument. Promises are not required to support
                /// progress.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.thenEach_returnValue">
                /// A promise that is the result of calling Promise.join on the values parameter.
                /// </returns>
                /// </signature>
                var result = Array.isArray(values) ? [] : {};
                Object.keys(values).forEach(function (key) {
                    result[key] = Promise.as(values[key]).then(onComplete, onError, onProgress);
                });
                return Promise.join(result);
            },
            timeout: function Promise_timeout(time, promise) {
                /// <signature helpKeyword="WinJS.Promise.timeout">
                /// <summary locid="WinJS.Promise.timeout">
                /// Creates a promise that is fulfilled after a timeout.
                /// </summary>
                /// <param name="timeout" type="Number" optional="true" locid="WinJS.Promise.timeout_p:timeout">
                /// The timeout period in milliseconds. If this value is zero or not specified
                /// setImmediate is called, otherwise setTimeout is called.
                /// </param>
                /// <param name="promise" type="Promise" optional="true" locid="WinJS.Promise.timeout_p:promise">
                /// A promise that will be canceled if it doesn't complete before the
                /// timeout has expired.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.timeout_returnValue">
                /// A promise that is completed asynchronously after the specified timeout.
                /// </returns>
                /// </signature>
                var to = timeout(time);
                return promise ? timeoutWithPromise(to, promise) : to;
            },
            wrap: function Promise_wrap(value) {
                /// <signature helpKeyword="WinJS.Promise.wrap">
                /// <summary locid="WinJS.Promise.wrap">
                /// Wraps a non-promise value in a promise. You can use this function if you need
                /// to pass a value to a function that requires a promise.
                /// </summary>
                /// <param name="value" locid="WinJS.Promise.wrap_p:value">
                /// Some non-promise value to be wrapped in a promise.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.wrap_returnValue">
                /// A promise that is successfully fulfilled with the specified value
                /// </returns>
                /// </signature>
                return new CompletePromise(value);
            },
            wrapError: function Promise_wrapError(error) {
                /// <signature helpKeyword="WinJS.Promise.wrapError">
                /// <summary locid="WinJS.Promise.wrapError">
                /// Wraps a non-promise error value in a promise. You can use this function if you need
                /// to pass an error to a function that requires a promise.
                /// </summary>
                /// <param name="error" locid="WinJS.Promise.wrapError_p:error">
                /// A non-promise error value to be wrapped in a promise.
                /// </param>
                /// <returns type="WinJS.Promise" locid="WinJS.Promise.wrapError_returnValue">
                /// A promise that is in an error state with the specified value.
                /// </returns>
                /// </signature>
                return new ErrorPromise(error);
            },

            _veryExpensiveTagWithStack: {
                get: function () { return tagWithStack; },
                set: function (value) { tagWithStack = value; }
            },
            _veryExpensiveTagWithStack_tag: tag,
            _getStack: function () {
                if (_Global.Debug && _Global.Debug.debuggerEnabled) {
                    try { throw new Error(); } catch (e) { return e.stack; }
                }
            },

            _cancelBlocker: function Promise__cancelBlocker(input, oncancel) {
                //
                // Returns a promise which on cancelation will still result in downstream cancelation while
                //  protecting the promise 'input' from being  canceled which has the effect of allowing
                //  'input' to be shared amoung various consumers.
                //
                if (!Promise.is(input)) {
                    return Promise.wrap(input);
                }
                var complete;
                var error;
                var output = new Promise(
                    function (c, e) {
                        complete = c;
                        error = e;
                    },
                    function () {
                        complete = null;
                        error = null;
                        oncancel && oncancel();
                    }
                );
                input.then(
                    function (v) { complete && complete(v); },
                    function (e) { error && error(e); }
                );
                return output;
            },

        }
    );
    Object.defineProperties(Promise, _Events.createEventProperties(errorET));

    Promise._doneHandler = function (value) {
        _BaseCoreUtils._setImmediate(function Promise_done_rethrow() {
            throw value;
        });
    };

    return {
        PromiseStateMachine: PromiseStateMachine,
        Promise: Promise,
        state_created: state_created
    };
});

_winjs("WinJS/Promise", ["WinJS/Core/_Base","WinJS/Promise/_StateMachine"], function promiseInit( _Base, _StateMachine) {
    "use strict";

    _Base.Namespace.define("WinJS", {
        Promise: _StateMachine.Promise
    });

    return _StateMachine.Promise;
});

__winjs_exports = _modules["WinJS/Core/_WinJS"];
__winjs_exports.TPromise = __winjs_exports.Promise;
__winjs_exports.PPromise = __winjs_exports.Promise;

// ESM-comment-begin
if (typeof exports === 'undefined' && typeof define === 'function' && define.amd) {
    define("vs/base/common/winjs.base", [], __winjs_exports);
} else {
    module.exports = __winjs_exports;
}
// ESM-comment-end

})();

// ESM-uncomment-begin
// export var Promise = __winjs_exports.Promise;
// export var TPromise = __winjs_exports.TPromise;
// export var PPromise = __winjs_exports.PPromise;
// ESM-uncomment-end

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(__m[31/*vs/base/common/arrays*/], __M([0/*require*/,1/*exports*/,3/*vs/base/common/winjs.base*/]), function (require, exports, winjs_base_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Returns the last element of an array.
     * @param array The array.
     * @param n Which element from the end (default is zero).
     */
    function tail(array, n) {
        if (n === void 0) { n = 0; }
        return array[array.length - (1 + n)];
    }
    exports.tail = tail;
    function tail2(arr) {
        if (arr.length === 0) {
            throw new Error('Invalid tail call');
        }
        return [arr.slice(0, arr.length - 1), arr[arr.length - 1]];
    }
    exports.tail2 = tail2;
    function equals(one, other, itemEquals) {
        if (itemEquals === void 0) { itemEquals = function (a, b) { return a === b; }; }
        if (one.length !== other.length) {
            return false;
        }
        for (var i = 0, len = one.length; i < len; i++) {
            if (!itemEquals(one[i], other[i])) {
                return false;
            }
        }
        return true;
    }
    exports.equals = equals;
    function binarySearch(array, key, comparator) {
        var low = 0, high = array.length - 1;
        while (low <= high) {
            var mid = ((low + high) / 2) | 0;
            var comp = comparator(array[mid], key);
            if (comp < 0) {
                low = mid + 1;
            }
            else if (comp > 0) {
                high = mid - 1;
            }
            else {
                return mid;
            }
        }
        return -(low + 1);
    }
    exports.binarySearch = binarySearch;
    /**
     * Takes a sorted array and a function p. The array is sorted in such a way that all elements where p(x) is false
     * are located before all elements where p(x) is true.
     * @returns the least x for which p(x) is true or array.length if no element fullfills the given function.
     */
    function findFirstInSorted(array, p) {
        var low = 0, high = array.length;
        if (high === 0) {
            return 0; // no children
        }
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (p(array[mid])) {
                high = mid;
            }
            else {
                low = mid + 1;
            }
        }
        return low;
    }
    exports.findFirstInSorted = findFirstInSorted;
    /**
     * Like `Array#sort` but always stable. Usually runs a little slower `than Array#sort`
     * so only use this when actually needing stable sort.
     */
    function mergeSort(data, compare) {
        _sort(data, compare, 0, data.length - 1, []);
        return data;
    }
    exports.mergeSort = mergeSort;
    function _merge(a, compare, lo, mid, hi, aux) {
        var leftIdx = lo, rightIdx = mid + 1;
        for (var i = lo; i <= hi; i++) {
            aux[i] = a[i];
        }
        for (var i = lo; i <= hi; i++) {
            if (leftIdx > mid) {
                // left side consumed
                a[i] = aux[rightIdx++];
            }
            else if (rightIdx > hi) {
                // right side consumed
                a[i] = aux[leftIdx++];
            }
            else if (compare(aux[rightIdx], aux[leftIdx]) < 0) {
                // right element is less -> comes first
                a[i] = aux[rightIdx++];
            }
            else {
                // left element comes first (less or equal)
                a[i] = aux[leftIdx++];
            }
        }
    }
    function _sort(a, compare, lo, hi, aux) {
        if (hi <= lo) {
            return;
        }
        var mid = lo + ((hi - lo) / 2) | 0;
        _sort(a, compare, lo, mid, aux);
        _sort(a, compare, mid + 1, hi, aux);
        if (compare(a[mid], a[mid + 1]) <= 0) {
            // left and right are sorted and if the last-left element is less
            // or equals than the first-right element there is nothing else
            // to do
            return;
        }
        _merge(a, compare, lo, mid, hi, aux);
    }
    function groupBy(data, compare) {
        var result = [];
        var currentGroup;
        for (var _i = 0, _a = mergeSort(data.slice(0), compare); _i < _a.length; _i++) {
            var element = _a[_i];
            if (!currentGroup || compare(currentGroup[0], element) !== 0) {
                currentGroup = [element];
                result.push(currentGroup);
            }
            else {
                currentGroup.push(element);
            }
        }
        return result;
    }
    exports.groupBy = groupBy;
    /**
     * Diffs two *sorted* arrays and computes the splices which apply the diff.
     */
    function sortedDiff(before, after, compare) {
        var result = [];
        function pushSplice(start, deleteCount, toInsert) {
            var _a;
            if (deleteCount === 0 && toInsert.length === 0) {
                return;
            }
            var latest = result[result.length - 1];
            if (latest && latest.start + latest.deleteCount === start) {
                latest.deleteCount += deleteCount;
                (_a = latest.toInsert).push.apply(_a, toInsert);
            }
            else {
                result.push({ start: start, deleteCount: deleteCount, toInsert: toInsert });
            }
        }
        var beforeIdx = 0;
        var afterIdx = 0;
        while (true) {
            if (beforeIdx === before.length) {
                pushSplice(beforeIdx, 0, after.slice(afterIdx));
                break;
            }
            if (afterIdx === after.length) {
                pushSplice(beforeIdx, before.length - beforeIdx, []);
                break;
            }
            var beforeElement = before[beforeIdx];
            var afterElement = after[afterIdx];
            var n = compare(beforeElement, afterElement);
            if (n === 0) {
                // equal
                beforeIdx += 1;
                afterIdx += 1;
            }
            else if (n < 0) {
                // beforeElement is smaller -> before element removed
                pushSplice(beforeIdx, 1, []);
                beforeIdx += 1;
            }
            else if (n > 0) {
                // beforeElement is greater -> after element added
                pushSplice(beforeIdx, 0, [afterElement]);
                afterIdx += 1;
            }
        }
        return result;
    }
    exports.sortedDiff = sortedDiff;
    /**
     * Takes two *sorted* arrays and computes their delta (removed, added elements).
     * Finishes in `Math.min(before.length, after.length)` steps.
     * @param before
     * @param after
     * @param compare
     */
    function delta(before, after, compare) {
        var splices = sortedDiff(before, after, compare);
        var removed = [];
        var added = [];
        for (var _i = 0, splices_1 = splices; _i < splices_1.length; _i++) {
            var splice = splices_1[_i];
            removed.push.apply(removed, before.slice(splice.start, splice.start + splice.deleteCount));
            added.push.apply(added, splice.toInsert);
        }
        return { removed: removed, added: added };
    }
    exports.delta = delta;
    /**
     * Returns the top N elements from the array.
     *
     * Faster than sorting the entire array when the array is a lot larger than N.
     *
     * @param array The unsorted array.
     * @param compare A sort function for the elements.
     * @param n The number of elements to return.
     * @return The first n elemnts from array when sorted with compare.
     */
    function top(array, compare, n) {
        if (n === 0) {
            return [];
        }
        var result = array.slice(0, n).sort(compare);
        topStep(array, compare, result, n, array.length);
        return result;
    }
    exports.top = top;
    /**
     * Asynchronous variant of `top()` allowing for splitting up work in batches between which the event loop can run.
     *
     * Returns the top N elements from the array.
     *
     * Faster than sorting the entire array when the array is a lot larger than N.
     *
     * @param array The unsorted array.
     * @param compare A sort function for the elements.
     * @param n The number of elements to return.
     * @param batch The number of elements to examine before yielding to the event loop.
     * @return The first n elemnts from array when sorted with compare.
     */
    function topAsync(array, compare, n, batch) {
        var _this = this;
        if (n === 0) {
            return winjs_base_1.TPromise.as([]);
        }
        var canceled = false;
        return new winjs_base_1.TPromise(function (resolve, reject) {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var o, result, i, m;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            o = array.length;
                            result = array.slice(0, n).sort(compare);
                            i = n, m = Math.min(n + batch, o);
                            _a.label = 1;
                        case 1:
                            if (!(i < o)) return [3 /*break*/, 5];
                            if (!(i > n)) return [3 /*break*/, 3];
                            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve); })];
                        case 2:
                            _a.sent(); // nextTick() would starve I/O.
                            _a.label = 3;
                        case 3:
                            if (canceled) {
                                throw new Error('canceled');
                            }
                            topStep(array, compare, result, i, m);
                            _a.label = 4;
                        case 4:
                            i = m, m = Math.min(m + batch, o);
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/, result];
                    }
                });
            }); })()
                .then(resolve, reject);
        }, function () {
            canceled = true;
        });
    }
    exports.topAsync = topAsync;
    function topStep(array, compare, result, i, m) {
        var _loop_1 = function (n) {
            var element = array[i];
            if (compare(element, result[n - 1]) < 0) {
                result.pop();
                var j = findFirstInSorted(result, function (e) { return compare(element, e) < 0; });
                result.splice(j, 0, element);
            }
        };
        for (var n = result.length; i < m; i++) {
            _loop_1(n);
        }
    }
    function coalesce(array, inplace) {
        if (!array) {
            if (!inplace) {
                return array;
            }
        }
        if (!inplace) {
            return array.filter(function (e) { return !!e; });
        }
        else {
            var to = 0;
            for (var i = 0; i < array.length; i++) {
                if (!!array[i]) {
                    array[to] = array[i];
                    to += 1;
                }
            }
            array.length = to;
        }
    }
    exports.coalesce = coalesce;
    /**
     * Moves the element in the array for the provided positions.
     */
    function move(array, from, to) {
        array.splice(to, 0, array.splice(from, 1)[0]);
    }
    exports.move = move;
    /**
     * @returns {{false}} if the provided object is an array
     * 	and not empty.
     */
    function isFalsyOrEmpty(obj) {
        return !Array.isArray(obj) || obj.length === 0;
    }
    exports.isFalsyOrEmpty = isFalsyOrEmpty;
    /**
     * Removes duplicates from the given array. The optional keyFn allows to specify
     * how elements are checked for equalness by returning a unique string for each.
     */
    function distinct(array, keyFn) {
        if (!keyFn) {
            return array.filter(function (element, position) {
                return array.indexOf(element) === position;
            });
        }
        var seen = Object.create(null);
        return array.filter(function (elem) {
            var key = keyFn(elem);
            if (seen[key]) {
                return false;
            }
            seen[key] = true;
            return true;
        });
    }
    exports.distinct = distinct;
    function uniqueFilter(keyFn) {
        var seen = Object.create(null);
        return function (element) {
            var key = keyFn(element);
            if (seen[key]) {
                return false;
            }
            seen[key] = true;
            return true;
        };
    }
    exports.uniqueFilter = uniqueFilter;
    function firstIndex(array, fn) {
        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (fn(element)) {
                return i;
            }
        }
        return -1;
    }
    exports.firstIndex = firstIndex;
    function first(array, fn, notFoundValue) {
        if (notFoundValue === void 0) { notFoundValue = null; }
        var index = firstIndex(array, fn);
        return index < 0 ? notFoundValue : array[index];
    }
    exports.first = first;
    function commonPrefixLength(one, other, equals) {
        if (equals === void 0) { equals = function (a, b) { return a === b; }; }
        var result = 0;
        for (var i = 0, len = Math.min(one.length, other.length); i < len && equals(one[i], other[i]); i++) {
            result++;
        }
        return result;
    }
    exports.commonPrefixLength = commonPrefixLength;
    function flatten(arr) {
        return [].concat.apply([], arr);
    }
    exports.flatten = flatten;
    function range(arg, to) {
        var from = typeof to === 'number' ? arg : 0;
        if (typeof to === 'number') {
            from = arg;
        }
        else {
            from = 0;
            to = arg;
        }
        var result = [];
        if (from <= to) {
            for (var i = from; i < to; i++) {
                result.push(i);
            }
        }
        else {
            for (var i = from; i > to; i--) {
                result.push(i);
            }
        }
        return result;
    }
    exports.range = range;
    function fill(num, valueFn, arr) {
        if (arr === void 0) { arr = []; }
        for (var i = 0; i < num; i++) {
            arr[i] = valueFn();
        }
        return arr;
    }
    exports.fill = fill;
    function index(array, indexer, merger) {
        if (merger === void 0) { merger = function (t) { return t; }; }
        return array.reduce(function (r, t) {
            var key = indexer(t);
            r[key] = merger(t, r[key]);
            return r;
        }, Object.create(null));
    }
    exports.index = index;
    /**
     * Inserts an element into an array. Returns a function which, when
     * called, will remove that element from the array.
     */
    function insert(array, element) {
        array.push(element);
        return function () {
            var index = array.indexOf(element);
            if (index > -1) {
                array.splice(index, 1);
            }
        };
    }
    exports.insert = insert;
    /**
     * Insert `insertArr` inside `target` at `insertIndex`.
     * Please don't touch unless you understand https://jsperf.com/inserting-an-array-within-an-array
     */
    function arrayInsert(target, insertIndex, insertArr) {
        var before = target.slice(0, insertIndex);
        var after = target.slice(insertIndex);
        return before.concat(insertArr, after);
    }
    exports.arrayInsert = arrayInsert;
    /**
     * Uses Fisher-Yates shuffle to shuffle the given array
     * @param array
     */
    function shuffle(array, seed) {
        // Seeded random number generator in JS. Modified from:
        // https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
        var random = function () {
            var x = Math.sin(seed++) * 179426549; // throw away most significant digits and reduce any potential bias
            return x - Math.floor(x);
        };
        var rand = typeof seed === 'number' ? random : Math.random;
        for (var i = array.length - 1; i > 0; i -= 1) {
            var j = Math.floor(rand() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    exports.shuffle = shuffle;
    /**
     * Pushes an element to the start of the array, if found.
     */
    function pushToStart(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
            arr.unshift(value);
        }
    }
    exports.pushToStart = pushToStart;
    /**
     * Pushes an element to the end of the array, if found.
     */
    function pushToEnd(arr, value) {
        var index = arr.indexOf(value);
        if (index > -1) {
            arr.splice(index, 1);
            arr.push(value);
        }
    }
    exports.pushToEnd = pushToEnd;
});

define(__m[19/*vs/base/common/errors*/], __M([0/*require*/,1/*exports*/,3/*vs/base/common/winjs.base*/]), function (require, exports, winjs_base_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // ------ BEGIN Hook up error listeners to winjs promises
    var outstandingPromiseErrors = {};
    function promiseErrorHandler(e) {
        //
        // e.detail looks like: { exception, error, promise, handler, id, parent }
        //
        var details = e.detail;
        var id = details.id;
        // If the error has a parent promise then this is not the origination of the
        //  error so we check if it has a handler, and if so we mark that the error
        //  was handled by removing it from outstandingPromiseErrors
        //
        if (details.parent) {
            if (details.handler && outstandingPromiseErrors) {
                delete outstandingPromiseErrors[id];
            }
            return;
        }
        // Indicate that this error was originated and needs to be handled
        outstandingPromiseErrors[id] = details;
        // The first time the queue fills up this iteration, schedule a timeout to
        // check if any errors are still unhandled.
        if (Object.keys(outstandingPromiseErrors).length === 1) {
            setTimeout(function () {
                var errors = outstandingPromiseErrors;
                outstandingPromiseErrors = {};
                Object.keys(errors).forEach(function (errorId) {
                    var error = errors[errorId];
                    if (error.exception) {
                        onUnexpectedError(error.exception);
                    }
                    else if (error.error) {
                        onUnexpectedError(error.error);
                    }
                    console.log('WARNING: Promise with no error callback:' + error.id);
                    console.log(error);
                    if (error.exception) {
                        console.log(error.exception.stack);
                    }
                });
            }, 0);
        }
    }
    winjs_base_1.TPromise.addEventListener('error', promiseErrorHandler);
    // Avoid circular dependency on EventEmitter by implementing a subset of the interface.
    var ErrorHandler = /** @class */ (function () {
        function ErrorHandler() {
            this.listeners = [];
            this.unexpectedErrorHandler = function (e) {
                setTimeout(function () {
                    if (e.stack) {
                        throw new Error(e.message + '\n\n' + e.stack);
                    }
                    throw e;
                }, 0);
            };
        }
        ErrorHandler.prototype.addListener = function (listener) {
            var _this = this;
            this.listeners.push(listener);
            return function () {
                _this._removeListener(listener);
            };
        };
        ErrorHandler.prototype.emit = function (e) {
            this.listeners.forEach(function (listener) {
                listener(e);
            });
        };
        ErrorHandler.prototype._removeListener = function (listener) {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        };
        ErrorHandler.prototype.setUnexpectedErrorHandler = function (newUnexpectedErrorHandler) {
            this.unexpectedErrorHandler = newUnexpectedErrorHandler;
        };
        ErrorHandler.prototype.getUnexpectedErrorHandler = function () {
            return this.unexpectedErrorHandler;
        };
        ErrorHandler.prototype.onUnexpectedError = function (e) {
            this.unexpectedErrorHandler(e);
            this.emit(e);
        };
        // For external errors, we don't want the listeners to be called
        ErrorHandler.prototype.onUnexpectedExternalError = function (e) {
            this.unexpectedErrorHandler(e);
        };
        return ErrorHandler;
    }());
    exports.ErrorHandler = ErrorHandler;
    exports.errorHandler = new ErrorHandler();
    function setUnexpectedErrorHandler(newUnexpectedErrorHandler) {
        exports.errorHandler.setUnexpectedErrorHandler(newUnexpectedErrorHandler);
    }
    exports.setUnexpectedErrorHandler = setUnexpectedErrorHandler;
    function onUnexpectedError(e) {
        // ignore errors from cancelled promises
        if (!isPromiseCanceledError(e)) {
            exports.errorHandler.onUnexpectedError(e);
        }
        return undefined;
    }
    exports.onUnexpectedError = onUnexpectedError;
    function onUnexpectedExternalError(e) {
        // ignore errors from cancelled promises
        if (!isPromiseCanceledError(e)) {
            exports.errorHandler.onUnexpectedExternalError(e);
        }
        return undefined;
    }
    exports.onUnexpectedExternalError = onUnexpectedExternalError;
    function transformErrorForSerialization(error) {
        if (error instanceof Error) {
            var name_1 = error.name, message = error.message;
            var stack = error.stacktrace || error.stack;
            return {
                $isError: true,
                name: name_1,
                message: message,
                stack: stack
            };
        }
        // return as is
        return error;
    }
    exports.transformErrorForSerialization = transformErrorForSerialization;
    var canceledName = 'Canceled';
    /**
     * Checks if the given error is a promise in canceled state
     */
    function isPromiseCanceledError(error) {
        return error instanceof Error && error.name === canceledName && error.message === canceledName;
    }
    exports.isPromiseCanceledError = isPromiseCanceledError;
    /**
     * Returns an error that signals cancellation.
     */
    function canceled() {
        var error = new Error(canceledName);
        error.name = error.message;
        return error;
    }
    exports.canceled = canceled;
    function illegalArgument(name) {
        if (name) {
            return new Error("Illegal argument: " + name);
        }
        else {
            return new Error('Illegal argument');
        }
    }
    exports.illegalArgument = illegalArgument;
    function illegalState(name) {
        if (name) {
            return new Error("Illegal state: " + name);
        }
        else {
            return new Error('Illegal state');
        }
    }
    exports.illegalState = illegalState;
    function readonly(name) {
        return name
            ? new Error("readonly property '" + name + " cannot be changed'")
            : new Error('readonly property cannot be changed');
    }
    exports.readonly = readonly;
    function disposed(what) {
        var result = new Error(what + " has been disposed");
        result.name = 'DISPOSED';
        return result;
    }
    exports.disposed = disposed;
    function isErrorWithActions(obj) {
        return obj instanceof Error && Array.isArray(obj.actions);
    }
    exports.isErrorWithActions = isErrorWithActions;
    function create(message, options) {
        if (options === void 0) { options = Object.create(null); }
        var result = new Error(message);
        if (options.actions) {
            result.actions = options.actions;
        }
        return result;
    }
    exports.create = create;
    function getErrorMessage(err) {
        if (!err) {
            return 'Error';
        }
        if (err.message) {
            return err.message;
        }
        if (err.stack) {
            return err.stack.split('\n')[0];
        }
        return String(err);
    }
    exports.getErrorMessage = getErrorMessage;
});














































define(__m[2/*vs/base/common/event*/], __M([0/*require*/,1/*exports*/,19/*vs/base/common/errors*/,28/*vs/base/common/functional*/,6/*vs/base/common/lifecycle*/,70/*vs/base/common/linkedList*/,3/*vs/base/common/winjs.base*/]), function (require, exports, errors_1, functional_1, lifecycle_1, linkedList_1, winjs_base_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Event;
    (function (Event) {
        var _disposable = { dispose: function () { } };
        Event.None = function () { return _disposable; };
    })(Event = exports.Event || (exports.Event = {}));
    /**
     * The Emitter can be used to expose an Event to the public
     * to fire it from the insides.
     * Sample:
        class Document {
    
            private _onDidChange = new Emitter<(value:string)=>any>();
    
            public onDidChange = this._onDidChange.event;
    
            // getter-style
            // get onDidChange(): Event<(value:string)=>any> {
            // 	return this._onDidChange.event;
            // }
    
            private _doIt() {
                //...
                this._onDidChange.fire(value);
            }
        }
     */
    var Emitter = /** @class */ (function () {
        function Emitter(_options) {
            this._options = _options;
        }
        Object.defineProperty(Emitter.prototype, "event", {
            /**
             * For the public to allow to subscribe
             * to events from this Emitter
             */
            get: function () {
                var _this = this;
                if (!this._event) {
                    this._event = function (listener, thisArgs, disposables) {
                        if (!_this._listeners) {
                            _this._listeners = new linkedList_1.LinkedList();
                        }
                        var firstListener = _this._listeners.isEmpty();
                        if (firstListener && _this._options && _this._options.onFirstListenerAdd) {
                            _this._options.onFirstListenerAdd(_this);
                        }
                        var remove = _this._listeners.push(!thisArgs ? listener : [listener, thisArgs]);
                        if (firstListener && _this._options && _this._options.onFirstListenerDidAdd) {
                            _this._options.onFirstListenerDidAdd(_this);
                        }
                        if (_this._options && _this._options.onListenerDidAdd) {
                            _this._options.onListenerDidAdd(_this, listener, thisArgs);
                        }
                        var result;
                        result = {
                            dispose: function () {
                                result.dispose = Emitter._noop;
                                if (!_this._disposed) {
                                    remove();
                                    if (_this._options && _this._options.onLastListenerRemove && _this._listeners.isEmpty()) {
                                        _this._options.onLastListenerRemove(_this);
                                    }
                                }
                            }
                        };
                        if (Array.isArray(disposables)) {
                            disposables.push(result);
                        }
                        return result;
                    };
                }
                return this._event;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * To be kept private to fire an event to
         * subscribers
         */
        Emitter.prototype.fire = function (event) {
            if (this._listeners) {
                // put all [listener,event]-pairs into delivery queue
                // then emit all event. an inner/nested event might be
                // the driver of this
                if (!this._deliveryQueue) {
                    this._deliveryQueue = [];
                }
                for (var iter = this._listeners.iterator(), e = iter.next(); !e.done; e = iter.next()) {
                    this._deliveryQueue.push([e.value, event]);
                }
                while (this._deliveryQueue.length > 0) {
                    var _a = this._deliveryQueue.shift(), listener = _a[0], event_1 = _a[1];
                    try {
                        if (typeof listener === 'function') {
                            listener.call(undefined, event_1);
                        }
                        else {
                            listener[0].call(listener[1], event_1);
                        }
                    }
                    catch (e) {
                        errors_1.onUnexpectedError(e);
                    }
                }
            }
        };
        Emitter.prototype.dispose = function () {
            if (this._listeners) {
                this._listeners = undefined;
            }
            if (this._deliveryQueue) {
                this._deliveryQueue.length = 0;
            }
            this._disposed = true;
        };
        Emitter._noop = function () { };
        return Emitter;
    }());
    exports.Emitter = Emitter;
    var AsyncEmitter = /** @class */ (function (_super) {
        __extends(AsyncEmitter, _super);
        function AsyncEmitter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AsyncEmitter.prototype.fireAsync = function (eventFn) {
            return __awaiter(this, void 0, void 0, function () {
                var iter, e, thenables, _a, listener, event_2, thenables;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this._listeners) {
                                return [2 /*return*/];
                            }
                            // put all [listener,event]-pairs into delivery queue
                            // then emit all event. an inner/nested event might be
                            // the driver of this
                            if (!this._asyncDeliveryQueue) {
                                this._asyncDeliveryQueue = [];
                            }
                            for (iter = this._listeners.iterator(), e = iter.next(); !e.done; e = iter.next()) {
                                thenables = [];
                                this._asyncDeliveryQueue.push([e.value, eventFn(thenables, typeof e.value === 'function' ? e.value : e.value[0]), thenables]);
                            }
                            _b.label = 1;
                        case 1:
                            if (!(this._asyncDeliveryQueue.length > 0)) return [3 /*break*/, 3];
                            _a = this._asyncDeliveryQueue.shift(), listener = _a[0], event_2 = _a[1], thenables = _a[2];
                            try {
                                if (typeof listener === 'function') {
                                    listener.call(undefined, event_2);
                                }
                                else {
                                    listener[0].call(listener[1], event_2);
                                }
                            }
                            catch (e) {
                                errors_1.onUnexpectedError(e);
                                return [3 /*break*/, 1];
                            }
                            // freeze thenables-collection to enforce sync-calls to
                            // wait until and then wait for all thenables to resolve
                            Object.freeze(thenables);
                            return [4 /*yield*/, Promise.all(thenables)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return AsyncEmitter;
    }(Emitter));
    exports.AsyncEmitter = AsyncEmitter;
    var EventMultiplexer = /** @class */ (function () {
        function EventMultiplexer() {
            var _this = this;
            this.hasListeners = false;
            this.events = [];
            this.emitter = new Emitter({
                onFirstListenerAdd: function () { return _this.onFirstListenerAdd(); },
                onLastListenerRemove: function () { return _this.onLastListenerRemove(); }
            });
        }
        Object.defineProperty(EventMultiplexer.prototype, "event", {
            get: function () {
                return this.emitter.event;
            },
            enumerable: true,
            configurable: true
        });
        EventMultiplexer.prototype.add = function (event) {
            var _this = this;
            var e = { event: event, listener: null };
            this.events.push(e);
            if (this.hasListeners) {
                this.hook(e);
            }
            var dispose = function () {
                if (_this.hasListeners) {
                    _this.unhook(e);
                }
                var idx = _this.events.indexOf(e);
                _this.events.splice(idx, 1);
            };
            return lifecycle_1.toDisposable(functional_1.once(dispose));
        };
        EventMultiplexer.prototype.onFirstListenerAdd = function () {
            var _this = this;
            this.hasListeners = true;
            this.events.forEach(function (e) { return _this.hook(e); });
        };
        EventMultiplexer.prototype.onLastListenerRemove = function () {
            var _this = this;
            this.hasListeners = false;
            this.events.forEach(function (e) { return _this.unhook(e); });
        };
        EventMultiplexer.prototype.hook = function (e) {
            var _this = this;
            e.listener = e.event(function (r) { return _this.emitter.fire(r); });
        };
        EventMultiplexer.prototype.unhook = function (e) {
            e.listener.dispose();
            e.listener = null;
        };
        EventMultiplexer.prototype.dispose = function () {
            this.emitter.dispose();
        };
        return EventMultiplexer;
    }());
    exports.EventMultiplexer = EventMultiplexer;
    function fromCallback(fn) {
        var listener;
        var emitter = new Emitter({
            onFirstListenerAdd: function () { return listener = fn(function (e) { return emitter.fire(e); }); },
            onLastListenerRemove: function () { return listener.dispose(); }
        });
        return emitter.event;
    }
    exports.fromCallback = fromCallback;
    function fromPromise(promise) {
        var emitter = new Emitter();
        var shouldEmit = false;
        promise
            .then(null, function () { return null; })
            .then(function () {
            if (!shouldEmit) {
                setTimeout(function () { return emitter.fire(); }, 0);
            }
            else {
                emitter.fire();
            }
        });
        shouldEmit = true;
        return emitter.event;
    }
    exports.fromPromise = fromPromise;
    function toPromise(event) {
        return new winjs_base_1.TPromise(function (complete) {
            var sub = event(function (e) {
                sub.dispose();
                complete(e);
            });
        });
    }
    exports.toPromise = toPromise;
    function once(event) {
        return function (listener, thisArgs, disposables) {
            if (thisArgs === void 0) { thisArgs = null; }
            var result = event(function (e) {
                result.dispose();
                return listener.call(thisArgs, e);
            }, null, disposables);
            return result;
        };
    }
    exports.once = once;
    function anyEvent() {
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        return function (listener, thisArgs, disposables) {
            if (thisArgs === void 0) { thisArgs = null; }
            return lifecycle_1.combinedDisposable(events.map(function (event) { return event(function (e) { return listener.call(thisArgs, e); }, null, disposables); }));
        };
    }
    exports.anyEvent = anyEvent;
    function debounceEvent(event, merger, delay, leading) {
        if (delay === void 0) { delay = 100; }
        if (leading === void 0) { leading = false; }
        var subscription;
        var output = undefined;
        var handle = undefined;
        var numDebouncedCalls = 0;
        var emitter = new Emitter({
            onFirstListenerAdd: function () {
                subscription = event(function (cur) {
                    numDebouncedCalls++;
                    output = merger(output, cur);
                    if (leading && !handle) {
                        emitter.fire(output);
                    }
                    clearTimeout(handle);
                    handle = setTimeout(function () {
                        var _output = output;
                        output = undefined;
                        handle = undefined;
                        if (!leading || numDebouncedCalls > 1) {
                            emitter.fire(_output);
                        }
                        numDebouncedCalls = 0;
                    }, delay);
                });
            },
            onLastListenerRemove: function () {
                subscription.dispose();
            }
        });
        return emitter.event;
    }
    exports.debounceEvent = debounceEvent;
    /**
     * The EventDelayer is useful in situations in which you want
     * to delay firing your events during some code.
     * You can wrap that code and be sure that the event will not
     * be fired during that wrap.
     *
     * ```
     * const emitter: Emitter;
     * const delayer = new EventDelayer();
     * const delayedEvent = delayer.wrapEvent(emitter.event);
     *
     * delayedEvent(console.log);
     *
     * delayer.bufferEvents(() => {
     *   emitter.fire(); // event will not be fired yet
     * });
     *
     * // event will only be fired at this point
     * ```
     */
    var EventBufferer = /** @class */ (function () {
        function EventBufferer() {
            this.buffers = [];
        }
        EventBufferer.prototype.wrapEvent = function (event) {
            var _this = this;
            return function (listener, thisArgs, disposables) {
                return event(function (i) {
                    var buffer = _this.buffers[_this.buffers.length - 1];
                    if (buffer) {
                        buffer.push(function () { return listener.call(thisArgs, i); });
                    }
                    else {
                        listener.call(thisArgs, i);
                    }
                }, void 0, disposables);
            };
        };
        EventBufferer.prototype.bufferEvents = function (fn) {
            var buffer = [];
            this.buffers.push(buffer);
            fn();
            this.buffers.pop();
            buffer.forEach(function (flush) { return flush(); });
        };
        return EventBufferer;
    }());
    exports.EventBufferer = EventBufferer;
    function mapEvent(event, map) {
        return function (listener, thisArgs, disposables) {
            if (thisArgs === void 0) { thisArgs = null; }
            return event(function (i) { return listener.call(thisArgs, map(i)); }, null, disposables);
        };
    }
    exports.mapEvent = mapEvent;
    function forEach(event, each) {
        return function (listener, thisArgs, disposables) {
            if (thisArgs === void 0) { thisArgs = null; }
            return event(function (i) { each(i); listener.call(thisArgs, i); }, null, disposables);
        };
    }
    exports.forEach = forEach;
    function filterEvent(event, filter) {
        return function (listener, thisArgs, disposables) {
            if (thisArgs === void 0) { thisArgs = null; }
            return event(function (e) { return filter(e) && listener.call(thisArgs, e); }, null, disposables);
        };
    }
    exports.filterEvent = filterEvent;
    var ChainableEvent = /** @class */ (function () {
        function ChainableEvent(_event) {
            this._event = _event;
        }
        Object.defineProperty(ChainableEvent.prototype, "event", {
            get: function () { return this._event; },
            enumerable: true,
            configurable: true
        });
        ChainableEvent.prototype.map = function (fn) {
            return new ChainableEvent(mapEvent(this._event, fn));
        };
        ChainableEvent.prototype.forEach = function (fn) {
            return new ChainableEvent(forEach(this._event, fn));
        };
        ChainableEvent.prototype.filter = function (fn) {
            return new ChainableEvent(filterEvent(this._event, fn));
        };
        ChainableEvent.prototype.latch = function () {
            return new ChainableEvent(latch(this._event));
        };
        ChainableEvent.prototype.on = function (listener, thisArgs, disposables) {
            return this._event(listener, thisArgs, disposables);
        };
        ChainableEvent.prototype.once = function (listener, thisArgs, disposables) {
            return once(this._event)(listener, thisArgs, disposables);
        };
        return ChainableEvent;
    }());
    function chain(event) {
        return new ChainableEvent(event);
    }
    exports.chain = chain;
    function stopwatch(event) {
        var start = new Date().getTime();
        return mapEvent(once(event), function (_) { return new Date().getTime() - start; });
    }
    exports.stopwatch = stopwatch;
    /**
     * Buffers the provided event until a first listener comes
     * along, at which point fire all the events at once and
     * pipe the event from then on.
     *
     * ```typescript
     * const emitter = new Emitter<number>();
     * const event = emitter.event;
     * const bufferedEvent = buffer(event);
     *
     * emitter.fire(1);
     * emitter.fire(2);
     * emitter.fire(3);
     * // nothing...
     *
     * const listener = bufferedEvent(num => console.log(num));
     * // 1, 2, 3
     *
     * emitter.fire(4);
     * // 4
     * ```
     */
    function buffer(event, nextTick, buffer) {
        if (nextTick === void 0) { nextTick = false; }
        if (buffer === void 0) { buffer = []; }
        buffer = buffer.slice();
        var listener = event(function (e) {
            if (buffer) {
                buffer.push(e);
            }
            else {
                emitter.fire(e);
            }
        });
        var flush = function () {
            buffer.forEach(function (e) { return emitter.fire(e); });
            buffer = null;
        };
        var emitter = new Emitter({
            onFirstListenerAdd: function () {
                if (!listener) {
                    listener = event(function (e) { return emitter.fire(e); });
                }
            },
            onFirstListenerDidAdd: function () {
                if (buffer) {
                    if (nextTick) {
                        setTimeout(flush);
                    }
                    else {
                        flush();
                    }
                }
            },
            onLastListenerRemove: function () {
                listener.dispose();
                listener = null;
            }
        });
        return emitter.event;
    }
    exports.buffer = buffer;
    /**
     * Similar to `buffer` but it buffers indefinitely and repeats
     * the buffered events to every new listener.
     */
    function echo(event, nextTick, buffer) {
        if (nextTick === void 0) { nextTick = false; }
        if (buffer === void 0) { buffer = []; }
        buffer = buffer.slice();
        event(function (e) {
            buffer.push(e);
            emitter.fire(e);
        });
        var flush = function (listener, thisArgs) { return buffer.forEach(function (e) { return listener.call(thisArgs, e); }); };
        var emitter = new Emitter({
            onListenerDidAdd: function (emitter, listener, thisArgs) {
                if (nextTick) {
                    setTimeout(function () { return flush(listener, thisArgs); });
                }
                else {
                    flush(listener, thisArgs);
                }
            }
        });
        return emitter.event;
    }
    exports.echo = echo;
    var Relay = /** @class */ (function () {
        function Relay() {
            this.emitter = new Emitter();
            this.event = this.emitter.event;
            this.disposable = lifecycle_1.Disposable.None;
        }
        Object.defineProperty(Relay.prototype, "input", {
            set: function (event) {
                this.disposable.dispose();
                this.disposable = event(this.emitter.fire, this.emitter);
            },
            enumerable: true,
            configurable: true
        });
        Relay.prototype.dispose = function () {
            this.disposable.dispose();
            this.emitter.dispose();
        };
        return Relay;
    }());
    exports.Relay = Relay;
    function fromNodeEventEmitter(emitter, eventName, map) {
        if (map === void 0) { map = function (id) { return id; }; }
        var fn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return result.fire(map.apply(void 0, args));
        };
        var onFirstListenerAdd = function () { return emitter.on(eventName, fn); };
        var onLastListenerRemove = function () { return emitter.removeListener(eventName, fn); };
        var result = new Emitter({ onFirstListenerAdd: onFirstListenerAdd, onLastListenerRemove: onLastListenerRemove });
        return result.event;
    }
    exports.fromNodeEventEmitter = fromNodeEventEmitter;
    function latch(event) {
        var firstCall = true;
        var cache;
        return filterEvent(event, function (value) {
            var shouldEmit = firstCall || value !== cache;
            firstCall = false;
            cache = value;
            return shouldEmit;
        });
    }
    exports.latch = latch;
});

define(__m[21/*vs/base/browser/browser*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/event*/]), function (require, exports, event_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WindowManager = /** @class */ (function () {
        function WindowManager() {
            // --- Zoom Level
            this._zoomLevel = 0;
            this._lastZoomLevelChangeTime = 0;
            this._onDidChangeZoomLevel = new event_1.Emitter();
            this.onDidChangeZoomLevel = this._onDidChangeZoomLevel.event;
            // --- Zoom Factor
            this._zoomFactor = 0;
            this._onDidChangeFullscreen = new event_1.Emitter();
            this.onDidChangeFullscreen = this._onDidChangeFullscreen.event;
            // --- Accessibility
            this._accessibilitySupport = 0 /* Unknown */;
            this._onDidChangeAccessibilitySupport = new event_1.Emitter();
            this.onDidChangeAccessibilitySupport = this._onDidChangeAccessibilitySupport.event;
        }
        WindowManager.prototype.getZoomLevel = function () {
            return this._zoomLevel;
        };
        WindowManager.prototype.getTimeSinceLastZoomLevelChanged = function () {
            return Date.now() - this._lastZoomLevelChangeTime;
        };
        WindowManager.prototype.setZoomLevel = function (zoomLevel, isTrusted) {
            if (this._zoomLevel === zoomLevel) {
                return;
            }
            this._zoomLevel = zoomLevel;
            // See https://github.com/Microsoft/vscode/issues/26151
            this._lastZoomLevelChangeTime = isTrusted ? 0 : Date.now();
            this._onDidChangeZoomLevel.fire(this._zoomLevel);
        };
        WindowManager.prototype.getZoomFactor = function () {
            return this._zoomFactor;
        };
        WindowManager.prototype.setZoomFactor = function (zoomFactor) {
            this._zoomFactor = zoomFactor;
        };
        // --- Pixel Ratio
        WindowManager.prototype.getPixelRatio = function () {
            var ctx = document.createElement('canvas').getContext('2d');
            var dpr = window.devicePixelRatio || 1;
            var bsr = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;
            return dpr / bsr;
        };
        WindowManager.prototype.setFullscreen = function (fullscreen) {
            if (this._fullscreen === fullscreen) {
                return;
            }
            this._fullscreen = fullscreen;
            this._onDidChangeFullscreen.fire();
        };
        WindowManager.prototype.isFullscreen = function () {
            return this._fullscreen;
        };
        WindowManager.prototype.setAccessibilitySupport = function (accessibilitySupport) {
            if (this._accessibilitySupport === accessibilitySupport) {
                return;
            }
            this._accessibilitySupport = accessibilitySupport;
            this._onDidChangeAccessibilitySupport.fire();
        };
        WindowManager.prototype.getAccessibilitySupport = function () {
            return this._accessibilitySupport;
        };
        WindowManager.INSTANCE = new WindowManager();
        return WindowManager;
    }());
    /** A zoom index, e.g. 1, 2, 3 */
    function setZoomLevel(zoomLevel, isTrusted) {
        WindowManager.INSTANCE.setZoomLevel(zoomLevel, isTrusted);
    }
    exports.setZoomLevel = setZoomLevel;
    function getZoomLevel() {
        return WindowManager.INSTANCE.getZoomLevel();
    }
    exports.getZoomLevel = getZoomLevel;
    /** Returns the time (in ms) since the zoom level was changed */
    function getTimeSinceLastZoomLevelChanged() {
        return WindowManager.INSTANCE.getTimeSinceLastZoomLevelChanged();
    }
    exports.getTimeSinceLastZoomLevelChanged = getTimeSinceLastZoomLevelChanged;
    function onDidChangeZoomLevel(callback) {
        return WindowManager.INSTANCE.onDidChangeZoomLevel(callback);
    }
    exports.onDidChangeZoomLevel = onDidChangeZoomLevel;
    /** The zoom scale for an index, e.g. 1, 1.2, 1.4 */
    function getZoomFactor() {
        return WindowManager.INSTANCE.getZoomFactor();
    }
    exports.getZoomFactor = getZoomFactor;
    function setZoomFactor(zoomFactor) {
        WindowManager.INSTANCE.setZoomFactor(zoomFactor);
    }
    exports.setZoomFactor = setZoomFactor;
    function getPixelRatio() {
        return WindowManager.INSTANCE.getPixelRatio();
    }
    exports.getPixelRatio = getPixelRatio;
    function setFullscreen(fullscreen) {
        WindowManager.INSTANCE.setFullscreen(fullscreen);
    }
    exports.setFullscreen = setFullscreen;
    function isFullscreen() {
        return WindowManager.INSTANCE.isFullscreen();
    }
    exports.isFullscreen = isFullscreen;
    function onDidChangeFullscreen(callback) {
        return WindowManager.INSTANCE.onDidChangeFullscreen(callback);
    }
    exports.onDidChangeFullscreen = onDidChangeFullscreen;
    function setAccessibilitySupport(accessibilitySupport) {
        WindowManager.INSTANCE.setAccessibilitySupport(accessibilitySupport);
    }
    exports.setAccessibilitySupport = setAccessibilitySupport;
    function getAccessibilitySupport() {
        return WindowManager.INSTANCE.getAccessibilitySupport();
    }
    exports.getAccessibilitySupport = getAccessibilitySupport;
    function onDidChangeAccessibilitySupport(callback) {
        return WindowManager.INSTANCE.onDidChangeAccessibilitySupport(callback);
    }
    exports.onDidChangeAccessibilitySupport = onDidChangeAccessibilitySupport;
    var userAgent = navigator.userAgent;
    exports.isIE = (userAgent.indexOf('Trident') >= 0);
    exports.isEdge = (userAgent.indexOf('Edge/') >= 0);
    exports.isEdgeOrIE = exports.isIE || exports.isEdge;
    exports.isOpera = (userAgent.indexOf('Opera') >= 0);
    exports.isFirefox = (userAgent.indexOf('Firefox') >= 0);
    exports.isWebKit = (userAgent.indexOf('AppleWebKit') >= 0);
    exports.isChrome = (userAgent.indexOf('Chrome') >= 0);
    exports.isSafari = (userAgent.indexOf('Chrome') === -1) && (userAgent.indexOf('Safari') >= 0);
    exports.isIPad = (userAgent.indexOf('iPad') >= 0);
    exports.isEdgeWebView = exports.isEdge && (userAgent.indexOf('WebView/') >= 0);
    function hasClipboardSupport() {
        if (exports.isIE) {
            return false;
        }
        if (exports.isEdge) {
            var index = userAgent.indexOf('Edge/');
            var version = parseInt(userAgent.substring(index + 5, userAgent.indexOf('.', index)), 10);
            if (!version || (version >= 12 && version <= 16)) {
                return false;
            }
        }
        return true;
    }
    exports.hasClipboardSupport = hasClipboardSupport;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[69/*vs/base/browser/event*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/event*/]), function (require, exports, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.domEvent = function (element, type, useCapture) {
        var fn = function (e) { return emitter.fire(e); };
        var emitter = new event_1.Emitter({
            onFirstListenerAdd: function () {
                element.addEventListener(type, fn, useCapture);
            },
            onLastListenerRemove: function () {
                element.removeEventListener(type, fn, useCapture);
            }
        });
        return emitter.event;
    };
    function stop(event) {
        return event_1.mapEvent(event, function (e) {
            e.preventDefault();
            e.stopPropagation();
            return e;
        });
    }
    exports.stop = stop;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[38/*vs/base/browser/keyboardEvent*/], __M([0/*require*/,1/*exports*/,43/*vs/base/common/keyCodes*/,4/*vs/base/common/platform*/,21/*vs/base/browser/browser*/]), function (require, exports, keyCodes_1, platform, browser) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var KEY_CODE_MAP = new Array(230);
    var INVERSE_KEY_CODE_MAP = new Array(112 /* MAX_VALUE */);
    (function () {
        for (var i = 0; i < INVERSE_KEY_CODE_MAP.length; i++) {
            INVERSE_KEY_CODE_MAP[i] = -1;
        }
        function define(code, keyCode) {
            KEY_CODE_MAP[code] = keyCode;
            INVERSE_KEY_CODE_MAP[keyCode] = code;
        }
        define(3, 7 /* PauseBreak */); // VK_CANCEL 0x03 Control-break processing
        define(8, 1 /* Backspace */);
        define(9, 2 /* Tab */);
        define(13, 3 /* Enter */);
        define(16, 4 /* Shift */);
        define(17, 5 /* Ctrl */);
        define(18, 6 /* Alt */);
        define(19, 7 /* PauseBreak */);
        define(20, 8 /* CapsLock */);
        define(27, 9 /* Escape */);
        define(32, 10 /* Space */);
        define(33, 11 /* PageUp */);
        define(34, 12 /* PageDown */);
        define(35, 13 /* End */);
        define(36, 14 /* Home */);
        define(37, 15 /* LeftArrow */);
        define(38, 16 /* UpArrow */);
        define(39, 17 /* RightArrow */);
        define(40, 18 /* DownArrow */);
        define(45, 19 /* Insert */);
        define(46, 20 /* Delete */);
        define(48, 21 /* KEY_0 */);
        define(49, 22 /* KEY_1 */);
        define(50, 23 /* KEY_2 */);
        define(51, 24 /* KEY_3 */);
        define(52, 25 /* KEY_4 */);
        define(53, 26 /* KEY_5 */);
        define(54, 27 /* KEY_6 */);
        define(55, 28 /* KEY_7 */);
        define(56, 29 /* KEY_8 */);
        define(57, 30 /* KEY_9 */);
        define(65, 31 /* KEY_A */);
        define(66, 32 /* KEY_B */);
        define(67, 33 /* KEY_C */);
        define(68, 34 /* KEY_D */);
        define(69, 35 /* KEY_E */);
        define(70, 36 /* KEY_F */);
        define(71, 37 /* KEY_G */);
        define(72, 38 /* KEY_H */);
        define(73, 39 /* KEY_I */);
        define(74, 40 /* KEY_J */);
        define(75, 41 /* KEY_K */);
        define(76, 42 /* KEY_L */);
        define(77, 43 /* KEY_M */);
        define(78, 44 /* KEY_N */);
        define(79, 45 /* KEY_O */);
        define(80, 46 /* KEY_P */);
        define(81, 47 /* KEY_Q */);
        define(82, 48 /* KEY_R */);
        define(83, 49 /* KEY_S */);
        define(84, 50 /* KEY_T */);
        define(85, 51 /* KEY_U */);
        define(86, 52 /* KEY_V */);
        define(87, 53 /* KEY_W */);
        define(88, 54 /* KEY_X */);
        define(89, 55 /* KEY_Y */);
        define(90, 56 /* KEY_Z */);
        define(93, 58 /* ContextMenu */);
        define(96, 93 /* NUMPAD_0 */);
        define(97, 94 /* NUMPAD_1 */);
        define(98, 95 /* NUMPAD_2 */);
        define(99, 96 /* NUMPAD_3 */);
        define(100, 97 /* NUMPAD_4 */);
        define(101, 98 /* NUMPAD_5 */);
        define(102, 99 /* NUMPAD_6 */);
        define(103, 100 /* NUMPAD_7 */);
        define(104, 101 /* NUMPAD_8 */);
        define(105, 102 /* NUMPAD_9 */);
        define(106, 103 /* NUMPAD_MULTIPLY */);
        define(107, 104 /* NUMPAD_ADD */);
        define(108, 105 /* NUMPAD_SEPARATOR */);
        define(109, 106 /* NUMPAD_SUBTRACT */);
        define(110, 107 /* NUMPAD_DECIMAL */);
        define(111, 108 /* NUMPAD_DIVIDE */);
        define(112, 59 /* F1 */);
        define(113, 60 /* F2 */);
        define(114, 61 /* F3 */);
        define(115, 62 /* F4 */);
        define(116, 63 /* F5 */);
        define(117, 64 /* F6 */);
        define(118, 65 /* F7 */);
        define(119, 66 /* F8 */);
        define(120, 67 /* F9 */);
        define(121, 68 /* F10 */);
        define(122, 69 /* F11 */);
        define(123, 70 /* F12 */);
        define(124, 71 /* F13 */);
        define(125, 72 /* F14 */);
        define(126, 73 /* F15 */);
        define(127, 74 /* F16 */);
        define(128, 75 /* F17 */);
        define(129, 76 /* F18 */);
        define(130, 77 /* F19 */);
        define(144, 78 /* NumLock */);
        define(145, 79 /* ScrollLock */);
        define(186, 80 /* US_SEMICOLON */);
        define(187, 81 /* US_EQUAL */);
        define(188, 82 /* US_COMMA */);
        define(189, 83 /* US_MINUS */);
        define(190, 84 /* US_DOT */);
        define(191, 85 /* US_SLASH */);
        define(192, 86 /* US_BACKTICK */);
        define(193, 110 /* ABNT_C1 */);
        define(194, 111 /* ABNT_C2 */);
        define(219, 87 /* US_OPEN_SQUARE_BRACKET */);
        define(220, 88 /* US_BACKSLASH */);
        define(221, 89 /* US_CLOSE_SQUARE_BRACKET */);
        define(222, 90 /* US_QUOTE */);
        define(223, 91 /* OEM_8 */);
        define(226, 92 /* OEM_102 */);
        /**
         * https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
         * If an Input Method Editor is processing key input and the event is keydown, return 229.
         */
        define(229, 109 /* KEY_IN_COMPOSITION */);
        if (browser.isIE) {
            define(91, 57 /* Meta */);
        }
        else if (browser.isFirefox) {
            define(59, 80 /* US_SEMICOLON */);
            define(107, 81 /* US_EQUAL */);
            define(109, 83 /* US_MINUS */);
            if (platform.isMacintosh) {
                define(224, 57 /* Meta */);
            }
        }
        else if (browser.isWebKit) {
            define(91, 57 /* Meta */);
            if (platform.isMacintosh) {
                // the two meta keys in the Mac have different key codes (91 and 93)
                define(93, 57 /* Meta */);
            }
            else {
                define(92, 57 /* Meta */);
            }
        }
    })();
    function extractKeyCode(e) {
        if (e.charCode) {
            // "keypress" events mostly
            var char = String.fromCharCode(e.charCode).toUpperCase();
            return keyCodes_1.KeyCodeUtils.fromString(char);
        }
        return KEY_CODE_MAP[e.keyCode] || 0 /* Unknown */;
    }
    function getCodeForKeyCode(keyCode) {
        return INVERSE_KEY_CODE_MAP[keyCode];
    }
    exports.getCodeForKeyCode = getCodeForKeyCode;
    var ctrlKeyMod = (platform.isMacintosh ? 256 /* WinCtrl */ : 2048 /* CtrlCmd */);
    var altKeyMod = 512 /* Alt */;
    var shiftKeyMod = 1024 /* Shift */;
    var metaKeyMod = (platform.isMacintosh ? 2048 /* CtrlCmd */ : 256 /* WinCtrl */);
    var StandardKeyboardEvent = /** @class */ (function () {
        function StandardKeyboardEvent(source) {
            var e = source;
            this.browserEvent = e;
            this.target = e.target;
            this.ctrlKey = e.ctrlKey;
            this.shiftKey = e.shiftKey;
            this.altKey = e.altKey;
            this.metaKey = e.metaKey;
            this.keyCode = extractKeyCode(e);
            this.code = e.code;
            // console.info(e.type + ": keyCode: " + e.keyCode + ", which: " + e.which + ", charCode: " + e.charCode + ", detail: " + e.detail + " ====> " + this.keyCode + ' -- ' + KeyCode[this.keyCode]);
            this.ctrlKey = this.ctrlKey || this.keyCode === 5 /* Ctrl */;
            this.altKey = this.altKey || this.keyCode === 6 /* Alt */;
            this.shiftKey = this.shiftKey || this.keyCode === 4 /* Shift */;
            this.metaKey = this.metaKey || this.keyCode === 57 /* Meta */;
            this._asKeybinding = this._computeKeybinding();
            this._asRuntimeKeybinding = this._computeRuntimeKeybinding();
            // console.log(`code: ${e.code}, keyCode: ${e.keyCode}, key: ${e.key}`);
        }
        StandardKeyboardEvent.prototype.preventDefault = function () {
            if (this.browserEvent && this.browserEvent.preventDefault) {
                this.browserEvent.preventDefault();
            }
        };
        StandardKeyboardEvent.prototype.stopPropagation = function () {
            if (this.browserEvent && this.browserEvent.stopPropagation) {
                this.browserEvent.stopPropagation();
            }
        };
        StandardKeyboardEvent.prototype.toKeybinding = function () {
            return this._asRuntimeKeybinding;
        };
        StandardKeyboardEvent.prototype.equals = function (other) {
            return this._asKeybinding === other;
        };
        StandardKeyboardEvent.prototype._computeKeybinding = function () {
            var key = 0 /* Unknown */;
            if (this.keyCode !== 5 /* Ctrl */ && this.keyCode !== 4 /* Shift */ && this.keyCode !== 6 /* Alt */ && this.keyCode !== 57 /* Meta */) {
                key = this.keyCode;
            }
            var result = 0;
            if (this.ctrlKey) {
                result |= ctrlKeyMod;
            }
            if (this.altKey) {
                result |= altKeyMod;
            }
            if (this.shiftKey) {
                result |= shiftKeyMod;
            }
            if (this.metaKey) {
                result |= metaKeyMod;
            }
            result |= key;
            return result;
        };
        StandardKeyboardEvent.prototype._computeRuntimeKeybinding = function () {
            var key = 0 /* Unknown */;
            if (this.keyCode !== 5 /* Ctrl */ && this.keyCode !== 4 /* Shift */ && this.keyCode !== 6 /* Alt */ && this.keyCode !== 57 /* Meta */) {
                key = this.keyCode;
            }
            return new keyCodes_1.SimpleKeybinding(this.ctrlKey, this.shiftKey, this.altKey, this.metaKey, key);
        };
        return StandardKeyboardEvent;
    }());
    exports.StandardKeyboardEvent = StandardKeyboardEvent;
});











define(__m[76/*vs/base/browser/mouseEvent*/], __M([0/*require*/,1/*exports*/,4/*vs/base/common/platform*/,21/*vs/base/browser/browser*/,51/*vs/base/browser/iframe*/]), function (require, exports, platform, browser, iframe_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var StandardMouseEvent = /** @class */ (function () {
        function StandardMouseEvent(e) {
            this.timestamp = Date.now();
            this.browserEvent = e;
            this.leftButton = e.button === 0;
            this.middleButton = e.button === 1;
            this.rightButton = e.button === 2;
            this.target = e.target;
            this.detail = e.detail || 1;
            if (e.type === 'dblclick') {
                this.detail = 2;
            }
            this.ctrlKey = e.ctrlKey;
            this.shiftKey = e.shiftKey;
            this.altKey = e.altKey;
            this.metaKey = e.metaKey;
            if (typeof e.pageX === 'number') {
                this.posx = e.pageX;
                this.posy = e.pageY;
            }
            else {
                // Probably hit by MSGestureEvent
                this.posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                this.posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            // Find the position of the iframe this code is executing in relative to the iframe where the event was captured.
            var iframeOffsets = iframe_1.IframeUtils.getPositionOfChildWindowRelativeToAncestorWindow(self, e.view);
            this.posx -= iframeOffsets.left;
            this.posy -= iframeOffsets.top;
        }
        StandardMouseEvent.prototype.preventDefault = function () {
            if (this.browserEvent.preventDefault) {
                this.browserEvent.preventDefault();
            }
        };
        StandardMouseEvent.prototype.stopPropagation = function () {
            if (this.browserEvent.stopPropagation) {
                this.browserEvent.stopPropagation();
            }
        };
        return StandardMouseEvent;
    }());
    exports.StandardMouseEvent = StandardMouseEvent;
    var DragMouseEvent = /** @class */ (function (_super) {
        __extends(DragMouseEvent, _super);
        function DragMouseEvent(e) {
            var _this = _super.call(this, e) || this;
            _this.dataTransfer = e.dataTransfer;
            return _this;
        }
        return DragMouseEvent;
    }(StandardMouseEvent));
    exports.DragMouseEvent = DragMouseEvent;
    var StandardMouseWheelEvent = /** @class */ (function () {
        function StandardMouseWheelEvent(e, deltaX, deltaY) {
            if (deltaX === void 0) { deltaX = 0; }
            if (deltaY === void 0) { deltaY = 0; }
            this.browserEvent = e || null;
            this.target = e ? (e.target || e.targetNode || e.srcElement) : null;
            this.deltaY = deltaY;
            this.deltaX = deltaX;
            if (e) {
                var e1 = e;
                var e2 = e;
                // vertical delta scroll
                if (typeof e1.wheelDeltaY !== 'undefined') {
                    this.deltaY = e1.wheelDeltaY / 120;
                }
                else if (typeof e2.VERTICAL_AXIS !== 'undefined' && e2.axis === e2.VERTICAL_AXIS) {
                    this.deltaY = -e2.detail / 3;
                }
                // horizontal delta scroll
                if (typeof e1.wheelDeltaX !== 'undefined') {
                    if (browser.isSafari && platform.isWindows) {
                        this.deltaX = -(e1.wheelDeltaX / 120);
                    }
                    else {
                        this.deltaX = e1.wheelDeltaX / 120;
                    }
                }
                else if (typeof e2.HORIZONTAL_AXIS !== 'undefined' && e2.axis === e2.HORIZONTAL_AXIS) {
                    this.deltaX = -e.detail / 3;
                }
                // Assume a vertical scroll if nothing else worked
                if (this.deltaY === 0 && this.deltaX === 0 && e.wheelDelta) {
                    this.deltaY = e.wheelDelta / 120;
                }
            }
        }
        StandardMouseWheelEvent.prototype.preventDefault = function () {
            if (this.browserEvent) {
                if (this.browserEvent.preventDefault) {
                    this.browserEvent.preventDefault();
                }
            }
        };
        StandardMouseWheelEvent.prototype.stopPropagation = function () {
            if (this.browserEvent) {
                if (this.browserEvent.stopPropagation) {
                    this.browserEvent.stopPropagation();
                }
            }
        };
        return StandardMouseWheelEvent;
    }());
    exports.StandardMouseWheelEvent = StandardMouseWheelEvent;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[78/*vs/base/common/cancellation*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/event*/]), function (require, exports, event_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var shortcutEvent = Object.freeze(function (callback, context) {
        var handle = setTimeout(callback.bind(context), 0);
        return { dispose: function () { clearTimeout(handle); } };
    });
    var CancellationToken;
    (function (CancellationToken) {
        CancellationToken.None = Object.freeze({
            isCancellationRequested: false,
            onCancellationRequested: event_1.Event.None
        });
        CancellationToken.Cancelled = Object.freeze({
            isCancellationRequested: true,
            onCancellationRequested: shortcutEvent
        });
    })(CancellationToken = exports.CancellationToken || (exports.CancellationToken = {}));
    var MutableToken = /** @class */ (function () {
        function MutableToken() {
            this._isCancelled = false;
        }
        MutableToken.prototype.cancel = function () {
            if (!this._isCancelled) {
                this._isCancelled = true;
                if (this._emitter) {
                    this._emitter.fire(undefined);
                    this.dispose();
                }
            }
        };
        Object.defineProperty(MutableToken.prototype, "isCancellationRequested", {
            get: function () {
                return this._isCancelled;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MutableToken.prototype, "onCancellationRequested", {
            get: function () {
                if (this._isCancelled) {
                    return shortcutEvent;
                }
                if (!this._emitter) {
                    this._emitter = new event_1.Emitter();
                }
                return this._emitter.event;
            },
            enumerable: true,
            configurable: true
        });
        MutableToken.prototype.dispose = function () {
            if (this._emitter) {
                this._emitter.dispose();
                this._emitter = undefined;
            }
        };
        return MutableToken;
    }());
    var CancellationTokenSource = /** @class */ (function () {
        function CancellationTokenSource() {
        }
        Object.defineProperty(CancellationTokenSource.prototype, "token", {
            get: function () {
                if (!this._token) {
                    // be lazy and create the token only when
                    // actually needed
                    this._token = new MutableToken();
                }
                return this._token;
            },
            enumerable: true,
            configurable: true
        });
        CancellationTokenSource.prototype.cancel = function () {
            if (!this._token) {
                // save an object by returning the default
                // cancelled token when cancellation happens
                // before someone asks for the token
                this._token = CancellationToken.Cancelled;
            }
            else if (this._token instanceof MutableToken) {
                // actually cancel
                this._token.cancel();
            }
        };
        CancellationTokenSource.prototype.dispose = function () {
            if (!this._token) {
                // ensure to initialize with an empty token if we had none
                this._token = CancellationToken.None;
            }
            else if (this._token instanceof MutableToken) {
                // actually dispose
                this._token.dispose();
            }
        };
        return CancellationTokenSource;
    }());
    exports.CancellationTokenSource = CancellationTokenSource;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/










define(__m[12/*vs/base/common/async*/], __M([0/*require*/,1/*exports*/,19/*vs/base/common/errors*/,3/*vs/base/common/winjs.base*/,78/*vs/base/common/cancellation*/,6/*vs/base/common/lifecycle*/,2/*vs/base/common/event*/]), function (require, exports, errors, winjs_base_1, cancellation_1, lifecycle_1, event_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function isThenable(obj) {
        return obj && typeof obj.then === 'function';
    }
    exports.isThenable = isThenable;
    function toThenable(arg) {
        if (isThenable(arg)) {
            return arg;
        }
        else {
            return winjs_base_1.TPromise.as(arg);
        }
    }
    exports.toThenable = toThenable;
    function toWinJsPromise(arg) {
        if (arg instanceof winjs_base_1.TPromise) {
            return arg;
        }
        return new winjs_base_1.TPromise(function (resolve, reject) { return arg.then(resolve, reject); });
    }
    exports.toWinJsPromise = toWinJsPromise;
    function createCancelablePromise(callback) {
        var source = new cancellation_1.CancellationTokenSource();
        var thenable = callback(source.token);
        var promise = new Promise(function (resolve, reject) {
            source.token.onCancellationRequested(function () {
                reject(errors.canceled());
            });
            Promise.resolve(thenable).then(function (value) {
                source.dispose();
                resolve(value);
            }, function (err) {
                source.dispose();
                reject(err);
            });
        });
        return new /** @class */ (function () {
            function class_1() {
            }
            class_1.prototype.cancel = function () {
                source.cancel();
            };
            class_1.prototype.then = function (resolve, reject) {
                return promise.then(resolve, reject);
            };
            class_1.prototype.catch = function (reject) {
                return this.then(undefined, reject);
            };
            return class_1;
        }());
    }
    exports.createCancelablePromise = createCancelablePromise;
    function asWinJsPromise(callback) {
        var source = new cancellation_1.CancellationTokenSource();
        return new winjs_base_1.TPromise(function (resolve, reject, progress) {
            var item = callback(source.token);
            if (item instanceof winjs_base_1.TPromise) {
                item.then(function (result) {
                    source.dispose();
                    resolve(result);
                }, function (err) {
                    source.dispose();
                    reject(err);
                }, progress);
            }
            else if (isThenable(item)) {
                item.then(function (result) {
                    source.dispose();
                    resolve(result);
                }, function (err) {
                    source.dispose();
                    reject(err);
                });
            }
            else {
                source.dispose();
                resolve(item);
            }
        }, function () {
            source.cancel();
        });
    }
    exports.asWinJsPromise = asWinJsPromise;
    /**
     * Hook a cancellation token to a WinJS Promise
     */
    function wireCancellationToken(token, promise, resolveAsUndefinedWhenCancelled) {
        var subscription = token.onCancellationRequested(function () { return promise.cancel(); });
        if (resolveAsUndefinedWhenCancelled) {
            promise = promise.then(undefined, function (err) {
                if (!errors.isPromiseCanceledError(err)) {
                    return winjs_base_1.TPromise.wrapError(err);
                }
                return undefined;
            });
        }
        return always(promise, function () { return subscription.dispose(); });
    }
    exports.wireCancellationToken = wireCancellationToken;
    function asDisposablePromise(input, cancelValue, bucket) {
        var dispose;
        var promise = new winjs_base_1.TPromise(function (resolve, reject) {
            dispose = function () {
                resolve(cancelValue);
                if (isWinJSPromise(input)) {
                    input.cancel();
                }
            };
            input.then(resolve, function (err) {
                if (errors.isPromiseCanceledError(err)) {
                    resolve(cancelValue);
                }
                else {
                    reject(err);
                }
            });
        });
        var res = {
            promise: promise,
            dispose: dispose
        };
        if (Array.isArray(bucket)) {
            bucket.push(res);
        }
        return res;
    }
    exports.asDisposablePromise = asDisposablePromise;
    /**
     * A helper to prevent accumulation of sequential async tasks.
     *
     * Imagine a mail man with the sole task of delivering letters. As soon as
     * a letter submitted for delivery, he drives to the destination, delivers it
     * and returns to his base. Imagine that during the trip, N more letters were submitted.
     * When the mail man returns, he picks those N letters and delivers them all in a
     * single trip. Even though N+1 submissions occurred, only 2 deliveries were made.
     *
     * The throttler implements this via the queue() method, by providing it a task
     * factory. Following the example:
     *
     * 		const throttler = new Throttler();
     * 		const letters = [];
     *
     * 		function deliver() {
     * 			const lettersToDeliver = letters;
     * 			letters = [];
     * 			return makeTheTrip(lettersToDeliver);
     * 		}
     *
     * 		function onLetterReceived(l) {
     * 			letters.push(l);
     * 			throttler.queue(deliver);
     * 		}
     */
    var Throttler = /** @class */ (function () {
        function Throttler() {
            this.activePromise = null;
            this.queuedPromise = null;
            this.queuedPromiseFactory = null;
        }
        Throttler.prototype.queue = function (promiseFactory) {
            var _this = this;
            if (this.activePromise) {
                this.queuedPromiseFactory = promiseFactory;
                if (!this.queuedPromise) {
                    var onComplete_1 = function () {
                        _this.queuedPromise = null;
                        var result = _this.queue(_this.queuedPromiseFactory);
                        _this.queuedPromiseFactory = null;
                        return result;
                    };
                    this.queuedPromise = new winjs_base_1.TPromise(function (c, e, p) {
                        _this.activePromise.then(onComplete_1, onComplete_1, p).done(c);
                    }, function () {
                        _this.activePromise.cancel();
                    });
                }
                return new winjs_base_1.TPromise(function (c, e, p) {
                    _this.queuedPromise.then(c, e, p);
                }, function () {
                    // no-op
                });
            }
            this.activePromise = promiseFactory();
            return new winjs_base_1.TPromise(function (c, e, p) {
                _this.activePromise.done(function (result) {
                    _this.activePromise = null;
                    c(result);
                }, function (err) {
                    _this.activePromise = null;
                    e(err);
                }, p);
            }, function () {
                _this.activePromise.cancel();
            });
        };
        return Throttler;
    }());
    exports.Throttler = Throttler;
    // TODO@Joao: can the previous throttler be replaced with this?
    var SimpleThrottler = /** @class */ (function () {
        function SimpleThrottler() {
            this.current = winjs_base_1.TPromise.wrap(null);
        }
        SimpleThrottler.prototype.queue = function (promiseTask) {
            return this.current = this.current.then(function () { return promiseTask(); });
        };
        return SimpleThrottler;
    }());
    exports.SimpleThrottler = SimpleThrottler;
    /**
     * A helper to delay execution of a task that is being requested often.
     *
     * Following the throttler, now imagine the mail man wants to optimize the number of
     * trips proactively. The trip itself can be long, so he decides not to make the trip
     * as soon as a letter is submitted. Instead he waits a while, in case more
     * letters are submitted. After said waiting period, if no letters were submitted, he
     * decides to make the trip. Imagine that N more letters were submitted after the first
     * one, all within a short period of time between each other. Even though N+1
     * submissions occurred, only 1 delivery was made.
     *
     * The delayer offers this behavior via the trigger() method, into which both the task
     * to be executed and the waiting period (delay) must be passed in as arguments. Following
     * the example:
     *
     * 		const delayer = new Delayer(WAITING_PERIOD);
     * 		const letters = [];
     *
     * 		function letterReceived(l) {
     * 			letters.push(l);
     * 			delayer.trigger(() => { return makeTheTrip(); });
     * 		}
     */
    var Delayer = /** @class */ (function () {
        function Delayer(defaultDelay) {
            this.defaultDelay = defaultDelay;
            this.timeout = null;
            this.completionPromise = null;
            this.onSuccess = null;
            this.task = null;
        }
        Delayer.prototype.trigger = function (task, delay) {
            var _this = this;
            if (delay === void 0) { delay = this.defaultDelay; }
            this.task = task;
            this.cancelTimeout();
            if (!this.completionPromise) {
                this.completionPromise = new winjs_base_1.TPromise(function (c) {
                    _this.onSuccess = c;
                }, function () {
                    // no-op
                }).then(function () {
                    _this.completionPromise = null;
                    _this.onSuccess = null;
                    var task = _this.task;
                    _this.task = null;
                    return task();
                });
            }
            this.timeout = setTimeout(function () {
                _this.timeout = null;
                _this.onSuccess(null);
            }, delay);
            return this.completionPromise;
        };
        Delayer.prototype.isTriggered = function () {
            return this.timeout !== null;
        };
        Delayer.prototype.cancel = function () {
            this.cancelTimeout();
            if (this.completionPromise) {
                this.completionPromise.cancel();
                this.completionPromise = null;
            }
        };
        Delayer.prototype.cancelTimeout = function () {
            if (this.timeout !== null) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
        };
        return Delayer;
    }());
    exports.Delayer = Delayer;
    /**
     * A helper to delay execution of a task that is being requested often, while
     * preventing accumulation of consecutive executions, while the task runs.
     *
     * Simply combine the two mail men's strategies from the Throttler and Delayer
     * helpers, for an analogy.
     */
    var ThrottledDelayer = /** @class */ (function (_super) {
        __extends(ThrottledDelayer, _super);
        function ThrottledDelayer(defaultDelay) {
            var _this = _super.call(this, defaultDelay) || this;
            _this.throttler = new Throttler();
            return _this;
        }
        ThrottledDelayer.prototype.trigger = function (promiseFactory, delay) {
            var _this = this;
            return _super.prototype.trigger.call(this, function () { return _this.throttler.queue(promiseFactory); }, delay);
        };
        return ThrottledDelayer;
    }(Delayer));
    exports.ThrottledDelayer = ThrottledDelayer;
    /**
     * A barrier that is initially closed and then becomes opened permanently.
     */
    var Barrier = /** @class */ (function () {
        function Barrier() {
            var _this = this;
            this._isOpen = false;
            this._promise = new winjs_base_1.TPromise(function (c, e) {
                _this._completePromise = c;
            }, function () {
                console.warn('You should really not try to cancel this ready promise!');
            });
        }
        Barrier.prototype.isOpen = function () {
            return this._isOpen;
        };
        Barrier.prototype.open = function () {
            this._isOpen = true;
            this._completePromise(true);
        };
        Barrier.prototype.wait = function () {
            return this._promise;
        };
        return Barrier;
    }());
    exports.Barrier = Barrier;
    var ShallowCancelThenPromise = /** @class */ (function (_super) {
        __extends(ShallowCancelThenPromise, _super);
        function ShallowCancelThenPromise(outer) {
            var _this = this;
            var completeCallback, errorCallback, progressCallback;
            _this = _super.call(this, function (c, e, p) {
                completeCallback = c;
                errorCallback = e;
                progressCallback = p;
            }, function () {
                // cancel this promise but not the
                // outer promise
                errorCallback(errors.canceled());
            }) || this;
            outer.then(completeCallback, errorCallback, progressCallback);
            return _this;
        }
        return ShallowCancelThenPromise;
    }(winjs_base_1.TPromise));
    exports.ShallowCancelThenPromise = ShallowCancelThenPromise;
    /**
     * Replacement for `WinJS.TPromise.timeout`.
     */
    function timeout(n) {
        return createCancelablePromise(function (token) {
            return new Promise(function (resolve, reject) {
                var handle = setTimeout(resolve, n);
                token.onCancellationRequested(function (_) {
                    clearTimeout(handle);
                    reject(errors.canceled());
                });
            });
        });
    }
    exports.timeout = timeout;
    function isWinJSPromise(candidate) {
        return winjs_base_1.TPromise.is(candidate) && typeof candidate.done === 'function';
    }
    function always(winjsPromiseOrThenable, f) {
        if (isWinJSPromise(winjsPromiseOrThenable)) {
            return new winjs_base_1.TPromise(function (c, e, p) {
                winjsPromiseOrThenable.done(function (result) {
                    try {
                        f(result);
                    }
                    catch (e1) {
                        errors.onUnexpectedError(e1);
                    }
                    c(result);
                }, function (err) {
                    try {
                        f(err);
                    }
                    catch (e1) {
                        errors.onUnexpectedError(e1);
                    }
                    e(err);
                }, function (progress) {
                    p(progress);
                });
            }, function () {
                winjsPromiseOrThenable.cancel();
            });
        }
        else {
            // simple
            winjsPromiseOrThenable.then(function (_) { return f(); }, function (_) { return f(); });
            return winjsPromiseOrThenable;
        }
    }
    exports.always = always;
    /**
     * Runs the provided list of promise factories in sequential order. The returned
     * promise will complete to an array of results from each promise.
     */
    function sequence(promiseFactories) {
        var results = [];
        var index = 0;
        var len = promiseFactories.length;
        function next() {
            return index < len ? promiseFactories[index++]() : null;
        }
        function thenHandler(result) {
            if (result !== undefined && result !== null) {
                results.push(result);
            }
            var n = next();
            if (n) {
                return n.then(thenHandler);
            }
            return winjs_base_1.TPromise.as(results);
        }
        return winjs_base_1.TPromise.as(null).then(thenHandler);
    }
    exports.sequence = sequence;
    function first2(promiseFactories, shouldStop, defaultValue) {
        if (shouldStop === void 0) { shouldStop = function (t) { return !!t; }; }
        if (defaultValue === void 0) { defaultValue = null; }
        var index = 0;
        var len = promiseFactories.length;
        var loop = function () {
            if (index >= len) {
                return Promise.resolve(defaultValue);
            }
            var factory = promiseFactories[index++];
            var promise = factory();
            return promise.then(function (result) {
                if (shouldStop(result)) {
                    return Promise.resolve(result);
                }
                return loop();
            });
        };
        return loop();
    }
    exports.first2 = first2;
    function first(promiseFactories, shouldStop, defaultValue) {
        if (shouldStop === void 0) { shouldStop = function (t) { return !!t; }; }
        if (defaultValue === void 0) { defaultValue = null; }
        var index = 0;
        var len = promiseFactories.length;
        var loop = function () {
            if (index >= len) {
                return winjs_base_1.TPromise.as(defaultValue);
            }
            var factory = promiseFactories[index++];
            var promise = factory();
            return promise.then(function (result) {
                if (shouldStop(result)) {
                    return winjs_base_1.TPromise.as(result);
                }
                return loop();
            });
        };
        return loop();
    }
    exports.first = first;
    /**
     * A helper to queue N promises and run them all with a max degree of parallelism. The helper
     * ensures that at any time no more than M promises are running at the same time.
     */
    var Limiter = /** @class */ (function () {
        function Limiter(maxDegreeOfParalellism) {
            this.maxDegreeOfParalellism = maxDegreeOfParalellism;
            this.outstandingPromises = [];
            this.runningPromises = 0;
            this._onFinished = new event_1.Emitter();
        }
        Object.defineProperty(Limiter.prototype, "onFinished", {
            get: function () {
                return this._onFinished.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Limiter.prototype, "size", {
            get: function () {
                return this.runningPromises + this.outstandingPromises.length;
            },
            enumerable: true,
            configurable: true
        });
        Limiter.prototype.queue = function (promiseFactory) {
            var _this = this;
            return new winjs_base_1.TPromise(function (c, e, p) {
                _this.outstandingPromises.push({
                    factory: promiseFactory,
                    c: c,
                    e: e,
                    p: p
                });
                _this.consume();
            });
        };
        Limiter.prototype.consume = function () {
            var _this = this;
            while (this.outstandingPromises.length && this.runningPromises < this.maxDegreeOfParalellism) {
                var iLimitedTask = this.outstandingPromises.shift();
                this.runningPromises++;
                var promise = iLimitedTask.factory();
                promise.done(iLimitedTask.c, iLimitedTask.e, iLimitedTask.p);
                promise.done(function () { return _this.consumed(); }, function () { return _this.consumed(); });
            }
        };
        Limiter.prototype.consumed = function () {
            this.runningPromises--;
            if (this.outstandingPromises.length > 0) {
                this.consume();
            }
            else {
                this._onFinished.fire();
            }
        };
        Limiter.prototype.dispose = function () {
            this._onFinished.dispose();
        };
        return Limiter;
    }());
    exports.Limiter = Limiter;
    /**
     * A queue is handles one promise at a time and guarantees that at any time only one promise is executing.
     */
    var Queue = /** @class */ (function (_super) {
        __extends(Queue, _super);
        function Queue() {
            return _super.call(this, 1) || this;
        }
        return Queue;
    }(Limiter));
    exports.Queue = Queue;
    /**
     * A helper to organize queues per resource. The ResourceQueue makes sure to manage queues per resource
     * by disposing them once the queue is empty.
     */
    var ResourceQueue = /** @class */ (function () {
        function ResourceQueue() {
            this.queues = Object.create(null);
        }
        ResourceQueue.prototype.queueFor = function (resource) {
            var _this = this;
            var key = resource.toString();
            if (!this.queues[key]) {
                var queue_1 = new Queue();
                queue_1.onFinished(function () {
                    queue_1.dispose();
                    delete _this.queues[key];
                });
                this.queues[key] = queue_1;
            }
            return this.queues[key];
        };
        return ResourceQueue;
    }());
    exports.ResourceQueue = ResourceQueue;
    function setDisposableTimeout(handler, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var handle = setTimeout.apply(void 0, [handler, timeout].concat(args));
        return { dispose: function () { clearTimeout(handle); } };
    }
    exports.setDisposableTimeout = setDisposableTimeout;
    var TimeoutTimer = /** @class */ (function (_super) {
        __extends(TimeoutTimer, _super);
        function TimeoutTimer() {
            var _this = _super.call(this) || this;
            _this._token = -1;
            return _this;
        }
        TimeoutTimer.prototype.dispose = function () {
            this.cancel();
            _super.prototype.dispose.call(this);
        };
        TimeoutTimer.prototype.cancel = function () {
            if (this._token !== -1) {
                clearTimeout(this._token);
                this._token = -1;
            }
        };
        TimeoutTimer.prototype.cancelAndSet = function (runner, timeout) {
            var _this = this;
            this.cancel();
            this._token = setTimeout(function () {
                _this._token = -1;
                runner();
            }, timeout);
        };
        TimeoutTimer.prototype.setIfNotSet = function (runner, timeout) {
            var _this = this;
            if (this._token !== -1) {
                // timer is already set
                return;
            }
            this._token = setTimeout(function () {
                _this._token = -1;
                runner();
            }, timeout);
        };
        return TimeoutTimer;
    }(lifecycle_1.Disposable));
    exports.TimeoutTimer = TimeoutTimer;
    var IntervalTimer = /** @class */ (function (_super) {
        __extends(IntervalTimer, _super);
        function IntervalTimer() {
            var _this = _super.call(this) || this;
            _this._token = -1;
            return _this;
        }
        IntervalTimer.prototype.dispose = function () {
            this.cancel();
            _super.prototype.dispose.call(this);
        };
        IntervalTimer.prototype.cancel = function () {
            if (this._token !== -1) {
                clearInterval(this._token);
                this._token = -1;
            }
        };
        IntervalTimer.prototype.cancelAndSet = function (runner, interval) {
            this.cancel();
            this._token = setInterval(function () {
                runner();
            }, interval);
        };
        return IntervalTimer;
    }(lifecycle_1.Disposable));
    exports.IntervalTimer = IntervalTimer;
    var RunOnceScheduler = /** @class */ (function () {
        function RunOnceScheduler(runner, timeout) {
            this.timeoutToken = -1;
            this.runner = runner;
            this.timeout = timeout;
            this.timeoutHandler = this.onTimeout.bind(this);
        }
        /**
         * Dispose RunOnceScheduler
         */
        RunOnceScheduler.prototype.dispose = function () {
            this.cancel();
            this.runner = null;
        };
        /**
         * Cancel current scheduled runner (if any).
         */
        RunOnceScheduler.prototype.cancel = function () {
            if (this.isScheduled()) {
                clearTimeout(this.timeoutToken);
                this.timeoutToken = -1;
            }
        };
        /**
         * Cancel previous runner (if any) & schedule a new runner.
         */
        RunOnceScheduler.prototype.schedule = function (delay) {
            if (delay === void 0) { delay = this.timeout; }
            this.cancel();
            this.timeoutToken = setTimeout(this.timeoutHandler, delay);
        };
        /**
         * Returns true if scheduled.
         */
        RunOnceScheduler.prototype.isScheduled = function () {
            return this.timeoutToken !== -1;
        };
        RunOnceScheduler.prototype.onTimeout = function () {
            this.timeoutToken = -1;
            if (this.runner) {
                this.doRun();
            }
        };
        RunOnceScheduler.prototype.doRun = function () {
            this.runner();
        };
        return RunOnceScheduler;
    }());
    exports.RunOnceScheduler = RunOnceScheduler;
    var RunOnceWorker = /** @class */ (function (_super) {
        __extends(RunOnceWorker, _super);
        function RunOnceWorker(runner, timeout) {
            var _this = _super.call(this, runner, timeout) || this;
            _this.units = [];
            return _this;
        }
        RunOnceWorker.prototype.work = function (unit) {
            this.units.push(unit);
            if (!this.isScheduled()) {
                this.schedule();
            }
        };
        RunOnceWorker.prototype.doRun = function () {
            var units = this.units;
            this.units = [];
            this.runner(units);
        };
        RunOnceWorker.prototype.dispose = function () {
            this.units = [];
            _super.prototype.dispose.call(this);
        };
        return RunOnceWorker;
    }(RunOnceScheduler));
    exports.RunOnceWorker = RunOnceWorker;
    function nfcall(fn) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new winjs_base_1.TPromise(function (c, e) { return fn.apply(void 0, args.concat([function (err, result) { return err ? e(err) : c(result); }])); }, function () { return null; });
    }
    exports.nfcall = nfcall;
    function ninvoke(thisArg, fn) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return new winjs_base_1.TPromise(function (c, e) { return fn.call.apply(fn, [thisArg].concat(args, [function (err, result) { return err ? e(err) : c(result); }])); }, function () { return null; });
    }
    exports.ninvoke = ninvoke;
});











define(__m[16/*vs/base/browser/dom*/], __M([0/*require*/,1/*exports*/,4/*vs/base/common/platform*/,3/*vs/base/common/winjs.base*/,12/*vs/base/common/async*/,19/*vs/base/common/errors*/,6/*vs/base/common/lifecycle*/,21/*vs/base/browser/browser*/,38/*vs/base/browser/keyboardEvent*/,76/*vs/base/browser/mouseEvent*/,2/*vs/base/common/event*/,69/*vs/base/browser/event*/]), function (require, exports, platform, winjs_base_1, async_1, errors_1, lifecycle_1, browser, keyboardEvent_1, mouseEvent_1, event_1, event_2) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function clearNode(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
    exports.clearNode = clearNode;
    function isInDOM(node) {
        while (node) {
            if (node === document.body) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    exports.isInDOM = isInDOM;
    var _manualClassList = new /** @class */ (function () {
        function class_1() {
        }
        class_1.prototype._findClassName = function (node, className) {
            var classes = node.className;
            if (!classes) {
                this._lastStart = -1;
                return;
            }
            className = className.trim();
            var classesLen = classes.length, classLen = className.length;
            if (classLen === 0) {
                this._lastStart = -1;
                return;
            }
            if (classesLen < classLen) {
                this._lastStart = -1;
                return;
            }
            if (classes === className) {
                this._lastStart = 0;
                this._lastEnd = classesLen;
                return;
            }
            var idx = -1, idxEnd;
            while ((idx = classes.indexOf(className, idx + 1)) >= 0) {
                idxEnd = idx + classLen;
                // a class that is followed by another class
                if ((idx === 0 || classes.charCodeAt(idx - 1) === 32 /* Space */) && classes.charCodeAt(idxEnd) === 32 /* Space */) {
                    this._lastStart = idx;
                    this._lastEnd = idxEnd + 1;
                    return;
                }
                // last class
                if (idx > 0 && classes.charCodeAt(idx - 1) === 32 /* Space */ && idxEnd === classesLen) {
                    this._lastStart = idx - 1;
                    this._lastEnd = idxEnd;
                    return;
                }
                // equal - duplicate of cmp above
                if (idx === 0 && idxEnd === classesLen) {
                    this._lastStart = 0;
                    this._lastEnd = idxEnd;
                    return;
                }
            }
            this._lastStart = -1;
        };
        class_1.prototype.hasClass = function (node, className) {
            this._findClassName(node, className);
            return this._lastStart !== -1;
        };
        class_1.prototype.addClasses = function (node) {
            var _this = this;
            var classNames = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                classNames[_i - 1] = arguments[_i];
            }
            classNames.forEach(function (nameValue) { return nameValue.split(' ').forEach(function (name) { return _this.addClass(node, name); }); });
        };
        class_1.prototype.addClass = function (node, className) {
            if (!node.className) { // doesn't have it for sure
                node.className = className;
            }
            else {
                this._findClassName(node, className); // see if it's already there
                if (this._lastStart === -1) {
                    node.className = node.className + ' ' + className;
                }
            }
        };
        class_1.prototype.removeClass = function (node, className) {
            this._findClassName(node, className);
            if (this._lastStart === -1) {
                return; // Prevent styles invalidation if not necessary
            }
            else {
                node.className = node.className.substring(0, this._lastStart) + node.className.substring(this._lastEnd);
            }
        };
        class_1.prototype.removeClasses = function (node) {
            var _this = this;
            var classNames = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                classNames[_i - 1] = arguments[_i];
            }
            classNames.forEach(function (nameValue) { return nameValue.split(' ').forEach(function (name) { return _this.removeClass(node, name); }); });
        };
        class_1.prototype.toggleClass = function (node, className, shouldHaveIt) {
            this._findClassName(node, className);
            if (this._lastStart !== -1 && (shouldHaveIt === void 0 || !shouldHaveIt)) {
                this.removeClass(node, className);
            }
            if (this._lastStart === -1 && (shouldHaveIt === void 0 || shouldHaveIt)) {
                this.addClass(node, className);
            }
        };
        return class_1;
    }());
    var _nativeClassList = new /** @class */ (function () {
        function class_2() {
        }
        class_2.prototype.hasClass = function (node, className) {
            return className && node.classList && node.classList.contains(className);
        };
        class_2.prototype.addClasses = function (node) {
            var _this = this;
            var classNames = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                classNames[_i - 1] = arguments[_i];
            }
            classNames.forEach(function (nameValue) { return nameValue.split(' ').forEach(function (name) { return _this.addClass(node, name); }); });
        };
        class_2.prototype.addClass = function (node, className) {
            if (className && node.classList) {
                node.classList.add(className);
            }
        };
        class_2.prototype.removeClass = function (node, className) {
            if (className && node.classList) {
                node.classList.remove(className);
            }
        };
        class_2.prototype.removeClasses = function (node) {
            var _this = this;
            var classNames = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                classNames[_i - 1] = arguments[_i];
            }
            classNames.forEach(function (nameValue) { return nameValue.split(' ').forEach(function (name) { return _this.removeClass(node, name); }); });
        };
        class_2.prototype.toggleClass = function (node, className, shouldHaveIt) {
            if (node.classList) {
                node.classList.toggle(className, shouldHaveIt);
            }
        };
        return class_2;
    }());
    // In IE11 there is only partial support for `classList` which makes us keep our
    // custom implementation. Otherwise use the native implementation, see: http://caniuse.com/#search=classlist
    var _classList = browser.isIE ? _manualClassList : _nativeClassList;
    exports.hasClass = _classList.hasClass.bind(_classList);
    exports.addClass = _classList.addClass.bind(_classList);
    exports.addClasses = _classList.addClasses.bind(_classList);
    exports.removeClass = _classList.removeClass.bind(_classList);
    exports.removeClasses = _classList.removeClasses.bind(_classList);
    exports.toggleClass = _classList.toggleClass.bind(_classList);
    var DomListener = /** @class */ (function () {
        function DomListener(node, type, handler, useCapture) {
            this._node = node;
            this._type = type;
            this._handler = handler;
            this._useCapture = (useCapture || false);
            this._node.addEventListener(this._type, this._handler, this._useCapture);
        }
        DomListener.prototype.dispose = function () {
            if (!this._handler) {
                // Already disposed
                return;
            }
            this._node.removeEventListener(this._type, this._handler, this._useCapture);
            // Prevent leakers from holding on to the dom or handler func
            this._node = null;
            this._handler = null;
        };
        return DomListener;
    }());
    function addDisposableListener(node, type, handler, useCapture) {
        return new DomListener(node, type, handler, useCapture);
    }
    exports.addDisposableListener = addDisposableListener;
    function _wrapAsStandardMouseEvent(handler) {
        return function (e) {
            return handler(new mouseEvent_1.StandardMouseEvent(e));
        };
    }
    function _wrapAsStandardKeyboardEvent(handler) {
        return function (e) {
            return handler(new keyboardEvent_1.StandardKeyboardEvent(e));
        };
    }
    exports.addStandardDisposableListener = function addStandardDisposableListener(node, type, handler, useCapture) {
        var wrapHandler = handler;
        if (type === 'click' || type === 'mousedown') {
            wrapHandler = _wrapAsStandardMouseEvent(handler);
        }
        else if (type === 'keydown' || type === 'keypress' || type === 'keyup') {
            wrapHandler = _wrapAsStandardKeyboardEvent(handler);
        }
        return addDisposableListener(node, type, wrapHandler, useCapture);
    };
    function addDisposableNonBubblingMouseOutListener(node, handler) {
        return addDisposableListener(node, 'mouseout', function (e) {
            // Mouse out bubbles, so this is an attempt to ignore faux mouse outs coming from children elements
            var toElement = (e.relatedTarget || e.toElement);
            while (toElement && toElement !== node) {
                toElement = toElement.parentNode;
            }
            if (toElement === node) {
                return;
            }
            handler(e);
        });
    }
    exports.addDisposableNonBubblingMouseOutListener = addDisposableNonBubblingMouseOutListener;
    var _animationFrame = null;
    function doRequestAnimationFrame(callback) {
        if (!_animationFrame) {
            var emulatedRequestAnimationFrame = function (callback) {
                return setTimeout(function () { return callback(new Date().getTime()); }, 0);
            };
            _animationFrame = (self.requestAnimationFrame
                || self.msRequestAnimationFrame
                || self.webkitRequestAnimationFrame
                || self.mozRequestAnimationFrame
                || self.oRequestAnimationFrame
                || emulatedRequestAnimationFrame);
        }
        return _animationFrame.call(self, callback);
    }
    var AnimationFrameQueueItem = /** @class */ (function () {
        function AnimationFrameQueueItem(runner, priority) {
            this._runner = runner;
            this.priority = priority;
            this._canceled = false;
        }
        AnimationFrameQueueItem.prototype.dispose = function () {
            this._canceled = true;
        };
        AnimationFrameQueueItem.prototype.execute = function () {
            if (this._canceled) {
                return;
            }
            try {
                this._runner();
            }
            catch (e) {
                errors_1.onUnexpectedError(e);
            }
        };
        // Sort by priority (largest to lowest)
        AnimationFrameQueueItem.sort = function (a, b) {
            return b.priority - a.priority;
        };
        return AnimationFrameQueueItem;
    }());
    (function () {
        /**
         * The runners scheduled at the next animation frame
         */
        var NEXT_QUEUE = [];
        /**
         * The runners scheduled at the current animation frame
         */
        var CURRENT_QUEUE = null;
        /**
         * A flag to keep track if the native requestAnimationFrame was already called
         */
        var animFrameRequested = false;
        /**
         * A flag to indicate if currently handling a native requestAnimationFrame callback
         */
        var inAnimationFrameRunner = false;
        var animationFrameRunner = function () {
            animFrameRequested = false;
            CURRENT_QUEUE = NEXT_QUEUE;
            NEXT_QUEUE = [];
            inAnimationFrameRunner = true;
            while (CURRENT_QUEUE.length > 0) {
                CURRENT_QUEUE.sort(AnimationFrameQueueItem.sort);
                var top_1 = CURRENT_QUEUE.shift();
                top_1.execute();
            }
            inAnimationFrameRunner = false;
        };
        exports.scheduleAtNextAnimationFrame = function (runner, priority) {
            if (priority === void 0) { priority = 0; }
            var item = new AnimationFrameQueueItem(runner, priority);
            NEXT_QUEUE.push(item);
            if (!animFrameRequested) {
                animFrameRequested = true;
                doRequestAnimationFrame(animationFrameRunner);
            }
            return item;
        };
        exports.runAtThisOrScheduleAtNextAnimationFrame = function (runner, priority) {
            if (inAnimationFrameRunner) {
                var item = new AnimationFrameQueueItem(runner, priority);
                CURRENT_QUEUE.push(item);
                return item;
            }
            else {
                return exports.scheduleAtNextAnimationFrame(runner, priority);
            }
        };
    })();
    var MINIMUM_TIME_MS = 16;
    var DEFAULT_EVENT_MERGER = function (lastEvent, currentEvent) {
        return currentEvent;
    };
    var TimeoutThrottledDomListener = /** @class */ (function (_super) {
        __extends(TimeoutThrottledDomListener, _super);
        function TimeoutThrottledDomListener(node, type, handler, eventMerger, minimumTimeMs) {
            if (eventMerger === void 0) { eventMerger = DEFAULT_EVENT_MERGER; }
            if (minimumTimeMs === void 0) { minimumTimeMs = MINIMUM_TIME_MS; }
            var _this = _super.call(this) || this;
            var lastEvent = null;
            var lastHandlerTime = 0;
            var timeout = _this._register(new async_1.TimeoutTimer());
            var invokeHandler = function () {
                lastHandlerTime = (new Date()).getTime();
                handler(lastEvent);
                lastEvent = null;
            };
            _this._register(addDisposableListener(node, type, function (e) {
                lastEvent = eventMerger(lastEvent, e);
                var elapsedTime = (new Date()).getTime() - lastHandlerTime;
                if (elapsedTime >= minimumTimeMs) {
                    timeout.cancel();
                    invokeHandler();
                }
                else {
                    timeout.setIfNotSet(invokeHandler, minimumTimeMs - elapsedTime);
                }
            }));
            return _this;
        }
        return TimeoutThrottledDomListener;
    }(lifecycle_1.Disposable));
    function addDisposableThrottledListener(node, type, handler, eventMerger, minimumTimeMs) {
        return new TimeoutThrottledDomListener(node, type, handler, eventMerger, minimumTimeMs);
    }
    exports.addDisposableThrottledListener = addDisposableThrottledListener;
    function getComputedStyle(el) {
        return document.defaultView.getComputedStyle(el, null);
    }
    exports.getComputedStyle = getComputedStyle;
    // Adapted from WinJS
    // Converts a CSS positioning string for the specified element to pixels.
    var convertToPixels = (function () {
        return function (element, value) {
            return parseFloat(value) || 0;
        };
    })();
    function getDimension(element, cssPropertyName, jsPropertyName) {
        var computedStyle = getComputedStyle(element);
        var value = '0';
        if (computedStyle) {
            if (computedStyle.getPropertyValue) {
                value = computedStyle.getPropertyValue(cssPropertyName);
            }
            else {
                // IE8
                value = computedStyle.getAttribute(jsPropertyName);
            }
        }
        return convertToPixels(element, value);
    }
    function getClientArea(element) {
        // Try with DOM clientWidth / clientHeight
        if (element !== document.body) {
            return new Dimension(element.clientWidth, element.clientHeight);
        }
        // Try innerWidth / innerHeight
        if (window.innerWidth && window.innerHeight) {
            return new Dimension(window.innerWidth, window.innerHeight);
        }
        // Try with document.body.clientWidth / document.body.clientHeigh
        if (document.body && document.body.clientWidth && document.body.clientWidth) {
            return new Dimension(document.body.clientWidth, document.body.clientHeight);
        }
        // Try with document.documentElement.clientWidth / document.documentElement.clientHeight
        if (document.documentElement && document.documentElement.clientWidth && document.documentElement.clientHeight) {
            return new Dimension(document.documentElement.clientWidth, document.documentElement.clientHeight);
        }
        throw new Error('Unable to figure out browser width and height');
    }
    exports.getClientArea = getClientArea;
    var sizeUtils = {
        getBorderLeftWidth: function (element) {
            return getDimension(element, 'border-left-width', 'borderLeftWidth');
        },
        getBorderRightWidth: function (element) {
            return getDimension(element, 'border-right-width', 'borderRightWidth');
        },
        getBorderTopWidth: function (element) {
            return getDimension(element, 'border-top-width', 'borderTopWidth');
        },
        getBorderBottomWidth: function (element) {
            return getDimension(element, 'border-bottom-width', 'borderBottomWidth');
        },
        getPaddingLeft: function (element) {
            return getDimension(element, 'padding-left', 'paddingLeft');
        },
        getPaddingRight: function (element) {
            return getDimension(element, 'padding-right', 'paddingRight');
        },
        getPaddingTop: function (element) {
            return getDimension(element, 'padding-top', 'paddingTop');
        },
        getPaddingBottom: function (element) {
            return getDimension(element, 'padding-bottom', 'paddingBottom');
        },
        getMarginLeft: function (element) {
            return getDimension(element, 'margin-left', 'marginLeft');
        },
        getMarginTop: function (element) {
            return getDimension(element, 'margin-top', 'marginTop');
        },
        getMarginRight: function (element) {
            return getDimension(element, 'margin-right', 'marginRight');
        },
        getMarginBottom: function (element) {
            return getDimension(element, 'margin-bottom', 'marginBottom');
        },
        __commaSentinel: false
    };
    // ----------------------------------------------------------------------------------------
    // Position & Dimension
    var Dimension = /** @class */ (function () {
        function Dimension(width, height) {
            this.width = width;
            this.height = height;
        }
        return Dimension;
    }());
    exports.Dimension = Dimension;
    function getTopLeftOffset(element) {
        // Adapted from WinJS.Utilities.getPosition
        // and added borders to the mix
        var offsetParent = element.offsetParent, top = element.offsetTop, left = element.offsetLeft;
        while ((element = element.parentNode) !== null && element !== document.body && element !== document.documentElement) {
            top -= element.scrollTop;
            var c = getComputedStyle(element);
            if (c) {
                left -= c.direction !== 'rtl' ? element.scrollLeft : -element.scrollLeft;
            }
            if (element === offsetParent) {
                left += sizeUtils.getBorderLeftWidth(element);
                top += sizeUtils.getBorderTopWidth(element);
                top += element.offsetTop;
                left += element.offsetLeft;
                offsetParent = element.offsetParent;
            }
        }
        return {
            left: left,
            top: top
        };
    }
    exports.getTopLeftOffset = getTopLeftOffset;
    function size(element, width, height) {
        if (typeof width === 'number') {
            element.style.width = width + "px";
        }
        if (typeof height === 'number') {
            element.style.height = height + "px";
        }
    }
    exports.size = size;
    function position(element, top, right, bottom, left, position) {
        if (position === void 0) { position = 'absolute'; }
        if (typeof top === 'number') {
            element.style.top = top + "px";
        }
        if (typeof right === 'number') {
            element.style.right = right + "px";
        }
        if (typeof bottom === 'number') {
            element.style.bottom = bottom + "px";
        }
        if (typeof left === 'number') {
            element.style.left = left + "px";
        }
        element.style.position = position;
    }
    exports.position = position;
    /**
     * Returns the position of a dom node relative to the entire page.
     */
    function getDomNodePagePosition(domNode) {
        var bb = domNode.getBoundingClientRect();
        return {
            left: bb.left + exports.StandardWindow.scrollX,
            top: bb.top + exports.StandardWindow.scrollY,
            width: bb.width,
            height: bb.height
        };
    }
    exports.getDomNodePagePosition = getDomNodePagePosition;
    exports.StandardWindow = new /** @class */ (function () {
        function class_3() {
        }
        Object.defineProperty(class_3.prototype, "scrollX", {
            get: function () {
                if (typeof window.scrollX === 'number') {
                    // modern browsers
                    return window.scrollX;
                }
                else {
                    return document.body.scrollLeft + document.documentElement.scrollLeft;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(class_3.prototype, "scrollY", {
            get: function () {
                if (typeof window.scrollY === 'number') {
                    // modern browsers
                    return window.scrollY;
                }
                else {
                    return document.body.scrollTop + document.documentElement.scrollTop;
                }
            },
            enumerable: true,
            configurable: true
        });
        return class_3;
    }());
    // Adapted from WinJS
    // Gets the width of the element, including margins.
    function getTotalWidth(element) {
        var margin = sizeUtils.getMarginLeft(element) + sizeUtils.getMarginRight(element);
        return element.offsetWidth + margin;
    }
    exports.getTotalWidth = getTotalWidth;
    function getContentWidth(element) {
        var border = sizeUtils.getBorderLeftWidth(element) + sizeUtils.getBorderRightWidth(element);
        var padding = sizeUtils.getPaddingLeft(element) + sizeUtils.getPaddingRight(element);
        return element.offsetWidth - border - padding;
    }
    exports.getContentWidth = getContentWidth;
    function getTotalScrollWidth(element) {
        var margin = sizeUtils.getMarginLeft(element) + sizeUtils.getMarginRight(element);
        return element.scrollWidth + margin;
    }
    exports.getTotalScrollWidth = getTotalScrollWidth;
    // Adapted from WinJS
    // Gets the height of the content of the specified element. The content height does not include borders or padding.
    function getContentHeight(element) {
        var border = sizeUtils.getBorderTopWidth(element) + sizeUtils.getBorderBottomWidth(element);
        var padding = sizeUtils.getPaddingTop(element) + sizeUtils.getPaddingBottom(element);
        return element.offsetHeight - border - padding;
    }
    exports.getContentHeight = getContentHeight;
    // Adapted from WinJS
    // Gets the height of the element, including its margins.
    function getTotalHeight(element) {
        var margin = sizeUtils.getMarginTop(element) + sizeUtils.getMarginBottom(element);
        return element.offsetHeight + margin;
    }
    exports.getTotalHeight = getTotalHeight;
    // Gets the left coordinate of the specified element relative to the specified parent.
    function getRelativeLeft(element, parent) {
        if (element === null) {
            return 0;
        }
        var elementPosition = getTopLeftOffset(element);
        var parentPosition = getTopLeftOffset(parent);
        return elementPosition.left - parentPosition.left;
    }
    function getLargestChildWidth(parent, children) {
        var childWidths = children.map(function (child) {
            return Math.max(getTotalScrollWidth(child), getTotalWidth(child)) + getRelativeLeft(child, parent) || 0;
        });
        var maxWidth = Math.max.apply(Math, childWidths);
        return maxWidth;
    }
    exports.getLargestChildWidth = getLargestChildWidth;
    // ----------------------------------------------------------------------------------------
    function isAncestor(testChild, testAncestor) {
        while (testChild) {
            if (testChild === testAncestor) {
                return true;
            }
            testChild = testChild.parentNode;
        }
        return false;
    }
    exports.isAncestor = isAncestor;
    function findParentWithClass(node, clazz, stopAtClazzOrNode) {
        while (node) {
            if (exports.hasClass(node, clazz)) {
                return node;
            }
            if (stopAtClazzOrNode) {
                if (typeof stopAtClazzOrNode === 'string') {
                    if (exports.hasClass(node, stopAtClazzOrNode)) {
                        return null;
                    }
                }
                else {
                    if (node === stopAtClazzOrNode) {
                        return null;
                    }
                }
            }
            node = node.parentNode;
        }
        return null;
    }
    exports.findParentWithClass = findParentWithClass;
    function createStyleSheet(container) {
        if (container === void 0) { container = document.getElementsByTagName('head')[0]; }
        var style = document.createElement('style');
        style.type = 'text/css';
        style.media = 'screen';
        container.appendChild(style);
        return style;
    }
    exports.createStyleSheet = createStyleSheet;
    var _sharedStyleSheet = null;
    function getSharedStyleSheet() {
        if (!_sharedStyleSheet) {
            _sharedStyleSheet = createStyleSheet();
        }
        return _sharedStyleSheet;
    }
    function getDynamicStyleSheetRules(style) {
        if (style && style.sheet && style.sheet.rules) {
            // Chrome, IE
            return style.sheet.rules;
        }
        if (style && style.sheet && style.sheet.cssRules) {
            // FF
            return style.sheet.cssRules;
        }
        return [];
    }
    function createCSSRule(selector, cssText, style) {
        if (style === void 0) { style = getSharedStyleSheet(); }
        if (!style || !cssText) {
            return;
        }
        style.sheet.insertRule(selector + '{' + cssText + '}', 0);
    }
    exports.createCSSRule = createCSSRule;
    function removeCSSRulesContainingSelector(ruleName, style) {
        if (style === void 0) { style = getSharedStyleSheet(); }
        if (!style) {
            return;
        }
        var rules = getDynamicStyleSheetRules(style);
        var toDelete = [];
        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i];
            if (rule.selectorText.indexOf(ruleName) !== -1) {
                toDelete.push(i);
            }
        }
        for (var i = toDelete.length - 1; i >= 0; i--) {
            style.sheet.deleteRule(toDelete[i]);
        }
    }
    exports.removeCSSRulesContainingSelector = removeCSSRulesContainingSelector;
    function isHTMLElement(o) {
        if (typeof HTMLElement === 'object') {
            return o instanceof HTMLElement;
        }
        return o && typeof o === 'object' && o.nodeType === 1 && typeof o.nodeName === 'string';
    }
    exports.isHTMLElement = isHTMLElement;
    exports.EventType = {
        // Mouse
        CLICK: 'click',
        AUXCLICK: 'auxclick',
        DBLCLICK: 'dblclick',
        MOUSE_UP: 'mouseup',
        MOUSE_DOWN: 'mousedown',
        MOUSE_OVER: 'mouseover',
        MOUSE_MOVE: 'mousemove',
        MOUSE_OUT: 'mouseout',
        MOUSE_ENTER: 'mouseenter',
        MOUSE_LEAVE: 'mouseleave',
        CONTEXT_MENU: 'contextmenu',
        WHEEL: 'wheel',
        // Keyboard
        KEY_DOWN: 'keydown',
        KEY_PRESS: 'keypress',
        KEY_UP: 'keyup',
        // HTML Document
        LOAD: 'load',
        UNLOAD: 'unload',
        ABORT: 'abort',
        ERROR: 'error',
        RESIZE: 'resize',
        SCROLL: 'scroll',
        // Form
        SELECT: 'select',
        CHANGE: 'change',
        SUBMIT: 'submit',
        RESET: 'reset',
        FOCUS: 'focus',
        FOCUS_IN: 'focusin',
        FOCUS_OUT: 'focusout',
        BLUR: 'blur',
        INPUT: 'input',
        // Local Storage
        STORAGE: 'storage',
        // Drag
        DRAG_START: 'dragstart',
        DRAG: 'drag',
        DRAG_ENTER: 'dragenter',
        DRAG_LEAVE: 'dragleave',
        DRAG_OVER: 'dragover',
        DROP: 'drop',
        DRAG_END: 'dragend',
        // Animation
        ANIMATION_START: browser.isWebKit ? 'webkitAnimationStart' : 'animationstart',
        ANIMATION_END: browser.isWebKit ? 'webkitAnimationEnd' : 'animationend',
        ANIMATION_ITERATION: browser.isWebKit ? 'webkitAnimationIteration' : 'animationiteration'
    };
    exports.EventHelper = {
        stop: function (e, cancelBubble) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            else {
                // IE8
                e.returnValue = false;
            }
            if (cancelBubble) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                else {
                    // IE8
                    e.cancelBubble = true;
                }
            }
        }
    };
    function saveParentsScrollTop(node) {
        var r = [];
        for (var i = 0; node && node.nodeType === node.ELEMENT_NODE; i++) {
            r[i] = node.scrollTop;
            node = node.parentNode;
        }
        return r;
    }
    exports.saveParentsScrollTop = saveParentsScrollTop;
    function restoreParentsScrollTop(node, state) {
        for (var i = 0; node && node.nodeType === node.ELEMENT_NODE; i++) {
            if (node.scrollTop !== state[i]) {
                node.scrollTop = state[i];
            }
            node = node.parentNode;
        }
    }
    exports.restoreParentsScrollTop = restoreParentsScrollTop;
    var FocusTracker = /** @class */ (function () {
        function FocusTracker(element) {
            var _this = this;
            this._onDidFocus = new event_1.Emitter();
            this.onDidFocus = this._onDidFocus.event;
            this._onDidBlur = new event_1.Emitter();
            this.onDidBlur = this._onDidBlur.event;
            this.disposables = [];
            var hasFocus = false;
            var loosingFocus = false;
            var onFocus = function () {
                loosingFocus = false;
                if (!hasFocus) {
                    hasFocus = true;
                    _this._onDidFocus.fire();
                }
            };
            var onBlur = function () {
                if (hasFocus) {
                    loosingFocus = true;
                    window.setTimeout(function () {
                        if (loosingFocus) {
                            loosingFocus = false;
                            hasFocus = false;
                            _this._onDidBlur.fire();
                        }
                    }, 0);
                }
            };
            event_2.domEvent(element, exports.EventType.FOCUS, true)(onFocus, null, this.disposables);
            event_2.domEvent(element, exports.EventType.BLUR, true)(onBlur, null, this.disposables);
        }
        FocusTracker.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
            this._onDidFocus.dispose();
            this._onDidBlur.dispose();
        };
        return FocusTracker;
    }());
    function trackFocus(element) {
        return new FocusTracker(element);
    }
    exports.trackFocus = trackFocus;
    function append(parent) {
        var children = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            children[_i - 1] = arguments[_i];
        }
        children.forEach(function (child) { return parent.appendChild(child); });
        return children[children.length - 1];
    }
    exports.append = append;
    function prepend(parent, child) {
        parent.insertBefore(child, parent.firstChild);
        return child;
    }
    exports.prepend = prepend;
    var SELECTOR_REGEX = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;
    // Similar to builder, but much more lightweight
    function $(description, attrs) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        var match = SELECTOR_REGEX.exec(description);
        if (!match) {
            throw new Error('Bad use of emmet');
        }
        var result = document.createElement(match[1] || 'div');
        if (match[3]) {
            result.id = match[3];
        }
        if (match[4]) {
            result.className = match[4].replace(/\./g, ' ').trim();
        }
        Object.keys(attrs || {}).forEach(function (name) {
            if (/^on\w+$/.test(name)) {
                result[name] = attrs[name];
            }
            else if (name === 'selected') {
                var value = attrs[name];
                if (value) {
                    result.setAttribute(name, 'true');
                }
            }
            else {
                result.setAttribute(name, attrs[name]);
            }
        });
        children
            .filter(function (child) { return !!child; })
            .forEach(function (child) {
            if (child instanceof Node) {
                result.appendChild(child);
            }
            else {
                result.appendChild(document.createTextNode(child));
            }
        });
        return result;
    }
    exports.$ = $;
    function join(nodes, separator) {
        var result = [];
        nodes.forEach(function (node, index) {
            if (index > 0) {
                if (separator instanceof Node) {
                    result.push(separator.cloneNode());
                }
                else {
                    result.push(document.createTextNode(separator));
                }
            }
            result.push(node);
        });
        return result;
    }
    exports.join = join;
    function show() {
        var elements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            elements[_i] = arguments[_i];
        }
        for (var _a = 0, elements_1 = elements; _a < elements_1.length; _a++) {
            var element = elements_1[_a];
            element.style.display = '';
            element.removeAttribute('aria-hidden');
        }
    }
    exports.show = show;
    function hide() {
        var elements = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            elements[_i] = arguments[_i];
        }
        for (var _a = 0, elements_2 = elements; _a < elements_2.length; _a++) {
            var element = elements_2[_a];
            element.style.display = 'none';
            element.setAttribute('aria-hidden', 'true');
        }
    }
    exports.hide = hide;
    function findParentWithAttribute(node, attribute) {
        while (node) {
            if (node instanceof HTMLElement && node.hasAttribute(attribute)) {
                return node;
            }
            node = node.parentNode;
        }
        return null;
    }
    function removeTabIndexAndUpdateFocus(node) {
        if (!node || !node.hasAttribute('tabIndex')) {
            return;
        }
        // If we are the currently focused element and tabIndex is removed,
        // standard DOM behavior is to move focus to the <body> element. We
        // typically never want that, rather put focus to the closest element
        // in the hierarchy of the parent DOM nodes.
        if (document.activeElement === node) {
            var parentFocusable = findParentWithAttribute(node.parentElement, 'tabIndex');
            if (parentFocusable) {
                parentFocusable.focus();
            }
        }
        node.removeAttribute('tabindex');
    }
    exports.removeTabIndexAndUpdateFocus = removeTabIndexAndUpdateFocus;
    function getElementsByTagName(tag) {
        return Array.prototype.slice.call(document.getElementsByTagName(tag), 0);
    }
    exports.getElementsByTagName = getElementsByTagName;
    function finalHandler(fn) {
        return function (e) {
            e.preventDefault();
            e.stopPropagation();
            fn(e);
        };
    }
    exports.finalHandler = finalHandler;
    function domContentLoaded() {
        return new winjs_base_1.TPromise(function (c, e) {
            var readyState = document.readyState;
            if (readyState === 'complete' || (document && document.body !== null)) {
                platform.setImmediate(c);
            }
            else {
                window.addEventListener('DOMContentLoaded', c, false);
            }
        });
    }
    exports.domContentLoaded = domContentLoaded;
    /**
     * Find a value usable for a dom node size such that the likelihood that it would be
     * displayed with constant screen pixels size is as high as possible.
     *
     * e.g. We would desire for the cursors to be 2px (CSS px) wide. Under a devicePixelRatio
     * of 1.25, the cursor will be 2.5 screen pixels wide. Depending on how the dom node aligns/"snaps"
     * with the screen pixels, it will sometimes be rendered with 2 screen pixels, and sometimes with 3 screen pixels.
     */
    function computeScreenAwareSize(cssPx) {
        var screenPx = window.devicePixelRatio * cssPx;
        return Math.max(1, Math.floor(screenPx)) / window.devicePixelRatio;
    }
    exports.computeScreenAwareSize = computeScreenAwareSize;
    /**
     * See https://github.com/Microsoft/monaco-editor/issues/601
     * To protect against malicious code in the linked site, particularly phishing attempts,
     * the window.opener should be set to null to prevent the linked site from having access
     * to change the location of the current page.
     * See https://mathiasbynens.github.io/rel-noopener/
     */
    function windowOpenNoOpener(url) {
        if (platform.isNative || browser.isEdgeWebView) {
            // In VSCode, window.open() always returns null...
            // The same is true for a WebView (see https://github.com/Microsoft/monaco-editor/issues/628)
            window.open(url);
        }
        else {
            var newTab = window.open();
            if (newTab) {
                newTab.opener = null;
                newTab.location.href = url;
            }
        }
    }
    exports.windowOpenNoOpener = windowOpenNoOpener;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(__m[86/*vs/base/browser/touch*/], __M([0/*require*/,1/*exports*/,31/*vs/base/common/arrays*/,6/*vs/base/common/lifecycle*/,16/*vs/base/browser/dom*/,25/*vs/base/common/decorators*/]), function (require, exports, arrays, lifecycle_1, DomUtils, decorators_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventType;
    (function (EventType) {
        EventType.Tap = '-monaco-gesturetap';
        EventType.Change = '-monaco-gesturechange';
        EventType.Start = '-monaco-gesturestart';
        EventType.End = '-monaco-gesturesend';
        EventType.Contextmenu = '-monaco-gesturecontextmenu';
    })(EventType = exports.EventType || (exports.EventType = {}));
    var Gesture = /** @class */ (function () {
        function Gesture() {
            var _this = this;
            this.toDispose = [];
            this.activeTouches = {};
            this.handle = null;
            this.targets = [];
            this.toDispose.push(DomUtils.addDisposableListener(document, 'touchstart', function (e) { return _this.onTouchStart(e); }));
            this.toDispose.push(DomUtils.addDisposableListener(document, 'touchend', function (e) { return _this.onTouchEnd(e); }));
            this.toDispose.push(DomUtils.addDisposableListener(document, 'touchmove', function (e) { return _this.onTouchMove(e); }));
        }
        Gesture.addTarget = function (element) {
            if (!Gesture.isTouchDevice()) {
                return;
            }
            if (!Gesture.INSTANCE) {
                Gesture.INSTANCE = new Gesture();
            }
            Gesture.INSTANCE.targets.push(element);
        };
        Gesture.isTouchDevice = function () {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
        };
        Gesture.prototype.dispose = function () {
            if (this.handle) {
                this.handle.dispose();
                lifecycle_1.dispose(this.toDispose);
                this.handle = null;
            }
        };
        Gesture.prototype.onTouchStart = function (e) {
            var timestamp = Date.now(); // use Date.now() because on FF e.timeStamp is not epoch based.
            if (this.handle) {
                this.handle.dispose();
                this.handle = null;
            }
            for (var i = 0, len = e.targetTouches.length; i < len; i++) {
                var touch = e.targetTouches.item(i);
                this.activeTouches[touch.identifier] = {
                    id: touch.identifier,
                    initialTarget: touch.target,
                    initialTimeStamp: timestamp,
                    initialPageX: touch.pageX,
                    initialPageY: touch.pageY,
                    rollingTimestamps: [timestamp],
                    rollingPageX: [touch.pageX],
                    rollingPageY: [touch.pageY]
                };
                var evt = this.newGestureEvent(EventType.Start, touch.target);
                evt.pageX = touch.pageX;
                evt.pageY = touch.pageY;
                this.dispatchEvent(evt);
            }
            if (this.dispatched) {
                e.preventDefault();
                e.stopPropagation();
                this.dispatched = false;
            }
        };
        Gesture.prototype.onTouchEnd = function (e) {
            var timestamp = Date.now(); // use Date.now() because on FF e.timeStamp is not epoch based.
            var activeTouchCount = Object.keys(this.activeTouches).length;
            var _loop_1 = function (i, len) {
                var touch = e.changedTouches.item(i);
                if (!this_1.activeTouches.hasOwnProperty(String(touch.identifier))) {
                    console.warn('move of an UNKNOWN touch', touch);
                    return "continue";
                }
                var data = this_1.activeTouches[touch.identifier], holdTime = Date.now() - data.initialTimeStamp;
                if (holdTime < Gesture.HOLD_DELAY
                    && Math.abs(data.initialPageX - arrays.tail(data.rollingPageX)) < 30
                    && Math.abs(data.initialPageY - arrays.tail(data.rollingPageY)) < 30) {
                    var evt = this_1.newGestureEvent(EventType.Tap, data.initialTarget);
                    evt.pageX = arrays.tail(data.rollingPageX);
                    evt.pageY = arrays.tail(data.rollingPageY);
                    this_1.dispatchEvent(evt);
                }
                else if (holdTime >= Gesture.HOLD_DELAY
                    && Math.abs(data.initialPageX - arrays.tail(data.rollingPageX)) < 30
                    && Math.abs(data.initialPageY - arrays.tail(data.rollingPageY)) < 30) {
                    var evt = this_1.newGestureEvent(EventType.Contextmenu, data.initialTarget);
                    evt.pageX = arrays.tail(data.rollingPageX);
                    evt.pageY = arrays.tail(data.rollingPageY);
                    this_1.dispatchEvent(evt);
                }
                else if (activeTouchCount === 1) {
                    var finalX = arrays.tail(data.rollingPageX);
                    var finalY = arrays.tail(data.rollingPageY);
                    var deltaT = arrays.tail(data.rollingTimestamps) - data.rollingTimestamps[0];
                    var deltaX = finalX - data.rollingPageX[0];
                    var deltaY = finalY - data.rollingPageY[0];
                    // We need to get all the dispatch targets on the start of the inertia event
                    var dispatchTo = this_1.targets.filter(function (t) { return data.initialTarget instanceof Node && t.contains(data.initialTarget); });
                    this_1.inertia(dispatchTo, timestamp, // time now
                    Math.abs(deltaX) / deltaT, // speed
                    deltaX > 0 ? 1 : -1, // x direction
                    finalX, // x now
                    Math.abs(deltaY) / deltaT, // y speed
                    deltaY > 0 ? 1 : -1, // y direction
                    finalY // y now
                    );
                }
                this_1.dispatchEvent(this_1.newGestureEvent(EventType.End, data.initialTarget));
                // forget about this touch
                delete this_1.activeTouches[touch.identifier];
            };
            var this_1 = this;
            for (var i = 0, len = e.changedTouches.length; i < len; i++) {
                _loop_1(i, len);
            }
            if (this.dispatched) {
                e.preventDefault();
                e.stopPropagation();
                this.dispatched = false;
            }
        };
        Gesture.prototype.newGestureEvent = function (type, intialTarget) {
            var event = document.createEvent('CustomEvent');
            event.initEvent(type, false, true);
            event.initialTarget = intialTarget;
            return event;
        };
        Gesture.prototype.dispatchEvent = function (event) {
            var _this = this;
            this.targets.forEach(function (target) {
                if (event.initialTarget instanceof Node && target.contains(event.initialTarget)) {
                    target.dispatchEvent(event);
                    _this.dispatched = true;
                }
            });
        };
        Gesture.prototype.inertia = function (dispatchTo, t1, vX, dirX, x, vY, dirY, y) {
            var _this = this;
            this.handle = DomUtils.scheduleAtNextAnimationFrame(function () {
                var now = Date.now();
                // velocity: old speed + accel_over_time
                var deltaT = now - t1, delta_pos_x = 0, delta_pos_y = 0, stopped = true;
                vX += Gesture.SCROLL_FRICTION * deltaT;
                vY += Gesture.SCROLL_FRICTION * deltaT;
                if (vX > 0) {
                    stopped = false;
                    delta_pos_x = dirX * vX * deltaT;
                }
                if (vY > 0) {
                    stopped = false;
                    delta_pos_y = dirY * vY * deltaT;
                }
                // dispatch translation event
                var evt = _this.newGestureEvent(EventType.Change);
                evt.translationX = delta_pos_x;
                evt.translationY = delta_pos_y;
                dispatchTo.forEach(function (d) { return d.dispatchEvent(evt); });
                if (!stopped) {
                    _this.inertia(dispatchTo, now, vX, dirX, x + delta_pos_x, vY, dirY, y + delta_pos_y);
                }
            });
        };
        Gesture.prototype.onTouchMove = function (e) {
            var timestamp = Date.now(); // use Date.now() because on FF e.timeStamp is not epoch based.
            for (var i = 0, len = e.changedTouches.length; i < len; i++) {
                var touch = e.changedTouches.item(i);
                if (!this.activeTouches.hasOwnProperty(String(touch.identifier))) {
                    console.warn('end of an UNKNOWN touch', touch);
                    continue;
                }
                var data = this.activeTouches[touch.identifier];
                var evt = this.newGestureEvent(EventType.Change, data.initialTarget);
                evt.translationX = touch.pageX - arrays.tail(data.rollingPageX);
                evt.translationY = touch.pageY - arrays.tail(data.rollingPageY);
                evt.pageX = touch.pageX;
                evt.pageY = touch.pageY;
                this.dispatchEvent(evt);
                // only keep a few data points, to average the final speed
                if (data.rollingPageX.length > 3) {
                    data.rollingPageX.shift();
                    data.rollingPageY.shift();
                    data.rollingTimestamps.shift();
                }
                data.rollingPageX.push(touch.pageX);
                data.rollingPageY.push(touch.pageY);
                data.rollingTimestamps.push(timestamp);
            }
            if (this.dispatched) {
                e.preventDefault();
                e.stopPropagation();
                this.dispatched = false;
            }
        };
        Gesture.SCROLL_FRICTION = -0.005;
        Gesture.HOLD_DELAY = 700;
        __decorate([
            decorators_1.memoize
        ], Gesture, "isTouchDevice", null);
        return Gesture;
    }());
    exports.Gesture = Gesture;
});

define(__m[87/*vs/base/common/glob*/], __M([0/*require*/,1/*exports*/,31/*vs/base/common/arrays*/,5/*vs/base/common/strings*/,10/*vs/base/common/paths*/,32/*vs/base/common/map*/,3/*vs/base/common/winjs.base*/]), function (require, exports, arrays, strings, paths, map_1, winjs_base_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function getEmptyExpression() {
        return Object.create(null);
    }
    exports.getEmptyExpression = getEmptyExpression;
    var GLOBSTAR = '**';
    var GLOB_SPLIT = '/';
    var PATH_REGEX = '[/\\\\]'; // any slash or backslash
    var NO_PATH_REGEX = '[^/\\\\]'; // any non-slash and non-backslash
    var ALL_FORWARD_SLASHES = /\//g;
    function starsToRegExp(starCount) {
        switch (starCount) {
            case 0:
                return '';
            case 1:
                return NO_PATH_REGEX + "*?"; // 1 star matches any number of characters except path separator (/ and \) - non greedy (?)
            default:
                // Matches:  (Path Sep OR Path Val followed by Path Sep OR Path Sep followed by Path Val) 0-many times
                // Group is non capturing because we don't need to capture at all (?:...)
                // Overall we use non-greedy matching because it could be that we match too much
                return "(?:" + PATH_REGEX + "|" + NO_PATH_REGEX + "+" + PATH_REGEX + "|" + PATH_REGEX + NO_PATH_REGEX + "+)*?";
        }
    }
    function splitGlobAware(pattern, splitChar) {
        if (!pattern) {
            return [];
        }
        var segments = [];
        var inBraces = false;
        var inBrackets = false;
        var char;
        var curVal = '';
        for (var i = 0; i < pattern.length; i++) {
            char = pattern[i];
            switch (char) {
                case splitChar:
                    if (!inBraces && !inBrackets) {
                        segments.push(curVal);
                        curVal = '';
                        continue;
                    }
                    break;
                case '{':
                    inBraces = true;
                    break;
                case '}':
                    inBraces = false;
                    break;
                case '[':
                    inBrackets = true;
                    break;
                case ']':
                    inBrackets = false;
                    break;
            }
            curVal += char;
        }
        // Tail
        if (curVal) {
            segments.push(curVal);
        }
        return segments;
    }
    exports.splitGlobAware = splitGlobAware;
    function parseRegExp(pattern) {
        if (!pattern) {
            return '';
        }
        var regEx = '';
        // Split up into segments for each slash found
        var segments = splitGlobAware(pattern, GLOB_SPLIT);
        // Special case where we only have globstars
        if (segments.every(function (s) { return s === GLOBSTAR; })) {
            regEx = '.*';
        }
        // Build regex over segments
        else {
            var previousSegmentWasGlobStar_1 = false;
            segments.forEach(function (segment, index) {
                // Globstar is special
                if (segment === GLOBSTAR) {
                    // if we have more than one globstar after another, just ignore it
                    if (!previousSegmentWasGlobStar_1) {
                        regEx += starsToRegExp(2);
                        previousSegmentWasGlobStar_1 = true;
                    }
                    return;
                }
                // States
                var inBraces = false;
                var braceVal = '';
                var inBrackets = false;
                var bracketVal = '';
                var char;
                for (var i = 0; i < segment.length; i++) {
                    char = segment[i];
                    // Support brace expansion
                    if (char !== '}' && inBraces) {
                        braceVal += char;
                        continue;
                    }
                    // Support brackets
                    if (inBrackets && (char !== ']' || !bracketVal) /* ] is literally only allowed as first character in brackets to match it */) {
                        var res = void 0;
                        // range operator
                        if (char === '-') {
                            res = char;
                        }
                        // negation operator (only valid on first index in bracket)
                        else if ((char === '^' || char === '!') && !bracketVal) {
                            res = '^';
                        }
                        // glob split matching is not allowed within character ranges
                        // see http://man7.org/linux/man-pages/man7/glob.7.html
                        else if (char === GLOB_SPLIT) {
                            res = '';
                        }
                        // anything else gets escaped
                        else {
                            res = strings.escapeRegExpCharacters(char);
                        }
                        bracketVal += res;
                        continue;
                    }
                    switch (char) {
                        case '{':
                            inBraces = true;
                            continue;
                        case '[':
                            inBrackets = true;
                            continue;
                        case '}':
                            var choices = splitGlobAware(braceVal, ',');
                            // Converts {foo,bar} => [foo|bar]
                            var braceRegExp = "(?:" + choices.map(function (c) { return parseRegExp(c); }).join('|') + ")";
                            regEx += braceRegExp;
                            inBraces = false;
                            braceVal = '';
                            break;
                        case ']':
                            regEx += ('[' + bracketVal + ']');
                            inBrackets = false;
                            bracketVal = '';
                            break;
                        case '?':
                            regEx += NO_PATH_REGEX; // 1 ? matches any single character except path separator (/ and \)
                            continue;
                        case '*':
                            regEx += starsToRegExp(1);
                            continue;
                        default:
                            regEx += strings.escapeRegExpCharacters(char);
                    }
                }
                // Tail: Add the slash we had split on if there is more to come and the remaining pattern is not a globstar
                // For example if pattern: some/**/*.js we want the "/" after some to be included in the RegEx to prevent
                // a folder called "something" to match as well.
                // However, if pattern: some/**, we tolerate that we also match on "something" because our globstar behaviour
                // is to match 0-N segments.
                if (index < segments.length - 1 && (segments[index + 1] !== GLOBSTAR || index + 2 < segments.length)) {
                    regEx += PATH_REGEX;
                }
                // reset state
                previousSegmentWasGlobStar_1 = false;
            });
        }
        return regEx;
    }
    // regexes to check for trival glob patterns that just check for String#endsWith
    var T1 = /^\*\*\/\*\.[\w\.-]+$/; // **/*.something
    var T2 = /^\*\*\/([\w\.-]+)\/?$/; // **/something
    var T3 = /^{\*\*\/[\*\.]?[\w\.-]+\/?(,\*\*\/[\*\.]?[\w\.-]+\/?)*}$/; // {**/*.something,**/*.else} or {**/package.json,**/project.json}
    var T3_2 = /^{\*\*\/[\*\.]?[\w\.-]+(\/(\*\*)?)?(,\*\*\/[\*\.]?[\w\.-]+(\/(\*\*)?)?)*}$/; // Like T3, with optional trailing /**
    var T4 = /^\*\*((\/[\w\.-]+)+)\/?$/; // **/something/else
    var T5 = /^([\w\.-]+(\/[\w\.-]+)*)\/?$/; // something/else
    var CACHE = new map_1.LRUCache(10000); // bounded to 10000 elements
    var FALSE = function () {
        return false;
    };
    var NULL = function () {
        return null;
    };
    function parsePattern(arg1, options) {
        if (!arg1) {
            return NULL;
        }
        // Handle IRelativePattern
        var pattern;
        if (typeof arg1 !== 'string') {
            pattern = arg1.pattern;
        }
        else {
            pattern = arg1;
        }
        // Whitespace trimming
        pattern = pattern.trim();
        // Check cache
        var patternKey = pattern + "_" + !!options.trimForExclusions;
        var parsedPattern = CACHE.get(patternKey);
        if (parsedPattern) {
            return wrapRelativePattern(parsedPattern, arg1);
        }
        // Check for Trivias
        var match;
        if (T1.test(pattern)) { // common pattern: **/*.txt just need endsWith check
            var base_1 = pattern.substr(4); // '**/*'.length === 4
            parsedPattern = function (path, basename) {
                return path && strings.endsWith(path, base_1) ? pattern : null;
            };
        }
        else if (match = T2.exec(trimForExclusions(pattern, options))) { // common pattern: **/some.txt just need basename check
            parsedPattern = trivia2(match[1], pattern);
        }
        else if ((options.trimForExclusions ? T3_2 : T3).test(pattern)) { // repetition of common patterns (see above) {**/*.txt,**/*.png}
            parsedPattern = trivia3(pattern, options);
        }
        else if (match = T4.exec(trimForExclusions(pattern, options))) { // common pattern: **/something/else just need endsWith check
            parsedPattern = trivia4and5(match[1].substr(1), pattern, true);
        }
        else if (match = T5.exec(trimForExclusions(pattern, options))) { // common pattern: something/else just need equals check
            parsedPattern = trivia4and5(match[1], pattern, false);
        }
        // Otherwise convert to pattern
        else {
            parsedPattern = toRegExp(pattern);
        }
        // Cache
        CACHE.set(patternKey, parsedPattern);
        return wrapRelativePattern(parsedPattern, arg1);
    }
    function wrapRelativePattern(parsedPattern, arg2) {
        if (typeof arg2 === 'string') {
            return parsedPattern;
        }
        return function (path, basename) {
            if (!paths.isEqualOrParent(path, arg2.base)) {
                return null;
            }
            return parsedPattern(paths.normalize(arg2.pathToRelative(arg2.base, path)), basename);
        };
    }
    function trimForExclusions(pattern, options) {
        return options.trimForExclusions && strings.endsWith(pattern, '/**') ? pattern.substr(0, pattern.length - 2) : pattern; // dropping **, tailing / is dropped later
    }
    // common pattern: **/some.txt just need basename check
    function trivia2(base, originalPattern) {
        var slashBase = "/" + base;
        var backslashBase = "\\" + base;
        var parsedPattern = function (path, basename) {
            if (!path) {
                return null;
            }
            if (basename) {
                return basename === base ? originalPattern : null;
            }
            return path === base || strings.endsWith(path, slashBase) || strings.endsWith(path, backslashBase) ? originalPattern : null;
        };
        var basenames = [base];
        parsedPattern.basenames = basenames;
        parsedPattern.patterns = [originalPattern];
        parsedPattern.allBasenames = basenames;
        return parsedPattern;
    }
    // repetition of common patterns (see above) {**/*.txt,**/*.png}
    function trivia3(pattern, options) {
        var parsedPatterns = aggregateBasenameMatches(pattern.slice(1, -1).split(',')
            .map(function (pattern) { return parsePattern(pattern, options); })
            .filter(function (pattern) { return pattern !== NULL; }), pattern);
        var n = parsedPatterns.length;
        if (!n) {
            return NULL;
        }
        if (n === 1) {
            return parsedPatterns[0];
        }
        var parsedPattern = function (path, basename) {
            for (var i = 0, n_1 = parsedPatterns.length; i < n_1; i++) {
                if (parsedPatterns[i](path, basename)) {
                    return pattern;
                }
            }
            return null;
        };
        var withBasenames = arrays.first(parsedPatterns, function (pattern) { return !!pattern.allBasenames; });
        if (withBasenames) {
            parsedPattern.allBasenames = withBasenames.allBasenames;
        }
        var allPaths = parsedPatterns.reduce(function (all, current) { return current.allPaths ? all.concat(current.allPaths) : all; }, []);
        if (allPaths.length) {
            parsedPattern.allPaths = allPaths;
        }
        return parsedPattern;
    }
    // common patterns: **/something/else just need endsWith check, something/else just needs and equals check
    function trivia4and5(path, pattern, matchPathEnds) {
        var nativePath = paths.nativeSep !== paths.sep ? path.replace(ALL_FORWARD_SLASHES, paths.nativeSep) : path;
        var nativePathEnd = paths.nativeSep + nativePath;
        var parsedPattern = matchPathEnds ? function (path, basename) {
            return path && (path === nativePath || strings.endsWith(path, nativePathEnd)) ? pattern : null;
        } : function (path, basename) {
            return path && path === nativePath ? pattern : null;
        };
        parsedPattern.allPaths = [(matchPathEnds ? '*/' : './') + path];
        return parsedPattern;
    }
    function toRegExp(pattern) {
        try {
            var regExp_1 = new RegExp("^" + parseRegExp(pattern) + "$");
            return function (path, basename) {
                regExp_1.lastIndex = 0; // reset RegExp to its initial state to reuse it!
                return path && regExp_1.test(path) ? pattern : null;
            };
        }
        catch (error) {
            return NULL;
        }
    }
    function match(arg1, path, hasSibling) {
        if (!arg1 || !path) {
            return false;
        }
        return parse(arg1)(path, undefined, hasSibling);
    }
    exports.match = match;
    function parse(arg1, options) {
        if (options === void 0) { options = {}; }
        if (!arg1) {
            return FALSE;
        }
        // Glob with String
        if (typeof arg1 === 'string' || isRelativePattern(arg1)) {
            var parsedPattern_1 = parsePattern(arg1, options);
            if (parsedPattern_1 === NULL) {
                return FALSE;
            }
            var resultPattern = function (path, basename) {
                return !!parsedPattern_1(path, basename);
            };
            if (parsedPattern_1.allBasenames) {
                resultPattern.allBasenames = parsedPattern_1.allBasenames;
            }
            if (parsedPattern_1.allPaths) {
                resultPattern.allPaths = parsedPattern_1.allPaths;
            }
            return resultPattern;
        }
        // Glob with Expression
        return parsedExpression(arg1, options);
    }
    exports.parse = parse;
    function hasSiblingPromiseFn(siblingsFn) {
        if (!siblingsFn) {
            return undefined;
        }
        var siblings;
        return function (name) {
            if (!siblings) {
                siblings = (siblingsFn() || winjs_base_1.TPromise.as([]))
                    .then(function (list) { return list ? listToMap(list) : {}; });
            }
            return siblings.then(function (map) { return !!map[name]; });
        };
    }
    exports.hasSiblingPromiseFn = hasSiblingPromiseFn;
    function hasSiblingFn(siblingsFn) {
        if (!siblingsFn) {
            return undefined;
        }
        var siblings;
        return function (name) {
            if (!siblings) {
                var list = siblingsFn();
                siblings = list ? listToMap(list) : {};
            }
            return !!siblings[name];
        };
    }
    exports.hasSiblingFn = hasSiblingFn;
    function listToMap(list) {
        var map = {};
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var key = list_1[_i];
            map[key] = true;
        }
        return map;
    }
    function isRelativePattern(obj) {
        var rp = obj;
        return rp && typeof rp.base === 'string' && typeof rp.pattern === 'string' && typeof rp.pathToRelative === 'function';
    }
    exports.isRelativePattern = isRelativePattern;
    /**
     * Same as `parse`, but the ParsedExpression is guaranteed to return a Promise
     */
    function parseToAsync(expression, options) {
        var parsedExpression = parse(expression, options);
        return function (path, basename, hasSibling) {
            var result = parsedExpression(path, basename, hasSibling);
            return result instanceof winjs_base_1.TPromise ? result : winjs_base_1.TPromise.as(result);
        };
    }
    exports.parseToAsync = parseToAsync;
    function getBasenameTerms(patternOrExpression) {
        return patternOrExpression.allBasenames || [];
    }
    exports.getBasenameTerms = getBasenameTerms;
    function getPathTerms(patternOrExpression) {
        return patternOrExpression.allPaths || [];
    }
    exports.getPathTerms = getPathTerms;
    function parsedExpression(expression, options) {
        var parsedPatterns = aggregateBasenameMatches(Object.getOwnPropertyNames(expression)
            .map(function (pattern) { return parseExpressionPattern(pattern, expression[pattern], options); })
            .filter(function (pattern) { return pattern !== NULL; }));
        var n = parsedPatterns.length;
        if (!n) {
            return NULL;
        }
        if (!parsedPatterns.some(function (parsedPattern) { return parsedPattern.requiresSiblings; })) {
            if (n === 1) {
                return parsedPatterns[0];
            }
            var resultExpression_1 = function (path, basename) {
                for (var i = 0, n_2 = parsedPatterns.length; i < n_2; i++) {
                    // Pattern matches path
                    var result = parsedPatterns[i](path, basename);
                    if (result) {
                        return result;
                    }
                }
                return null;
            };
            var withBasenames_1 = arrays.first(parsedPatterns, function (pattern) { return !!pattern.allBasenames; });
            if (withBasenames_1) {
                resultExpression_1.allBasenames = withBasenames_1.allBasenames;
            }
            var allPaths_1 = parsedPatterns.reduce(function (all, current) { return current.allPaths ? all.concat(current.allPaths) : all; }, []);
            if (allPaths_1.length) {
                resultExpression_1.allPaths = allPaths_1;
            }
            return resultExpression_1;
        }
        var resultExpression = function (path, basename, hasSibling) {
            var name;
            for (var i = 0, n_3 = parsedPatterns.length; i < n_3; i++) {
                // Pattern matches path
                var parsedPattern = parsedPatterns[i];
                if (parsedPattern.requiresSiblings && hasSibling) {
                    if (!basename) {
                        basename = paths.basename(path);
                    }
                    if (!name) {
                        name = basename.substr(0, basename.length - paths.extname(path).length);
                    }
                }
                var result = parsedPattern(path, basename, name, hasSibling);
                if (result) {
                    return result;
                }
            }
            return null;
        };
        var withBasenames = arrays.first(parsedPatterns, function (pattern) { return !!pattern.allBasenames; });
        if (withBasenames) {
            resultExpression.allBasenames = withBasenames.allBasenames;
        }
        var allPaths = parsedPatterns.reduce(function (all, current) { return current.allPaths ? all.concat(current.allPaths) : all; }, []);
        if (allPaths.length) {
            resultExpression.allPaths = allPaths;
        }
        return resultExpression;
    }
    function parseExpressionPattern(pattern, value, options) {
        if (value === false) {
            return NULL; // pattern is disabled
        }
        var parsedPattern = parsePattern(pattern, options);
        if (parsedPattern === NULL) {
            return NULL;
        }
        // Expression Pattern is <boolean>
        if (typeof value === 'boolean') {
            return parsedPattern;
        }
        // Expression Pattern is <SiblingClause>
        if (value) {
            var when_1 = value.when;
            if (typeof when_1 === 'string') {
                var result = function (path, basename, name, hasSibling) {
                    if (!hasSibling || !parsedPattern(path, basename)) {
                        return null;
                    }
                    var clausePattern = when_1.replace('$(basename)', name);
                    var matched = hasSibling(clausePattern);
                    return winjs_base_1.TPromise.is(matched) ?
                        matched.then(function (m) { return m ? pattern : null; }) :
                        matched ? pattern : null;
                };
                result.requiresSiblings = true;
                return result;
            }
        }
        // Expression is Anything
        return parsedPattern;
    }
    function aggregateBasenameMatches(parsedPatterns, result) {
        var basenamePatterns = parsedPatterns.filter(function (parsedPattern) { return !!parsedPattern.basenames; });
        if (basenamePatterns.length < 2) {
            return parsedPatterns;
        }
        var basenames = basenamePatterns.reduce(function (all, current) { return all.concat(current.basenames); }, []);
        var patterns;
        if (result) {
            patterns = [];
            for (var i = 0, n = basenames.length; i < n; i++) {
                patterns.push(result);
            }
        }
        else {
            patterns = basenamePatterns.reduce(function (all, current) { return all.concat(current.patterns); }, []);
        }
        var aggregate = function (path, basename) {
            if (!path) {
                return null;
            }
            if (!basename) {
                var i = void 0;
                for (i = path.length; i > 0; i--) {
                    var ch = path.charCodeAt(i - 1);
                    if (ch === 47 /* Slash */ || ch === 92 /* Backslash */) {
                        break;
                    }
                }
                basename = path.substr(i);
            }
            var index = basenames.indexOf(basename);
            return index !== -1 ? patterns[index] : null;
        };
        aggregate.basenames = basenames;
        aggregate.patterns = patterns;
        aggregate.allBasenames = basenames;
        var aggregatedPatterns = parsedPatterns.filter(function (parsedPattern) { return !parsedPattern.basenames; });
        aggregatedPatterns.push(aggregate);
        return aggregatedPatterns;
    }
});

define(__m[90/*vs/base/common/mime*/], __M([0/*require*/,1/*exports*/,10/*vs/base/common/paths*/,5/*vs/base/common/strings*/,87/*vs/base/common/glob*/]), function (require, exports, paths, strings, glob_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MIME_TEXT = 'text/plain';
    exports.MIME_BINARY = 'application/octet-stream';
    exports.MIME_UNKNOWN = 'application/unknown';
    var registeredAssociations = [];
    var nonUserRegisteredAssociations = [];
    var userRegisteredAssociations = [];
    /**
     * Associate a text mime to the registry.
     */
    function registerTextMime(association, warnOnOverwrite) {
        if (warnOnOverwrite === void 0) { warnOnOverwrite = false; }
        // Register
        var associationItem = toTextMimeAssociationItem(association);
        registeredAssociations.push(associationItem);
        if (!associationItem.userConfigured) {
            nonUserRegisteredAssociations.push(associationItem);
        }
        else {
            userRegisteredAssociations.push(associationItem);
        }
        // Check for conflicts unless this is a user configured association
        if (warnOnOverwrite && !associationItem.userConfigured) {
            registeredAssociations.forEach(function (a) {
                if (a.mime === associationItem.mime || a.userConfigured) {
                    return; // same mime or userConfigured is ok
                }
                if (associationItem.extension && a.extension === associationItem.extension) {
                    console.warn("Overwriting extension <<" + associationItem.extension + ">> to now point to mime <<" + associationItem.mime + ">>");
                }
                if (associationItem.filename && a.filename === associationItem.filename) {
                    console.warn("Overwriting filename <<" + associationItem.filename + ">> to now point to mime <<" + associationItem.mime + ">>");
                }
                if (associationItem.filepattern && a.filepattern === associationItem.filepattern) {
                    console.warn("Overwriting filepattern <<" + associationItem.filepattern + ">> to now point to mime <<" + associationItem.mime + ">>");
                }
                if (associationItem.firstline && a.firstline === associationItem.firstline) {
                    console.warn("Overwriting firstline <<" + associationItem.firstline + ">> to now point to mime <<" + associationItem.mime + ">>");
                }
            });
        }
    }
    exports.registerTextMime = registerTextMime;
    function toTextMimeAssociationItem(association) {
        return {
            id: association.id,
            mime: association.mime,
            filename: association.filename,
            extension: association.extension,
            filepattern: association.filepattern,
            firstline: association.firstline,
            userConfigured: association.userConfigured,
            filenameLowercase: association.filename ? association.filename.toLowerCase() : void 0,
            extensionLowercase: association.extension ? association.extension.toLowerCase() : void 0,
            filepatternLowercase: association.filepattern ? association.filepattern.toLowerCase() : void 0,
            filepatternOnPath: association.filepattern ? association.filepattern.indexOf(paths.sep) >= 0 : false
        };
    }
    /**
     * Clear text mimes from the registry.
     */
    function clearTextMimes(onlyUserConfigured) {
        if (!onlyUserConfigured) {
            registeredAssociations = [];
            nonUserRegisteredAssociations = [];
            userRegisteredAssociations = [];
        }
        else {
            registeredAssociations = registeredAssociations.filter(function (a) { return !a.userConfigured; });
            userRegisteredAssociations = [];
        }
    }
    exports.clearTextMimes = clearTextMimes;
    /**
     * Given a file, return the best matching mime type for it
     */
    function guessMimeTypes(path, firstLine) {
        if (!path) {
            return [exports.MIME_UNKNOWN];
        }
        path = path.toLowerCase();
        var filename = paths.basename(path);
        // 1.) User configured mappings have highest priority
        var configuredMime = guessMimeTypeByPath(path, filename, userRegisteredAssociations);
        if (configuredMime) {
            return [configuredMime, exports.MIME_TEXT];
        }
        // 2.) Registered mappings have middle priority
        var registeredMime = guessMimeTypeByPath(path, filename, nonUserRegisteredAssociations);
        if (registeredMime) {
            return [registeredMime, exports.MIME_TEXT];
        }
        // 3.) Firstline has lowest priority
        if (firstLine) {
            var firstlineMime = guessMimeTypeByFirstline(firstLine);
            if (firstlineMime) {
                return [firstlineMime, exports.MIME_TEXT];
            }
        }
        return [exports.MIME_UNKNOWN];
    }
    exports.guessMimeTypes = guessMimeTypes;
    function guessMimeTypeByPath(path, filename, associations) {
        var filenameMatch;
        var patternMatch;
        var extensionMatch;
        // We want to prioritize associations based on the order they are registered so that the last registered
        // association wins over all other. This is for https://github.com/Microsoft/vscode/issues/20074
        for (var i = associations.length - 1; i >= 0; i--) {
            var association = associations[i];
            // First exact name match
            if (filename === association.filenameLowercase) {
                filenameMatch = association;
                break; // take it!
            }
            // Longest pattern match
            if (association.filepattern) {
                if (!patternMatch || association.filepattern.length > patternMatch.filepattern.length) {
                    var target = association.filepatternOnPath ? path : filename; // match on full path if pattern contains path separator
                    if (glob_1.match(association.filepatternLowercase, target)) {
                        patternMatch = association;
                    }
                }
            }
            // Longest extension match
            if (association.extension) {
                if (!extensionMatch || association.extension.length > extensionMatch.extension.length) {
                    if (strings.endsWith(filename, association.extensionLowercase)) {
                        extensionMatch = association;
                    }
                }
            }
        }
        // 1.) Exact name match has second highest prio
        if (filenameMatch) {
            return filenameMatch.mime;
        }
        // 2.) Match on pattern
        if (patternMatch) {
            return patternMatch.mime;
        }
        // 3.) Match on extension comes next
        if (extensionMatch) {
            return extensionMatch.mime;
        }
        return null;
    }
    function guessMimeTypeByFirstline(firstLine) {
        if (strings.startsWithUTF8BOM(firstLine)) {
            firstLine = firstLine.substr(1);
        }
        if (firstLine.length > 0) {
            for (var i = 0; i < registeredAssociations.length; ++i) {
                var association = registeredAssociations[i];
                if (!association.firstline) {
                    continue;
                }
                var matches = firstLine.match(association.firstline);
                if (matches && matches.length > 0) {
                    return association.mime;
                }
            }
        }
        return null;
    }
    function isUnspecific(mime) {
        if (!mime) {
            return true;
        }
        if (typeof mime === 'string') {
            return mime === exports.MIME_BINARY || mime === exports.MIME_TEXT || mime === exports.MIME_UNKNOWN;
        }
        return mime.length === 1 && isUnspecific(mime[0]);
    }
    exports.isUnspecific = isUnspecific;
    function suggestFilename(langId, prefix) {
        for (var i = 0; i < registeredAssociations.length; i++) {
            var association = registeredAssociations[i];
            if (association.userConfigured) {
                continue; // only support registered ones
            }
            if (association.id === langId && association.extension) {
                return prefix + association.extension;
            }
        }
        return prefix; // without any known extension, just return the prefix
    }
    exports.suggestFilename = suggestFilename;
    // Known media mimes that we can handle
    var mapExtToMediaMimes = {
        '.bmp': 'image/bmp',
        '.gif': 'image/gif',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpg',
        '.jpe': 'image/jpg',
        '.png': 'image/png',
        '.tiff': 'image/tiff',
        '.tif': 'image/tiff',
        '.ico': 'image/x-icon',
        '.tga': 'image/x-tga',
        '.psd': 'image/vnd.adobe.photoshop',
        '.webp': 'image/webp',
        '.mid': 'audio/midi',
        '.midi': 'audio/midi',
        '.mp4a': 'audio/mp4',
        '.mpga': 'audio/mpeg',
        '.mp2': 'audio/mpeg',
        '.mp2a': 'audio/mpeg',
        '.mp3': 'audio/mpeg',
        '.m2a': 'audio/mpeg',
        '.m3a': 'audio/mpeg',
        '.oga': 'audio/ogg',
        '.ogg': 'audio/ogg',
        '.spx': 'audio/ogg',
        '.aac': 'audio/x-aac',
        '.wav': 'audio/x-wav',
        '.wma': 'audio/x-ms-wma',
        '.mp4': 'video/mp4',
        '.mp4v': 'video/mp4',
        '.mpg4': 'video/mp4',
        '.mpeg': 'video/mpeg',
        '.mpg': 'video/mpeg',
        '.mpe': 'video/mpeg',
        '.m1v': 'video/mpeg',
        '.m2v': 'video/mpeg',
        '.ogv': 'video/ogg',
        '.qt': 'video/quicktime',
        '.mov': 'video/quicktime',
        '.webm': 'video/webm',
        '.mkv': 'video/x-matroska',
        '.mk3d': 'video/x-matroska',
        '.mks': 'video/x-matroska',
        '.wmv': 'video/x-ms-wmv',
        '.flv': 'video/x-flv',
        '.avi': 'video/x-msvideo',
        '.movie': 'video/x-sgi-movie'
    };
    function getMediaMime(path) {
        var ext = paths.extname(path);
        return mapExtToMediaMimes[ext.toLowerCase()];
    }
    exports.getMediaMime = getMediaMime;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[92/*vs/base/node/flow*/], __M([0/*require*/,1/*exports*/,100/*assert*/]), function (require, exports, assert) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Executes the given function (fn) over the given array of items (list) in parallel and returns the resulting errors and results as
     * array to the callback (callback). The resulting errors and results are evaluated by calling the provided callback function.
     */
    function parallel(list, fn, callback) {
        var results = new Array(list.length);
        var errors = new Array(list.length);
        var didErrorOccur = false;
        var doneCount = 0;
        if (list.length === 0) {
            return callback(null, []);
        }
        list.forEach(function (item, index) {
            fn(item, function (error, result) {
                if (error) {
                    didErrorOccur = true;
                    results[index] = null;
                    errors[index] = error;
                }
                else {
                    results[index] = result;
                    errors[index] = null;
                }
                if (++doneCount === list.length) {
                    return callback(didErrorOccur ? errors : null, results);
                }
            });
        });
    }
    exports.parallel = parallel;
    function loop(param, fn, callback) {
        // Assert
        assert.ok(param, 'Missing first parameter');
        assert.ok(typeof (fn) === 'function', 'Second parameter must be a function that is called for each element');
        assert.ok(typeof (callback) === 'function', 'Third parameter must be a function that is called on error and success');
        // Param is function, execute to retrieve array
        if (typeof (param) === 'function') {
            try {
                param(function (error, result) {
                    if (error) {
                        callback(error, null);
                    }
                    else {
                        loop(result, fn, callback);
                    }
                });
            }
            catch (error) {
                callback(error, null);
            }
        }
        // Expect the param to be an array and loop over it
        else {
            var results_1 = [];
            var looper_1 = function (i) {
                // Still work to do
                if (i < param.length) {
                    // Execute function on array element
                    try {
                        fn(param[i], function (error, result) {
                            // A method might only send a boolean value as return value (e.g. fs.exists), support this case gracefully
                            if (error === true || error === false) {
                                result = error;
                                error = null;
                            }
                            // Quit looping on error
                            if (error) {
                                callback(error, null);
                            }
                            // Otherwise push result on stack and continue looping
                            else {
                                if (result) { //Could be that provided function is not returning a result
                                    results_1.push(result);
                                }
                                process.nextTick(function () {
                                    looper_1(i + 1);
                                });
                            }
                        }, i, param.length);
                    }
                    catch (error) {
                        callback(error, null);
                    }
                }
                // Done looping, pass back results too callback function
                else {
                    callback(null, results_1);
                }
            };
            // Start looping with first element in array
            looper_1(0);
        }
    }
    exports.loop = loop;
    function Sequence(sequences) {
        // Assert
        assert.ok(sequences.length > 1, 'Need at least one error handler and one function to process sequence');
        sequences.forEach(function (sequence) {
            assert.ok(typeof (sequence) === 'function');
        });
        // Execute in Loop
        var errorHandler = sequences.splice(0, 1)[0]; //Remove error handler
        var sequenceResult = null;
        loop(sequences, function (sequence, clb) {
            var sequenceFunction = function (error, result) {
                // A method might only send a boolean value as return value (e.g. fs.exists), support this case gracefully
                if (error === true || error === false) {
                    result = error;
                    error = null;
                }
                // Handle Error and Result
                if (error) {
                    clb(error, null);
                }
                else {
                    sequenceResult = result; //Remember result of sequence
                    clb(null, null); //Don't pass on result to Looper as we are not aggregating it
                }
            };
            // We call the sequence function setting "this" to be the callback we define here
            // and we pass in the "sequenceResult" as first argument. Doing all this avoids having
            // to pass in a callback to the sequence because the callback is already "this".
            try {
                sequence.call(sequenceFunction, sequenceResult);
            }
            catch (error) {
                clb(error, null);
            }
        }, function (error, result) {
            if (error) {
                errorHandler(error);
            }
        });
    }
    function sequence(sequences) {
        Sequence((Array.isArray(sequences)) ? sequences : Array.prototype.slice.call(arguments));
    }
    exports.sequence = sequence;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[41/*vs/base/node/paths*/], __M([0/*require*/,1/*exports*/,8/*vs/base/common/uri*/]), function (require, exports, uri_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var pathsPath = uri_1.default.parse(require.toUrl('paths')).fsPath;
    var paths = require.__$__nodeRequire(pathsPath);
    exports.getAppDataPath = paths.getAppDataPath;
    exports.getDefaultUserDataPath = paths.getDefaultUserDataPath;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[42/*vs/base/node/stream*/], __M([0/*require*/,1/*exports*/,30/*fs*/,3/*vs/base/common/winjs.base*/]), function (require, exports, fs, winjs_base_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Reads totalBytes from the provided file.
     */
    function readExactlyByFile(file, totalBytes) {
        return new winjs_base_1.TPromise(function (complete, error) {
            fs.open(file, 'r', null, function (err, fd) {
                if (err) {
                    return error(err);
                }
                function end(err, resultBuffer, bytesRead) {
                    fs.close(fd, function (closeError) {
                        if (closeError) {
                            return error(closeError);
                        }
                        if (err && err.code === 'EISDIR') {
                            return error(err); // we want to bubble this error up (file is actually a folder)
                        }
                        return complete({ buffer: resultBuffer, bytesRead: bytesRead });
                    });
                }
                var buffer = Buffer.allocUnsafe(totalBytes);
                var offset = 0;
                function readChunk() {
                    fs.read(fd, buffer, offset, totalBytes - offset, null, function (err, bytesRead) {
                        if (err) {
                            return end(err, null, 0);
                        }
                        if (bytesRead === 0) {
                            return end(null, buffer, offset);
                        }
                        offset += bytesRead;
                        if (offset === totalBytes) {
                            return end(null, buffer, offset);
                        }
                        return readChunk();
                    });
                }
                readChunk();
            });
        });
    }
    exports.readExactlyByFile = readExactlyByFile;
    /**
     * Reads a file until a matching string is found.
     *
     * @param file The file to read.
     * @param matchingString The string to search for.
     * @param chunkBytes The number of bytes to read each iteration.
     * @param maximumBytesToRead The maximum number of bytes to read before giving up.
     * @param callback The finished callback.
     */
    function readToMatchingString(file, matchingString, chunkBytes, maximumBytesToRead) {
        return new winjs_base_1.TPromise(function (complete, error) {
            return fs.open(file, 'r', null, function (err, fd) {
                if (err) {
                    return error(err);
                }
                function end(err, result) {
                    fs.close(fd, function (closeError) {
                        if (closeError) {
                            return error(closeError);
                        }
                        if (err && err.code === 'EISDIR') {
                            return error(err); // we want to bubble this error up (file is actually a folder)
                        }
                        return complete(result);
                    });
                }
                var buffer = Buffer.allocUnsafe(maximumBytesToRead);
                var offset = 0;
                function readChunk() {
                    fs.read(fd, buffer, offset, chunkBytes, null, function (err, bytesRead) {
                        if (err) {
                            return end(err, null);
                        }
                        if (bytesRead === 0) {
                            return end(null, null);
                        }
                        offset += bytesRead;
                        var newLineIndex = buffer.indexOf(matchingString);
                        if (newLineIndex >= 0) {
                            return end(null, buffer.toString('utf8').substr(0, newLineIndex));
                        }
                        if (offset >= maximumBytesToRead) {
                            return end(new Error("Could not find " + matchingString + " in first " + maximumBytesToRead + " bytes of " + file), null);
                        }
                        return readChunk();
                    });
                }
                readChunk();
            });
        });
    }
    exports.readToMatchingString = readToMatchingString;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/










define(__m[44/*vs/base/node/encoding*/], __M([0/*require*/,1/*exports*/,42/*vs/base/node/stream*/,99/*iconv-lite*/,3/*vs/base/common/winjs.base*/,4/*vs/base/common/platform*/,98/*child_process*/,97/*stream*/,12/*vs/base/common/async*/]), function (require, exports, stream, iconv, winjs_base_1, platform_1, child_process_1, stream_1, async_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UTF8 = 'utf8';
    exports.UTF8_with_bom = 'utf8bom';
    exports.UTF16be = 'utf16be';
    exports.UTF16le = 'utf16le';
    function toDecodeStream(readable, options) {
        if (!options.minBytesRequiredForDetection) {
            options.minBytesRequiredForDetection = options.guessEncoding ? AUTO_GUESS_BUFFER_MAX_LEN : NO_GUESS_BUFFER_MAX_LEN;
        }
        if (!options.overwriteEncoding) {
            options.overwriteEncoding = function (detected) { return detected || exports.UTF8; };
        }
        return new winjs_base_1.TPromise(function (resolve, reject) {
            readable.pipe(new /** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1(opts) {
                    var _this = _super.call(this, opts) || this;
                    _this._buffer = [];
                    _this._bytesBuffered = 0;
                    _this.once('finish', function () { return _this._finish(); });
                    return _this;
                }
                class_1.prototype._write = function (chunk, encoding, callback) {
                    if (!Buffer.isBuffer(chunk)) {
                        callback(new Error('data must be a buffer'));
                    }
                    if (this._decodeStream) {
                        // just a forwarder now
                        this._decodeStream.write(chunk, callback);
                        return;
                    }
                    this._buffer.push(chunk);
                    this._bytesBuffered += chunk.length;
                    if (this._decodeStreamConstruction) {
                        // waiting for the decoder to be ready
                        this._decodeStreamConstruction.then(function (_) { return callback(); }, function (err) { return callback(err); });
                    }
                    else if (this._bytesBuffered >= options.minBytesRequiredForDetection) {
                        // buffered enough data, create stream and forward data
                        this._startDecodeStream(callback);
                    }
                    else {
                        // only buffering
                        callback();
                    }
                };
                class_1.prototype._startDecodeStream = function (callback) {
                    var _this = this;
                    this._decodeStreamConstruction = winjs_base_1.TPromise.as(detectEncodingFromBuffer({
                        buffer: Buffer.concat(this._buffer), bytesRead: this._bytesBuffered
                    }, options.guessEncoding)).then(function (detected) {
                        detected.encoding = options.overwriteEncoding(detected.encoding);
                        _this._decodeStream = decodeStream(detected.encoding);
                        for (var _i = 0, _a = _this._buffer; _i < _a.length; _i++) {
                            var buffer = _a[_i];
                            _this._decodeStream.write(buffer);
                        }
                        callback();
                        resolve({ detected: detected, stream: _this._decodeStream });
                    }, function (err) {
                        _this.emit('error', err);
                        callback(err);
                    });
                };
                class_1.prototype._finish = function () {
                    var _this = this;
                    if (this._decodeStream) {
                        // normal finish
                        this._decodeStream.end();
                    }
                    else {
                        // we were still waiting for data...
                        this._startDecodeStream(function () { return _this._decodeStream.end(); });
                    }
                };
                return class_1;
            }(stream_1.Writable)));
        });
    }
    exports.toDecodeStream = toDecodeStream;
    function bomLength(encoding) {
        switch (encoding) {
            case exports.UTF8:
                return 3;
            case exports.UTF16be:
            case exports.UTF16le:
                return 2;
        }
        return 0;
    }
    exports.bomLength = bomLength;
    function decode(buffer, encoding) {
        return iconv.decode(buffer, toNodeEncoding(encoding));
    }
    exports.decode = decode;
    function encode(content, encoding, options) {
        return iconv.encode(content, toNodeEncoding(encoding), options);
    }
    exports.encode = encode;
    function encodingExists(encoding) {
        return iconv.encodingExists(toNodeEncoding(encoding));
    }
    exports.encodingExists = encodingExists;
    function decodeStream(encoding) {
        return iconv.decodeStream(toNodeEncoding(encoding));
    }
    exports.decodeStream = decodeStream;
    function encodeStream(encoding, options) {
        return iconv.encodeStream(toNodeEncoding(encoding), options);
    }
    exports.encodeStream = encodeStream;
    function toNodeEncoding(enc) {
        if (enc === exports.UTF8_with_bom) {
            return exports.UTF8; // iconv does not distinguish UTF 8 with or without BOM, so we need to help it
        }
        return enc;
    }
    function detectEncodingByBOMFromBuffer(buffer, bytesRead) {
        if (!buffer || bytesRead < 2) {
            return null;
        }
        var b0 = buffer.readUInt8(0);
        var b1 = buffer.readUInt8(1);
        // UTF-16 BE
        if (b0 === 0xFE && b1 === 0xFF) {
            return exports.UTF16be;
        }
        // UTF-16 LE
        if (b0 === 0xFF && b1 === 0xFE) {
            return exports.UTF16le;
        }
        if (bytesRead < 3) {
            return null;
        }
        var b2 = buffer.readUInt8(2);
        // UTF-8
        if (b0 === 0xEF && b1 === 0xBB && b2 === 0xBF) {
            return exports.UTF8;
        }
        return null;
    }
    exports.detectEncodingByBOMFromBuffer = detectEncodingByBOMFromBuffer;
    /**
     * Detects the Byte Order Mark in a given file.
     * If no BOM is detected, null will be passed to callback.
     */
    function detectEncodingByBOM(file) {
        return stream.readExactlyByFile(file, 3).then(function (_a) {
            var buffer = _a.buffer, bytesRead = _a.bytesRead;
            return detectEncodingByBOMFromBuffer(buffer, bytesRead);
        });
    }
    exports.detectEncodingByBOM = detectEncodingByBOM;
    var MINIMUM_THRESHOLD = 0.2;
    var IGNORE_ENCODINGS = ['ascii', 'utf-8', 'utf-16', 'utf-32'];
    /**
     * Guesses the encoding from buffer.
     */
    function guessEncodingByBuffer(buffer) {
        return async_1.toWinJsPromise(new Promise(function (resolve_1, reject_1) { require(['jschardet'], resolve_1, reject_1); })).then(function (jschardet) {
            jschardet.Constants.MINIMUM_THRESHOLD = MINIMUM_THRESHOLD;
            var guessed = jschardet.detect(buffer);
            if (!guessed || !guessed.encoding) {
                return null;
            }
            var enc = guessed.encoding.toLowerCase();
            // Ignore encodings that cannot guess correctly
            // (http://chardet.readthedocs.io/en/latest/supported-encodings.html)
            if (0 <= IGNORE_ENCODINGS.indexOf(enc)) {
                return null;
            }
            return toIconvLiteEncoding(guessed.encoding);
        });
    }
    exports.guessEncodingByBuffer = guessEncodingByBuffer;
    var JSCHARDET_TO_ICONV_ENCODINGS = {
        'ibm866': 'cp866',
        'big5': 'cp950'
    };
    function toIconvLiteEncoding(encodingName) {
        var normalizedEncodingName = encodingName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        var mapped = JSCHARDET_TO_ICONV_ENCODINGS[normalizedEncodingName];
        return mapped || normalizedEncodingName;
    }
    /**
     * The encodings that are allowed in a settings file don't match the canonical encoding labels specified by WHATWG.
     * See https://encoding.spec.whatwg.org/#names-and-labels
     * Iconv-lite strips all non-alphanumeric characters, but ripgrep doesn't. For backcompat, allow these labels.
     */
    function toCanonicalName(enc) {
        switch (enc) {
            case 'shiftjis':
                return 'shift-jis';
            case 'utf16le':
                return 'utf-16le';
            case 'utf16be':
                return 'utf-16be';
            case 'big5hkscs':
                return 'big5-hkscs';
            case 'eucjp':
                return 'euc-jp';
            case 'euckr':
                return 'euc-kr';
            case 'koi8r':
                return 'koi8-r';
            case 'koi8u':
                return 'koi8-u';
            case 'macroman':
                return 'x-mac-roman';
            case 'utf8bom':
                return 'utf8';
            default:
                var m = enc.match(/windows(\d+)/);
                if (m) {
                    return 'windows-' + m[1];
                }
                return enc;
        }
    }
    exports.toCanonicalName = toCanonicalName;
    var ZERO_BYTE_DETECTION_BUFFER_MAX_LEN = 512; // number of bytes to look at to decide about a file being binary or not
    var NO_GUESS_BUFFER_MAX_LEN = 512; // when not auto guessing the encoding, small number of bytes are enough
    var AUTO_GUESS_BUFFER_MAX_LEN = 512 * 8; // with auto guessing we want a lot more content to be read for guessing
    function detectEncodingFromBuffer(_a, autoGuessEncoding) {
        var buffer = _a.buffer, bytesRead = _a.bytesRead;
        // Always first check for BOM to find out about encoding
        var encoding = detectEncodingByBOMFromBuffer(buffer, bytesRead);
        // Detect 0 bytes to see if file is binary or UTF-16 LE/BE
        // unless we already know that this file has a UTF-16 encoding
        var seemsBinary = false;
        if (encoding !== exports.UTF16be && encoding !== exports.UTF16le) {
            var couldBeUTF16LE = true; // e.g. 0xAA 0x00
            var couldBeUTF16BE = true; // e.g. 0x00 0xAA
            var containsZeroByte = false;
            // This is a simplified guess to detect UTF-16 BE or LE by just checking if
            // the first 512 bytes have the 0-byte at a specific location. For UTF-16 LE
            // this would be the odd byte index and for UTF-16 BE the even one.
            // Note: this can produce false positives (a binary file that uses a 2-byte
            // encoding of the same format as UTF-16) and false negatives (a UTF-16 file
            // that is using 4 bytes to encode a character).
            for (var i = 0; i < bytesRead && i < ZERO_BYTE_DETECTION_BUFFER_MAX_LEN; i++) {
                var isEndian = (i % 2 === 1); // assume 2-byte sequences typical for UTF-16
                var isZeroByte = (buffer.readInt8(i) === 0);
                if (isZeroByte) {
                    containsZeroByte = true;
                }
                // UTF-16 LE: expect e.g. 0xAA 0x00
                if (couldBeUTF16LE && (isEndian && !isZeroByte || !isEndian && isZeroByte)) {
                    couldBeUTF16LE = false;
                }
                // UTF-16 BE: expect e.g. 0x00 0xAA
                if (couldBeUTF16BE && (isEndian && isZeroByte || !isEndian && !isZeroByte)) {
                    couldBeUTF16BE = false;
                }
                // Return if this is neither UTF16-LE nor UTF16-BE and thus treat as binary
                if (isZeroByte && !couldBeUTF16LE && !couldBeUTF16BE) {
                    break;
                }
            }
            // Handle case of 0-byte included
            if (containsZeroByte) {
                if (couldBeUTF16LE) {
                    encoding = exports.UTF16le;
                }
                else if (couldBeUTF16BE) {
                    encoding = exports.UTF16be;
                }
                else {
                    seemsBinary = true;
                }
            }
        }
        // Auto guess encoding if configured
        if (autoGuessEncoding && !seemsBinary && !encoding) {
            return guessEncodingByBuffer(buffer.slice(0, bytesRead)).then(function (encoding) {
                return {
                    seemsBinary: false,
                    encoding: encoding
                };
            });
        }
        return { seemsBinary: seemsBinary, encoding: encoding };
    }
    exports.detectEncodingFromBuffer = detectEncodingFromBuffer;
    // https://ss64.com/nt/chcp.html
    var windowsTerminalEncodings = {
        '437': 'cp437',
        '850': 'cp850',
        '852': 'cp852',
        '855': 'cp855',
        '857': 'cp857',
        '860': 'cp860',
        '861': 'cp861',
        '863': 'cp863',
        '865': 'cp865',
        '866': 'cp866',
        '869': 'cp869',
        '936': 'cp936',
        '1252': 'cp1252' // West European Latin
    };
    function resolveTerminalEncoding(verbose) {
        var rawEncodingPromise;
        // Support a global environment variable to win over other mechanics
        var cliEncodingEnv = process.env['VSCODE_CLI_ENCODING'];
        if (cliEncodingEnv) {
            if (verbose) {
                console.log("Found VSCODE_CLI_ENCODING variable: " + cliEncodingEnv);
            }
            rawEncodingPromise = winjs_base_1.TPromise.as(cliEncodingEnv);
        }
        // Linux/Mac: use "locale charmap" command
        else if (platform_1.isLinux || platform_1.isMacintosh) {
            rawEncodingPromise = new winjs_base_1.TPromise(function (c) {
                if (verbose) {
                    console.log('Running "locale charmap" to detect terminal encoding...');
                }
                child_process_1.exec('locale charmap', function (err, stdout, stderr) { return c(stdout); });
            });
        }
        // Windows: educated guess
        else {
            rawEncodingPromise = new winjs_base_1.TPromise(function (c) {
                if (verbose) {
                    console.log('Running "chcp" to detect terminal encoding...');
                }
                child_process_1.exec('chcp', function (err, stdout, stderr) {
                    if (stdout) {
                        var windowsTerminalEncodingKeys = Object.keys(windowsTerminalEncodings);
                        for (var i = 0; i < windowsTerminalEncodingKeys.length; i++) {
                            var key = windowsTerminalEncodingKeys[i];
                            if (stdout.indexOf(key) >= 0) {
                                return c(windowsTerminalEncodings[key]);
                            }
                        }
                    }
                    return c(void 0);
                });
            });
        }
        return rawEncodingPromise.then(function (rawEncoding) {
            if (verbose) {
                console.log("Detected raw terminal encoding: " + rawEncoding);
            }
            if (!rawEncoding || rawEncoding.toLowerCase() === 'utf-8' || rawEncoding.toLowerCase() === exports.UTF8) {
                return exports.UTF8;
            }
            var iconvEncoding = toIconvLiteEncoding(rawEncoding);
            if (iconv.encodingExists(iconvEncoding)) {
                return iconvEncoding;
            }
            if (verbose) {
                console.log('Unsupported terminal encoding, falling back to UTF-8.');
            }
            return exports.UTF8;
        });
    }
    exports.resolveTerminalEncoding = resolveTerminalEncoding;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[48/*vs/base/node/extfs*/], __M([0/*require*/,1/*exports*/,30/*fs*/,11/*path*/,12/*vs/base/common/async*/,80/*vs/base/common/normalization*/,4/*vs/base/common/platform*/,5/*vs/base/common/strings*/,29/*vs/base/common/uuid*/,3/*vs/base/common/winjs.base*/,44/*vs/base/node/encoding*/,92/*vs/base/node/flow*/]), function (require, exports, fs, paths, async_1, normalization_1, platform, strings, uuid, winjs_base_1, encoding_1, flow) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var loop = flow.loop;
    function readdirSync(path) {
        // Mac: uses NFD unicode form on disk, but we want NFC
        // See also https://github.com/nodejs/node/issues/2165
        if (platform.isMacintosh) {
            return fs.readdirSync(path).map(function (c) { return normalization_1.normalizeNFC(c); });
        }
        return fs.readdirSync(path);
    }
    exports.readdirSync = readdirSync;
    function readdir(path, callback) {
        // Mac: uses NFD unicode form on disk, but we want NFC
        // See also https://github.com/nodejs/node/issues/2165
        if (platform.isMacintosh) {
            return fs.readdir(path, function (error, children) {
                if (error) {
                    return callback(error, null);
                }
                return callback(null, children.map(function (c) { return normalization_1.normalizeNFC(c); }));
            });
        }
        return fs.readdir(path, callback);
    }
    exports.readdir = readdir;
    function statLink(path, callback) {
        fs.lstat(path, function (error, lstat) {
            if (error || lstat.isSymbolicLink()) {
                fs.stat(path, function (error, stat) {
                    if (error) {
                        return callback(error, null);
                    }
                    callback(null, { stat: stat, isSymbolicLink: lstat && lstat.isSymbolicLink() });
                });
            }
            else {
                callback(null, { stat: lstat, isSymbolicLink: false });
            }
        });
    }
    exports.statLink = statLink;
    function copy(source, target, callback, copiedSources) {
        if (!copiedSources) {
            copiedSources = Object.create(null);
        }
        fs.stat(source, function (error, stat) {
            if (error) {
                return callback(error);
            }
            if (!stat.isDirectory()) {
                return doCopyFile(source, target, stat.mode & 511, callback);
            }
            if (copiedSources[source]) {
                return callback(null); // escape when there are cycles (can happen with symlinks)
            }
            copiedSources[source] = true; // remember as copied
            var proceed = function () {
                readdir(source, function (err, files) {
                    loop(files, function (file, clb) {
                        copy(paths.join(source, file), paths.join(target, file), function (error) { return clb(error, void 0); }, copiedSources);
                    }, callback);
                });
            };
            mkdirp(target, stat.mode & 511).done(proceed, proceed);
        });
    }
    exports.copy = copy;
    function doCopyFile(source, target, mode, callback) {
        var reader = fs.createReadStream(source);
        var writer = fs.createWriteStream(target, { mode: mode });
        var finished = false;
        var finish = function (error) {
            if (!finished) {
                finished = true;
                // in error cases, pass to callback
                if (error) {
                    callback(error);
                }
                // we need to explicitly chmod because of https://github.com/nodejs/node/issues/1104
                else {
                    fs.chmod(target, mode, callback);
                }
            }
        };
        // handle errors properly
        reader.once('error', function (error) { return finish(error); });
        writer.once('error', function (error) { return finish(error); });
        // we are done (underlying fd has been closed)
        writer.once('close', function () { return finish(); });
        // start piping
        reader.pipe(writer);
    }
    function mkdirp(path, mode) {
        var mkdir = function () {
            return async_1.nfcall(fs.mkdir, path, mode).then(null, function (mkdirErr) {
                // ENOENT: a parent folder does not exist yet
                if (mkdirErr.code === 'ENOENT') {
                    return winjs_base_1.TPromise.wrapError(mkdirErr);
                }
                // Any other error: check if folder exists and
                // return normally in that case if its a folder
                return async_1.nfcall(fs.stat, path).then(function (stat) {
                    if (!stat.isDirectory()) {
                        return winjs_base_1.TPromise.wrapError(new Error("'" + path + "' exists and is not a directory."));
                    }
                    return null;
                }, function (statErr) {
                    return winjs_base_1.TPromise.wrapError(mkdirErr); // bubble up original mkdir error
                });
            });
        };
        // stop at root
        if (path === paths.dirname(path)) {
            return winjs_base_1.TPromise.as(true);
        }
        // recursively mkdir
        return mkdir().then(null, function (err) {
            // ENOENT: a parent folder does not exist yet, continue
            // to create the parent folder and then try again.
            if (err.code === 'ENOENT') {
                return mkdirp(paths.dirname(path), mode).then(mkdir);
            }
            // Any other error
            return winjs_base_1.TPromise.wrapError(err);
        });
    }
    exports.mkdirp = mkdirp;
    // Deletes the given path by first moving it out of the workspace. This has two benefits. For one, the operation can return fast because
    // after the rename, the contents are out of the workspace although not yet deleted. The greater benefit however is that this operation
    // will fail in case any file is used by another process. fs.unlink() in node will not bail if a file unlinked is used by another process.
    // However, the consequences are bad as outlined in all the related bugs from https://github.com/joyent/node/issues/7164
    function del(path, tmpFolder, callback, done) {
        fs.exists(path, function (exists) {
            if (!exists) {
                return callback(null);
            }
            fs.stat(path, function (err, stat) {
                if (err || !stat) {
                    return callback(err);
                }
                // Special windows workaround: A file or folder that ends with a "." cannot be moved to another place
                // because it is not a valid file name. In this case, we really have to do the deletion without prior move.
                if (path[path.length - 1] === '.' || strings.endsWith(path, './') || strings.endsWith(path, '.\\')) {
                    return rmRecursive(path, callback);
                }
                var pathInTemp = paths.join(tmpFolder, uuid.generateUuid());
                fs.rename(path, pathInTemp, function (error) {
                    if (error) {
                        return rmRecursive(path, callback); // if rename fails, delete without tmp dir
                    }
                    // Return early since the move succeeded
                    callback(null);
                    // do the heavy deletion outside the callers callback
                    rmRecursive(pathInTemp, function (error) {
                        if (error) {
                            console.error(error);
                        }
                        if (done) {
                            done(error);
                        }
                    });
                });
            });
        });
    }
    exports.del = del;
    function rmRecursive(path, callback) {
        if (path === '\\' || path === '/') {
            return callback(new Error('Will not delete root!'));
        }
        fs.exists(path, function (exists) {
            if (!exists) {
                callback(null);
            }
            else {
                fs.lstat(path, function (err, stat) {
                    if (err || !stat) {
                        callback(err);
                    }
                    else if (!stat.isDirectory() || stat.isSymbolicLink() /* !!! never recurse into links when deleting !!! */) {
                        var mode = stat.mode;
                        if (!(mode & 128)) { // 128 === 0200
                            fs.chmod(path, mode | 128, function (err) {
                                if (err) {
                                    callback(err);
                                }
                                else {
                                    fs.unlink(path, callback);
                                }
                            });
                        }
                        else {
                            fs.unlink(path, callback);
                        }
                    }
                    else {
                        readdir(path, function (err, children) {
                            if (err || !children) {
                                callback(err);
                            }
                            else if (children.length === 0) {
                                fs.rmdir(path, callback);
                            }
                            else {
                                var firstError_1 = null;
                                var childrenLeft_1 = children.length;
                                children.forEach(function (child) {
                                    rmRecursive(paths.join(path, child), function (err) {
                                        childrenLeft_1--;
                                        if (err) {
                                            firstError_1 = firstError_1 || err;
                                        }
                                        if (childrenLeft_1 === 0) {
                                            if (firstError_1) {
                                                callback(firstError_1);
                                            }
                                            else {
                                                fs.rmdir(path, callback);
                                            }
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    function delSync(path) {
        try {
            var stat = fs.lstatSync(path);
            if (stat.isDirectory() && !stat.isSymbolicLink()) {
                readdirSync(path).forEach(function (child) { return delSync(paths.join(path, child)); });
                fs.rmdirSync(path);
            }
            else {
                fs.unlinkSync(path);
            }
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return; // not found
            }
            throw err;
        }
    }
    exports.delSync = delSync;
    function mv(source, target, callback) {
        if (source === target) {
            return callback(null);
        }
        function updateMtime(err) {
            if (err) {
                return callback(err);
            }
            fs.stat(target, function (error, stat) {
                if (error) {
                    return callback(error);
                }
                if (stat.isDirectory()) {
                    return callback(null);
                }
                fs.open(target, 'a', null, function (err, fd) {
                    if (err) {
                        return callback(err);
                    }
                    fs.futimes(fd, stat.atime, new Date(), function (err) {
                        if (err) {
                            return callback(err);
                        }
                        fs.close(fd, callback);
                    });
                });
            });
        }
        // Try native rename()
        fs.rename(source, target, function (err) {
            if (!err) {
                return updateMtime(null);
            }
            // In two cases we fallback to classic copy and delete:
            //
            // 1.) The EXDEV error indicates that source and target are on different devices
            // In this case, fallback to using a copy() operation as there is no way to
            // rename() between different devices.
            //
            // 2.) The user tries to rename a file/folder that ends with a dot. This is not
            // really possible to move then, at least on UNC devices.
            if (err && source.toLowerCase() !== target.toLowerCase() && (err.code === 'EXDEV') || strings.endsWith(source, '.')) {
                return copy(source, target, function (err) {
                    if (err) {
                        return callback(err);
                    }
                    rmRecursive(source, updateMtime);
                });
            }
            return callback(err);
        });
    }
    exports.mv = mv;
    var canFlush = true;
    function writeFileAndFlush(path, data, options, callback) {
        options = ensureOptions(options);
        if (typeof data === 'string' || Buffer.isBuffer(data)) {
            doWriteFileAndFlush(path, data, options, callback);
        }
        else {
            doWriteFileStreamAndFlush(path, data, options, callback);
        }
    }
    exports.writeFileAndFlush = writeFileAndFlush;
    function doWriteFileStreamAndFlush(path, reader, options, callback) {
        // finish only once
        var finished = false;
        var finish = function (error) {
            if (!finished) {
                finished = true;
                // in error cases we need to manually close streams
                // if the write stream was successfully opened
                if (error) {
                    if (isOpen) {
                        writer.once('close', function () { return callback(error); });
                        writer.close();
                    }
                    else {
                        callback(error);
                    }
                }
                // otherwise just return without error
                else {
                    callback();
                }
            }
        };
        // create writer to target. we set autoClose: false because we want to use the streams
        // file descriptor to call fs.fdatasync to ensure the data is flushed to disk
        var writer = fs.createWriteStream(path, { mode: options.mode, flags: options.flag, autoClose: false });
        // Event: 'open'
        // Purpose: save the fd for later use and start piping
        // Notes: will not be called when there is an error opening the file descriptor!
        var fd;
        var isOpen;
        writer.once('open', function (descriptor) {
            fd = descriptor;
            isOpen = true;
            // if an encoding is provided, we need to pipe the stream through
            // an encoder stream and forward the encoding related options
            if (options.encoding) {
                reader = reader.pipe(encoding_1.encodeStream(options.encoding.charset, { addBOM: options.encoding.addBOM }));
            }
            // start data piping only when we got a successful open. this ensures that we do
            // not consume the stream when an error happens and helps to fix this issue:
            // https://github.com/Microsoft/vscode/issues/42542
            reader.pipe(writer);
        });
        // Event: 'error'
        // Purpose: to return the error to the outside and to close the write stream (does not happen automatically)
        reader.once('error', function (error) { return finish(error); });
        writer.once('error', function (error) { return finish(error); });
        // Event: 'finish'
        // Purpose: use fs.fdatasync to flush the contents to disk
        // Notes: event is called when the writer has finished writing to the underlying resource. we must call writer.close()
        // because we have created the WriteStream with autoClose: false
        writer.once('finish', function () {
            // flush to disk
            if (canFlush && isOpen) {
                fs.fdatasync(fd, function (syncError) {
                    // In some exotic setups it is well possible that node fails to sync
                    // In that case we disable flushing and warn to the console
                    if (syncError) {
                        console.warn('[node.js fs] fdatasync is now disabled for this session because it failed: ', syncError);
                        canFlush = false;
                    }
                    writer.close();
                });
            }
            else {
                writer.close();
            }
        });
        // Event: 'close'
        // Purpose: signal we are done to the outside
        // Notes: event is called when the writer's filedescriptor is closed
        writer.once('close', function () { return finish(); });
    }
    // Calls fs.writeFile() followed by a fs.sync() call to flush the changes to disk
    // We do this in cases where we want to make sure the data is really on disk and
    // not in some cache.
    //
    // See https://github.com/nodejs/node/blob/v5.10.0/lib/fs.js#L1194
    function doWriteFileAndFlush(path, data, options, callback) {
        if (options.encoding) {
            data = encoding_1.encode(data, options.encoding.charset, { addBOM: options.encoding.addBOM });
        }
        if (!canFlush) {
            return fs.writeFile(path, data, { mode: options.mode, flag: options.flag }, callback);
        }
        // Open the file with same flags and mode as fs.writeFile()
        fs.open(path, options.flag, options.mode, function (openError, fd) {
            if (openError) {
                return callback(openError);
            }
            // It is valid to pass a fd handle to fs.writeFile() and this will keep the handle open!
            fs.writeFile(fd, data, function (writeError) {
                if (writeError) {
                    return fs.close(fd, function () { return callback(writeError); }); // still need to close the handle on error!
                }
                // Flush contents (not metadata) of the file to disk
                fs.fdatasync(fd, function (syncError) {
                    // In some exotic setups it is well possible that node fails to sync
                    // In that case we disable flushing and warn to the console
                    if (syncError) {
                        console.warn('[node.js fs] fdatasync is now disabled for this session because it failed: ', syncError);
                        canFlush = false;
                    }
                    return fs.close(fd, function (closeError) { return callback(closeError); });
                });
            });
        });
    }
    function writeFileAndFlushSync(path, data, options) {
        options = ensureOptions(options);
        if (options.encoding) {
            data = encoding_1.encode(data, options.encoding.charset, { addBOM: options.encoding.addBOM });
        }
        if (!canFlush) {
            return fs.writeFileSync(path, data, { mode: options.mode, flag: options.flag });
        }
        // Open the file with same flags and mode as fs.writeFile()
        var fd = fs.openSync(path, options.flag, options.mode);
        try {
            // It is valid to pass a fd handle to fs.writeFile() and this will keep the handle open!
            fs.writeFileSync(fd, data);
            // Flush contents (not metadata) of the file to disk
            try {
                fs.fdatasyncSync(fd);
            }
            catch (syncError) {
                console.warn('[node.js fs] fdatasyncSync is now disabled for this session because it failed: ', syncError);
                canFlush = false;
            }
        }
        finally {
            fs.closeSync(fd);
        }
    }
    exports.writeFileAndFlushSync = writeFileAndFlushSync;
    function ensureOptions(options) {
        if (!options) {
            return { mode: 438, flag: 'w' };
        }
        var ensuredOptions = { mode: options.mode, flag: options.flag, encoding: options.encoding };
        if (typeof ensuredOptions.mode !== 'number') {
            ensuredOptions.mode = 438;
        }
        if (typeof ensuredOptions.flag !== 'string') {
            ensuredOptions.flag = 'w';
        }
        return ensuredOptions;
    }
    /**
     * Copied from: https://github.com/Microsoft/vscode-node-debug/blob/master/src/node/pathUtilities.ts#L83
     *
     * Given an absolute, normalized, and existing file path 'realcase' returns the exact path that the file has on disk.
     * On a case insensitive file system, the returned path might differ from the original path by character casing.
     * On a case sensitive file system, the returned path will always be identical to the original path.
     * In case of errors, null is returned. But you cannot use this function to verify that a path exists.
     * realcaseSync does not handle '..' or '.' path segments and it does not take the locale into account.
     */
    function realcaseSync(path) {
        var dir = paths.dirname(path);
        if (path === dir) { // end recursion
            return path;
        }
        var name = (paths.basename(path) /* can be '' for windows drive letters */ || path).toLowerCase();
        try {
            var entries = readdirSync(dir);
            var found = entries.filter(function (e) { return e.toLowerCase() === name; }); // use a case insensitive search
            if (found.length === 1) {
                // on a case sensitive filesystem we cannot determine here, whether the file exists or not, hence we need the 'file exists' precondition
                var prefix = realcaseSync(dir); // recurse
                if (prefix) {
                    return paths.join(prefix, found[0]);
                }
            }
            else if (found.length > 1) {
                // must be a case sensitive $filesystem
                var ix = found.indexOf(name);
                if (ix >= 0) { // case sensitive
                    var prefix = realcaseSync(dir); // recurse
                    if (prefix) {
                        return paths.join(prefix, found[ix]);
                    }
                }
            }
        }
        catch (error) {
            // silently ignore error
        }
        return null;
    }
    exports.realcaseSync = realcaseSync;
    function realpathSync(path) {
        try {
            return fs.realpathSync(path);
        }
        catch (error) {
            // We hit an error calling fs.realpathSync(). Since fs.realpathSync() is doing some path normalization
            // we now do a similar normalization and then try again if we can access the path with read
            // permissions at least. If that succeeds, we return that path.
            // fs.realpath() is resolving symlinks and that can fail in certain cases. The workaround is
            // to not resolve links but to simply see if the path is read accessible or not.
            var normalizedPath = normalizePath(path);
            fs.accessSync(normalizedPath, fs.constants.R_OK); // throws in case of an error
            return normalizedPath;
        }
    }
    exports.realpathSync = realpathSync;
    function realpath(path, callback) {
        return fs.realpath(path, function (error, realpath) {
            if (!error) {
                return callback(null, realpath);
            }
            // We hit an error calling fs.realpath(). Since fs.realpath() is doing some path normalization
            // we now do a similar normalization and then try again if we can access the path with read
            // permissions at least. If that succeeds, we return that path.
            // fs.realpath() is resolving symlinks and that can fail in certain cases. The workaround is
            // to not resolve links but to simply see if the path is read accessible or not.
            var normalizedPath = normalizePath(path);
            return fs.access(normalizedPath, fs.constants.R_OK, function (error) {
                return callback(error, normalizedPath);
            });
        });
    }
    exports.realpath = realpath;
    function normalizePath(path) {
        return strings.rtrim(paths.normalize(path), paths.sep);
    }
    function watch(path, onChange, onError) {
        try {
            var watcher = fs.watch(path);
            watcher.on('change', function (type, raw) {
                var file = null;
                if (raw) { // https://github.com/Microsoft/vscode/issues/38191
                    file = raw.toString();
                    if (platform.isMacintosh) {
                        // Mac: uses NFD unicode form on disk, but we want NFC
                        // See also https://github.com/nodejs/node/issues/2165
                        file = normalization_1.normalizeNFC(file);
                    }
                }
                onChange(type, file);
            });
            watcher.on('error', function (code, signal) { return onError("Failed to watch " + path + " for changes (" + code + ", " + signal + ")"); });
            return watcher;
        }
        catch (error) {
            fs.exists(path, function (exists) {
                if (exists) {
                    onError("Failed to watch " + path + " for changes (" + error.toString() + ")");
                }
            });
        }
        return void 0;
    }
    exports.watch = watch;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[50/*vs/base/node/pfs*/], __M([0/*require*/,1/*exports*/,3/*vs/base/common/winjs.base*/,48/*vs/base/node/extfs*/,11/*path*/,12/*vs/base/common/async*/,30/*fs*/,15/*os*/,4/*vs/base/common/platform*/,2/*vs/base/common/event*/]), function (require, exports, winjs_base_1, extfs, path_1, async_1, fs, os, platform, event_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function readdir(path) {
        return async_1.nfcall(extfs.readdir, path);
    }
    exports.readdir = readdir;
    function exists(path) {
        return new winjs_base_1.TPromise(function (c) { return fs.exists(path, c); }, function () { });
    }
    exports.exists = exists;
    function chmod(path, mode) {
        return async_1.nfcall(fs.chmod, path, mode);
    }
    exports.chmod = chmod;
    exports.mkdirp = extfs.mkdirp;
    function rimraf(path) {
        return lstat(path).then(function (stat) {
            if (stat.isDirectory() && !stat.isSymbolicLink()) {
                return readdir(path)
                    .then(function (children) { return winjs_base_1.TPromise.join(children.map(function (child) { return rimraf(path_1.join(path, child)); })); })
                    .then(function () { return rmdir(path); });
            }
            else {
                return unlink(path);
            }
        }, function (err) {
            if (err.code === 'ENOENT') {
                return void 0;
            }
            return winjs_base_1.TPromise.wrapError(err);
        });
    }
    exports.rimraf = rimraf;
    function realpath(path) {
        return async_1.nfcall(extfs.realpath, path);
    }
    exports.realpath = realpath;
    function stat(path) {
        return async_1.nfcall(fs.stat, path);
    }
    exports.stat = stat;
    function statLink(path) {
        return async_1.nfcall(extfs.statLink, path);
    }
    exports.statLink = statLink;
    function lstat(path) {
        return async_1.nfcall(fs.lstat, path);
    }
    exports.lstat = lstat;
    function rename(oldPath, newPath) {
        return async_1.nfcall(fs.rename, oldPath, newPath);
    }
    exports.rename = rename;
    function rmdir(path) {
        return async_1.nfcall(fs.rmdir, path);
    }
    exports.rmdir = rmdir;
    function unlink(path) {
        return async_1.nfcall(fs.unlink, path);
    }
    exports.unlink = unlink;
    function symlink(target, path, type) {
        return async_1.nfcall(fs.symlink, target, path, type);
    }
    exports.symlink = symlink;
    function readlink(path) {
        return async_1.nfcall(fs.readlink, path);
    }
    exports.readlink = readlink;
    function truncate(path, len) {
        return async_1.nfcall(fs.truncate, path, len);
    }
    exports.truncate = truncate;
    function readFile(path, encoding) {
        return async_1.nfcall(fs.readFile, path, encoding);
    }
    exports.readFile = readFile;
    // According to node.js docs (https://nodejs.org/docs/v6.5.0/api/fs.html#fs_fs_writefile_file_data_options_callback)
    // it is not safe to call writeFile() on the same path multiple times without waiting for the callback to return.
    // Therefor we use a Queue on the path that is given to us to sequentialize calls to the same path properly.
    var writeFilePathQueue = Object.create(null);
    function writeFile(path, data, options) {
        var queueKey = toQueueKey(path);
        return ensureWriteFileQueue(queueKey).queue(function () { return async_1.nfcall(extfs.writeFileAndFlush, path, data, options); });
    }
    exports.writeFile = writeFile;
    function toQueueKey(path) {
        var queueKey = path;
        if (platform.isWindows || platform.isMacintosh) {
            queueKey = queueKey.toLowerCase(); // accomodate for case insensitive file systems
        }
        return queueKey;
    }
    function ensureWriteFileQueue(queueKey) {
        var writeFileQueue = writeFilePathQueue[queueKey];
        if (!writeFileQueue) {
            writeFileQueue = new async_1.Queue();
            writeFilePathQueue[queueKey] = writeFileQueue;
            var onFinish = event_1.once(writeFileQueue.onFinished);
            onFinish(function () {
                delete writeFilePathQueue[queueKey];
                writeFileQueue.dispose();
            });
        }
        return writeFileQueue;
    }
    /**
    * Read a dir and return only subfolders
    */
    function readDirsInDir(dirPath) {
        return readdir(dirPath).then(function (children) {
            return winjs_base_1.TPromise.join(children.map(function (c) { return dirExists(path_1.join(dirPath, c)); })).then(function (exists) {
                return children.filter(function (_, i) { return exists[i]; });
            });
        });
    }
    exports.readDirsInDir = readDirsInDir;
    /**
    * `path` exists and is a directory
    */
    function dirExists(path) {
        return stat(path).then(function (stat) { return stat.isDirectory(); }, function () { return false; });
    }
    exports.dirExists = dirExists;
    /**
    * `path` exists and is a file.
    */
    function fileExists(path) {
        return stat(path).then(function (stat) { return stat.isFile(); }, function () { return false; });
    }
    exports.fileExists = fileExists;
    /**
     * Deletes a path from disk.
     */
    var _tmpDir = null;
    function getTmpDir() {
        if (!_tmpDir) {
            _tmpDir = os.tmpdir();
        }
        return _tmpDir;
    }
    function del(path, tmp) {
        if (tmp === void 0) { tmp = getTmpDir(); }
        return async_1.nfcall(extfs.del, path, tmp);
    }
    exports.del = del;
    function whenDeleted(path) {
        // Complete when wait marker file is deleted
        return new winjs_base_1.TPromise(function (c) {
            var running = false;
            var interval = setInterval(function () {
                if (!running) {
                    running = true;
                    fs.exists(path, function (exists) {
                        running = false;
                        if (!exists) {
                            clearInterval(interval);
                            c(null);
                        }
                    });
                }
            }, 1000);
        });
    }
    exports.whenDeleted = whenDeleted;
    function copy(source, target) {
        return async_1.nfcall(extfs.copy, source, target);
    }
    exports.copy = copy;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[22/*vs/base/parts/ipc/common/ipc*/], __M([0/*require*/,1/*exports*/,3/*vs/base/common/winjs.base*/,6/*vs/base/common/lifecycle*/,2/*vs/base/common/event*/]), function (require, exports, winjs_base_1, lifecycle_1, event_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MessageType;
    (function (MessageType) {
        MessageType[MessageType["RequestPromise"] = 0] = "RequestPromise";
        MessageType[MessageType["RequestPromiseCancel"] = 1] = "RequestPromiseCancel";
        MessageType[MessageType["ResponseInitialize"] = 2] = "ResponseInitialize";
        MessageType[MessageType["ResponsePromiseSuccess"] = 3] = "ResponsePromiseSuccess";
        MessageType[MessageType["ResponsePromiseProgress"] = 4] = "ResponsePromiseProgress";
        MessageType[MessageType["ResponsePromiseError"] = 5] = "ResponsePromiseError";
        MessageType[MessageType["ResponsePromiseErrorObj"] = 6] = "ResponsePromiseErrorObj";
        MessageType[MessageType["RequestEventListen"] = 7] = "RequestEventListen";
        MessageType[MessageType["RequestEventDispose"] = 8] = "RequestEventDispose";
        MessageType[MessageType["ResponseEventFire"] = 9] = "ResponseEventFire";
    })(MessageType || (MessageType = {}));
    function isResponse(messageType) {
        return messageType === MessageType.ResponseInitialize
            || messageType === MessageType.ResponsePromiseSuccess
            || messageType === MessageType.ResponsePromiseProgress
            || messageType === MessageType.ResponsePromiseError
            || messageType === MessageType.ResponsePromiseErrorObj
            || messageType === MessageType.ResponseEventFire;
    }
    var State;
    (function (State) {
        State[State["Uninitialized"] = 0] = "Uninitialized";
        State[State["Idle"] = 1] = "Idle";
    })(State || (State = {}));
    // TODO@joao cleanup this mess!
    var ChannelServer = /** @class */ (function () {
        function ChannelServer(protocol) {
            var _this = this;
            this.protocol = protocol;
            this.channels = Object.create(null);
            this.activeRequests = Object.create(null);
            this.protocolListener = this.protocol.onMessage(function (r) { return _this.onMessage(r); });
            this.protocol.send({ type: MessageType.ResponseInitialize });
        }
        ChannelServer.prototype.registerChannel = function (channelName, channel) {
            this.channels[channelName] = channel;
        };
        ChannelServer.prototype.onMessage = function (request) {
            switch (request.type) {
                case MessageType.RequestPromise:
                    this.onPromise(request);
                    break;
                case MessageType.RequestEventListen:
                    this.onEventListen(request);
                    break;
                case MessageType.RequestPromiseCancel:
                case MessageType.RequestEventDispose:
                    this.disposeActiveRequest(request);
                    break;
            }
        };
        ChannelServer.prototype.onPromise = function (request) {
            var _this = this;
            var channel = this.channels[request.channelName];
            var promise;
            try {
                promise = channel.call(request.name, request.arg);
            }
            catch (err) {
                promise = winjs_base_1.TPromise.wrapError(err);
            }
            var id = request.id;
            var requestPromise = promise.then(function (data) {
                _this.protocol.send({ id: id, data: data, type: MessageType.ResponsePromiseSuccess });
                delete _this.activeRequests[request.id];
            }, function (data) {
                if (data instanceof Error) {
                    _this.protocol.send({
                        id: id, data: {
                            message: data.message,
                            name: data.name,
                            stack: data.stack ? (data.stack.split ? data.stack.split('\n') : data.stack) : void 0
                        }, type: MessageType.ResponsePromiseError
                    });
                }
                else {
                    _this.protocol.send({ id: id, data: data, type: MessageType.ResponsePromiseErrorObj });
                }
                delete _this.activeRequests[request.id];
            }, function (data) {
                _this.protocol.send({ id: id, data: data, type: MessageType.ResponsePromiseProgress });
            });
            this.activeRequests[request.id] = lifecycle_1.toDisposable(function () { return requestPromise.cancel(); });
        };
        ChannelServer.prototype.onEventListen = function (request) {
            var _this = this;
            var channel = this.channels[request.channelName];
            var id = request.id;
            var event = channel.listen(request.name, request.arg);
            var disposable = event(function (data) { return _this.protocol.send({ id: id, data: data, type: MessageType.ResponseEventFire }); });
            this.activeRequests[request.id] = disposable;
        };
        ChannelServer.prototype.disposeActiveRequest = function (request) {
            var disposable = this.activeRequests[request.id];
            if (disposable) {
                disposable.dispose();
                delete this.activeRequests[request.id];
            }
        };
        ChannelServer.prototype.dispose = function () {
            var _this = this;
            this.protocolListener.dispose();
            this.protocolListener = null;
            Object.keys(this.activeRequests).forEach(function (id) {
                _this.activeRequests[id].dispose();
            });
            this.activeRequests = null;
        };
        return ChannelServer;
    }());
    exports.ChannelServer = ChannelServer;
    var ChannelClient = /** @class */ (function () {
        function ChannelClient(protocol) {
            var _this = this;
            this.protocol = protocol;
            this.state = State.Uninitialized;
            this.activeRequests = [];
            this.bufferedRequests = [];
            this.handlers = Object.create(null);
            this.lastRequestId = 0;
            this._onDidInitialize = new event_1.Emitter();
            this.onDidInitialize = this._onDidInitialize.event;
            this.protocolListener = this.protocol.onMessage(function (r) { return _this.onMessage(r); });
        }
        ChannelClient.prototype.getChannel = function (channelName) {
            var _this = this;
            var call = function (command, arg) { return _this.requestPromise(channelName, command, arg); };
            var listen = function (event, arg) { return _this.requestEvent(channelName, event, arg); };
            return { call: call, listen: listen };
        };
        ChannelClient.prototype.requestPromise = function (channelName, name, arg) {
            var _this = this;
            var id = this.lastRequestId++;
            var type = MessageType.RequestPromise;
            var request = { raw: { id: id, type: type, channelName: channelName, name: name, arg: arg } };
            var activeRequest = this.state === State.Uninitialized
                ? this.bufferRequest(request)
                : this.doRequest(request);
            var disposable = lifecycle_1.toDisposable(function () { return activeRequest.cancel(); });
            this.activeRequests.push(disposable);
            activeRequest
                .then(null, function (_) { return null; })
                .done(function () { return _this.activeRequests = _this.activeRequests.filter(function (el) { return el !== disposable; }); });
            return activeRequest;
        };
        ChannelClient.prototype.requestEvent = function (channelName, name, arg) {
            var _this = this;
            var id = this.lastRequestId++;
            var type = MessageType.RequestEventListen;
            var request = { raw: { id: id, type: type, channelName: channelName, name: name, arg: arg } };
            var uninitializedPromise = null;
            var emitter = new event_1.Emitter({
                onFirstListenerAdd: function () {
                    uninitializedPromise = _this.whenInitialized();
                    uninitializedPromise.then(function () {
                        uninitializedPromise = null;
                        _this.send(request.raw);
                    });
                },
                onLastListenerRemove: function () {
                    if (uninitializedPromise) {
                        uninitializedPromise.cancel();
                        uninitializedPromise = null;
                    }
                    else {
                        _this.send({ id: id, type: MessageType.RequestEventDispose });
                    }
                }
            });
            this.handlers[id] = function (response) { return emitter.fire(response.data); };
            return emitter.event;
        };
        ChannelClient.prototype.doRequest = function (request) {
            var _this = this;
            var id = request.raw.id;
            return new winjs_base_1.TPromise(function (c, e, p) {
                _this.handlers[id] = function (response) {
                    switch (response.type) {
                        case MessageType.ResponsePromiseSuccess:
                            delete _this.handlers[id];
                            c(response.data);
                            break;
                        case MessageType.ResponsePromiseError:
                            delete _this.handlers[id];
                            var error = new Error(response.data.message);
                            error.stack = response.data.stack;
                            error.name = response.data.name;
                            e(error);
                            break;
                        case MessageType.ResponsePromiseErrorObj:
                            delete _this.handlers[id];
                            e(response.data);
                            break;
                        case MessageType.ResponsePromiseProgress:
                            p(response.data);
                            break;
                    }
                };
                _this.send(request.raw);
            }, function () { return _this.send({ id: id, type: MessageType.RequestPromiseCancel }); });
        };
        ChannelClient.prototype.bufferRequest = function (request) {
            var _this = this;
            var flushedRequest = null;
            return new winjs_base_1.TPromise(function (c, e, p) {
                _this.bufferedRequests.push(request);
                request.flush = function () {
                    request.flush = null;
                    flushedRequest = _this.doRequest(request).then(c, e, p);
                };
            }, function () {
                request.flush = null;
                if (_this.state !== State.Uninitialized) {
                    if (flushedRequest) {
                        flushedRequest.cancel();
                        flushedRequest = null;
                    }
                    return;
                }
                var idx = _this.bufferedRequests.indexOf(request);
                if (idx === -1) {
                    return;
                }
                _this.bufferedRequests.splice(idx, 1);
            });
        };
        ChannelClient.prototype.onMessage = function (response) {
            if (!isResponse(response.type)) {
                return;
            }
            if (this.state === State.Uninitialized && response.type === MessageType.ResponseInitialize) {
                this.state = State.Idle;
                this._onDidInitialize.fire();
                this.bufferedRequests.forEach(function (r) { return r.flush && r.flush(); });
                this.bufferedRequests = null;
                return;
            }
            var handler = this.handlers[response.id];
            if (handler) {
                handler(response);
            }
        };
        ChannelClient.prototype.send = function (raw) {
            try {
                this.protocol.send(raw);
            }
            catch (err) {
                // noop
            }
        };
        ChannelClient.prototype.whenInitialized = function () {
            if (this.state === State.Idle) {
                return winjs_base_1.TPromise.as(null);
            }
            else {
                return event_1.toPromise(this.onDidInitialize);
            }
        };
        ChannelClient.prototype.dispose = function () {
            this.protocolListener.dispose();
            this.protocolListener = null;
            this.activeRequests = lifecycle_1.dispose(this.activeRequests);
        };
        return ChannelClient;
    }());
    exports.ChannelClient = ChannelClient;
    /**
     * An `IPCServer` is both a channel server and a routing channel
     * client.
     *
     * As the owner of a protocol, you should extend both this
     * and the `IPCClient` classes to get IPC implementations
     * for your protocol.
     */
    var IPCServer = /** @class */ (function () {
        function IPCServer(onDidClientConnect) {
            var _this = this;
            this.channels = Object.create(null);
            this.channelClients = Object.create(null);
            this.onClientAdded = new event_1.Emitter();
            onDidClientConnect(function (_a) {
                var protocol = _a.protocol, onDidClientDisconnect = _a.onDidClientDisconnect;
                var onFirstMessage = event_1.once(protocol.onMessage);
                onFirstMessage(function (id) {
                    var channelServer = new ChannelServer(protocol);
                    var channelClient = new ChannelClient(protocol);
                    Object.keys(_this.channels)
                        .forEach(function (name) { return channelServer.registerChannel(name, _this.channels[name]); });
                    _this.channelClients[id] = channelClient;
                    _this.onClientAdded.fire(id);
                    onDidClientDisconnect(function () {
                        channelServer.dispose();
                        channelClient.dispose();
                        delete _this.channelClients[id];
                    });
                });
            });
        }
        IPCServer.prototype.getChannel = function (channelName, router) {
            var _this = this;
            var call = function (command, arg) {
                var channelPromise = router.routeCall(command, arg)
                    .then(function (id) { return _this.getClient(id); })
                    .then(function (client) { return client.getChannel(channelName); });
                return getDelayedChannel(channelPromise)
                    .call(command, arg);
            };
            var listen = function (event, arg) {
                var channelPromise = router.routeEvent(event, arg)
                    .then(function (id) { return _this.getClient(id); })
                    .then(function (client) { return client.getChannel(channelName); });
                return getDelayedChannel(channelPromise)
                    .listen(event, arg);
            };
            return { call: call, listen: listen };
        };
        IPCServer.prototype.registerChannel = function (channelName, channel) {
            this.channels[channelName] = channel;
        };
        IPCServer.prototype.getClient = function (clientId) {
            var _this = this;
            if (!clientId) {
                return winjs_base_1.TPromise.wrapError(new Error('Client id should be provided'));
            }
            var client = this.channelClients[clientId];
            if (client) {
                return winjs_base_1.TPromise.as(client);
            }
            return new winjs_base_1.TPromise(function (c) {
                var onClient = event_1.once(event_1.filterEvent(_this.onClientAdded.event, function (id) { return id === clientId; }));
                onClient(function () { return c(_this.channelClients[clientId]); });
            });
        };
        IPCServer.prototype.dispose = function () {
            this.channels = Object.create(null);
            this.channelClients = Object.create(null);
            this.onClientAdded.dispose();
        };
        return IPCServer;
    }());
    exports.IPCServer = IPCServer;
    /**
     * An `IPCClient` is both a channel client and a channel server.
     *
     * As the owner of a protocol, you should extend both this
     * and the `IPCClient` classes to get IPC implementations
     * for your protocol.
     */
    var IPCClient = /** @class */ (function () {
        function IPCClient(protocol, id) {
            protocol.send(id);
            this.channelClient = new ChannelClient(protocol);
            this.channelServer = new ChannelServer(protocol);
        }
        IPCClient.prototype.getChannel = function (channelName) {
            return this.channelClient.getChannel(channelName);
        };
        IPCClient.prototype.registerChannel = function (channelName, channel) {
            this.channelServer.registerChannel(channelName, channel);
        };
        IPCClient.prototype.dispose = function () {
            this.channelClient.dispose();
            this.channelClient = null;
            this.channelServer.dispose();
            this.channelServer = null;
        };
        return IPCClient;
    }());
    exports.IPCClient = IPCClient;
    function getDelayedChannel(promise) {
        var call = function (command, arg) { return promise.then(function (c) { return c.call(command, arg); }); };
        var listen = function (event, arg) {
            var relay = new event_1.Relay();
            promise.then(function (c) { return relay.input = c.listen(event, arg); });
            return relay.event;
        };
        return { call: call, listen: listen };
    }
    exports.getDelayedChannel = getDelayedChannel;
    function getNextTickChannel(channel) {
        var didTick = false;
        var call = function (command, arg) {
            if (didTick) {
                return channel.call(command, arg);
            }
            return winjs_base_1.TPromise.timeout(0)
                .then(function () { return didTick = true; })
                .then(function () { return channel.call(command, arg); });
        };
        var listen = function (event, arg) {
            if (didTick) {
                return channel.listen(event, arg);
            }
            var relay = new event_1.Relay();
            winjs_base_1.TPromise.timeout(0)
                .then(function () { return didTick = true; })
                .then(function () { return relay.input = channel.listen(event, arg); });
            return relay.event;
        };
        return { call: call, listen: listen };
    }
    exports.getNextTickChannel = getNextTickChannel;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[53/*vs/base/parts/ipc/common/ipc.electron*/], __M([0/*require*/,1/*exports*/,6/*vs/base/common/lifecycle*/,2/*vs/base/common/event*/]), function (require, exports, lifecycle_1, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Protocol = /** @class */ (function () {
        function Protocol(sender, onMessageEvent) {
            this.sender = sender;
            var emitter = new event_1.Emitter();
            onMessageEvent(function (msg) { return emitter.fire(msg); });
            this._onMessage = emitter.event;
        }
        Object.defineProperty(Protocol.prototype, "onMessage", {
            get: function () { return this._onMessage; },
            enumerable: true,
            configurable: true
        });
        Protocol.prototype.send = function (message) {
            try {
                this.sender.send('ipc:message', message);
            }
            catch (e) {
                // systems are going down
            }
        };
        Protocol.prototype.dispose = function () {
            this.listener = lifecycle_1.dispose(this.listener);
        };
        return Protocol;
    }());
    exports.Protocol = Protocol;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/










define(__m[54/*vs/base/parts/ipc/electron-browser/ipc.electron-browser*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/event*/,22/*vs/base/parts/ipc/common/ipc*/,53/*vs/base/parts/ipc/common/ipc.electron*/,55/*electron*/]), function (require, exports, event_1, ipc_1, ipc_electron_1, electron_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Client = /** @class */ (function (_super) {
        __extends(Client, _super);
        function Client(id) {
            return _super.call(this, Client.createProtocol(), id) || this;
        }
        Client.createProtocol = function () {
            var onMessage = event_1.fromNodeEventEmitter(electron_1.ipcRenderer, 'ipc:message', function (_, message) { return message; });
            electron_1.ipcRenderer.send('ipc:hello');
            return new ipc_electron_1.Protocol(electron_1.ipcRenderer, onMessage);
        };
        return Client;
    }(ipc_1.IPCClient));
    exports.Client = Client;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/










define(__m[56/*vs/base/parts/ipc/node/ipc.net*/], __M([0/*require*/,1/*exports*/,96/*net*/,3/*vs/base/common/winjs.base*/,2/*vs/base/common/event*/,22/*vs/base/parts/ipc/common/ipc*/,11/*path*/,15/*os*/,29/*vs/base/common/uuid*/,12/*vs/base/common/async*/]), function (require, exports, net_1, winjs_base_1, event_1, ipc_1, path_1, os_1, uuid_1, async_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function generateRandomPipeName() {
        var randomSuffix = uuid_1.generateUuid();
        if (process.platform === 'win32') {
            return "\\\\.\\pipe\\vscode-ipc-" + randomSuffix + "-sock";
        }
        else {
            // Mac/Unix: use socket file
            return path_1.join(os_1.tmpdir(), "vscode-ipc-" + randomSuffix + ".sock");
        }
    }
    exports.generateRandomPipeName = generateRandomPipeName;
    var Protocol = /** @class */ (function () {
        function Protocol(_socket, firstDataChunk) {
            var _this = this;
            this._socket = _socket;
            this._onMessage = new event_1.Emitter();
            this.onMessage = this._onMessage.event;
            this._onClose = new event_1.Emitter();
            this.onClose = this._onClose.event;
            this._writeBuffer = new /** @class */ (function () {
                function class_1() {
                    this._data = [];
                    this._totalLength = 0;
                }
                class_1.prototype.add = function (head, body) {
                    var wasEmpty = this._totalLength === 0;
                    this._data.push(head, body);
                    this._totalLength += head.length + body.length;
                    return wasEmpty;
                };
                class_1.prototype.take = function () {
                    var ret = Buffer.concat(this._data, this._totalLength);
                    this._data.length = 0;
                    this._totalLength = 0;
                    return ret;
                };
                return class_1;
            }());
            this._isDisposed = false;
            this._chunks = [];
            var totalLength = 0;
            var state = {
                readHead: true,
                bodyIsJson: false,
                bodyLen: -1,
            };
            var acceptChunk = function (data) {
                _this._chunks.push(data);
                totalLength += data.length;
                while (totalLength > 0) {
                    if (state.readHead) {
                        // expecting header -> read 5bytes for header
                        // information: `bodyIsJson` and `bodyLen`
                        if (totalLength >= Protocol._headerLen) {
                            var all = Buffer.concat(_this._chunks);
                            state.bodyIsJson = all.readInt8(0) === 1;
                            state.bodyLen = all.readInt32BE(1);
                            state.readHead = false;
                            var rest = all.slice(Protocol._headerLen);
                            totalLength = rest.length;
                            _this._chunks = [rest];
                        }
                        else {
                            break;
                        }
                    }
                    if (!state.readHead) {
                        // expecting body -> read bodyLen-bytes for
                        // the actual message or wait for more data
                        if (totalLength >= state.bodyLen) {
                            var all = Buffer.concat(_this._chunks);
                            var message = all.toString('utf8', 0, state.bodyLen);
                            if (state.bodyIsJson) {
                                message = JSON.parse(message);
                            }
                            // ensure the public getBuffer returns a valid value if invoked from the event listeners
                            var rest = all.slice(state.bodyLen);
                            totalLength = rest.length;
                            _this._chunks = [rest];
                            state.bodyIsJson = false;
                            state.bodyLen = -1;
                            state.readHead = true;
                            _this._onMessage.fire(message);
                            if (_this._isDisposed) {
                                // check if an event listener lead to our disposal
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
            };
            var acceptFirstDataChunk = function () {
                if (firstDataChunk && firstDataChunk.length > 0) {
                    var tmp = firstDataChunk;
                    firstDataChunk = null;
                    acceptChunk(tmp);
                }
            };
            // Make sure to always handle the firstDataChunk if no more `data` event comes in
            this._firstChunkTimer = new async_1.TimeoutTimer();
            this._firstChunkTimer.setIfNotSet(function () {
                acceptFirstDataChunk();
            }, 0);
            this._socketDataListener = function (data) {
                acceptFirstDataChunk();
                acceptChunk(data);
            };
            _socket.on('data', this._socketDataListener);
            this._socketEndListener = function () {
                acceptFirstDataChunk();
            };
            _socket.on('end', this._socketEndListener);
            this._socketCloseListener = function () {
                _this._onClose.fire();
            };
            _socket.once('close', this._socketCloseListener);
        }
        Protocol.prototype.dispose = function () {
            this._isDisposed = true;
            this._firstChunkTimer.dispose();
            this._socket.removeListener('data', this._socketDataListener);
            this._socket.removeListener('end', this._socketEndListener);
            this._socket.removeListener('close', this._socketCloseListener);
        };
        Protocol.prototype.end = function () {
            this._socket.end();
        };
        Protocol.prototype.getBuffer = function () {
            return Buffer.concat(this._chunks);
        };
        Protocol.prototype.send = function (message) {
            // [bodyIsJson|bodyLen|message]
            // |^header^^^^^^^^^^^|^data^^]
            var header = Buffer.alloc(Protocol._headerLen);
            // ensure string
            if (typeof message !== 'string') {
                message = JSON.stringify(message);
                header.writeInt8(1, 0, true);
            }
            var data = Buffer.from(message);
            header.writeInt32BE(data.length, 1, true);
            this._writeSoon(header, data);
        };
        Protocol.prototype._writeSoon = function (header, data) {
            var _this = this;
            if (this._writeBuffer.add(header, data)) {
                setImmediate(function () {
                    // return early if socket has been destroyed in the meantime
                    if (_this._socket.destroyed) {
                        return;
                    }
                    // we ignore the returned value from `write` because we would have to cached the data
                    // anyways and nodejs is already doing that for us:
                    // > https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback
                    // > However, the false return value is only advisory and the writable stream will unconditionally
                    // > accept and buffer chunk even if it has not not been allowed to drain.
                    _this._socket.write(_this._writeBuffer.take());
                });
            }
        };
        Protocol._headerLen = 5;
        return Protocol;
    }());
    exports.Protocol = Protocol;
    var Server = /** @class */ (function (_super) {
        __extends(Server, _super);
        function Server(server) {
            var _this = _super.call(this, Server.toClientConnectionEvent(server)) || this;
            _this.server = server;
            return _this;
        }
        Server.toClientConnectionEvent = function (server) {
            var onConnection = event_1.fromNodeEventEmitter(server, 'connection');
            return event_1.mapEvent(onConnection, function (socket) { return ({
                protocol: new Protocol(socket),
                onDidClientDisconnect: event_1.once(event_1.fromNodeEventEmitter(socket, 'close'))
            }); });
        };
        Server.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.server.close();
            this.server = null;
        };
        return Server;
    }(ipc_1.IPCServer));
    exports.Server = Server;
    var Client = /** @class */ (function (_super) {
        __extends(Client, _super);
        function Client(protocol, id) {
            var _this = _super.call(this, protocol, id) || this;
            _this.protocol = protocol;
            return _this;
        }
        Client.fromSocket = function (socket, id) {
            return new Client(new Protocol(socket), id);
        };
        Object.defineProperty(Client.prototype, "onClose", {
            get: function () { return this.protocol.onClose; },
            enumerable: true,
            configurable: true
        });
        Client.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.protocol.end();
        };
        return Client;
    }(ipc_1.IPCClient));
    exports.Client = Client;
    function serve(hook) {
        return new winjs_base_1.TPromise(function (c, e) {
            var server = net_1.createServer();
            server.on('error', e);
            server.listen(hook, function () {
                server.removeListener('error', e);
                c(new Server(server));
            });
        });
    }
    exports.serve = serve;
    function connect(hook, clientId) {
        return new winjs_base_1.TPromise(function (c, e) {
            var socket = net_1.createConnection(hook, function () {
                socket.removeListener('error', e);
                c(Client.fromSocket(socket, clientId));
            });
            socket.once('error', e);
        });
    }
    exports.connect = connect;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[58/*vs/code/electron-browser/issue/issueReporterUtil*/], __M([0/*require*/,1/*exports*/,5/*vs/base/common/strings*/]), function (require, exports, strings_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function normalizeGitHubUrl(url) {
        // If the url has a .git suffix, remove it
        if (strings_1.endsWith(url, '.git')) {
            url = url.substr(0, url.length - 4);
        }
        // Remove trailing slash
        url = strings_1.rtrim(url, '/');
        if (strings_1.endsWith(url, '/new')) {
            url = strings_1.rtrim(url, '/new');
        }
        if (strings_1.endsWith(url, '/issues')) {
            url = strings_1.rtrim(url, '/issues');
        }
        return url;
    }
    exports.normalizeGitHubUrl = normalizeGitHubUrl;
});

define(__m[59/*vs/css!vs/base/browser/builder*/], __M([20/*vs/css!vs/code/electron-browser/issue/issueReporterMain*/]), {});










define(__m[61/*vs/base/browser/builder*/], __M([0/*require*/,1/*exports*/,9/*vs/base/common/types*/,6/*vs/base/common/lifecycle*/,5/*vs/base/common/strings*/,27/*vs/base/common/assert*/,16/*vs/base/browser/dom*/,59/*vs/css!vs/base/browser/builder*/]), function (require, exports, types, lifecycle_1, strings, assert, DOM) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // --- Implementation starts here
    var MS_DATA_KEY = '_msDataKey';
    var DATA_BINDING_ID = '__$binding';
    var LISTENER_BINDING_ID = '__$listeners';
    var VISIBILITY_BINDING_ID = '__$visibility';
    function data(element) {
        if (!element[MS_DATA_KEY]) {
            element[MS_DATA_KEY] = {};
        }
        return element[MS_DATA_KEY];
    }
    function hasData(element) {
        return !!element[MS_DATA_KEY];
    }
    /**
     *  Wraps around the provided element to manipulate it and add more child elements.
     */
    var Builder = /** @class */ (function () {
        function Builder(element, offdom) {
            this.offdom = offdom;
            this.container = element;
            this.currentElement = element;
            this.createdElements = [];
            this.toDispose = {};
            this.captureToDispose = {};
        }
        /**
         *  Returns a new builder that lets the current HTML Element of this builder be the container
         *  for future additions on the builder.
         */
        Builder.prototype.asContainer = function () {
            return withBuilder(this, this.offdom);
        };
        /**
         *  Clones the builder providing the same properties as this one.
         */
        Builder.prototype.clone = function () {
            var builder = new Builder(this.container, this.offdom);
            builder.currentElement = this.currentElement;
            builder.createdElements = this.createdElements;
            builder.captureToDispose = this.captureToDispose;
            builder.toDispose = this.toDispose;
            return builder;
        };
        Builder.prototype.build = function (container, index) {
            assert.ok(this.offdom, 'This builder was not created off-dom, so build() can not be called.');
            // Use builders own container if present
            if (!container) {
                container = this.container;
            }
            // Handle case of passed in Builder
            else if (container instanceof Builder) {
                container = container.getHTMLElement();
            }
            assert.ok(container, 'Builder can only be build() with a container provided.');
            assert.ok(DOM.isHTMLElement(container), 'The container must either be a HTMLElement or a Builder.');
            var htmlContainer = container;
            // Append
            var i, len;
            var childNodes = htmlContainer.childNodes;
            if (types.isNumber(index) && index < childNodes.length) {
                for (i = 0, len = this.createdElements.length; i < len; i++) {
                    htmlContainer.insertBefore(this.createdElements[i], childNodes[index++]);
                }
            }
            else {
                for (i = 0, len = this.createdElements.length; i < len; i++) {
                    htmlContainer.appendChild(this.createdElements[i]);
                }
            }
            return this;
        };
        Builder.prototype.appendTo = function (container, index) {
            // Use builders own container if present
            if (!container) {
                container = this.container;
            }
            // Handle case of passed in Builder
            else if (container instanceof Builder) {
                container = container.getHTMLElement();
            }
            assert.ok(container, 'Builder can only be build() with a container provided.');
            assert.ok(DOM.isHTMLElement(container), 'The container must either be a HTMLElement or a Builder.');
            var htmlContainer = container;
            // Remove node from parent, if needed
            if (this.currentElement.parentNode) {
                this.currentElement.parentNode.removeChild(this.currentElement);
            }
            var childNodes = htmlContainer.childNodes;
            if (types.isNumber(index) && index < childNodes.length) {
                htmlContainer.insertBefore(this.currentElement, childNodes[index]);
            }
            else {
                htmlContainer.appendChild(this.currentElement);
            }
            return this;
        };
        Builder.prototype.append = function (child, index) {
            assert.ok(child, 'Need a child to append');
            if (DOM.isHTMLElement(child)) {
                child = withElement(child);
            }
            assert.ok(child instanceof Builder || child instanceof MultiBuilder, 'Need a child to append');
            child.appendTo(this, index);
            return this;
        };
        /**
         *  Removes the current element of this builder from its parent node.
         */
        Builder.prototype.offDOM = function () {
            if (this.currentElement.parentNode) {
                this.currentElement.parentNode.removeChild(this.currentElement);
            }
            return this;
        };
        /**
         *  Returns the HTML Element the builder is currently active on.
         */
        Builder.prototype.getHTMLElement = function () {
            return this.currentElement;
        };
        /**
         *  Returns the HTML Element the builder is building in.
         */
        Builder.prototype.getContainer = function () {
            return this.container;
        };
        // HTML Elements
        /**
         *  Creates a new element of this kind as child of the current element or parent.
         *  Accepts an object literal as first parameter that can be used to describe the
         *  attributes of the element.
         *  Accepts a function as second parameter that can be used to create child elements
         *  of the element. The function will be called with a new builder created with the
         *  provided element.
         */
        Builder.prototype.div = function (attributes, fn) {
            return this.doElement('div', attributes, fn);
        };
        /**
         *  Creates a new element of this kind as child of the current element or parent.
         *  Accepts an object literal as first parameter that can be used to describe the
         *  attributes of the element.
         *  Accepts a function as second parameter that can be used to create child elements
         *  of the element. The function will be called with a new builder created with the
         *  provided element.
         */
        Builder.prototype.p = function (attributes, fn) {
            return this.doElement('p', attributes, fn);
        };
        /**
         *  Creates a new element of this kind as child of the current element or parent.
         *  Accepts an object literal as first parameter that can be used to describe the
         *  attributes of the element.
         *  Accepts a function as second parameter that can be used to create child elements
         *  of the element. The function will be called with a new builder created with the
         *  provided element.
         */
        Builder.prototype.ul = function (attributes, fn) {
            return this.doElement('ul', attributes, fn);
        };
        /**
         *  Creates a new element of this kind as child of the current element or parent.
         *  Accepts an object literal as first parameter that can be used to describe the
         *  attributes of the element.
         *  Accepts a function as second parameter that can be used to create child elements
         *  of the element. The function will be called with a new builder created with the
         *  provided element.
         */
        Builder.prototype.li = function (attributes, fn) {
            return this.doElement('li', attributes, fn);
        };
        /**
         *  Creates a new element of this kind as child of the current element or parent.
         *  Accepts an object literal as first parameter that can be used to describe the
         *  attributes of the element.
         *  Accepts a function as second parameter that can be used to create child elements
         *  of the element. The function will be called with a new builder created with the
         *  provided element.
         */
        Builder.prototype.span = function (attributes, fn) {
            return this.doElement('span', attributes, fn);
        };
        /**
         *  Creates a new element of this kind as child of the current element or parent.
         *  Accepts an object literal as first parameter that can be used to describe the
         *  attributes of the element.
         *  Accepts a function as second parameter that can be used to create child elements
         *  of the element. The function will be called with a new builder created with the
         *  provided element.
         */
        Builder.prototype.img = function (attributes, fn) {
            return this.doElement('img', attributes, fn);
        };
        /**
         *  Creates a new element of this kind as child of the current element or parent.
         *  Accepts an object literal as first parameter that can be used to describe the
         *  attributes of the element.
         *  Accepts a function as second parameter that can be used to create child elements
         *  of the element. The function will be called with a new builder created with the
         *  provided element.
         */
        Builder.prototype.a = function (attributes, fn) {
            return this.doElement('a', attributes, fn);
        };
        /**
         *  Creates a new element of given tag name as child of the current element or parent.
         *  Accepts an object literal as first parameter that can be used to describe the
         *  attributes of the element.
         *  Accepts a function as second parameter that can be used to create child elements
         *  of the element. The function will be called with a new builder created with the
         *  provided element.
         */
        Builder.prototype.element = function (name, attributes, fn) {
            return this.doElement(name, attributes, fn);
        };
        Builder.prototype.doElement = function (name, attributesOrFn, fn) {
            // Create Element
            var element = document.createElement(name);
            this.currentElement = element;
            // Off-DOM: Remember in array of created elements
            if (this.offdom) {
                this.createdElements.push(element);
            }
            // Object (apply properties as attributes to HTML element)
            if (types.isObject(attributesOrFn)) {
                this.attr(attributesOrFn);
            }
            // Support second argument being function
            if (types.isFunction(attributesOrFn)) {
                fn = attributesOrFn;
            }
            // Apply Functions (Elements created in Functions will be added as child to current element)
            if (types.isFunction(fn)) {
                var builder = new Builder(element);
                fn.call(builder, builder); // Set both 'this' and the first parameter to the new builder
            }
            // Add to parent
            if (!this.offdom) {
                this.container.appendChild(element);
            }
            return this;
        };
        /**
         *  Calls focus() on the current HTML element;
         */
        Builder.prototype.domFocus = function () {
            this.currentElement.focus();
            return this;
        };
        /**
         *  Calls blur() on the current HTML element;
         */
        Builder.prototype.domBlur = function () {
            this.currentElement.blur();
            return this;
        };
        Builder.prototype.on = function (arg1, fn, listenerToDisposeContainer, useCapture) {
            var _this = this;
            // Event Type Array
            if (types.isArray(arg1)) {
                arg1.forEach(function (type) {
                    _this.on(type, fn, listenerToDisposeContainer, useCapture);
                });
            }
            // Single Event Type
            else {
                var type = arg1;
                // Add Listener
                var unbind_1 = DOM.addDisposableListener(this.currentElement, type, function (e) {
                    fn(e, _this, unbind_1); // Pass in Builder as Second Argument
                }, useCapture || false);
                // Remember for off() use
                if (useCapture) {
                    if (!this.captureToDispose[type]) {
                        this.captureToDispose[type] = [];
                    }
                    this.captureToDispose[type].push(unbind_1);
                }
                else {
                    if (!this.toDispose[type]) {
                        this.toDispose[type] = [];
                    }
                    this.toDispose[type].push(unbind_1);
                }
                // Bind to Element
                var listenerBinding = this.getProperty(LISTENER_BINDING_ID, []);
                listenerBinding.push(unbind_1);
                this.setProperty(LISTENER_BINDING_ID, listenerBinding);
                // Add to Array if passed in
                if (listenerToDisposeContainer && types.isArray(listenerToDisposeContainer)) {
                    listenerToDisposeContainer.push(unbind_1);
                }
            }
            return this;
        };
        Builder.prototype.off = function (arg1, useCapture) {
            var _this = this;
            // Event Type Array
            if (types.isArray(arg1)) {
                arg1.forEach(function (type) {
                    _this.off(type);
                });
            }
            // Single Event Type
            else {
                var type = arg1;
                if (useCapture) {
                    if (this.captureToDispose[type]) {
                        this.captureToDispose[type] = lifecycle_1.dispose(this.captureToDispose[type]);
                    }
                }
                else {
                    if (this.toDispose[type]) {
                        this.toDispose[type] = lifecycle_1.dispose(this.toDispose[type]);
                    }
                }
            }
            return this;
        };
        // {{SQL CARBON EDIT}}
        Builder.prototype.overflow = function (overflow) {
            this.currentElement.style.overflow = overflow;
            return this;
        };
        Builder.prototype.background = function (color) {
            this.currentElement.style.backgroundColor = color;
            return this;
        };
        Builder.prototype.once = function (arg1, fn, listenerToDisposeContainer, useCapture) {
            var _this = this;
            // Event Type Array
            if (types.isArray(arg1)) {
                arg1.forEach(function (type) {
                    _this.once(type, fn);
                });
            }
            // Single Event Type
            else {
                var type = arg1;
                // Add Listener
                var unbind_2 = DOM.addDisposableListener(this.currentElement, type, function (e) {
                    fn(e, _this, unbind_2); // Pass in Builder as Second Argument
                    unbind_2.dispose();
                }, useCapture || false);
                // Add to Array if passed in
                if (listenerToDisposeContainer && types.isArray(listenerToDisposeContainer)) {
                    listenerToDisposeContainer.push(unbind_2);
                }
            }
            return this;
        };
        Builder.prototype.attr = function (firstP, secondP) {
            // Apply Object Literal to Attributes of Element
            if (types.isObject(firstP)) {
                for (var prop in firstP) {
                    if (firstP.hasOwnProperty(prop)) {
                        var value = firstP[prop];
                        this.doSetAttr(prop, value);
                    }
                }
                return this;
            }
            // Get Attribute Value
            if (types.isString(firstP) && !types.isString(secondP)) {
                return this.currentElement.getAttribute(firstP);
            }
            // Set Attribute Value
            if (types.isString(firstP)) {
                if (!types.isString(secondP)) {
                    secondP = String(secondP);
                }
                this.doSetAttr(firstP, secondP);
            }
            return this;
        };
        Builder.prototype.doSetAttr = function (prop, value) {
            if (prop === 'class') {
                prop = 'addClass'; // Workaround for the issue that a function name can not be 'class' in ES
            }
            if (this[prop]) {
                if (types.isArray(value)) {
                    this[prop].apply(this, value);
                }
                else {
                    this[prop].call(this, value);
                }
            }
            else {
                this.currentElement.setAttribute(prop, value);
            }
        };
        /**
         * Removes an attribute by the given name.
         */
        Builder.prototype.removeAttribute = function (prop) {
            this.currentElement.removeAttribute(prop);
        };
        /**
         *  Sets the id attribute to the value provided for the current HTML element of the builder.
         */
        Builder.prototype.id = function (id) {
            this.currentElement.setAttribute('id', id);
            return this;
        };
        /**
         *  Sets the title attribute to the value provided for the current HTML element of the builder.
         */
        Builder.prototype.title = function (title) {
            this.currentElement.setAttribute('title', title);
            return this;
        };
        /**
         *  Sets the type attribute to the value provided for the current HTML element of the builder.
         */
        Builder.prototype.type = function (type) {
            this.currentElement.setAttribute('type', type);
            return this;
        };
        /**
         *  Sets the value attribute to the value provided for the current HTML element of the builder.
         */
        Builder.prototype.value = function (value) {
            this.currentElement.setAttribute('value', value);
            return this;
        };
        /**
         *  Sets the tabindex attribute to the value provided for the current HTML element of the builder.
         */
        Builder.prototype.tabindex = function (index) {
            this.currentElement.setAttribute('tabindex', index.toString());
            return this;
        };
        Builder.prototype.style = function (firstP, secondP) {
            // Apply Object Literal to Styles of Element
            if (types.isObject(firstP)) {
                for (var prop in firstP) {
                    if (firstP.hasOwnProperty(prop)) {
                        var value = firstP[prop];
                        this.doSetStyle(prop, value);
                    }
                }
                return this;
            }
            var hasFirstP = types.isString(firstP);
            // Get Style Value
            if (hasFirstP && types.isUndefined(secondP)) {
                return this.currentElement.style[this.cssKeyToJavaScriptProperty(firstP)];
            }
            // Set Style Value
            else if (hasFirstP) {
                this.doSetStyle(firstP, secondP);
            }
            return this;
        };
        Builder.prototype.doSetStyle = function (key, value) {
            if (key.indexOf('-') >= 0) {
                var segments = key.split('-');
                key = segments[0];
                for (var i = 1; i < segments.length; i++) {
                    var segment = segments[i];
                    key = key + segment.charAt(0).toUpperCase() + segment.substr(1);
                }
            }
            this.currentElement.style[this.cssKeyToJavaScriptProperty(key)] = value;
        };
        Builder.prototype.cssKeyToJavaScriptProperty = function (key) {
            // Automagically convert dashes as they are not allowed when programmatically
            // setting a CSS style property
            if (key.indexOf('-') >= 0) {
                var segments = key.split('-');
                key = segments[0];
                for (var i = 1; i < segments.length; i++) {
                    var segment = segments[i];
                    key = key + segment.charAt(0).toUpperCase() + segment.substr(1);
                }
            }
            // Float is special too
            else if (key === 'float') {
                key = 'cssFloat';
            }
            return key;
        };
        /**
         *  Returns the computed CSS style for the current HTML element of the builder.
         */
        Builder.prototype.getComputedStyle = function () {
            return DOM.getComputedStyle(this.currentElement);
        };
        /**
         *  Adds the variable list of arguments as class names to the current HTML element of the builder.
         */
        Builder.prototype.addClass = function () {
            var _this = this;
            var classes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                classes[_i] = arguments[_i];
            }
            classes.forEach(function (nameValue) {
                var names = nameValue.split(' ');
                names.forEach(function (name) {
                    DOM.addClass(_this.currentElement, name);
                });
            });
            return this;
        };
        /**
         *  Sets the class name of the current HTML element of the builder to the provided className.
         *  If shouldAddClass is provided - for true class is added, for false class is removed.
         */
        Builder.prototype.setClass = function (className, shouldAddClass) {
            if (shouldAddClass === void 0) { shouldAddClass = null; }
            if (shouldAddClass === null) {
                this.currentElement.className = className;
            }
            else if (shouldAddClass) {
                this.addClass(className);
            }
            else {
                this.removeClass(className);
            }
            return this;
        };
        /**
         *  Returns whether the current HTML element of the builder has the provided class assigned.
         */
        Builder.prototype.hasClass = function (className) {
            return DOM.hasClass(this.currentElement, className);
        };
        /**
         *  Removes the variable list of arguments as class names from the current HTML element of the builder.
         */
        Builder.prototype.removeClass = function () {
            var _this = this;
            var classes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                classes[_i] = arguments[_i];
            }
            classes.forEach(function (nameValue) {
                var names = nameValue.split(' ');
                names.forEach(function (name) {
                    DOM.removeClass(_this.currentElement, name);
                });
            });
            return this;
        };
        /**
         *  Adds or removes the provided className for the current HTML element of the builder.
         */
        Builder.prototype.toggleClass = function (className) {
            if (this.hasClass(className)) {
                this.removeClass(className);
            }
            else {
                this.addClass(className);
            }
            return this;
        };
        /**
         *  Sets the CSS property color.
         */
        Builder.prototype.color = function (color) {
            this.currentElement.style.color = color;
            return this;
        };
        Builder.prototype.padding = function (top, right, bottom, left) {
            if (types.isString(top) && top.indexOf(' ') >= 0) {
                return this.padding.apply(this, top.split(' '));
            }
            if (!types.isUndefinedOrNull(top)) {
                this.currentElement.style.paddingTop = this.toPixel(top);
            }
            if (!types.isUndefinedOrNull(right)) {
                this.currentElement.style.paddingRight = this.toPixel(right);
            }
            if (!types.isUndefinedOrNull(bottom)) {
                this.currentElement.style.paddingBottom = this.toPixel(bottom);
            }
            if (!types.isUndefinedOrNull(left)) {
                this.currentElement.style.paddingLeft = this.toPixel(left);
            }
            return this;
        };
        Builder.prototype.margin = function (top, right, bottom, left) {
            if (types.isString(top) && top.indexOf(' ') >= 0) {
                return this.margin.apply(this, top.split(' '));
            }
            if (!types.isUndefinedOrNull(top)) {
                this.currentElement.style.marginTop = this.toPixel(top);
            }
            if (!types.isUndefinedOrNull(right)) {
                this.currentElement.style.marginRight = this.toPixel(right);
            }
            if (!types.isUndefinedOrNull(bottom)) {
                this.currentElement.style.marginBottom = this.toPixel(bottom);
            }
            if (!types.isUndefinedOrNull(left)) {
                this.currentElement.style.marginLeft = this.toPixel(left);
            }
            return this;
        };
        Builder.prototype.position = function (top, right, bottom, left, position) {
            if (types.isString(top) && top.indexOf(' ') >= 0) {
                return this.position.apply(this, top.split(' '));
            }
            if (!types.isUndefinedOrNull(top)) {
                this.currentElement.style.top = this.toPixel(top);
            }
            if (!types.isUndefinedOrNull(right)) {
                this.currentElement.style.right = this.toPixel(right);
            }
            if (!types.isUndefinedOrNull(bottom)) {
                this.currentElement.style.bottom = this.toPixel(bottom);
            }
            if (!types.isUndefinedOrNull(left)) {
                this.currentElement.style.left = this.toPixel(left);
            }
            if (!position) {
                position = 'absolute';
            }
            this.currentElement.style.position = position;
            return this;
        };
        Builder.prototype.size = function (width, height) {
            if (types.isString(width) && width.indexOf(' ') >= 0) {
                return this.size.apply(this, width.split(' '));
            }
            if (!types.isUndefinedOrNull(width)) {
                this.currentElement.style.width = this.toPixel(width);
            }
            if (!types.isUndefinedOrNull(height)) {
                this.currentElement.style.height = this.toPixel(height);
            }
            return this;
        };
        /**
         *  Sets the CSS property display.
         */
        Builder.prototype.display = function (display) {
            this.currentElement.style.display = display;
            return this;
        };
        /**
         *  Shows the current element of the builder.
         */
        Builder.prototype.show = function () {
            if (this.hasClass('monaco-builder-hidden')) {
                this.removeClass('monaco-builder-hidden');
            }
            this.attr('aria-hidden', 'false');
            // Cancel any pending showDelayed() invocation
            this.cancelVisibilityTimeout();
            return this;
        };
        /**
         *  Shows the current builder element after the provided delay. If the builder
         *  was set to hidden using the hide() method before this method executed, the
         *  function will return without showing the current element. This is useful to
         *  only show the element when a specific delay is reached (e.g. for a long running
         *  operation.
         */
        Builder.prototype.showDelayed = function (delay) {
            var _this = this;
            // Cancel any pending showDelayed() invocation
            this.cancelVisibilityTimeout();
            // Install new delay for showing
            var handle = setTimeout(function () {
                _this.removeProperty(VISIBILITY_BINDING_ID);
                _this.show();
            }, delay);
            this.setProperty(VISIBILITY_BINDING_ID, lifecycle_1.toDisposable(function () { return clearTimeout(handle); }));
            return this;
        };
        /**
         *  Hides the current element of the builder.
         */
        Builder.prototype.hide = function () {
            if (!this.hasClass('monaco-builder-hidden')) {
                this.addClass('monaco-builder-hidden');
            }
            this.attr('aria-hidden', 'true');
            // Cancel any pending showDelayed() invocation
            this.cancelVisibilityTimeout();
            return this;
        };
        /**
         *  Returns true if the current element of the builder is hidden.
         */
        Builder.prototype.isHidden = function () {
            return this.hasClass('monaco-builder-hidden') || this.currentElement.style.display === 'none';
        };
        Builder.prototype.cancelVisibilityTimeout = function () {
            var visibilityDisposable = this.getProperty(VISIBILITY_BINDING_ID);
            if (visibilityDisposable) {
                visibilityDisposable.dispose();
                this.removeProperty(VISIBILITY_BINDING_ID);
            }
        };
        Builder.prototype.toPixel = function (obj) {
            if (obj.toString().indexOf('px') === -1) {
                return obj.toString() + 'px';
            }
            return obj;
        };
        /**
         *  Sets the innerHTML attribute.
         */
        Builder.prototype.innerHtml = function (html, append) {
            if (append) {
                this.currentElement.innerHTML += html;
            }
            else {
                this.currentElement.innerHTML = html;
            }
            return this;
        };
        /**
         *  Sets the textContent property of the element.
         *  All HTML special characters will be escaped.
         */
        Builder.prototype.text = function (text, append) {
            if (append) {
                // children is child Elements versus childNodes includes textNodes
                if (this.currentElement.children.length === 0) {
                    this.currentElement.textContent += text;
                }
                else {
                    // if there are elements inside this node, append the string as a new text node
                    // to avoid wiping out the innerHTML and replacing it with only text content
                    this.currentElement.appendChild(document.createTextNode(text));
                }
            }
            else {
                this.currentElement.textContent = text;
            }
            return this;
        };
        /**
         *  Sets the innerHTML attribute in escaped form.
         */
        Builder.prototype.safeInnerHtml = function (html, append) {
            return this.innerHtml(strings.escape(html), append);
        };
        /**
         *  Allows to store arbritary data into the current element.
         */
        Builder.prototype.setProperty = function (key, value) {
            setPropertyOnElement(this.currentElement, key, value);
            return this;
        };
        /**
         *  Allows to get arbritary data from the current element.
         */
        Builder.prototype.getProperty = function (key, fallback) {
            return getPropertyFromElement(this.currentElement, key, fallback);
        };
        /**
         *  Removes a property from the current element that is stored under the given key.
         */
        Builder.prototype.removeProperty = function (key) {
            if (hasData(this.currentElement)) {
                delete data(this.currentElement)[key];
            }
            return this;
        };
        /**
         * Returns a new builder with the child at the given index.
         */
        Builder.prototype.child = function (index) {
            if (index === void 0) { index = 0; }
            var children = this.currentElement.children;
            return withElement(children.item(index));
        };
        /**
         * Recurse through all descendant nodes and remove their data binding.
         */
        Builder.prototype.unbindDescendants = function (current) {
            if (current && current.children) {
                for (var i = 0, length_1 = current.children.length; i < length_1; i++) {
                    var element = current.children.item(i);
                    // Unbind
                    if (hasData(element)) {
                        // Listeners
                        var listeners = data(element)[LISTENER_BINDING_ID];
                        if (types.isArray(listeners)) {
                            while (listeners.length) {
                                listeners.pop().dispose();
                            }
                        }
                        // Delete Data Slot
                        delete element[MS_DATA_KEY];
                    }
                    // Recurse
                    this.unbindDescendants(element);
                }
            }
        };
        /**
         *  Removes all HTML elements from the current element of the builder. Will also clean up any
         *  event listners registered and also clear any data binding and properties stored
         *  to any child element.
         */
        Builder.prototype.empty = function () {
            this.unbindDescendants(this.currentElement);
            this.clearChildren();
            if (this.offdom) {
                this.createdElements = [];
            }
            return this;
        };
        /**
         *  Removes all HTML elements from the current element of the builder.
         */
        Builder.prototype.clearChildren = function () {
            // Remove Elements
            if (this.currentElement) {
                DOM.clearNode(this.currentElement);
            }
            return this;
        };
        /**
         *  Removes the current HTML element and all its children from its parent and unbinds
         *  all listeners and properties set to the data slots.
         */
        Builder.prototype.destroy = function () {
            if (this.currentElement) {
                // Remove from parent
                if (this.currentElement.parentNode) {
                    this.currentElement.parentNode.removeChild(this.currentElement);
                }
                // Empty to clear listeners and bindings from children
                this.empty();
                // Unbind
                if (hasData(this.currentElement)) {
                    // Listeners
                    var listeners = data(this.currentElement)[LISTENER_BINDING_ID];
                    if (types.isArray(listeners)) {
                        while (listeners.length) {
                            listeners.pop().dispose();
                        }
                    }
                    // Delete Data Slot
                    delete this.currentElement[MS_DATA_KEY];
                }
            }
            var type;
            for (type in this.toDispose) {
                if (this.toDispose.hasOwnProperty(type) && types.isArray(this.toDispose[type])) {
                    this.toDispose[type] = lifecycle_1.dispose(this.toDispose[type]);
                }
            }
            for (type in this.captureToDispose) {
                if (this.captureToDispose.hasOwnProperty(type) && types.isArray(this.captureToDispose[type])) {
                    this.captureToDispose[type] = lifecycle_1.dispose(this.captureToDispose[type]);
                }
            }
            // Nullify fields
            this.currentElement = null;
            this.container = null;
            this.offdom = null;
            this.createdElements = null;
            this.captureToDispose = null;
            this.toDispose = null;
        };
        /**
         *  Removes the current HTML element and all its children from its parent and unbinds
         *  all listeners and properties set to the data slots.
         */
        Builder.prototype.dispose = function () {
            this.destroy();
        };
        /**
         *  Gets the size (in pixels) of an element, including the margin.
         */
        Builder.prototype.getTotalSize = function () {
            var totalWidth = DOM.getTotalWidth(this.currentElement);
            var totalHeight = DOM.getTotalHeight(this.currentElement);
            return new DOM.Dimension(totalWidth, totalHeight);
        };
        /**
         *  Another variant of getting the inner dimensions of an element.
         */
        Builder.prototype.getClientArea = function () {
            return DOM.getClientArea(this.currentElement);
        };
        return Builder;
    }());
    exports.Builder = Builder;
    /**
     *  The multi builder provides the same methods as the builder, but allows to call
     *  them on an array of builders.
     */
    var MultiBuilder = /** @class */ (function (_super) {
        __extends(MultiBuilder, _super);
        function MultiBuilder(builders) {
            var _this = this;
            assert.ok(types.isArray(builders) || builders instanceof MultiBuilder, 'Expected Array or MultiBuilder as parameter');
            _this = _super.call(this) || this;
            _this.length = 0;
            _this.builders = [];
            // Add Builders to Array
            if (types.isArray(builders)) {
                for (var i = 0; i < builders.length; i++) {
                    if (builders[i] instanceof HTMLElement) {
                        _this.push(withElement(builders[i]));
                    }
                    else {
                        _this.push(builders[i]);
                    }
                }
            }
            else {
                for (var i = 0; i < builders.length; i++) {
                    _this.push(builders.item(i));
                }
            }
            // Mixin Builder functions to operate on all builders
            var $outer = _this;
            var propertyFn = function (prop) {
                $outer[prop] = function () {
                    var args = Array.prototype.slice.call(arguments);
                    var returnValues;
                    var mergeBuilders = false;
                    for (var i = 0; i < $outer.length; i++) {
                        var res = $outer.item(i)[prop].apply($outer.item(i), args);
                        // Merge MultiBuilders into one
                        if (res instanceof MultiBuilder) {
                            if (!returnValues) {
                                returnValues = [];
                            }
                            mergeBuilders = true;
                            for (var j = 0; j < res.length; j++) {
                                returnValues.push(res.item(j));
                            }
                        }
                        // Any other Return Type (e.g. boolean, integer)
                        else if (!types.isUndefined(res) && !(res instanceof Builder)) {
                            if (!returnValues) {
                                returnValues = [];
                            }
                            returnValues.push(res);
                        }
                    }
                    if (returnValues && mergeBuilders) {
                        return new MultiBuilder(returnValues);
                    }
                    return returnValues || $outer;
                };
            };
            for (var prop in Builder.prototype) {
                if (prop !== 'clone' && prop !== 'and') { // Skip methods that are explicitly defined in MultiBuilder
                    if (Builder.prototype.hasOwnProperty(prop) && types.isFunction(Builder.prototype[prop])) {
                        propertyFn(prop);
                    }
                }
            }
            return _this;
        }
        MultiBuilder.prototype.item = function (i) {
            return this.builders[i];
        };
        MultiBuilder.prototype.push = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            for (var i = 0; i < items.length; i++) {
                this.builders.push(items[i]);
            }
            this.length = this.builders.length;
        };
        MultiBuilder.prototype.clone = function () {
            return new MultiBuilder(this);
        };
        return MultiBuilder;
    }(Builder));
    exports.MultiBuilder = MultiBuilder;
    function withBuilder(builder, offdom) {
        if (builder instanceof MultiBuilder) {
            return new MultiBuilder(builder);
        }
        return new Builder(builder.getHTMLElement(), offdom);
    }
    function withElement(element, offdom) {
        return new Builder(element, offdom);
    }
    exports.withElement = withElement;
    function offDOM() {
        return new Builder(null, true);
    }
    // Binding functions
    /**
     *  Allows to store arbritary data into element.
     */
    function setPropertyOnElement(element, key, value) {
        data(element)[key] = value;
    }
    exports.setPropertyOnElement = setPropertyOnElement;
    /**
     *  Allows to get arbritary data from element.
     */
    function getPropertyFromElement(element, key, fallback) {
        if (hasData(element)) {
            var value = data(element)[key];
            if (!types.isUndefined(value)) {
                return value;
            }
        }
        return fallback;
    }
    exports.getPropertyFromElement = getPropertyFromElement;
    /**
     *  Adds the provided object as property to the given element. Call getBinding()
     *  to retrieve it again.
     */
    function bindElement(element, object) {
        setPropertyOnElement(element, DATA_BINDING_ID, object);
    }
    exports.bindElement = bindElement;
    var SELECTOR_REGEX = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;
    exports.$ = function (arg) {
        // Off-DOM use
        if (types.isUndefined(arg)) {
            return offDOM();
        }
        // Falsified values cause error otherwise
        if (!arg) {
            throw new Error('Bad use of $');
        }
        // Wrap the given element
        if (DOM.isHTMLElement(arg) || arg === window) {
            return withElement(arg);
        }
        // Wrap the given builders
        if (types.isArray(arg)) {
            return new MultiBuilder(arg);
        }
        // Wrap the given builder
        if (arg instanceof Builder) {
            return withBuilder(arg);
        }
        if (types.isString(arg)) {
            // Use the argument as HTML code
            if (arg[0] === '<') {
                var element = void 0;
                var container = document.createElement('div');
                container.innerHTML = strings.format.apply(strings, arguments);
                if (container.children.length === 0) {
                    throw new Error('Bad use of $');
                }
                if (container.children.length === 1) {
                    element = container.firstChild;
                    container.removeChild(element);
                    return withElement(element);
                }
                var builders = [];
                while (container.firstChild) {
                    element = container.firstChild;
                    container.removeChild(element);
                    builders.push(withElement(element));
                }
                return new MultiBuilder(builders);
            }
            // Use the argument as a selector constructor
            else if (arguments.length === 1) {
                var match = SELECTOR_REGEX.exec(arg);
                if (!match) {
                    throw new Error('Bad use of $');
                }
                var tag = match[1] || 'div';
                var id = match[3] || undefined;
                var classes = (match[4] || '').replace(/\./g, ' ');
                var props = {};
                if (id) {
                    props['id'] = id;
                }
                if (classes) {
                    props['class'] = classes;
                }
                return offDOM().element(tag, props);
            }
            // Use the arguments as the arguments to Builder#element(...)
            else {
                var result = offDOM();
                result.element.apply(result, arguments);
                return result;
            }
        }
        else {
            throw new Error('Bad use of $');
        }
    };
});

define(__m[62/*vs/css!vs/base/browser/ui/button/button*/], __M([20/*vs/css!vs/code/electron-browser/issue/issueReporterMain*/]), {});
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/










define(__m[63/*vs/base/browser/ui/button/button*/], __M([0/*require*/,1/*exports*/,16/*vs/base/browser/dom*/,61/*vs/base/browser/builder*/,38/*vs/base/browser/keyboardEvent*/,83/*vs/base/common/color*/,13/*vs/base/common/objects*/,2/*vs/base/common/event*/,6/*vs/base/common/lifecycle*/,86/*vs/base/browser/touch*/,62/*vs/css!vs/base/browser/ui/button/button*/]), function (require, exports, DOM, builder_1, keyboardEvent_1, color_1, objects_1, event_1, lifecycle_1, touch_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultOptions = {
        buttonBackground: color_1.Color.fromHex('#0E639C'),
        buttonHoverBackground: color_1.Color.fromHex('#006BB3'),
        buttonForeground: color_1.Color.white
    };
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        function Button(container, options) {
            var _this = _super.call(this) || this;
            _this._onDidClick = _this._register(new event_1.Emitter());
            _this.options = options || Object.create(null);
            objects_1.mixin(_this.options, defaultOptions, false);
            _this.buttonBackground = _this.options.buttonBackground;
            _this.buttonHoverBackground = _this.options.buttonHoverBackground;
            _this.buttonForeground = _this.options.buttonForeground;
            _this.buttonBorder = _this.options.buttonBorder;
            _this.$el = _this._register(builder_1.$('a.monaco-button').attr({
                'tabIndex': '0',
                'role': 'button'
            }).appendTo(container));
            touch_1.Gesture.addTarget(_this.$el.getHTMLElement());
            _this.$el.on([DOM.EventType.CLICK, touch_1.EventType.Tap], function (e) {
                if (!_this.enabled) {
                    DOM.EventHelper.stop(e);
                    return;
                }
                _this._onDidClick.fire(e);
            });
            _this.$el.on(DOM.EventType.KEY_DOWN, function (e) {
                var event = new keyboardEvent_1.StandardKeyboardEvent(e);
                var eventHandled = false;
                if (_this.enabled && event.equals(3 /* Enter */) || event.equals(10 /* Space */)) {
                    _this._onDidClick.fire(e);
                    eventHandled = true;
                }
                else if (event.equals(9 /* Escape */)) {
                    _this.$el.domBlur();
                    eventHandled = true;
                }
                if (eventHandled) {
                    DOM.EventHelper.stop(event, true);
                }
            });
            _this.$el.on(DOM.EventType.MOUSE_OVER, function (e) {
                if (!_this.$el.hasClass('disabled')) {
                    _this.setHoverBackground();
                }
            });
            _this.$el.on(DOM.EventType.MOUSE_OUT, function (e) {
                _this.applyStyles(); // restore standard styles
            });
            // Also set hover background when button is focused for feedback
            _this.focusTracker = _this._register(DOM.trackFocus(_this.$el.getHTMLElement()));
            _this._register(_this.focusTracker.onDidFocus(function () { return _this.setHoverBackground(); }));
            _this._register(_this.focusTracker.onDidBlur(function () { return _this.applyStyles(); })); // restore standard styles
            _this.applyStyles();
            return _this;
        }
        Object.defineProperty(Button.prototype, "onDidClick", {
            get: function () { return this._onDidClick.event; },
            enumerable: true,
            configurable: true
        });
        Button.prototype.setHoverBackground = function () {
            var hoverBackground = this.buttonHoverBackground ? this.buttonHoverBackground.toString() : null;
            if (hoverBackground) {
                this.$el.style('background-color', hoverBackground);
            }
        };
        Button.prototype.style = function (styles) {
            this.buttonForeground = styles.buttonForeground;
            this.buttonBackground = styles.buttonBackground;
            this.buttonHoverBackground = styles.buttonHoverBackground;
            this.buttonBorder = styles.buttonBorder;
            this.applyStyles();
        };
        // {{SQL CARBON EDIT}} -- removed 'private' access modifier
        Button.prototype.applyStyles = function () {
            if (this.$el) {
                var background = this.buttonBackground ? this.buttonBackground.toString() : null;
                var foreground = this.buttonForeground ? this.buttonForeground.toString() : null;
                var border = this.buttonBorder ? this.buttonBorder.toString() : null;
                this.$el.style('color', foreground);
                this.$el.style('background-color', background);
                this.$el.style('border-width', border ? '1px' : null);
                this.$el.style('border-style', border ? 'solid' : null);
                this.$el.style('border-color', border);
            }
        };
        Object.defineProperty(Button.prototype, "element", {
            get: function () {
                return this.$el.getHTMLElement();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "label", {
            set: function (value) {
                if (!this.$el.hasClass('monaco-text-button')) {
                    this.$el.addClass('monaco-text-button');
                }
                this.$el.text(value);
                //{{SQL CARBON EDIT}}
                this.$el.attr('aria-label', value);
                //{{END}}
                if (this.options.title) {
                    this.$el.title(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "icon", {
            set: function (iconClassName) {
                this.$el.addClass(iconClassName);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "enabled", {
            get: function () {
                return !this.$el.hasClass('disabled');
            },
            set: function (value) {
                if (value) {
                    this.$el.removeClass('disabled');
                    this.$el.attr({
                        'aria-disabled': 'false',
                        'tabIndex': '0'
                    });
                }
                else {
                    this.$el.addClass('disabled');
                    this.$el.attr('aria-disabled', String(true));
                    DOM.removeTabIndexAndUpdateFocus(this.$el.getHTMLElement());
                }
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.focus = function () {
            this.$el.domFocus();
        };
        return Button;
    }(lifecycle_1.Disposable));
    exports.Button = Button;
    var ButtonGroup = /** @class */ (function (_super) {
        __extends(ButtonGroup, _super);
        function ButtonGroup(container, count, options) {
            var _this = _super.call(this) || this;
            _this._buttons = [];
            _this.create(container, count, options);
            return _this;
        }
        Object.defineProperty(ButtonGroup.prototype, "buttons", {
            get: function () {
                return this._buttons;
            },
            enumerable: true,
            configurable: true
        });
        ButtonGroup.prototype.create = function (container, count, options) {
            var _this = this;
            var _loop_1 = function (index) {
                var button = this_1._register(new Button(container, options));
                this_1._buttons.push(button);
                // Implement keyboard access in buttons if there are multiple
                if (count > 1) {
                    builder_1.$(button.element).on(DOM.EventType.KEY_DOWN, function (e) {
                        var event = new keyboardEvent_1.StandardKeyboardEvent(e);
                        var eventHandled = true;
                        // Next / Previous Button
                        var buttonIndexToFocus;
                        if (event.equals(15 /* LeftArrow */)) {
                            buttonIndexToFocus = index > 0 ? index - 1 : _this._buttons.length - 1;
                        }
                        else if (event.equals(17 /* RightArrow */)) {
                            buttonIndexToFocus = index === _this._buttons.length - 1 ? 0 : index + 1;
                        }
                        else {
                            eventHandled = false;
                        }
                        if (eventHandled) {
                            _this._buttons[buttonIndexToFocus].focus();
                            DOM.EventHelper.stop(e, true);
                        }
                    }, this_1.toDispose);
                }
            };
            var this_1 = this;
            for (var index = 0; index < count; index++) {
                _loop_1(index);
            }
        };
        return ButtonGroup;
    }(lifecycle_1.Disposable));
    exports.ButtonGroup = ButtonGroup;
});

define(__m[64/*vs/css!vs/base/browser/ui/octiconLabel/octicons/octicons*/], __M([20/*vs/css!vs/code/electron-browser/issue/issueReporterMain*/]), {});
define(__m[65/*vs/css!vs/base/browser/ui/octiconLabel/octicons/octicons-animations*/], __M([20/*vs/css!vs/code/electron-browser/issue/issueReporterMain*/]), {});
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[66/*vs/base/browser/ui/octiconLabel/octiconLabel*/], __M([0/*require*/,1/*exports*/,5/*vs/base/common/strings*/,64/*vs/css!vs/base/browser/ui/octiconLabel/octicons/octicons*/,65/*vs/css!vs/base/browser/ui/octiconLabel/octicons/octicons-animations*/]), function (require, exports, strings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function expand(text) {
        return text.replace(/\$\(((.+?)(~(.*?))?)\)/g, function (_match, _g1, name, _g3, animation) {
            return "<span class=\"octicon octicon-" + name + " " + (animation ? "octicon-animation-" + animation : '') + "\"></span>";
        });
    }
    function renderOcticons(label) {
        return expand(strings_1.escape(label));
    }
    exports.renderOcticons = renderOcticons;
    var OcticonLabel = /** @class */ (function () {
        function OcticonLabel(_container) {
            this._container = _container;
        }
        Object.defineProperty(OcticonLabel.prototype, "text", {
            set: function (text) {
                this._container.innerHTML = renderOcticons(text || '');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OcticonLabel.prototype, "title", {
            set: function (title) {
                this._container.title = title;
            },
            enumerable: true,
            configurable: true
        });
        return OcticonLabel;
    }());
    exports.OcticonLabel = OcticonLabel;
});

define(__m[67/*vs/css!vs/code/electron-browser/issue/media/issueReporter*/], __M([20/*vs/css!vs/code/electron-browser/issue/issueReporterMain*/]), {});

define(__m[68/*vs/nls!vs/code/electron-browser/issue/issueReporterPage*/], __M([24/*vs/nls*/,17/*vs/nls!vs/code/electron-browser/issue/issueReporterMain*/]), function(nls, data) { return nls.create("vs/code/electron-browser/issue/issueReporterPage", data); });
define(__m[71/*vs/code/electron-browser/issue/issueReporterPage*/], __M([0/*require*/,1/*exports*/,5/*vs/base/common/strings*/,68/*vs/nls!vs/code/electron-browser/issue/issueReporterPage*/]), function (require, exports, strings_1, nls_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = (function () { return "\n<div id=\"issue-reporter\">\n\t<div id=\"english\" class=\"input-group hidden\">" + strings_1.escape(nls_1.localize(0, null)) + "</div>\n\n\t<div class=\"section\">\n\t\t<div class=\"input-group\">\n\t\t\t<label class=\"inline-label\" for=\"issue-type\">" + strings_1.escape(nls_1.localize(1, null)) + "</label>\n\t\t\t<select id=\"issue-type\" class=\"inline-form-control\">\n\t\t\t\t<!-- To be dynamically filled -->\n\t\t\t</select>\n\t\t</div>\n\n\t\t<div class=\"input-group\" id=\"problem-source\">\n\t\t\t<label class=\"inline-label\" for=\"issue-source\">" + strings_1.escape(nls_1.localize(2, null)) + "</label>\n\t\t\t<select id=\"issue-source\" class=\"inline-form-control\">\n\t\t\t\t<!-- {{ SQL CARBON EDIT }} -->\n\t\t\t\t<option value=\"false\">" + strings_1.escape(nls_1.localize(3, null)) + "</option>\n\t\t\t\t<option value=\"true\">" + strings_1.escape(nls_1.localize(4, null)) + "</option>\n\t\t\t</select>\n\t\t\t<div id=\"problem-source-help-text\" class=\"instructions\">" + strings_1.escape(nls_1.localize(5, null))
        .replace('{0}', "<span tabIndex=0 role=\"button\" id=\"disableExtensions\" class=\"workbenchCommand\">" + strings_1.escape(nls_1.localize(6, null)) + "</span>") + "\n\t\t\t</div>\n\n\t\t\t<div id=\"extension-selection\">\n\t\t\t\t<label class=\"inline-label\" for=\"extension-selector\">" + strings_1.escape(nls_1.localize(7, null)) + " <span class=\"required-input\">*</span></label>\n\t\t\t\t<select id=\"extension-selector\" class=\"inline-form-control\">\n\t\t\t\t\t<!-- To be dynamically filled -->\n\t\t\t\t</select>\n\t\t\t</div>\n\t\t</div>\n\n\t\t<div class=\"input-group\">\n\t\t\t<label class=\"inline-label\" for=\"issue-title\">" + strings_1.escape(nls_1.localize(8, null)) + " <span class=\"required-input\">*</span></label>\n\t\t\t<input id=\"issue-title\" type=\"text\" class=\"inline-form-control\" placeholder=\"" + strings_1.escape(nls_1.localize(9, null)) + "\" required>\n\t\t\t<div id=\"issue-title-length-validation-error\" class=\"validation-error hidden\" role=\"alert\">" + strings_1.escape(nls_1.localize(10, null)) + "</div>\n\t\t\t<small id=\"similar-issues\">\n\t\t\t\t<!-- To be dynamically filled -->\n\t\t\t</small>\n\t\t</div>\n\n\t</div>\n\n\t<div class=\"input-group description-section\">\n\t\t<label for=\"description\" id=\"issue-description-label\">\n\t\t\t<!-- To be dynamically filled -->\n\t\t</label>\n\t\t<div class=\"instructions\" id=\"issue-description-subtitle\">\n\t\t\t<!-- To be dynamically filled -->\n\t\t</div>\n\t\t<div class=\"block-info-text\">\n\t\t\t<textarea name=\"description\" id=\"description\" placeholder=\"" + strings_1.escape(nls_1.localize(11, null)) + "\" required></textarea>\n\t\t</div>\n\t</div>\n\n\t<div class=\"system-info\" id=\"block-container\">\n\t\t<div class=\"block block-system\">\n\t\t\t<input class=\"sendData\" type=\"checkbox\" id=\"includeSystemInfo\" checked/>\n\t\t\t<label class=\"caption\" for=\"includeSystemInfo\">" + strings_1.escape(nls_1.localize(12, null)).replace('{0}', "<a href=\"#\" class=\"showInfo\">" + strings_1.escape(nls_1.localize(13, null)) + "</a>") + "</label>\n\t\t\t<div class=\"block-info hidden\">\n\t\t\t\t<!-- To be dynamically filled -->\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"block block-process\">\n\t\t\t<input class=\"sendData\" type=\"checkbox\" id=\"includeProcessInfo\" checked/>\n\t\t\t<label class=\"caption\" for=\"includeProcessInfo\">" + strings_1.escape(nls_1.localize(14, null)).replace('{0}', "<a href=\"#\" class=\"showInfo\">" + strings_1.escape(nls_1.localize(15, null)) + "</a>") + "</label>\n\t\t\t<pre class=\"block-info hidden\">\n\t\t\t\t<code>\n\t\t\t\t<!-- To be dynamically filled -->\n\t\t\t\t</code>\n\t\t\t</pre>\n\t\t</div>\n\t\t<div class=\"block block-workspace\">\n\t\t\t<input class=\"sendData\" type=\"checkbox\" id=\"includeWorkspaceInfo\" checked/>\n\t\t\t<label class=\"caption\" for=\"includeWorkspaceInfo\">" + strings_1.escape(nls_1.localize(16, null)).replace('{0}', "<a href=\"#\" class=\"showInfo\">" + strings_1.escape(nls_1.localize(17, null)) + "</a>") + "</label>\n\t\t\t<pre id=\"systemInfo\" class=\"block-info hidden\">\n\t\t\t\t<code>\n\t\t\t\t<!-- To be dynamically filled -->\n\t\t\t\t</code>\n\t\t\t</pre>\n\t\t</div>\n\t\t<div class=\"block block-extensions\">\n\t\t\t<input class=\"sendData\" type=\"checkbox\" id=\"includeExtensions\" checked/>\n\t\t\t<label class=\"caption\" for=\"includeExtensions\">" + strings_1.escape(nls_1.localize(18, null)).replace('{0}', "<a href=\"#\" class=\"showInfo\">" + strings_1.escape(nls_1.localize(19, null)) + "</a>") + "</label>\n\t\t\t<div id=\"systemInfo\" class=\"block-info hidden\">\n\t\t\t\t<!-- To be dynamically filled -->\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"block block-searchedExtensions\">\n\t\t\t<input class=\"sendData\" type=\"checkbox\" id=\"includeSearchedExtensions\" checked/>\n\t\t\t<label class=\"caption\" for=\"includeSearchedExtensions\">" + strings_1.escape(nls_1.localize(20, null)).replace('{0}', "<a href=\"#\" class=\"showInfo\">" + strings_1.escape(nls_1.localize(21, null)) + "</a>") + "</label>\n\t\t\t<div class=\"block-info hidden\">\n\t\t\t\t<!-- To be dynamically filled -->\n\t\t\t</div>\n\t\t</div>\n\t\t<div class=\"block block-settingsSearchResults\">\n\t\t\t<input class=\"sendData\" type=\"checkbox\" id=\"includeSettingsSearchDetails\" checked/>\n\t\t\t<label class=\"caption\" for=\"includeSettingsSearchDetails\">" + strings_1.escape(nls_1.localize(22, null)).replace('{0}', "<a href=\"#\" class=\"showInfo\">" + strings_1.escape(nls_1.localize(23, null)) + "</a>") + "</label>\n\t\t\t<div class=\"block-info hidden\">\n\t\t\t\t<!-- To be dynamically filled -->\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>"; });


















});

define(__m[72/*vs/nls!vs/platform/configuration/common/configurationRegistry*/], __M([24/*vs/nls*/,17/*vs/nls!vs/code/electron-browser/issue/issueReporterMain*/]), function(nls, data) { return nls.create("vs/platform/configuration/common/configurationRegistry", data); });
define(__m[73/*vs/nls!vs/platform/telemetry/common/telemetryService*/], __M([24/*vs/nls*/,17/*vs/nls!vs/code/electron-browser/issue/issueReporterMain*/]), function(nls, data) { return nls.create("vs/platform/telemetry/common/telemetryService", data); });
define(__m[74/*vs/nls!vs/platform/workspaces/common/workspaces*/], __M([24/*vs/nls*/,17/*vs/nls!vs/code/electron-browser/issue/issueReporterMain*/]), function(nls, data) { return nls.create("vs/platform/workspaces/common/workspaces", data); });
define(__m[75/*vs/platform/instantiation/common/descriptors*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SyncDescriptor = /** @class */ (function () {
        function SyncDescriptor(ctor) {
            var _staticArguments = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                _staticArguments[_i - 1] = arguments[_i];
            }
            this.ctor = ctor;
            this.staticArguments = _staticArguments;
        }
        return SyncDescriptor;
    }());
    exports.SyncDescriptor = SyncDescriptor;
    exports.createSyncDescriptor = function (ctor) {
        var staticArguments = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            staticArguments[_i - 1] = arguments[_i];
        }
        return new (SyncDescriptor.bind.apply(SyncDescriptor, [void 0, ctor].concat(staticArguments)))();
    };
});

define(__m[7/*vs/platform/instantiation/common/instantiation*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // ------ internal util
    var _util;
    (function (_util) {
        _util.serviceIds = new Map();
        _util.DI_TARGET = '$di$target';
        _util.DI_DEPENDENCIES = '$di$dependencies';
        function getServiceDependencies(ctor) {
            return ctor[_util.DI_DEPENDENCIES] || [];
        }
        _util.getServiceDependencies = getServiceDependencies;
    })(_util = exports._util || (exports._util = {}));
    exports.IInstantiationService = createDecorator('instantiationService');
    function storeServiceDependency(id, target, index, optional) {
        if (target[_util.DI_TARGET] === target) {
            target[_util.DI_DEPENDENCIES].push({ id: id, index: index, optional: optional });
        }
        else {
            target[_util.DI_DEPENDENCIES] = [{ id: id, index: index, optional: optional }];
            target[_util.DI_TARGET] = target;
        }
    }
    /**
     * A *only* valid way to create a {{ServiceIdentifier}}.
     */
    function createDecorator(serviceId) {
        if (_util.serviceIds.has(serviceId)) {
            return _util.serviceIds.get(serviceId);
        }
        var id = function (target, key, index) {
            if (arguments.length !== 3) {
                throw new Error('@IServiceName-decorator can only be used to decorate a parameter');
            }
            storeServiceDependency(id, target, index, false);
        };
        id.toString = function () { return serviceId; };
        _util.serviceIds.set(serviceId, id);
        return id;
    }
    exports.createDecorator = createDecorator;
    /**
     * Mark a service dependency as optional.
     */
    function optional(serviceIdentifier) {
        return function (target, key, index) {
            if (arguments.length !== 3) {
                throw new Error('@optional-decorator can only be used to decorate a parameter');
            }
            storeServiceDependency(serviceIdentifier, target, index, true);
        };
    }
    exports.optional = optional;
});











define(__m[77/*vs/platform/files/common/files*/], __M([0/*require*/,1/*exports*/,10/*vs/base/common/paths*/,4/*vs/base/common/platform*/,7/*vs/platform/instantiation/common/instantiation*/,5/*vs/base/common/strings*/,37/*vs/base/common/resources*/,9/*vs/base/common/types*/]), function (require, exports, paths, platform_1, instantiation_1, strings_1, resources_1, types_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IFileService = instantiation_1.createDecorator('fileService');
    var FileType;
    (function (FileType) {
        FileType[FileType["Unknown"] = 0] = "Unknown";
        FileType[FileType["File"] = 1] = "File";
        FileType[FileType["Directory"] = 2] = "Directory";
        FileType[FileType["SymbolicLink"] = 64] = "SymbolicLink";
    })(FileType = exports.FileType || (exports.FileType = {}));
    var FileSystemProviderCapabilities;
    (function (FileSystemProviderCapabilities) {
        FileSystemProviderCapabilities[FileSystemProviderCapabilities["FileReadWrite"] = 2] = "FileReadWrite";
        FileSystemProviderCapabilities[FileSystemProviderCapabilities["FileOpenReadWriteClose"] = 4] = "FileOpenReadWriteClose";
        FileSystemProviderCapabilities[FileSystemProviderCapabilities["FileFolderCopy"] = 8] = "FileFolderCopy";
        FileSystemProviderCapabilities[FileSystemProviderCapabilities["PathCaseSensitive"] = 1024] = "PathCaseSensitive";
        FileSystemProviderCapabilities[FileSystemProviderCapabilities["Readonly"] = 2048] = "Readonly";
    })(FileSystemProviderCapabilities = exports.FileSystemProviderCapabilities || (exports.FileSystemProviderCapabilities = {}));
    var FileOperation;
    (function (FileOperation) {
        FileOperation[FileOperation["CREATE"] = 0] = "CREATE";
        FileOperation[FileOperation["DELETE"] = 1] = "DELETE";
        FileOperation[FileOperation["MOVE"] = 2] = "MOVE";
        FileOperation[FileOperation["COPY"] = 3] = "COPY";
    })(FileOperation = exports.FileOperation || (exports.FileOperation = {}));
    var FileOperationEvent = /** @class */ (function () {
        function FileOperationEvent(_resource, _operation, _target) {
            this._resource = _resource;
            this._operation = _operation;
            this._target = _target;
        }
        Object.defineProperty(FileOperationEvent.prototype, "resource", {
            get: function () {
                return this._resource;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileOperationEvent.prototype, "target", {
            get: function () {
                return this._target;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FileOperationEvent.prototype, "operation", {
            get: function () {
                return this._operation;
            },
            enumerable: true,
            configurable: true
        });
        return FileOperationEvent;
    }());
    exports.FileOperationEvent = FileOperationEvent;
    /**
     * Possible changes that can occur to a file.
     */
    var FileChangeType;
    (function (FileChangeType) {
        FileChangeType[FileChangeType["UPDATED"] = 0] = "UPDATED";
        FileChangeType[FileChangeType["ADDED"] = 1] = "ADDED";
        FileChangeType[FileChangeType["DELETED"] = 2] = "DELETED";
    })(FileChangeType = exports.FileChangeType || (exports.FileChangeType = {}));
    var FileChangesEvent = /** @class */ (function () {
        function FileChangesEvent(changes) {
            this._changes = changes;
        }
        Object.defineProperty(FileChangesEvent.prototype, "changes", {
            get: function () {
                return this._changes;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns true if this change event contains the provided file with the given change type. In case of
         * type DELETED, this method will also return true if a folder got deleted that is the parent of the
         * provided file path.
         */
        FileChangesEvent.prototype.contains = function (resource, type) {
            if (!resource) {
                return false;
            }
            return this._changes.some(function (change) {
                if (change.type !== type) {
                    return false;
                }
                // For deleted also return true when deleted folder is parent of target path
                if (type === FileChangeType.DELETED) {
                    return resources_1.isEqualOrParent(resource, change.resource, !platform_1.isLinux /* ignorecase */);
                }
                return resources_1.isEqual(resource, change.resource, !platform_1.isLinux /* ignorecase */);
            });
        };
        /**
         * Returns the changes that describe added files.
         */
        FileChangesEvent.prototype.getAdded = function () {
            return this.getOfType(FileChangeType.ADDED);
        };
        /**
         * Returns if this event contains added files.
         */
        FileChangesEvent.prototype.gotAdded = function () {
            return this.hasType(FileChangeType.ADDED);
        };
        /**
         * Returns the changes that describe deleted files.
         */
        FileChangesEvent.prototype.getDeleted = function () {
            return this.getOfType(FileChangeType.DELETED);
        };
        /**
         * Returns if this event contains deleted files.
         */
        FileChangesEvent.prototype.gotDeleted = function () {
            return this.hasType(FileChangeType.DELETED);
        };
        /**
         * Returns the changes that describe updated files.
         */
        FileChangesEvent.prototype.getUpdated = function () {
            return this.getOfType(FileChangeType.UPDATED);
        };
        /**
         * Returns if this event contains updated files.
         */
        FileChangesEvent.prototype.gotUpdated = function () {
            return this.hasType(FileChangeType.UPDATED);
        };
        FileChangesEvent.prototype.getOfType = function (type) {
            return this._changes.filter(function (change) { return change.type === type; });
        };
        FileChangesEvent.prototype.hasType = function (type) {
            return this._changes.some(function (change) {
                return change.type === type;
            });
        };
        return FileChangesEvent;
    }());
    exports.FileChangesEvent = FileChangesEvent;
    function isParent(path, candidate, ignoreCase) {
        if (!path || !candidate || path === candidate) {
            return false;
        }
        if (candidate.length > path.length) {
            return false;
        }
        if (candidate.charAt(candidate.length - 1) !== paths.nativeSep) {
            candidate += paths.nativeSep;
        }
        if (ignoreCase) {
            return strings_1.startsWithIgnoreCase(path, candidate);
        }
        return path.indexOf(candidate) === 0;
    }
    exports.isParent = isParent;
    var StringSnapshot = /** @class */ (function () {
        function StringSnapshot(_value) {
            this._value = _value;
        }
        StringSnapshot.prototype.read = function () {
            var ret = this._value;
            this._value = null;
            return ret;
        };
        return StringSnapshot;
    }());
    exports.StringSnapshot = StringSnapshot;
    /**
     * Helper method to convert a snapshot into its full string form.
     */
    function snapshotToString(snapshot) {
        var chunks = [];
        var chunk;
        while (typeof (chunk = snapshot.read()) === 'string') {
            chunks.push(chunk);
        }
        return chunks.join('');
    }
    exports.snapshotToString = snapshotToString;
    var FileOperationError = /** @class */ (function (_super) {
        __extends(FileOperationError, _super);
        function FileOperationError(message, fileOperationResult, options) {
            var _this = _super.call(this, message) || this;
            _this.fileOperationResult = fileOperationResult;
            _this.options = options;
            return _this;
        }
        FileOperationError.isFileOperationError = function (obj) {
            return obj instanceof Error && !types_1.isUndefinedOrNull(obj.fileOperationResult);
        };
        return FileOperationError;
    }(Error));
    exports.FileOperationError = FileOperationError;
    var FileOperationResult;
    (function (FileOperationResult) {
        FileOperationResult[FileOperationResult["FILE_IS_BINARY"] = 0] = "FILE_IS_BINARY";
        FileOperationResult[FileOperationResult["FILE_IS_DIRECTORY"] = 1] = "FILE_IS_DIRECTORY";
        FileOperationResult[FileOperationResult["FILE_NOT_FOUND"] = 2] = "FILE_NOT_FOUND";
        FileOperationResult[FileOperationResult["FILE_NOT_MODIFIED_SINCE"] = 3] = "FILE_NOT_MODIFIED_SINCE";
        FileOperationResult[FileOperationResult["FILE_MODIFIED_SINCE"] = 4] = "FILE_MODIFIED_SINCE";
        FileOperationResult[FileOperationResult["FILE_MOVE_CONFLICT"] = 5] = "FILE_MOVE_CONFLICT";
        FileOperationResult[FileOperationResult["FILE_READ_ONLY"] = 6] = "FILE_READ_ONLY";
        FileOperationResult[FileOperationResult["FILE_PERMISSION_DENIED"] = 7] = "FILE_PERMISSION_DENIED";
        FileOperationResult[FileOperationResult["FILE_TOO_LARGE"] = 8] = "FILE_TOO_LARGE";
        FileOperationResult[FileOperationResult["FILE_INVALID_PATH"] = 9] = "FILE_INVALID_PATH";
        FileOperationResult[FileOperationResult["FILE_EXCEED_MEMORY_LIMIT"] = 10] = "FILE_EXCEED_MEMORY_LIMIT";
    })(FileOperationResult = exports.FileOperationResult || (exports.FileOperationResult = {}));
    exports.AutoSaveConfiguration = {
        OFF: 'off',
        AFTER_DELAY: 'afterDelay',
        ON_FOCUS_CHANGE: 'onFocusChange',
        ON_WINDOW_CHANGE: 'onWindowChange'
    };
    exports.HotExitConfiguration = {
        OFF: 'off',
        ON_EXIT: 'onExit',
        ON_EXIT_AND_WINDOW_CLOSE: 'onExitAndWindowClose'
    };
    exports.CONTENT_CHANGE_EVENT_BUFFER_DELAY = 1000;
    exports.FILES_ASSOCIATIONS_CONFIG = 'files.associations';
    exports.FILES_EXCLUDE_CONFIG = 'files.exclude';
    exports.SUPPORTED_ENCODINGS = {
        utf8: {
            labelLong: 'UTF-8',
            labelShort: 'UTF-8',
            order: 1,
            alias: 'utf8bom'
        },
        utf8bom: {
            labelLong: 'UTF-8 with BOM',
            labelShort: 'UTF-8 with BOM',
            encodeOnly: true,
            order: 2,
            alias: 'utf8'
        },
        utf16le: {
            labelLong: 'UTF-16 LE',
            labelShort: 'UTF-16 LE',
            order: 3
        },
        utf16be: {
            labelLong: 'UTF-16 BE',
            labelShort: 'UTF-16 BE',
            order: 4
        },
        windows1252: {
            labelLong: 'Western (Windows 1252)',
            labelShort: 'Windows 1252',
            order: 5
        },
        iso88591: {
            labelLong: 'Western (ISO 8859-1)',
            labelShort: 'ISO 8859-1',
            order: 6
        },
        iso88593: {
            labelLong: 'Western (ISO 8859-3)',
            labelShort: 'ISO 8859-3',
            order: 7
        },
        iso885915: {
            labelLong: 'Western (ISO 8859-15)',
            labelShort: 'ISO 8859-15',
            order: 8
        },
        macroman: {
            labelLong: 'Western (Mac Roman)',
            labelShort: 'Mac Roman',
            order: 9
        },
        cp437: {
            labelLong: 'DOS (CP 437)',
            labelShort: 'CP437',
            order: 10
        },
        windows1256: {
            labelLong: 'Arabic (Windows 1256)',
            labelShort: 'Windows 1256',
            order: 11
        },
        iso88596: {
            labelLong: 'Arabic (ISO 8859-6)',
            labelShort: 'ISO 8859-6',
            order: 12
        },
        windows1257: {
            labelLong: 'Baltic (Windows 1257)',
            labelShort: 'Windows 1257',
            order: 13
        },
        iso88594: {
            labelLong: 'Baltic (ISO 8859-4)',
            labelShort: 'ISO 8859-4',
            order: 14
        },
        iso885914: {
            labelLong: 'Celtic (ISO 8859-14)',
            labelShort: 'ISO 8859-14',
            order: 15
        },
        windows1250: {
            labelLong: 'Central European (Windows 1250)',
            labelShort: 'Windows 1250',
            order: 16
        },
        iso88592: {
            labelLong: 'Central European (ISO 8859-2)',
            labelShort: 'ISO 8859-2',
            order: 17
        },
        cp852: {
            labelLong: 'Central European (CP 852)',
            labelShort: 'CP 852',
            order: 18
        },
        windows1251: {
            labelLong: 'Cyrillic (Windows 1251)',
            labelShort: 'Windows 1251',
            order: 19
        },
        cp866: {
            labelLong: 'Cyrillic (CP 866)',
            labelShort: 'CP 866',
            order: 20
        },
        iso88595: {
            labelLong: 'Cyrillic (ISO 8859-5)',
            labelShort: 'ISO 8859-5',
            order: 21
        },
        koi8r: {
            labelLong: 'Cyrillic (KOI8-R)',
            labelShort: 'KOI8-R',
            order: 22
        },
        koi8u: {
            labelLong: 'Cyrillic (KOI8-U)',
            labelShort: 'KOI8-U',
            order: 23
        },
        iso885913: {
            labelLong: 'Estonian (ISO 8859-13)',
            labelShort: 'ISO 8859-13',
            order: 24
        },
        windows1253: {
            labelLong: 'Greek (Windows 1253)',
            labelShort: 'Windows 1253',
            order: 25
        },
        iso88597: {
            labelLong: 'Greek (ISO 8859-7)',
            labelShort: 'ISO 8859-7',
            order: 26
        },
        windows1255: {
            labelLong: 'Hebrew (Windows 1255)',
            labelShort: 'Windows 1255',
            order: 27
        },
        iso88598: {
            labelLong: 'Hebrew (ISO 8859-8)',
            labelShort: 'ISO 8859-8',
            order: 28
        },
        iso885910: {
            labelLong: 'Nordic (ISO 8859-10)',
            labelShort: 'ISO 8859-10',
            order: 29
        },
        iso885916: {
            labelLong: 'Romanian (ISO 8859-16)',
            labelShort: 'ISO 8859-16',
            order: 30
        },
        windows1254: {
            labelLong: 'Turkish (Windows 1254)',
            labelShort: 'Windows 1254',
            order: 31
        },
        iso88599: {
            labelLong: 'Turkish (ISO 8859-9)',
            labelShort: 'ISO 8859-9',
            order: 32
        },
        windows1258: {
            labelLong: 'Vietnamese (Windows 1258)',
            labelShort: 'Windows 1258',
            order: 33
        },
        gbk: {
            labelLong: 'Simplified Chinese (GBK)',
            labelShort: 'GBK',
            order: 34
        },
        gb18030: {
            labelLong: 'Simplified Chinese (GB18030)',
            labelShort: 'GB18030',
            order: 35
        },
        cp950: {
            labelLong: 'Traditional Chinese (Big5)',
            labelShort: 'Big5',
            order: 36
        },
        big5hkscs: {
            labelLong: 'Traditional Chinese (Big5-HKSCS)',
            labelShort: 'Big5-HKSCS',
            order: 37
        },
        shiftjis: {
            labelLong: 'Japanese (Shift JIS)',
            labelShort: 'Shift JIS',
            order: 38
        },
        eucjp: {
            labelLong: 'Japanese (EUC-JP)',
            labelShort: 'EUC-JP',
            order: 39
        },
        euckr: {
            labelLong: 'Korean (EUC-KR)',
            labelShort: 'EUC-KR',
            order: 40
        },
        windows874: {
            labelLong: 'Thai (Windows 874)',
            labelShort: 'Windows 874',
            order: 41
        },
        iso885911: {
            labelLong: 'Latin/Thai (ISO 8859-11)',
            labelShort: 'ISO 8859-11',
            order: 42
        },
        koi8ru: {
            labelLong: 'Cyrillic (KOI8-RU)',
            labelShort: 'KOI8-RU',
            order: 43
        },
        koi8t: {
            labelLong: 'Tajik (KOI8-T)',
            labelShort: 'KOI8-T',
            order: 44
        },
        gb2312: {
            labelLong: 'Simplified Chinese (GB 2312)',
            labelShort: 'GB 2312',
            order: 45
        },
        cp865: {
            labelLong: 'Nordic DOS (CP 865)',
            labelShort: 'CP 865',
            order: 46
        },
        cp850: {
            labelLong: 'Western European DOS (CP 850)',
            labelShort: 'CP 850',
            order: 47
        }
    };
    var FileKind;
    (function (FileKind) {
        FileKind[FileKind["FILE"] = 0] = "FILE";
        FileKind[FileKind["FOLDER"] = 1] = "FOLDER";
        FileKind[FileKind["ROOT_FOLDER"] = 2] = "ROOT_FOLDER";
    })(FileKind = exports.FileKind || (exports.FileKind = {}));
    exports.MIN_MAX_MEMORY_SIZE_MB = 2048;
    exports.FALLBACK_MAX_MEMORY_SIZE_MB = 4096;
});

define(__m[33/*vs/platform/instantiation/common/serviceCollection*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ServiceCollection = /** @class */ (function () {
        function ServiceCollection() {
            var entries = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                entries[_i] = arguments[_i];
            }
            this._entries = new Map();
            for (var _a = 0, entries_1 = entries; _a < entries_1.length; _a++) {
                var _b = entries_1[_a], id = _b[0], service = _b[1];
                this.set(id, service);
            }
        }
        ServiceCollection.prototype.set = function (id, instanceOrDescriptor) {
            var result = this._entries.get(id);
            this._entries.set(id, instanceOrDescriptor);
            return result;
        };
        ServiceCollection.prototype.forEach = function (callback) {
            this._entries.forEach(function (value, key) { return callback(key, value); });
        };
        ServiceCollection.prototype.has = function (id) {
            return this._entries.has(id);
        };
        ServiceCollection.prototype.get = function (id) {
            return this._entries.get(id);
        };
        return ServiceCollection;
    }());
    exports.ServiceCollection = ServiceCollection;
});

define(__m[79/*vs/platform/instantiation/common/instantiationService*/], __M([0/*require*/,1/*exports*/,19/*vs/base/common/errors*/,9/*vs/base/common/types*/,27/*vs/base/common/assert*/,49/*vs/base/common/graph*/,75/*vs/platform/instantiation/common/descriptors*/,7/*vs/platform/instantiation/common/instantiation*/,33/*vs/platform/instantiation/common/serviceCollection*/]), function (require, exports, errors_1, types_1, assert, graph_1, descriptors_1, instantiation_1, serviceCollection_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var InstantiationService = /** @class */ (function () {
        function InstantiationService(services, strict) {
            if (services === void 0) { services = new serviceCollection_1.ServiceCollection(); }
            if (strict === void 0) { strict = false; }
            this._services = services;
            this._strict = strict;
            this._services.set(instantiation_1.IInstantiationService, this);
        }
        InstantiationService.prototype.createChild = function (services) {
            var _this = this;
            this._services.forEach(function (id, thing) {
                if (services.has(id)) {
                    return;
                }
                // If we copy descriptors we might end up with
                // multiple instances of the same service
                if (thing instanceof descriptors_1.SyncDescriptor) {
                    thing = _this._createAndCacheServiceInstance(id, thing);
                }
                services.set(id, thing);
            });
            return new InstantiationService(services, this._strict);
        };
        InstantiationService.prototype.invokeFunction = function (signature) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var accessor;
            try {
                accessor = {
                    get: function (id, isOptional) {
                        var result = _this._getOrCreateServiceInstance(id);
                        if (!result && isOptional !== instantiation_1.optional) {
                            throw new Error("[invokeFunction] unknown service '" + id + "'");
                        }
                        return result;
                    }
                };
                return signature.apply(undefined, [accessor].concat(args));
            }
            finally {
                accessor.get = function () {
                    throw errors_1.illegalState('service accessor is only valid during the invocation of its target method');
                };
            }
        };
        InstantiationService.prototype.createInstance = function (param) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            if (param instanceof descriptors_1.SyncDescriptor) {
                // sync
                return this._createInstance(param, rest);
            }
            else {
                // sync, just ctor
                return this._createInstance(new descriptors_1.SyncDescriptor(param), rest);
            }
        };
        InstantiationService.prototype._createInstance = function (desc, args) {
            // arguments given by createInstance-call and/or the descriptor
            var staticArgs = desc.staticArguments.concat(args);
            // arguments defined by service decorators
            var serviceDependencies = instantiation_1._util.getServiceDependencies(desc.ctor).sort(function (a, b) { return a.index - b.index; });
            var serviceArgs = [];
            for (var _i = 0, serviceDependencies_1 = serviceDependencies; _i < serviceDependencies_1.length; _i++) {
                var dependency = serviceDependencies_1[_i];
                var service = this._getOrCreateServiceInstance(dependency.id);
                if (!service && this._strict && !dependency.optional) {
                    throw new Error("[createInstance] " + desc.ctor.name + " depends on UNKNOWN service " + dependency.id + ".");
                }
                serviceArgs.push(service);
            }
            var firstServiceArgPos = serviceDependencies.length > 0 ? serviceDependencies[0].index : staticArgs.length;
            // check for argument mismatches, adjust static args if needed
            if (staticArgs.length !== firstServiceArgPos) {
                console.warn("[createInstance] First service dependency of " + desc.ctor.name + " at position " + (firstServiceArgPos + 1) + " conflicts with " + staticArgs.length + " static arguments");
                var delta = firstServiceArgPos - staticArgs.length;
                if (delta > 0) {
                    staticArgs = staticArgs.concat(new Array(delta));
                }
                else {
                    staticArgs = staticArgs.slice(0, firstServiceArgPos);
                }
            }
            // // check for missing args
            // for (let i = 0; i < serviceArgs.length; i++) {
            // 	if (!serviceArgs[i]) {
            // 		console.warn(`${desc.ctor.name} MISSES service dependency ${serviceDependencies[i].id}`, new Error().stack);
            // 	}
            // }
            // now create the instance
            var argArray = [desc.ctor];
            argArray.push.apply(argArray, staticArgs);
            argArray.push.apply(argArray, serviceArgs);
            return types_1.create.apply(null, argArray);
        };
        InstantiationService.prototype._getOrCreateServiceInstance = function (id) {
            var thing = this._services.get(id);
            if (thing instanceof descriptors_1.SyncDescriptor) {
                return this._createAndCacheServiceInstance(id, thing);
            }
            else {
                return thing;
            }
        };
        InstantiationService.prototype._createAndCacheServiceInstance = function (id, desc) {
            assert.ok(this._services.get(id) instanceof descriptors_1.SyncDescriptor);
            var graph = new graph_1.Graph(function (data) { return data.id.toString(); });
            function throwCycleError() {
                var err = new Error('[createInstance] cyclic dependency between services');
                err.message = graph.toString();
                throw err;
            }
            var count = 0;
            var stack = [{ id: id, desc: desc }];
            while (stack.length) {
                var item = stack.pop();
                graph.lookupOrInsertNode(item);
                // TODO@joh use the graph to find a cycle
                // a weak heuristic for cycle checks
                if (count++ > 100) {
                    throwCycleError();
                }
                // check all dependencies for existence and if the need to be created first
                var dependencies = instantiation_1._util.getServiceDependencies(item.desc.ctor);
                for (var _i = 0, dependencies_1 = dependencies; _i < dependencies_1.length; _i++) {
                    var dependency = dependencies_1[_i];
                    var instanceOrDesc = this._services.get(dependency.id);
                    if (!instanceOrDesc) {
                        console.warn("[createInstance] " + id + " depends on " + dependency.id + " which is NOT registered.");
                    }
                    if (instanceOrDesc instanceof descriptors_1.SyncDescriptor) {
                        var d = { id: dependency.id, desc: instanceOrDesc };
                        graph.insertEdge(item, d);
                        stack.push(d);
                    }
                }
            }
            while (true) {
                var roots = graph.roots();
                // if there is no more roots but still
                // nodes in the graph we have a cycle
                if (roots.length === 0) {
                    if (graph.length !== 0) {
                        throwCycleError();
                    }
                    break;
                }
                for (var _a = 0, roots_1 = roots; _a < roots_1.length; _a++) {
                    var root = roots_1[_a];
                    // create instance and overwrite the service collections
                    var instance = this._createInstance(root.data.desc, []);
                    this._services.set(root.data.id, instance);
                    graph.removeNode(root.data);
                }
            }
            return this._services.get(id);
        };
        return InstantiationService;
    }());
    exports.InstantiationService = InstantiationService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[34/*vs/platform/issue/common/issue*/], __M([0/*require*/,1/*exports*/,7/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IIssueService = instantiation_1.createDecorator('issueService');
    var IssueType;
    (function (IssueType) {
        IssueType[IssueType["Bug"] = 0] = "Bug";
        IssueType[IssueType["PerformanceIssue"] = 1] = "PerformanceIssue";
        IssueType[IssueType["FeatureRequest"] = 2] = "FeatureRequest";
        IssueType[IssueType["SettingsSearchIssue"] = 3] = "SettingsSearchIssue";
    })(IssueType = exports.IssueType || (exports.IssueType = {}));
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[81/*vs/code/electron-browser/issue/issueReporterModel*/], __M([0/*require*/,1/*exports*/,13/*vs/base/common/objects*/,34/*vs/platform/issue/common/issue*/]), function (require, exports, objects_1, issue_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var IssueReporterModel = /** @class */ (function () {
        function IssueReporterModel(initialData) {
            var defaultData = {
                includeSystemInfo: true,
                includeWorkspaceInfo: true,
                includeProcessInfo: true,
                includeExtensions: true,
                includeSearchedExtensions: true,
                includeSettingsSearchDetails: true
            };
            this._data = initialData ? objects_1.assign(defaultData, initialData) : defaultData;
        }
        IssueReporterModel.prototype.getData = function () {
            return this._data;
        };
        IssueReporterModel.prototype.update = function (newData) {
            objects_1.assign(this._data, newData);
        };
        // {{SQL CARBON EDIT}}
        IssueReporterModel.prototype.serialize = function () {
            return "\nIssue Type: <b>" + this.getIssueTypeTitle() + "</b>\n\n" + this._data.issueDescription + "\n\nAzure Data Studio version: " + (this._data.versionInfo && this._data.versionInfo.vscodeVersion) + "\nOS version: " + (this._data.versionInfo && this._data.versionInfo.os) + "\n\n" + this.getInfos() + "\n<!-- generated by issue reporter -->";
        };
        IssueReporterModel.prototype.fileOnExtension = function () {
            var fileOnExtensionSupported = this._data.issueType === issue_1.IssueType.Bug
                || this._data.issueType === issue_1.IssueType.PerformanceIssue
                || this._data.issueType === issue_1.IssueType.FeatureRequest;
            return fileOnExtensionSupported && this._data.fileOnExtension;
        };
        IssueReporterModel.prototype.getExtensionVersion = function () {
            if (this.fileOnExtension()) {
                return "\nExtension version: " + this._data.selectedExtension.manifest.version;
            }
            else {
                return '';
            }
        };
        IssueReporterModel.prototype.getIssueTypeTitle = function () {
            if (this._data.issueType === issue_1.IssueType.Bug) {
                return 'Bug';
            }
            else if (this._data.issueType === issue_1.IssueType.PerformanceIssue) {
                return 'Performance Issue';
            }
            else if (this._data.issueType === issue_1.IssueType.SettingsSearchIssue) {
                return 'Settings Search Issue';
            }
            else {
                return 'Feature Request';
            }
        };
        IssueReporterModel.prototype.getInfos = function () {
            var info = '';
            if (this._data.issueType === issue_1.IssueType.Bug || this._data.issueType === issue_1.IssueType.PerformanceIssue) {
                if (this._data.includeSystemInfo) {
                    info += this.generateSystemInfoMd();
                }
            }
            if (this._data.issueType === issue_1.IssueType.PerformanceIssue) {
                if (this._data.includeProcessInfo) {
                    info += this.generateProcessInfoMd();
                }
                if (this._data.includeWorkspaceInfo) {
                    info += this.generateWorkspaceInfoMd();
                }
            }
            if (this._data.issueType === issue_1.IssueType.Bug || this._data.issueType === issue_1.IssueType.PerformanceIssue) {
                if (this._data.includeExtensions) {
                    info += this.generateExtensionsMd();
                }
            }
            if (this._data.issueType === issue_1.IssueType.SettingsSearchIssue) {
                if (this._data.includeSearchedExtensions) {
                    info += this.generateExtensionsMd();
                }
                if (this._data.includeSettingsSearchDetails) {
                    info += this.generateSettingSearchResultsMd();
                    info += '\n' + this.generateSettingsSearchResultDetailsMd();
                }
            }
            return info;
        };
        IssueReporterModel.prototype.generateSystemInfoMd = function () {
            var _this = this;
            var md = "<details>\n<summary>System Info</summary>\n\n|Item|Value|\n|---|---|\n";
            Object.keys(this._data.systemInfo).forEach(function (k) {
                var data = typeof _this._data.systemInfo[k] === 'object'
                    ? Object.keys(_this._data.systemInfo[k]).map(function (key) { return key + ": " + _this._data.systemInfo[k][key]; }).join('<br>')
                    : _this._data.systemInfo[k];
                md += "|" + k + "|" + data + "|\n";
            });
            md += '\n</details>';
            return md;
        };
        IssueReporterModel.prototype.generateProcessInfoMd = function () {
            return "<details>\n<summary>Process Info</summary>\n\n```\n" + this._data.processInfo + "\n```\n\n</details>\n";
        };
        IssueReporterModel.prototype.generateWorkspaceInfoMd = function () {
            return "<details>\n<summary>Workspace Info</summary>\n\n```\n" + this._data.workspaceInfo + ";\n```\n\n</details>\n";
        };
        IssueReporterModel.prototype.generateExtensionsMd = function () {
            if (this._data.extensionsDisabled) {
                return 'Extensions disabled';
            }
            var themeExclusionStr = this._data.numberOfThemeExtesions ? "\n(" + this._data.numberOfThemeExtesions + " theme extensions excluded)" : '';
            if (!this._data.enabledNonThemeExtesions) {
                return 'Extensions: none' + themeExclusionStr;
            }
            var tableHeader = "Extension|Author (truncated)|Version\n---|---|---";
            var table = this._data.enabledNonThemeExtesions.map(function (e) {
                return e.manifest.name + "|" + e.manifest.publisher.substr(0, 3) + "|" + e.manifest.version;
            }).join('\n');
            return "<details><summary>Extensions (" + this._data.enabledNonThemeExtesions.length + ")</summary>\n\n" + tableHeader + "\n" + table + "\n" + themeExclusionStr + "\n\n</details>";
        };
        IssueReporterModel.prototype.generateSettingsSearchResultDetailsMd = function () {
            return "\nQuery: " + this._data.query + "\nLiteral matches: " + this._data.filterResultCount;
        };
        IssueReporterModel.prototype.generateSettingSearchResultsMd = function () {
            if (!this._data.actualSearchResults) {
                return '';
            }
            if (!this._data.actualSearchResults.length) {
                return "No fuzzy results";
            }
            var tableHeader = "Setting|Extension|Score\n---|---|---";
            var table = this._data.actualSearchResults.map(function (setting) {
                return setting.key + "|" + setting.extensionId + "|" + String(setting.score).slice(0, 5);
            }).join('\n');
            return "<details><summary>Results</summary>\n\n" + tableHeader + "\n" + table + "\n\n</details>";
        };
        return IssueReporterModel;
    }());
    exports.IssueReporterModel = IssueReporterModel;
});

define(__m[82/*vs/platform/keybinding/common/keybinding*/], __M([0/*require*/,1/*exports*/,7/*vs/platform/instantiation/common/instantiation*/]), function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var KeybindingSource;
    (function (KeybindingSource) {
        KeybindingSource[KeybindingSource["Default"] = 1] = "Default";
        KeybindingSource[KeybindingSource["User"] = 2] = "User";
    })(KeybindingSource = exports.KeybindingSource || (exports.KeybindingSource = {}));
    exports.IKeybindingService = instantiation_1.createDecorator('keybindingService');
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/










define(__m[14/*vs/platform/log/common/log*/], __M([0/*require*/,1/*exports*/,7/*vs/platform/instantiation/common/instantiation*/,6/*vs/base/common/lifecycle*/,4/*vs/base/common/platform*/,2/*vs/base/common/event*/]), function (require, exports, instantiation_1, lifecycle_1, platform_1, event_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ILogService = instantiation_1.createDecorator('logService');
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["Trace"] = 0] = "Trace";
        LogLevel[LogLevel["Debug"] = 1] = "Debug";
        LogLevel[LogLevel["Info"] = 2] = "Info";
        LogLevel[LogLevel["Warning"] = 3] = "Warning";
        LogLevel[LogLevel["Error"] = 4] = "Error";
        LogLevel[LogLevel["Critical"] = 5] = "Critical";
        LogLevel[LogLevel["Off"] = 6] = "Off";
    })(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
    exports.DEFAULT_LOG_LEVEL = LogLevel.Info;
    var AbstractLogService = /** @class */ (function (_super) {
        __extends(AbstractLogService, _super);
        function AbstractLogService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.level = exports.DEFAULT_LOG_LEVEL;
            _this._onDidChangeLogLevel = _this._register(new event_1.Emitter());
            _this.onDidChangeLogLevel = _this._onDidChangeLogLevel.event;
            return _this;
        }
        AbstractLogService.prototype.setLevel = function (level) {
            if (this.level !== level) {
                this.level = level;
                this._onDidChangeLogLevel.fire(this.level);
            }
        };
        AbstractLogService.prototype.getLevel = function () {
            return this.level;
        };
        return AbstractLogService;
    }(lifecycle_1.Disposable));
    exports.AbstractLogService = AbstractLogService;
    var ConsoleLogMainService = /** @class */ (function (_super) {
        __extends(ConsoleLogMainService, _super);
        function ConsoleLogMainService(logLevel) {
            if (logLevel === void 0) { logLevel = exports.DEFAULT_LOG_LEVEL; }
            var _this = _super.call(this) || this;
            _this.setLevel(logLevel);
            _this.useColors = !platform_1.isWindows;
            return _this;
        }
        ConsoleLogMainService.prototype.trace = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Trace) {
                if (this.useColors) {
                    console.log.apply(console, ["\u001B[90m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
                }
                else {
                    console.log.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
                }
            }
        };
        ConsoleLogMainService.prototype.debug = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Debug) {
                if (this.useColors) {
                    console.log.apply(console, ["\u001B[90m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
                }
                else {
                    console.log.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
                }
            }
        };
        ConsoleLogMainService.prototype.info = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Info) {
                if (this.useColors) {
                    console.log.apply(console, ["\u001B[90m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
                }
                else {
                    console.log.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
                }
            }
        };
        ConsoleLogMainService.prototype.warn = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Warning) {
                if (this.useColors) {
                    console.warn.apply(console, ["\u001B[93m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
                }
                else {
                    console.warn.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
                }
            }
        };
        ConsoleLogMainService.prototype.error = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Error) {
                if (this.useColors) {
                    console.error.apply(console, ["\u001B[91m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
                }
                else {
                    console.error.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
                }
            }
        };
        ConsoleLogMainService.prototype.critical = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Critical) {
                if (this.useColors) {
                    console.error.apply(console, ["\u001B[90m[main " + new Date().toLocaleTimeString() + "]\u001B[0m", message].concat(args));
                }
                else {
                    console.error.apply(console, ["[main " + new Date().toLocaleTimeString() + "]", message].concat(args));
                }
            }
        };
        ConsoleLogMainService.prototype.dispose = function () {
            // noop
        };
        return ConsoleLogMainService;
    }(AbstractLogService));
    exports.ConsoleLogMainService = ConsoleLogMainService;
    var ConsoleLogService = /** @class */ (function (_super) {
        __extends(ConsoleLogService, _super);
        function ConsoleLogService(logLevel) {
            if (logLevel === void 0) { logLevel = exports.DEFAULT_LOG_LEVEL; }
            var _this = _super.call(this) || this;
            _this.setLevel(logLevel);
            return _this;
        }
        ConsoleLogService.prototype.trace = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Trace) {
                console.log.apply(console, ['%cTRACE', 'color: #888', message].concat(args));
            }
        };
        ConsoleLogService.prototype.debug = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Debug) {
                console.log.apply(console, ['%cDEBUG', 'background: #eee; color: #888', message].concat(args));
            }
        };
        ConsoleLogService.prototype.info = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Info) {
                console.log.apply(console, ['%c INFO', 'color: #33f', message].concat(args));
            }
        };
        ConsoleLogService.prototype.warn = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Warning) {
                console.log.apply(console, ['%c WARN', 'color: #993', message].concat(args));
            }
        };
        ConsoleLogService.prototype.error = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Error) {
                console.log.apply(console, ['%c  ERR', 'color: #f33', message].concat(args));
            }
        };
        ConsoleLogService.prototype.critical = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.getLevel() <= LogLevel.Critical) {
                console.log.apply(console, ['%cCRITI', 'background: #f33; color: white', message].concat(args));
            }
        };
        ConsoleLogService.prototype.dispose = function () { };
        return ConsoleLogService;
    }(AbstractLogService));
    exports.ConsoleLogService = ConsoleLogService;
    var MultiplexLogService = /** @class */ (function (_super) {
        __extends(MultiplexLogService, _super);
        function MultiplexLogService(logServices) {
            var _this = _super.call(this) || this;
            _this.logServices = logServices;
            if (logServices.length) {
                _this.setLevel(logServices[0].getLevel());
            }
            return _this;
        }
        MultiplexLogService.prototype.setLevel = function (level) {
            for (var _i = 0, _a = this.logServices; _i < _a.length; _i++) {
                var logService = _a[_i];
                logService.setLevel(level);
            }
            _super.prototype.setLevel.call(this, level);
        };
        MultiplexLogService.prototype.trace = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
                var logService = _b[_a];
                logService.trace.apply(logService, [message].concat(args));
            }
        };
        MultiplexLogService.prototype.debug = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
                var logService = _b[_a];
                logService.debug.apply(logService, [message].concat(args));
            }
        };
        MultiplexLogService.prototype.info = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
                var logService = _b[_a];
                logService.info.apply(logService, [message].concat(args));
            }
        };
        MultiplexLogService.prototype.warn = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
                var logService = _b[_a];
                logService.warn.apply(logService, [message].concat(args));
            }
        };
        MultiplexLogService.prototype.error = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
                var logService = _b[_a];
                logService.error.apply(logService, [message].concat(args));
            }
        };
        MultiplexLogService.prototype.critical = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            for (var _a = 0, _b = this.logServices; _a < _b.length; _a++) {
                var logService = _b[_a];
                logService.critical.apply(logService, [message].concat(args));
            }
        };
        MultiplexLogService.prototype.dispose = function () {
            for (var _i = 0, _a = this.logServices; _i < _a.length; _i++) {
                var logService = _a[_i];
                logService.dispose();
            }
        };
        return MultiplexLogService;
    }(AbstractLogService));
    exports.MultiplexLogService = MultiplexLogService;
    var DelegatedLogService = /** @class */ (function (_super) {
        __extends(DelegatedLogService, _super);
        function DelegatedLogService(logService) {
            var _this = _super.call(this) || this;
            _this.logService = logService;
            _this._register(logService);
            return _this;
        }
        Object.defineProperty(DelegatedLogService.prototype, "onDidChangeLogLevel", {
            get: function () {
                return this.logService.onDidChangeLogLevel;
            },
            enumerable: true,
            configurable: true
        });
        DelegatedLogService.prototype.setLevel = function (level) {
            this.logService.setLevel(level);
        };
        DelegatedLogService.prototype.getLevel = function () {
            return this.logService.getLevel();
        };
        DelegatedLogService.prototype.trace = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            (_a = this.logService).trace.apply(_a, [message].concat(args));
        };
        DelegatedLogService.prototype.debug = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            (_a = this.logService).debug.apply(_a, [message].concat(args));
        };
        DelegatedLogService.prototype.info = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            (_a = this.logService).info.apply(_a, [message].concat(args));
        };
        DelegatedLogService.prototype.warn = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            (_a = this.logService).warn.apply(_a, [message].concat(args));
        };
        DelegatedLogService.prototype.error = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            (_a = this.logService).error.apply(_a, [message].concat(args));
        };
        DelegatedLogService.prototype.critical = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var _a;
            (_a = this.logService).critical.apply(_a, [message].concat(args));
        };
        return DelegatedLogService;
    }(lifecycle_1.Disposable));
    exports.DelegatedLogService = DelegatedLogService;
    var NullLogService = /** @class */ (function () {
        function NullLogService() {
            this.onDidChangeLogLevel = new event_1.Emitter().event;
        }
        NullLogService.prototype.setLevel = function (level) { };
        NullLogService.prototype.getLevel = function () { return LogLevel.Info; };
        NullLogService.prototype.trace = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        NullLogService.prototype.debug = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        NullLogService.prototype.info = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        NullLogService.prototype.warn = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        NullLogService.prototype.error = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        NullLogService.prototype.critical = function (message) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        NullLogService.prototype.dispose = function () { };
        return NullLogService;
    }());
    exports.NullLogService = NullLogService;
    function getLogLevel(environmentService) {
        if (environmentService.verbose) {
            return LogLevel.Trace;
        }
        if (typeof environmentService.args.log === 'string') {
            var logLevel = environmentService.args.log.toLowerCase();
            switch (logLevel) {
                case 'trace':
                    return LogLevel.Trace;
                case 'debug':
                    return LogLevel.Debug;
                case 'info':
                    return LogLevel.Info;
                case 'warn':
                    return LogLevel.Warning;
                case 'error':
                    return LogLevel.Error;
                case 'critical':
                    return LogLevel.Critical;
                case 'off':
                    return LogLevel.Off;
            }
        }
        return exports.DEFAULT_LOG_LEVEL;
    }
    exports.getLogLevel = getLogLevel;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/










define(__m[84/*vs/platform/log/common/logIpc*/], __M([0/*require*/,1/*exports*/,3/*vs/base/common/winjs.base*/,14/*vs/platform/log/common/log*/,2/*vs/base/common/event*/]), function (require, exports, winjs_base_1, log_1, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LogLevelSetterChannel = /** @class */ (function () {
        function LogLevelSetterChannel(service) {
            this.service = service;
            this.onDidChangeLogLevel = event_1.buffer(service.onDidChangeLogLevel, true);
        }
        LogLevelSetterChannel.prototype.listen = function (event) {
            switch (event) {
                case 'onDidChangeLogLevel': return this.onDidChangeLogLevel;
            }
            throw new Error('No event found');
        };
        LogLevelSetterChannel.prototype.call = function (command, arg) {
            switch (command) {
                case 'setLevel':
                    this.service.setLevel(arg);
                    return winjs_base_1.TPromise.as(null);
            }
            return undefined;
        };
        return LogLevelSetterChannel;
    }());
    exports.LogLevelSetterChannel = LogLevelSetterChannel;
    var LogLevelSetterChannelClient = /** @class */ (function () {
        function LogLevelSetterChannelClient(channel) {
            this.channel = channel;
        }
        Object.defineProperty(LogLevelSetterChannelClient.prototype, "onDidChangeLogLevel", {
            get: function () {
                return this.channel.listen('onDidChangeLogLevel');
            },
            enumerable: true,
            configurable: true
        });
        LogLevelSetterChannelClient.prototype.setLevel = function (level) {
            return this.channel.call('setLevel', level);
        };
        return LogLevelSetterChannelClient;
    }());
    exports.LogLevelSetterChannelClient = LogLevelSetterChannelClient;
    var FollowerLogService = /** @class */ (function (_super) {
        __extends(FollowerLogService, _super);
        function FollowerLogService(master, logService) {
            var _this = _super.call(this, logService) || this;
            _this.master = master;
            _this._register(master.onDidChangeLogLevel(function (level) { return logService.setLevel(level); }));
            return _this;
        }
        FollowerLogService.prototype.setLevel = function (level) {
            this.master.setLevel(level);
        };
        return FollowerLogService;
    }(log_1.DelegatedLogService));
    exports.FollowerLogService = FollowerLogService;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/










define(__m[85/*vs/platform/log/node/spdlogService*/], __M([0/*require*/,1/*exports*/,11/*path*/,14/*vs/platform/log/common/log*/]), function (require, exports, path, log_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function createSpdLogService(processName, logLevel, logsFolder) {
        // Do not crash if spdlog cannot be loaded
        try {
            var _spdlog = require.__$__nodeRequire('spdlog');
            _spdlog.setAsyncMode(8192, 2000);
            var logfilePath = path.join(logsFolder, processName + ".log");
            var logger = new _spdlog.RotatingLogger(processName, logfilePath, 1024 * 1024 * 5, 6);
            logger.setLevel(0);
            return new SpdLogService(logger, logLevel);
        }
        catch (e) {
            console.error(e);
        }
        return new log_1.NullLogService();
    }
    exports.createSpdLogService = createSpdLogService;
    var SpdLogService = /** @class */ (function (_super) {
        __extends(SpdLogService, _super);
        function SpdLogService(logger, level) {
            if (level === void 0) { level = log_1.LogLevel.Error; }
            var _this = _super.call(this) || this;
            _this.logger = logger;
            _this.setLevel(level);
            return _this;
        }
        SpdLogService.prototype.trace = function () {
            if (this.getLevel() <= log_1.LogLevel.Trace) {
                this.logger.trace(this.format(arguments));
            }
        };
        SpdLogService.prototype.debug = function () {
            if (this.getLevel() <= log_1.LogLevel.Debug) {
                this.logger.debug(this.format(arguments));
            }
        };
        SpdLogService.prototype.info = function () {
            if (this.getLevel() <= log_1.LogLevel.Info) {
                this.logger.info(this.format(arguments));
            }
        };
        SpdLogService.prototype.warn = function () {
            if (this.getLevel() <= log_1.LogLevel.Warning) {
                this.logger.warn(this.format(arguments));
            }
        };
        SpdLogService.prototype.error = function () {
            if (this.getLevel() <= log_1.LogLevel.Error) {
                var arg = arguments[0];
                if (arg instanceof Error) {
                    var array = Array.prototype.slice.call(arguments);
                    array[0] = arg.stack;
                    this.logger.error(this.format(array));
                }
                else {
                    this.logger.error(this.format(arguments));
                }
            }
        };
        SpdLogService.prototype.critical = function () {
            if (this.getLevel() <= log_1.LogLevel.Critical) {
                this.logger.critical(this.format(arguments));
            }
        };
        SpdLogService.prototype.dispose = function () {
            this.logger.drop();
        };
        SpdLogService.prototype.format = function (args) {
            var result = '';
            for (var i = 0; i < args.length; i++) {
                var a = args[i];
                if (typeof a === 'object') {
                    try {
                        a = JSON.stringify(a);
                    }
                    catch (e) { }
                }
                result += (i > 0 ? ' ' : '') + a;
            }
            return result;
        };
        return SpdLogService;
    }(log_1.AbstractLogService));
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[36/*vs/platform/node/package*/], __M([0/*require*/,1/*exports*/,11/*path*/,8/*vs/base/common/uri*/]), function (require, exports, path, uri_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var rootPath = path.dirname(uri_1.default.parse(require.toUrl('')).fsPath);
    var packageJsonPath = path.join(rootPath, 'package.json');
    exports.default = require.__$__nodeRequire(packageJsonPath);
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[26/*vs/platform/node/product*/], __M([0/*require*/,1/*exports*/,11/*path*/,8/*vs/base/common/uri*/]), function (require, exports, path, uri_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var rootPath = path.dirname(uri_1.default.parse(require.toUrl('')).fsPath);
    var productJsonPath = path.join(rootPath, 'product.json');
    var product = require.__$__nodeRequire(productJsonPath);
    if (process.env['VSCODE_DEV']) {
        product.nameShort += ' Dev';
        product.nameLong += ' Dev';
        product.dataFolderName += '-dev';
    }
    exports.default = product;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/






define(__m[88/*vs/platform/environment/node/environmentService*/], __M([0/*require*/,1/*exports*/,95/*crypto*/,41/*vs/base/node/paths*/,15/*os*/,11/*path*/,8/*vs/base/common/uri*/,25/*vs/base/common/decorators*/,36/*vs/platform/node/package*/,26/*vs/platform/node/product*/,52/*vs/base/common/date*/,4/*vs/base/common/platform*/]), function (require, exports, crypto, paths, os, path, uri_1, decorators_1, package_1, product_1, date_1, platform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Read this before there's any chance it is overwritten
    // Related to https://github.com/Microsoft/vscode/issues/30624
    var xdgRuntimeDir = process.env['XDG_RUNTIME_DIR'];
    function getNixIPCHandle(userDataPath, type) {
        if (xdgRuntimeDir) {
            var scope = crypto.createHash('md5').update(userDataPath).digest('hex').substr(0, 8);
            return path.join(xdgRuntimeDir, "vscode-" + scope + "-" + package_1.default.version + "-" + type + ".sock");
        }
        return path.join(userDataPath, package_1.default.version + "-" + type + ".sock");
    }
    function getWin32IPCHandle(userDataPath, type) {
        var scope = crypto.createHash('md5').update(userDataPath).digest('hex');
        return "\\\\.\\pipe\\" + scope + "-" + package_1.default.version + "-" + type + "-sock";
    }
    function getIPCHandle(userDataPath, type) {
        if (platform_1.isWindows) {
            return getWin32IPCHandle(userDataPath, type);
        }
        return getNixIPCHandle(userDataPath, type);
    }
    function getCLIPath(execPath, appRoot, isBuilt) {
        // Windows
        if (platform_1.isWindows) {
            if (isBuilt) {
                return path.join(path.dirname(execPath), 'bin', product_1.default.applicationName + ".cmd");
            }
            return path.join(appRoot, 'scripts', 'code-cli.bat');
        }
        // Linux
        if (platform_1.isLinux) {
            if (isBuilt) {
                return path.join(path.dirname(execPath), 'bin', "" + product_1.default.applicationName);
            }
            return path.join(appRoot, 'scripts', 'code-cli.sh');
        }
        // macOS
        if (isBuilt) {
            return path.join(appRoot, 'bin', 'code');
        }
        return path.join(appRoot, 'scripts', 'code-cli.sh');
    }
    var EnvironmentService = /** @class */ (function () {
        function EnvironmentService(_args, _execPath) {
            this._args = _args;
            this._execPath = _execPath;
            if (!process.env['VSCODE_LOGS']) {
                var key = date_1.toLocalISOString(new Date()).replace(/-|:|\.\d+Z$/g, '');
                process.env['VSCODE_LOGS'] = path.join(this.userDataPath, 'logs', key);
            }
            this.logsPath = process.env['VSCODE_LOGS'];
        }
        Object.defineProperty(EnvironmentService.prototype, "args", {
            get: function () { return this._args; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appRoot", {
            get: function () { return path.dirname(uri_1.default.parse(require.toUrl('')).fsPath); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "execPath", {
            get: function () { return this._execPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "cliPath", {
            get: function () { return getCLIPath(this.execPath, this.appRoot, this.isBuilt); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "userHome", {
            get: function () { return os.homedir(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "userDataPath", {
            get: function () {
                if (process.env['VSCODE_PORTABLE']) {
                    return path.join(process.env['VSCODE_PORTABLE'], 'user-data');
                }
                return parseUserDataDir(this._args, process);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appNameLong", {
            get: function () { return product_1.default.nameLong; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appQuality", {
            get: function () { return product_1.default.quality; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appSettingsHome", {
            get: function () { return path.join(this.userDataPath, 'User'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appSettingsPath", {
            get: function () { return path.join(this.appSettingsHome, 'settings.json'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "settingsSearchBuildId", {
            get: function () { return product_1.default.settingsSearchBuildId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "settingsSearchUrl", {
            get: function () { return product_1.default.settingsSearchUrl; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appKeybindingsPath", {
            get: function () { return path.join(this.appSettingsHome, 'keybindings.json'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "isExtensionDevelopment", {
            get: function () { return !!this._args.extensionDevelopmentPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "backupHome", {
            get: function () { return path.join(this.userDataPath, 'Backups'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "backupWorkspacesPath", {
            get: function () { return path.join(this.backupHome, 'workspaces.json'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "workspacesHome", {
            get: function () { return path.join(this.userDataPath, 'Workspaces'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "installSourcePath", {
            get: function () { return path.join(this.userDataPath, 'installSource'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "extensionsPath", {
            get: function () {
                var fromArgs = parsePathArg(this._args['extensions-dir'], process);
                if (fromArgs) {
                    return fromArgs;
                }
                else if (process.env['VSCODE_EXTENSIONS']) {
                    return process.env['VSCODE_EXTENSIONS'];
                }
                else if (process.env['VSCODE_PORTABLE']) {
                    return path.join(process.env['VSCODE_PORTABLE'], 'extensions');
                }
                else {
                    return path.join(this.userHome, product_1.default.dataFolderName, 'extensions');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "extensionDevelopmentPath", {
            get: function () { return this._args.extensionDevelopmentPath ? path.normalize(this._args.extensionDevelopmentPath) : this._args.extensionDevelopmentPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "extensionTestsPath", {
            get: function () { return this._args.extensionTestsPath ? path.normalize(this._args.extensionTestsPath) : this._args.extensionTestsPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "disableExtensions", {
            get: function () {
                if (this._args['disable-extensions']) {
                    return true;
                }
                var disableExtensions = this._args['disable-extension'];
                if (disableExtensions) {
                    if (typeof disableExtensions === 'string') {
                        return [disableExtensions];
                    }
                    if (Array.isArray(disableExtensions) && disableExtensions.length > 0) {
                        return disableExtensions;
                    }
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "skipGettingStarted", {
            get: function () { return this._args['skip-getting-started']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "skipReleaseNotes", {
            get: function () { return this._args['skip-release-notes']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "skipAddToRecentlyOpened", {
            get: function () { return this._args['skip-add-to-recently-opened']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "debugExtensionHost", {
            get: function () { return parseExtensionHostPort(this._args, this.isBuilt); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "debugSearch", {
            get: function () { return parseSearchPort(this._args, this.isBuilt); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "isBuilt", {
            get: function () { return !process.env['VSCODE_DEV']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "verbose", {
            get: function () { return this._args.verbose; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "log", {
            get: function () { return this._args.log; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "wait", {
            get: function () { return this._args.wait; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "logExtensionHostCommunication", {
            get: function () { return this._args.logExtensionHostCommunication; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "performance", {
            get: function () { return this._args.performance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "status", {
            get: function () { return this._args.status; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "mainIPCHandle", {
            get: function () { return getIPCHandle(this.userDataPath, 'main'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "sharedIPCHandle", {
            get: function () { return getIPCHandle(this.userDataPath, 'shared'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "nodeCachedDataDir", {
            get: function () { return this.isBuilt ? path.join(this.userDataPath, 'CachedData', product_1.default.commit || new Array(41).join('0')) : undefined; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "disableUpdates", {
            get: function () { return !!this._args['disable-updates']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "disableCrashReporter", {
            get: function () { return !!this._args['disable-crash-reporter']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "driverHandle", {
            get: function () { return this._args['driver']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "driverVerbose", {
            get: function () { return this._args['driver-verbose']; },
            enumerable: true,
            configurable: true
        });
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "appRoot", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "cliPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "userHome", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "userDataPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "appSettingsHome", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "appSettingsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "settingsSearchBuildId", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "settingsSearchUrl", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "appKeybindingsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "isExtensionDevelopment", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "backupHome", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "backupWorkspacesPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "workspacesHome", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "installSourcePath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "extensionsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "extensionDevelopmentPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "extensionTestsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "debugExtensionHost", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "debugSearch", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "mainIPCHandle", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "sharedIPCHandle", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "nodeCachedDataDir", null);
        return EnvironmentService;
    }());
    exports.EnvironmentService = EnvironmentService;
    function parseExtensionHostPort(args, isBuild) {
        return parseDebugPort(args.debugPluginHost, args.debugBrkPluginHost, 5870, isBuild, args.debugId);
    }
    exports.parseExtensionHostPort = parseExtensionHostPort;
    function parseSearchPort(args, isBuild) {
        return parseDebugPort(args.debugSearch, args.debugBrkSearch, 5876, isBuild);
    }
    exports.parseSearchPort = parseSearchPort;
    function parseDebugPort(debugArg, debugBrkArg, defaultBuildPort, isBuild, debugId) {
        var portStr = debugBrkArg || debugArg;
        var port = Number(portStr) || (!isBuild ? defaultBuildPort : null);
        var brk = port ? Boolean(!!debugBrkArg) : false;
        return { port: port, break: brk, debugId: debugId };
    }
    exports.parseDebugPort = parseDebugPort;
    function parsePathArg(arg, process) {
        if (!arg) {
            return undefined;
        }
        // Determine if the arg is relative or absolute, if relative use the original CWD
        // (VSCODE_CWD), not the potentially overridden one (process.cwd()).
        var resolved = path.resolve(arg);
        if (path.normalize(arg) === resolved) {
            return resolved;
        }
        else {
            return path.resolve(process.env['VSCODE_CWD'] || process.cwd(), arg);
        }
    }
    function parseUserDataDir(args, process) {
        return parsePathArg(args['user-data-dir'], process) || path.resolve(paths.getDefaultUserDataPath(process.platform));
    }
    exports.parseUserDataDir = parseUserDataDir;
});

define(__m[18/*vs/platform/registry/common/platform*/], __M([0/*require*/,1/*exports*/,9/*vs/base/common/types*/,27/*vs/base/common/assert*/]), function (require, exports, Types, Assert) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var RegistryImpl = /** @class */ (function () {
        function RegistryImpl() {
            this.data = {};
        }
        RegistryImpl.prototype.add = function (id, data) {
            Assert.ok(Types.isString(id));
            Assert.ok(Types.isObject(data));
            Assert.ok(!this.data.hasOwnProperty(id), 'There is already an extension with this id');
            this.data[id] = data;
        };
        RegistryImpl.prototype.knows = function (id) {
            return this.data.hasOwnProperty(id);
        };
        RegistryImpl.prototype.as = function (id) {
            return this.data[id] || null;
        };
        return RegistryImpl;
    }());
    exports.Registry = new RegistryImpl();
});

define(__m[91/*vs/platform/jsonschemas/common/jsonContributionRegistry*/], __M([0/*require*/,1/*exports*/,18/*vs/platform/registry/common/platform*/,2/*vs/base/common/event*/]), function (require, exports, platform, event_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Extensions = {
        JSONContribution: 'base.contributions.json'
    };
    function normalizeId(id) {
        if (id.length > 0 && id.charAt(id.length - 1) === '#') {
            return id.substring(0, id.length - 1);
        }
        return id;
    }
    var JSONContributionRegistry = /** @class */ (function () {
        function JSONContributionRegistry() {
            this._onDidChangeSchema = new event_1.Emitter();
            this.onDidChangeSchema = this._onDidChangeSchema.event;
            this.schemasById = {};
        }
        JSONContributionRegistry.prototype.registerSchema = function (uri, unresolvedSchemaContent) {
            this.schemasById[normalizeId(uri)] = unresolvedSchemaContent;
            this._onDidChangeSchema.fire(uri);
        };
        JSONContributionRegistry.prototype.notifySchemaChanged = function (uri) {
            this._onDidChangeSchema.fire(uri);
        };
        JSONContributionRegistry.prototype.getSchemaContributions = function () {
            return {
                schemas: this.schemasById,
            };
        };
        return JSONContributionRegistry;
    }());
    var jsonContributionRegistry = new JSONContributionRegistry();
    platform.Registry.add(exports.Extensions.JSONContribution, jsonContributionRegistry);
});

define(__m[39/*vs/platform/configuration/common/configurationRegistry*/], __M([0/*require*/,1/*exports*/,72/*vs/nls!vs/platform/configuration/common/configurationRegistry*/,2/*vs/base/common/event*/,18/*vs/platform/registry/common/platform*/,9/*vs/base/common/types*/,5/*vs/base/common/strings*/,91/*vs/platform/jsonschemas/common/jsonContributionRegistry*/]), function (require, exports, nls, event_1, platform_1, types, strings, jsonContributionRegistry_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Extensions = {
        Configuration: 'base.contributions.configuration'
    };
    var ConfigurationScope;
    (function (ConfigurationScope) {
        ConfigurationScope[ConfigurationScope["APPLICATION"] = 1] = "APPLICATION";
        ConfigurationScope[ConfigurationScope["WINDOW"] = 2] = "WINDOW";
        ConfigurationScope[ConfigurationScope["RESOURCE"] = 3] = "RESOURCE";
    })(ConfigurationScope = exports.ConfigurationScope || (exports.ConfigurationScope = {}));
    exports.allSettings = { properties: {}, patternProperties: {} };
    exports.applicationSettings = { properties: {}, patternProperties: {} };
    exports.windowSettings = { properties: {}, patternProperties: {} };
    exports.resourceSettings = { properties: {}, patternProperties: {} };
    exports.editorConfigurationSchemaId = 'vscode://schemas/settings/editor';
    var contributionRegistry = platform_1.Registry.as(jsonContributionRegistry_1.Extensions.JSONContribution);
    var ConfigurationRegistry = /** @class */ (function () {
        function ConfigurationRegistry() {
            this.overrideIdentifiers = [];
            this._onDidSchemaChange = new event_1.Emitter();
            this.onDidSchemaChange = this._onDidSchemaChange.event;
            this._onDidRegisterConfiguration = new event_1.Emitter();
            this.onDidRegisterConfiguration = this._onDidRegisterConfiguration.event;
            this.configurationContributors = [];
            this.editorConfigurationSchema = { properties: {}, patternProperties: {}, additionalProperties: false, errorMessage: 'Unknown editor configuration setting' };
            this.configurationProperties = {};
            this.excludedConfigurationProperties = {};
            this.computeOverridePropertyPattern();
            contributionRegistry.registerSchema(exports.editorConfigurationSchemaId, this.editorConfigurationSchema);
        }
        ConfigurationRegistry.prototype.registerConfiguration = function (configuration, validate) {
            if (validate === void 0) { validate = true; }
            this.registerConfigurations([configuration], [], validate);
        };
        ConfigurationRegistry.prototype.registerConfigurations = function (configurations, defaultConfigurations, validate) {
            var _this = this;
            if (validate === void 0) { validate = true; }
            var configurationNode = this.toConfiguration(defaultConfigurations);
            if (configurationNode) {
                configurations.push(configurationNode);
            }
            var properties = [];
            configurations.forEach(function (configuration) {
                properties.push.apply(properties, _this.validateAndRegisterProperties(configuration, validate)); // fills in defaults
                _this.configurationContributors.push(configuration);
                _this.registerJSONConfiguration(configuration);
                _this.updateSchemaForOverrideSettingsConfiguration(configuration);
            });
            this._onDidRegisterConfiguration.fire(properties);
        };
        ConfigurationRegistry.prototype.notifyConfigurationSchemaUpdated = function (configuration) {
            contributionRegistry.notifySchemaChanged(exports.editorConfigurationSchemaId);
        };
        ConfigurationRegistry.prototype.registerOverrideIdentifiers = function (overrideIdentifiers) {
            var _a;
            (_a = this.overrideIdentifiers).push.apply(_a, overrideIdentifiers);
            this.updateOverridePropertyPatternKey();
        };
        ConfigurationRegistry.prototype.toConfiguration = function (defaultConfigurations) {
            var configurationNode = {
                id: 'defaultOverrides',
                title: nls.localize(0, null),
                properties: {}
            };
            for (var _i = 0, defaultConfigurations_1 = defaultConfigurations; _i < defaultConfigurations_1.length; _i++) {
                var defaultConfiguration = defaultConfigurations_1[_i];
                for (var key in defaultConfiguration.defaults) {
                    var defaultValue = defaultConfiguration.defaults[key];
                    if (exports.OVERRIDE_PROPERTY_PATTERN.test(key) && typeof defaultValue === 'object') {
                        configurationNode.properties[key] = {
                            type: 'object',
                            default: defaultValue,
                            description: nls.localize(1, null, key),
                            $ref: exports.editorConfigurationSchemaId
                        };
                    }
                }
            }
            return Object.keys(configurationNode.properties).length ? configurationNode : null;
        };
        ConfigurationRegistry.prototype.validateAndRegisterProperties = function (configuration, validate, scope, overridable) {
            if (validate === void 0) { validate = true; }
            if (scope === void 0) { scope = ConfigurationScope.WINDOW; }
            if (overridable === void 0) { overridable = false; }
            scope = types.isUndefinedOrNull(configuration.scope) ? scope : configuration.scope;
            overridable = configuration.overridable || overridable;
            var propertyKeys = [];
            var properties = configuration.properties;
            if (properties) {
                for (var key in properties) {
                    var message = void 0;
                    if (validate && (message = validateProperty(key))) {
                        console.warn(message);
                        delete properties[key];
                        continue;
                    }
                    // fill in default values
                    var property = properties[key];
                    var defaultValue = property.default;
                    if (types.isUndefined(defaultValue)) {
                        property.default = getDefaultValue(property.type);
                    }
                    // Inherit overridable property from parent
                    if (overridable) {
                        property.overridable = true;
                    }
                    if (exports.OVERRIDE_PROPERTY_PATTERN.test(key)) {
                        property.scope = void 0; // No scope for overridable properties `[${identifier}]`
                    }
                    else {
                        property.scope = types.isUndefinedOrNull(property.scope) ? scope : property.scope;
                    }
                    // Add to properties maps
                    // Property is included by default if 'included' is unspecified
                    if (properties[key].hasOwnProperty('included') && !properties[key].included) {
                        this.excludedConfigurationProperties[key] = properties[key];
                        delete properties[key];
                        continue;
                    }
                    else {
                        this.configurationProperties[key] = properties[key];
                    }
                    propertyKeys.push(key);
                }
            }
            var subNodes = configuration.allOf;
            if (subNodes) {
                for (var _i = 0, subNodes_1 = subNodes; _i < subNodes_1.length; _i++) {
                    var node = subNodes_1[_i];
                    propertyKeys.push.apply(propertyKeys, this.validateAndRegisterProperties(node, validate, scope, overridable));
                }
            }
            return propertyKeys;
        };
        ConfigurationRegistry.prototype.getConfigurations = function () {
            return this.configurationContributors;
        };
        ConfigurationRegistry.prototype.getConfigurationProperties = function () {
            return this.configurationProperties;
        };
        ConfigurationRegistry.prototype.getExcludedConfigurationProperties = function () {
            return this.excludedConfigurationProperties;
        };
        ConfigurationRegistry.prototype.registerJSONConfiguration = function (configuration) {
            function register(configuration) {
                var properties = configuration.properties;
                if (properties) {
                    for (var key in properties) {
                        exports.allSettings.properties[key] = properties[key];
                        switch (properties[key].scope) {
                            case ConfigurationScope.APPLICATION:
                                exports.applicationSettings.properties[key] = properties[key];
                                break;
                            case ConfigurationScope.WINDOW:
                                exports.windowSettings.properties[key] = properties[key];
                                break;
                            case ConfigurationScope.RESOURCE:
                                exports.resourceSettings.properties[key] = properties[key];
                                break;
                        }
                    }
                }
                var subNodes = configuration.allOf;
                if (subNodes) {
                    subNodes.forEach(register);
                }
            }
            register(configuration);
            this._onDidSchemaChange.fire();
        };
        ConfigurationRegistry.prototype.updateSchemaForOverrideSettingsConfiguration = function (configuration) {
            if (configuration.id !== SETTINGS_OVERRRIDE_NODE_ID) {
                this.update(configuration);
                contributionRegistry.registerSchema(exports.editorConfigurationSchemaId, this.editorConfigurationSchema);
            }
        };
        ConfigurationRegistry.prototype.updateOverridePropertyPatternKey = function () {
            var patternProperties = exports.allSettings.patternProperties[this.overridePropertyPattern];
            if (!patternProperties) {
                patternProperties = {
                    type: 'object',
                    description: nls.localize(2, null),
                    errorMessage: 'Unknown Identifier. Use language identifiers',
                    $ref: exports.editorConfigurationSchemaId
                };
            }
            delete exports.allSettings.patternProperties[this.overridePropertyPattern];
            delete exports.applicationSettings.patternProperties[this.overridePropertyPattern];
            delete exports.windowSettings.patternProperties[this.overridePropertyPattern];
            delete exports.resourceSettings.patternProperties[this.overridePropertyPattern];
            this.computeOverridePropertyPattern();
            exports.allSettings.patternProperties[this.overridePropertyPattern] = patternProperties;
            exports.applicationSettings.patternProperties[this.overridePropertyPattern] = patternProperties;
            exports.windowSettings.patternProperties[this.overridePropertyPattern] = patternProperties;
            exports.resourceSettings.patternProperties[this.overridePropertyPattern] = patternProperties;
            this._onDidSchemaChange.fire();
        };
        ConfigurationRegistry.prototype.update = function (configuration) {
            var _this = this;
            var properties = configuration.properties;
            if (properties) {
                for (var key in properties) {
                    if (properties[key].overridable) {
                        this.editorConfigurationSchema.properties[key] = this.getConfigurationProperties()[key];
                    }
                }
            }
            var subNodes = configuration.allOf;
            if (subNodes) {
                subNodes.forEach(function (subNode) { return _this.update(subNode); });
            }
        };
        ConfigurationRegistry.prototype.computeOverridePropertyPattern = function () {
            this.overridePropertyPattern = this.overrideIdentifiers.length ? OVERRIDE_PATTERN_WITH_SUBSTITUTION.replace('${0}', this.overrideIdentifiers.map(function (identifier) { return strings.createRegExp(identifier, false).source; }).join('|')) : OVERRIDE_PROPERTY;
        };
        return ConfigurationRegistry;
    }());
    var SETTINGS_OVERRRIDE_NODE_ID = 'override';
    var OVERRIDE_PROPERTY = '\\[.*\\]$';
    var OVERRIDE_PATTERN_WITH_SUBSTITUTION = '\\[(${0})\\]$';
    exports.OVERRIDE_PROPERTY_PATTERN = new RegExp(OVERRIDE_PROPERTY);
    function getDefaultValue(type) {
        var t = Array.isArray(type) ? type[0] : type;
        switch (t) {
            case 'boolean':
                return false;
            case 'integer':
            case 'number':
                return 0;
            case 'string':
                return '';
            case 'array':
                return [];
            case 'object':
                return {};
            default:
                return null;
        }
    }
    var configurationRegistry = new ConfigurationRegistry();
    platform_1.Registry.add(exports.Extensions.Configuration, configurationRegistry);
    function validateProperty(property) {
        if (exports.OVERRIDE_PROPERTY_PATTERN.test(property)) {
            return nls.localize(3, null, property);
        }
        if (configurationRegistry.getConfigurationProperties()[property] !== void 0) {
            return nls.localize(4, null, property);
        }
        return null;
    }
    exports.validateProperty = validateProperty;
    function getScopes() {
        var scopes = {};
        var configurationProperties = configurationRegistry.getConfigurationProperties();
        for (var _i = 0, _a = Object.keys(configurationProperties); _i < _a.length; _i++) {
            var key = _a[_i];
            scopes[key] = configurationProperties[key].scope;
        }
        scopes['launch'] = ConfigurationScope.RESOURCE;
        scopes['task'] = ConfigurationScope.RESOURCE;
        return scopes;
    }
    exports.getScopes = getScopes;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[40/*vs/platform/configuration/common/configuration*/], __M([0/*require*/,1/*exports*/,13/*vs/base/common/objects*/,9/*vs/base/common/types*/,8/*vs/base/common/uri*/,18/*vs/platform/registry/common/platform*/,7/*vs/platform/instantiation/common/instantiation*/,39/*vs/platform/configuration/common/configurationRegistry*/]), function (require, exports, objects, types, uri_1, platform_1, instantiation_1, configurationRegistry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IConfigurationService = instantiation_1.createDecorator('configurationService');
    function isConfigurationOverrides(thing) {
        return thing
            && typeof thing === 'object'
            && (!thing.overrideIdentifier || typeof thing.overrideIdentifier === 'string')
            && (!thing.resource || thing.resource instanceof uri_1.default);
    }
    exports.isConfigurationOverrides = isConfigurationOverrides;
    var ConfigurationTarget;
    (function (ConfigurationTarget) {
        ConfigurationTarget[ConfigurationTarget["USER"] = 1] = "USER";
        ConfigurationTarget[ConfigurationTarget["WORKSPACE"] = 2] = "WORKSPACE";
        ConfigurationTarget[ConfigurationTarget["WORKSPACE_FOLDER"] = 3] = "WORKSPACE_FOLDER";
        ConfigurationTarget[ConfigurationTarget["DEFAULT"] = 4] = "DEFAULT";
        ConfigurationTarget[ConfigurationTarget["MEMORY"] = 5] = "MEMORY";
    })(ConfigurationTarget = exports.ConfigurationTarget || (exports.ConfigurationTarget = {}));
    function compare(from, to) {
        var added = to.keys.filter(function (key) { return from.keys.indexOf(key) === -1; });
        var removed = from.keys.filter(function (key) { return to.keys.indexOf(key) === -1; });
        var updated = [];
        for (var _i = 0, _a = from.keys; _i < _a.length; _i++) {
            var key = _a[_i];
            var value1 = getConfigurationValue(from.contents, key);
            var value2 = getConfigurationValue(to.contents, key);
            if (!objects.equals(value1, value2)) {
                updated.push(key);
            }
        }
        return { added: added, removed: removed, updated: updated };
    }
    exports.compare = compare;
    function toOverrides(raw, conflictReporter) {
        var overrides = [];
        var configurationProperties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
        for (var _i = 0, _a = Object.keys(raw); _i < _a.length; _i++) {
            var key = _a[_i];
            if (configurationRegistry_1.OVERRIDE_PROPERTY_PATTERN.test(key)) {
                var overrideRaw = {};
                for (var keyInOverrideRaw in raw[key]) {
                    if (configurationProperties[keyInOverrideRaw] && configurationProperties[keyInOverrideRaw].overridable) {
                        overrideRaw[keyInOverrideRaw] = raw[key][keyInOverrideRaw];
                    }
                }
                overrides.push({
                    identifiers: [overrideIdentifierFromKey(key).trim()],
                    contents: toValuesTree(overrideRaw, conflictReporter)
                });
            }
        }
        return overrides;
    }
    exports.toOverrides = toOverrides;
    function toValuesTree(properties, conflictReporter) {
        var root = Object.create(null);
        for (var key in properties) {
            addToValueTree(root, key, properties[key], conflictReporter);
        }
        return root;
    }
    exports.toValuesTree = toValuesTree;
    function addToValueTree(settingsTreeRoot, key, value, conflictReporter) {
        var segments = key.split('.');
        var last = segments.pop();
        var curr = settingsTreeRoot;
        for (var i = 0; i < segments.length; i++) {
            var s = segments[i];
            var obj = curr[s];
            switch (typeof obj) {
                case 'undefined':
                    obj = curr[s] = Object.create(null);
                    break;
                case 'object':
                    break;
                default:
                    conflictReporter("Ignoring " + key + " as " + segments.slice(0, i + 1).join('.') + " is " + JSON.stringify(obj));
                    return;
            }
            curr = obj;
        }
        if (typeof curr === 'object') {
            curr[last] = value; // workaround https://github.com/Microsoft/vscode/issues/13606
        }
        else {
            conflictReporter("Ignoring " + key + " as " + segments.join('.') + " is " + JSON.stringify(curr));
        }
    }
    exports.addToValueTree = addToValueTree;
    function removeFromValueTree(valueTree, key) {
        var segments = key.split('.');
        doRemoveFromValueTree(valueTree, segments);
    }
    exports.removeFromValueTree = removeFromValueTree;
    function doRemoveFromValueTree(valueTree, segments) {
        var first = segments.shift();
        if (segments.length === 0) {
            // Reached last segment
            delete valueTree[first];
            return;
        }
        if (Object.keys(valueTree).indexOf(first) !== -1) {
            var value = valueTree[first];
            if (typeof value === 'object' && !Array.isArray(value)) {
                doRemoveFromValueTree(value, segments);
                if (Object.keys(value).length === 0) {
                    delete valueTree[first];
                }
            }
        }
    }
    /**
     * A helper function to get the configuration value with a specific settings path (e.g. config.some.setting)
     */
    function getConfigurationValue(config, settingPath, defaultValue) {
        function accessSetting(config, path) {
            var current = config;
            for (var i = 0; i < path.length; i++) {
                if (typeof current !== 'object' || current === null) {
                    return undefined;
                }
                current = current[path[i]];
            }
            return current;
        }
        var path = settingPath.split('.');
        var result = accessSetting(config, path);
        return typeof result === 'undefined' ? defaultValue : result;
    }
    exports.getConfigurationValue = getConfigurationValue;
    function merge(base, add, overwrite) {
        Object.keys(add).forEach(function (key) {
            if (key in base) {
                if (types.isObject(base[key]) && types.isObject(add[key])) {
                    merge(base[key], add[key], overwrite);
                }
                else if (overwrite) {
                    base[key] = add[key];
                }
            }
            else {
                base[key] = add[key];
            }
        });
    }
    exports.merge = merge;
    function getConfigurationKeys() {
        var properties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
        return Object.keys(properties);
    }
    exports.getConfigurationKeys = getConfigurationKeys;
    function getDefaultValues() {
        var valueTreeRoot = Object.create(null);
        var properties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
        for (var key in properties) {
            var value = properties[key].default;
            addToValueTree(valueTreeRoot, key, value, function (message) { return console.error("Conflict in default settings: " + message); });
        }
        return valueTreeRoot;
    }
    exports.getDefaultValues = getDefaultValues;
    function overrideIdentifierFromKey(key) {
        return key.substring(1, key.length - 1);
    }
    exports.overrideIdentifierFromKey = overrideIdentifierFromKey;
    function keyFromOverrideIdentifier(overrideIdentifier) {
        return "[" + overrideIdentifier + "]";
    }
    exports.keyFromOverrideIdentifier = keyFromOverrideIdentifier;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[94/*vs/platform/telemetry/common/telemetryIpc*/], __M([0/*require*/,1/*exports*/,3/*vs/base/common/winjs.base*/]), function (require, exports, winjs_base_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TelemetryAppenderChannel = /** @class */ (function () {
        function TelemetryAppenderChannel(appender) {
            this.appender = appender;
        }
        TelemetryAppenderChannel.prototype.listen = function (event, arg) {
            throw new Error('No events');
        };
        TelemetryAppenderChannel.prototype.call = function (command, _a) {
            var eventName = _a.eventName, data = _a.data;
            this.appender.log(eventName, data);
            return winjs_base_1.TPromise.as(null);
        };
        return TelemetryAppenderChannel;
    }());
    exports.TelemetryAppenderChannel = TelemetryAppenderChannel;
    var TelemetryAppenderClient = /** @class */ (function () {
        function TelemetryAppenderClient(channel) {
            this.channel = channel;
        }
        TelemetryAppenderClient.prototype.log = function (eventName, data) {
            this.channel.call('log', { eventName: eventName, data: data })
                .done(null, function (err) { return "Failed to log telemetry: " + console.warn(err); });
            return winjs_base_1.TPromise.as(null);
        };
        TelemetryAppenderClient.prototype.dispose = function () {
            // TODO
        };
        return TelemetryAppenderClient;
    }());
    exports.TelemetryAppenderClient = TelemetryAppenderClient;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/






var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(__m[89/*vs/platform/telemetry/common/telemetryService*/], __M([0/*require*/,1/*exports*/,73/*vs/nls!vs/platform/telemetry/common/telemetryService*/,5/*vs/base/common/strings*/,7/*vs/platform/instantiation/common/instantiation*/,40/*vs/platform/configuration/common/configuration*/,39/*vs/platform/configuration/common/configurationRegistry*/,3/*vs/base/common/winjs.base*/,6/*vs/base/common/lifecycle*/,13/*vs/base/common/objects*/,18/*vs/platform/registry/common/platform*/]), function (require, exports, nls_1, strings_1, instantiation_1, configuration_1, configurationRegistry_1, winjs_base_1, lifecycle_1, objects_1, platform_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TelemetryService = /** @class */ (function () {
        function TelemetryService(config, _configurationService) {
            this._configurationService = _configurationService;
            this._disposables = [];
            this._cleanupPatterns = [];
            this._appender = config.appender;
            this._commonProperties = config.commonProperties || winjs_base_1.TPromise.as({});
            this._piiPaths = config.piiPaths || [];
            this._userOptIn = true;
            // static cleanup pattern for: `file:///DANGEROUS/PATH/resources/app/Useful/Information`
            this._cleanupPatterns = [/file:\/\/\/.*?\/resources\/app\//gi];
            for (var _i = 0, _a = this._piiPaths; _i < _a.length; _i++) {
                var piiPath = _a[_i];
                this._cleanupPatterns.push(new RegExp(strings_1.escapeRegExpCharacters(piiPath), 'gi'));
            }
            if (this._configurationService) {
                this._updateUserOptIn();
                this._configurationService.onDidChangeConfiguration(this._updateUserOptIn, this, this._disposables);
                /* __GDPR__
                    "optInStatus" : {
                        "optIn" : { "classification": "SystemMetaData", "purpose": "BusinessInsight", "isMeasurement": true }
                    }
                */
                this.publicLog('optInStatus', { optIn: this._userOptIn });
            }
        }
        TelemetryService.prototype._updateUserOptIn = function () {
            var config = this._configurationService.getValue(TELEMETRY_SECTION_ID);
            this._userOptIn = config ? config.enableTelemetry : this._userOptIn;
        };
        Object.defineProperty(TelemetryService.prototype, "isOptedIn", {
            get: function () {
                return this._userOptIn;
            },
            enumerable: true,
            configurable: true
        });
        TelemetryService.prototype.getTelemetryInfo = function () {
            return this._commonProperties.then(function (values) {
                // well known properties
                var sessionId = values['sessionID'];
                var instanceId = values['common.instanceId'];
                var machineId = values['common.machineId'];
                return { sessionId: sessionId, instanceId: instanceId, machineId: machineId };
            });
        };
        TelemetryService.prototype.dispose = function () {
            this._disposables = lifecycle_1.dispose(this._disposables);
        };
        TelemetryService.prototype.publicLog = function (eventName, data, anonymizeFilePaths) {
            var _this = this;
            // don't send events when the user is optout
            if (!this._userOptIn) {
                return winjs_base_1.TPromise.as(undefined);
            }
            return this._commonProperties.then(function (values) {
                // (first) add common properties
                data = objects_1.mixin(data, values);
                // (last) remove all PII from data
                data = objects_1.cloneAndChange(data, function (value) {
                    if (typeof value === 'string') {
                        return _this._cleanupInfo(value, anonymizeFilePaths);
                    }
                    return undefined;
                });
                _this._appender.log(eventName, data);
            }, function (err) {
                // unsure what to do now...
                console.error(err);
            });
        };
        TelemetryService.prototype._cleanupInfo = function (stack, anonymizeFilePaths) {
            var updatedStack = stack;
            if (anonymizeFilePaths) {
                var cleanUpIndexes = [];
                for (var _i = 0, _a = this._cleanupPatterns; _i < _a.length; _i++) {
                    var regexp = _a[_i];
                    while (true) {
                        var result = regexp.exec(stack);
                        if (!result) {
                            break;
                        }
                        cleanUpIndexes.push([result.index, regexp.lastIndex]);
                    }
                }
                var nodeModulesRegex = /^[\\\/]?(node_modules|node_modules\.asar)[\\\/]/;
                var fileRegex = /(file:\/\/)?([a-zA-Z]:(\\\\|\\|\/)|(\\\\|\\|\/))?([\w-\._]+(\\\\|\\|\/))+[\w-\._]*/g;
                var _loop_1 = function () {
                    var result = fileRegex.exec(stack);
                    if (!result) {
                        return "break";
                    }
                    // Anoynimize user file paths that do not need to be retained or cleaned up.
                    if (!nodeModulesRegex.test(result[0]) && cleanUpIndexes.every(function (_a) {
                        var x = _a[0], y = _a[1];
                        return result.index < x || result.index >= y;
                    })) {
                        updatedStack = updatedStack.slice(0, result.index) + result[0].replace(/./g, 'a') + updatedStack.slice(fileRegex.lastIndex);
                    }
                };
                while (true) {
                    var state_1 = _loop_1();
                    if (state_1 === "break")
                        break;
                }
            }
            // sanitize with configured cleanup patterns
            for (var _b = 0, _c = this._cleanupPatterns; _b < _c.length; _b++) {
                var regexp = _c[_b];
                updatedStack = updatedStack.replace(regexp, '');
            }
            return updatedStack;
        };
        TelemetryService.IDLE_START_EVENT_NAME = 'UserIdleStart';
        TelemetryService.IDLE_STOP_EVENT_NAME = 'UserIdleStop';
        TelemetryService = __decorate([
            __param(1, instantiation_1.optional(configuration_1.IConfigurationService))
        ], TelemetryService);
        return TelemetryService;
    }());
    exports.TelemetryService = TelemetryService;
    var TELEMETRY_SECTION_ID = 'telemetry';
    platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).registerConfiguration({
        'id': TELEMETRY_SECTION_ID,
        'order': 110,
        'type': 'object',
        'title': nls_1.localize(0, null),
        'properties': {
            'telemetry.enableTelemetry': {
                'type': 'boolean',
                'description': nls_1.localize(1, null),
                'default': true,
                'tags': ['usesOnlineServices']
            }
        }
    });
});










define(__m[57/*vs/platform/telemetry/common/telemetryUtils*/], __M([0/*require*/,1/*exports*/,3/*vs/base/common/winjs.base*/,90/*vs/base/common/mime*/,10/*vs/base/common/paths*/,40/*vs/platform/configuration/common/configuration*/,82/*vs/platform/keybinding/common/keybinding*/,14/*vs/platform/log/common/log*/]), function (require, exports, winjs_base_1, mime_1, paths, configuration_1, keybinding_1, log_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NullTelemetryService = new /** @class */ (function () {
        function class_1() {
        }
        class_1.prototype.publicLog = function (eventName, data) {
            return winjs_base_1.TPromise.wrap(null);
        };
        class_1.prototype.getTelemetryInfo = function () {
            return winjs_base_1.TPromise.wrap({
                instanceId: 'someValue.instanceId',
                sessionId: 'someValue.sessionId',
                machineId: 'someValue.machineId'
            });
        };
        return class_1;
    }());
    function combinedAppender() {
        var appenders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            appenders[_i] = arguments[_i];
        }
        return {
            log: function (e, d) { return appenders.forEach(function (a) { return a.log(e, d); }); },
            dispose: function () { return winjs_base_1.TPromise.join(appenders.map(function (a) { return a.dispose(); })); }
        };
    }
    exports.combinedAppender = combinedAppender;
    exports.NullAppender = { log: function () { return null; }, dispose: function () { return winjs_base_1.TPromise.as(null); } };
    var LogAppender = /** @class */ (function () {
        function LogAppender(_logService) {
            this._logService = _logService;
            this.commonPropertiesRegex = /^sessionID$|^version$|^timestamp$|^commitHash$|^common\./;
        }
        LogAppender.prototype.dispose = function () {
            return winjs_base_1.TPromise.as(undefined);
        };
        LogAppender.prototype.log = function (eventName, data) {
            var _this = this;
            var strippedData = {};
            Object.keys(data).forEach(function (key) {
                if (!_this.commonPropertiesRegex.test(key)) {
                    strippedData[key] = data[key];
                }
            });
            this._logService.trace("telemetry/" + eventName, strippedData);
        };
        LogAppender = __decorate([
            __param(0, log_1.ILogService)
        ], LogAppender);
        return LogAppender;
    }());
    exports.LogAppender = LogAppender;
    function telemetryURIDescriptor(uri, hashPath) {
        var fsPath = uri && uri.fsPath;
        return fsPath ? { mimeType: mime_1.guessMimeTypes(fsPath).join(', '), ext: paths.extname(fsPath), path: hashPath(fsPath) } : {};
    }
    exports.telemetryURIDescriptor = telemetryURIDescriptor;
    /**
     * Only add settings that cannot contain any personal/private information of users (PII).
     */
    var configurationValueWhitelist = [
        'editor.tabCompletion',
        'editor.fontFamily',
        'editor.fontWeight',
        'editor.fontSize',
        'editor.lineHeight',
        'editor.letterSpacing',
        'editor.lineNumbers',
        'editor.rulers',
        'editor.wordSeparators',
        'editor.tabSize',
        'editor.insertSpaces',
        'editor.detectIndentation',
        'editor.roundedSelection',
        'editor.scrollBeyondLastLine',
        'editor.minimap.enabled',
        'editor.minimap.side',
        'editor.minimap.renderCharacters',
        'editor.minimap.maxColumn',
        'editor.find.seedSearchStringFromSelection',
        'editor.find.autoFindInSelection',
        'editor.wordWrap',
        'editor.wordWrapColumn',
        'editor.wrappingIndent',
        'editor.mouseWheelScrollSensitivity',
        'editor.multiCursorModifier',
        'editor.quickSuggestions',
        'editor.quickSuggestionsDelay',
        'editor.parameterHints',
        'editor.autoClosingBrackets',
        'editor.autoIndent',
        'editor.formatOnType',
        'editor.formatOnPaste',
        'editor.suggestOnTriggerCharacters',
        'editor.acceptSuggestionOnEnter',
        'editor.acceptSuggestionOnCommitCharacter',
        'editor.snippetSuggestions',
        'editor.emptySelectionClipboard',
        'editor.wordBasedSuggestions',
        'editor.suggestSelection',
        'editor.suggestFontSize',
        'editor.suggestLineHeight',
        'editor.selectionHighlight',
        'editor.occurrencesHighlight',
        'editor.overviewRulerLanes',
        'editor.overviewRulerBorder',
        'editor.cursorBlinking',
        'editor.cursorStyle',
        'editor.mouseWheelZoom',
        'editor.fontLigatures',
        'editor.hideCursorInOverviewRuler',
        'editor.renderWhitespace',
        'editor.renderControlCharacters',
        'editor.renderIndentGuides',
        'editor.renderLineHighlight',
        'editor.codeLens',
        'editor.folding',
        'editor.showFoldingControls',
        'editor.matchBrackets',
        'editor.glyphMargin',
        'editor.useTabStops',
        'editor.trimAutoWhitespace',
        'editor.stablePeek',
        'editor.dragAndDrop',
        'editor.formatOnSave',
        'editor.colorDecorators',
        'breadcrumbs.enabled',
        'breadcrumbs.filePath',
        'breadcrumbs.symbolPath',
        'breadcrumbs.useQuickPick',
        'explorer.openEditors.visible',
        'extensions.autoUpdate',
        'files.associations',
        'files.autoGuessEncoding',
        'files.autoSave',
        'files.autoSaveDelay',
        'files.encoding',
        'files.eol',
        'files.hotExit',
        'files.trimTrailingWhitespace',
        'git.confirmSync',
        'git.enabled',
        'http.proxyStrictSSL',
        'javascript.validate.enable',
        'php.builtInCompletions.enable',
        'php.validate.enable',
        'php.validate.run',
        'terminal.integrated.fontFamily',
        'window.openFilesInNewWindow',
        'window.restoreWindows',
        'window.zoomLevel',
        'workbench.editor.enablePreview',
        'workbench.editor.enablePreviewFromQuickOpen',
        'workbench.editor.showTabs',
        'workbench.editor.swipeToNavigate',
        'workbench.sideBar.location',
        'workbench.startupEditor',
        'workbench.statusBar.visible',
        'workbench.welcome.enabled',
    ];
    function configurationTelemetry(telemetryService, configurationService) {
        return configurationService.onDidChangeConfiguration(function (event) {
            if (event.source !== configuration_1.ConfigurationTarget.DEFAULT) {
                /* __GDPR__
                    "updateConfiguration" : {
                        "configurationSource" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                        "configurationKeys": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
                    }
                */
                telemetryService.publicLog('updateConfiguration', {
                    configurationSource: configuration_1.ConfigurationTarget[event.source],
                    configurationKeys: flattenKeys(event.sourceConfig)
                });
                /* __GDPR__
                    "updateConfigurationValues" : {
                        "configurationSource" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
                        "configurationValues": { "classification": "CustomerContent", "purpose": "FeatureInsight" }
                    }
                */
                telemetryService.publicLog('updateConfigurationValues', {
                    configurationSource: configuration_1.ConfigurationTarget[event.source],
                    configurationValues: flattenValues(event.sourceConfig, configurationValueWhitelist)
                });
            }
        });
    }
    exports.configurationTelemetry = configurationTelemetry;
    function keybindingsTelemetry(telemetryService, keybindingService) {
        return keybindingService.onDidUpdateKeybindings(function (event) {
            if (event.source === keybinding_1.KeybindingSource.User && event.keybindings) {
                /* __GDPR__
                    "updateKeybindings" : {
                        "bindings": { "classification": "CustomerContent", "purpose": "FeatureInsight" }
                    }
                */
                telemetryService.publicLog('updateKeybindings', {
                    bindings: event.keybindings.map(function (binding) { return ({
                        key: binding.key,
                        command: binding.command,
                        when: binding.when,
                        args: binding.args ? true : undefined
                    }); })
                });
            }
        });
    }
    exports.keybindingsTelemetry = keybindingsTelemetry;
    function flattenKeys(value) {
        if (!value) {
            return [];
        }
        var result = [];
        flatKeys(result, '', value);
        return result;
    }
    function flatKeys(result, prefix, value) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.keys(value)
                .forEach(function (key) { return flatKeys(result, prefix ? prefix + "." + key : key, value[key]); });
        }
        else {
            result.push(prefix);
        }
    }
    function flattenValues(value, keys) {
        if (!value) {
            return [];
        }
        return keys.reduce(function (array, key) {
            var _a;
            var v = key.split('.')
                .reduce(function (tmp, k) { return tmp && typeof tmp === 'object' ? tmp[k] : undefined; }, value);
            if (typeof v !== 'undefined') {
                array.push((_a = {}, _a[key] = v, _a));
            }
            return array;
        }, []);
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[47/*vs/platform/telemetry/node/commonProperties*/], __M([0/*require*/,1/*exports*/,4/*vs/base/common/platform*/,15/*os*/,50/*vs/base/node/pfs*/,26/*vs/platform/node/product*/]), function (require, exports, Platform, os, pfs_1, product_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function resolveCommonProperties(commit, version, machineId, installSourcePath) {
        var result = Object.create(null);
        // {{SQL CARBON EDIT}}
        // __GDPR__COMMON__ "common.machineId" : { "endPoint": "MacAddressHash", "classification": "EndUserPseudonymizedInformation", "purpose": "FeatureInsight" }
        // result['common.machineId'] = machineId;
        result['common.machineId'] = '';
        // // __GDPR__COMMON__ "sessionID" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
        // result['sessionID'] = uuid.generateUuid() + Date.now();
        result['sessionID'] = '';
        // __GDPR__COMMON__ "commitHash" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
        result['commitHash'] = '';
        // __GDPR__COMMON__ "version" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
        result['version'] = version;
        // __GDPR__COMMON__ "common.platformVersion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
        result['common.platformVersion'] = (os.release() || '').replace(/^(\d+)(\.\d+)?(\.\d+)?(.*)/, '$1$2$3');
        // __GDPR__COMMON__ "common.platform" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
        result['common.platform'] = Platform.Platform[Platform.platform];
        // __GDPR__COMMON__ "common.nodePlatform" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
        result['common.nodePlatform'] = process.platform;
        // __GDPR__COMMON__ "common.nodeArch" : { "classification": "SystemMetaData", "purpose": "PerformanceAndHealth" }
        result['common.nodeArch'] = process.arch;
        // {{SQL CARBON EDIT}}
        result['common.application.name'] = product_1.default.nameLong;
        // dynamic properties which value differs on each call
        var seq = 0;
        var startTime = Date.now();
        Object.defineProperties(result, {
            // __GDPR__COMMON__ "timestamp" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
            'timestamp': {
                get: function () { return new Date(); },
                enumerable: true
            },
            // __GDPR__COMMON__ "common.timesincesessionstart" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
            'common.timesincesessionstart': {
                get: function () { return Date.now() - startTime; },
                enumerable: true
            },
            // __GDPR__COMMON__ "common.sequence" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
            'common.sequence': {
                get: function () { return seq++; },
                enumerable: true
            }
        });
        return pfs_1.readFile(installSourcePath, 'utf8').then(function (contents) {
            // __GDPR__COMMON__ "common.source" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
            result['common.source'] = contents.slice(0, 30);
            return result;
        }, function (error) {
            return result;
        });
    }
    exports.resolveCommonProperties = resolveCommonProperties;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/









define(__m[46/*vs/platform/windows/common/windows*/], __M([0/*require*/,1/*exports*/,3/*vs/base/common/winjs.base*/,7/*vs/platform/instantiation/common/instantiation*/,2/*vs/base/common/event*/,6/*vs/base/common/lifecycle*/]), function (require, exports, winjs_base_1, instantiation_1, event_1, lifecycle_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IWindowsService = instantiation_1.createDecorator('windowsService');
    exports.IWindowService = instantiation_1.createDecorator('windowService');
    var OpenContext;
    (function (OpenContext) {
        // opening when running from the command line
        OpenContext[OpenContext["CLI"] = 0] = "CLI";
        // macOS only: opening from the dock (also when opening files to a running instance from desktop)
        OpenContext[OpenContext["DOCK"] = 1] = "DOCK";
        // opening from the main application window
        OpenContext[OpenContext["MENU"] = 2] = "MENU";
        // opening from a file or folder dialog
        OpenContext[OpenContext["DIALOG"] = 3] = "DIALOG";
        // opening from the OS's UI
        OpenContext[OpenContext["DESKTOP"] = 4] = "DESKTOP";
        // opening through the API
        OpenContext[OpenContext["API"] = 5] = "API";
    })(OpenContext = exports.OpenContext || (exports.OpenContext = {}));
    var ReadyState;
    (function (ReadyState) {
        /**
         * This window has not loaded any HTML yet
         */
        ReadyState[ReadyState["NONE"] = 0] = "NONE";
        /**
         * This window is loading HTML
         */
        ReadyState[ReadyState["LOADING"] = 1] = "LOADING";
        /**
         * This window is navigating to another HTML
         */
        ReadyState[ReadyState["NAVIGATING"] = 2] = "NAVIGATING";
        /**
         * This window is done loading HTML
         */
        ReadyState[ReadyState["READY"] = 3] = "READY";
    })(ReadyState = exports.ReadyState || (exports.ReadyState = {}));
    var ActiveWindowManager = /** @class */ (function () {
        function ActiveWindowManager(windowsService) {
            var _this = this;
            this.disposables = [];
            var onActiveWindowChange = event_1.latch(event_1.anyEvent(windowsService.onWindowOpen, windowsService.onWindowFocus));
            onActiveWindowChange(this.setActiveWindow, this, this.disposables);
            this.firstActiveWindowIdPromise = windowsService.getActiveWindowId()
                .then(function (id) { return (typeof _this._activeWindowId === 'undefined') && _this.setActiveWindow(id); });
        }
        ActiveWindowManager.prototype.setActiveWindow = function (windowId) {
            if (this.firstActiveWindowIdPromise) {
                this.firstActiveWindowIdPromise = null;
            }
            this._activeWindowId = windowId;
        };
        ActiveWindowManager.prototype.getActiveClientId = function () {
            if (this.firstActiveWindowIdPromise) {
                return this.firstActiveWindowIdPromise;
            }
            return winjs_base_1.TPromise.as("window:" + this._activeWindowId);
        };
        ActiveWindowManager.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        ActiveWindowManager = __decorate([
            __param(0, exports.IWindowsService)
        ], ActiveWindowManager);
        return ActiveWindowManager;
    }());
    exports.ActiveWindowManager = ActiveWindowManager;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[45/*vs/platform/workspaces/common/workspaces*/], __M([0/*require*/,1/*exports*/,7/*vs/platform/instantiation/common/instantiation*/,77/*vs/platform/files/common/files*/,74/*vs/nls!vs/platform/workspaces/common/workspaces*/,10/*vs/base/common/paths*/,4/*vs/base/common/platform*/,60/*vs/base/common/labels*/,8/*vs/base/common/uri*/,23/*vs/base/common/network*/]), function (require, exports, instantiation_1, files_1, nls_1, paths_1, platform_1, labels_1, uri_1, network_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IWorkspacesMainService = instantiation_1.createDecorator('workspacesMainService');
    exports.IWorkspacesService = instantiation_1.createDecorator('workspacesService');
    exports.WORKSPACE_EXTENSION = 'code-workspace';
    exports.WORKSPACE_FILTER = [{ name: nls_1.localize(0, null), extensions: [exports.WORKSPACE_EXTENSION] }];
    exports.UNTITLED_WORKSPACE_NAME = 'workspace.json';
    function isStoredWorkspaceFolder(thing) {
        return isRawFileWorkspaceFolder(thing) || isRawUriWorkspaceFolder(thing);
    }
    exports.isStoredWorkspaceFolder = isStoredWorkspaceFolder;
    function isRawFileWorkspaceFolder(thing) {
        return thing
            && typeof thing === 'object'
            && typeof thing.path === 'string'
            && (!thing.name || typeof thing.name === 'string');
    }
    exports.isRawFileWorkspaceFolder = isRawFileWorkspaceFolder;
    function isRawUriWorkspaceFolder(thing) {
        return thing
            && typeof thing === 'object'
            && typeof thing.uri === 'string'
            && (!thing.name || typeof thing.name === 'string');
    }
    exports.isRawUriWorkspaceFolder = isRawUriWorkspaceFolder;
    function getWorkspaceLabel(workspace, environmentService, uriDisplayService, options) {
        // Workspace: Single Folder
        if (isSingleFolderWorkspaceIdentifier(workspace)) {
            // Folder on disk
            if (workspace.scheme === network_1.Schemas.file) {
                return options && options.verbose ? uriDisplayService.getLabel(workspace) : labels_1.getBaseLabel(workspace);
            }
            // Remote folder
            return options && options.verbose ? uriDisplayService.getLabel(workspace) : labels_1.getBaseLabel(workspace) + " (" + workspace.scheme + ")";
        }
        // Workspace: Untitled
        if (files_1.isParent(workspace.configPath, environmentService.workspacesHome, !platform_1.isLinux /* ignore case */)) {
            return nls_1.localize(1, null);
        }
        // Workspace: Saved
        var filename = paths_1.basename(workspace.configPath);
        var workspaceName = filename.substr(0, filename.length - exports.WORKSPACE_EXTENSION.length - 1);
        if (options && options.verbose) {
            return nls_1.localize(2, null, uriDisplayService.getLabel(uri_1.default.file(paths_1.join(paths_1.dirname(workspace.configPath), workspaceName))));
        }
        return nls_1.localize(3, null, workspaceName);
    }
    exports.getWorkspaceLabel = getWorkspaceLabel;
    function isSingleFolderWorkspaceIdentifier(obj) {
        return obj instanceof uri_1.default;
    }
    exports.isSingleFolderWorkspaceIdentifier = isSingleFolderWorkspaceIdentifier;
    function isWorkspaceIdentifier(obj) {
        var workspaceIdentifier = obj;
        return workspaceIdentifier && typeof workspaceIdentifier.id === 'string' && typeof workspaceIdentifier.configPath === 'string';
    }
    exports.isWorkspaceIdentifier = isWorkspaceIdentifier;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[93/*vs/platform/windows/common/windowsIpc*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/event*/,45/*vs/platform/workspaces/common/workspaces*/,8/*vs/base/common/uri*/]), function (require, exports, event_1, workspaces_1, uri_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WindowsChannel = /** @class */ (function () {
        function WindowsChannel(service) {
            this.service = service;
            this.onWindowOpen = event_1.buffer(service.onWindowOpen, true);
            this.onWindowFocus = event_1.buffer(service.onWindowFocus, true);
            this.onWindowBlur = event_1.buffer(service.onWindowBlur, true);
            this.onWindowMaximize = event_1.buffer(service.onWindowMaximize, true);
            this.onWindowUnmaximize = event_1.buffer(service.onWindowUnmaximize, true);
            this.onRecentlyOpenedChange = event_1.buffer(service.onRecentlyOpenedChange, true);
        }
        WindowsChannel.prototype.listen = function (event, arg) {
            switch (event) {
                case 'onWindowOpen': return this.onWindowOpen;
                case 'onWindowFocus': return this.onWindowFocus;
                case 'onWindowBlur': return this.onWindowBlur;
                case 'onWindowMaximize': return this.onWindowMaximize;
                case 'onWindowUnmaximize': return this.onWindowUnmaximize;
                case 'onRecentlyOpenedChange': return this.onRecentlyOpenedChange;
            }
            throw new Error('No event found');
        };
        WindowsChannel.prototype.call = function (command, arg) {
            switch (command) {
                case 'pickFileFolderAndOpen': return this.service.pickFileFolderAndOpen(arg);
                case 'pickFileAndOpen': return this.service.pickFileAndOpen(arg);
                case 'pickFolderAndOpen': return this.service.pickFolderAndOpen(arg);
                case 'pickWorkspaceAndOpen': return this.service.pickWorkspaceAndOpen(arg);
                case 'showMessageBox': return this.service.showMessageBox(arg[0], arg[1]);
                case 'showSaveDialog': return this.service.showSaveDialog(arg[0], arg[1]);
                case 'showOpenDialog': return this.service.showOpenDialog(arg[0], arg[1]);
                case 'reloadWindow': return this.service.reloadWindow(arg[0], arg[1]);
                case 'openDevTools': return this.service.openDevTools(arg[0], arg[1]);
                case 'toggleDevTools': return this.service.toggleDevTools(arg);
                case 'closeWorkspace': return this.service.closeWorkspace(arg);
                case 'enterWorkspace': return this.service.enterWorkspace(arg[0], arg[1]);
                case 'createAndEnterWorkspace': {
                    var rawFolders = arg[1];
                    var folders = void 0;
                    if (Array.isArray(rawFolders)) {
                        folders = rawFolders.map(function (rawFolder) {
                            return {
                                uri: uri_1.default.revive(rawFolder.uri),
                                name: rawFolder.name
                            };
                        });
                    }
                    return this.service.createAndEnterWorkspace(arg[0], folders, arg[2]);
                }
                case 'saveAndEnterWorkspace': return this.service.saveAndEnterWorkspace(arg[0], arg[1]);
                case 'toggleFullScreen': return this.service.toggleFullScreen(arg);
                case 'setRepresentedFilename': return this.service.setRepresentedFilename(arg[0], arg[1]);
                case 'addRecentlyOpened': return this.service.addRecentlyOpened(arg);
                case 'removeFromRecentlyOpened': {
                    var paths = arg;
                    if (Array.isArray(paths)) {
                        paths = paths.map(function (path) { return workspaces_1.isWorkspaceIdentifier(path) || typeof path === 'string' ? path : uri_1.default.revive(path); });
                    }
                    return this.service.removeFromRecentlyOpened(paths);
                }
                case 'clearRecentlyOpened': return this.service.clearRecentlyOpened();
                case 'showPreviousWindowTab': return this.service.showPreviousWindowTab();
                case 'showNextWindowTab': return this.service.showNextWindowTab();
                case 'moveWindowTabToNewWindow': return this.service.moveWindowTabToNewWindow();
                case 'mergeAllWindowTabs': return this.service.mergeAllWindowTabs();
                case 'toggleWindowTabsBar': return this.service.toggleWindowTabsBar();
                case 'updateTouchBar': return this.service.updateTouchBar(arg[0], arg[1]);
                case 'getRecentlyOpened': return this.service.getRecentlyOpened(arg);
                case 'focusWindow': return this.service.focusWindow(arg);
                case 'closeWindow': return this.service.closeWindow(arg);
                case 'isFocused': return this.service.isFocused(arg);
                case 'isMaximized': return this.service.isMaximized(arg);
                case 'maximizeWindow': return this.service.maximizeWindow(arg);
                case 'unmaximizeWindow': return this.service.unmaximizeWindow(arg);
                case 'minimizeWindow': return this.service.minimizeWindow(arg);
                case 'onWindowTitleDoubleClick': return this.service.onWindowTitleDoubleClick(arg);
                case 'setDocumentEdited': return this.service.setDocumentEdited(arg[0], arg[1]);
                case 'openWindow': return this.service.openWindow(arg[0], arg[1] ? arg[1].map(function (r) { return uri_1.default.revive(r); }) : arg[1], arg[2]);
                case 'openNewWindow': return this.service.openNewWindow();
                case 'showWindow': return this.service.showWindow(arg);
                case 'getWindows': return this.service.getWindows();
                case 'getWindowCount': return this.service.getWindowCount();
                case 'relaunch': return this.service.relaunch(arg[0]);
                case 'whenSharedProcessReady': return this.service.whenSharedProcessReady();
                case 'toggleSharedProcess': return this.service.toggleSharedProcess();
                case 'quit': return this.service.quit();
                case 'log': return this.service.log(arg[0], arg[1]);
                case 'showItemInFolder': return this.service.showItemInFolder(arg);
                case 'getActiveWindowId': return this.service.getActiveWindowId();
                case 'openExternal': return this.service.openExternal(arg);
                case 'startCrashReporter': return this.service.startCrashReporter(arg);
                case 'openAboutDialog': return this.service.openAboutDialog();
            }
            return undefined;
        };
        return WindowsChannel;
    }());
    exports.WindowsChannel = WindowsChannel;
    var WindowsChannelClient = /** @class */ (function () {
        function WindowsChannelClient(channel) {
            this.channel = channel;
        }
        Object.defineProperty(WindowsChannelClient.prototype, "onWindowOpen", {
            get: function () { return this.channel.listen('onWindowOpen'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WindowsChannelClient.prototype, "onWindowFocus", {
            get: function () { return this.channel.listen('onWindowFocus'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WindowsChannelClient.prototype, "onWindowBlur", {
            get: function () { return this.channel.listen('onWindowBlur'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WindowsChannelClient.prototype, "onWindowMaximize", {
            get: function () { return this.channel.listen('onWindowMaximize'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WindowsChannelClient.prototype, "onWindowUnmaximize", {
            get: function () { return this.channel.listen('onWindowUnmaximize'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WindowsChannelClient.prototype, "onRecentlyOpenedChange", {
            get: function () { return this.channel.listen('onRecentlyOpenedChange'); },
            enumerable: true,
            configurable: true
        });
        WindowsChannelClient.prototype.pickFileFolderAndOpen = function (options) {
            return this.channel.call('pickFileFolderAndOpen', options);
        };
        WindowsChannelClient.prototype.pickFileAndOpen = function (options) {
            return this.channel.call('pickFileAndOpen', options);
        };
        WindowsChannelClient.prototype.pickFolderAndOpen = function (options) {
            return this.channel.call('pickFolderAndOpen', options);
        };
        WindowsChannelClient.prototype.pickWorkspaceAndOpen = function (options) {
            return this.channel.call('pickWorkspaceAndOpen', options);
        };
        WindowsChannelClient.prototype.showMessageBox = function (windowId, options) {
            return this.channel.call('showMessageBox', [windowId, options]);
        };
        WindowsChannelClient.prototype.showSaveDialog = function (windowId, options) {
            return this.channel.call('showSaveDialog', [windowId, options]);
        };
        WindowsChannelClient.prototype.showOpenDialog = function (windowId, options) {
            return this.channel.call('showOpenDialog', [windowId, options]);
        };
        WindowsChannelClient.prototype.reloadWindow = function (windowId, args) {
            return this.channel.call('reloadWindow', [windowId, args]);
        };
        WindowsChannelClient.prototype.openDevTools = function (windowId, options) {
            return this.channel.call('openDevTools', [windowId, options]);
        };
        WindowsChannelClient.prototype.toggleDevTools = function (windowId) {
            return this.channel.call('toggleDevTools', windowId);
        };
        WindowsChannelClient.prototype.closeWorkspace = function (windowId) {
            return this.channel.call('closeWorkspace', windowId);
        };
        WindowsChannelClient.prototype.enterWorkspace = function (windowId, path) {
            return this.channel.call('enterWorkspace', [windowId, path]);
        };
        WindowsChannelClient.prototype.createAndEnterWorkspace = function (windowId, folders, path) {
            return this.channel.call('createAndEnterWorkspace', [windowId, folders, path]);
        };
        WindowsChannelClient.prototype.saveAndEnterWorkspace = function (windowId, path) {
            return this.channel.call('saveAndEnterWorkspace', [windowId, path]);
        };
        WindowsChannelClient.prototype.toggleFullScreen = function (windowId) {
            return this.channel.call('toggleFullScreen', windowId);
        };
        WindowsChannelClient.prototype.setRepresentedFilename = function (windowId, fileName) {
            return this.channel.call('setRepresentedFilename', [windowId, fileName]);
        };
        WindowsChannelClient.prototype.addRecentlyOpened = function (files) {
            return this.channel.call('addRecentlyOpened', files);
        };
        WindowsChannelClient.prototype.removeFromRecentlyOpened = function (paths) {
            return this.channel.call('removeFromRecentlyOpened', paths);
        };
        WindowsChannelClient.prototype.clearRecentlyOpened = function () {
            return this.channel.call('clearRecentlyOpened');
        };
        WindowsChannelClient.prototype.getRecentlyOpened = function (windowId) {
            return this.channel.call('getRecentlyOpened', windowId)
                .then(function (recentlyOpened) {
                recentlyOpened.workspaces = recentlyOpened.workspaces.map(function (workspace) { return workspaces_1.isWorkspaceIdentifier(workspace) ? workspace : uri_1.default.revive(workspace); });
                return recentlyOpened;
            });
        };
        WindowsChannelClient.prototype.showPreviousWindowTab = function () {
            return this.channel.call('showPreviousWindowTab');
        };
        WindowsChannelClient.prototype.showNextWindowTab = function () {
            return this.channel.call('showNextWindowTab');
        };
        WindowsChannelClient.prototype.moveWindowTabToNewWindow = function () {
            return this.channel.call('moveWindowTabToNewWindow');
        };
        WindowsChannelClient.prototype.mergeAllWindowTabs = function () {
            return this.channel.call('mergeAllWindowTabs');
        };
        WindowsChannelClient.prototype.toggleWindowTabsBar = function () {
            return this.channel.call('toggleWindowTabsBar');
        };
        WindowsChannelClient.prototype.focusWindow = function (windowId) {
            return this.channel.call('focusWindow', windowId);
        };
        WindowsChannelClient.prototype.closeWindow = function (windowId) {
            return this.channel.call('closeWindow', windowId);
        };
        WindowsChannelClient.prototype.isFocused = function (windowId) {
            return this.channel.call('isFocused', windowId);
        };
        WindowsChannelClient.prototype.isMaximized = function (windowId) {
            return this.channel.call('isMaximized', windowId);
        };
        WindowsChannelClient.prototype.maximizeWindow = function (windowId) {
            return this.channel.call('maximizeWindow', windowId);
        };
        WindowsChannelClient.prototype.unmaximizeWindow = function (windowId) {
            return this.channel.call('unmaximizeWindow', windowId);
        };
        WindowsChannelClient.prototype.minimizeWindow = function (windowId) {
            return this.channel.call('minimizeWindow', windowId);
        };
        WindowsChannelClient.prototype.onWindowTitleDoubleClick = function (windowId) {
            return this.channel.call('onWindowTitleDoubleClick', windowId);
        };
        WindowsChannelClient.prototype.setDocumentEdited = function (windowId, flag) {
            return this.channel.call('setDocumentEdited', [windowId, flag]);
        };
        WindowsChannelClient.prototype.quit = function () {
            return this.channel.call('quit');
        };
        WindowsChannelClient.prototype.relaunch = function (options) {
            return this.channel.call('relaunch', [options]);
        };
        WindowsChannelClient.prototype.whenSharedProcessReady = function () {
            return this.channel.call('whenSharedProcessReady');
        };
        WindowsChannelClient.prototype.toggleSharedProcess = function () {
            return this.channel.call('toggleSharedProcess');
        };
        WindowsChannelClient.prototype.openWindow = function (windowId, paths, options) {
            return this.channel.call('openWindow', [windowId, paths, options]);
        };
        WindowsChannelClient.prototype.openNewWindow = function () {
            return this.channel.call('openNewWindow');
        };
        WindowsChannelClient.prototype.showWindow = function (windowId) {
            return this.channel.call('showWindow', windowId);
        };
        WindowsChannelClient.prototype.getWindows = function () {
            return this.channel.call('getWindows').then(function (result) { result.forEach(function (win) { return win.folderUri = win.folderUri ? uri_1.default.revive(win.folderUri) : win.folderUri; }); return result; });
        };
        WindowsChannelClient.prototype.getWindowCount = function () {
            return this.channel.call('getWindowCount');
        };
        WindowsChannelClient.prototype.log = function (severity) {
            var messages = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                messages[_i - 1] = arguments[_i];
            }
            return this.channel.call('log', [severity, messages]);
        };
        WindowsChannelClient.prototype.showItemInFolder = function (path) {
            return this.channel.call('showItemInFolder', path);
        };
        WindowsChannelClient.prototype.getActiveWindowId = function () {
            return this.channel.call('getActiveWindowId');
        };
        WindowsChannelClient.prototype.openExternal = function (url) {
            return this.channel.call('openExternal', url);
        };
        WindowsChannelClient.prototype.startCrashReporter = function (config) {
            return this.channel.call('startCrashReporter', config);
        };
        WindowsChannelClient.prototype.updateTouchBar = function (windowId, items) {
            return this.channel.call('updateTouchBar', [windowId, items]);
        };
        WindowsChannelClient.prototype.openAboutDialog = function () {
            return this.channel.call('openAboutDialog');
        };
        return WindowsChannelClient;
    }());
    exports.WindowsChannelClient = WindowsChannelClient;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
















define(__m[101/*vs/code/electron-browser/issue/issueReporterMain*/], __M([0/*require*/,1/*exports*/,55/*electron*/,17/*vs/nls!vs/code/electron-browser/issue/issueReporterMain*/,16/*vs/base/browser/dom*/,35/*vs/base/common/collections*/,21/*vs/base/browser/browser*/,5/*vs/base/common/strings*/,26/*vs/platform/node/product*/,36/*vs/platform/node/package*/,15/*os*/,25/*vs/base/common/decorators*/,4/*vs/base/common/platform*/,6/*vs/base/common/lifecycle*/,54/*vs/base/parts/ipc/electron-browser/ipc.electron-browser*/,22/*vs/base/parts/ipc/common/ipc*/,56/*vs/base/parts/ipc/node/ipc.net*/,33/*vs/platform/instantiation/common/serviceCollection*/,46/*vs/platform/windows/common/windows*/,57/*vs/platform/telemetry/common/telemetryUtils*/,89/*vs/platform/telemetry/common/telemetryService*/,94/*vs/platform/telemetry/common/telemetryIpc*/,79/*vs/platform/instantiation/common/instantiationService*/,47/*vs/platform/telemetry/node/commonProperties*/,93/*vs/platform/windows/common/windowsIpc*/,88/*vs/platform/environment/node/environmentService*/,81/*vs/code/electron-browser/issue/issueReporterModel*/,34/*vs/platform/issue/common/issue*/,71/*vs/code/electron-browser/issue/issueReporterPage*/,85/*vs/platform/log/node/spdlogService*/,84/*vs/platform/log/common/logIpc*/,14/*vs/platform/log/common/log*/,66/*vs/base/browser/ui/octiconLabel/octiconLabel*/,58/*vs/code/electron-browser/issue/issueReporterUtil*/,63/*vs/base/browser/ui/button/button*/,67/*vs/css!vs/code/electron-browser/issue/media/issueReporter*/]), function (require, exports, electron_1, nls_1, dom_1, collections, browser, strings_1, product_1, package_1, os, decorators_1, platform, lifecycle_1, ipc_electron_browser_1, ipc_1, ipc_net_1, serviceCollection_1, windows_1, telemetryUtils_1, telemetryService_1, telemetryIpc_1, instantiationService_1, commonProperties_1, windowsIpc_1, environmentService_1, issueReporterModel_1, issue_1, issueReporterPage_1, spdlogService_1, logIpc_1, log_1, octiconLabel_1, issueReporterUtil_1, button_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MAX_URL_LENGTH = platform.isWindows ? 2081 : 5400;
    function startup(configuration) {
        document.body.innerHTML = issueReporterPage_1.default();
        var issueReporter = new IssueReporter(configuration);
        issueReporter.render();
        document.body.style.display = 'block';
    }
    exports.startup = startup;
    var IssueReporter = /** @class */ (function (_super) {
        __extends(IssueReporter, _super);
        function IssueReporter(configuration) {
            var _this = _super.call(this) || this;
            _this.numberOfSearchResultsDisplayed = 0;
            _this.receivedSystemInfo = false;
            _this.receivedPerformanceInfo = false;
            _this.shouldQueueSearch = false;
            _this.updateSystemInfo = function (state) {
                var target = document.querySelector('.block-system .block-info');
                var tableHtml = '';
                Object.keys(state.systemInfo).forEach(function (k) {
                    var data = typeof state.systemInfo[k] === 'object'
                        ? Object.keys(state.systemInfo[k]).map(function (key) { return key + ": " + state.systemInfo[k][key]; }).join('<br>')
                        : state.systemInfo[k];
                    tableHtml += "\n\t\t\t\t<tr>\n\t\t\t\t\t<td>" + k + "</td>\n\t\t\t\t\t<td>" + data + "</td>\n\t\t\t\t</tr>";
                });
                target.innerHTML = "<table>" + tableHtml + "</table>";
            };
            _this.updateProcessInfo = function (state) {
                var target = document.querySelector('.block-process .block-info');
                target.innerHTML = "<code>" + state.processInfo + "</code>";
            };
            _this.updateWorkspaceInfo = function (state) {
                document.querySelector('.block-workspace .block-info code').textContent = '\n' + state.workspaceInfo;
            };
            _this.initServices(configuration);
            _this.issueReporterModel = new issueReporterModel_1.IssueReporterModel({
                issueType: configuration.data.issueType || issue_1.IssueType.Bug,
                versionInfo: {
                    vscodeVersion: package_1.default.name + " " + package_1.default.version + " (" + (product_1.default.commit || 'Commit unknown') + ", " + (product_1.default.date || 'Date unknown') + ")",
                    os: os.type() + " " + os.arch() + " " + os.release()
                },
                extensionsDisabled: !!_this.environmentService.disableExtensions,
            });
            _this.previewButton = new button_1.Button(document.getElementById('issue-reporter'));
            electron_1.ipcRenderer.on('issuePerformanceInfoResponse', function (event, info) {
                _this.logService.trace('issueReporter: Received performance data');
                _this.issueReporterModel.update(info);
                _this.receivedPerformanceInfo = true;
                var state = _this.issueReporterModel.getData();
                _this.updateProcessInfo(state);
                _this.updateWorkspaceInfo(state);
                _this.updatePreviewButtonState();
            });
            electron_1.ipcRenderer.on('issueSystemInfoResponse', function (event, info) {
                _this.logService.trace('issueReporter: Received system data');
                _this.issueReporterModel.update({ systemInfo: info });
                _this.receivedSystemInfo = true;
                _this.updateSystemInfo(_this.issueReporterModel.getData());
                _this.updatePreviewButtonState();
            });
            electron_1.ipcRenderer.send('issueSystemInfoRequest');
            if (configuration.data.issueType === issue_1.IssueType.PerformanceIssue) {
                electron_1.ipcRenderer.send('issuePerformanceInfoRequest');
            }
            _this.logService.trace('issueReporter: Sent data requests');
            if (window.document.documentElement.lang !== 'en') {
                show(document.getElementById('english'));
            }
            _this.setUpTypes();
            _this.setEventHandlers();
            _this.applyZoom(configuration.data.zoomLevel);
            _this.applyStyles(configuration.data.styles);
            _this.handleExtensionData(configuration.data.enabledExtensions);
            if (configuration.data.issueType === issue_1.IssueType.SettingsSearchIssue) {
                _this.handleSettingsSearchData(configuration.data);
            }
            return _this;
        }
        IssueReporter.prototype.render = function () {
            this.renderBlocks();
        };
        IssueReporter.prototype.applyZoom = function (zoomLevel) {
            electron_1.webFrame.setZoomLevel(zoomLevel);
            browser.setZoomFactor(electron_1.webFrame.getZoomFactor());
            // See https://github.com/Microsoft/vscode/issues/26151
            // Cannot be trusted because the webFrame might take some time
            // until it really applies the new zoom level
            browser.setZoomLevel(electron_1.webFrame.getZoomLevel(), /*isTrusted*/ false);
        };
        IssueReporter.prototype.applyStyles = function (styles) {
            var styleTag = document.createElement('style');
            var content = [];
            if (styles.inputBackground) {
                content.push("input[type=\"text\"], textarea, select, .issues-container > .issue > .issue-state, .block-info { background-color: " + styles.inputBackground + "; }");
            }
            if (styles.inputBorder) {
                content.push("input[type=\"text\"], textarea, select { border: 1px solid " + styles.inputBorder + "; }");
            }
            else {
                content.push("input[type=\"text\"], textarea, select { border: 1px solid transparent; }");
            }
            if (styles.inputForeground) {
                content.push("input[type=\"text\"], textarea, select, .issues-container > .issue > .issue-state, .block-info { color: " + styles.inputForeground + "; }");
            }
            if (styles.inputErrorBorder) {
                content.push(".invalid-input, .invalid-input:focus { border: 1px solid " + styles.inputErrorBorder + " !important; }");
                content.push(".validation-error, .required-input { color: " + styles.inputErrorBorder + "; }");
            }
            if (styles.inputActiveBorder) {
                content.push("input[type='text']:focus, textarea:focus, select:focus, summary:focus, button:focus, a:focus, .workbenchCommand:focus  { border: 1px solid " + styles.inputActiveBorder + "; outline-style: none; }");
            }
            if (styles.textLinkColor) {
                content.push("a, .workbenchCommand { color: " + styles.textLinkColor + "; }");
            }
            if (styles.textLinkColor) {
                content.push("a { color: " + styles.textLinkColor + "; }");
            }
            if (styles.textLinkActiveForeground) {
                content.push("a:hover, .workbenchCommand:hover { color: " + styles.textLinkActiveForeground + "; }");
            }
            if (styles.sliderBackgroundColor) {
                content.push("::-webkit-scrollbar-thumb { background-color: " + styles.sliderBackgroundColor + "; }");
            }
            if (styles.sliderActiveColor) {
                content.push("::-webkit-scrollbar-thumb:active { background-color: " + styles.sliderActiveColor + "; }");
            }
            if (styles.sliderHoverColor) {
                content.push("::--webkit-scrollbar-thumb:hover { background-color: " + styles.sliderHoverColor + "; }");
            }
            if (styles.buttonBackground) {
                content.push(".monaco-text-button { background-color: " + styles.buttonBackground + " !important; }");
            }
            if (styles.buttonForeground) {
                content.push(".monaco-text-button { color: " + styles.buttonForeground + " !important; }");
            }
            if (styles.buttonHoverBackground) {
                content.push(".monaco-text-button:hover, .monaco-text-button:focus { background-color: " + styles.buttonHoverBackground + " !important; }");
            }
            styleTag.innerHTML = content.join('\n');
            document.head.appendChild(styleTag);
            document.body.style.color = styles.color;
        };
        IssueReporter.prototype.handleExtensionData = function (extensions) {
            var _a = collections.groupBy(extensions, function (ext) {
                var manifestKeys = ext.manifest.contributes ? Object.keys(ext.manifest.contributes) : [];
                var onlyTheme = !ext.manifest.activationEvents && manifestKeys.length === 1 && manifestKeys[0] === 'themes';
                return onlyTheme ? 'themes' : 'nonThemes';
            }), nonThemes = _a.nonThemes, themes = _a.themes;
            var numberOfThemeExtesions = themes && themes.length;
            this.issueReporterModel.update({ numberOfThemeExtesions: numberOfThemeExtesions, enabledNonThemeExtesions: nonThemes, allExtensions: extensions });
            this.updateExtensionTable(nonThemes, numberOfThemeExtesions);
            if (this.environmentService.disableExtensions || extensions.length === 0) {
                document.getElementById('disableExtensions').disabled = true;
            }
            this.updateExtensionSelector(extensions);
        };
        IssueReporter.prototype.handleSettingsSearchData = function (data) {
            this.issueReporterModel.update({
                actualSearchResults: data.actualSearchResults,
                query: data.query,
                filterResultCount: data.filterResultCount
            });
            this.updateSearchedExtensionTable(data.enabledExtensions);
            this.updateSettingsSearchDetails(data);
        };
        IssueReporter.prototype.updateSettingsSearchDetails = function (data) {
            var target = document.querySelector('.block-settingsSearchResults .block-info');
            var details = "\n\t\t\t<div class='block-settingsSearchResults-details'>\n\t\t\t\t<div>Query: \"" + data.query + "\"</div>\n\t\t\t\t<div>Literal match count: " + data.filterResultCount + "</div>\n\t\t\t</div>\n\t\t";
            var table = "\n\t\t\t<tr>\n\t\t\t\t<th>Setting</th>\n\t\t\t\t<th>Extension</th>\n\t\t\t\t<th>Score</th>\n\t\t\t</tr>";
            data.actualSearchResults
                .forEach(function (setting) {
                table += "\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td>" + setting.key + "</td>\n\t\t\t\t\t\t<td>" + setting.extensionId + "</td>\n\t\t\t\t\t\t<td>" + String(setting.score).slice(0, 5) + "</td>\n\t\t\t\t\t</tr>";
            });
            target.innerHTML = details + "<table>" + table + "</table>";
        };
        IssueReporter.prototype.initServices = function (configuration) {
            var _this = this;
            var serviceCollection = new serviceCollection_1.ServiceCollection();
            var mainProcessClient = new ipc_electron_browser_1.Client(String("window" + configuration.windowId));
            var windowsChannel = mainProcessClient.getChannel('windows');
            serviceCollection.set(windows_1.IWindowsService, new windowsIpc_1.WindowsChannelClient(windowsChannel));
            this.environmentService = new environmentService_1.EnvironmentService(configuration, configuration.execPath);
            var logService = spdlogService_1.createSpdLogService("issuereporter" + configuration.windowId, log_1.getLogLevel(this.environmentService), this.environmentService.logsPath);
            var logLevelClient = new logIpc_1.LogLevelSetterChannelClient(mainProcessClient.getChannel('loglevel'));
            this.logService = new logIpc_1.FollowerLogService(logLevelClient, logService);
            var sharedProcess = serviceCollection.get(windows_1.IWindowsService).whenSharedProcessReady()
                .then(function () { return ipc_net_1.connect(_this.environmentService.sharedIPCHandle, "window:" + configuration.windowId); });
            var instantiationService = new instantiationService_1.InstantiationService(serviceCollection, true);
            if (!this.environmentService.isExtensionDevelopment && !this.environmentService.args['disable-telemetry'] && !!product_1.default.enableTelemetry) {
                var channel = ipc_1.getDelayedChannel(sharedProcess.then(function (c) { return c.getChannel('telemetryAppender'); }));
                var appender = telemetryUtils_1.combinedAppender(new telemetryIpc_1.TelemetryAppenderClient(channel), new telemetryUtils_1.LogAppender(logService));
                var commonProperties = commonProperties_1.resolveCommonProperties(product_1.default.commit, package_1.default.version, configuration.machineId, this.environmentService.installSourcePath);
                var piiPaths = [this.environmentService.appRoot, this.environmentService.extensionsPath];
                var config = { appender: appender, commonProperties: commonProperties, piiPaths: piiPaths };
                var telemetryService = instantiationService.createInstance(telemetryService_1.TelemetryService, config);
                this._register(telemetryService);
                this.telemetryService = telemetryService;
            }
            else {
                this.telemetryService = telemetryUtils_1.NullTelemetryService;
            }
        };
        IssueReporter.prototype.setEventHandlers = function () {
            var _this = this;
            this.addEventListener('issue-type', 'change', function (event) {
                var issueType = parseInt(event.target.value);
                _this.issueReporterModel.update({ issueType: issueType });
                if (issueType === issue_1.IssueType.PerformanceIssue && !_this.receivedPerformanceInfo) {
                    electron_1.ipcRenderer.send('issuePerformanceInfoRequest');
                }
                _this.updatePreviewButtonState();
                _this.render();
            });
            ['includeSystemInfo', 'includeProcessInfo', 'includeWorkspaceInfo', 'includeExtensions', 'includeSearchedExtensions', 'includeSettingsSearchDetails'].forEach(function (elementId) {
                _this.addEventListener(elementId, 'click', function (event) {
                    var _a;
                    event.stopPropagation();
                    _this.issueReporterModel.update((_a = {}, _a[elementId] = !_this.issueReporterModel.getData()[elementId], _a));
                });
            });
            var showInfoElements = document.getElementsByClassName('showInfo');
            for (var i = 0; i < showInfoElements.length; i++) {
                var showInfo = showInfoElements.item(i);
                showInfo.addEventListener('click', function (e) {
                    e.preventDefault();
                    var label = e.target;
                    var containingElement = label.parentElement.parentElement;
                    var info = containingElement.lastElementChild;
                    if (info.classList.contains('hidden')) {
                        show(info);
                        label.textContent = nls_1.localize(0, null);
                    }
                    else {
                        hide(info);
                        label.textContent = nls_1.localize(1, null);
                    }
                });
            }
            this.addEventListener('issue-source', 'change', function (event) {
                var fileOnExtension = JSON.parse(event.target.value);
                _this.issueReporterModel.update({ fileOnExtension: fileOnExtension, includeExtensions: !fileOnExtension });
                _this.render();
                var title = document.getElementById('issue-title').value;
                if (fileOnExtension) {
                    _this.searchExtensionIssues(title);
                }
                else {
                    var description = _this.issueReporterModel.getData().issueDescription;
                    _this.searchVSCodeIssues(title, description);
                }
            });
            this.addEventListener('description', 'input', function (event) {
                var issueDescription = event.target.value;
                _this.issueReporterModel.update({ issueDescription: issueDescription });
                // Only search for extension issues on title change
                if (!_this.issueReporterModel.fileOnExtension()) {
                    var title = document.getElementById('issue-title').value;
                    _this.searchVSCodeIssues(title, issueDescription);
                }
            });
            this.addEventListener('issue-title', 'input', function (e) {
                var title = event.target.value;
                var lengthValidationMessage = document.getElementById('issue-title-length-validation-error');
                if (title && _this.getIssueUrlWithTitle(title).length > MAX_URL_LENGTH) {
                    show(lengthValidationMessage);
                }
                else {
                    hide(lengthValidationMessage);
                }
                if (_this.issueReporterModel.fileOnExtension()) {
                    _this.searchExtensionIssues(title);
                }
                else {
                    var description = _this.issueReporterModel.getData().issueDescription;
                    _this.searchVSCodeIssues(title, description);
                }
            });
            this.previewButton.onDidClick(function () { return _this.createIssue(); });
            this.addEventListener('disableExtensions', 'click', function () {
                electron_1.ipcRenderer.send('workbenchCommand', 'workbench.action.reloadWindowWithExtensionsDisabled');
            });
            this.addEventListener('disableExtensions', 'keydown', function (e) {
                e.stopPropagation();
                if (e.keyCode === 13 || e.keyCode === 32) {
                    electron_1.ipcRenderer.send('workbenchCommand', 'workbench.extensions.action.disableAll');
                    electron_1.ipcRenderer.send('workbenchCommand', 'workbench.action.reloadWindow');
                }
            });
            document.onkeydown = function (e) {
                var cmdOrCtrlKey = platform.isMacintosh ? e.metaKey : e.ctrlKey;
                // Cmd/Ctrl+Enter previews issue and closes window
                if (cmdOrCtrlKey && e.keyCode === 13) {
                    if (_this.createIssue()) {
                        electron_1.remote.getCurrentWindow().close();
                    }
                }
                // Cmd/Ctrl + zooms in
                if (cmdOrCtrlKey && e.keyCode === 187) {
                    _this.applyZoom(electron_1.webFrame.getZoomLevel() + 1);
                }
                // Cmd/Ctrl - zooms out
                if (cmdOrCtrlKey && e.keyCode === 189) {
                    _this.applyZoom(electron_1.webFrame.getZoomLevel() - 1);
                }
                // With latest electron upgrade, cmd+a is no longer propagating correctly for inputs in this window on mac
                // Manually perform the selection
                if (platform.isMacintosh) {
                    if (cmdOrCtrlKey && e.keyCode === 65 && e.target) {
                        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                            e.target.select();
                        }
                    }
                }
            };
        };
        IssueReporter.prototype.updatePreviewButtonState = function () {
            if (this.isPreviewEnabled()) {
                this.previewButton.label = nls_1.localize(2, null);
                this.previewButton.enabled = true;
            }
            else {
                this.previewButton.enabled = false;
                this.previewButton.label = nls_1.localize(3, null);
            }
        };
        IssueReporter.prototype.isPreviewEnabled = function () {
            var issueType = this.issueReporterModel.getData().issueType;
            if (issueType === issue_1.IssueType.Bug && this.receivedSystemInfo) {
                return true;
            }
            if (issueType === issue_1.IssueType.PerformanceIssue && this.receivedSystemInfo && this.receivedPerformanceInfo) {
                return true;
            }
            if (issueType === issue_1.IssueType.FeatureRequest) {
                return true;
            }
            if (issueType === issue_1.IssueType.SettingsSearchIssue) {
                return true;
            }
            return false;
        };
        IssueReporter.prototype.getExtensionRepositoryUrl = function () {
            var selectedExtension = this.issueReporterModel.getData().selectedExtension;
            return selectedExtension && selectedExtension.manifest && selectedExtension.manifest.repository && selectedExtension.manifest.repository.url;
        };
        IssueReporter.prototype.getExtensionBugsUrl = function () {
            var selectedExtension = this.issueReporterModel.getData().selectedExtension;
            return selectedExtension && selectedExtension.manifest && selectedExtension.manifest.bugs && selectedExtension.manifest.bugs.url;
        };
        IssueReporter.prototype.searchVSCodeIssues = function (title, issueDescription) {
            if (title) {
                this.searchDuplicates(title, issueDescription);
            }
            else {
                this.clearSearchResults();
            }
        };
        IssueReporter.prototype.searchExtensionIssues = function (title) {
            var url = this.getExtensionGitHubUrl();
            if (title) {
                var matches = /^https?:\/\/github\.com\/(.*)/.exec(url);
                if (matches && matches.length) {
                    var repo = matches[1];
                    return this.searchGitHub(repo, title);
                }
                // If the extension has no repository, display empty search results
                if (this.issueReporterModel.getData().selectedExtension) {
                    this.clearSearchResults();
                    return this.displaySearchResults([]);
                }
            }
            this.clearSearchResults();
        };
        IssueReporter.prototype.clearSearchResults = function () {
            var similarIssues = document.getElementById('similar-issues');
            similarIssues.innerHTML = '';
            this.numberOfSearchResultsDisplayed = 0;
        };
        IssueReporter.prototype.searchGitHub = function (repo, title) {
            var _this = this;
            var query = "is:issue+repo:" + repo + "+" + title;
            var similarIssues = document.getElementById('similar-issues');
            window.fetch("https://api.github.com/search/issues?q=" + query).then(function (response) {
                response.json().then(function (result) {
                    similarIssues.innerHTML = '';
                    if (result && result.items) {
                        _this.displaySearchResults(result.items);
                    }
                    else {
                        // If the items property isn't present, the rate limit has been hit
                        var message = dom_1.$('div.list-title');
                        message.textContent = nls_1.localize(4, null);
                        similarIssues.appendChild(message);
                        var resetTime = response.headers.get('X-RateLimit-Reset');
                        var timeToWait = parseInt(resetTime) - Math.floor(Date.now() / 1000);
                        if (_this.shouldQueueSearch) {
                            _this.shouldQueueSearch = false;
                            setTimeout(function () {
                                _this.searchGitHub(repo, title);
                                _this.shouldQueueSearch = true;
                            }, timeToWait * 1000);
                        }
                    }
                }).catch(function (e) {
                    _this.logSearchError(e);
                });
            }).catch(function (e) {
                _this.logSearchError(e);
            });
        };
        IssueReporter.prototype.searchDuplicates = function (title, body) {
            var _this = this;
            var url = 'https://vscode-probot.westus.cloudapp.azure.com:7890/duplicate_candidates';
            var init = {
                method: 'POST',
                body: JSON.stringify({
                    title: title,
                    body: body
                }),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            };
            window.fetch(url, init).then(function (response) {
                response.json().then(function (result) {
                    _this.clearSearchResults();
                    // {{SQL CARBON EDIT}}
                    // if (result && result.candidates) {
                    // 	this.displaySearchResults(result.candidates);
                    // } else {
                    // 	throw new Error('Unexpected response, no candidates property');
                    // }
                }).catch(function (error) {
                    _this.logSearchError(error);
                });
            }).catch(function (error) {
                _this.logSearchError(error);
            });
        };
        IssueReporter.prototype.displaySearchResults = function (results) {
            var _this = this;
            var similarIssues = document.getElementById('similar-issues');
            if (results.length) {
                var issues = dom_1.$('div.issues-container');
                var issuesText = dom_1.$('div.list-title');
                issuesText.textContent = nls_1.localize(5, null);
                this.numberOfSearchResultsDisplayed = results.length < 5 ? results.length : 5;
                for (var i = 0; i < this.numberOfSearchResultsDisplayed; i++) {
                    var issue = results[i];
                    var link = dom_1.$('a.issue-link', { href: issue.html_url });
                    link.textContent = issue.title;
                    link.title = issue.title;
                    link.addEventListener('click', function (e) { return _this.openLink(e); });
                    link.addEventListener('auxclick', function (e) { return _this.openLink(e); });
                    var issueState = void 0;
                    if (issue.state) {
                        issueState = dom_1.$('span.issue-state');
                        var issueIcon = dom_1.$('span.issue-icon');
                        var octicon = new octiconLabel_1.OcticonLabel(issueIcon);
                        octicon.text = issue.state === 'open' ? '$(issue-opened)' : '$(issue-closed)';
                        var issueStateLabel = dom_1.$('span.issue-state.label');
                        issueStateLabel.textContent = issue.state === 'open' ? nls_1.localize(6, null) : nls_1.localize(7, null);
                        issueState.title = issue.state === 'open' ? nls_1.localize(8, null) : nls_1.localize(9, null);
                        issueState.appendChild(issueIcon);
                        issueState.appendChild(issueStateLabel);
                    }
                    var item = dom_1.$('div.issue', {}, issueState, link);
                    issues.appendChild(item);
                }
                similarIssues.appendChild(issuesText);
                similarIssues.appendChild(issues);
            }
            else {
                var message = dom_1.$('div.list-title');
                message.textContent = nls_1.localize(10, null);
                similarIssues.appendChild(message);
            }
        };
        IssueReporter.prototype.logSearchError = function (error) {
            this.logService.warn('issueReporter#search ', error.message);
            /* __GDPR__
            "issueReporterSearchError" : {
                    "message" : { "classification": "CallstackOrException", "purpose": "PerformanceAndHealth" }
                }
            */
            this.telemetryService.publicLog('issueReporterSearchError', { message: error.message });
        };
        IssueReporter.prototype.setUpTypes = function () {
            var makeOption = function (issueType, description) { return "<option value=\"" + issueType.valueOf() + "\">" + strings_1.escape(description) + "</option>"; };
            var typeSelect = document.getElementById('issue-type');
            var issueType = this.issueReporterModel.getData().issueType;
            if (issueType === issue_1.IssueType.SettingsSearchIssue) {
                typeSelect.innerHTML = makeOption(issue_1.IssueType.SettingsSearchIssue, nls_1.localize(11, null));
                typeSelect.disabled = true;
            }
            else {
                typeSelect.innerHTML = [
                    makeOption(issue_1.IssueType.Bug, nls_1.localize(12, null)),
                    makeOption(issue_1.IssueType.FeatureRequest, nls_1.localize(13, null)),
                    makeOption(issue_1.IssueType.PerformanceIssue, nls_1.localize(14, null))
                ].join('\n');
            }
            typeSelect.value = issueType.toString();
        };
        IssueReporter.prototype.renderBlocks = function () {
            // Depending on Issue Type, we render different blocks and text
            var _a = this.issueReporterModel.getData(), issueType = _a.issueType, fileOnExtension = _a.fileOnExtension;
            var blockContainer = document.getElementById('block-container');
            var systemBlock = document.querySelector('.block-system');
            var processBlock = document.querySelector('.block-process');
            var workspaceBlock = document.querySelector('.block-workspace');
            var extensionsBlock = document.querySelector('.block-extensions');
            var searchedExtensionsBlock = document.querySelector('.block-searchedExtensions');
            var settingsSearchResultsBlock = document.querySelector('.block-settingsSearchResults');
            var problemSource = document.getElementById('problem-source');
            var problemSourceHelpText = document.getElementById('problem-source-help-text');
            var descriptionTitle = document.getElementById('issue-description-label');
            var descriptionSubtitle = document.getElementById('issue-description-subtitle');
            var extensionSelector = document.getElementById('extension-selection');
            // Hide all by default
            hide(blockContainer);
            hide(systemBlock);
            hide(processBlock);
            hide(workspaceBlock);
            hide(extensionsBlock);
            hide(searchedExtensionsBlock);
            hide(settingsSearchResultsBlock);
            hide(problemSource);
            hide(problemSourceHelpText);
            hide(extensionSelector);
            if (issueType === issue_1.IssueType.Bug) {
                show(blockContainer);
                show(systemBlock);
                show(problemSource);
                if (fileOnExtension) {
                    show(extensionSelector);
                }
                else {
                    show(extensionsBlock);
                    show(problemSourceHelpText);
                }
                descriptionTitle.innerHTML = nls_1.localize(15, null) + " <span class=\"required-input\">*</span>";
                descriptionSubtitle.innerHTML = nls_1.localize(16, null);
            }
            else if (issueType === issue_1.IssueType.PerformanceIssue) {
                show(blockContainer);
                show(systemBlock);
                show(processBlock);
                show(workspaceBlock);
                show(problemSource);
                if (fileOnExtension) {
                    show(extensionSelector);
                }
                else {
                    show(extensionsBlock);
                    show(problemSourceHelpText);
                }
                descriptionTitle.innerHTML = nls_1.localize(17, null) + " <span class=\"required-input\">*</span>";
                descriptionSubtitle.innerHTML = nls_1.localize(18, null);
            }
            else if (issueType === issue_1.IssueType.FeatureRequest) {
                descriptionTitle.innerHTML = nls_1.localize(19, null) + " <span class=\"required-input\">*</span>";
                descriptionSubtitle.innerHTML = nls_1.localize(20, null);
                show(problemSource);
                if (fileOnExtension) {
                    show(extensionSelector);
                }
            }
            else if (issueType === issue_1.IssueType.SettingsSearchIssue) {
                show(blockContainer);
                show(searchedExtensionsBlock);
                show(settingsSearchResultsBlock);
                descriptionTitle.innerHTML = nls_1.localize(21, null) + " <span class=\"required-input\">*</span>";
                descriptionSubtitle.innerHTML = nls_1.localize(22, null);
            }
        };
        IssueReporter.prototype.validateInput = function (inputId) {
            var inputElement = document.getElementById(inputId);
            if (!inputElement.value) {
                inputElement.classList.add('invalid-input');
                return false;
            }
            else {
                inputElement.classList.remove('invalid-input');
                return true;
            }
        };
        IssueReporter.prototype.validateInputs = function () {
            var _this = this;
            var isValid = true;
            ['issue-title', 'description', 'issue-source'].forEach(function (elementId) {
                isValid = _this.validateInput(elementId) && isValid;
            });
            if (this.issueReporterModel.fileOnExtension()) {
                isValid = this.validateInput('extension-selector') && isValid;
            }
            return isValid;
        };
        IssueReporter.prototype.createIssue = function () {
            var _this = this;
            if (!this.validateInputs()) {
                // If inputs are invalid, set focus to the first one and add listeners on them
                // to detect further changes
                var invalidInput = document.getElementsByClassName('invalid-input');
                if (invalidInput.length) {
                    invalidInput[0].focus();
                }
                document.getElementById('issue-title').addEventListener('input', function (event) {
                    _this.validateInput('issue-title');
                });
                document.getElementById('description').addEventListener('input', function (event) {
                    _this.validateInput('description');
                });
                if (this.issueReporterModel.fileOnExtension()) {
                    document.getElementById('extension-selector').addEventListener('change', function (event) {
                        _this.validateInput('extension-selector');
                    });
                }
                return false;
            }
            /* __GDPR__
                "issueReporterSubmit" : {
                    "issueType" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true },
                    "numSimilarIssuesDisplayed" : { "classification": "SystemMetaData", "purpose": "FeatureInsight", "isMeasurement": true }
                }
            */
            this.telemetryService.publicLog('issueReporterSubmit', { issueType: this.issueReporterModel.getData().issueType, numSimilarIssuesDisplayed: this.numberOfSearchResultsDisplayed });
            var baseUrl = this.getIssueUrlWithTitle(document.getElementById('issue-title').value);
            var issueBody = this.issueReporterModel.serialize();
            var url = baseUrl + ("&body=" + encodeURIComponent(issueBody));
            if (url.length > MAX_URL_LENGTH) {
                electron_1.clipboard.writeText(issueBody);
                url = baseUrl + ("&body=" + encodeURIComponent(nls_1.localize(23, null)));
            }
            electron_1.shell.openExternal(url);
            return true;
        };
        IssueReporter.prototype.getExtensionGitHubUrl = function () {
            var repositoryUrl = '';
            var bugsUrl = this.getExtensionBugsUrl();
            var extensionUrl = this.getExtensionRepositoryUrl();
            // If given, try to match the extension's bug url
            if (bugsUrl && bugsUrl.match(/^https?:\/\/github\.com\/(.*)/)) {
                repositoryUrl = issueReporterUtil_1.normalizeGitHubUrl(bugsUrl);
            }
            else if (extensionUrl && extensionUrl.match(/^https?:\/\/github\.com\/(.*)/)) {
                repositoryUrl = issueReporterUtil_1.normalizeGitHubUrl(extensionUrl);
            }
            return repositoryUrl;
        };
        IssueReporter.prototype.getIssueUrlWithTitle = function (issueTitle) {
            var repositoryUrl = product_1.default.reportIssueUrl;
            if (this.issueReporterModel.fileOnExtension()) {
                var extensionGitHubUrl = this.getExtensionGitHubUrl();
                if (extensionGitHubUrl) {
                    repositoryUrl = extensionGitHubUrl + '/issues/new';
                }
            }
            // {{SQL CARBON EDIT}}
            var queryStringPrefix = repositoryUrl.indexOf('?') === -1 ? '?' : '&';
            return "" + repositoryUrl + queryStringPrefix + "title=" + encodeURIComponent(issueTitle);
        };
        IssueReporter.prototype.updateExtensionSelector = function (extensions) {
            var _this = this;
            var extensionOptions = extensions.map(function (extension) {
                return {
                    name: extension.manifest.displayName || extension.manifest.name || '',
                    id: extension.identifier.id
                };
            });
            // Sort extensions by name
            extensionOptions.sort(function (a, b) {
                var aName = a.name.toLowerCase();
                var bName = b.name.toLowerCase();
                if (aName > bName) {
                    return 1;
                }
                if (aName < bName) {
                    return -1;
                }
                return 0;
            });
            var makeOption = function (extension) { return "<option value=\"" + extension.id + "\">" + strings_1.escape(extension.name) + "</option>"; };
            var extensionsSelector = document.getElementById('extension-selector');
            extensionsSelector.innerHTML = '<option></option>' + extensionOptions.map(makeOption).join('\n');
            this.addEventListener('extension-selector', 'change', function (e) {
                var selectedExtensionId = e.target.value;
                var extensions = _this.issueReporterModel.getData().allExtensions;
                var matches = extensions.filter(function (extension) { return extension.identifier.id === selectedExtensionId; });
                if (matches.length) {
                    _this.issueReporterModel.update({ selectedExtension: matches[0] });
                    var title = document.getElementById('issue-title').value;
                    _this.searchExtensionIssues(title);
                }
                else {
                    _this.issueReporterModel.update({ selectedExtension: null });
                    _this.clearSearchResults();
                }
            });
        };
        IssueReporter.prototype.updateExtensionTable = function (extensions, numThemeExtensions) {
            var target = document.querySelector('.block-extensions .block-info');
            if (this.environmentService.disableExtensions) {
                target.innerHTML = nls_1.localize(24, null);
                return;
            }
            var themeExclusionStr = numThemeExtensions ? "\n(" + numThemeExtensions + " theme extensions excluded)" : '';
            extensions = extensions || [];
            if (!extensions.length) {
                target.innerHTML = 'Extensions: none' + themeExclusionStr;
                return;
            }
            var table = this.getExtensionTableHtml(extensions);
            target.innerHTML = "<table>" + table + "</table>" + themeExclusionStr;
        };
        IssueReporter.prototype.updateSearchedExtensionTable = function (extensions) {
            var target = document.querySelector('.block-searchedExtensions .block-info');
            if (!extensions.length) {
                target.innerHTML = 'Extensions: none';
                return;
            }
            var table = this.getExtensionTableHtml(extensions);
            target.innerHTML = "<table>" + table + "</table>";
        };
        IssueReporter.prototype.getExtensionTableHtml = function (extensions) {
            var table = "\n\t\t\t<tr>\n\t\t\t\t<th>Extension</th>\n\t\t\t\t<th>Author (truncated)</th>\n\t\t\t\t<th>Version</th>\n\t\t\t</tr>";
            table += extensions.map(function (extension) {
                return "\n\t\t\t\t<tr>\n\t\t\t\t\t<td>" + extension.manifest.name + "</td>\n\t\t\t\t\t<td>" + extension.manifest.publisher.substr(0, 3) + "</td>\n\t\t\t\t\t<td>" + extension.manifest.version + "</td>\n\t\t\t\t</tr>";
            }).join('');
            return table;
        };
        IssueReporter.prototype.openLink = function (event) {
            event.preventDefault();
            event.stopPropagation();
            // Exclude right click
            if (event.which < 3) {
                electron_1.shell.openExternal(event.target.href);
                /* __GDPR__
                    "issueReporterViewSimilarIssue" : { }
                */
                this.telemetryService.publicLog('issueReporterViewSimilarIssue');
            }
        };
        IssueReporter.prototype.addEventListener = function (elementId, eventType, handler) {
            var element = document.getElementById(elementId);
            if (element) {
                element.addEventListener(eventType, handler);
            }
            else {
                var error = new Error(elementId + " not found.");
                this.logService.error(error);
                /* __GDPR__
                    "issueReporterAddEventListenerError" : {
                            "message" : { "classification": "CallstackOrException", "purpose": "PerformanceAndHealth" }
                        }
                    */
                this.telemetryService.publicLog('issueReporterAddEventListenerError', { message: error.message });
            }
        };
        __decorate([
            decorators_1.debounce(300)
        ], IssueReporter.prototype, "searchGitHub", null);
        __decorate([
            decorators_1.debounce(300)
        ], IssueReporter.prototype, "searchDuplicates", null);
        return IssueReporter;
    }(lifecycle_1.Disposable));
    exports.IssueReporter = IssueReporter;
    // helper functions
    function hide(el) {
        el.classList.add('hidden');
    }
    function show(el) {
        el.classList.remove('hidden');
    }
});

}).call(this);
//# sourceMappingURL=issueReporterMain.js.map
