/*jslint nomen: true */
/*global window: false */
/*global poloAF: false */
/*global document: false */
/*global Modernizr: false */
/*global _: false */
if (!window.poloAF) {
	window.poloAF = {};
}
poloAF.Util = (function() {
	"use strict";

	function spreadify(fn, fnThis) {
		/* accepts unlimited arguments */
		return function() {
			// Holds the processed arguments for use by `fn`
			var i,
				spreadArgs = [],
				length = arguments.length,
				currentArg;
			for (i = 0; i < length; i++) {
				currentArg = arguments[i];
				if (Array.isArray(currentArg)) {
					spreadArgs = spreadArgs.concat(currentArg);
				} else {
					spreadArgs.push(currentArg);
				}
			}
			fn.apply(fnThis || null, spreadArgs);
		};
	}
    
    function FauxPromise (args) {
		//must be an array of functions, AND the first gets run last
		this.cbs = _.compose.apply(null, args);
	}
	FauxPromise.prototype.then = function() {
		return this.cbs.apply(null, arguments);
	};

	function doOnce() {
		return function(i) {
			return function() {
				var res = i > 0;
				i -= 1;
				return res > 0;
			};
		};
	}

	function Message(k, v) {
		this.key = k;
		this.value = v;
	}
	Message.prototype.getKey = function() {
		return this.key;
	};
	Message.prototype.getValue = function() {
		return this.value;
	};

	function toCamelCase(variable) {
		return variable.replace(/-([a-z])/g, function(str, letter) {
			return letter.toUpperCase();
		});
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function fail(thing) {
		throw new Error(thing);
	}

	function noOp() {
		return function() {};
	}

	function sum(x, y) {
		return getResult(x) + getResult(y);
	}

	function subtract(a, b) {
		return b - a;
	}

	function divideBy(a, b) {
		return a / b;
	}

	function gtEq(x, y) {
		return getResult(x) >= getResult(y);
	}

	function lsEq(x, y) {
		return getResult(x) <= getResult(y);
	}

	function gtThan(x, y, flag) {
		if (flag) {
			return gtEq(x, y);
		}
		return getResult(x) > getResult(y);
	}

	function lsThan(x, y, flag) {
		if (flag) {
			return lsEq(x, y);
		}
		return getResult(x) < getResult(y);
	}

	function existy(x) {
		return x != null;
	}

	function cat() {
		var head = _.first(arguments);
		if (existy(head)) {
			return head.concat.apply(head, _.rest(arguments));
		} else {
			return [];
		}
	}

	function construct(head, tail) {
		return head && cat([head], _.toArray(tail));
	}

	function mapcat(fun, coll) {
		var res = _.map(coll, fun);
		return cat.apply(null, res);
	}

	function always(val) {
		return function() {
			return val;
		};
	}

	function regExp(str, flag) {
		return new RegExp(str, flag);
	}

	function nested(f1, f2, item) {
		return f2(f1(item));
	}

	function setter(o, k, v) {
		getResult(o)[k] = v;
	}

	function getter(o, k) {
		//console.log(arguments)
		return o && o[k];
	}

	function setret(o, k, v) {
		o[k] = v;
		return o;
	}

	function setAdapter(o, v, k) {
		//console.log(arguments)
		return setret(o, k, v);
	}

	function byIndex(i, arg) {
		return getResult(arg)[i];
	}

	function simpleInvoke(o, m, arg) {
		//console.log(arguments)
		return o[m](arg);
	}

	function doInvoke(o, m) {
		//console.log(_.rest(arguments, 2));
		return o[m].apply(o, _.rest(arguments, 2));
	}

	function mittleInvoke(m, arg, o) {
		o = o || document;
		return getResult(o)[m](arg);
	}

	function applyFunction(f, args) {
		return f.apply(null, args);
	}

	function thunk(f) {
		return f.apply(f, _.rest(arguments));
	}

	function prefix(p, str) {
		return str.charAt(0) === p ? str : p + str;
	}

	function doAlternate() {
		function alternate(i, n) {
			return function() {
				i = (i += 1) % n;
				return i;
			};
		}
		return function(actions) {
			var f = _.partial(thunk, alternate(0, 2));
			return function() {
				//return poloAF.Util.getBest(f, [_.partial(actions[0], arg), _.partial(actions[1], arg)])();
				return poloAF.Util.getBest(f, [_.partial.apply(null, construct(actions[0], arguments)), _.partial.apply(null, construct(actions[1], arguments))])();
			};
		};
	}

	function doNTimes() {
		function once(i) {
			return function() {
				return i-- > 0;
			};
		}
		return function(actions) {
			return spreadify(actions[0]);
		};
	}

	function cloneNode(node, bool) {
		//con(node, bool)
		var deep = existy(bool) ? bool : false;
		return node.cloneNode(deep);
	}

	function textNode(txt) {
		return document.createTextNode(txt);
	}

	function render(anc, refnode, el) {
		//console.log(arguments)
		return getResult(anc).insertBefore(getResult(el), getResult(refnode));
	}
	//get ye this. setAnchor effectively returns strategy(getNewElement in reality), which expects one argument
	//(string, element, null/undef) and returns new element, clone or fragment
	//getNewElement invokes render with the new element
	function setAnchor(anchor, refnode, strategy) {
		return _.compose(_.partial(render, anchor, refnode), strategy);
	}

	function getNextElement(node) {
		if (node && node.nodeType === 1) {
			return node;
		}
		if (node && node.nextSibling) {
			return getNextElement(node.nextSibling);
		}
		return null;
	}

	function getPreviousElement(node) {
		if (node && node.nodeType === 1) {
			return node;
		}
		if (node && node.previousSibling) {
			return getPreviousElement(node.previousSibling);
		}
		return null;
	}

	function getWhatElement(p) {
		return function getWhat(node) {
			if (node && node.nodeType === 1) {
				return node;
			}
			if (node && node[p]) {
				return getWhat(node[p]);
			}
			return null;
		};
	}

	function insertAfter(newElement, targetElement) {
		var parent = targetElement.parentNode;
		if (parent.lastChild === targetElement) {
			parent.appendChild(newElement);
		} else if (newElement) {
			parent.insertBefore(newElement, getNextElement(targetElement.nextSibling));
		}
	}

	function getTargetNode(node, reg, dir) {
		if (!node) {
			return null;
		}
		node = node.nodeType === 1 ? node : getNextElement(node);
		var res = node && node.nodeName.match(reg);
		if (!res) {
			node = node && getNextElement(node[dir]);
			return node && getTargetNode(node, reg, dir);
		}
		return node;
	}

	function drillDown(arr) {
		var a = arr && arr.slice && arr.slice();
		if (a && a.length > 0) {
			return function drill(o, i) {
				// console.log(arr, o)
				i = isNaN(i) ? 0 : i;
				var prop = a[i];
				if (prop && a[i += 1]) {
					return o && drill(o[prop], i);
				}
				return o && o[prop];
			};
		}
		return function(o) {
			return o;
		};
	}

	function validateRemove(node) {
		return node && node.parentNode;
	}

	function removeElement(node) {
		return node.parentNode.removeChild(node);
	}

	function getElementWidth(el) {
		return el.getBoundingClientRect().height || el.offsetWidth;
	}

	function getElementHeight(el) {
		return el.getBoundingClientRect().height || el.offsetHeight;
	}

	function baseNestedElements(ancor, outer, inner, hash) {
		var anCr = poloAF.Util.append();
		return _.compose(anCr(_.compose(anCr(ancor), utils.always(outer))))(inner);
	}

	function getPageOffset(bool) {
		var w = window,
			d = document.documentElement || document.body.parentNode || document.body,
			x = (w.pageXOffset !== undefined) ? w.pageXOffset : d.scrollLeft,
			y = (w.pageYOffset !== undefined) ? w.pageYOffset : d.scrollTop;
		return bool ? x : y;
	}

	function handleElement($el, cb) {
		if (!$el.getElement()) {
			$el.init();
		}
		if (getPageOffset() > cb($el.getElement())) {
			$el.render();
		} else {
			$el.unrender();
		}
	}

	function handleScroll($el, cb, klas) {
		if (!$el.getElementsByTagName) {
			if (poloAF.Intaface) {
				var inta = new poloAF.Intaface('Element', ['render', 'unrender', 'getElement']);
				poloAF.Intaface.ensures($el, inta);
			}
			handleElement($el, cb);
		} else { //default treatment
			//getPageOffset() > ($el.offsetTop - window.innerHeight)
			if (getPageOffset() > cb($el)) {
				poloAF.Util.addClass(klas, $el);
			} else {
				poloAF.Util.removeClass(klas, $el);
			}
		}
	}

	function getElementOffset(el) {
		//https://medium.com/snips-ai/make-your-next-microsite-beautifully-readable-with-this-simple-javascript-technique-ffa1a18d6de2
		var top = 0,
			left = 0;
		// grab the offset of the element relative to it's parent,
		// then repeat with the parent relative to it's parent,
		// ... until we reach an element without parents.
		do {
			top += el.offsetTop;
			left += el.offsetLeft;
			//https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
			el = el.offsetParent;
		} while (el);
		return {
			top: top,
			left: left
		};
	}

	function getScrollThreshold(el, percent) {
		/*park this
		var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
		var po = getPageOffset(),
		elementOffsetTop = utils.getElementOffset(el).top,
		elementHeight = utils.getElementHeight(el);
		depth = elementOffsetTop + elementHeight,
		scrolled = po + window.viewportSize.getHeight();
		(po+window.innerHeight) - (elementOffsetTop + elementHeight) ===  po-threshold;
		*/
		try {
			var elementOffsetTop = getElementOffset(el).top,
				elementHeight = el.offsetHeight || el.getBoundingClientRect().height,
				wh = window.innerHeight,
				extra = percent ? (elementHeight * percent) : 0;
			return (elementOffsetTop - wh) + extra;
		} catch (e) {
			return 0;
		}
	}

    function getClassList(el) {
        if(el){
        if(typeof el.classList === 'undefined'){
            return poloAF.ClassList(el);
        }
		return el.classList;
        }
        return '';
	}

	function curryFactory(i, defer) {
		function curry1(fun) {
			return function(firstArg) {
				return fun(firstArg);
			};
		}

		function curry11(fun) {
			return function(firstArg) {
				return function() {
					return fun(firstArg);
				};
			};
		}

		function curry2(fun) {
			return function(secondArg) {
				return function(firstArg) {
					return fun(firstArg, secondArg);
				};
			};
		}

		function curry22(fun) {
			return function(secondArg) {
				return function(firstArg) {
					return function() {
						return fun(firstArg, secondArg);
					};
				};
			};
		}

		function curry3(fun) {
			return function(last) {
				return function(middle) {
					return function(first) {
						return fun(first, middle, last);
					};
				};
			};
		}

		function curry33(fun) {
			return function(last) {
				return function(middle) {
					return function(first) {
						return function() {
							return fun(first, middle, last);
						};
					};
				};
			};
		}

		function curry4(fun) {
			return function(fourth) {
				return function(third) {
					return function(second) {
						return function(first) {
							return fun(first, second, third, fourth);
						};
					};
				};
			};
		}

		function curry44(fun) {
			return function(fourth) {
				return function(third) {
					return function(second) {
						return function(first) {
							return function() {
								return fun(first, second, third, fourth);
							};
						};
					};
				};
			};
		}
		var once = {
				imm: curry1,
				defer: curry11
			},
			twice = {
				imm: curry2,
				defer: curry22
			},
			thrice = {
				imm: curry3,
				defer: curry33
			},
			quart = {
				imm: curry4,
				defer: curry44
			},
			coll = [null, once, twice, thrice, quart],
			ret = coll[i];
		return ret && defer ? ret.defer : ret ? ret.imm : function() {};
	} //factory
	/*  imm: (f) => (arg) => f(arg),
	    defer: (f) => (arg) => () => f(arg)
	  },*/
	function curry2(fun) {
		return function(secondArg) {
			return function(firstArg) {
				return fun(firstArg, secondArg);
			};
		};
	}

	function curry22(fun) {
		return function(secondArg) {
			return function(firstArg) {
				return function() {
					return fun(firstArg, secondArg);
				};
			};
		};
	}

	function curry3(fun) {
		return function(last) {
			return function(middle) {
				return function(first) {
					return fun(first, middle, last);
				};
			};
		};
	}

	function curry33(fun) {
		return function(last) {
			return function(middle) {
				return function(first) {
					return function() {
						return fun(first, middle, last);
					};
				};
			};
		};
	}

	function curry4(fun) {
		return function(fourth) {
			return function(third) {
				return function(second) {
					return function(first) {
						return fun(first, second, third, fourth);
					};
				};
			};
		};
	}

	function curry44(fun) {
		return function(fourth) {
			return function(third) {
				return function(second) {
					return function(first) {
						return function() {
							return fun(first, second, third, fourth);
						};
					};
				};
			};
		};
	}

	function invokeWhen(validate, action) {
		var args = _.rest(arguments, 2),
			res = validate.apply(null, args);
		return res && action.apply(null, args);
	}
    
    function invokeThen(validate, action) {
		var args = _.rest(arguments, 2),
			res = validate.apply(null, args);
		return res && action(res);
	}

	function doWhen(cond, action) {
		if (getResult(cond)) {
			return action();
		} else {
			return undefined;
		}
	}
    
    function invoker(NAME, METHOD) {
		return function(target) {
			if (!existy(target)) {
				fail("Must provide a target");
			}
			var targetMethod = target[NAME],
				args = _.rest(arguments);
			return doWhen((existy(targetMethod) && METHOD === targetMethod), function() {
				return targetMethod.apply(target, args);
			});
		};
	}

	function dispatch() {
		var funs = _.toArray(arguments),
			size = funs.length;
		return function(target) {
			var ret,
				args = _.rest(arguments),
				fun,
				i;
			for (i = 0; i < size; i += 1) {
				fun = funs[i];
				try {
					ret = fun.apply(null, construct(target, args));
					if (existy(ret)) {
						return ret;
					}
				} catch (e) {
					noOp();
				}
			}
			return ret;
		};
	}

	function setFromFactory(bool) {
		function doEachFactory(config, bound, target, bool) {
			//ie 6 & 7 have issues with setAttribute, set props instead
			if (bool) {
				return _.partial(_.extendOwn, target, config);
			}
			return function() {
				_.forEach(_.invert(config), bound);
			};
		}
		return function(validate, method, config, target) {
			var unbound = function() {
					//console.log(validate, method, config, target)
					target[method].apply(target, arguments);
				},
				bound;
			try {
				bound = _.bind(target[method], target);
			} catch (e) {
				bound = unbound;
				//$('report').innerHTML = '!'+e.message;
			}
			bound = unbound;
			bound = _.partial(poloAF.Util.invokeWhen, validate, bound);
			doEachFactory(config, bound, target, bool)();
			return target;
		};
	}

	function setFromArray1(validate, method, classArray, target) {
		//target may be a function returning a target element
		if (!target) {
			return null;
		}
		var fn,
			tgt = getClassList(getResult(target)),
			args = _.rest(arguments, 3);
		validate = _.partial(applyFunction, validate, args);
		if (!tgt) {
			return target;
		}
		fn = tgt && _.partial(simpleInvoke, tgt, method);
		if (validate) {
			fn = _.partial(invokeWhen, validate, fn);
		}
		_.each(_.flatten([classArray]), fn);
		return target;
	}
	//ALLOW toggleClass to have boolean argument del = _.partial(utils.toggleClass, 'del'),
	function setFromArray(validate, method, classArray, target) {
        //poloAF.Util.report(target.classList);
		//target may be a function returning a target element
		var fn,
			tgt,
			args,
			bool = false,
			rest = 3;
		if (_.isBoolean(target)) {
			rest = 4;
			bool = target;
			target = _.rest(arguments, rest)[0];
		} else if (!target) {
			return null;
		}
		tgt = getClassList(getResult(target));
		args = _.rest(arguments, rest);
		validate = _.partial(applyFunction, validate, args);
		if (!tgt) {
			return target;
		}
		fn = tgt && _.partial(simpleInvoke, tgt, method);
		if (rest === 4) {
			fn = tgt && _.partial(doInvoke, tgt, method, classArray, bool);
		}
		if (validate) {
			fn = _.partial(invokeWhen, validate, fn);
		}
		_.each(_.flatten([classArray]), fn);
		return target;
	}

	function filterTagsByClass(el, tag, cb) {
		var tags = _.toArray(el.getElementsByTagName(tag));
		return _.filter(tags, cb);
	}

	function getPolyClass(proto, klas, el, tag) {
		var classInvokers = [invoker('querySelectorAll', document.querySelectorAll), invoker('getElementsByClassName', document.getElementsByClassName)],
			mefilter = function(elem) {
				klas = klas.match(/^\./) ? klas.substring(1) : klas;
				return poloAF.Util.getClassList(elem).contains(klas);
			},
			ran = false,
			pre = _.partial(prefix, '.'),
			byTag = _.partial(filterTagsByClass, getResult(el) || document, tag || '*', mefilter),
			dispatcher = dispatch.apply(null, classInvokers.concat(byTag)),
			nested = function(klass) {
				var res = dispatcher(proto, klass);
				if ((!res || !res[0]) && klass && !ran) {
					ran = true;
					res = nested(klass.substring(1));
				}
				return res;
			};
		return nested(pre(klas));
	}
    
    function toObject(arr) {
		return _.object([
			[arr[0], arr[1]]
		]);
	}


	function attrMap(el, map, style) {
		var k,
			o;
		for (k in map) {
			if (map.hasOwnProperty(k)) {
                
				if (k.match(/^te?xt$/)) {
					el.innerHTML = map[k];
					continue;
				}
				if (style) {
                    if (poloAF.slice_shim) {
						el.style[toCamelCase(k)] = map[k];
					} else {
						el.style.setProperty(k, map[k]);
					}
				} else {
					o = {};
					o[k] = map[k]; //to support ie 6,7
                    poloAF.Util.setAttributes(o, el);
				}
			}
		}
		return el;
	}

	function doMapRecur(el, v) {
		/*second argument (v) should be an array of arrays [[p,v], [p,v], [[p,v]]]
		    with style properties wrapped in an extra array and sent last
		    eg [id, 'fred'], [title, 'our fred'], [txt, 'freddie'], [[opacity: '0.5'], [background-color: 'blue']]*/
		var tgt = v.length && v.splice(0, 1)[0],
			pass;
		if (!tgt) {
			return el;
		}
		pass = _.isArray(tgt[0]);
		tgt = pass ? tgt[0] : tgt;
		el = attrMap(getResult(el), toObject(tgt), pass);
		return doMapRecur(el, v);
	}

	function reverseArray(array) {
		var i,
			L = array.length,
			old;
		//FRWL, YOLT, OHMSS, LALD
		array = _.toArray(array);
		for (i = 0; i < Math.floor(L / 2); i += 1) {
			old = array[i];
			//1:FRWL / LALD
			//2: YOLT / OHMSS
			array[i] = array[L - 1 - i];
			array[L - 1 - i] = old;
		}
		return array;
	}

	function composer() {
		var args = _.toArray(arguments),
			//may just be creating/selecting an unadorned element
			/* if more than one argument get the last argument, otherwise get the only argument*/
			select = args[1] ? args.splice(-1, 1)[0] : args[0];
		return _.compose.apply(null, args)(select());
	}

	function prepareListener(extent) {
		return function(handler, fn, el) {
			var listener,
				wrapper = function(func) {
					var args = _.rest(arguments),
						e = _.last(arguments);
					extent = extent || 'prevent';
					listener[extent](e);
					// el = el ? getResult(el) : null;
					//avoid sending Event object as it may wind up as the useCapture argument in the listener
					func.apply(el || null, args.splice(-1, 1));
				},
				wrapped = _.wrap(fn, wrapper);
			//calls addHandler which calls addListener which invokes the addEventListener/attachEvent method
			listener = handler(wrapped);
			return listener;
		};
	}

	function addHandler(type, func, el) {
		//console.log(arguments);
		return poloAF.Eventing.init.call(poloAF.Eventing, type, func, el).addListener();
	}

	function validator(message, fun) {
		var f = function() {
			//console.log(arguments)
			return fun.apply(fun, arguments);
		};
		f.message = message;
		return f;
	}
	//note a function that ignores any state of champ or contender will return the first element if true and last if false
	function best(fun, coll, arg) {
        fun = arg ? _.partial(fun, arg) : fun;
		return _.reduce(_.toArray(coll), function(champ, contender) {
			return fun(champ, contender) ? champ : contender;
		});
	}

	function simpleAdapter(allpairs, adapter, subject) {
		/*expects eg: [['shout', 'cry'],['bark', 'whine']]
		NOT [['shout', 'bark'],['cry', 'whine']]
		ALSO no arguments are assumed. It is simple*/
		var ptl,
			prepPairs = function(allpairs) {
				return _.zip(allpairs[0], allpairs[1]);
			},
			performer = function(that, subject, method) {
				subject[method]();
				return that;
			};
		_.each(prepPairs(allpairs), function(pairs) {
			_.each(pairs, function(method, i) {
				if (!i) {
					ptl = method;
				} else {
					adapter[ptl] = _.partial(performer, adapter, subject, method);
				}
			});
		});
		adapter.getSubject = function() {
			return subject;
		};
		return adapter;
	}

	function getEventObject(e) {
		return e || window.event;
	}
    
    function fillArray(value, len) {
		var arr = [],
			i;
		for (i = 0; i < len; i += 1) {
			arr.push(value);
		}
		return arr;
	}
    
	var getNewElement = dispatch(curry2(cloneNode)(true), _.bind(document.createElement, document), _.bind(document.createDocumentFragment, document)),
		removeNodeOnComplete = _.wrap(removeElement, function(f, node) {
			if (validateRemove(node)) {
				return f(node);
			}
		}),
		slice = Array.prototype.slice,
		makeElement = function() {
			var el,
				args = slice.call(arguments);
			return {
				init: function() {},
				add: function() {
					el = composer.apply(null, args);
					return this;
				},
				add2: function(e) {
					el = composer.apply(null, args.concat(always(e)));
					return this;
				},
				remove: function() {
					var removed = removeNodeOnComplete(el);
					el = null;
					return removed;
				},
				get: function() {
					return el;
				}
			};
		},
		machElement = function() {
			var el,
				args = slice.call(arguments),
				//slice because we want a copy
				select = args[1] ? args.slice(0).splice(-1, 1)[0] : args[0];
			return {
				render: function(e) {
					//console.log(e && e.target && e.target.src)
					/*don't do this: args = args.concat(always(e))
					add 'select' argument on-the-fly (see composer)
					fresh argument to the persisted Element object */
					//console.log(args);
					el = composer.apply(null, e ? args.concat(always(e)) : args);
					return this;
				},
				init: function() {
					/*may sometimes just want to get a reference to an (existing) element without adding class, attrs, eventHandlers*/
					el = select();
				},
				unrender: function() {
					var removed = removeNodeOnComplete(getResult(el));
					el = null;
					return removed;
				},
				getElement: function() {
					return el;
				}
			};
		},
		myEventListener = (function(flag) {
			if (flag) {
				return {
					add: function(el, type, fn) {
						el.addEventListener(type, fn, false);
					},
					remove: function(el, type, fn) {
						el.removeEventListener(type, fn, false);
					},
					preventers: {
						preventDefault: function(e) {
							e.preventDefault();
						},
						stopPropagation: function(e) {
							e.stopPropagation();
						},
						stopImmediatePropagation: function(e) {
							e.stopImmediatePropagation();
						}
					}
				};
			}
			return {
				add: function(el, type, fn) {
					el.attachEvent('on' + type, fn);
				},
				remove: function(el, type, fn) {
					el.detachEvent('on' + type, fn);
				},
				preventers: {
					preventDefault: function(e) {
						e = getEventObject(e);
						e.returnValue = false;
					},
					stopPropagation: function(e) {
						e = getEventObject(e);
						e.cancelBubble = true;
					},
					stopImmediatePropagation: function() {}
				}
			};
		}(window.addEventListener)),
		SimpleXhrFactory = (function() {
			// The three branches.
			var standard = {
					createXhrObject: function() {
						return new window.XMLHttpRequest();
					}
				},
				activeXNew = {
					createXhrObject: function() {
						return new window.ActiveXObject('Msxml2.XMLHTTP');
					}
				},
				activeXOld = {
					createXhrObject: function() {
						return new window.ActiveXObject('Microsoft.XMLHTTP');
					}
				},
				// To assign the branch, try each method; return whatever doesn't fail.
				testObject;
			try {
				testObject = standard.createXhrObject();
				return standard; // Return this if no error was thrown.
			} catch (e) {
				try {
					testObject = activeXNew.createXhrObject();
					return activeXNew; // Return this if no error was thrown.
				} catch (er) {
					try {
						testObject = activeXOld.createXhrObject();
						return activeXOld; // Return this if no error was thrown.
					} catch (error) {
						throw new Error('No XHR object found in this environment.');
					}
				}
			}
		}());
	return {
        $: function(str) {
			return document.getElementById(str);
		},
		addClass: _.partial(setFromArray, always(true), 'add'),
		/*handlers MAY need wrapping in a function that calls prevent default, stop propagation etc..
		which needs to be cross browser see EventCache.prevent */
		addEvent: function(handler, func, extent) {
			return function(el) {
				//console.log(el);
				el = getResult(el);
				var partial = el && _.isElement(el) ? _.partial(handler, el) : _.partial(handler);
				return prepareListener(extent)(partial, func, el);
			};
		},
		addHandler: addHandler,
		always: always,
		append: function(flag) {
			if (flag) {
				return curry33(setAnchor)(getNewElement)(null);
			}
			return curry3(setAnchor)(getNewElement)(null);
		},
		byIndex: byIndex,
        climbDom: function (n, el) {
			n = n || 1;
			return drillDown(fillArray('parentNode', n))(el);
		},
		conditional: function() {
			var validators = _.toArray(arguments);
			return function(fun, arg) {
				var errors = mapcat(function(isValid) {
					return isValid(arg) ? [] : [isValid.message];
				}, validators);
				if (!_.isEmpty(errors)) {
					throw new Error(errors.join(", "));
				}
				return fun(arg);
			};
		},
		construct: construct,
		createTextNode: function(text, ancor) {
			getResult(ancor).appendChild(document.createTextNode(text));
			return ancor;
		},
		curry4: curry4,
		curryTwice: function(flag) {
			return flag ? curry22 : curry2;
		},
		curryThrice: function(flag) {
			return flag ? curry33 : curry3;
		},
		curryFourFold: function(flag) {
			return flag ? curry44 : curry4;
		},
		curryFactory: curryFactory,
		doAlternate: doAlternate,
		doMap: doMapRecur,
		/*USAGE:
        var once = doOnce(),
        actions = [func1, func2, ...];
        function (flag) {
        var f = ptL(thunk, once(1));
        return best(f, actions)();
				}; */
		doOnce: doOnce,
		doWhen: doWhen,
		drillDown: drillDown,
		//https://medium.com/@dtipson/creating-an-es6ish-compose-in-javascript-ac580b95104a
		eventer1: function(type, actions, fn, el) {
			function preventer(wrapped, e) {
				_.each(actions, function(a) {
					myEventListener.preventers[a](e);
				});
				return wrapped(e);
			}
			fn = _.wrap(fn, preventer);
			el = getResult(el);
			return {
				render: function() {
					myEventListener.add(el, type, fn);
					return this;
				},
				unrender: function() {
					myEventListener.remove(el, type, fn);
					return this;
				},
				getEl: function() {
					return el;
				}
			};
		},
        
        //https://medium.com/@dtipson/creating-an-es6ish-compose-in-javascript-ac580b95104a
		eventer: function (type, actions, fn, el) {
			function preventer(wrapped, e) {
				//invoke method allows a function to be invoked directly NOT as an event listener
				if (e) {
					_.each(actions, function (a) {
						if (myEventListener.preventers[a]) {
							myEventListener.preventers[a](e);
						}
					});
				}
				return wrapped(e);
			}
			fn = _.wrap(fn, preventer);
			el = getResult(el);
			return {
				execute: function (flag) {
					myEventListener.add(el, type, fn);
					poloAF.Util.eventCache.add(this, flag);
					return this;
				},
				undo: function (flag) {
					myEventListener.remove(el, type, fn);
					if (flag && _.isBoolean(flag)) {
						el = removeNodeOnComplete(el);
					}
					poloAF.Util.eventCache.remove(this);
					return el;
				},
				getEl: function () {
					return el;
				},
				invoke: function () {
					fn.apply(null, arguments);
				},
				restore: function (i) {
					var $e = poloAF.Util.eventCache(i);
					if ($e) {
						$e.execute();
					}
				}
			};
		},
		fadeUp: function(element, red, green, blue) {
			var fromFull = curry2(subtract)(255),
				byTen = curry2(divideBy)(10),
				mysums = _.map([red, green, blue], curry2(sum)),
				ceil = _.compose(Math.ceil, byTen, fromFull),
				terminate = curry2(poloAF.Util.isEqual)(255),
				repeat;
			if (element.fade) {
				window.clearTimeout(element.fade);
			}
			element.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
			if (_.every([red, green, blue], terminate)) {
				return;
			}
			mysums = [red, green, blue].map(ceil).map(function(n, i) {
				return mysums[i](n);
			});
			repeat = function() {
				poloAF.Util.fadeUp.apply(null, [element].concat(mysums));
			};
			element.fade = window.setTimeout(repeat, 100);
		},
        FauxPromise: FauxPromise,
		findByClass: _.compose(curry2(getter)(0), _.partial(getPolyClass, document)),
        findByTag: function (i) {
			return _.compose(curry2(getter)(i || 0), _.partial(mittleInvoke, 'getElementsByTagName'));
		},
		findIndex: function(collection, predicate) {
			return _.findIndex(collection, predicate || always(true));
		},
		getBest: best,
		getBody: function(flag) {
			var body = document.body || document.getElementsByTagName('body')[0];
			if (flag) {
				body.className = '';
			}
			return body;
		},
		getByClass: _.partial(getPolyClass, document),
		getByTag: _.partial(mittleInvoke, 'getElementsByTagName'),
		getClassList: getClassList,
		getChild: _.compose(getNextElement, drillDown(['firstChild'])),
		getComputedStyle: function(element, styleProperty) {
			if (!element || !styleProperty) {
				return null;
			}
			var computedStyle = null,
				def = document.defaultView || window;
			if (typeof element.currentStyle !== 'undefined') {
				computedStyle = element.currentStyle;
			} else if (def && def.getComputedStyle && _.isFunction(def.getComputedStyle)) {
				computedStyle = def.getComputedStyle(element, null);
			}
			if (computedStyle) {
				try {
					return computedStyle[styleProperty] || computedStyle[toCamelCase(styleProperty)];
				} catch (e) {
					return computedStyle[styleProperty];
				}
			}
		},
		getDefaultAction: _.partial(best, noOp()),
		getDomChild: curry3(getTargetNode)('firstChild'),
		getDomChildDefer: curry33(getTargetNode)('firstChild'),
		getDomParent: curry3(getTargetNode)('parentNode'),
		getElementWidth: getElementWidth,
		getElementHeight: getElementHeight,
		getElementOffset: getElementOffset,
		getFirstChild: getWhatElement('firstChild'),
		getSibling: curry3(getTargetNode)('nextSibling'),
		getNewElement: getNewElement,
		getNext: _.partial(nested, curry2(getter)('nextSibling'), getNextElement), // expects node //?//
		getNextElement: getNextElement, //expects node.nextSibling
		getNodeByTag: curry2(regExp)('i'),
		getParent: drillDown(['parentNode']),
		getPredicate: function(cond, predicate) {
			return predicate(getResult(cond)) ? predicate : _.negate(predicate);
		},
		getPreviousElement: getPreviousElement, //?//
		getPrevious: _.partial(nested, curry2(getter)('previousSibling'), getPreviousElement),
		getScrollThreshold: getScrollThreshold,
		getSubArray: function(coll, tgt) {
			function reducer(acc, cur) {
				return _.contains(cur, tgt) ? cur : acc;
			}
			return _.reduce(coll, reducer);
		},
		getZero: _.partial(byIndex, 0),
		getter: getter,
		gtThan: gtThan,
		hasClass: (function() {
			var html = document.documentElement || document.getElementsByTagName('html')[0];
			return function(str, el) {
				el = el || html;
				return poloAF.Util.getClassList(el).contains(str);
			};
		}()),
		hasFeature: (function() {
			var html = document.documentElement || document.getElementsByTagName('html')[0];
			return function(str) {
				return poloAF.Util.getClassList(html).contains(str);
			};
		}()),
		hide: _.partial(setFromArray, always(true), 'remove', ['show']),
		highLighter: {
			perform: function() {
				if (!Modernizr.nthchild) {
					this.perform = function() {
						var ptL = _.partial,
							getBody = curry3(simpleInvoke)('body')('getElementsByTagName'),
							getLinks = curry3(simpleInvoke)('a')('getElementsByTagName'),
							getTerm = _.compose(curry2(getter)('id'), ptL(byIndex, 0), getBody),
							links = _.compose(getLinks, poloAF.Util.getZero, curry3(simpleInvoke)('nav')('getElementsByTagName'))(document),
							found = ptL(_.filter, _.toArray(links), function(link) {
								return new RegExp(link.innerHTML.replace(/ /gi, '_'), 'i').test(getTerm(document));
							});
						_.compose(ptL(poloAF.Util.addClass, 'current'), ptL(byIndex, 0), found)();
					};
				} else {
					this.perform = function() {};
				}
				this.perform();
			}
		},
		insert: function(flag) {
			if (flag) {
				return function(ref, anc) {
					return curry33(setAnchor)(getNewElement)(ref)(anc);
				};
			}
			return function(ref, anc) {
				return curry3(setAnchor)(getNewElement)(ref)(anc);
			};
		},
		insertAfter: insertAfter,
		insertBefore: function(refnode, tgt) {
			refnode.parentNode.insertBefore(tgt, refnode);
		},
		invokeOnFirst: _.partial(invokeWhen, _.compose(_.negate, always)),
		invokeRest: function(m, o) {
			return o[m].apply(o, _.rest(arguments, 2));
		},
		invokeThen: invokeThen,
		invokeWhen: invokeWhen,
		invoker: invoker,
		isDesktop: _.partial(gtThan, window.viewportSize.getWidth),
		isEqual: function(x, y) {
			return getResult(x) === getResult(y);
		},
		lsThan: lsThan,
        makeContext: function () {
			var iCommand = poloAF.Intaface('Command', ['execute', 'undo']);
			return {
				init: function ($command) {
					if ($command) {
						poloAF.Intaface.ensures($command, iCommand);
						this.$command = $command;
					}
					return this;
				},
				execute: function () {
					if (this.$command) {
						return this.$command.execute.apply(this.$command, arguments);
					}
				},
				undo: function () {
					if (this.$command) {
						return this.$command.undo.apply(this.$command, arguments);
					}
				},
				set: function ($command) {
					return this.init($command);
				}
			};
		},
		machElement: machElement,
		makeElement: makeElement,
		map: function(coll, mapper) {
			return _.map(coll, mapper);
		},
		mapcat: mapcat,
		move: function(flag) {
			if (flag) {
				return curry33(setAnchor)(_.identity)(null);
			}
			return curry3(setAnchor)(_.identity)(null);
		},
		each: function(o, m, coll) {
			o[m] = function() {
				var args = arguments;
				_.each(coll, function(member) {
					return member[m].apply(member, args);
				});
			};
		},
		removeClass: _.partial(setFromArray, always(true), 'remove'),
		removeNodeOnComplete: removeNodeOnComplete,
		render: render,
		reverse: reverseArray,
		//https://gomakethings.com/how-to-serialize-form-data-into-an-object-with-vanilla-js
		serializeObject: function(form) {
			var obj = {},
				options = [];
			// Loop through each field in the form
			Array.prototype.slice.call(form.elements).forEach(function(field) {
				// Skip some fields we don't need
				if (!field.name || field.disabled || ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1) {
					return;
				}
				// Handle multi-select fields
				if (field.type === 'select-multiple') {
					// Create an array of selected values
					// Loop through the options and add selected ones
					Array.prototype.slice.call(field.options).forEach(function(option) {
						if (!option.selected) {
							return;
						}
						options.push(option.value);
					});
				}
				// If there are any selection options, add them to the object
				if (options.length) {
					obj[field.name] = options;
				}
				// If it's a checkbox or radio button and it's not checked, skip it
				if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) {
					return;
				}
				obj[field.name] = field.value;
			});
			// Do stuff with the field...
			// Return the object
			return obj;
		},
		setAnchor: setAnchor,
		setAttributes: _.partial(setFromFactory(!window.addEventListener), always(true), 'setAttribute'),
		//setAttrsValidate: _.partial(setFromFactory(!window.addEventListener)),
		setFromArray: setFromArray,
		setScrollHandlers: function(collection, getThreshold, klas) {
			// ensure we don't fire this handler too often
			// for a good intro into throttling and debouncing, see:
			// https://css-tricks.com/debouncing-throttling-explained-examples/
			klas = klas || 'show';
			var deferHandle = curry33(handleScroll)(klas)(getThreshold || poloAF.Util.getScrollThreshold),
				funcs = _.map(collection, deferHandle);
			return _.map(_.map(funcs, curry2(_.throttle)(100)), _.partial(addHandler, 'scroll', window));
		},
		setText: curry3(setAdapter)('innerHTML'),
		setter: setter,
		show: _.partial(setFromArray, always(true), 'add', ['show']),
		shuffleArray: function shuffle(coll) {
			return function(start, deleteCount) {
				if (start === -1) {
					return coll;
				}
				deleteCount = isNaN(deleteCount) ? coll.length - 1 : deleteCount;
				start = isNaN(start) ? 0 : start;
				return coll.splice(start, deleteCount).concat(coll);
			};
		},
		silent_conditional: function() {
			var validators = _.toArray(arguments);
			return function(fun, arg) {
				var errors = mapcat(function(isValid) {
					return isValid(arg) ? [] : [isValid.message];
				}, validators);
				if (!_.isEmpty(errors)) {
					return errors;
					//throw new Error(errors.join(", "));
				}
				return fun(arg);
			};
		},
		simple_conditional: function() {
			var validators = _.toArray(arguments);
			return function(v, k) {
				var errors = mapcat(function(isValid) {
					return isValid(k, v) ? [] : [k, isValid.message];
					//return isValid(k, v) ? [] : [new Message(k, v)];
				}, validators);
				return errors;
			};
		},
		simpleAdapter: simpleAdapter,
		SimpleXhrFactory: SimpleXhrFactory,
		shout: function(m) {
			var applier = function(f, args) {
				return function() {
					f.apply(null, args);
				};
			};
			return applier(_.bind(window[m], window), _.rest(arguments));
		},
		supportTest: function(el, prop, reg) {
			var getBg = curry3(simpleInvoke)(reg)('match');
			return getBg(poloAF.Util.getComputedStyle(el, prop));
		},
		toggleClass: _.partial(setFromArray, always(true), 'toggle'),
		toggle: _.partial(setFromArray, always(true), 'toggle', ['show']),
		validator: validator,
		getDummyTarget: function(k, v) {
			var tgt = {};
			tgt[k] = v;
			return {
				target: tgt
			};
		},
		report: function(arg) {
            document.getElementsByTagName('h2')[0].innerHTML = arg ? arg : document.documentElement.className;
		},
		dog: 'spadger'
	}; //end
}());

