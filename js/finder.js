/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
(function(query, mq) {
	"use strict";

	function noOp() {
        //console.log('default')
    }
    
    function thunk(f) {
		return f.apply(f, _.rest(arguments));
	}
    
    function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}
    function getPageOffset(bool) {
		var w = window,
			d = document.documentElement || document.body.parentNode || document.body,
			x = (w.pageXOffset !== undefined) ? w.pageXOffset : d.scrollLeft,
			y = (w.pageYOffset !== undefined) ? w.pageYOffset : d.scrollTop;
		return bool ? x : y;
	}
    
    
    function getElementOffset(el) {
        var elementHeight = el.offsetHeight || el.getBoundingClientRect().height;
        return utils.getElementOffset(el).top + elementHeight;
    }
    
    function invokemethod(o, arg, m) {
		return o[m](arg);
	}
	var utils = poloAF.Util,
		ptL = _.partial,
		doTwice = utils.curryTwice(),
		doThrice = utils.curryThrice(),
		con = window.console.log.bind(window),
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		main = document.getElementsByTagName('main')[0],
		articles = document.getElementsByTagName('article'),
        images = _.compose(_.flatten, doTwice(_.map)(_.toArray), ptL(_.map, articles, ptL(utils.getByTag, 'img')))(),
        animation = utils.$("ani"),
		doAlt = utils.doAlternate(),
        doWrap2 = utils.always(!Modernizr.flexwrap),
        doWrap2 = utils.always(true),
		getEnvironment = (function() {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return _.partial(utils.isDesktop, threshold);
			}
		}()),
		//isDesktop = getEnvironment(),
		negater = function(alternators, func) {
			if (!getEnvironment()) {
				_.each(alternators, function(f) {
					f();
				});
                func();
				getEnvironment = _.negate(getEnvironment);
			}
		},
       
        headingmatch = doThrice(invokemethod)('match')(/h3/i),
        isHeading = _.compose(headingmatch, utils.drillDown(['target', 'nodeName'])),
		bridge = function(e) {
            if (!isHeading(e)) {
                return;
            }
			var el = utils.getDomParent(utils.getNodeByTag('article'))(e.target),
				hit = utils.getClassList(el).contains('show');
			_.each(articles, function(article) {
				utils.hide(article);
			});
			if (!hit) {
				utils.show(el);
			}
		},
        getSib = function(el){
            if(animation){
                return utils.getNext(el);
            }
            return utils.getSibling(utils.getNodeByTag('section'))(el);
        },
		floaters = function(els) {
			var conditions = [doTwice(utils.getter)('id'), doWrap2, utils.always(true)],
				invoker = function(elem, zipped) {
					return elem && zipped[0](elem);
				};
			return _.map(els, function(el) {
				var section = getSib(el),
                    outbound = function() {
                        utils.insertAfter(el, utils.getNextElement(section.firstChild));
					},
					inbound = function() {
						section.parentNode.insertBefore(el, section);
					},
					move = function() {
                       var p = utils.getSibling(utils.getNodeByTag('p'))(section.firstChild);
                        //utils.insertAfter(el, utils.getNextElement(section.firstChild));
                        section.insertBefore(el, p);
					},
					unmove = function() {
                        section.parentNode.insertBefore(el, section);
					},
					standard = [move, unmove],
					floater = [outbound, inbound],
					def = [noOp, noOp],
					meroutes = _.zip(conditions, [floater, standard, def]),
					reducer = function(el) {
						return utils.getBest(ptL(invoker, el), meroutes)[1];
					},
					pair = reducer(el);
				if (getEnvironment()) {
					//pair.reverse();
				}
               
				return doAlt(pair);
			}); //map           
		},
        myF = function(){
            var offsets = _.toArray(utils.getByClass('show')),
                last = offsets.pop();
                window.pageYOffset = getElementOffset(last)+window.innerHeight;
            con(9)
            //document.scrollTop = last;
        },
        /*
        doScroll = function(el){
            return greater(getPageOffset() - utils.getScrollThreshold(el))
        },
        options = [utils.show, utils.hide],
        ops = [utils.shout('confirm', 'C'), utils.shout('alert', 'A')],
        doBest = function(actions, el){
           return utils.getBest(ptL(doScroll, el), actions);
        },
        mapped = _.map(articles, ptL(doBest, [utils.show, utils.hide])),
        scroller = function () {
            var smile = function(f){
                    var isNotEq = _.negate(utils.isEqual),
                         hide = _.compose(utils.hide, utils.getPrevious),
                        show = _.compose(utils.show, utils.getNext),
                        el = getResult(f),
                        current = utils.getZero(utils.getByClass('show')),
                        action = _.compose(utils.show, utils.always(el)),
                        zipped = _.zip([el, current], [action, noOp]);
                        //utils.hide(current);
                   return _.compose(ptL(utils.byIndex, 1), ptL(utils.getBest, _.compose(ptL(isNotEq, current), utils.getZero), zipped))();
                },
                reducer = function(champ, contender){
                    return doScroll(contender) ? contender : champ;
                },
                primed = ptL(_.reduce, articles, reducer),
                throttled = _.throttle(_.compose(getResult, ptL(thunk, smile, primed)), 100);
		},
        */
		float_handler;
	/* float is used for layout on older browsers and requires that the image comes before content in page source order
	if flex is fully supported we can re-order through css. We provide a javascript fallback for browsers that don't support flex(wrap). If javascript is disabled we can use input/labels, but the picture will come before the content
	*/
	main.addEventListener('click', bridge);
	bridge({
		target: articles[0].getElementsByTagName('h3')[0]
	});
    if(utils.$('enquiries')){
        return;
    }
    if(animation){
        images.pop();
        images.pop();
        images.push(animation);
    }
    //reverse reqd to fix polo page in float mode
    //float_handler = ptL(negater, floaters(utils.reverse(images)));
    float_handler = ptL(negater, floaters(images), noOp);
    float_handler();
    utils.setScrollHandlers(articles, doTwice(utils.getScrollThreshold)(0.1));
	utils.addHandler('resize', window, _.throttle(float_handler, 99));
}('(min-width: 736px)', Modernizr.mq('only all')));