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

	function getUrlParameter(sParam) {
		var sPageURL = window.location.search.substring(1),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;
		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) {
				return typeof sParameterName[1] === 'undefined' ? true : decodeURIComponent(sParameterName[1]);
			}
		}
		return false;
	}

	function applyArg(f, arg) {
		//console.log(arguments)
		arg = arg && _.isArray(arg) ? arg : [arg];
		return f.apply(null, arg);
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
		doAni = _.compose(doMap([
			['id', 'ani']
		]), anCrIn(U.findByTag(0)('article', section), section)),
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
				timer = 1,
               // imac = "<a href='http://86.143.187.98/poloafrica/admin?logme=jeff.tracy@tbsrgo.com'>iMac.</a> ",
				urlParams = window.URLSearchParams ? new window.URLSearchParams(window.location.search) : {},
				intro = "We had been printing for <a href='https://rorypecktrust.org/'>The Rory Peck Trust</a> for a number of years when the late <a href='https://www.frontlineclub.com/in_memoriam_juliet_crawley_peck_1961_-_2007/' target='_blank'>Juliet Peck</a> introduced me to her friend Catherine Cairns who required a website but was short of the kind of funds then generally demanded for a bespoke website. As I had a much to learn regarding web “design” I agreed to work gratis in return for a print order. I designed a print brochure prior to producing my first website and handed it over for hosting in the summer of 2005. Third parties have occasionally updated it, albeit in the most rudimentary manner, directly editing the rather am-dram <a href='http://www.poloafrica.com' target='_blank'>html</a>. This version is a static site that utilises underscore.js, more than helpful in the pursuit of graceful degradation. <strong>UPDATE June 2026</strong>. 21 years after making its first appearance their website has finally been updated, yet by someone other. Until I get around to working on an exact replica the original can now only be found at the very useful <a href='https://web.archive.org/web/20260311044416/http://www.poloafrica.com/' target='_blank'>wayback machine.</a>",
				intro_php = "When lockdown hit, one project that appealed was deploying the MAMP stack to convert the static site into a roll-your-own CMS whilst cleaning up the html, upgrading the css, flirting with svg and diving into sass. More recently I have upgraded to php8, explored <abbr title=Object Relational Mapping'>ORM</abbr>, discovered nginx and learned a little <a href='https://www.docker.com'>Docker</a> and I have managed to get this <strong>development</strong> version on AWS before my free tier expired. The latest version can be made available to anyone who's interested, until it finds a new home. An <em>administrator</em> can edit content, à-la markdown, upload/edit images, manage user authorisation and a fair bit more. More than an interesting exercise for those with way too much time on their hands, but probably only instructive as a prelude to exploring the many CMS alternatives available.",
				intro_aws = "When lockdown hit, one project that appealed was deploying the MAMP stack to convert the static site into a bespoke CMS whilst cleaning up the html, upgrading the css, flirting with svg and diving into sass. More recently I have upgraded to php8, explored <abbr title=Object Relational Mapping'>ORM</abbr>, discovered nginx and learned a little <a href='https://www.docker.com'>Docker</a> and this <strong>development</strong> version is currently hosted on <a href='http://35.179.3.79/' target='_blank'>AWS</a>. An <em>administrator</em> can edit content, à-la markdown, upload/edit images, manage user authorisation and a fair bit more, and whilst for this roll your own project I've endeavoured to keep the use of tools and libraries to the bare minimum I may finally allow myself to explore a robust framework like Laravel and do myself a big favour and finally learn Wordpress.",
				intro_update = "";


				urlParams.has === urlParams.has || getUrlParameter;

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
			if (urlParams.has('cv')) {
				var href = ['href', '.'],
					xit = ['id', 'exit'],
					cross = ['txt', 'close'],
					head = U.findByTag(0)('header'),
					anc = U.getDomChild(U.getNodeByTag('a'))(head.firstChild);
				_.compose(
					twice(U.doMap)([
						['txt', intro_php]
					]), twice(applyArg)('p'), anCr, _.partial(U.climbDom, 1),
					twice(U.doMap)([
					['txt', intro]
				]), twice(applyArg)('p'), anCr, _.partial(U.climbDom, 1), twice(U.doMap)([href, xit, cross]), twice(applyArg)('a'), anCr, twice(U.doMap)([
					['id', 'intro']
				]), anCrIn(anc, head))('div');
			}
			if (!ie6) {
				doAni('aside');
				doFlower('img');
				U.removeNodeOnComplete(tween);
				base_el = poloAF.Util.getDomChild(poloAF.Util.getNodeByTag('img'))($('ani'));
				fade_el = base_el.cloneNode(false); //reqd arg in some browsers
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

