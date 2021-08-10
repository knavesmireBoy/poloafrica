/*jslint nomen: true */
/*global window: false */
/*global navigator: false */
/*global document: false */
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
/*
	function fallBack(ancr) {
		ancr.removeChild(poloAF.Util.getByTag('video'));
        var anCrIn = utils.insert(),
            node = poloAF.Util.getNextElement(ancr.firstChild),
            txt =  [['txt', 'No video with supported media and MIME type found']],
            setText = twice(poloAF.Util.doMap)(txt);
        _.compose(setText, anCrIn(ancr, node))('p');
	}

	function fixVideo() {
		var sources = poloAF.Util.getByTag('source'),
			source_errors = 0;
        poloAF.Util.report(sources);
		_.each(sources, function (source) {
			poloAF.Util.eventer('error', [], function () {
                poloAF.Util.report();
				if (++source_errors >= sources.length) {
					fallBack(source.parentNode.parentNode);
				}
			}, source).execute();
		});
	}
    */
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
       eventer = poloAF.Util.eventer,
		doAlt = poloAF.Util.doAlternate(),
		threshold = Number(query.match(number_reg)[1]),
       */
		command = (function (coll) {
			var sub,
				copy,
				repl = [];
			if (touch) {
				return {
					render: ptL(_.each, coll, function (a) {
						copy = poloAF.Util.drillDown(['innerHTML'])(a).split('(');
						sub = doMatch(copy[1]) ? 1 : 7;
						sub = copy[1].substring(0, copy[1].length - sub);
						sub = '<span>' + sub + '</span>';
						poloAF.Util.doMap(a, [
							['txt', copy[0] + sub]
						]);
					}),
					unrender: function () {
						poloAF.Util.report('unrender');
					}
				};
			}
			return {
				render: ptL(_.each, coll, function (a) {
					copy = poloAF.Util.drillDown(['innerHTML'])(a).split('(');
					sub = doMatch(copy[1]) ? 1 : 7;
					repl.push(' ' + copy[1].substring(copy[1].length - sub));
					poloAF.Util.doMap(a, [
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
						poloAF.Util.doMap(a, [
							['TXT', sub],
							['title', '']
						]);
					});
					repl = [];
				}
			};
		}(_.compose(ptL(poloAF.Util.getByTag, 'a'), ptL(poloAF.Util.findByTag(0), 'nav'))(poloAF.Util.$('presslinks')))),
		mysemicolon;
	/* if we wanted to toggle the between showing text in brackets below 668px and moving that copy to title attribute
       we would need the following and set a resize handler
       outcomes = [command.render, command.unrender],
		getEnvironment = (function () {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return _.partial(poloAF.Util.isDesktop, threshold);
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