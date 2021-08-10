/*jslint nomen: true */
/*global window: false */
/*global poloAF: false */
/*global document: false */
/*global Modernizr: false */
/*global _: false */
(function (paths) {
	"use strict";
    
	function getSubString(str, n) {
		return str.substring(n || 0);
	}

	function setter(o, k, v) {
		o[k] = v;
		return o;
	}

	function isOddCb(el, i) {
		return !(i % 2);
	}

	function invoke(f) {
		return f.apply(null, _.rest(arguments));
	}

	function doCallbacks(cb, coll, p) {
		return _[p](coll, cb);
	}
	var utils = poloAF.Util,
		ptL = _.partial,
		doTwice = utils.curryFactory(2),
		doThriceDefer = utils.curryFactory(3, true),
		doEach = doThriceDefer(doCallbacks)('each'),
		getLinks = ptL(utils.getByTag, 'a'),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		getTarget = utils.drillDown([mytarget, 'parentNode']),
		nav1 = utils.findByTag(0)("nav"),
		gal = utils.$('footer_girl'),
		gal_img = gal.getElementsByTagName("img")[0],
		ie6 = utils.getComputedStyle(gal_img, 'color') === 'red' ? true : false,
		doOdd = doEach(utils.getByTag('section'))(ptL(utils.invokeWhen, ptL(invoke, isOddCb), ptL(utils.addClass, 'odd'))),
		setId = function (el, id) {
			utils.setAttributes({
				id: id
			}, el);
		},
		setIdBridge = function (i, el, id) {
			setId(el.parentNode, id);
		},
		fallback = function (test_el, deco, config) {
			var getByTag = utils.findByTag(0),
				fb = getByTag('img', utils.$("FacebookBadge")),
				insta = getByTag('img', utils.$("InstagramIcon"));
			_.each(_.zip(paths, [test_el, insta, fb]), function (arr, i) {
				deco(i, arr[1], 'pologirl');
				utils.setAttributes(config(arr[0]), arr[1]);
			});
		},
		sub = doTwice(getSubString)(document.getElementById('home') ? 3 : 0),
		doHover = _.compose(ptL(utils.addClass, 'sfhover'), getTarget),
		unDoHover = _.compose(ptL(utils.removeClass, 'sfhover'), getTarget);
	utils.eventer('mouseover', [], doHover, nav1).execute();
	utils.eventer('mouseout', [], unDoHover, nav1).execute();
	//utils.highLighter.perform();
	utils.doWhen(!Modernizr.nthchild, doOdd);
	utils.doWhen(ie6, ptL(fallback, gal_img, ptL(utils.invokeOnFirst, setIdBridge), _.compose(ptL(setter, {}, 'src'), sub)));
	_.compose(doTwice(setId)('mark'), _.last, getLinks)();
  //utils.report();
}(["../images/resource/footer_girl8.png", "../images/resource/instagram8.png", "../images/resource/facebook8.png"]));