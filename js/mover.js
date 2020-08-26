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

	function invokemethod(o, arg, m) {
		return o[m](arg);
	}
	var dummy = {},
        //con = window.console.log.bind(window),
		report = function (msg, el) {
			el = el || utils.getByTag('h2', document)[0];
			msg = msg === undefined ? document.documentElement.className : msg;
			el.innerHTML = msg;
		},
        tween = document.getElementById('tween'),
        utils = poloAF.Util,
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
		},
        floating_elements = function (elements, getArticle, getHeading, before, after) {
			return _.map(elements, function (el) {
				var article = getArticle(el),
                    h = article && getHeading(article);
                if(h){
                    return doAlt([ptL(after, el, h), ptL(before, article, el)]);
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

	if (animation && !tween) {
		images.splice(-3, 3);
		images.push(animation);
		utils.removeNodeOnComplete(tween);
	}
    
	float_handler = ptL(negater, floating_elements(images, getArticle, getHeading, utils.insertBefore, utils.insertAfter));
	float_handler();
	utils.addHandler('resize', window, _.throttle(float_handler, 99));
    $sections = _.map(document.getElementsByTagName('section'), function (el) {
        var $el = utils.machElement(ptL(klasAdd, 'display'), utils.always(el));
        $el.unrender = noOp;
        return $el;
    });
    
    utils.setScrollHandlers($sections, doTwice(utils.getScrollThreshold)(0.4), 'display', 1);
    window.setTimeout($sections[0].render, 666);
	return true;
}(Modernizr.mq('only all'), '(min-width: 668px)'));