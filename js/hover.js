/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global poloAF: false */
/*global setTimeout: false */
/*global _: false */
if (!window.poloAF) {
	window.poloAF = {};
}
(function (logo_paths) {
	"use strict";

	function modulo(i, n) {
		return i % n;
	}

	function curry2(fun) {
		return function (secondArg) {
			return function (firstArg) {
				return fun(firstArg, secondArg);
			};
		};
	}

	function curryDefer(fun) {
		return function (firstArg) {
			return function () {
				return fun(firstArg);
			};
		};
	}

	function always(val) {
		return function () {
			return val;
		};
	}

	function ani(o) {
		var anCrIn = o.insert(),
			section = o.getByTag('section', document),
			ancr = section[section.length - 1],
			article = o.getByTag('article', ancr)[0],
			ret = o.machElement(_.partial(o.setAttributes, {
				id: 'ani'
			}), anCrIn(article, ancr), always('aside'));
		ret.render();
	}

	function flower(o) {
		var anCr = o.append(),
			ret = o.machElement(_.partial(o.setAttributes, {
				id: 'flower',
				src: logo_paths[0],
				alt: ''
			}), anCr(o.$('ani')), always('img'));
		ret.render();
	}
	var U = poloAF.Util,
		ptL = _.partial,
		$ = function (str) {
			return document.getElementById(str);
		},
		tween = document.getElementById('tween'),
		ie6 = poloAF.Util.getComputedStyle(tween, 'color') === 'red' ? true : false,
		doAlt = U.doAlternate(),
		fader = (function () {
			var base_el,
				fade_el,
				parent,
				domod = curry2(modulo)(3),
				j = 0,
				timer;

			function doFade(i) {
				fade_el.style.opacity = i / 100;
				return setTimeout(curryDefer(fader)(i), 9);
			}

			function exit() {
				window.clearTimeout(timer);
				exit.opacity = fade_el.style.opacity;
				fade_el.style.opacity = 100;
			}

			function enter() {
				doFade(exit.opacity);
			}
			if (!ie6) {
				ani(U);
				flower(U);
				U.removeNodeOnComplete(tween);
				base_el = poloAF.Util.getDomChild(poloAF.Util.getNodeByTag('img'))($('ani'));
				fade_el = base_el.cloneNode();
				parent = base_el.parentNode;
				parent.appendChild(fade_el);
				base_el.src = logo_paths[j];
				fade_el.onload = function () {
					this.style.opacity = 100;
					//isNaN : divide by zero
					j = isNaN(j) ? 0 : domod(j += 1);
					base_el.src = logo_paths[j];
				};
				U.addHandler('click', $('ani'), doAlt([exit, enter]));
				return function (i) {
					i -= 1;
					if (i >= 0) {
						timer = doFade(i);
					} else {
						fade_el.src = base_el.src;
						setTimeout(curryDefer(fader)(101), 3000);
					}
				};
			}
		}());
	setTimeout(curryDefer(fader)(101), 2222);
}(["images/articles/fullsize/poloafrica_flower_logo.jpg", "images/articles/fullsize/polo150yrs_squared_logo.jpg", "images/articles/fullsize/polo_armed_forces_logo.jpg"]));