/*jslint nomen: true */
/*global window: false */
/*global poloAF: false */
/*global document: false */
/*global _: false */
if (!window.poloAF) {
	window.poloAF = {};
}
poloAF.Util = (function () {
	"use strict";

	function toCamelCase(variable) {
		return variable.replace(/-([a-z])/g, function (str, letter) {
			return letter.toUpperCase();
		});
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function existy(x) {
		return x != null;
	}

	function fail(thing) {
		throw new Error(thing);
	}

	function noOp() {
		return function () {};
	}
    
    function sum(x,y){
    return getResult(x) + getResult(y);
}

function subtract(a, b){
    return b - a;
}

function divideBy(a, b){
    return a/b;
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

	function cat() {
		var head = _.first(arguments);
		if (existy(head)) {
			return head.concat.apply(head, _.rest(arguments));
		} else {
			return [];
		}
	}

	function mapcat(fun, coll) {
		var res = _.map(coll, fun);
		return cat.apply(null, res);
	}

	function construct(head, tail) {
		return head && cat([head], _.toArray(tail));
	}

	function always(val) {
		return function () {
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

	function mittleInvoke(m, arg, o) {
        //console.log(arguments);
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
			return function () {
				i = (i += 1) % n;
				return i;
			};
		}
		return function (actions) {
			var f = _.partial(thunk, alternate(0, 2));
			return function (arg) {
				return poloAF.Util.getBest(f, [_.partial(actions[0], arg), _.partial(actions[1], arg)])();
			};
		};
	}

	function cloneNode(node, bool) {
		//con(node, bool)
		var deep = existy(bool) ? bool : false;
		return node.cloneNode(deep);
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
		return function (o) {
			return o;
		};
	}

	function validateRemove(node) {
		return node && node.parentNode;
	}

	function removeElement(node) {
		return node.parentNode.removeChild(node);
	}

	function getElementHeight(el) {
		return el.offsetHeight || el.getBoundingClientRect().height;
	}

	function getPageOffset(bool) {
		var w = window,
			d = document.documentElement || document.body.parentNode || document.body,
			x = (w.pageXOffset !== undefined) ? w.pageXOffset : d.scrollLeft,
			y = (w.pageYOffset !== undefined) ? w.pageYOffset : d.scrollTop;
		return bool ? x : y;
	}

	function handleElement($el, cb) {
		if (getPageOffset() > cb($el.getElement())) {
			$el.render();
		} else {
			$el.unrender();
		}
	}

	function handleScroll($el, cb, klas) {
		if (!$el.getElementsByTagName) {
			var inta = new poloAF.Intaface('Element', ['render', 'unrender', 'getElement']);
			poloAF.Intaface.ensures($el, inta);
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
				extra = elementHeight * (percent || 0);
			return (elementOffsetTop - wh) + extra;
		} catch (e) {
			return 0;
		}
	}

	function getClassList(el) {
		return el && (el.classList || poloAF.ClassList(el));
	}

	function curry2(fun) {
		return function (secondArg) {
			return function (firstArg) {
				return fun(firstArg, secondArg);
			};
		};
	}

	function curry22(fun) {
		return function (secondArg) {
			return function (firstArg) {
				return function () {
					return fun(firstArg, secondArg);
				};
			};
		};
	}

	function curry3(fun) {
		return function (last) {
			return function (middle) {
				return function (first) {
					return fun(first, middle, last);
				};
			};
		};
	}

	function curry33(fun) {
		return function (last) {
			return function (middle) {
				return function (first) {
					return function () {
						return fun(first, middle, last);
					};
				};
			};
		};
	}

	function curry4(fun) {
		return function (fourth) {
			return function (third) {
				return function (second) {
					return function (first) {
						return fun(first, second, third, fourth);
					};
				};
			};
		};
	}

	function curry44(fun) {
		return function (fourth) {
			return function (third) {
				return function (second) {
					return function (first) {
						return function () {
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

	function doWhen(cond, action) {
		if (getResult(cond)) {
			return action();
		} else {
			return undefined;
		}
	}

	function invoker(NAME, METHOD) {
		return function (target) {
			if (!existy(target)) {
				fail("Must provide a target");
			}
			var targetMethod = target[NAME],
				args = _.rest(arguments);
			return doWhen((existy(targetMethod) && METHOD === targetMethod), function () {
				return targetMethod.apply(target, args);
			});
		};
	}

	function dispatch() {
		var funs = _.toArray(arguments),
			size = funs.length;
		return function (target) {
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
			return function () {
				_.forEach(_.invert(config), bound);
			};
		}
		return function (validate, method, config, target) {
			var unbound = function () {
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

	function setFromArray(validate, method, classArray, target) {
		//console.log(arguments)
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

	function filterTagsByClass(el, tag, cb) {
		var tags = _.toArray(el.getElementsByTagName(tag));
		return _.filter(tags, cb);
	}

	function getPolyClass(proto, klas, el, tag) {
		var classInvokers = [invoker('querySelectorAll', document.querySelectorAll), invoker('getElementsByClassName', document.getElementsByClassName)],
			mefilter = function (elem) {
				klas = klas.match(/^\./) ? klas.substring(1) : klas;
				return poloAF.Util.getClassList(elem).contains(klas);
			},
			ran = false,
			pre = _.partial(prefix, '.'),
			byTag = _.partial(filterTagsByClass, getResult(el) || document, tag || '*', mefilter),
			dispatcher = dispatch.apply(null, classInvokers.concat(byTag)),
			nested = function (klass) {
				var res = dispatcher(proto, klass);
				if ((!res || !res[0]) && klass && !ran) {
					ran = true;
					res = nested(klass.substring(1));
				}
				return res;
			};
		return nested(pre(klas));
	}

	function reverseArray(array) {
		var i,
			L = array.length,
			old;
		array = _.toArray(array);
		for (i = 0; i < Math.floor(L / 2); i += 1) {
			old = array[i];
			array[i] = array[L - 1 - i];
			array[L - 1 - i] = old;
		}
		return array;
	}

	function composer() {
		var args = _.toArray(arguments),
			//may just be creating/selecting an unadorned element
			/* if more than one argument get the last argument, otherwise get then only argument*/
			select = args[1] ? args.splice(-1, 1)[0] : args[0];
		return _.compose.apply(null, args)(select());
	}

	function prepareListener(extent){
    return function(handler, fn, el) {
		var listener,
			wrapper = function (func) {
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
		var f = function () {
			//console.log(arguments)
			return fun.apply(fun, arguments);
		};
		f.message = message;
		return f;
	}
	//note a function that ignores any state of x or y will return the first element if true and last if false
	function best(fun, coll) {
		return _.reduce(_.toArray(coll), function (champ, contender) {
			return fun(champ, contender) ? champ : contender;
		});
	}

	function simpleAdapter(allpairs, adapter, subject) {
		/*expects eg: [['shout', 'cry'],['bark', 'whine']]
		NOT [['shout', 'bark'],['cry', 'whine']]
		ALSO no arguments are assumed. It is simple*/
		var ptl,
			prepPairs = function (allpairs) {
				return _.zip(allpairs[0], allpairs[1]);
			},
			performer = function (that, subject, method) {
				subject[method]();
				return that;
			};
		_.each(prepPairs(allpairs), function (pairs) {
			_.each(pairs, function (method, i) {
				if (!i) {
					ptl = method;
				} else {
					adapter[ptl] = _.partial(performer, adapter, subject, method);
				}
			});
		});
		adapter.getSubject = function () {
			return subject;
		};
		return adapter;
	}
	var getNewElement = dispatch(curry2(cloneNode)(true), _.bind(document.createElement, document), _.bind(document.createDocumentFragment, document)),
        
		removeNodeOnComplete = _.wrap(removeElement, function (f, node) {
			if (validateRemove(node)) {
				return f(node);
			}
		}),
		slice = Array.prototype.slice,
		makeElement = function () {
			var el,
				args = slice.call(arguments);
			return {
				init: function () {},
				add: function () {
					el = composer.apply(null, args);
					return this;
				},
				add2: function (e) {
					el = composer.apply(null, args.concat(always(e)));
					return this;
				},
				remove: function () {
					var removed = removeNodeOnComplete(el);
					el = null;
					return removed;
				},
				get: function () {
					return el;
				}
			};
		},
		machElement = function () {
			var el,
				args = slice.call(arguments);
			return {
				init: function () {},
				render: function (e) {
					//console.log(e && e.target && e.target.src)
					/*don't do this: args = args.concat(always(e))
					add 'select' argument on-the-fly (see composer)
					fresh argument to the persisted Element object */
                    //console.log(args);
					el = composer.apply(null, e ? args.concat(always(e)) : args);
					return this;
				},
				unrender: function () {
					var removed = removeNodeOnComplete(getResult(el));
					el = null;
					return removed;
				},
				getElement: function () {
					return el;
				}
			};
		},
        SimpleXhrFactory = (function() {
	// The three branches.
	var standard = {
			createXhrObject: function() {
				return new window.XMLHttpRequest();
			}
		},
		activeXNew = {
			createXhrObject: function() {
				return new ActiveXObject('Msxml2.XMLHTTP');
			}
		},
		activeXOld = {
			createXhrObject: function() {
				return new ActiveXObject('Microsoft.XMLHTTP');
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
		} catch (e) {
			try {
				testObject = activeXOld.createXhrObject();
				return activeXOld; // Return this if no error was thrown.
			} catch (e) {
				throw new Error('No XHR object found in this environment.');
			}
		}
	}
})();
	return {
		$: function (str) {
			return document.getElementById(str);
		},
		addClass: _.partial(setFromArray, always(true), 'add'),
		/*handlers MAY need wrapping in a function that calls prevent default, stop propagation etc..
		which needs to be cross browser see EventCache.prevent */
		addEvent: function (handler, func, extent) {
			return function (el) {
                //console.log(el);
                el = getResult(el);
				var partial = el && _.isElement(el) ? _.partial(handler, el) : _.partial(handler);
				return prepareListener(extent)(partial, func, el);
			};
		},
		addHandler: addHandler,
		always: always,
		append: function (flag) {
			if (flag) {
				return curry33(setAnchor)(getNewElement)(null);
			}
			return curry3(setAnchor)(getNewElement)(null);
		},
		byIndex: byIndex,
		conditional: function () {
			var validators = _.toArray(arguments);
			return function (fun, arg) {
				var errors = mapcat(function (isValid) {
					return isValid(arg) ? [] : [isValid.message];
				}, validators);
				if (!_.isEmpty(errors)) {
					throw new Error(errors.join(", "));
				}
				return fun(arg);
			};
		},
		silent_conditional: function () {
			var validators = _.toArray(arguments);
			return function (fun, arg) {
				var errors = mapcat(function (isValid) {
					return isValid(arg) ? [] : [isValid.message];
				}, validators);
				if (!_.isEmpty(errors)) {
					return;
					//throw new Error(errors.join(", "));
				}
				return fun(arg);
			};
		},
		curry4: curry4,
		curryTwice: function (flag) {
			return flag ? curry22 : curry2;
		},
		curryThrice: function (flag) {
			return flag ? curry33 : curry3;
		},
		curryFourFold: function (flag) {
			return flag ? curry44 : curry4;
		},
		doAlternate: doAlternate,
		/*USAGE: 
        var once = doOnce(),
        actions = [func1, func2, ...];
        function (flag) {
        var f = ptL(thunk, once(1));
        return best(f, actions)();
				}; */
		doOnce: function () {
			return function (i) {
				return function () {
					var res = i > 0;
					i -= 1;
					return res > 0;
				};
			};
		},
		doWhen: doWhen,
		drillDown: drillDown,
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
        if(_.every([red,green,blue], terminate)){ return; }
		mysums = [red, green, blue].map(ceil).map(function(n,i){
                return mysums[i](n);
            });
            repeat = function() {
                poloAF.Util.fadeUp.apply(null, [element].concat(mysums));
		};
		element.fade = window.setTimeout(repeat, 100);
        },
		findIndex: function (collection, predicate) {
			return _.findIndex(collection, predicate || always(true));
		},
		getBest: best,
		getBody: function () {
			return document.body || document.getElementsByTagName('body')[0];
		},
		getByClass: _.partial(getPolyClass, document),
		getByTag: _.partial(mittleInvoke, 'getElementsByTagName'),
		getClassList: getClassList,
		getComputedStyle: function (element, styleProperty) {
			var computedStyle = null,
				def = document.defaultView || window;
			if (typeof element.currentStyle !== 'undefined') {
				computedStyle = element.currentStyle;
			} else if (def && def.getComputedStyle && _.isFunction(def.getComputedStyle)) {
				computedStyle = def.getComputedStyle(element, null);
			}
			if (computedStyle) {
				return computedStyle[styleProperty] || computedStyle[toCamelCase(styleProperty)];
			}
		},
		getDefaultAction: _.partial(best, noOp()),
		getDomChild: curry3(getTargetNode)('firstChild'),
		getDomParent: curry3(getTargetNode)('parentNode'),
		getElementHeight: getElementHeight,
		getElementOffset: getElementOffset,
		getSibling: curry3(getTargetNode)('nextSibling'),
		getNewElement: getNewElement,
		getNext: _.partial(nested, curry2(getter)('nextSibling'), getNextElement), // expects node //?//
		getNextElement: getNextElement, //expects node.nextSibling
		getNodeByTag: curry2(regExp)('i'),
		getPredicate: function (cond, predicate) {
			return predicate(getResult(cond)) ? predicate : _.negate(predicate);
		},
		getPreviousElement: getPreviousElement, //?//
		getPrevious: _.partial(nested, curry2(getter)('previousSibling'), getPreviousElement),
		getScrollThreshold: getScrollThreshold,
		getZero: _.partial(byIndex, 0),
		getter: getter,
		gtThan: gtThan,
		hasClass: (function () {
			var html = document.documentElement || document.getElementsByTagName('html')[0];
			return function (str, el) {
                el = el || html;
				return poloAF.Util.getClassList(el).contains(str);
			};
		}()),
        hasFeature: (function () {
			var html = document.documentElement || document.getElementsByTagName('html')[0];
			return function (str) {
				return poloAF.Util.getClassList(html).contains(str);
			};
		}()),
		hide: _.partial(setFromArray, always(true), 'remove', ['show']),
		highLighter: {
			perform: function () {
				if (!poloAF.Util.hasFeature('nthchild')) { // utils.hasFeature('nthchild') || Modernizr.nthchild
					this.perform = function () {
						var ptL = _.partial,
							getBody = curry3(simpleInvoke)('body')('getElementsByTagName'),
							getLinks = curry3(simpleInvoke)('a')('getElementsByTagName'),
							getTerm = _.compose(curry2(getter)('id'), ptL(byIndex, 0), getBody),
							//links = _.compose(getLinks, curry3(simpleInvoke)('nav')('getElementById'))(document),
							links = _.compose(getLinks, poloAF.Util.getZero, curry3(simpleInvoke)('nav')('getElementsByTagName'))(document),
							found = ptL(_.filter, _.toArray(links), function (link) {
								return new RegExp(link.innerHTML.replace(/ /gi, '_'), 'i').test(getTerm(document));
							});
						_.compose(ptL(poloAF.Util.addClass, 'current'), ptL(byIndex, 0), found)();
					};
				} else {
					this.perform = function () {};
				}
				this.perform();
			}
		},
		insert: function (flag) {
			if (flag) {
				return function (ref, anc) {
					return curry33(setAnchor)(getNewElement)(ref)(anc);
				};
			}
			return function (ref, anc) {
				return curry3(setAnchor)(getNewElement)(ref)(anc);
			};
		},
		insertAfter: insertAfter,
		insertBefore: function(refnode, tgt){
            refnode.parentNode.insertBefore(tgt, refnode);
        },
		invokeRest: function (m, o) {
			return o[m].apply(o, _.rest(arguments, 2));
		},
		invokeWhen: invokeWhen,
		invoker: invoker,
		isDesktop: _.partial(gtThan, window.viewportSize.getWidth),
		isEqual: function (x, y) {
			return getResult(x) === getResult(y);
		},
		lsThan: lsThan,
		machElement: machElement,
		makeElement: makeElement,
		map: function (coll, mapper) {
			return _.map(coll, mapper);
		},
		move: function (flag) {
			if (flag) {
				return curry33(setAnchor)(_.identity)(null);
			}
			return curry3(setAnchor)(_.identity)(null);
		},
		each: function (o, m, coll) {
			o[m] = function () {
				var args = arguments;
				_.each(coll, function (member) {
					return member[m].apply(member, args);
				});
			};
		},
		removeClass: _.partial(setFromArray, always(true), 'remove'),
		removeNodeOnComplete: removeNodeOnComplete,
		render: render,
		reverse: reverseArray,
		setAnchor: setAnchor,
		setAttributes: _.partial(setFromFactory(!window.addEventListener), always(true), 'setAttribute'),
		setAttrsFix: setFromFactory, //keep as may be in use, but prefer above
		setFromArray: setFromArray,
		setScrollHandlers: function (collection, getThreshold, klas) {
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
		simpleAdapter: simpleAdapter,
        SimpleXhrFactory: SimpleXhrFactory,
		toggleClass: _.partial(setFromArray, always(true), 'toggle'),
		toggle: _.partial(setFromArray, always(true), 'toggle', ['show']),
		validator: validator,
		shout: function (m) {
			var applier = function (f, args) {
				return function () {
					f.apply(null, args);
				};
			};
			return applier(_.bind(window[m], window), _.rest(arguments));
		},
        supportTest: function(el, prop, reg){
            var getBg = curry3(simpleInvoke)(reg)('match');
            return getBg(poloAF.Util.getComputedStyle(el, prop));
        },
		getDummyTarget: function (k, v) {
			var tgt = {};
			tgt[k] = v;
			return {
				target: tgt
			};
		},
		report: function (arg) {
			document.getElementsByTagName('h2')[0].innerHTML = arg;
		}
	}; //end
}());