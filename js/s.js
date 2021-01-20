/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Map: false */
/*global Promise: false */
/*global console: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
(function (mq, query, touchevents, pausepath, picnum, dummy, makePath) {
	"use strict";
    
    function reporter (msg, el) {
        el = el || utils.getByTag('h2', document)[0];
        msg = typeof msg === 'undefined' ? document.documentElement.className : msg;
        el.innerHTML = msg;
		}

	function always(val) {
		return function () {
			return val;
		};
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function divide(a, b) {
		return a / b;
	}

	function greater(a, b) {
		return a > b;
	}

	function equals(a, b) {
		return a === b;
	}

	function equalNum(tgt, cur) {
		return cur === tgt || Number(cur) === Number(tgt);
	}

	function subtract(a, b) {
		return a - b;
	}

	function invoke(f, arg) {
		arg = _.isArray(arg) ? arg : [arg];
		return f.apply(null, arg);
	}

	function invokeArgs(f) {
		var args = _.rest(arguments);
		return f.apply(null, args.map(getResult));
	}

	function callerBridge(o, v, p) {
		return o[p] && o[p](v);
	}

	function mycaller(v, o, p) {
		return callerBridge(o, v, p);
	}
    
	function nested(e, s, g) {
		return s(g(e));
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
		var args = [p1, p2].map(function (ptl) {
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
	//https://medium.com/@dtipson/creating-an-es6ish-compose-in-javascript-ac580b95104a
	function eventing(type, actions, fn, el) {
		actions = actions || ['preventDefault'];

		function preventer(wrapped, e) {
			actions.forEach(function (a) {
				e[a]();
			});
			return wrapped(e);
		}
		fn = _.wrap(fn, preventer);
		el = getResult(el);
		return {
			render: function () {
				//con(el)
				el.addEventListener(type, fn, false);
				return this;
			},
			unrender: function () {
				el.removeEventListener(type, fn, false);
				return this;
			},
			getEl: function () {
				return el;
			}
		};
	}

	function LoopIterator(group) {
		this.group = group;
		this.position = 0;
		this.rev = false;
	}

	function Group() {
		this.members = [];
	}
	Group.prototype = {
		add: function (value) {
			if (!this.has(value)) {
				this.members.push(value);
			}
		},
		remove: function (value) {
			this.members = _.filter(this.members, _.negate(ptL(equals, value)));
		},
		has: function (value) {
			return this.members.includes(value);
		}
	};
	Group.from = function (collection) {
		var group = new Group(),
			i,
			L = collection.length;
		for (i = 0; i < L; i += 1) {
			group.add(collection[i]);
		}
		return group;
	};
	LoopIterator.from = function (coll) {
		return new LoopIterator(Group.from(coll));
	};
	LoopIterator.page_iterator = null;
	LoopIterator.cross_page_iterator = null;
	LoopIterator.prototype = {
		forward: function (flag) {
			if (!flag && this.rev) {
				return this.back(true);
			}
			this.position++;
			this.position = this.position % this.group.members.length;
			var result = {
				value: this.group.members[this.position],
				index: this.position
			};
			return result;
		},
		back: function (flag) {
			if (!this.rev || flag) {
				this.group.members = this.group.members.reverse();
				this.position = this.group.members.length - 1 - (this.position);
				this.position = this.position % this.group.members.length;
				this.rev = !this.rev;
				return this.forward(this.rev);
			} else {
				return this.forward(this.rev);
			}
		},
		play: function () {
			return this.forward(true).value;
		},
		current: function () {
			var result = {
				value: this.group.members[this.position],
				index: this.position
			};
			return result;
		},
		find: function (tgt) {
			return this.set(this.group.members.findIndex(ptL(equals, tgt)));
		},
		set: function (pos) {
			this.position = pos;
			var result = {
				value: this.group.members[this.position],
				index: this.position
			};
			return result;
		},
		get: function () {
			return this.current().value;
		}
	};

	function addElements() {
		return _.compose(twice(invoke)('img'), anCr, twice(invoke)('a'), anCr, anCr(thumbs))('li');
	}

	function onImage(img, path, promise) {
		img.addEventListener('load', function (e) {
			return promise.then(e.target);
		});
		img.src = path;
	}
	//base and pause 
	function onSlide(img, path, promise) {
		promise.then(getLI(img));
		img.src = path;
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

	function doOpacity(flag) {
		var slide = $('slide'),
			val;
		if (slide) {
			val = flag ? 1 : recur.i / 100;
			doMap(slide, [
				[
					['opacity', val]
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
		return onImage(img, doParse(img.parentNode.href), new FauxPromise(_.rest(arguments, 2)));
	}

	function doMakeSlide(source, target) {
		var img = addElements();
		doMap(img.parentNode, [
			['href', doParse(getBaseSrc())]
		]);
		doMap(img.parentNode.parentNode, [
			['id', target]
		]);
		return onSlide(img, doParse(img.parentNode.href), new FauxPromise(_.rest(arguments, 2)));
	}

	function doMakePause(path) {
		var img = addElements();
		doMap(img.parentNode.parentNode, [
			['id', 'paused']
		]);
		doMap(img.parentNode.parentNode, [
			[
				["opacity", 0.5]
			]
		]);
		return onImage(img, path, new FauxPromise(_.rest(arguments)));
	}

	function spliceOrientation(bool, coll) {
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
		con = window.console.log.bind(window),
		ptL = _.partial,
		curryFactory = utils.curryFactory,
		once = doOnce(),
		defer_once = curryFactory(1, true),
		twice = curryFactory(2),
		twicedefer = curryFactory(2, true),
		thrice = curryFactory(3),
		thricedefer = curryFactory(3, true),
		defercall = thricedefer(mycaller),
		parser = thrice(callerBridge)('match')(/images\/[^\/]+\.(jpg|png)$/),
		doParse = _.compose(twice(utils.getter)(0), parser),
		divideBy = twice(divide),
		greaterOrEqual = ptL(invoke, greater),
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
		main = document.getElementsByTagName('main')[0],
		thumbs = utils.getByClass('gallery')[0],
		$ = thrice(mycaller)('getElementById')(document),
		$$ = thricedefer(mycaller)('getElementById')(document),
		unsetPortrait = ptL(klasRem, 'portrait', thumbs),
		setPortrait = ptL(klasAdd, 'portrait', thumbs),
		target = twice(utils.getter)('target'),
		text_target = twice(utils.getter)('id'),
		node_target = twice(utils.getter)('nodeName'),
		text_from_target = thrice(nested)(target)(text_target),
		node_from_target = thrice(nested)(target)(node_target),
		getNodeName = utils.drillDown(['nodeName']),
		getID = utils.drillDown(['id']),
		getLength = utils.drillDown(['length']),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		getHeight = utils.curryFactory(2)(utils.getter)('offsetHeight'),
		getWidth = utils.curryFactory(2)(utils.getter)('offsetWidth'),
		doCompare = utils.curryFactory(4)(goCompare)(greater)(getWidth)(getHeight),
		getLI = utils.getDomParent(utils.getNodeByTag('li')),
		getLink = utils.getDomChild(utils.getNodeByTag('a')),
		getDomTargetImg = utils.getDomChild(utils.getNodeByTag('img')),
		doClass = _.compose(utils.curryFactory(2)(onTruth)(['addClass', 'removeClass']), doCompare),
		sortClass = function (klas, el, m) {
			utils[m](klas, el);
		},
		getTarget = utils.drillDown([mytarget]),
		allpics = utils.getByTag('img', main),
		getSlideChild = _.compose(utils.getChild, utils.getChild, $$('slide')),
		getBaseChild = _.compose(utils.getChild, utils.getChild, $$('base')),
		getBaseSrc = _.compose(utils.drillDown(['src']), getBaseChild),
		getSlideSrc = _.compose(utils.drillDown(['src']), getSlideChild),
		makeToolTip = function (flag) {
			var tooltip = poloAF.Tooltip(thumbs, ["move mouse in and out of footer...", "...to toggle the display of control buttons"], !touchevents ? 2 : 0, flag);
			tooltip.init();
		},
		getValue = function (v, p) {
			return LoopIterator.page_iterator[p]()[v];
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
				utils.getBest(ptL(gtEq, getResult(img).clientHeight, getResult(img).clientWidth), [p, l])();
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
			return getLength(coll) !== 14;
		})),
		//awaits an img element, maps functions that are invoked with the incoming element argument
		doPortrait = _.compose(ptL(invoke, sortClass), ptL(_.map, [always('portrait'), getLI, doClass]), utils.curryFactory(2)(invoke)),
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
			LoopIterator.cross_page_iterator = LoopIterator.from(pages.getAll());
		},
		populate = _.compose(doPopulate, ptL(negator, _.compose(ptL(klasTog, 'alt', thumbs), _.bind($LI.exec, $LI)))),
		advanceRouteBridge = function (e) {
			if (!getNodeName(getTarget(e)).match(/a/i)) {
				return;
			}
			if (utils.findByClass('inplay')) {
				return 'current';
			}
			return getID(getTarget(e)).match(/back$/) ? 'back' : 'forward';
		},
		advanceRoute = function (m) {
			if (!LoopIterator.cross_page_iterator) {
				cross_page_iterator();
			}
			return m && populate(LoopIterator.cross_page_iterator[m]());
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
				getPortraitPics = ptL(spliceOrientation, true),
				getLscpPics = ptL(spliceOrientation, false),
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
			LoopIterator.page_iterator = LoopIterator.from(_.map(group, makePath));
		},
		get_play_iterator = function (flag) {
			var myint = pages.findInt(getBaseSrc),
				page_index = pages.findIndex(getBaseSrc),
				page,
				gallery_pics;
			if (flag) {
				prepareSlideshow(myint, page_index);
			} else {
				LoopIterator.cross_page_iterator = LoopIterator.cross_page_iterator || LoopIterator.from(pages.getAll());
				LoopIterator.cross_page_iterator.set(page_index);
				page = LoopIterator.cross_page_iterator.get();
				$LI.query(page);
				gallery_pics = _.filter(allpics, function (img) {
					return !getLI(img).id;
				});
				_.each(gallery_pics, function (img, i) {
					populatePage(img, page[i]);
				});
				LoopIterator.page_iterator = LoopIterator.from(_.map(gallery_pics, function (img) {
					return img.src;
				}));
				LoopIterator.page_iterator.find(getBaseSrc());
			}
		},
		loadImage = function (getnexturl, id) {
			return new Promise(function (resolve, reject) {
				var img = getDomTargetImg($(id));
				if (img) {
					img.addEventListener('load', function (e) {
						resolve(img);
					});
					img.addEventListener('error', function () {
						reject(new Error("Failed to load image's URL:" + url()));
					});
					//only run url once, otherwise advances
					img.src = doParse(getnexturl());
					img.parentNode.href = doParse(img.src);
				}
			});
		},
		loader = function (caller, id) {
			return loadImage(caller, id).catch(function (e) {
				console.error(e);
			});
		},
		locator = function (forward, back) {
			var getLoc = (function (div, subtract, isGreaterEq) {
				var getThreshold = _.compose(div, subtract);
				return function (e) {
					var box = e.target.getBoundingClientRect();
					return e.clientX - box.left > (box.right - box.left) / 2;
				};
			}(divideBy(2), subtract, greaterOrEqual));
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
			LoopIterator.page_iterator = LoopIterator.from(_.map(allpics, function (img) {
				return img.src;
			}));
		},
		setindex = function (arg) {
			if (!LoopIterator.page_iterator) {
				do_page_iterator();
			}
			return LoopIterator.page_iterator.find(arg);
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

			function paint(str) {
				var coll = test(),
					bool = coll[0] === coll[1],
					body = utils.getClassList(utils.getBody()),
					m = bool ? 'remove' : 'add';
				body[m]('swap');
				return !bool;
			}

			function doBase() {
				loader(_.bind(LoopIterator.page_iterator.play, LoopIterator.page_iterator), 'base').then(paint).then(setPlayer);
			}

			function doFormat(img) {
				return utils.getBest(ptL(gtEq, img.width, img.height), [l, p])();
			}

			function doSlide() {
				loader(_.compose(utils.drillDown(['src']), utils.getChild, utils.getChild, $$('base')), 'slide').then(doFormat);
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
		factory = function () {
			var remPause = _.compose(utils.removeNodeOnComplete, $$('paused')),
				remSlide = _.compose(utils.removeNodeOnComplete, $$('slide')),
				doSlide = defer_once(doAlt)([clear, recur]),
				doPlaying = defer_once(doAlt)([notplaying, playing]),
				doDisplay = defer_once(doAlt)([playtime]),
				go_render = thrice(callerBridge)('render')(null),
				unlocate = thricedefer(callerBridge)('unrender')(null)(locate),
				unpauser = function () {
					var path = utils.hasClass('portrait', thumbs) ? pausepath + 'pauseLong.png' : pausepath + 'pause.png';
					//because we're adding invoke_player to the slide LI, pause LI, it's immediate sibling, will prevent the click reaching it
					//so we again invoke_player here too, the listener is deleted along with the LI
					doMakePause(path, go_render, do_invoke_player);
				},
				doPause = defer_once(doAlt)([ptL(utils.doWhen, $$('slide'), unpauser), remPause]),
				invoke_player = defercall('forEach')([doSlide, doDisplay, doPause, doPlaying])(getResult),
				do_invoke_player = ptL(eventing, 'click', null, invoke_player),
				setOrient = ptL(doOrient(unsetPortrait, setPortrait), $$('base')),
				relocate = ptL(mycaller, null, locate, 'render'),
				doReLocate = ptL(utils.doWhen, $$('base'), relocate),
				farewell = [notplaying, exitplay, exitswap, doReLocate, setOrient, defercall('forEach')([remPause, remSlide])(getResult)],
				next_driver = defercall('forEach')([get_play_iterator, defer_once(clear)(true), twicedefer(loader)('base')(nextcaller)].concat(farewell))(getResult),
				prev_driver = defercall('forEach')([get_play_iterator, defer_once(clear)(true), twicedefer(loader)('base')(prevcaller)].concat(farewell))(getResult),
				pauser = ptL(utils.invokeWhen, _.negate(ptL($, 'slide')), ptL(doMakeSlide, 'base', 'slide', unlocate, go_render, do_invoke_player)),
				COR = function (predicate, action) {
					return {
						setSuccessor: function (s) {
							this.successor = s;
						},
						handle: function (str) {
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
				listen,
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
		setup = eventing('click', null, function (e) {
			if (!node_from_target(e).match(/img/i)) {
				return;
			}
			_.compose(setindex, utils.drillDown(['target', 'src']))(e);
			_.compose(thrice(doMapBridge)('class')('static'), thrice(doMapBridge)('id')('controls'), anCr(main))('section');
			//machBase(e.target, 'base').then(showtime).then(doOrient(unsetPortrait,setPortrait));
			doMakeBase(e.target.src, 'base', showtime, doOrient(unsetPortrait, setPortrait));
			var buttons_cb = function (str) {
					var el = anCr($('controls'))('button');
					el.id = str;
					return el;
				},
				close_cb = function () {
					return _.compose(thrice(doMapBridge)('href')('.'), thrice(doMapBridge)('id')('exit'), anCrIn(thumbs, main))('a');
				},
				buttons = ['backbutton', 'playbutton', 'forwardbutton'].map(buttons_cb),
				dostatic = ptL(klasAdd, 'static', $$('controls')),
				chain = factory(),
				controls = eventing('click', null, function (e) {
					var str = text_from_target(e),
						node = node_from_target(e);
					if (node.match(/button/i)) {
						//!!REPLACE the original chain reference, validate will return either the original or brand new instance
						chain = chain.validate(str);
						chain.handle(str);
					}
				}, $('controls')),
				controls_undostat = eventing('mouseover', null, undostatic, utils.getByTag('footer', document)[0]),
				controls_dostat = eventing('mouseover', null, dostatic, $('controls')),
				exit = eventing('click', ['stopPropagation'], function (e) {
					chain = chain.validate('play');
					_.each([$('exit'), $('tooltip'), $('controls'), $('paused'), $('base'), $('slide')], utils.removeNodeOnComplete);
					exitshow();
					locate.unrender();
					setup.render();
				}, close_cb);
			//listeners...
			[controls, exit, locate, controls_undostat, controls_dostat].forEach(function (o) {
				o.render();
			});
			setup.unrender();
		}, thumbs);
	setup.render();
	addPageNav(anCr, 'gal_forward', function () {
		return dummy;
	});
	$nav.render();
	_.each(allpics, fixNoNthChild);
	utils.$('placeholder').innerHTML = 'PHOTOS';
	//con(new FauxPromise([twice(divide)(2), _.partial(subtract, 10)]).then(4));
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