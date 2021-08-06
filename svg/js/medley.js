/*jslint nomen: true */
/*global window: false */
/*global navigator: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
if (!window.poloAF) {
	window.poloAF = {};
}
(function () {
	"use strict";
/*presslinks, moves link acknowledgements to title attribute on desktop devices*/
	function simpleInvoke(o, m, arg) {
		//console.log(arguments)
		return o && o[m] && o[m](arg);
	}
	/* copies text in brackets for every list element in Press Coverage into title attribute for desktop environments*/
	var utils = poloAF.Util,
		//https://gist.github.com/vyspiansky/9779373
		touch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false,
		//con = window.console.log.bind(window),
		ptL = _.partial,
		doThrice = utils.curryFactory(3),
        doMatch = doThrice(simpleInvoke)(/\d\)$/)('match'),
        /*
        query = '(min-width: 668px)',
        number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		mq = Modernizr.mq('only all'),
        eventer = utils.eventer,
		doAlt = utils.doAlternate(),
		threshold = Number(query.match(number_reg)[1]),
        */
        command = (function (coll) {
			var sub,
				copy,
				repl = [];
			if (touch) {
				return {
					render: ptL(_.each, coll, function (a) {
						copy = utils.drillDown(['innerHTML'])(a).split('(');
						sub = doMatch(copy[1]) ? 1 : 7;
						sub = copy[1].substring(0, copy[1].length - sub);
						sub = '<span>' + sub + '</span>';
						utils.doMap(a, [
							['txt', copy[0] + sub]
						]);
					}),
					unrender: function () {
						utils.report('unrender');
					}
				};
			}
			return {
				render: ptL(_.each, coll, function (a) {
					copy = utils.drillDown(['innerHTML'])(a).split('(');
					sub = doMatch(copy[1]) ? 1 : 7;
					repl.push(' ' + copy[1].substring(copy[1].length - sub));
					utils.doMap(a, [
						['txt', copy[0]],
						['title', copy[1].substring(0, copy[1].length - sub)]
					]);
				}),
				unrender: function () {
					_.each(coll, function (a, i) {
						if (!repl.length) {
							return;
						}
						sub = ('(' + a.getAttribute('title') + repl[i]);
						sub = '<span>' + sub + '</span>';
						utils.doMap(a, [
							['TXT', sub],
							['title', '']
						]);
					});
					repl = [];
				}
			};
		}(_.compose(ptL(utils.getByTag, 'a'), ptL(utils.findByTag(0), 'nav'))(utils.$('presslinks')))),
        mysemicolon;
        /* if we wanted to toggle the between showing text in brackets below 668px and moving that copy to title attribute
        we would need the following and set a resize handler
        outcomes = [command.render, command.unrender],
		getEnvironment = (function () {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return _.partial(utils.isDesktop, threshold);
			}
		}()),
		negater = function (alternator) {
			if (!getEnvironment()) {
				alternator();
				getEnvironment = _.negate(getEnvironment);
			}
		},
        toggler = doAlt(outcomes),
		handler = ptL(negater, toggler);
	//eventer('resize', [], _.throttle(ptL(negater, toggler), 99), window).execute();
    if (getEnvironment()) {
		toggler();
	} else {
		getEnvironment = _.negate(getEnvironment);
		toggler();
	}
    */
    //but we simply run the appropriate command dependent on touch/notouch
    command.render(mysemicolon);
}());