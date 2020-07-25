/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
(function (doc, visiblity, mq, query, cssanimations, touchevents, main, footer, q2, picnum, makePath, makePathWrap, getDefAlt) {
	"use strict";

	function modulo(n, i) {
		return i % n;
	}

	function shuffle(coll, flag) {
		return function (start, deleteCount) {
            deleteCount = isNaN(deleteCount) ? coll.length-1 : deleteCount;
            start = isNaN(start) ? 0 : start;
            var res = coll.splice(start, deleteCount);
			return flag ? res.concat(coll) : coll.concat(res);
		};
	}

	function undef(x) {
		return typeof (x) === 'undefined';
	}

	function partial(f, el) {
		return _.partial(f, el);
	}

	function compare(f, a, b, o) {
		return f(o[a], o[b]);
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function noOp() {}

	function isPositive(x) {
		return (x >= 0) ? !undef(x) : undefined;
	}

	function lessOrEqual(i) {
		return function (x) {
			return (x <= i) ? x : undefined;
		};
	}

	function subtract(x, y) {
		return x - y;
	}

	function divideBy(n) {
		return function (i) {
			return i / n;
		};
	}

	function greaterOrEqual(a, b) {
		return getResult(a) >= getResult(b);
	}

	function setter(o, k, v) {
		o[k] = v;
	}

	function setterAdapter(k, o, v) {
		setter(o, k, v);
	}

	function invokemethod(o, arg, m) {
		//con(arguments);
		return o[m](arg);
	}

	function invoke(f, arg) {
		//con(arguments)
		return f(arg);
	}

	function thunk(f) {
		return f.apply(f, _.rest(arguments));
	}

	function always(val) {
		return function () {
			return val;
		};
	}

	function failed(i) {
		return i < 0;
	}

	function doOnce() {
		return function (i) {
			return function () {
				var res = i > 0;
				i -= 1;
				return res > 0;
			};
		};
	}

	function isEqual(x, y) {
		return Number(x) === Number(y);
	}
	var utils = poloAF.Util,
		con = window.console.log.bind(window),
		reporter = function (msg, el) {
			el = el || utils.getByTag('h2', document)[0];
			msg = undef(msg) ? document.documentElement.className : msg;
			el.innerHTML = msg;
		},
		$ = function (str) {
			return document.getElementById(str);
		},
		ptL = _.partial,
		once = doOnce(),
		doTwice = utils.curryTwice(),
		doThrice = utils.curryThrice(),
		doQuart = utils.curryFourFold(),
		doVier = utils.curryFourFold(),
		doTwiceDefer = utils.curryTwice(true),
		doThriceDefer = utils.curryThrice(true),
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		drill = utils.drillDown,
		invokeWhen = utils.invokeWhen,
		cssopacity = poloAF.getOpacity().getKey(),
		anCr = utils.append(),
		setAttrs = utils.setAttributes,
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		klasTog = utils.toggleClass,
		isDesktop = (function () {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return _.partial(utils.isDesktop, threshold);
			}
		}()),
		clicker = ptL(utils.addHandler, 'click'),
		makeElement = utils.machElement,
		doToggle = ptL(klasTog, 'alt', main),
		getControls = ptL($, 'controls'),
		getSlide = ptL($, 'slide'),
		getNodeName = utils.drillDown(['nodeName']),
		getID = utils.drillDown(['id']),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		getTarget = utils.drillDown([mytarget]),
		getLength = utils.drillDown(['length']),
		allpics = utils.getByTag('img', main),
		getOrientation = ptL(compare, utils.gtThan, 'offsetHeight', 'offsetWidth'),
		getDomTargetLink = utils.getDomChild(utils.getNodeByTag('a')),
		getDomTargetImg = utils.getDomChild(utils.getNodeByTag('img')),
		//thumbs = $('thumbnails'),
		thumbs = utils.getByClass('gallery')[0],
		lis = _.toArray(thumbs.getElementsByTagName('li')),
		getCurrentSlide = _.compose(utils.getZero, ptL(utils.getByClass, 'show', thumbs, 'li')),
		isPortrait = ptL(function (el) {
			var img = getDomTargetImg(el);
			return img.offsetHeight > img.offsetWidth;
			//return utils.getClassList(el).contains('portrait');
		}),
        doPortrait = function (el) {
			var m = getOrientation(el) ? 'addClass' : 'removeClass';
			utils[m]('portrait', utils.getDomParent(utils.getNodeByTag('li'))(el));
		},
        inPortraitMode = _.compose(utils.getZero, ptL(utils.getByClass, 'portrait')),
		getCurrentImage = _.compose(getDomTargetImg, getCurrentSlide),
		//singlePage = _.compose(utils.getZero, ptL(utils.getByTag, 'input', ptL($, 'gal_forward'))),
		//groupByOrientation = _.compose(utils.getZero, ptL(utils.getByTag, 'input', ptL($, 'gal_back'))),
		exitCurrentImage = function (img) {
			var math = getOrientation(img),
				m = math && isDesktop() ? 'addClass' : 'removeClass';
            m = math ? 'addClass' : 'removeClass';
			_.map([thumbs, $('wrap')], ptL(utils[m], 'portrait'));
			return img;
		},
		exitGallery = _.compose(exitCurrentImage, getCurrentImage),
		hideCurrent = _.compose(utils.hide, getCurrentSlide),
		doShow = function (next) {
			hideCurrent();
			utils.show(next);
			exitGallery();
		};
}(document, 'show', Modernizr.mq('only all'), '(min-width: 668px)', Modernizr.cssanimations, Modernizr.touchevents, document.getElementsByTagName('main')[0], document.getElementsByTagName('footer')[0], '(min-width: 601px)', /[^\d]+\d(\d+)[^\d]+$/, function (path) {
	return "images/0" + path + ".jpg";
}, function(){}, poloAF.Util.always('')));