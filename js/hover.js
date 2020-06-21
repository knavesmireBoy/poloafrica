/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global poloAF: false */
/*global setTimeout: false */
/*global _: false */
if (!window.poloAF) {
	window.poloAF = {};
}
(function () {
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
	var sfHover = function () {
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
		$ = function (str) {
			return document.getElementById(str);
		},
        utils = poloAF.Util,
		ptL = _.partial,
        anCr = utils.append(),
        anCrIn = utils.insert(),
        makeElement = utils.machElement,
        setAttrs = utils.setAttributes,        
        ani = (function(){
            var section = utils.getByTag('section', document),
                ancr = section[section.length-1],
                article = utils.getByTag('article', ancr)[0],
                ret = makeElement(ptL(setAttrs, {
				id: 'ani',
			}), anCrIn(article, ancr), always('aside'));
            ret.render();
        }()),
        flower = (function(){
            var ret = makeElement(ptL(setAttrs, {
				id: 'flower',
                src: '../images/resource/poloafrica_flower_logo.jpg',
                alt: ''
			}),
                        anCr(utils.$('ani')), always('img'));
            ret.render();
        }()),
        h2 = poloAF.Util.getByTag('h2', document)[0],
        doAlt = poloAF.Util.doAlternate(),
		fader = (function () {
            
              function exit(){
                window.clearTimeout(timer);
                exit.opacity = fade_el.style.opacity;
                fade_el.style.opacity = 100;
              }
            
            function enter(){
                doFade(exit.opacity);
              }
            
            function doFade(i){
                fade_el.style.opacity = i / 100;
                return setTimeout(curryDefer(fader)(i), 9)
            }
                        
            var base_el = poloAF.Util.getDomChild(poloAF.Util.getNodeByTag('img'))($('ani')),
                fade_el = base_el.cloneNode(),
                parent = base_el.parentNode,
                logo_paths = ["../images/resource/poloafrica_flower_logo.jpg", "../images/resource/polo150yrs_squared_logo.jpg", "../images/resource/polo_armed_forces_logo.jpg"],
                domod = curry2(modulo)(3),
                j = 0,
                timer;
              
            parent.appendChild(fade_el);
            base_el.src = logo_paths[j];
            fade_el.onload = function () {
                this.style.opacity = 100;
                j = isNaN(j) ? 0 : domod(j += 1);
                base_el.src = logo_paths[j];
            };
            poloAF.Util.addHandler('click', $('ani'), doAlt([exit, enter]));
            
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
    if (window.attachEvent) {
		window.attachEvent("onload", sfHover);
	}
}());