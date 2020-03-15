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

	function partial(f, el) {
		return _.partial(f, el);
	}

	function noOp() {
		//return function (){};
	}
	var utils = window.poloAF.Util,
		con = window.console.log.bind(window),
		$ = utils.$,
		ptL = _.partial,
		report = function (msg) {
			utils.getByTag('h2', document)[0].innerHTML = undef(msg) ? document.documentElement.className : msg;
			//utils.getByTag('b', $('footer_girl'))[0].innerHTML = msg || document.documentElement.className;
		},
		dovier = utils.curryFourFold(),
        doTwiceDefer = utils.curryTwice(true),
		klasTog = utils.toggleClass,
		main = _.compose(utils.getZero, _.partial(utils.getByTag, 'main', document))(),
		doToggle = ptL(klasTog, 'alt', main),
		thumbs = utils.getByTag('ul', main)[0],
		makeIterator = function (coll) {
			var prepIterator = dovier(window.poloAF.Iterator(false));
			return prepIterator(ptL(modulo, coll.length))(utils.always(true))(coll)(0);
		},
		getNodeName = utils.drillDown(['target', 'nodeName']),
		getTarget = utils.drillDown(['target']),
		getLength = utils.drillDown(['length']),
        getHeight = doTwiceDefer(utils.getter)('offsetHeight'),
        getWidth = doTwiceDefer(utils.getter)('offsetWidth'),
        //getOrient = _.compose(utils.gtThan(getHeight, getWidth)
		getDomTargetImg = utils.getDomChild(utils.getNodeByTag('img')),
        exitGallery = function (e) {
			if (getNodeName(e).match(/img/i)) {
                 var m,
                    current = utils.getByClass('show')[0],
					img = getDomTargetImg(current);
                //when slideshow is playing there won't be a current item; maybe add/remove listener
                    if(img) {
					m = utils.gtThan(getHeight(img), getWidth(img)) ? 'addClass' : 'removeClass';
                        utils[m]('portrait', thumbs);
                    }
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
			var m = (el.offsetHeight > el.offsetWidth) ? 'addClass' : 'removeClass';
			utils[m]('portrait', utils.getDomParent(utils.getNodeByTag('li'))(el));
		},
		fixNoNthChild = _.compose(ptL(utils.doWhen, _.negate(utils.always(Modernizr.nthchild))), ptL(partial, doPortrait)),
		doPortraitLoop = ptL(_.each, allpics, fixNoNthChild),
		doPortraitBridge = function (e) {
			fixNoNthChild(e.target);
		},
		toogleLoop = _.compose(doPortraitLoop, doToggle),
		een = ['01', '02', '03', '09', '04', '05', '06', '07', '08', 24, 10, 11, 12, 13],
		advance = function () {
			var twee = [14, 15, 16, 17, 28, 33, 34, 35, 36, 43, 18, 19, 20, 21],
				drie = [22, 23, 25, 26, 47, 70, 82, 60, 67, 69, 27, 29, 30, 31],
				vyf = [50, 51, 53, 54, 55, 56, 57, 58, 59, 61, 62, 63],
				vier = [32, 37, 38, 39, 40, 41, 42, 44, 45, 46, 48, 49],
				ses = [64, 65, 66, 68, 71, 72, 73, 74, 75, 76, 77, 78],
				sewe = _.range(83, 97),
				iterator = makeIterator([een, twee, drie, vier, vyf, ses, sewe]),
				doNeg = ptL(negator, toogleLoop);
			return function (e) {
				if (getNodeName(e).match(/a/i)) {
					var m = utils.getPrevious(getTarget(e)) ? 'forward' : 'back',
						gang = iterator[m](),
						allpics = utils.getByTag('img', main),
						path = '001';
					doNeg(allpics, gang);
					allpics = utils.getByTag('img', main);
					_.each(allpics, function (img, j) {
						path = gang[j] || path;
						img.src = "images/0" + path + ".jpg";
						img.onload = doPortraitBridge;
					});
				}
			};
		},
		myadvance = advance();
	utils.addEvent(ptL(utils.addHandler, 'click'), _.debounce(exitGallery, 300))(thumbs);
	utils.addEvent(ptL(utils.addHandler, 'click'), myadvance)(main);
}('(min-width: 601px)', Modernizr.mq('only all')));