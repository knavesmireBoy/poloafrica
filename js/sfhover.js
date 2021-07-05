/*jslint nomen: true */
/*global window: false */
/*global poloAF: false */
/*global document: false */
/*global _: false */
(function (paths) {
	"use strict";

	function simpleInvoke(o, m, arg) {
		return o[m](arg);
	}

	function getSubString(str, n) {
		return str.substring(n || 0);
	}

	function setter(o, k, v) {
		o[k] = v;
		return o;
	}

	function getter(o, k) {
		return o && o[k];
	}
	var config = {
			id: 'current'
		},
		utils = poloAF.Util,
		ptL = _.partial,
		doTwice = utils.curryTwice(),
		doThriceDefer = utils.curryThrice(true),
		doThrice = utils.curryThrice(),
		getBody = doThrice(simpleInvoke)('body')('getElementsByTagName'),
		getLinks = doThriceDefer(simpleInvoke)('a')('getElementsByTagName')(document),
		getList = doThrice(simpleInvoke)('li')('getElementsByTagName'),
		nav = utils.$('nav'),
		getTerm = _.compose(doTwice(getter)('id'), utils.getZero, getBody),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		getTarget = utils.drillDown([mytarget, 'parentNode']),
		getDomTargetLink = utils.getDomChild(utils.getNodeByTag('a')),
		nav1 = document.getElementsByTagName("nav")[0],
		gal = utils.$('footer_girl'),
		isParent = function (el) {
			return el.parentNode.id === 'nav';
		},
		gal_img = gal.getElementsByTagName("img")[0],
		ie6 = utils.getComputedStyle(gal_img, 'color') === 'red' ? true : false,
		links = _.compose(doTwice(_.filter)(isParent), getList, utils.always(nav)),
		found = ptL(_.filter, links(), function (link) {
			return new RegExp(getTerm(document), 'i').test(getDomTargetLink(link).innerHTML);
		}),
        doOdd = function () {
            var addOdd = _.partial(utils.addClass, 'odd'),
                sections = doThrice(simpleInvoke)('section')('getElementsByTagName')(document);
            _.each(_.toArray(sections), function (el, i) {
                if ((i % 2) === 0) {
                    addOdd(el);
                }
            });
        },
        setId = function (el, id) {
            utils.setAttributes({
                id: id
            }, el);
        },
        setIdBridge = function (i, el, id) {
            setId(el.parentNode, id);
        },
        fallback = function (test_el, deco, config) {
            var fb = utils.$("FacebookBadge").getElementsByTagName("img")[0],
                insta = utils.$("InstagramIcon").getElementsByTagName("img")[0];
            _.each(_.zip(paths, [test_el, insta, fb]), function (arr, i) {
                deco(i, arr[1], 'pologirl');
                utils.setAttributes(config(arr[0]), arr[1]);
            });
        },
		sub = doTwice(getSubString)(document.getElementById('home') ? 3 : 0),
		hiLite = _.compose(ptL(utils.setAttributes, config), utils.getZero, found),
		doHover = _.compose(ptL(utils.addClass, 'sfhover'), getTarget),
		unDoHover = _.compose(ptL(utils.removeClass, 'sfhover'), getTarget);
	utils.addHandler('mouseover', nav1, doHover);
	utils.addHandler('mouseout', nav1, unDoHover);
	hiLite();
	utils.doWhen(!window.addEventListener, doOdd);
	utils.doWhen(ie6, ptL(fallback, gal_img, ptL(utils.invokeOnFirst, setIdBridge), _.compose(ptL(setter, {}, 'src'), sub)));
	_.compose(doTwice(setId)('mark'), _.last, getLinks)();
}(["../images/resource/footer_girl8.png", "../images/resource/instagram.png", "../images/resource/facebook8.png"]));