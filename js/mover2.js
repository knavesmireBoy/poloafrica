/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
(function (mq, ipod, ipad) {
	"use strict";
    
    function invoke(f) {
		return f.apply(null, _.rest(arguments));
	}
    
     function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}
    
    function viewBoxDims(s) {
		var a = s.split(' ').slice(-2);
		return {
			width: a[0],
			height: a[1]
		};
	}
    
    function doMethod(o, v, p) {
		return o[p] && o[p](v);
	}
    
    function equals(a, b){
        return getResult(a) === getResult(b);
    }
    
    var utils = poloAF.Util,
        curryFactory = utils.curryFactory,
        twice = curryFactory(2),
        thricedefer = curryFactory(3, true),
        doGet = twice(utils.getter),
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
        
        logo = document.getElementById('logo'),
        matchAttr = _.partial(equals, thricedefer(doMethod)('getAttribute')('viewBox')(logo)),
        doSetViewBox = _.partial(utils.invokeWhen, _.negate(matchAttr), doSvg(logo)),
        doTest = _.compose(invoke, doGet(0)),
        outcomes = ["0 -2 340 75", "0 -2 340 60", "0 0 155 120"],
        hi = _.partial(Modernizr.mq, ipad),
        mid = _.partial(Modernizr.mq, ipod),
        go = _.compose(doSetViewBox, doGet(1), _.partial(utils.getBestOnly, doTest, _.zip([hi, mid, function(){}], outcomes)));
    
    utils.eventer('resize', [], _.throttle(go, 99), window).execute();
  
}(Modernizr.mq('only all'), '(min-width: 667px)', '(min-width: 1024px)'));