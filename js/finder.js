/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
(function (mq, query) {
	"use strict";

	function noOp() {
		//console.log('default')
	}

	function simpleInvoke(o, m, arg) {
		return o[m](arg);
	}

	function thunk(f) {
		return f.apply(f, _.rest(arguments));
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function getPageOffset(bool) {
		var w = window,
			d = document.documentElement || document.body.parentNode || document.body,
			x = (w.pageXOffset !== undefined) ? w.pageXOffset : d.scrollLeft,
			y = (w.pageYOffset !== undefined) ? w.pageYOffset : d.scrollTop;
		return bool ? x : y;
	}

	function getElementOffset(el) {
		var elementHeight = el.offsetHeight || el.getBoundingClientRect().height;
		return poloAF.Util.getElementOffset(el).top + elementHeight;
	}

	function invokemethod(o, arg, m) {
		return o[m](arg);
	}
	var utils = poloAF.Util,
		ptL = _.partial,
		doTwice = utils.curryTwice(),
		doThrice = utils.curryThrice(),
		//con = window.console.log.bind(window),
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		main = document.getElementsByTagName('main')[0],
		report = function (msg, el) {
			el = el || utils.getByTag('h2', document)[0];
			msg = msg || document.documentElement.className;
			el.innerHTML = msg;
		},
		articles = document.getElementsByTagName('article'),
		images = _.compose(_.flatten, doTwice(_.map)(_.toArray), ptL(_.map, articles, ptL(utils.getByTag, 'img')))(),
		animation = utils.$("ani"),
		doAlt = utils.doAlternate(),
		doWrap = utils.always(true),
		getEnvironment = (function () {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return _.partial(utils.isDesktop, threshold);
			}
		}()),
		//isDesktop = getEnvironment(),
		negater = function (alternators, func) {
			if (!getEnvironment()) {
				_.each(alternators, function (f) {
					f();
				});
				func();
				getEnvironment = _.negate(getEnvironment);
			}
		},
		headingmatch = doThrice(invokemethod)('match')(/h3/i),
		isHeading = _.compose(headingmatch, utils.drillDown(['target', 'nodeName']));
		var bridge = function (e) {
			if (!isHeading(e)) {
				return;
			}
			var el = utils.getDomParent(utils.getNodeByTag('article'))(e.target),
				hit = utils.getClassList(el).contains('show');
			_.each(articles, function (article) {
				utils.hide(article);
			});
			if (!hit) {
				utils.show(el);
			}
		},
		getSib = function (el) {
			if (animation) {
				return utils.getNext(el);
			}
			return utils.getSibling(utils.getNodeByTag('section'))(el);
		};
		
}(Modernizr.mq('only all'), '(min-width: 668px)'));