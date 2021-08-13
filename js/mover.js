/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
(function (mq, query, ipad) {
	"use strict";
    
    function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function invokemethod(o, arg, m) {
		return o[m](arg);
	}

	function viewBoxDims(s) {
		var a = s.split(' ').slice(-2);
		return {
			width: a[0],
			height: a[1]
		};
	}
    
    
	var dummy = {},
		//con = window.console.log.bind(window),
		utils = poloAF.Util,
        options = ["2 -2 340 75", "2 -2 340 75"],
		ie6 = utils.$('tween'),
		ptL = _.partial,
		doTwice = utils.curryFactory(2),
		doThrice = utils.curryFactory(3),
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
		headingmatch = doThrice(invokemethod)('match')(/^h\d$/i),
		isHeading = _.compose(headingmatch, utils.drillDown(['nodeName'])),
		images = _.compose(_.flatten, doTwice(_.map)(_.toArray), ptL(_.map, sections, ptL(utils.getByTag, 'img')))(),
		//https://stackoverflow.com/questions/9991179/modernizr-2-5-3-media-query-testing-breaks-page-in-ie-and-opera
		getEnvironment = ptL(utils.isDesktop, threshold),
		getSvgPath = utils.getDomChildDefer(utils.getNodeByTag('path'))(document.getElementsByTagName('svg')[0]),
		execMobile = _.compose(ptL(utils.removeClass, 'invisible'), getSvgPath),
		execDesktop = _.compose(ptL(utils.removeClass, 'invisible'), utils.getNext, getSvgPath),
		undoMobile = _.compose(ptL(utils.addClass, 'invisible'), getSvgPath),
		undoDesktop = _.compose(ptL(utils.addClass, 'invisible'), utils.getNext, getSvgPath),
		removeLabels = function (node) {
			utils.removeNodeOnComplete(utils.getNext(node));
			utils.removeNodeOnComplete(node);
		},
		negater = function (alternators) {
			//report();
			/*NOTE netrenderer reports window.width AS ZERO*/
			if (!getEnvironment()) {
				_.each(alternators, function (f) {
					f();
				});
				getEnvironment = _.negate(getEnvironment);
			}
		},
		bridge = function (e) {
			var tgt = getTarget(e),
				section = tgt && getSection(tgt),
				hit = section && utils.getClassList(section).contains('show');
			if (!section || !isHeading(utils.getParent(tgt))) {
				return;
			}
			_.each(sections, function (sec) {
				utils.hide(sec);
			});
			if (!hit) {
				utils.show(section);
			}
			// 
		},
		doSvg = function (svg) {
			return function (str) {
                str = getResult(str);
				if (svg && str) {
					utils.setAttributes({
						viewBox: str
					}, svg);
					//ipod ios(6.1.6) requires height
					if (!Modernizr.objectfit) {
						utils.setAttributes(viewBoxDims(str), svg);
					}
				}
			};
		},
		setViewBox = doSvg(document.getElementById('logo')),
		doMobile = ptL(setViewBox, "0 0 155 120"),
		//doDesktop = ptL(setViewBox, "2 -2 340 75"),
		doDesktop = ptL(setViewBox, ptL(utils.getBestOnly, ptL(Modernizr.mq, ipad), options)),
		floating_elements = function (elements, getArticle, getHeading, before, after) {
			var mq = window.matchMedia("(max-width: 667px)");//?
			return _.map(elements, function (el, i) {
				var article = getArticle(el),
					h = article && getHeading(article),
					n = i ? 0 : 1,
					justMobile = ptL(utils.doWhen, n, _.compose(execMobile, undoDesktop, doMobile)),
					justDesktop = ptL(utils.doWhen, n, _.compose(undoMobile, execDesktop, doDesktop)),
					onmobile = _.compose(ptL(after, el, h), justMobile),
					ondesktop = _.compose(ptL(before, article, el), justDesktop),
					outcomes = [onmobile, ondesktop];
				if (mq.matches && !n) { //onload
					onmobile();
				}
				if (h) {
					return doAlt(outcomes);
				}
			}); //map           
		},
		float_handler;
	/* float is used for layout on older browsers and requires that the image comes before content in page source order We provide a javascript fallback for browsers that don't support flex(wrap). If javascript is disabled we can use input/labels to toggle display of image and article.
	 */
	utils.eventer('click', [], bridge, main).execute();
	_.each(_.toArray(utils.getByClass('read-more-state')), removeLabels);
	dummy[mytarget] = firstlink;
	bridge(dummy);
	if (animation && !ie6) {
		images.splice(-2, 2);
		images.push(animation);
	}
	float_handler = ptL(negater, floating_elements(images, getArticle, getHeading, utils.insertBefore, utils.insertAfter));
	float_handler();
	utils.eventer('resize', [], _.throttle(float_handler, 99), window).execute();
    _.compose(ptL(utils.removeClass, 'nojs'), ptL(utils.findByClass, 'no-js'))();
   //utils.report();
    //doDesktop();
	return true;
}(Modernizr.mq('only all'), '(min-width: 667px)', '(min-width: 1024px)'));