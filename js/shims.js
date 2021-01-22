/*jslint browser: true*/
/*global window: false */
/*global document: false */
/*global setTimeout: false */
/*global clearTimeout: false */
/*global Modernizr: false */
/*global poloAF: false */
if (!window.poloAF) {
	window.poloAF = {};
}
/**
 * Shim for "fixing" IE's lack of support (IE < 9) for applying slice
 * on host objects like NamedNodeMap, NodeList, and HTMLCollection
 * (technically, since host objects have been implementation-dependent,
 * at least before ES2015, IE hasn't needed to work this way).
 * Also works on strings, fixes IE < 9 to allow an explicit undefined
 * for the 2nd argument (as in Firefox), and prevents errors when
 * called on other DOM objects.
 */
(function () {
	'use strict';
	var slice = Array.prototype.slice;
	try {
		// Can't be used with DOM elements in IE < 9
		slice.call(document.documentElement);
	} catch (e) { // Fails in IE < 9
		//AJS// poloAF.shim indicates IE < 9; could test for attachEvent
		poloAF.slice_shim = true;
		poloAF.clone = function (object) {
			function F() {}
			F.prototype = object || F.prototype;
			F.prototype.constructor = F;
			return new F();
		};
		// This will work for genuine arrays, array-like objects, 
		// NamedNodeMap (attributes, entities, notations),
		// NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
		// and will not fail on other DOM objects (as do DOM elements in IE < 9)
		Array.prototype.slice = function (begin, end) {
			// IE < 9 gets unhappy with an undefined end argument
			end = (typeof end !== 'undefined') ? end : this.length;
			// For native Array objects, we use the native slice function
			if (Object.prototype.toString.call(this) === '[object Array]') {
				return slice.call(this, begin, end);
			}
			// For array like object we handle it ourselves.
			var i, cloned = [],
				size, len = this.length,
				start, upTo;
			// Handle negative value for "begin"
			start = begin || 0;
			start = (start >= 0) ? start : Math.max(0, len + start);
			// Handle negative value for "end"
			upTo = (typeof end === 'number') ? Math.min(end, len) : len;
			if (end < 0) {
				upTo = len + end;
			}
			// Actual expected size of the slice
			size = upTo - start;
			if (size > 0) {
				cloned = new Array(size);
				//cloned = [size];
				if (this.charAt) {
					for (i = 0; i < size; i += 1) {
						cloned[i] = this.charAt(start + i);
					}
				} else {
					for (i = 0; i < size; i += 1) {
						cloned[i] = this[start + i];
					}
				}
			}
			return cloned;
		};
	}
}());
if (!Array.prototype.push) {
	Array.prototype.push = function () {
		"use strict";
		var i, L;
		for (i = this.length, L = arguments.length; i < L; i += 1) {
			this[i] = arguments[i];
		}
	};
}
if (!Array.prototype.pop) {
	Array.prototype.pop = function () {
		"use strict";
		var n = this.length - 1,
			item = this[n];
		this.length = n;
		return item;
	};
}
window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (f) {
	"use strict";
	return setTimeout(f, 1000 / 60);
}; // simulate calling code 60 
window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || function (requestID) {
	"use strict";
	clearTimeout(requestID);
}; //fall back
window.dispatchEvent = window.dispatchEvent || window.fireEvent;
if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	};
}
String.prototype.sansNumber = function () {
	var str = '',
		n = parseFloat(this),
		i = !isNaN(n) ? str + n : 0;
	return this.substring(i.length);
};
String.prototype.isUpper = function () {
	return this.toString() === this.toUpperCase();
};
String.prototype.bloated = function () {
	var str = this.toString();
	return Number(str.length - str.trim().length);
};
String.prototype.abbreviate = function (token) {
	"use strict";
	var split = this.split(token || " "),
		res = '',
		i = 0;
	while (split[i]) {
		res += split[i].charAt(0).toUpperCase();
		i += 1;
	}
	return res;
};
String.prototype.honor = function () {
	"use strict";
	var str;
	if (this.constructor.prototype.saved) {
		str = this.constructor.prototype.saved.join(' ');
		this.constructor.prototype.saved = null;
	} else {
		this.constructor.prototype.saved = this.split(' ');
		str = this.constructor.prototype.saved[1];
	}
	return str;
};
String.prototype.toCamelCase = function (char) {
	var reg = new RegExp(char + "([a-z])", 'g');
	return this.replace(reg, function (match, captured) {
		return captured.toUpperCase();
	});
};
String.prototype.honorific = function (h) {
	"use strict";
	return h + ' ' + this;
};
if (typeof Function.prototype.method === 'undefined') {
	Function.prototype.method = function (name, func) {
		"use strict";
		this.prototype[name] = func;
		return this;
	};
}
if (typeof Function.prototype.bind === 'undefined') {
	Function.prototype.bind = function (context) {
		"use strict";
		var fn = this,
			slice = Array.prototype.slice,
			args = slice.call(arguments, 1);
		return function () {
			return fn.apply(context, args.concat(slice.call(arguments)));
		};
	};
}
if (typeof Function.prototype.wrap === 'undefined') {
	//WORKHORSE
	Function.prototype.wrap = function (wrapper, options) {
		var method = this;
		return function () {
			var args = [],
				L = arguments.length,
				i;
			/* options could be provided when wrap is first invoked
			OR when the returned function is invoked where it would be args[0] below
			wrapper expects at least (method), maybe (method, options) maybe (method, options, ...rest)
			if options is pre-supplied rest[0] is args[0] below otherwise rest[0] === options in (method, options)
			*/
			if (options) {
				args.push(options);
			}
			for (i = 0; i < L; i += 1) {
				args.push(arguments[i]);
			}
			if (wrapper) {
				return wrapper.apply(this, [method.bind(this)].concat(args));
			}
		};
	};
}

