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

	function undef(x) {
		return typeof (x) === 'undefined';
	}

	function invokemethod(o, arg, m) {
		return o[m](arg);
	}
	var dummy = {},
        utils = poloAF.Util,
        animation = utils.$("ani"),
        sections = document.getElementsByTagName('section'),
        firstlink = sections[0].getElementsByTagName('a')[0],
        getArticle = utils.getSibling(utils.getNodeByTag('article')),
        getPara = utils.getSibling(utils.getNodeByTag('p')),
        getSection = utils.getDomParent(utils.getNodeByTag('section')),
        getParent = utils.drillDown(['parentNode']),
		ptL = _.partial,
		doTwice = utils.curryTwice(),
		doThrice = utils.curryThrice(),
		//con = window.console.log.bind(window),
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		main = document.getElementsByTagName('main')[0],
        mytarget = !window.addEventListener ? 'srcElement' : 'target',
        getTarget = utils.drillDown([mytarget]),
        /*
		report = function (msg, el) {
			el = el || utils.getByTag('h2', document)[0];
			msg = undef(msg) ? document.documentElement.className : msg;
			el.innerHTML = msg;
		},
        */
		
		images = _.compose(_.flatten, doTwice(_.map)(_.toArray), ptL(_.map, sections, ptL(utils.getByTag, 'img')))(),
		doAlt = utils.doAlternate(),
        //https://stackoverflow.com/questions/9991179/modernizr-2-5-3-media-query-testing-breaks-page-in-ie-and-opera
		getEnvironment = (function () {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return _.partial(utils.isDesktop, threshold);
			}
		}()),
		negater = function (alternators, func) {
         //report();
         /*NOTE netrenderer reports window.width AS ZERO*/
			if (!getEnvironment()) {
				_.each(alternators, function (f) {
					f();
				});
				func();
				getEnvironment = _.negate(getEnvironment);
			}
		},
		headingmatch = doThrice(invokemethod)('match')(/h3/i),
		isHeading = _.compose(headingmatch, utils.drillDown(['nodeName'])),
		bridge = function (e) {
         var tgt = getTarget(e),
				el = tgt && getSection(tgt),
				hit = el && utils.getClassList(el).contains('show');
			if (!el || !isHeading(getParent(tgt))) {
				return;
			}
			_.each(sections, function (section) {
				utils.hide(section);
			});
			if (!hit) {
				utils.show(el);
			}
		},
		floating_images = function (els) {
			return _.map(els, function (el) {
				var article = getArticle(el),
                    p = getPara(article.firstChild),
					move = function () {
                       article.insertBefore(el, p);
					},
					unmove = function () {
                        utils.insertBefore(article, el);
					};
				return doAlt([move, unmove]);
			}); //map           
		},
		float_handler;
	/* float is used for layout on older browsers and requires that the image comes before content in page source order
	if flex is fully supported we can re-order through css. We provide a javascript fallback for browsers that don't support flex(wrap). If javascript is disabled we can use input/labels.
	*/
	utils.addHandler('click', main, bridge);
    dummy[mytarget] = firstlink;
	bridge(dummy);
	if (utils.$('enquiries')) {
		return;
	}
	if (animation) {
		images.splice(-3, 3);
		images.push(animation);
		utils.removeNodeOnComplete(utils.$('tween'));
	}
	float_handler = ptL(negater, floating_images(images), noOp);
	float_handler();
	utils.addHandler('resize', window, _.throttle(float_handler, 99));
	return true;
}(Modernizr.mq('only all'), '(min-width: 668px)', window.matchMedia('only screen and (max-width: 668px)').matches));