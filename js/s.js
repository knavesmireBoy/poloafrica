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

	function always(val) {
		return function () {
			return val;
		};
	}

	function noOp() {
		return function () {};
	}

	function existy(x) {
		return x != null;
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function modulo(n, i) {
		return i % n;
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

	function caller(o, v, p) {
		return o[p] && o[p](v);
	}

	function callerBridge(v, o, p) {
		return caller(o, v, p);
	}

	function setter(v, o, p) {
		o[p] = v;
	}

	function nested(e, s, g) {
		return s(g(e));
	}
	function getFileNumber(src) {
		var t = src.split('/');
		return Number(t[t.length - 1].split('.')[0].substr(1));
	}

	function attrMap(el, map, style) {
		var k,
			v,
			cb = function (prop) {
				return attrMap(el, prop, true);
			};
		for ([k, v] of map) {
			if (Array.isArray(v)) {
				_.forEach(v, cb);
				break;
			}
			if (k.match(/^te?xt$/)) {
				el.innerHTML = v;
				continue;
			}
			if (!style) {
				el.setAttribute(k, v);
			} else {
				el.style.setProperty(k, v);
			}
		}
		return el;
	}
	/* EXPECTS VALUE BEFORE KEY ON RIGHT CURRY*/
	function doMap(el, v, k) {
		//con(el,v,k);
		var arg = v instanceof Map ? v : new Map([
			[k, v]
		]);
		//con(arg);
		return attrMap(getResult(el), arg);
	}

	function FauxMap(k, v){
		return {
			k: v
		}
	}

	function doFauxMap(el, v, k){
		var arg = v instanceof FauxMap ? v : new FauxMap(k, v);
	}

	function shuffle(coll, flag) {
		return function (start, deleteCount) {
			deleteCount = isNaN(deleteCount) ? coll.length - 1 : deleteCount;
			start = isNaN(start) ? 0 : start;
			var res = coll.splice(start, deleteCount);
			return flag ? res.concat(coll) : coll.concat(res);
		};
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

	function lazyVal(v, el, k) {
		return invokeArgs(doMap, el, v, k);
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
		return _.partial(f, el);
	}

	function cat(first) {
		if (existy(first)) {
			return _.flatten(first.concat.apply(first, _.rest(arguments)));
		} else {
			return [];
		}
	}

	function construct(head) {
		return head && cat([head], _.rest(arguments));
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
			this.members = _.filter(this.members, _.negate(_.partial(equals, value)));
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
		find: function (tgt) {
			this.position = this.group.members.findIndex(_.partial(equals, tgt));
			var result = {
				value: this.group.members[this.position],
				index: this.position
			};
			return result;
		}
	};

	function searcher(obj, ary) {
		/*noticed an issue with parentNode where on supply of an element, the initial value for reduce is the parent
		but THAT parent would get set on the second iteration to ITS parent so. When array has just one item reduce not really required*/
		if (ary && ary[1]) {
			return ary.reduce(function (acc, cur) {
				return acc[cur] || acc;
			}, obj[ary[0]]);
		}
		return ary[0] ? obj[ary[0]] : obj;
	}

	function machBase(source, target) {
		return new Promise(function (resolve, reject) {
			var li = anCr(thumbs)('li'),
				a = anCr(li)('a'),
				img = anCr(a)('img'),
				partial = _.partial(doMap, a),
				coll = [
					['href', doParse(source.src)]
				];
			_.forEach(coll, function (arr) {
				return partial(arr[1], arr[0]);
			});
			coll = [
				['id', target]
			];
			partial = _.partial(doMap, li);
			_.forEach(coll, function (arr) {
				return partial(arr[1], arr[0]);
			});
			img.addEventListener('load', function (e) {
				resolve(img);
			});
			img.src = doParse(a.href);
		});
	}

	function machSlide(source, target) {
		return new Promise(function (resolve, reject) {
			var li = anCr(thumbs)('li'),
				a = anCr(li)('a'),
				img = anCr(a)('img'),
				partial = _.partial(doMap, a),
				coll = [
					['href', doParse(getBaseSrc())]
				];
			_.forEach(coll, function (arr) {
				return partial(arr[1], arr[0]);
			});
			coll = [
				['id', target]
			];
			partial = _.partial(doMap, li);
			_.forEach(coll, function (arr) {
				return partial(arr[1], arr[0]);
			});
			img.addEventListener('load', function (e) {
				resolve(img);
			});
			img.src = doParse(a.href);
		});
	}

	function machPause(src) {
		return new Promise(function (resolve, reject) {
			var li = anCr(thumbs)('li'),
				a = anCr(li)('a'),
				img = anCr(a)('img'),
				partial = _.partial(doMap, li),
				styleAttrs = new Map([
					["opacity", 0.5]
				]),
				coll = [
					['id', 'paused'],
					['style', [styleAttrs]]
				];
			_.forEach(coll, function (arr) {
				return partial(arr[1], arr[0]);
			});
			img.addEventListener('load', function (e) {
				resolve(img);
			});
			img.src = src;
			img.id = "pauser";
		});
	}

	function doOpacity(flag) {
		var style,
			slide = $('slide'),
			val;
		if (slide) {
			val = flag ? 1 : recur.i / 100;
			style = new Map([
				['opacity', val]
			]);
			doMap(slide, new Map([
				['style', [style]]
			]));
		}
	}
	var een = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14],
		twee = _.range(15, 29),
		drie = _.range(29, 43),
		vier = _.range(43, 55),
		vyf = _.range(55, 67),
		ses = _.range(67, 79),
		sewe = _.range(79, 93),
		all = [een, twee, drie, vier, vyf, ses, sewe],
		allow = !touchevents ? 2 : 0,
		utils = poloAF.Util,
		con = window.console.log.bind(window),
		/*reporter = function (msg, el) {
			el = el || utils.getByTag('h2', document)[0];
			msg = undef(msg) ? document.documentElement.className : msg;
			el.innerHTML = msg;
		},
        */

		ptL = _.partial,
		curryFactory = utils.curryFactory,
		once = doOnce(),
		defer_once = curryFactory(1, true),
		twice = curryFactory(2),
		twicedefer = curryFactory(2, true),
		thrice = curryFactory(3),
		thricedefer = curryFactory(3, true),
		quart = curryFactory(4),
		//driller = twice(utils.drillDown),
		driller = twice(searcher),
		zero = twice(utils.getter)(0),
		mysetter = thrice(setter),
		defercall = thricedefer(callerBridge),
		//parser = thrice(caller)('match')(/[^\/]+\.(jpg|png)$/),
		parser = thrice(caller)('match')(/images\/[^\/]+\.(jpg|png)$/),
		doParse = _.compose(zero, parser),
		divideBy = twice(divide),
		greaterOrEqual = ptL(invoke, greater),
		gtEq = ptL(greater),
		doAlt = function (actions) {
			return actions.reverse()[0]();
		},
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		klasTog = utils.toggleClass,
		main = document.getElementsByTagName('main')[0],
		thumbs = utils.getByClass('gallery')[0],
		list_elements = _.toArray(thumbs.getElementsByTagName('li')),
		$ = thrice(callerBridge)('getElementById')(document),
		$q = thrice(callerBridge)('querySelector')(document),
		$$ = thricedefer(callerBridge)('getElementById')(document),
		lcsp = _.partial(klasRem, 'portrait', thumbs),
		ptrt = _.partial(klasAdd, 'portrait', thumbs),
		target = twice(utils.getter)('target'),
		text_target = twice(utils.getter)('id'),
		node_target = twice(utils.getter)('nodeName'),
		text_from_target = thrice(nested)(target)(text_target),
		node_from_target = thrice(nested)(target)(node_target),
		anCr = utils.append(),
		anCrIn = utils.insert(),
		setAttrs = utils.setAttributes,
		getNodeName = utils.drillDown(['nodeName']),
		getID = utils.drillDown(['id']),
		getLength = utils.drillDown(['length']),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		doVier = utils.curryFactory(4),
		getHeight = utils.curryFactory(2)(utils.getter)('offsetHeight'),
		getWidth = utils.curryFactory(2)(utils.getter)('offsetWidth'),
		doCompare = utils.curryFactory(4)(goCompare)(greater)(getWidth)(getHeight),
		getLI = utils.getDomParent(utils.getNodeByTag('li')),
		getLink = utils.getDomChild(utils.getNodeByTag('a')),
		getDomTargetImg = utils.getDomChild(utils.getNodeByTag('img')),
		get_src = _.compose(utils.drillDown(['src']), getDomTargetImg),
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
		buttons_cb = function (str) {
			var el = anCr($('controls'))('button');
			el.id = str;
			//_.forEach(coll, f);
			return el;
		},
		close_cb = function (ancr) {
			return ancr;
			//return compose(thrice(doMap)('class')('contain'), thrice(doMap)('src')('poppy.png'), anCr(ancr))('img');
		},
		close_aside = function () {
			return _.compose(thrice(doMap)('href')('.'), thrice(doMap)('id')('exit'), anCrIn(thumbs, main))('a');
		},
		makeToolTip = function(flag){
			var tooltip = poloAF.Tooltip(thumbs, ["move mouse in and out of footer...", "...to toggle the display of control buttons"], allow, flag);
			tooltip.init();
		},
		mypics = new LoopIterator(Group.from(_.map(allpics, function (img) {
			return img.src;
		}))),
		//setindex = thrice(callerBridge)('find')(mypics),
		setindex = function (arg) {
			return mypics.find(arg);
		},
		getValue = function (v, o, p) {
			return o[p]()[v];
		},
		nextcaller = thricedefer(getValue)('forward')(mypics)('value'),
		prevcaller = thricedefer(getValue)('back')(mypics)('value'),
		showtime = _.compose(ptL(klasRem, ['gallery'], thumbs), ptL(klasAdd, ['showtime'], utils.getBody())),
		playtime = ptL(klasAdd, 'inplay', $('wrap')),
		playing = _.compose(ptL(utils.doWhen, once(2), ptL(makeToolTip, true)), ptL(klasAdd, 'playing', $$('controls'))),
		notplaying = ptL(klasRem, 'playing', $$('controls')),
		exitshow = _.compose(ptL(klasAdd, 'gallery', thumbs), _.partial(klasRem, 'showtime', utils.getBody())),
		exitswap = ptL(klasRem, 'swap', utils.getBody()),
		exitplay = ptL(klasRem, 'inplay', $('wrap')),
		undostatic = ptL(klasRem, 'static', $$('controls')),
		observers = [thrice(lazyVal)('href')($$('base'))],
		publish = defercall('forEach')(observers)(function (ptl, i) {
			return ptl(getBaseSrc());
		}),
		orient = function (l, p) {
			return function (img) {
				utils.getBest(_.partial(gtEq, getResult(img).clientHeight, getResult(img).clientWidth), [p, l])();
				return img.src;
			};
		},
		negator = (function (neg) {
			return function (cb, a, b) {
				if (neg(a, b)) {
					cb();
					neg = _.negate(neg);
				}
				return b;
			};
		}(function (a, b) {
			return getLength(b.value) !== 14;
		})),
		//awaits an img element, maps functions that are invoked with the incoming element argument
		doPortrait = _.compose(ptL(invoke, sortClass), ptL(_.map, [always('portrait'), getLI, doClass]), utils.curryFactory(2)(invoke)),
		fixNoNthChild = _.compose(ptL(utils.doWhen, _.negate(utils.always(Modernizr.nthchild))), ptL(partial, doPortrait)),
		//fixNoNthChild = _.compose(ptL(utils.doWhen, utils.always(Modernizr.nthchild)), ptL(partial, doPortrait)),
		doPopulate = function (pagepics) {
			_.each(allpics, function (img, i) {
				var path = pagepics.value[i];
				img.src = makePath(path);
				//adds portrait class on browsers that don't support nth-child
				img.onload = function (e) {
					fixNoNthChild(e.target);
				};
			});
		},
		$LI = (function (options) {
			return {
				exec: function () { //cb
					var action = options[0];
					_.each(_.last(thumbs.getElementsByTagName('li'), 2), this[action]);
					options = options.reverse();
				},
				unrender: function (el) {
					var $el = utils.machElement(always(el)).render();
					$el.unrender();
				},
				render: function (el) {
					return utils.machElement(anCr(thumbs), always(el)).render();
				}
			};
		}(['unrender', 'render'])),

		makeCrossPageIterator = function (coll) {
			return new LoopIterator(Group.from(coll));
		},
		cross_page_iterator = makeCrossPageIterator(all),

				doSplice = function (bool, coll) {
					if (coll[13]) {
						var copy = coll.slice(0),
							res = copy.splice(4, 6);
						return bool ? res : copy;
					}
					return bool ? [] : coll;
				},
				getPortraitPics = ptL(doSplice, true),
				getLscpPics = ptL(doSplice, false),

				mixer = function (predicate, leader, trailer) {
					var active = _.every([leader, trailer], function (arr) {
						return arr[0];
					});
					if (active) {
						return leader.concat(trailer);
					}
					return leader[0] ? leader : trailer;
				},
				mixerBridge = function (pred, zipped) {
					return mixer.apply(null, [pred, zipped[0], zipped[1]]);
				},
				performSwap = function (inbound, outbound, enter, exit) {
					return function (path) {
						var action = utils.getBest(function (agg) {
							return agg[0]();
						}, _.zip([ptL(utils.isEqual, enter, path), ptL(utils.isEqual, exit, path), utils.always(true)], [ptL(_.map, [thumbs, $('wrap')], ptL(inbound, 'portrait')), ptL(_.map, [thumbs, $('wrap')], ptL(outbound, 'portrait')), noOp]));
						return action[1]();
					};
				},

				getLeadingGroup = function (i, portrait, landscape) {
					var filtered = _.filter(portrait, twice(_.find)(ptL(equals, i))),
						leader = filtered[0] ? portrait : landscape,
						trailer = filtered[0] ? landscape : portrait;
					return [leader, trailer];
				},
				getSubGroup = function (j) {
					var ret = {};
					return _.reduce(all, function (cur, next) {
						var i = _.findIndex(next, function (n) {
							return Number(n) === Number(j);
						});
						if (!failed(i)) {
							cur = next;
							ret.page = cur;
							ret.index = i;
						}
						return ret;
					}, all[0]);
				},


				getSubGallery = function (i) {
					//con(_.zip(ptrt, lscp))
					var sub = _.findIndex(_.map(all, twice(_.filter)(ptL(equals, i))), _.negate(_.isEmpty)),
						reordered = shuffle(all.slice(0), true)(sub),
						lscp = _.map(reordered, getLscpPics),
						ptrt = _.map(reordered, getPortraitPics),
						filtered = _.filter(ptrt, twice(_.find)(ptL(equals, i))),
						group = getLeadingGroup(i, ptrt, lscp),
						//start = twice(_.findIndex)(thrice(utils.gtThan)(true)(0))(_.map(group[0], twice(_.findIndex)(ptL(equals, i)))),
						leader = group[0].slice(0),
						tmp = leader[0],
					start = _.findIndex(tmp, ptL(equals, i));

					leader[0] = tmp.splice(start).concat(tmp);
					if (Modernizr.touchevents) {
						tmp = mixer(utils.always(filtered[0]), _.flatten(leader), _.flatten(group[1])); //orientation
					} else {
						tmp = _.map(_.zip(leader, group[1]), ptL(mixerBridge, utils.always(filtered[0]))); //page
					}
					tmp = _.flatten(tmp).map(makePath);
					return makeCrossPageIterator(tmp);
				},

				get_play_iterator = function () {
					var myint = Number(getBaseSrc().match(picnum)[1]);
					return getSubGallery(myint);
				},

				goodbye = function(){
					var findCurrent = function (f, li) {
						var src = get_src(getResult(f));
						return !li.id && get_src(li).match(src);
					},
					matchFromBase = ptL(_.filter, thumbs.getElementsByTagName('li'), ptL(findCurrent, ptL($, 'slide')));
					con(matchFromBase());
				},

/*
				prepareNavHandlers = function () {
					var getNextAction = function (m) {
							var src,
								subgroup,
								findCurrent = function (f, li) {
									src = get_src(getResult(f));
									return !li.id && get_src(li).match(src);
								},
								matchFromBase = ptL(_.filter, list_elements, ptL(findCurrent, ptL($, 'base'))),
								fallback = function myfallback(result) {
									if (!_.isEmpty(result)) {
										return result[0];
									} else {
										poloAF.Eventing.triggerEvent(main, 'click');
										window.setTimeout(function () {
											var res,
												map = _.map(thumbs.getElementsByTagName('img'), function (img) {
													return getFileNumber(img.src);
												});
											res = _.contains(map, getFileNumber(src));
											if (!res) {
												//get on the right page
												return myfallback([]);
											}
										}, 333);
										subgroup = getSubGroup(getFileNumber(src));
										return list_elements[subgroup.index];
									}
								};
							return _.compose(utils.show, utils[m], fallback, matchFromBase);
						},

	*/


		populate = _.compose(doPopulate, ptL(negator, _.compose(ptL(klasTog, 'alt', thumbs), _.bind($LI.exec, $LI)), allpics)),
		advanceRouteBridge = function (e) {
			if (!getNodeName(getTarget(e)).match(/a/i)) {
				return;
			}
			return getID(getTarget(e)).match(/back$/) ? 'back' : 'forward';
		},
		advanceRoute = function (m) {
			return m && populate(cross_page_iterator[m]());
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
		loadImage = function (url, id) {
			return new Promise(function (resolve, reject) {
				var img = utils.getDomChild(utils.getNodeByTag('img'))(document.getElementById(id));
				//img = removeElement(img);
				//$(id).appendChild(img);
				if (img) {
					img.addEventListener('load', function (e) {
						resolve(img);
					});
					img.addEventListener('error', function () {
						reject(new Error("Failed to load image's URL:" + url()));
					});
					img.src = doParse(url());
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
					var box = e.target.getBoundingClientRect(),
						res = isGreaterEq(ptL(subtract, e.clientX, box.left), ptL(getThreshold, box.right, box.left));
					return e.clientX - box.left > (box.right - box.left) / 2;
					//return res;
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
		locate = eventing('click', ['preventDefault', 'stopPropagation'], function (e) {
			locator(twicedefer(loader)('base')(nextcaller), twicedefer(loader)('base')(prevcaller))(e)[1]();
			orient(lcsp, ptrt)(e.target);
			publish();
		}, thumbs),
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
				loader(mypics.play.bind(mypics), 'base').then(paint).then(setPlayer);
			}

			function doFormat(img) {
				return utils.getBest(ptL(gtEq, img.width, img.height), [l, p])();
			}

			function doSlide() {
				loader(_.compose(driller(['src']), utils.getChild, utils.getChild, $$('base')), 'slide').then(doFormat);
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
				if (player.validate()) {
					player.reset();
				} else {
					doOpacity();
					doRecur();
				}
			};
		}(lcsp, ptrt)),
		clear = function (flag) {
			doOpacity(flag);
			window.cancelAnimationFrame(recur.t);
			recur.t = null;
		},
		factory = function () {
			var removePause = _.compose(utils.removeNodeOnComplete, $$('paused')),
				removeSlide = _.compose(utils.removeNodeOnComplete, $$('slide')),
				removal = defercall('forEach')([removePause, removeSlide])(getResult),
				doSlide = defer_once(doAlt)([clear, recur]),
				doPlaying = defer_once(doAlt)([notplaying, playing]),
				doDisplay = defer_once(doAlt)([playtime]),
				unpauser = function () {
					var path = utils.hasClass('portrait', thumbs) ? pausepath + 'pauseLong.png' : pausepath + 'pause.png';
					//notplaying();
					machPause(path).then(function (el) {
						eventing('click', null, invoke_player, el).render();
					});
				},
				doPause = defer_once(doAlt)([_.partial(utils.doWhen, $$('slide'), unpauser), removePause]),
				invoke_player = defercall('forEach')([doSlide, doDisplay, doPause, doPlaying])(getResult),
				setOrient = _.partial(orient(lcsp, ptrt), $$('base')),
				relocate = _.partial(callerBridge, null, locate, 'render'),
				doReLocate = _.partial(utils.doWhen, $$('slide'), relocate),
				farewell = [notplaying, exitplay, exitswap, doReLocate, setOrient, publish, removal],
				next_driver = defercall('forEach')([defer_once(clear)(true), twicedefer(loader)('base')(nextcaller)].concat(farewell))(getResult),
				prev_driver = defercall('forEach')([defer_once(clear)(true), twicedefer(loader)('base')(prevcaller)].concat(farewell))(getResult),
				pauser = function () {
					if (!$('slide')) {
						machSlide('base', 'slide').then(function (el) {
							eventing('click', null, invoke_player, el).render();
							locate.unrender();
						}).catch(function (arg) {
							//con(arg);
						});
					}
				},
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
							if (document.querySelector('.inplay') && recur.t && predicate(str)) {
								//return fresh instance on exiting slideshow IF in play mode
								return factory();
							}
							return this;
						}
					};
				},
				mynext = COR(_.partial(invokeArgs, equals, 'forwardbutton'), next_driver),
				myprev = COR(_.partial(invokeArgs, equals, 'backbutton'), prev_driver),
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
			recur.i = 50; //slide is clone of base initially, so fade can start
			return mynext;
		}, //factory
		setup = eventing('click', null, function (e) {
			if (!node_from_target(e).match(/img/i)) {
				return;
			}
			_.compose(setindex, driller(['target', 'src']))(e);
			_.compose(thrice(doMap)('class')('static'), thrice(doMap)('id')('controls'), anCr(main))('section');
			machBase(e.target, 'base').then(showtime).then(orient(lcsp, ptrt));
			mypics = get_play_iterator();
			var buttons = ['backbutton', 'playbutton', 'forwardbutton'].map(buttons_cb),
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
				controls_undostat = eventing('mouseover', null, undostatic, $q('footer')),
				controls_dostat = eventing('mouseover', null, dostatic, $('controls')),
				exit = eventing('click', null, function (e) {
					chain = chain.validate('forward');
					chain.handle('forward');
					exitshow();
					utils.getBody(true);
					_.each([$('exit'), $('tooltip'), $('controls'), $('paused'), $('base'), $('slide')], utils.removeNodeOnComplete);
					locate.unrender();
					setup.render();
				}, _.compose(close_cb, close_aside));
			//listeners...
			[controls, exit, locate, controls_undostat, controls_dostat].forEach(function (o) {
				o.render();
			});
			get_play_iterator();

			setup.unrender();
		}, thumbs);
	setup.render();
	addPageNav(anCr, 'gal_forward', function () {
		return dummy;
	});
	$nav.render();
	_.each(allpics, fixNoNthChild);
	utils.$('placeholder').innerHTML = 'PHOTOS';
}(Modernizr.mq('only all'), '(min-width: 668px)', Modernizr.touchevents, '../images/resource/', new RegExp('[^\\d]+\\d(\\d+)[^\\d]+$'), {
	render: function () {
		"use strict";
	},
	unrender: function () {
		"use strict";
	}
}, function (path) {
	"use strict";
	path = path.toString();
	var mypath = path.length < 3 ? "images/0" + path : "images/" + path;
	return mypath + ".jpg";
}));
