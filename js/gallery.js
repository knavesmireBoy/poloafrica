/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global console: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
(function (mq, query, touchevents, pausepath, picnum, dummy, makePath) {
	"use strict";
    
    ////$element.triggerEvent($element.getElement(), 'scroll');
	function triggerEvent(el, type) {
		var e;
		if ('createEvent' in document) {
       // if (document.hasOwnProperty('createEvent')) {
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

	function reporter(msg, el) {
		el = el || utils.getByTag('h2', document)[0];
		msg = typeof msg === 'undefined' ? document.documentElement.className : msg;
		el.innerHTML = msg;
	}

	function always(val) {
		return function () {
			return val;
		};
	}

	function noOp() {}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function greater(a, b) {
		return a > b;
	}

	function equals(a, b) {
		return a === b;
	}

	function modulo(n, i) {
		return i % n;
	}

	function increment(i) {
		return i + 1;
	}

	function equalNum(tgt, cur) {
		return cur === tgt || Number(cur) === Number(tgt);
	}

	function invoke(f, arg) {
		arg = _.isArray(arg) ? arg : [arg];
		return f.apply(null, arg);
	}

	function invokeBridge(arr) {
		return invoke(arr[0], arr[1]);
	}

	function invokeArgs(f) {
		var args = _.rest(arguments);
		return f.apply(null, _.map(args, getResult));
	}

	function doMethod(o, v, p) {
		return o[p] && o[p](v);
	}

	function lazyVal(v, o, p) {
		return doMethod(o, v, p);
	}

	function doCallbacks(v, o, p) {
		return _[p](o, v);
	}

	function doInc(n) {
		return _.compose(_.partial(modulo, n), increment);
	}

	function doOnce() {
		return function (i) {
			return function () {
				var res = i > 0;
				i -= 1;
				return res > 0;
			};
		};
	}

	function goCompare(o, p1, p2, invoker) {
		var args = _.map([p1, p2], function (ptl) {
			return ptl(o);
		});
		return invoker.apply(null, args);
	}

	function onTruth(bool, alts) {
		return bool ? alts[0] : alts[1];
	}

	function partial(f, el) {
		return ptL(f, el);
	}

	function getEventObject(e) {
		return e || window.event;
	}
	//https://medium.com/@dtipson/creating-an-es6ish-compose-in-javascript-ac580b95104a
	function eventing(type, actions, fn, el) {
        
		function preventer(wrapped, e) {
			_.each(actions, function (a) {
				myEvent.preventers[a](e);
			});
			return wrapped(e);
		}
		fn = _.wrap(fn, preventer);
		el = getResult(el);
        
		return {
			render: function () {
                myEvent.add(el, type, fn);
				return this;
			},
			unrender: function () {
				myEvent.remove(el, type, fn);
				return this;
			},
			getEl: function () {
				return el;
			}
		};
	}

	function addElements() {
		return _.compose(twice(invoke)('img'), anCr, twice(invoke)('a'), anCr, anCr(thumbs))('li');
	}
	//slide and pause 
	function onLoad(img, path, promise) {
		promise.then(getLI(img));
		img.src = path;
	}
	//height and widht of image are compared BUT a) must invoke the comparison AFTER image loaded
	//b) must remove load listener or will intefere with slideshow
	function onBase(img, path, promise) {
		img.src = path;
		var ev = eventing('load', ['preventDefault'], function (e) {
			promise.then(e.target);
			ev.unrender();
		}, img).render();
	}

	function FauxPromise(args) {
		//must be an array of functions, AND the first gets run last
		this.cbs = _.compose.apply(null, args);
	}
	FauxPromise.prototype.then = function () {
		return this.cbs.apply(null, arguments);
	};

	function attrMap(el, map, style) {
		var k;
		for (k in map) {
			if (map.hasOwnProperty(k)) {
				if (k.match(/^te?xt$/)) {
					el.innerHTML = map[k];
					continue;
				}
				if (style) {
					el.style.setProperty(k, map[k]);
				} else {
					el.setAttribute(k, map[k]);
				}
			}
		}
		return el;
	}

	function doMap(el, v) {
		if (Array.isArray(v[0][0])) {
			_.each(v[0], function (sub) {
				return attrMap(getResult(el), _.object([
					[sub[0], sub[1]]
				]), true);
			});
		} else {
			_.each(v, function (sub) {
				return attrMap(getResult(el), _.object([
					[sub[0], sub[1]]
				]));
			});
		}
		return el;
	}
	/* EXPECTS VALUE BEFORE KEY ON RIGHT CURRY*/
	function doMapBridge(el, v, k) {
		return doMap(el, [
			[k, v]
		]);
	}

	function doMapLateVal(v, el, k) {
		return doMap(el, [
			[k, v]
		]);
	}

	function getNativeOpacity(bool) {
		return {
			getKey: function () {
				return bool ? 'filter' : Modernizr.prefixedCSS('opacity');
			},
			getValue: function (val) {
				return bool ? 'alpha(opacity=' + val * 100 + ')' : val;
			}
		};
	}

	function doOpacity(flag) {
		var slide = $('slide'),
			val;
		if (slide) {
			val = flag ? 1 : recur.i / 100;
			val = cssopacity.getValue(val);
			doMap(slide, [
				[
					[cssopacity.getKey(), val]
				]
			]);
		}
	}

	function doMakeBase(source, target) {
		var img = addElements();
		doMap(img.parentNode, [
			['href', source]
		]);
		doMap(img.parentNode.parentNode, [
			['id', target]
		]);
		return onBase(img, doParse(img.parentNode.href), new FauxPromise(_.rest(arguments, 2)));
	}

	function doMakeSlide(source, target) {
		var img = addElements();
		doMap(img.parentNode, [
			['href', doParse(getBaseSrc())]
		]);
		doMap(img.parentNode.parentNode, [
			['id', target]
		]);
		return onLoad(img, doParse(img.parentNode.href), new FauxPromise(_.rest(arguments, 2)));
	}

	function doMakePause(path) {
		var img = addElements();
		doMap(img.parentNode.parentNode, [
			['id', 'paused']
		]);
		doMap(img.parentNode.parentNode, [
			[
				[cssopacity.getKey(), cssopacity.getValue(0.5)]
			]
		]);
		return onLoad(img, path, new FauxPromise(_.rest(arguments)));
	}

	function getAspectPriority(bool, coll) {
		if (coll[13]) {
			var copy = coll.slice(0),
				res = copy.splice(4, 6);
			return bool ? res : copy;
		}
		return bool ? [] : coll;
	}

	function getLeadingGroup(portrait, landscape, flag) {
		var leader = flag ? portrait : landscape,
			trailer = flag ? landscape : portrait;
		return [leader, trailer];
	}
	var pages = (function () {
			var een = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14],
				twee = _.range(15, 29),
				drie = _.range(29, 43),
				vier = _.range(43, 55),
				vyf = _.range(55, 67),
				ses = _.range(67, 79),
				sewe = _.range(79, 93),
				all = [een, twee, drie, vier, vyf, ses, sewe];
			return {
				getAll: function () {
					return all.slice(0);
				},
				findInt: function (finder) {
					return Number(finder().match(picnum)[1]);
				},
				findIndex: function (finder) {
					return _.findIndex(_.map(all, twice(_.filter)(ptL(equalNum, this.findInt(finder)))), _.negate(_.isEmpty));
				}
			};
		}()),
		utils = poloAF.Util,
		myEvent = (function (flag) {
			if (flag) {
				return {
                    preventers: {
					preventDefault: function (e) {
						e.preventDefault();
					},
					stopPropagation: function (e) {
						e.stopPropagation();
					},
					stopImmediatePropagation: function (e) {
						e.stopImmediatePropagation();
					}
				},
                    add: function(el, type, fn){
                        el.addEventListener(type, fn, false);
                    },
                    remove: function(el, type, fn){
                        el.removeEventListener(type, fn, false);
                    },
                    name: 'MODERN'
                };
			}
			return {
				preventers: {
                    preventDefault: function (e) {
					e = getEventObject(e);
					e.returnValue = false;
				},
				stopPropagation: function (e) {
					e = getEventObject(e);
					e.cancelBubble = true;
				},
				stopImmediatePropagation: noOp
                },
                add: function(el, type, fn){
                    el.attachEvent('on' + type, fn);
                    },
                remove: function(el, type, fn){
                    el.detachEvent('on' + type, fn);
                },
                name: 'IE'
            };
                
		}(window.addEventListener)),
		//con = _.bind(window.console.log, window),
		ptL = _.partial,
		curryFactory = utils.curryFactory,
		once = doOnce(),
		defer_once = curryFactory(1, true),
		twice = curryFactory(2),
		twicedefer = curryFactory(2, true),
		thrice = curryFactory(3),
		thricedefer = curryFactory(3, true),
		deferEach = thricedefer(doCallbacks)('each'),
		parser = thrice(doMethod)('match')(/images\/[^\/]+\.(jpg|png)$/),
		doGet = twice(utils.getter),
		doParse = _.compose(doGet(0), parser),
		gtEq = ptL(greater),
		doAlt = function (actions) {
			return actions.reverse()[0]();
		},
		anCr = utils.append(),
		anCrIn = utils.insert(),
		setAttrs = utils.setAttributes,
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		klasTog = utils.toggleClass,
		cssopacity = getNativeOpacity(!window.addEventListener),
		main = document.getElementsByTagName('main')[0],
		thumbs = utils.getByClass('gallery')[0],
		$ = thrice(lazyVal)('getElementById')(document),
		$$ = thricedefer(lazyVal)('getElementById')(document),
		unsetPortrait = ptL(klasRem, 'portrait', thumbs),
		setPortrait = ptL(klasAdd, 'portrait', thumbs),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		getTarget = utils.drillDown([mytarget]),
		text_from_target = _.compose(doGet('id'), getTarget),
		node_from_target = _.compose(doGet('nodeName'), getTarget),
		doCompare = utils.curryFactory(4)(goCompare)(greater)(doGet('offsetWidth'))(doGet('offsetHeight')),
		getLI = utils.getDomParent(utils.getNodeByTag('li')),
		getDomTargetImg = utils.getDomChild(utils.getNodeByTag('img')),
		getLength = doGet('length'),
		doClass = _.compose(twice(onTruth)(['addClass', 'removeClass']), doCompare),
		sortClass = function (klas, el, m) {
			utils[m](klas, el);
		},
		allpics = utils.getByTag('img', main),
		getSlideChild = _.compose(utils.getChild, utils.getChild, $$('slide')),
		getBaseChild = _.compose(utils.getChild, utils.getChild, $$('base')),
		getBaseSrc = _.compose(utils.drillDown(['src']), getBaseChild),
		makeToolTip = function (flag) {
			var tooltip = poloAF.Tooltip(thumbs, ["move mouse in and out of footer...", "...to toggle the display of control buttons"], !touchevents ? 2 : 0, flag);
			tooltip.init();
		},
		getValue = function (v, p) {
			return poloAF.LoopIterator.page_iterator[p]()[v];
		},
		showtime = _.compose(ptL(klasRem, ['gallery'], thumbs), ptL(klasAdd, ['showtime'], utils.getBody())),
		playtime = ptL(klasAdd, 'inplay', $('wrap')),
		playing = _.compose(ptL(utils.doWhen, once(2), ptL(makeToolTip, true)), ptL(klasAdd, 'playing', $$('controls'))),
		notplaying = ptL(klasRem, 'playing', $$('controls')),
		exitplay = ptL(klasRem, 'inplay', $('wrap')),
		exitswap = ptL(klasRem, 'swap', utils.getBody()),
		exitshow = _.compose(ptL(klasAdd, 'gallery', thumbs), exitswap, ptL(klasRem, 'showtime', utils.getBody()), exitplay),
		undostatic = ptL(klasRem, 'static', $$('controls')),
		doOrient = function (l, p) {
			return function (img) {
				utils.getBest(ptL(gtEq, img.clientHeight, img.clientWidth), [p, l])();
				return img.src;
			};
		},
		$LI = (function (options) {
			function getColl() {
				return _.filter(thumbs.getElementsByTagName('li'), function (li) {
					return !li.id;
				});
			}
			return {
				exec: function () {
					//used ONLY by negator swaps actions on failing predicate
					var action = options[0];
					_.each(_.last(getColl(), 2), this[action]);
					options = options.reverse();
				},
				unrender: function (el) {
					var $el = utils.machElement(always(el)).render();
					$el.unrender();
				},
				render: function (el) {
					var base = $('base'),
						ancr = base ? anCrIn(base, thumbs) : anCr(thumbs);
					//doesn't really matter where #base is as all other LIS are hidden when it is present. But it's tidier
					return utils.machElement(ancr, always(el)).render();
				},
				query: function (coll) {
					var lis = getColl(),
						L = getColl().length;
					if (L > coll.length) {
						_.each(_.last(lis, 2), this.unrender);
					} else if (L < coll.length) {
						_.each(_.last(lis, 2), this.render);
					}
				}
			};
		}(['unrender', 'render'])),
		negator = (function (pred) {
			return function (cb, page_coll) {
				if (pred(page_coll.value)) {
					cb();
					pred = _.negate(pred);
				}
				return page_coll;
			};
		}(function (coll) {
			return coll.length !== 14;
		})),
		//awaits an img element, maps functions that are invoked with the incoming element argument
		doPortrait = _.compose(ptL(invoke, sortClass), ptL(_.map, [always('portrait'), getLI, doClass]), twice(invoke)),
		fixNoNthChild = _.compose(ptL(utils.doWhen, _.negate(utils.always(Modernizr.nthchild))), ptL(partial, doPortrait)),
		doPopulate = function (pagepics) {
			_.each(allpics, function (img, i) {
				populatePage(img, pagepics.value[i]);
			});
		},
		populatePage = function (img, path) {
			img.src = makePath(path);
			img.parentNode.href = doParse(img.src);
			//adds portrait class on browsers that don't support nth-child
			img.onload = function (e) {
				fixNoNthChild(e.target);
			};
		},
		cross_page_iterator = function () {
			poloAF.LoopIterator.cross_page_iterator = poloAF.LoopIterator.from(pages.getAll(), doInc(pages.getAll().length));
		},
		populate = _.compose(doPopulate, ptL(negator, _.compose(ptL(klasTog, 'alt', thumbs), _.bind($LI.exec, $LI)))),
		advanceRouteBridge = function (e) {
			if (!node_from_target(e).match(/a/i)) {
				return;
			}
			if (utils.findByClass('inplay')) {
				return 'current';
			}
			return text_from_target(e).match(/back$/) ? 'back' : 'forward';
		},
		advanceRoute = function (m) {
			if (!poloAF.LoopIterator.cross_page_iterator) {
				cross_page_iterator();
			}
			return m && populate(poloAF.LoopIterator.cross_page_iterator[m]());
		},
		advanceRouteListener = _.wrap(advanceRouteBridge, function (orig, e) {
			return advanceRoute(orig(e));
		}),
		addPageNav = function (myAnCr, id, cb) {
			var el = _.compose(cb, anCr(_.compose(ptL(klasAdd, 'pagenav'), ptL(setAttrs, {
				id: id,
				href: '.'
			}), myAnCr(main), utils.always('a'))))('span');
			return el;
		},
		pageNavHandler = _.compose(ptL(eventing, 'click', null, _.debounce(advanceRouteListener, 300)), utils.getDomParent(utils.getNodeByTag('main'))),
		$nav = addPageNav(ptL(anCrIn, thumbs), 'gal_back', pageNavHandler),
		prepareSlideshow = function (i, sub) {
			var all = pages.getAll(),
				getPortraitPics = ptL(getAspectPriority, true),
				getLscpPics = ptL(getAspectPriority, false),
				fixPageOrder = function (group, i) {
					var leader = group[0],
						tmp = leader[0],
						start = _.findIndex(tmp, ptL(equalNum, i));
					leader[0] = utils.shuffleArray(tmp)(start); //fix on page order
					return group;
				},
				matchup = function (j) {
					return function (arr) {
						return _.map(arr, function (a, i, myarr) {
							if (a[0].length && a[1].length) {
								j = i && myarr[i - 1][1].length;
								if (j && (a[0].length !== j)) {
									a = a.reverse();
								}
							}
							return a;
						});
					};
				},
				reordered = utils.shuffleArray(all.slice(0))(sub),
				mylscp = _.map(reordered, getLscpPics),
				myptrt = _.map(reordered, getPortraitPics),
				is_portrait = _.filter(myptrt, function (arr) {
					return _.find(arr, ptL(equalNum, i));
				}),
				group = fixPageOrder(getLeadingGroup(myptrt, mylscp, !!is_portrait[0]), i);
			if (Modernizr.touchevents) {
				group = _.flatten(group[0]).concat(_.flatten(group[1]));
			} else {
				group = _.flatten(matchup(0)(_.zip(group[0], group[1])));
			}
			poloAF.LoopIterator.page_iterator = poloAF.LoopIterator.from(_.map(group, makePath), doInc(getLength(group)));
		},
		get_play_iterator = function (flag) {
			var myint = pages.findInt(getBaseSrc),
				page_index = pages.findIndex(getBaseSrc),
				page,
				gallery_pics,
				Looper = poloAF.LoopIterator;
			if (flag) {
				prepareSlideshow(myint, page_index);
			} else {
				Looper.cross_page_iterator = Looper.cross_page_iterator || Looper.from(pages.getAll(), doInc(getLength(pages.getAll())));
				Looper.cross_page_iterator.set(page_index);
				page = Looper.cross_page_iterator.get();
				$LI.query(page);
				gallery_pics = _.filter(allpics, function (img) {
					return !getLI(img).id;
				});
				_.each(gallery_pics, function (img, i) {
					populatePage(img, page[i]);
				});
				Looper.page_iterator = Looper.from(_.map(gallery_pics, function (img) {
					return img.src;
				}), doInc(getLength(gallery_pics)));
				Looper.page_iterator.find(getBaseSrc());
			}
		},
		loadImage = function (getnexturl, id, promise) {
			var img = getDomTargetImg($(id));
			if (img) {
				img.onload = function (e) {
					promise.then(e.target);
				};
				img.src = doParse(getnexturl());
				img.parentNode.href = doParse(img.src);
			}
		},
		loader = function (caller, id) {
			var args = _.rest(arguments, 2);
			args = args.length ? args : [function () {}];
			loadImage(caller, id, new FauxPromise(args));
		},
		locator = function (forward, back) {
			var getLoc = (function () {
				return function (e) {
					var box = e.target.getBoundingClientRect();
					return e.clientX - box.left > (box.right - box.left) / 2;
				};
			}());
			return function (e) {
				return utils.getBest(function (agg) {
					return agg[0](e);
				}, [
					[getLoc, forward],
					[always(true), back]
				]);
			};
		},
		do_page_iterator = function () {
			poloAF.LoopIterator.page_iterator = poloAF.LoopIterator.from(_.map(allpics, function (img) {
				return img.src;
			}), doInc(getLength(allpics)));
		},
		setindex = function (arg) {
			if (!poloAF.LoopIterator.page_iterator) {
				do_page_iterator();
			}
			return poloAF.LoopIterator.page_iterator.find(arg);
		},
		nextcaller = twicedefer(getValue)('forward')('value'),
		prevcaller = twicedefer(getValue)('back')('value'),
		locate = eventing('click', ['preventDefault', 'stopPropagation'], function (e) {
			locator(twicedefer(loader)('base')(nextcaller), twicedefer(loader)('base')(prevcaller))(e)[1]();
			doOrient(unsetPortrait, setPortrait)(e.target);
		}, thumbs),
		///slideshow...
		recur = (function (l, p) {
			function test() {
				return _.map([getBaseChild(), getSlideChild()], function (img) {
					return img && img.width > img.height;
				});
			}

			function paint() {
				var coll = test(),
					bool = coll[0] === coll[1],
					body = utils.getClassList(utils.getBody()),
					m = bool ? 'remove' : 'add';
				body[m]('swap');
				return !bool;
			}

			function doFormat(img) {
				return utils.getBest(ptL(gtEq, img.width, img.height), [l, p])();
			}

			function doBase() {
				loader(_.bind(poloAF.LoopIterator.page_iterator.play, poloAF.LoopIterator.page_iterator), 'base', setPlayer, paint);
			}

			function doSlide() {
				loader(_.compose(utils.drillDown(['src']), utils.getChild, utils.getChild, $$('base')), 'slide', doFormat);
			}

			function doRecur() {
				player.inc();
				recur.t = window.requestAnimationFrame(recur);
			}
			var playmaker = (function () {
					var fadeOut = {
							validate: function () {
								return recur.i <= -61;
							},
							inc: function () {
								recur.i -= 1;
							},
							reset: function () {
								doSlide();
								var body = utils.getClassList(utils.getBody());
								setPlayer(body.contains('swap'));
							}
						},
						fadeIn = {
							validate: function () {
								return recur.i >= 300;
							},
							inc: function () {
								recur.i += 1;
							},
							reset: function () {
								doBase();
							}
						},
						fade = {
							validate: function () {
								return recur.i <= -1;
							},
							inc: function () {
								recur.i -= 1;
							},
							reset: function () {
								recur.i = 300;
								doSlide();
								doOpacity();
								doBase();
								undostatic();
							}
						},
						actions = [fadeIn, fadeOut];
					return function (flag) {
						return flag ? actions.reverse()[0] : fade;
					};
				}()),
				setPlayer = function (arg) {
					player = playmaker(arg);
					recur();
				},
				player = playmaker();
			return function () {
				if (!recur.t) {
					get_play_iterator(true);
				}
				if (player.validate()) {
					player.reset();
				} else {
					doOpacity();
					doRecur();
				}
			};
		}(unsetPortrait, setPortrait)),
		clear = function (flag) {
			doOpacity(flag);
			window.cancelAnimationFrame(recur.t);
			recur.t = null;
		},
		go_render = thrice(doMethod)('render')(null),
		factory = function () {
			var remPause = _.compose(utils.removeNodeOnComplete, $$('paused')),
				remSlide = _.compose(utils.removeNodeOnComplete, $$('slide')),
				doSlide = defer_once(doAlt)([clear, recur]),
				doPlaying = defer_once(doAlt)([notplaying, playing]),
				doDisplay = defer_once(doAlt)([playtime]),
				unlocate = thricedefer(doMethod)('unrender')(null)(locate),
				unpauser = function () {
					var path = utils.hasClass('portrait', thumbs) ? pausepath + 'pauseLong.png' : pausepath + 'pause.png';
					//because we're adding invoke_player to the slide LI, pause LI, it's immediate sibling, will prevent the click reaching it
					//so we invoke_player here also, the listener is deleted along with the LI
					doMakePause(path, go_render, do_invoke_player);
				},
				doPause = defer_once(doAlt)([ptL(utils.doWhen, $$('slide'), unpauser), remPause]),
				invoke_player = deferEach([doSlide, doDisplay, doPause, doPlaying])(getResult),
				do_invoke_player = ptL(eventing, 'click', null, invoke_player),
				setOrient = ptL(doOrient(unsetPortrait, setPortrait), $$('base')),
				relocate = ptL(lazyVal, null, locate, 'render'),
				doReLocate = ptL(utils.doWhen, $$('base'), relocate),
				farewell = [notplaying, exitplay, exitswap, doReLocate, setOrient, deferEach([remPause, remSlide])(getResult)],
				next_driver = deferEach([get_play_iterator, defer_once(clear)(true), twicedefer(loader)('base')(nextcaller)].concat(farewell))(getResult),
				prev_driver = deferEach([get_play_iterator, defer_once(clear)(true), twicedefer(loader)('base')(prevcaller)].concat(farewell))(getResult),
				pauser = ptL(utils.invokeWhen, _.negate(ptL($, 'slide')), ptL(doMakeSlide, 'base', 'slide', unlocate, go_render, do_invoke_player)),
				COR = function (predicate, action) {
					return {
						setSuccessor: function (s) {
							this.successor = s;
						},
						handle: function () {
							if (predicate.apply(this, arguments)) {
								return action.apply(this, arguments);
							} else if (this.successor) {
								return this.successor.handle.apply(this.successor, arguments);
							}
						},
						validate: function (str) {
							if (utils.findByClass('inplay') && recur.t && predicate(str)) {
								//return fresh instance on exiting slideshow IF in play mode
								return factory();
							}
							return this;
						}
					};
				},
				mynext = COR(ptL(invokeArgs, equals, 'forwardbutton'), next_driver),
				myprev = COR(ptL(invokeArgs, equals, 'backbutton'), prev_driver),
				myplayer = COR(function () {
					pauser();
					return true;
				}, invoke_player);
			myplayer.validate = function () {
				return this;
			};
			mynext.setSuccessor(myprev);
			myprev.setSuccessor(myplayer);
			recur.i = 50; //slide is clone of base initially, so fade can start quickly
			return mynext;
		}, //factory
		setup = eventing('click', ['preventDefault'], function (e) {
            
			if (!node_from_target(e).match(/img/i)) {
                utils.$('placeholder').innerHTML = 'wowee';
                return;
            }
           try {
            _.compose(setindex, utils.drillDown([mytarget, 'src']))(e);
			_.compose(ptL(klasAdd, 'static'), thrice(doMapBridge)('id')('controls'), anCr(main))('section');
            doMakeBase(e.target.src, 'base', doOrient(unsetPortrait, setPortrait), getBaseChild, showtime);
           }
            catch(e){
               utils.$('placeholder').innerHTML = e; 
            }
                 
			var buttons = ['backbutton', 'playbutton', 'forwardbutton'],
				aButton = anCr($('controls')),
				close_cb = ptL(_.compose(thrice(doMapBridge)('href')('.'), thrice(doMapBridge)('id')('exit'), anCrIn(thumbs, main)), 'a'),
				dombuttons = _.map(buttons, _.compose(thrice(doMapLateVal)('id'), aButton, thrice(doMethod)('slice')(-6))),
				dostatic = ptL(klasAdd, 'static', $$('controls')),
				chain = factory(),
				controls = eventing('click', ['preventDefault'], function (e) {
					var str = text_from_target(e),
						node = node_from_target(e);
					if (node.match(/button/i)) {
						//!!REPLACE the original chain reference, validate will return either the original or brand new instance
						chain = chain.validate(str);
						chain.handle(str);
					}
				}, $('controls')),
				controls_undostat = eventing('mouseover', [], undostatic, utils.getByTag('footer', document)[0]),
				controls_dostat = eventing('mouseover', [], dostatic, $('controls')),
				exit = eventing('click', ['stopPropagation'], function () {
					chain = chain.validate('play');
					_.each([$('exit'), $('tooltip'), $('controls'), $('paused'), $('base'), $('slide')], utils.removeNodeOnComplete);
					exitshow();
					locate.unrender();
					setup.render();
				}, close_cb);
			//listeners...
			_.each(_.zip(dombuttons, buttons), invokeBridge);
            _.each([controls, exit, locate, controls_undostat, controls_dostat], go_render);
            setup.unrender();
		}, thumbs);
	setup.render();
	//addPageNav(anCr, 'gal_forward', always(dummy));
	//$nav.render();
	//_.each(allpics, fixNoNthChild);
    utils.$('placeholder').innerHTML = 'PHOTOS';
    //utils.$('placeholder').innerHTML = myEvent.name;
    
    triggerEvent(document.images[1], 'click');
    
}(Modernizr.mq('only all'), '(min-width: 668px)', Modernizr.touchevents, '../images/resource/', new RegExp('[^\\d]+\\d(\\d+)[^\\d]+$'), {
	render: function () {
		"use strict";
	},
	unrender: function () {
		"use strict";
	}
}, function (path) {
	"use strict";
	if (path) {
		path = path.toString();
		var mypath = path.length < 3 ? "images/0" + path : "images/" + path;
		return mypath + ".jpg";
	}
}));