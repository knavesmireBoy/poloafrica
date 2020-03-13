/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global _: false */
if (!window.poloAF) {
	window.poloAF = {};
}
(function (thequery, mq) {
	"use strict";

	function modulo(n, i) {
		return i % n;
	}
    function undef(x) {
		return typeof (x) === 'undefined';
	}

	var utils = window.poloAF.Util,
        ptL = _.partial,
		//con = window.console.log.bind(window),
		//$ = utils.$,
		report = function (msg) {
			utils.getByTag('h2', document)[0].innerHTML = undef(msg) ? document.documentElement.className : msg;
			//utils.getByTag('b', $('footer_girl'))[0].innerHTML = msg || document.documentElement.className;
		},
		dovier = utils.curryFourFold(),
		klasTog = utils.toggleClass,
		main = _.compose(utils.getZero, _.partial(utils.getByTag, 'main', document))(),
		doToggle = ptL(klasTog, 'alt', main),
		all_thumbs = utils.getByTag('ul', main),
		thumbs = all_thumbs[0],
		makeIterator = function (coll) {
			var prepIterator = dovier(window.poloAF.Iterator(false));
			return prepIterator(ptL(modulo, coll.length))(utils.always(true))(coll)(0);
		},
		getNodeName = utils.drillDown(['target', 'nodeName']),
		getTarget = utils.drillDown(['target']),
		getLength = utils.drillDown(['length']),
		query = function () {
			if (utils.getClassList(utils.getByClass('show')[0]).contains('portrait')) {
				utils.addClass('portrait', thumbs);
			} else {
				utils.removeClass('portrait', thumbs);
			}
		},
		allpics = utils.getByTag('img', main),
		neg = function (a, b) {
			return getLength(a) !== getLength(b);
		},
		negator = function (cb, a, b) {
			if (neg(a, b)) {
				cb();
				neg = _.negate(neg);
			}
		},
		doPortrait = function (el) {
			var pass = el.offsetHeight > el.offsetWidth,
				m = pass ? 'addClass' : 'removeClass';
			utils[m]('portrait', utils.getDomParent(utils.getNodeByTag('li'))(el));
		},
		doDoPortrait = function (el) {
			utils.doWhen(_.negate(utils.always(Modernizr.nthchild)), ptL(doPortrait, el));
		},
		doPortraitBridge = function (e) {
			doDoPortrait(e.target);
		},
		een = ['01', '02', '03', '09', '04', '05', '06', '07', '08', 24, 10, 11, 12, 13],
		advance = function () {
			var twee = [14, 15, 16, 17, 28, 33, 34, 35, 36, 43, 18, 19, 20, 21],
				drie = [22, 23, 25, 26, 47, 70, 82, 60, 67, 69, 27, 29, 30, 31],
				vyf = [50, 51, 53, 54, 55, 56, 57, 58, 59, 61, 62, 63],
				vier = [32, 37, 38, 39, 40, 41, 42, 44, 45, 46, 48, 49],
				ses = [64, 65, 66, 68, 71, 72, 73, 74, 75, 76, 77, 78],
				sewe = _.range(83, 97),
				iterator = makeIterator([een, twee, drie, vier, vyf, ses, sewe]),
				doNeg = ptL(negator, doToggle);
			return function (e) {
				if (getNodeName(e).match(/a/i)) {
					var m = utils.getNext(getTarget(e)) ? 'back' : 'forward',
						gang = iterator[m](),
						allpics = utils.getByTag('img', main),
						path = '001';
					doNeg(allpics, gang);
					allpics = utils.getByTag('img', main);
					_.each(allpics, function (img, j) {
						path = gang[j] || path;
						img.src = "images/0" + path + ".jpg";
						img.onload = doPortraitBridge;
					});				}
			};
		},
		myadvance = advance();
        
	utils.addHandler('click', thumbs, _.debounce(query, 300));
	_.each(allpics, function (img) {
		doPortrait(img);//add portrait class until i fix gallery.js
	});
	utils.addEvent(ptL(utils.addHandler, 'click'), myadvance)(main);
}('(min-width: 601px)', Modernizr.mq('only all')));