poloAF.Util.eventCache = (function (list) {
	"use strict";

	function splice(i, l) {
		list.splice(i, l || 1);
	}

	function isNoNum(arg) {
		return _.isBoolean(arg) && isNaN(parseFloat(arg));
	}

	function find(arg, m) {
		//assume arg is listener object  
		var i = _[m](list, function ($cur) {
			return $cur === arg;
		});
		if (i === -1 || typeof i === 'undefined') {
			i = isNoNum(arg) ? i = list.length - 1 : arg;
		}
		return i;
	}
	return {
		add: function ($tgt, flag) {
			var m = flag ? 'unshift' : 'push';
			list = _.filter(list, function ($item) {
				return $item !== $tgt;
			});
			list[m]($tgt);
			return this;
		},
		remove: function ($tgt) {
			var i = find.call(this, $tgt, 'findIndex');
			splice(i);
			return this.get(i);
		},
		erase: function ($tgt) {
			var i = find.call(this, $tgt, 'findIndex');
			$tgt = this.get(i);
			if ($tgt) {
				return $tgt.undo(true);
			}
		},
		get: function ($tgt) {
			if (!isNoNum($tgt)) {
				return list[$tgt];
			}
			return find.call(this, $tgt, 'find');
		},
		flush: function () {
			list = [];
			return this;
		},
		getList: function (flag) {
			return flag ? list.length : list;
		},
		////$element.triggerEvent($element.getElement(), 'scroll');
		triggerEvent: function (el, type) {
			var e;
			//if ('createEvent' in document) {
            if (document.hasOwnProperty('createEvent')) {
				// modern browsers, IE9+
				e = document.createEvent('HTMLEvents');
				e.initEvent(type, false, true);
				el.dispatchEvent(e);
			} else {
				// IE 8
				e = document.createEventObject();
				e.eventType = type;
				el.fireEvent('on' + e.eventType, e);
			}
		}
	};
}([]));