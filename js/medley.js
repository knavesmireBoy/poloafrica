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

	function simpleInvoke(o, m, arg) {
		//console.log(arguments)
		return o && o[m] && o[m](arg);
	}
	/* copies text in brackets for every list element in Press Coverage into title attribute for desktop environments*/
	var mq = Modernizr.mq('only all'),
		query = '(min-width: 668px)',
		//https://gist.github.com/vyspiansky/9779373
		touch = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false,
		utils = poloAF.Util,
		eventer = utils.eventer,
		//con = window.console.log.bind(window),
		ptL = _.partial,
		doThrice = utils.curryFactory(3),
		doAlt = utils.doAlternate(),
		doMatch = doThrice(simpleInvoke)(/\d\)$/)('match'),
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
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
                    /*
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
                    */
				}
			};
		}(_.compose(ptL(utils.getByTag, 'a'), ptL(utils.findByTag(0), 'nav'))(utils.$('presslinks')))),
		toggler = doAlt([command.render, command.unrender]),
		handler = ptL(negater, toggler);
	eventer('resize', [], _.throttle(handler, 99), window).execute();
	if (getEnvironment()) {
		toggler();
	} else {
		getEnvironment = _.negate(getEnvironment);
		toggler();
	}
}());