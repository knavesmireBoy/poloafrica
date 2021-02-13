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
    
    function viewBoxDims(s){
        var a = s.split(' ').slice(-2);
        return a;
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
		klasAdd = utils.addClass,
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
         doSvg = function(svg){
             //utils.report(utils.$('logo').id);
           return function(str){
               if(svg && str){
                 var o = viewBoxDims(str);
                svg.setAttribute('viewBox', str);
                //'px' is assumed a[0]+'px'
               // svg.setAttribute('width', o[0]);
               // svg.setAttribute('height', o[1]);  
               }
           }
       },
       setViewBox = doSvg(document.getElementById('logo')),
       doMobile = ptL(setViewBox, "0 0 155 125"),
       doDesktop = ptL(setViewBox, "0 0 340 75"),
		floating_elements = function(elements, getArticle, getHeading, before, after) {
           var mq = window.matchMedia("(max-width: 667px)");
			return _.map(elements, function(el, i) {
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
}(Modernizr.mq('only all'), '(min-width: 667px)'), document.getElementById('tween'));