function ieOpacity(v) {
	this['-ms-filter'] = 'progid:DXImageTransform.Microsoft.Alpha=' + (v * 100) + ')';
	this.filter = 'alpha(opacity=' + (v * 100) + ')';
	return this;
}

function getNativeOpacity(bool) {
	return function (v) {
		return {
			getKey: function () {
				return bool ? 'filter' : Modernizr.prefixedCSS('opacity');
			},
			getValue: function (val) {
				var value = val || v;
				return bool ? 'alpha(opacity=' + value + ')' : value / 100;
			}
		};
	};
}
poloAF.getOpacity = getNativeOpacity(!window.addEventListener);

if (typeof Object.getPrototypeOf !== "function") {
	if (typeof "test".__proto__ === "object") {
		Object.getPrototypeOf = function (object) {
			return object.__proto__;
		};
	} else {
		Object.getPrototypeOf = function (object) {
			// May break if the constructor has been tampered with
			return object.constructor.prototype;
		};
	}
}
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. MIT license */
window.matchMedia || (window.matchMedia = function () {
	"use strict";
	// For browsers that support matchMedium api such as IE 9 and webkit
	var styleMedia = (window.styleMedia || window.media);
	// For those that don't support matchMedium
	if (!styleMedia) {
		var style = document.createElement('style'),
			script = document.getElementsByTagName('script')[0],
			info = null;
		style.type = 'text/css';
		style.id = 'matchmediajs-test';
		if (!script) {
			document.head.appendChild(style);
		} else {
			script.parentNode.insertBefore(style, script);
		}
		// 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
		info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;
		styleMedia = {
			matchMedium: function (media) {
				var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';
				// 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
				if (style.styleSheet) {
					style.styleSheet.cssText = text;
				} else {
					style.textContent = text;
				}
				// Test if media query is true or false
				return info.width === '1px';
			}
		};
	}
	return function (media) {
		return {
			matches: styleMedia.matchMedium(media || 'all'),
			media: media || 'all'
		};
	};
}());
/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. MIT license */
(function () {
	// Bail out for browsers that have addListener support
	if (window.matchMedia && window.matchMedia('all').addListener) {
		return false;
	}
	var localMatchMedia = window.matchMedia,
		hasMediaQueries = localMatchMedia('only all').matches,
		isListening = false,
		timeoutID = 0, // setTimeout for debouncing 'handleChange'
		queries = [], // Contains each 'mql' and associated 'listeners' if 'addListener' is used
		handleChange = function (evt) {
			// Debounce
			clearTimeout(timeoutID);
			timeoutID = setTimeout(function () {
				for (var i = 0, il = queries.length; i < il; i++) {
					var mql = queries[i].mql,
						listeners = queries[i].listeners || [],
						matches = localMatchMedia(mql.media).matches;
					// Update mql.matches value and call listeners
					// Fire listeners only if transitioning to or from matched state
					if (matches !== mql.matches) {
						mql.matches = matches;
						for (var j = 0, jl = listeners.length; j < jl; j++) {
							listeners[j].call(window, mql);
						}
					}
				}
			}, 30);
		};
	window.matchMedia = function (media) {
		var mql = localMatchMedia(media),
			listeners = [],
			index = 0;
		mql.addListener = function (listener) {
			// Changes would not occur to css media type so return now (Affects IE <= 8)
			if (!hasMediaQueries) {
				return;
			}
			// Set up 'resize' listener for browsers that support CSS3 media queries (Not for IE <= 8)
			// There should only ever be 1 resize listener running for performance
			if (!isListening) {
				isListening = true;
				window.addEventListener('resize', handleChange, true);
			}
			// Push object only if it has not been pushed already
			if (index === 0) {
				index = queries.push({
					mql: mql,
					listeners: listeners
				});
			}
			listeners.push(listener);
		};
		mql.removeListener = function (listener) {
			for (var i = 0, il = listeners.length; i < il; i++) {
				if (listeners[i] === listener) {
					listeners.splice(i, 1);
				}
			}
		};
		return mql;
	};
}());