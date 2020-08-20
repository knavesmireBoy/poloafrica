/*jslint nomen: true */
/*global window: false */
/*global poloAF: false */
/*global document: false */
/*global _: false */
(function () {
	"use strict";

	function simpleInvoke(o, m, arg) {
		return o[m](arg);
	}

	function getter(o, k) {
		return o && o[k];
	}
	var utils = poloAF.Util,
		ptL = _.partial,
		doTwice = utils.curryTwice(),
		doThrice = utils.curryThrice(),
		getBody = doThrice(simpleInvoke)('body')('getElementsByTagName'),
		getLinks = doThrice(simpleInvoke)('a')('getElementsByTagName'),
		getTerm = _.compose(doTwice(getter)('id'), utils.getZero, getBody),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		getTarget = utils.drillDown([mytarget, 'parentNode']),
        nav1 = document.getElementsByTagName("nav")[0],
		links = _.compose(getLinks, utils.getZero, doThrice(simpleInvoke)('nav')('getElementsByTagName'))(document),
		found = ptL(_.filter, _.toArray(links), function (link) {
            return new RegExp(getTerm(document), 'i').test(link.innerHTML);
		}),
		config = {
			id: 'current'
		},
		hiLite = _.compose(ptL(utils.setAttributes, config), utils.drillDown(['parentNode']), utils.getZero, found),
		doHover = _.compose(ptL(utils.addClass, 'sfhover'), getTarget),
		unDoHover = _.compose(ptL(utils.removeClass, 'sfhover'), getTarget);
    
    hiLite();
    
    utils.addHandler('mouseover', nav1, doHover);
    utils.addHandler('mouseout', nav1, unDoHover);
	//hiLite();
}());