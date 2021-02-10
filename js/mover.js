/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
(function(mq, query, tween) {
	"use strict";

	function noOp() {
		//console.log('default')
	}

	function invokemethod(o, arg, m) {
		return o[m](arg);
	}
	var dummy = {},
		//con = window.console.log.bind(window),
		report = function(msg, el) {
			el = el || utils.getByTag('h2', document)[0];
			msg = msg === undefined ? document.documentElement.className : msg;
			el.innerHTML = msg;
		},
		utils = poloAF.Util,
		ie6 = utils.$('tween'),
		ptL = _.partial,
		doTwice = utils.curryTwice(),
		doThrice = utils.curryThrice(),
		doAlt = utils.doAlternate(),
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		getTarget = utils.drillDown([mytarget]),
		animation = utils.$("ani"),
		main = document.getElementsByTagName('main')[0],
		sections = document.getElementsByTagName('section'),
		firstlink = sections[0].getElementsByTagName('a')[0],
		getArticle = utils.getSibling(utils.getNodeByTag('article')),
		getSection = utils.getDomParent(utils.getNodeByTag('section')),
		getHeading = _.compose(utils.getDomChild(utils.getNodeByTag('h3')), utils.getChild),
		getSvgPath = utils.getDomChildDefer(utils.getNodeByTag('path'))(document.getElementsByTagName('svg')[0]),
		klasAdd = utils.addClass,
		headingmatch = doThrice(invokemethod)('match')(/^h\d$/i),
		isHeading = _.compose(headingmatch, utils.drillDown(['nodeName'])),
		images = _.compose(_.flatten, doTwice(_.map)(_.toArray), ptL(_.map, sections, ptL(utils.getByTag, 'img')))(),
		//https://stackoverflow.com/questions/9991179/modernizr-2-5-3-media-query-testing-breaks-page-in-ie-and-opera
		getEnvironment = ptL(utils.isDesktop, threshold),
		execMobile = _.compose(ptL(utils.removeClass, 'invisible'), getSvgPath),
		execDesktop = _.compose(ptL(utils.removeClass, 'invisible'), utils.getNext, getSvgPath),
		undoMobile = _.compose(ptL(utils.addClass, 'invisible'), getSvgPath),
		undoDesktop = _.compose(ptL(utils.addClass, 'invisible'), utils.getNext, getSvgPath),
		negater = function(alternators) {
			//report();
			/*NOTE netrenderer reports window.width AS ZERO*/
			if (!getEnvironment()) {
				_.each(alternators, function(f) {
					f();
				});
				getEnvironment = _.negate(getEnvironment);
			}
		},
		bridge = function(e) {
			var tgt = getTarget(e),
				section = tgt && getSection(tgt),
				hit = section && utils.getClassList(section).contains('show');
			if (!section || !isHeading(utils.getParent(tgt))) {
				return;
			}
			_.each(sections, function(sec) {
				utils.hide(sec);
			});
			if (!hit) {
				utils.show(section);
			}
			// 
		},
		//this.querySelector("svg > path:nth-of-type(2)").classList.toggle("invisible");
		/*
       floating_elementsSVG = function (elements, getArticle, getHeading, before, after) {
			return _.map(elements, function (el) {
               var mq  = window.matchMedia("(max-width: 667px)"),
                   setViewBox = doSvg(document.getElementsByTagName('svg')[0]),
                   //doMobile = ptL(setViewBox, "0 0 150 75"),
                   doDesktop = ptL(setViewBox, "0 0 340 75"),
                   article = getArticle(el),
                   h = article && getHeading(article),
                   onmobile = _.compose(ptL(after, el, h), doMobile),
                   ondesktop = _.compose(ptL(before, article, el), doDesktop);
               if(mq.matches){//onload
                   doMobile();
               }
               if(h){
                   return doAlt([onmobile, ondesktop]);
               }
			}); //map           
		},
       */
		floating_elements = function(elements, getArticle, getHeading, before, after) {
			return _.map(elements, function(el) {
				var mq = window.matchMedia("(max-width: 667px)"),
					article = getArticle(el),
					h = article && getHeading(article),
					onmobile = _.compose(ptL(after, el, h), _.compose(execMobile, undoDesktop)),
					ondesktop = _.compose(ptL(before, article, el), _.compose(undoMobile, execDesktop));
				if (mq.matches) { //onload
					_.compose(execMobile, undoDesktop)();
				}
				if (h) {
					return doAlt([onmobile, ondesktop]);
				}
			}); //map           
		},
		float_handler,
		$sections;
	/* float is used for layout on older browsers and requires that the image comes before content in page source order We provide a javascript fallback for browsers that don't support flex(wrap). If javascript is disabled we can use input/labels to toggle display of image and article.
	 */
	utils.addHandler('click', main, bridge);
	dummy[mytarget] = firstlink;
	bridge(dummy);
	if (animation && !ie6) {
		images.splice(-2, 2);
		images.push(animation);
	}
	float_handler = ptL(negater, floating_elements(images, getArticle, getHeading, utils.insertBefore, utils.insertAfter));
	float_handler();
	utils.addHandler('resize', window, _.throttle(float_handler, 99));
	$sections = _.map(document.getElementsByTagName('section'), function(el) {
		var $el = utils.machElement(ptL(klasAdd, 'display'), utils.always(el));
		$el.unrender = noOp;
		return $el;
	});
	utils.setScrollHandlers($sections, doTwice(utils.getScrollThreshold)(0.4), 'display', 1);
	window.setTimeout($sections[0].render, 666);
	return true;
}(Modernizr.mq('only all'), '(min-width: 668px)'), document.getElementById('tween'));