/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global poloAF: false */
/*global setTimeout: false */
/*global Modernizr: false */
/*global _: false */
if (!window.poloAF) {
	window.poloAF = {};
}
(function (logo_paths) {
	"use strict";

	function getNativeOpacity(bool) {
		return {
			getKey: function () {
				return bool ? 'filter' : Modernizr.prefixedCSS('opacity');
			},
			getValue: function (val) {
				return bool ? 'alpha(opacity=' + val + ')' : (val / 100).toString();
			}
		};
	}

	function doMethod(o, v, p) {
		return o[p] && o[p](v);
	}

	function lazyVal(v, o, p) {
		return doMethod(o, v, p);
	}

	function modulo(i, n) {
		return i % n;
	}
	var U = poloAF.Util,
		$ = function (str) {
			return document.getElementById(str);
		},
		twice = U.curryFactory(2),
        thricedefer = U.curryFactory(3, true),
		curryDefer = U.curryFactory(1, true),
		doMap = twice(U.doMap),
		anCr = U.append(),
		anCrIn = U.insert(),
		$$ = thricedefer(lazyVal)('getElementById')(document),
        doPause = _.partial(U.addClass, ['paused'], $$('ani')),
        doResume = _.partial(U.removeClass, ['paused'], $$('ani')),
        section = U.findByTag(2)('section'),
        doAni = _.compose(doMap([['id', 'ani']]), anCrIn(U.findByTag(0)('article', section), section)),
		tween = document.getElementById('tween'),
		ie6 = poloAF.Util.getComputedStyle(tween, 'color') === 'red' ? true : false,
		cssopacity = getNativeOpacity(!window.addEventListener),
		key = cssopacity.getKey(),
		doAlt = U.doAlternate(),
		doFlower = _.compose(doMap([
			['id', 'flower'],
			['src', logo_paths[0]],
			['alt', '']
		]), anCr($$('ani'))),
		fader = (function () {
			var base_el,
				fade_el,
				parent,
				domod = twice(modulo)(3),
				j = 0,
				timer = 1;

			function doFade(i) {
				fade_el.style[key] = cssopacity.getValue(i);
				return setTimeout(curryDefer(fader)(i), 9);
			}

			function exit() {
				window.clearTimeout(timer);
				timer = null;
				exit.opacity = fade_el.style[key];
				fade_el.style[key] = 100;
                doPause();
			}

			function enter() {
				timer = 1;
				doFade(exit.opacity);
                doResume();
			}
			if (!ie6) {
				doAni('aside');
				doFlower('img');
				U.removeNodeOnComplete(tween);
				base_el = poloAF.Util.getDomChild(poloAF.Util.getNodeByTag('img'))($('ani'));
				fade_el = base_el.cloneNode();
				parent = base_el.parentNode;
				parent.appendChild(fade_el);
				base_el.src = logo_paths[j];
				fade_el.onload = function () {
					this.style[key] = 100;
					//isNaN : divide by zero
					j = isNaN(j) ? 0 : domod(j += 1);
					base_el.src = logo_paths[j];
				};
				poloAF.Util.eventer('click', [], doAlt([exit, enter]), $('ani')).execute();
				return function (i) {
					i -= 1;
					if (timer) {
						if (i >= 0) {
							timer = doFade(i);
						} else {
							fade_el.src = base_el.src;
							setTimeout(curryDefer(fader)(101), 3000);
						}
					}
				};
			}
		}());
	setTimeout(curryDefer(fader)(101), 2222);
}(["images/articles/fullsize/poloafrica_flower_logo.jpg", "images/articles/fullsize/polo150yrs_squared_logo.jpg", "images/articles/fullsize/polo_armed_forces_logo.jpg"]));