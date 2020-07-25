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
	var  U = poloAF.Util,
        ptL = _.partial,
        /*
        sfHover = function () {
			var sfEls = document.getElementsByTagName("nav")[0].getElementsByTagName("LI"),
				i;
			for (i = 0; i < sfEls.length; i += 1) {
				sfEls[i].onmouseover = function () {
					this.className += " sfhover";
				};
				sfEls[i].onmouseout = function () {
					this.className = this.className.replace(new RegExp(" sfhover\\b"), "");
				};
			}
		},
        mytarget = !window.addEventListener ? 'srcElement' : 'target',
        getTarget = U.drillDown([mytarget]),
        klasAdd = ptL(U.addClass, 'sfhover'),
        klasRem = ptL(U.removeClass, 'sfhover'),
        mouseover = ptL(U.addHandler, 'mouseover'),
        mouseout = ptL(U.addHandler, 'mouseout'),
        show = _.compose(klasAdd, U.getDomParent(U.getNodeByTag('li')), getTarget), 
        hide = _.compose(klasRem, U.getDomParent(U.getNodeByTag('li')), getTarget), 
        doOver = U.addEvent(mouseover, show)(document.getElementsByTagName("nav")[0]),
        doOut = U.addEvent(mouseout, hide)(document.getElementsByTagName("nav")[0]),
        */
		$ = function (str) {
			return document.getElementById(str);
		},
		ani = (function (o) {
			var anCrIn = o.insert(),
                section = o.getByTag('section', document),
				ancr = section[section.length - 1],
				article = o.getByTag('article', ancr)[0],
				ret = o.machElement(ptL(o.setAttributes, {
					id: 'ani'
				}), anCrIn(article, ancr), always('aside'));
			ret.render();
		}(U)),
		flower = (function (o) {
            var anCr = o.append(),
                ret = o.machElement(ptL(o.setAttributes, {
                    id: 'flower',
                    src: logo_paths[0],
                    alt: ''
                }), anCr(o.$('ani')), always('img'));
			ret.render();
		}(U)),
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
		}());
	setTimeout(curryDefer(fader)(101), 2222);
    /*
	if (window.attachEvent) {
		window.attachEvent("onload", sfHover);
	}
    */
}(["images/poloafrica_flower_logo.jpg", "images/polo150yrs_squared_logo.jpg", "images/polo_armed_forces_logo.jpg"]));