/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
(function() {
var __m = ["require","exports","vs/base/common/winjs.base","vs/base/common/lifecycle","vs/base/common/platform","vs/base/common/event","vs/base/common/uri","child_process","vs/base/common/errors","vs/base/common/objects","vs/base/common/types","vs/base/common/async","vs/base/common/strings","vs/base/common/functional","vs/base/common/processes","vs/base/common/cancellation","vs/base/common/linkedList","vs/base/node/console","vs/base/node/decoder","vs/workbench/services/search/node/worker/searchWorkerIpc","vs/base/common/paths","path","vs/workbench/services/search/node/worker/searchWorker","vs/workbench/services/search/node/search","vs/base/node/stdFork","vs/base/node/stream","fs","vs/base/node/encoding","vs/base/parts/ipc/node/ipc.cp","vs/base/node/processes","vs/base/parts/ipc/common/ipc","vs/nls!vs/base/node/processes","vs/nls","vs/nls!vs/workbench/services/search/node/worker/searchWorkerApp","stream","iconv-lite","net","os","graceful-fs","string_decoder","vs/workbench/services/search/node/worker/searchWorkerApp"];
var __M = function(deps) {
  var result = [];
  for (var i = 0, len = deps.length; i < len; i++) {
    result[i] = __m[deps[i]];
  }
  return result;
};
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[13/*vs/base/common/functional*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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
define(__m[3/*vs/base/common/lifecycle*/], __M([0/*require*/,1/*exports*/,13/*vs/base/common/functional*/]), function (require, exports, functional_1) {
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
define(__m[16/*vs/base/common/linkedList*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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

define(__m[14/*vs/base/common/processes*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Source;
    (function (Source) {
        Source[Source["stdout"] = 0] = "stdout";
        Source[Source["stderr"] = 1] = "stderr";
    })(Source = exports.Source || (exports.Source = {}));
    var TerminateResponseCode;
    (function (TerminateResponseCode) {
        TerminateResponseCode[TerminateResponseCode["Success"] = 0] = "Success";
        TerminateResponseCode[TerminateResponseCode["Unknown"] = 1] = "Unknown";
        TerminateResponseCode[TerminateResponseCode["AccessDenied"] = 2] = "AccessDenied";
        TerminateResponseCode[TerminateResponseCode["ProcessNotFound"] = 3] = "ProcessNotFound";
    })(TerminateResponseCode = exports.TerminateResponseCode || (exports.TerminateResponseCode = {}));
});

define(__m[12/*vs/base/common/strings*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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

define(__m[20/*vs/base/common/paths*/], __M([0/*require*/,1/*exports*/,4/*vs/base/common/platform*/,12/*vs/base/common/strings*/]), function (require, exports, platform_1, strings_1) {
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

define(__m[10/*vs/base/common/types*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[9/*vs/base/common/objects*/], __M([0/*require*/,1/*exports*/,10/*vs/base/common/types*/]), function (require, exports, types_1) {
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
define(__m[6/*vs/base/common/uri*/], __M([0/*require*/,1/*exports*/,4/*vs/base/common/platform*/]), function (require, exports, platform_1) {
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

define(__m[8/*vs/base/common/errors*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/]), function (require, exports, winjs_base_1) {
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
define(__m[5/*vs/base/common/event*/], __M([0/*require*/,1/*exports*/,8/*vs/base/common/errors*/,13/*vs/base/common/functional*/,3/*vs/base/common/lifecycle*/,16/*vs/base/common/linkedList*/,2/*vs/base/common/winjs.base*/]), function (require, exports, errors_1, functional_1, lifecycle_1, linkedList_1, winjs_base_1) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[15/*vs/base/common/cancellation*/], __M([0/*require*/,1/*exports*/,5/*vs/base/common/event*/]), function (require, exports, event_1) {
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










define(__m[11/*vs/base/common/async*/], __M([0/*require*/,1/*exports*/,8/*vs/base/common/errors*/,2/*vs/base/common/winjs.base*/,15/*vs/base/common/cancellation*/,3/*vs/base/common/lifecycle*/,5/*vs/base/common/event*/]), function (require, exports, errors, winjs_base_1, cancellation_1, lifecycle_1, event_1) {
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

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[17/*vs/base/node/console*/], __M([0/*require*/,1/*exports*/,6/*vs/base/common/uri*/]), function (require, exports, uri_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function isRemoteConsoleLog(obj) {
        var entry = obj;
        return entry && typeof entry.type === 'string' && typeof entry.severity === 'string';
    }
    exports.isRemoteConsoleLog = isRemoteConsoleLog;
    function parse(entry) {
        var args = [];
        var stack;
        // Parse Entry
        try {
            var parsedArguments = JSON.parse(entry.arguments);
            // Check for special stack entry as last entry
            var stackArgument = parsedArguments[parsedArguments.length - 1];
            if (stackArgument && stackArgument.__$stack) {
                parsedArguments.pop(); // stack is handled specially
                stack = stackArgument.__$stack;
            }
            args.push.apply(args, parsedArguments);
        }
        catch (error) {
            args.push('Unable to log remote console arguments', entry.arguments);
        }
        return { args: args, stack: stack };
    }
    exports.parse = parse;
    function getFirstFrame(arg0) {
        if (typeof arg0 !== 'string') {
            return getFirstFrame(parse(arg0).stack);
        }
        // Parse a source information out of the stack if we have one. Format can be:
        // at vscode.commands.registerCommand (/Users/someone/Desktop/test-ts/out/src/extension.js:18:17)
        // or
        // at /Users/someone/Desktop/test-ts/out/src/extension.js:18:17
        // or
        // at c:\Users\someone\Desktop\end-js\extension.js:19:17
        // or
        // at e.$executeContributedCommand(c:\Users\someone\Desktop\end-js\extension.js:19:17)
        var stack = arg0;
        if (stack) {
            var topFrame = findFirstFrame(stack);
            // at [^\/]* => line starts with "at" followed by any character except '/' (to not capture unix paths too late)
            // (?:(?:[a-zA-Z]+:)|(?:[\/])|(?:\\\\) => windows drive letter OR unix root OR unc root
            // (?:.+) => simple pattern for the path, only works because of the line/col pattern after
            // :(?:\d+):(?:\d+) => :line:column data
            var matches = /at [^\/]*((?:(?:[a-zA-Z]+:)|(?:[\/])|(?:\\\\))(?:.+)):(\d+):(\d+)/.exec(topFrame);
            if (matches && matches.length === 4) {
                return {
                    uri: uri_1.default.file(matches[1]),
                    line: Number(matches[2]),
                    column: Number(matches[3])
                };
            }
        }
        return void 0;
    }
    exports.getFirstFrame = getFirstFrame;
    function findFirstFrame(stack) {
        if (!stack) {
            return stack;
        }
        var newlineIndex = stack.indexOf('\n');
        if (newlineIndex === -1) {
            return stack;
        }
        return stack.substring(0, newlineIndex);
    }
    function log(entry, label) {
        var _a = parse(entry), args = _a.args, stack = _a.stack;
        var isOneStringArg = typeof args[0] === 'string' && args.length === 1;
        var topFrame = findFirstFrame(stack);
        if (topFrame) {
            topFrame = "(" + topFrame.trim() + ")";
        }
        var consoleArgs = [];
        // First arg is a string
        if (typeof args[0] === 'string') {
            if (topFrame && isOneStringArg) {
                consoleArgs = ["%c[" + label + "] %c" + args[0] + " %c" + topFrame, color('blue'), color('black'), color('grey')];
            }
            else {
                consoleArgs = ["%c[" + label + "] %c" + args[0], color('blue'), color('black')].concat(args.slice(1));
            }
        }
        // First arg is something else, just apply all
        else {
            consoleArgs = ["%c[" + label + "]%", color('blue')].concat(args);
        }
        // Stack: add to args unless already aded
        if (topFrame && !isOneStringArg) {
            consoleArgs.push(topFrame);
        }
        // Log it
        console[entry.severity].apply(console, consoleArgs);
    }
    exports.log = log;
    function color(color) {
        return "color: " + color;
    }
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[18/*vs/base/node/decoder*/], __M([0/*require*/,1/*exports*/,39/*string_decoder*/]), function (require, exports, sd) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Convenient way to iterate over output line by line. This helper accommodates for the fact that
     * a buffer might not end with new lines all the way.
     *
     * To use:
     * - call the write method
     * - forEach() over the result to get the lines
     */
    var LineDecoder = /** @class */ (function () {
        function LineDecoder(encoding) {
            if (encoding === void 0) { encoding = 'utf8'; }
            this.stringDecoder = new sd.StringDecoder(encoding);
            this.remaining = null;
        }
        LineDecoder.prototype.write = function (buffer) {
            var result = [];
            var value = this.remaining
                ? this.remaining + this.stringDecoder.write(buffer)
                : this.stringDecoder.write(buffer);
            if (value.length < 1) {
                return result;
            }
            var start = 0;
            var ch;
            var idx = start;
            while (idx < value.length) {
                ch = value.charCodeAt(idx);
                if (ch === 13 /* CarriageReturn */ || ch === 10 /* LineFeed */) {
                    result.push(value.substring(start, idx));
                    idx++;
                    if (idx < value.length) {
                        var lastChar = ch;
                        ch = value.charCodeAt(idx);
                        if ((lastChar === 13 /* CarriageReturn */ && ch === 10 /* LineFeed */) || (lastChar === 10 /* LineFeed */ && ch === 13 /* CarriageReturn */)) {
                            idx++;
                        }
                    }
                    start = idx;
                }
                else {
                    idx++;
                }
            }
            this.remaining = start < value.length ? value.substr(start) : null;
            return result;
        };
        LineDecoder.prototype.end = function () {
            return this.remaining;
        };
        return LineDecoder;
    }());
    exports.LineDecoder = LineDecoder;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[24/*vs/base/node/stdFork*/], __M([0/*require*/,1/*exports*/,21/*path*/,37/*os*/,36/*net*/,7/*child_process*/,6/*vs/base/common/uri*/]), function (require, exports, path, os, net, cp, uri_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeRandomHexString(length) {
        var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        var result = '';
        for (var i = 0; i < length; i++) {
            var idx = Math.floor(chars.length * Math.random());
            result += chars[idx];
        }
        return result;
    }
    function generatePipeName() {
        var randomName = 'vscode-std-' + makeRandomHexString(40);
        if (process.platform === 'win32') {
            return '\\\\.\\pipe\\' + randomName + '-sock';
        }
        // Mac/Unix: use socket file
        return path.join(os.tmpdir(), randomName + '.sock');
    }
    function generatePatchedEnv(env, stdInPipeName, stdOutPipeName, stdErrPipeName) {
        // Set the two unique pipe names and the electron flag as process env
        var newEnv = {};
        for (var key in env) {
            newEnv[key] = env[key];
        }
        newEnv['STDIN_PIPE_NAME'] = stdInPipeName;
        newEnv['STDOUT_PIPE_NAME'] = stdOutPipeName;
        newEnv['STDERR_PIPE_NAME'] = stdErrPipeName;
        newEnv['ELECTRON_RUN_AS_NODE'] = '1';
        return newEnv;
    }
    function fork(modulePath, args, options, callback) {
        var callbackCalled = false;
        var resolve = function (result) {
            if (callbackCalled) {
                return;
            }
            callbackCalled = true;
            callback(null, result);
        };
        var reject = function (err) {
            if (callbackCalled) {
                return;
            }
            callbackCalled = true;
            callback(err, null);
        };
        // Generate three unique pipe names
        var stdInPipeName = generatePipeName();
        var stdOutPipeName = generatePipeName();
        var stdErrPipeName = generatePipeName();
        var newEnv = generatePatchedEnv(options.env || process.env, stdInPipeName, stdOutPipeName, stdErrPipeName);
        var childProcess;
        // Begin listening to stderr pipe
        var stdErrServer = net.createServer(function (stdErrStream) {
            // From now on the childProcess.stderr is available for reading
            childProcess.stderr = stdErrStream;
        });
        stdErrServer.listen(stdErrPipeName);
        // Begin listening to stdout pipe
        var stdOutServer = net.createServer(function (stdOutStream) {
            // The child process will write exactly one chunk with content `ready` when it has installed a listener to the stdin pipe
            stdOutStream.once('data', function (chunk) {
                // The child process is sending me the `ready` chunk, time to connect to the stdin pipe
                childProcess.stdin = net.connect(stdInPipeName);
                // From now on the childProcess.stdout is available for reading
                childProcess.stdout = stdOutStream;
                resolve(childProcess);
            });
        });
        stdOutServer.listen(stdOutPipeName);
        var serverClosed = false;
        var closeServer = function () {
            if (serverClosed) {
                return;
            }
            serverClosed = true;
            process.removeListener('exit', closeServer);
            stdOutServer.close();
            stdErrServer.close();
        };
        // Create the process
        var bootstrapperPath = (uri_1.default.parse(require.toUrl('./stdForkStart.js')).fsPath);
        childProcess = cp.fork(bootstrapperPath, [modulePath].concat(args), {
            silent: true,
            cwd: options.cwd,
            env: newEnv,
            execArgv: options.execArgv
        });
        childProcess.once('error', function (err) {
            closeServer();
            reject(err);
        });
        childProcess.once('exit', function (err) {
            closeServer();
            reject(err);
        });
        // On vscode exit still close server #7758
        process.once('exit', closeServer);
    }
    exports.fork = fork;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[25/*vs/base/node/stream*/], __M([0/*require*/,1/*exports*/,26/*fs*/,2/*vs/base/common/winjs.base*/]), function (require, exports, fs, winjs_base_1) {
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










define(__m[27/*vs/base/node/encoding*/], __M([0/*require*/,1/*exports*/,25/*vs/base/node/stream*/,35/*iconv-lite*/,2/*vs/base/common/winjs.base*/,4/*vs/base/common/platform*/,7/*child_process*/,34/*stream*/,11/*vs/base/common/async*/]), function (require, exports, stream, iconv, winjs_base_1, platform_1, child_process_1, stream_1, async_1) {
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
define(__m[30/*vs/base/parts/ipc/common/ipc*/], __M([0/*require*/,1/*exports*/,2/*vs/base/common/winjs.base*/,3/*vs/base/common/lifecycle*/,5/*vs/base/common/event*/]), function (require, exports, winjs_base_1, lifecycle_1, event_1) {
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

define(__m[31/*vs/nls!vs/base/node/processes*/], __M([32/*vs/nls*/,33/*vs/nls!vs/workbench/services/search/node/worker/searchWorkerApp*/]), function(nls, data) { return nls.create("vs/base/node/processes", data); });










define(__m[29/*vs/base/node/processes*/], __M([0/*require*/,1/*exports*/,21/*path*/,7/*child_process*/,24/*vs/base/node/stdFork*/,31/*vs/nls!vs/base/node/processes*/,2/*vs/base/common/winjs.base*/,10/*vs/base/common/types*/,6/*vs/base/common/uri*/,9/*vs/base/common/objects*/,20/*vs/base/common/paths*/,4/*vs/base/common/platform*/,18/*vs/base/node/decoder*/,14/*vs/base/common/processes*/]), function (require, exports, path, cp, stdFork_1, nls, winjs_base_1, Types, uri_1, Objects, TPath, Platform, decoder_1, processes_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the Source EULA. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Source = processes_1.Source;
    exports.TerminateResponseCode = processes_1.TerminateResponseCode;
    function getWindowsCode(status) {
        switch (status) {
            case 0:
                return processes_1.TerminateResponseCode.Success;
            case 1:
                return processes_1.TerminateResponseCode.AccessDenied;
            case 128:
                return processes_1.TerminateResponseCode.ProcessNotFound;
            default:
                return processes_1.TerminateResponseCode.Unknown;
        }
    }
    function terminateProcess(process, cwd) {
        if (Platform.isWindows) {
            try {
                var options = {
                    stdio: ['pipe', 'pipe', 'ignore']
                };
                if (cwd) {
                    options.cwd = cwd;
                }
                cp.execFileSync('taskkill', ['/T', '/F', '/PID', process.pid.toString()], options);
            }
            catch (err) {
                return { success: false, error: err, code: err.status ? getWindowsCode(err.status) : processes_1.TerminateResponseCode.Unknown };
            }
        }
        else if (Platform.isLinux || Platform.isMacintosh) {
            try {
                var cmd = uri_1.default.parse(require.toUrl('vs/base/node/terminateProcess.sh')).fsPath;
                var result = cp.spawnSync(cmd, [process.pid.toString()]);
                if (result.error) {
                    return { success: false, error: result.error };
                }
            }
            catch (err) {
                return { success: false, error: err };
            }
        }
        else {
            process.kill('SIGKILL');
        }
        return { success: true };
    }
    exports.terminateProcess = terminateProcess;
    function getWindowsShell() {
        return process.env['comspec'] || 'cmd.exe';
    }
    exports.getWindowsShell = getWindowsShell;
    var AbstractProcess = /** @class */ (function () {
        function AbstractProcess(arg1, arg2, arg3, arg4) {
            var _this = this;
            if (arg4) {
                this.cmd = arg1;
                this.args = arg2;
                this.shell = arg3;
                this.options = arg4;
            }
            else if (arg3 && arg2) {
                this.module = arg1;
                this.args = arg2;
                this.shell = false;
                this.options = arg3;
            }
            else {
                var executable = arg1;
                this.cmd = executable.command;
                this.shell = executable.isShellCommand;
                this.args = executable.args.slice(0);
                this.options = executable.options || {};
            }
            this.childProcess = null;
            this.terminateRequested = false;
            if (this.options.env) {
                var newEnv_1 = Object.create(null);
                Object.keys(process.env).forEach(function (key) {
                    newEnv_1[key] = process.env[key];
                });
                Object.keys(this.options.env).forEach(function (key) {
                    newEnv_1[key] = _this.options.env[key];
                });
                this.options.env = newEnv_1;
            }
        }
        AbstractProcess.prototype.getSanitizedCommand = function () {
            var result = this.cmd.toLowerCase();
            var index = result.lastIndexOf(path.sep);
            if (index !== -1) {
                result = result.substring(index + 1);
            }
            if (AbstractProcess.WellKnowCommands[result]) {
                return result;
            }
            return 'other';
        };
        AbstractProcess.prototype.start = function (pp) {
            var _this = this;
            if (Platform.isWindows && ((this.options && this.options.cwd && TPath.isUNC(this.options.cwd)) || !this.options && !this.options.cwd && TPath.isUNC(process.cwd()))) {
                return winjs_base_1.TPromise.wrapError(new Error(nls.localize(0, null)));
            }
            return this.useExec().then(function (useExec) {
                var cc;
                var ee;
                var result = new winjs_base_1.TPromise(function (c, e) {
                    cc = c;
                    ee = e;
                });
                if (useExec) {
                    var cmd = _this.cmd;
                    if (_this.args) {
                        cmd = cmd + ' ' + _this.args.join(' ');
                    }
                    _this.childProcess = cp.exec(cmd, _this.options, function (error, stdout, stderr) {
                        _this.childProcess = null;
                        var err = error;
                        // This is tricky since executing a command shell reports error back in case the executed command return an
                        // error or the command didn't exist at all. So we can't blindly treat an error as a failed command. So we
                        // always parse the output and report success unless the job got killed.
                        if (err && err.killed) {
                            ee({ killed: _this.terminateRequested, stdout: stdout.toString(), stderr: stderr.toString() });
                        }
                        else {
                            _this.handleExec(cc, pp, error, stdout, stderr);
                        }
                    });
                }
                else {
                    var childProcess = null;
                    var closeHandler_1 = function (data) {
                        _this.childProcess = null;
                        _this.childProcessPromise = null;
                        _this.handleClose(data, cc, pp, ee);
                        var result = {
                            terminated: _this.terminateRequested
                        };
                        if (Types.isNumber(data)) {
                            result.cmdCode = data;
                        }
                        cc(result);
                    };
                    if (_this.shell && Platform.isWindows) {
                        var options = Objects.deepClone(_this.options);
                        options.windowsVerbatimArguments = true;
                        options.detached = false;
                        var quotedCommand = false;
                        var quotedArg_1 = false;
                        var commandLine_1 = [];
                        var quoted_1 = _this.ensureQuotes(_this.cmd);
                        commandLine_1.push(quoted_1.value);
                        quotedCommand = quoted_1.quoted;
                        if (_this.args) {
                            _this.args.forEach(function (elem) {
                                quoted_1 = _this.ensureQuotes(elem);
                                commandLine_1.push(quoted_1.value);
                                quotedArg_1 = quotedArg_1 && quoted_1.quoted;
                            });
                        }
                        var args = [
                            '/s',
                            '/c',
                        ];
                        if (quotedCommand) {
                            if (quotedArg_1) {
                                args.push('"' + commandLine_1.join(' ') + '"');
                            }
                            else if (commandLine_1.length > 1) {
                                args.push('"' + commandLine_1[0] + '"' + ' ' + commandLine_1.slice(1).join(' '));
                            }
                            else {
                                args.push('"' + commandLine_1[0] + '"');
                            }
                        }
                        else {
                            args.push(commandLine_1.join(' '));
                        }
                        childProcess = cp.spawn(getWindowsShell(), args, options);
                    }
                    else {
                        if (_this.cmd) {
                            childProcess = cp.spawn(_this.cmd, _this.args, _this.options);
                        }
                        else if (_this.module) {
                            _this.childProcessPromise = new winjs_base_1.TPromise(function (c, e) {
                                stdFork_1.fork(_this.module, _this.args, _this.options, function (error, childProcess) {
                                    if (error) {
                                        e(error);
                                        ee({ terminated: _this.terminateRequested, error: error });
                                        return;
                                    }
                                    _this.childProcess = childProcess;
                                    if (_this.pidResolve) {
                                        _this.pidResolve(Types.isNumber(childProcess.pid) ? childProcess.pid : -1);
                                        _this.pidResolve = undefined;
                                    }
                                    _this.childProcess.on('close', closeHandler_1);
                                    _this.handleSpawn(childProcess, cc, pp, ee, false);
                                    c(childProcess);
                                });
                            });
                        }
                    }
                    if (childProcess) {
                        _this.childProcess = childProcess;
                        _this.childProcessPromise = winjs_base_1.TPromise.as(childProcess);
                        if (_this.pidResolve) {
                            _this.pidResolve(Types.isNumber(childProcess.pid) ? childProcess.pid : -1);
                            _this.pidResolve = undefined;
                        }
                        childProcess.on('error', function (error) {
                            _this.childProcess = null;
                            ee({ terminated: _this.terminateRequested, error: error });
                        });
                        if (childProcess.pid) {
                            _this.childProcess.on('close', closeHandler_1);
                            _this.handleSpawn(childProcess, cc, pp, ee, true);
                        }
                    }
                }
                return result;
            });
        };
        AbstractProcess.prototype.handleClose = function (data, cc, pp, ee) {
            // Default is to do nothing.
        };
        AbstractProcess.prototype.ensureQuotes = function (value) {
            if (AbstractProcess.regexp.test(value)) {
                return {
                    value: '"' + value + '"',
                    quoted: true
                };
            }
            else {
                return {
                    value: value,
                    quoted: value.length > 0 && value[0] === '"' && value[value.length - 1] === '"'
                };
            }
        };
        Object.defineProperty(AbstractProcess.prototype, "pid", {
            get: function () {
                var _this = this;
                if (this.childProcessPromise) {
                    return this.childProcessPromise.then(function (childProcess) { return childProcess.pid; }, function (err) { return -1; });
                }
                else {
                    return new winjs_base_1.TPromise(function (resolve) {
                        _this.pidResolve = resolve;
                    });
                }
            },
            enumerable: true,
            configurable: true
        });
        AbstractProcess.prototype.terminate = function () {
            var _this = this;
            if (!this.childProcessPromise) {
                return winjs_base_1.TPromise.as({ success: true });
            }
            return this.childProcessPromise.then(function (childProcess) {
                _this.terminateRequested = true;
                var result = terminateProcess(childProcess, _this.options.cwd);
                if (result.success) {
                    _this.childProcess = null;
                }
                return result;
            }, function (err) {
                return { success: true };
            });
        };
        AbstractProcess.prototype.useExec = function () {
            var _this = this;
            return new winjs_base_1.TPromise(function (c, e) {
                if (!_this.shell || !Platform.isWindows) {
                    c(false);
                }
                var cmdShell = cp.spawn(getWindowsShell(), ['/s', '/c']);
                cmdShell.on('error', function (error) {
                    c(true);
                });
                cmdShell.on('exit', function (data) {
                    c(false);
                });
            });
        };
        AbstractProcess.WellKnowCommands = {
            'ant': true,
            'cmake': true,
            'eslint': true,
            'gradle': true,
            'grunt': true,
            'gulp': true,
            'jake': true,
            'jenkins': true,
            'jshint': true,
            'make': true,
            'maven': true,
            'msbuild': true,
            'msc': true,
            'nmake': true,
            'npm': true,
            'rake': true,
            'tsc': true,
            'xbuild': true
        };
        AbstractProcess.regexp = /^[^"].* .*[^"]/;
        return AbstractProcess;
    }());
    exports.AbstractProcess = AbstractProcess;
    var LineProcess = /** @class */ (function (_super) {
        __extends(LineProcess, _super);
        function LineProcess(arg1, arg2, arg3, arg4) {
            return _super.call(this, arg1, arg2, arg3, arg4) || this;
        }
        LineProcess.prototype.handleExec = function (cc, pp, error, stdout, stderr) {
            [stdout, stderr].forEach(function (buffer, index) {
                var lineDecoder = new decoder_1.LineDecoder();
                var lines = lineDecoder.write(buffer);
                lines.forEach(function (line) {
                    pp({ line: line, source: index === 0 ? processes_1.Source.stdout : processes_1.Source.stderr });
                });
                var line = lineDecoder.end();
                if (line) {
                    pp({ line: line, source: index === 0 ? processes_1.Source.stdout : processes_1.Source.stderr });
                }
            });
            cc({ terminated: this.terminateRequested, error: error });
        };
        LineProcess.prototype.handleSpawn = function (childProcess, cc, pp, ee, sync) {
            var _this = this;
            this.stdoutLineDecoder = new decoder_1.LineDecoder();
            this.stderrLineDecoder = new decoder_1.LineDecoder();
            childProcess.stdout.on('data', function (data) {
                var lines = _this.stdoutLineDecoder.write(data);
                lines.forEach(function (line) { return pp({ line: line, source: processes_1.Source.stdout }); });
            });
            childProcess.stderr.on('data', function (data) {
                var lines = _this.stderrLineDecoder.write(data);
                lines.forEach(function (line) { return pp({ line: line, source: processes_1.Source.stderr }); });
            });
        };
        LineProcess.prototype.handleClose = function (data, cc, pp, ee) {
            [this.stdoutLineDecoder.end(), this.stderrLineDecoder.end()].forEach(function (line, index) {
                if (line) {
                    pp({ line: line, source: index === 0 ? processes_1.Source.stdout : processes_1.Source.stderr });
                }
            });
        };
        return LineProcess;
    }(AbstractProcess));
    exports.LineProcess = LineProcess;
    // Wrapper around process.send() that will queue any messages if the internal node.js
    // queue is filled with messages and only continue sending messages when the internal
    // queue is free again to consume messages.
    // On Windows we always wait for the send() method to return before sending the next message
    // to workaround https://github.com/nodejs/node/issues/7657 (IPC can freeze process)
    function createQueuedSender(childProcess) {
        var msgQueue = [];
        var useQueue = false;
        var send = function (msg) {
            if (useQueue) {
                msgQueue.push(msg); // add to the queue if the process cannot handle more messages
                return;
            }
            var result = childProcess.send(msg, function (error) {
                if (error) {
                    console.error(error); // unlikely to happen, best we can do is log this error
                }
                useQueue = false; // we are good again to send directly without queue
                // now send all the messages that we have in our queue and did not send yet
                if (msgQueue.length > 0) {
                    var msgQueueCopy = msgQueue.slice(0);
                    msgQueue = [];
                    msgQueueCopy.forEach(function (entry) { return send(entry); });
                }
            });
            if (!result || Platform.isWindows /* workaround https://github.com/nodejs/node/issues/7657 */) {
                useQueue = true;
            }
        };
        return { send: send };
    }
    exports.createQueuedSender = createQueuedSender;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/










define(__m[28/*vs/base/parts/ipc/node/ipc.cp*/], __M([0/*require*/,1/*exports*/,7/*child_process*/,3/*vs/base/common/lifecycle*/,2/*vs/base/common/winjs.base*/,11/*vs/base/common/async*/,9/*vs/base/common/objects*/,5/*vs/base/common/event*/,29/*vs/base/node/processes*/,30/*vs/base/parts/ipc/common/ipc*/,17/*vs/base/node/console*/]), function (require, exports, child_process_1, lifecycle_1, winjs_base_1, async_1, objects_1, event_1, processes_1, ipc_1, console_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Server = /** @class */ (function (_super) {
        __extends(Server, _super);
        function Server() {
            var _this = _super.call(this, {
                send: function (r) { try {
                    process.send(r);
                }
                catch (e) { /* not much to do */ } },
                onMessage: event_1.fromNodeEventEmitter(process, 'message', function (msg) { return msg; })
            }) || this;
            process.once('disconnect', function () { return _this.dispose(); });
            return _this;
        }
        return Server;
    }(ipc_1.ChannelServer));
    exports.Server = Server;
    var Client = /** @class */ (function () {
        function Client(modulePath, options) {
            this.modulePath = modulePath;
            this.options = options;
            this._onDidProcessExit = new event_1.Emitter();
            this.onDidProcessExit = this._onDidProcessExit.event;
            var timeout = options && options.timeout ? options.timeout : 60000;
            this.disposeDelayer = new async_1.Delayer(timeout);
            this.activeRequests = [];
            this.child = null;
            this._client = null;
            this.channels = Object.create(null);
        }
        Client.prototype.getChannel = function (channelName) {
            var _this = this;
            var call = function (command, arg) { return _this.requestPromise(channelName, command, arg); };
            var listen = function (event, arg) { return _this.requestEvent(channelName, event, arg); };
            return { call: call, listen: listen };
        };
        Client.prototype.requestPromise = function (channelName, name, arg) {
            var _this = this;
            if (!this.disposeDelayer) {
                return winjs_base_1.TPromise.wrapError(new Error('disposed'));
            }
            this.disposeDelayer.cancel();
            var channel = this.channels[channelName] || (this.channels[channelName] = this.client.getChannel(channelName));
            var request = channel.call(name, arg);
            // Progress doesn't propagate across 'then', we need to create a promise wrapper
            var result = new winjs_base_1.TPromise(function (c, e, p) {
                request.then(c, e, p).done(function () {
                    if (!_this.activeRequests) {
                        return;
                    }
                    _this.activeRequests.splice(_this.activeRequests.indexOf(disposable), 1);
                    if (_this.activeRequests.length === 0) {
                        _this.disposeDelayer.trigger(function () { return _this.disposeClient(); });
                    }
                });
            }, function () { return request.cancel(); });
            var disposable = lifecycle_1.toDisposable(function () { return result.cancel(); });
            this.activeRequests.push(disposable);
            return result;
        };
        Client.prototype.requestEvent = function (channelName, name, arg) {
            var _this = this;
            if (!this.disposeDelayer) {
                return event_1.Event.None;
            }
            this.disposeDelayer.cancel();
            var listener;
            var emitter = new event_1.Emitter({
                onFirstListenerAdd: function () {
                    var channel = _this.channels[channelName] || (_this.channels[channelName] = _this.client.getChannel(channelName));
                    var event = channel.listen(name, arg);
                    listener = event(emitter.fire, emitter);
                    _this.activeRequests.push(listener);
                },
                onLastListenerRemove: function () {
                    if (!_this.activeRequests) {
                        return;
                    }
                    _this.activeRequests.splice(_this.activeRequests.indexOf(listener), 1);
                    listener.dispose();
                    if (_this.activeRequests.length === 0) {
                        _this.disposeDelayer.trigger(function () { return _this.disposeClient(); });
                    }
                }
            });
            return emitter.event;
        };
        Object.defineProperty(Client.prototype, "client", {
            get: function () {
                var _this = this;
                if (!this._client) {
                    var args = this.options && this.options.args ? this.options.args : [];
                    var forkOpts = Object.create(null);
                    forkOpts.env = objects_1.assign(objects_1.deepClone(process.env), { 'VSCODE_PARENT_PID': String(process.pid) });
                    if (this.options && this.options.env) {
                        forkOpts.env = objects_1.assign(forkOpts.env, this.options.env);
                    }
                    if (this.options && this.options.freshExecArgv) {
                        forkOpts.execArgv = [];
                    }
                    if (this.options && typeof this.options.debug === 'number') {
                        forkOpts.execArgv = ['--nolazy', '--inspect=' + this.options.debug];
                    }
                    if (this.options && typeof this.options.debugBrk === 'number') {
                        forkOpts.execArgv = ['--nolazy', '--inspect-brk=' + this.options.debugBrk];
                    }
                    this.child = child_process_1.fork(this.modulePath, args, forkOpts);
                    var onMessageEmitter_1 = new event_1.Emitter();
                    var onRawMessage = event_1.fromNodeEventEmitter(this.child, 'message', function (msg) { return msg; });
                    onRawMessage(function (msg) {
                        // Handle remote console logs specially
                        if (console_1.isRemoteConsoleLog(msg)) {
                            console_1.log(msg, "IPC Library: " + _this.options.serverName);
                            return null;
                        }
                        // Anything else goes to the outside
                        onMessageEmitter_1.fire(msg);
                    });
                    var sender_1 = this.options.useQueue ? processes_1.createQueuedSender(this.child) : this.child;
                    var send = function (r) { return _this.child && _this.child.connected && sender_1.send(r); };
                    var onMessage = onMessageEmitter_1.event;
                    var protocol = { send: send, onMessage: onMessage };
                    this._client = new ipc_1.ChannelClient(protocol);
                    var onExit_1 = function () { return _this.disposeClient(); };
                    process.once('exit', onExit_1);
                    this.child.on('error', function (err) { return console.warn('IPC "' + _this.options.serverName + '" errored with ' + err); });
                    this.child.on('exit', function (code, signal) {
                        process.removeListener('exit', onExit_1);
                        if (_this.activeRequests) {
                            _this.activeRequests = lifecycle_1.dispose(_this.activeRequests);
                        }
                        if (code !== 0 && signal !== 'SIGTERM') {
                            console.warn('IPC "' + _this.options.serverName + '" crashed with exit code ' + code + ' and signal ' + signal);
                            _this.disposeDelayer.cancel();
                            _this.disposeClient();
                        }
                        _this._onDidProcessExit.fire({ code: code, signal: signal });
                    });
                }
                return this._client;
            },
            enumerable: true,
            configurable: true
        });
        Client.prototype.disposeClient = function () {
            if (this._client) {
                this.child.kill();
                this.child = null;
                this._client = null;
                this.channels = Object.create(null);
            }
        };
        Client.prototype.dispose = function () {
            this._onDidProcessExit.dispose();
            this.disposeDelayer.cancel();
            this.disposeDelayer = null;
            this.disposeClient();
            this.activeRequests = null;
        };
        return Client;
    }());
    exports.Client = Client;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[23/*vs/workbench/services/search/node/search*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function isSerializedSearchComplete(arg) {
        if (arg.type === 'error') {
            return true;
        }
        else if (arg.type === 'success') {
            return true;
        }
        else {
            return false;
        }
    }
    exports.isSerializedSearchComplete = isSerializedSearchComplete;
    function isSerializedSearchSuccess(arg) {
        return arg.type === 'success';
    }
    exports.isSerializedSearchSuccess = isSerializedSearchSuccess;
    var FileMatch = /** @class */ (function () {
        function FileMatch(path) {
            this.path = path;
            this.lineMatches = [];
        }
        FileMatch.prototype.addMatch = function (lineMatch) {
            this.lineMatches.push(lineMatch);
        };
        FileMatch.prototype.serialize = function () {
            var lineMatches = [];
            var numMatches = 0;
            for (var i = 0; i < this.lineMatches.length; i++) {
                numMatches += this.lineMatches[i].offsetAndLengths.length;
                lineMatches.push(this.lineMatches[i].serialize());
            }
            return {
                path: this.path,
                lineMatches: lineMatches,
                numMatches: numMatches
            };
        };
        return FileMatch;
    }());
    exports.FileMatch = FileMatch;
    var LineMatch = /** @class */ (function () {
        function LineMatch(preview, lineNumber) {
            this.preview = preview.replace(/(\r|\n)*$/, '');
            this.lineNumber = lineNumber;
            this.offsetAndLengths = [];
        }
        LineMatch.prototype.addMatch = function (offset, length) {
            this.offsetAndLengths.push([offset, length]);
        };
        LineMatch.prototype.serialize = function () {
            var result = {
                preview: this.preview,
                lineNumber: this.lineNumber,
                offsetAndLengths: this.offsetAndLengths
            };
            return result;
        };
        return LineMatch;
    }());
    exports.LineMatch = LineMatch;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[22/*vs/workbench/services/search/node/worker/searchWorker*/], __M([0/*require*/,1/*exports*/,26/*fs*/,38/*graceful-fs*/,8/*vs/base/common/errors*/,12/*vs/base/common/strings*/,2/*vs/base/common/winjs.base*/,23/*vs/workbench/services/search/node/search*/,27/*vs/base/node/encoding*/]), function (require, exports, fs, gracefulFs, errors_1, strings, winjs_base_1, search_1, encoding_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    gracefulFs.gracefulify(fs);
    var MAX_FILE_ERRORS = 5; // Don't report more than this number of errors, 1 per file, to avoid flooding the log when there's a general issue
    var numErrorsLogged = 0;
    function onError(error) {
        if (numErrorsLogged++ < MAX_FILE_ERRORS) {
            errors_1.onUnexpectedError(error);
        }
    }
    var SearchWorker = /** @class */ (function () {
        function SearchWorker() {
        }
        SearchWorker.prototype.initialize = function () {
            this.currentSearchEngine = new SearchWorkerEngine();
            return winjs_base_1.TPromise.wrap(undefined);
        };
        SearchWorker.prototype.cancel = function () {
            // Cancel the current search. It will stop searching and close its open files.
            if (this.currentSearchEngine) {
                this.currentSearchEngine.cancel();
            }
            return winjs_base_1.TPromise.wrap(null);
        };
        SearchWorker.prototype.search = function (args) {
            if (!this.currentSearchEngine) {
                // Worker timed out during search
                this.initialize();
            }
            return this.currentSearchEngine.searchBatch(args);
        };
        return SearchWorker;
    }());
    exports.SearchWorker = SearchWorker;
    var LF = 0x0a;
    var CR = 0x0d;
    var SearchWorkerEngine = /** @class */ (function () {
        function SearchWorkerEngine() {
            this.nextSearch = winjs_base_1.TPromise.wrap(null);
            this.isCanceled = false;
        }
        /**
         * Searches some number of the given paths concurrently, and starts searches in other paths when those complete.
         */
        SearchWorkerEngine.prototype.searchBatch = function (args) {
            var _this = this;
            var contentPattern = strings.createRegExp(args.pattern.pattern, args.pattern.isRegExp, { matchCase: args.pattern.isCaseSensitive, wholeWord: args.pattern.isWordMatch, multiline: false, global: true });
            var fileEncoding = encoding_1.encodingExists(args.fileEncoding) ? args.fileEncoding : encoding_1.UTF8;
            return this.nextSearch =
                this.nextSearch.then(function () { return _this._searchBatch(args, contentPattern, fileEncoding); });
        };
        SearchWorkerEngine.prototype._searchBatch = function (args, contentPattern, fileEncoding) {
            var _this = this;
            if (this.isCanceled) {
                return winjs_base_1.TPromise.wrap(null);
            }
            return new winjs_base_1.TPromise(function (batchDone) {
                var result = {
                    matches: [],
                    numMatches: 0,
                    limitReached: false
                };
                // Search in the given path, and when it's finished, search in the next path in absolutePaths
                var startSearchInFile = function (absolutePath) {
                    return _this.searchInFile(absolutePath, contentPattern, fileEncoding, args.maxResults && (args.maxResults - result.numMatches)).then(function (fileResult) {
                        // Finish early if search is canceled
                        if (_this.isCanceled) {
                            return;
                        }
                        if (fileResult) {
                            result.numMatches += fileResult.numMatches;
                            result.matches.push(fileResult.match.serialize());
                            if (fileResult.limitReached) {
                                // If the limit was reached, terminate early with the results so far and cancel in-progress searches.
                                _this.cancel();
                                result.limitReached = true;
                                return batchDone(result);
                            }
                        }
                    }, onError);
                };
                winjs_base_1.TPromise.join(args.absolutePaths.map(startSearchInFile)).then(function () {
                    batchDone(result);
                });
            });
        };
        SearchWorkerEngine.prototype.cancel = function () {
            this.isCanceled = true;
        };
        SearchWorkerEngine.prototype.searchInFile = function (absolutePath, contentPattern, fileEncoding, maxResults) {
            var _this = this;
            var fileMatch = null;
            var limitReached = false;
            var numMatches = 0;
            var perLineCallback = function (line, lineNumber) {
                var lineMatch = null;
                var match = contentPattern.exec(line);
                // Record all matches into file result
                while (match !== null && match[0].length > 0 && !_this.isCanceled && !limitReached) {
                    if (fileMatch === null) {
                        fileMatch = new search_1.FileMatch(absolutePath);
                    }
                    if (lineMatch === null) {
                        lineMatch = new search_1.LineMatch(line, lineNumber);
                        fileMatch.addMatch(lineMatch);
                    }
                    lineMatch.addMatch(match.index, match[0].length);
                    numMatches++;
                    if (maxResults && numMatches >= maxResults) {
                        limitReached = true;
                    }
                    match = contentPattern.exec(line);
                }
            };
            // Read lines buffered to support large files
            return this.readlinesAsync(absolutePath, perLineCallback, { bufferLength: 8096, encoding: fileEncoding }).then(function () { return fileMatch ? { match: fileMatch, limitReached: limitReached, numMatches: numMatches } : null; });
        };
        SearchWorkerEngine.prototype.readlinesAsync = function (filename, perLineCallback, options) {
            var _this = this;
            return new winjs_base_1.TPromise(function (resolve, reject) {
                fs.open(filename, 'r', null, function (error, fd) {
                    if (error) {
                        return resolve(null);
                    }
                    var buffer = Buffer.allocUnsafe(options.bufferLength);
                    var line = '';
                    var lineNumber = 0;
                    var lastBufferHadTrailingCR = false;
                    var readFile = function (isFirstRead, clb) {
                        if (_this.isCanceled) {
                            return clb(null); // return early if canceled or limit reached
                        }
                        fs.read(fd, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {
                            var decodeBuffer = function (buffer, start, end) {
                                if (options.encoding === encoding_1.UTF8 || options.encoding === encoding_1.UTF8_with_bom) {
                                    return buffer.toString(undefined, start, end); // much faster to use built in toString() when encoding is default
                                }
                                return encoding_1.decode(buffer.slice(start, end), options.encoding);
                            };
                            var lineFinished = function (offset) {
                                line += decodeBuffer(buffer, pos, i + offset);
                                perLineCallback(line, lineNumber);
                                line = '';
                                lineNumber++;
                                pos = i + offset;
                            };
                            if (error || bytesRead === 0 || _this.isCanceled) {
                                return clb(error); // return early if canceled or limit reached or no more bytes to read
                            }
                            var crlfCharSize = 1;
                            var crBytes = [CR];
                            var lfBytes = [LF];
                            var pos = 0;
                            var i = 0;
                            // Detect encoding and mime when this is the beginning of the file
                            if (isFirstRead) {
                                var detected = encoding_1.detectEncodingFromBuffer({ buffer: buffer, bytesRead: bytesRead }, false);
                                if (detected.seemsBinary) {
                                    return clb(null); // skip files that seem binary
                                }
                                // Check for BOM offset
                                switch (detected.encoding) {
                                    case encoding_1.UTF8:
                                        pos = i = encoding_1.bomLength(encoding_1.UTF8);
                                        options.encoding = encoding_1.UTF8;
                                        break;
                                    case encoding_1.UTF16be:
                                        pos = i = encoding_1.bomLength(encoding_1.UTF16be);
                                        options.encoding = encoding_1.UTF16be;
                                        break;
                                    case encoding_1.UTF16le:
                                        pos = i = encoding_1.bomLength(encoding_1.UTF16le);
                                        options.encoding = encoding_1.UTF16le;
                                        break;
                                }
                                // when we are running with UTF16le/be, LF and CR are encoded as
                                // two bytes, like 0A 00 (LF) / 0D 00 (CR) for LE or flipped around
                                // for BE. We need to account for this when splitting the buffer into
                                // newlines, and when detecting a CRLF combo.
                                if (options.encoding === encoding_1.UTF16le) {
                                    crlfCharSize = 2;
                                    crBytes = [CR, 0x00];
                                    lfBytes = [LF, 0x00];
                                }
                                else if (options.encoding === encoding_1.UTF16be) {
                                    crlfCharSize = 2;
                                    crBytes = [0x00, CR];
                                    lfBytes = [0x00, LF];
                                }
                            }
                            if (lastBufferHadTrailingCR) {
                                if (buffer[i] === lfBytes[0] && (lfBytes.length === 1 || buffer[i + 1] === lfBytes[1])) {
                                    lineFinished(1 * crlfCharSize);
                                    i++;
                                }
                                else {
                                    lineFinished(0);
                                }
                                lastBufferHadTrailingCR = false;
                            }
                            /**
                             * This loop executes for every byte of every file in the workspace - it is highly performance-sensitive!
                             * Hence the duplication in reading the buffer to avoid a function call. Previously a function call was not
                             * being inlined by V8.
                             */
                            for (; i < bytesRead; ++i) {
                                if (buffer[i] === lfBytes[0] && (lfBytes.length === 1 || buffer[i + 1] === lfBytes[1])) {
                                    lineFinished(1 * crlfCharSize);
                                }
                                else if (buffer[i] === crBytes[0] && (crBytes.length === 1 || buffer[i + 1] === crBytes[1])) { // CR (Carriage Return)
                                    if (i + crlfCharSize === bytesRead) {
                                        lastBufferHadTrailingCR = true;
                                    }
                                    else if (buffer[i + crlfCharSize] === lfBytes[0] && (lfBytes.length === 1 || buffer[i + crlfCharSize + 1] === lfBytes[1])) {
                                        lineFinished(2 * crlfCharSize);
                                        i += 2 * crlfCharSize - 1;
                                    }
                                    else {
                                        lineFinished(1 * crlfCharSize);
                                    }
                                }
                            }
                            line += decodeBuffer(buffer, pos, bytesRead);
                            readFile(/*isFirstRead=*/ false, clb); // Continue reading
                        });
                    };
                    readFile(/*isFirstRead=*/ true, function (error) {
                        if (error) {
                            return resolve(null);
                        }
                        if (line.length) {
                            perLineCallback(line, lineNumber); // handle last line
                        }
                        fs.close(fd, function (error) {
                            resolve(null);
                        });
                    });
                });
            });
        };
        return SearchWorkerEngine;
    }());
    exports.SearchWorkerEngine = SearchWorkerEngine;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[19/*vs/workbench/services/search/node/worker/searchWorkerIpc*/], __M([0/*require*/,1/*exports*/]), function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SearchWorkerChannel = /** @class */ (function () {
        function SearchWorkerChannel(worker) {
            this.worker = worker;
        }
        SearchWorkerChannel.prototype.listen = function (event, arg) {
            throw new Error('No events');
        };
        SearchWorkerChannel.prototype.call = function (command, arg) {
            switch (command) {
                case 'initialize': return this.worker.initialize();
                case 'search': return this.worker.search(arg);
                case 'cancel': return this.worker.cancel();
            }
            return undefined;
        };
        return SearchWorkerChannel;
    }());
    exports.SearchWorkerChannel = SearchWorkerChannel;
    var SearchWorkerChannelClient = /** @class */ (function () {
        function SearchWorkerChannelClient(channel) {
            this.channel = channel;
        }
        SearchWorkerChannelClient.prototype.initialize = function () {
            return this.channel.call('initialize');
        };
        SearchWorkerChannelClient.prototype.search = function (args) {
            return this.channel.call('search', args);
        };
        SearchWorkerChannelClient.prototype.cancel = function () {
            return this.channel.call('cancel');
        };
        return SearchWorkerChannelClient;
    }());
    exports.SearchWorkerChannelClient = SearchWorkerChannelClient;
});

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(__m[40/*vs/workbench/services/search/node/worker/searchWorkerApp*/], __M([0/*require*/,1/*exports*/,28/*vs/base/parts/ipc/node/ipc.cp*/,19/*vs/workbench/services/search/node/worker/searchWorkerIpc*/,22/*vs/workbench/services/search/node/worker/searchWorker*/]), function (require, exports, ipc_cp_1, searchWorkerIpc_1, searchWorker_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var server = new ipc_cp_1.Server();
    var worker = new searchWorker_1.SearchWorker();
    var channel = new searchWorkerIpc_1.SearchWorkerChannel(worker);
    server.registerChannel('searchWorker', channel);
});

}).call(this);
//# sourceMappingURL=searchWorkerApp.js.map
