/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
(function (doc, visiblity, mq, query, cssanimations, touchevents, main, footer, q2, picnum, makePath, makePathWrap, getDefAlt) {
	"use strict";

	function modulo(n, i) {
		return i % n;
	}

	function shuffle(coll, flag) {
		return function (start, deleteCount) {
			deleteCount = isNaN(deleteCount) ? coll.length - 1 : deleteCount;
			start = isNaN(start) ? 0 : start;
			var res = coll.splice(start, deleteCount);
			return flag ? res.concat(coll) : coll.concat(res);
		};
	}

	function undef(x) {
		return typeof (x) === 'undefined';
	}

	function partial(f, el) {
		return _.partial(f, el);
	}

	function compare(f, a, b, o) {
		return f(o[a], o[b]);
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function noOp() {}

	function isPositive(x) {
		return (x >= 0) ? !undef(x) : undefined;
	}

	function lessOrEqual(i) {
		return function (x) {
			return (x <= i) ? x : undefined;
		};
	}

	function subtract(x, y) {
		return x - y;
	}

	function divideBy(n) {
		return function (i) {
			return i / n;
		};
	}

	function greaterOrEqual(a, b) {
		return getResult(a) >= getResult(b);
	}

	function setter(o, k, v) {
		o[k] = v;
	}

	function setterAdapter(k, o, v) {
		setter(o, k, v);
	}

	function invokemethod(o, arg, m) {
		//con(arguments);
		return o[m](arg);
	}

	function invoke(f, arg) {
		//con(arguments)
		return f(arg);
	}

	function thunk(f) {
		return f.apply(f, _.rest(arguments));
	}

	function always(val) {
		return function () {
			return val;
		};
	}

	function failed(i) {
		return i < 0;
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

	function isEqual(x, y) {
		return Number(x) === Number(y);
	}
	var utils = poloAF.Util,
		con = window.console.log.bind(window),
		reporter = function (msg, el) {
			el = el || utils.getByTag('h2', document)[0];
			msg = undef(msg) ? document.documentElement.className : msg;
			el.innerHTML = msg;
		},
		$ = function (str) {
			return document.getElementById(str);
		},
		ptL = _.partial,
		once = doOnce(),
		doTwice = utils.curryTwice(),
		doThrice = utils.curryThrice(),
		doQuart = utils.curryFourFold(),
		doVier = utils.curryFourFold(),
		doTwiceDefer = utils.curryTwice(true),
		doThriceDefer = utils.curryThrice(true),
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		drill = utils.drillDown,
		invokeWhen = utils.invokeWhen,
		cssopacity = poloAF.getOpacity().getKey(),
		anCr = utils.append(),
		anCrIn = utils.insert(),
		setAttrs = utils.setAttributes,
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		klasTog = utils.toggleClass,
		isDesktop = (function () {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return _.partial(utils.isDesktop, threshold);
			}
		}()),
		clicker = ptL(utils.addHandler, 'click'),
		makeElement = utils.machElement,
		doToggle = ptL(klasTog, 'alt', main),
		getControls = ptL($, 'controls'),
		getSlide = ptL($, 'slide'),
		getNodeName = utils.drillDown(['nodeName']),
		getID = utils.drillDown(['id']),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		getTarget = utils.drillDown([mytarget]),
		getLength = utils.drillDown(['length']),
		gallery = utils.getNextElement(main.firstChild),
		allpics = utils.getByTag('img', main),
		getOrientation = ptL(compare, utils.gtThan, 'offsetHeight', 'offsetWidth'),
		getDomTargetLink = utils.getDomChild(utils.getNodeByTag('a')),
		getDomTargetImg = utils.getDomChild(utils.getNodeByTag('img')),
		een = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14],
		twee = _.range(15, 29),
		drie = _.range(29, 43),
		vyf = _.range(43, 55),
		vier = _.range(55, 67),
		ses = _.range(67, 79),
		sewe = _.range(79, 93),
		all = [een, twee, drie, vier, vyf, ses, sewe],
		//thumbs = $('thumbnails'),
		thumbs = utils.getByClass('gallery')[0],
		lis = _.toArray(thumbs.getElementsByTagName('li')),
		getCurrentSlide = _.compose(utils.getZero, ptL(utils.getByClass, 'show', thumbs, 'li')),
		isPortrait = ptL(function (el) {
			var img = getDomTargetImg(el);
			return img.offsetHeight > img.offsetWidth;
			//return utils.getClassList(el).contains('portrait');
		}),
		doPortrait = function (el) {
			var m = getOrientation(el) ? 'addClass' : 'removeClass';
			utils[m]('portrait', utils.getDomParent(utils.getNodeByTag('li'))(el));
		},
		inPortraitMode = _.compose(utils.getZero, ptL(utils.getByClass, 'portrait')),
		getCurrentImage = _.compose(getDomTargetImg, getCurrentSlide),
		//singlePage = _.compose(utils.getZero, ptL(utils.getByTag, 'input', ptL($, 'gal_forward'))),
		//groupByOrientation = _.compose(utils.getZero, ptL(utils.getByTag, 'input', ptL($, 'gal_back'))),
		exitCurrentImage = function (img) {
			var math = getOrientation(img),
				m = math && isDesktop() ? 'addClass' : 'removeClass';
			m = math ? 'addClass' : 'removeClass';
			_.map([thumbs, $('wrap')], ptL(utils[m], 'portrait'));
			return img;
		},
		exitGallery = _.compose(exitCurrentImage, getCurrentImage),
		hideCurrent = _.compose(utils.hide, getCurrentSlide),
		//showCurrent = _.compose(utils.show, getCurrentSlide),
		doShow = function (next) {
			hideCurrent();
			utils.show(next);
			exitGallery();
		},
		makeIterator = function (coll) {
			var findIndex = ptL(utils.findIndex, coll),
				prepIterator = doQuart(poloAF.Iterator(false)),
				doIterator = prepIterator(ptL(modulo, coll.length))(always(true))(coll);
			return _.compose(doIterator, findIndex, doTwice(utils.isEqual), getCurrentSlide);
		},
		makeCrossPageIterator = function (coll) {
			var prepIterator = doVier(window.poloAF.Iterator(false));
			return prepIterator(ptL(modulo, coll.length))(utils.always(true))(coll)(0);
		},
		Element = poloAF.Intaface('Display', ['render', 'unrender']),
		makeLeafComp = function (obj) {
			return _.extend(poloAF.Composite(), obj);
		},
		adaptHandlers = function (subject, adapter, allpairs, override) {
			adapter = adapter || {};
			adapter = utils.simpleAdapter(allpairs, adapter, subject);
			adapter[override] = function () {
				subject.deleteListeners(subject);
			};
			return adapter;
		},
		handlerpair = ['addListener', 'deleteListeners'],
		renderpair = ['render', 'unrender'],
		adapterFactory = function () {
			//fresh instance of curried function per adapter
			return doQuart(adaptHandlers)('unrender')([renderpair, handlerpair.slice(0)])(poloAF.Composite());
		},
		myrevadapter = doQuart(adaptHandlers)('render')([renderpair, handlerpair.slice(0).reverse()])(poloAF.Composite()),
		neg = function (a, b) {
			return getLength(a) !== getLength(b);
		},
		negator = function (cb, a, b) {
			if (neg(a, b)) {
				cb();
				neg = _.negate(neg);
			}
		},
		fixNoNthChild = _.compose(ptL(utils.doWhen, _.negate(utils.always(Modernizr.nthchild))), ptL(partial, doPortrait)),
		doPortraitLoop = ptL(_.each, allpics, fixNoNthChild),
		doPortraitBridge = function (e) {
			fixNoNthChild(e.target);
		},
		toogleLoop = _.compose(doPortraitLoop, doToggle),
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
		//lscp = _.map(all, getLscpPics),
		//ptrt = _.map(all, getPortraitPics),
		mixer = function (predicate, leader, trailer) {
			/*'97' resolves to 097.jpg and is a signal to remove portrait class from the UL before loading the landscape pictures
			    the '98' signal undoes the original action.
			    '80' and '99' play the same roles in landscape to portrait BUT a blank portrait page '97', not a signal in this context, is required to prevent early exposure of the first portrait pic */
			var active = _.every([leader, trailer], function (arr) {
				return arr[0];
			});
			if (active) {
				//return predicate() ? leader.concat('97', '80', trailer, '98') : leader.concat('80', '97', trailer, '99');
				return predicate() ? leader.concat('97', '96', trailer, '98') : leader.concat('96', '97', trailer, '99');
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
			var filtered = _.filter(portrait, doTwice(_.find)(ptL(isEqual, i))),
				leader = filtered[0] ? portrait : landscape,
				trailer = filtered[0] ? landscape : portrait;
			return [leader, trailer];
		},
		getSubGroup = function (j) {
			var ret = {};
			return _.reduce(all, function (cur, next, k) {
				var i = _.findIndex(next, function (n) {
					return n == j;
				});
				if (i >= 0) {
					cur = next;
					ret.page = cur;
					ret.index = i;
					ret.group = k;
				}
				return ret;
			});
		},
		getSubGallery = function (i) {
			//con(_.zip(ptrt, lscp))
			var sub = _.findIndex(_.map(all, doTwice(_.filter)(ptL(isEqual, i))), _.negate(_.isEmpty)),
				reordered = shuffle(all.slice(0), true)(sub),
				lscp = _.map(reordered, getLscpPics),
				ptrt = _.map(reordered, getPortraitPics),
				filtered = _.filter(ptrt, doTwice(_.find)(ptL(isEqual, i))),
				group = getLeadingGroup(i, ptrt, lscp),
				start = doTwice(_.findIndex)(doThrice(utils.gtThan)(true)(0))(_.map(group[0], doTwice(_.findIndex)(ptL(isEqual, i)))),
				leader = group[0].slice(0),
				getDisplayRoute = function (gang, triggers) {
					var actions = utils.getBest(inPortraitMode, [gang, gang.slice(0).reverse()]),
						metriggers = utils.getBest(inPortraitMode, triggers);
					return actions.concat(metriggers);
				},
				action = performSwap.apply(null, getDisplayRoute([klasRem, klasAdd], [
					['97', '98'],
					['96', '99']
				])),
				tmp;
			makePathWrap = _.wrap(makePath, function (func, path) {
				action(path);
				return func(path);
			});
			tmp = leader[0];
			start = _.findIndex(tmp, ptL(isEqual, i));
			leader[0] = tmp.splice(start).concat(tmp);
			if (Modernizr.deviceorientation) {
				tmp = mixer(utils.always(filtered[0]), _.flatten(leader), _.flatten(group[1])); //orientation
			} else {
				tmp = _.map(_.zip(leader, group[1]), ptL(mixerBridge, utils.always(filtered[0]))); //page
			}
			return makeCrossPageIterator(_.flatten(tmp));
		},
		advance = function () {
			var iterator = makeCrossPageIterator(all),
				doNeg = ptL(negator, toogleLoop);
			return function (e) {
				var tgt = getTarget(e),
					allpics = utils.getByTag('img', main),
					path = '001',
					gang,
					m;
				if (!getNodeName(tgt).match(/a/i)) {
					return;
				}
				m = getID(tgt).match(/back$/) ? 'back' : 'forward';
				gang = iterator[m]();
				doNeg(allpics, gang);
				allpics = utils.getByTag('img', main);
				_.each(allpics, function (img, j) {
					path = gang[j] || path;
					img.src = makePath(path);
					img.onload = doPortraitBridge;
				});
			};
		},
		myadvance = advance(),
		doInsert = ptL(anCrIn, gallery),
		pageNavHandler = utils.addEvent(clicker, _.debounce(myadvance, 300)),
		addPageNavHandler = _.compose(pageNavHandler, utils.getDomParent(utils.getNodeByTag('main'))),
		pageInputHandler = function (arg) {
			utils.addEvent(clicker, noOp, 'stop')(arg);
			return arg;
		},
		addPageNav = function (myAnCr, title, id, cb) {
			return _.compose(cb, pageInputHandler, anCr(_.compose(ptL(klasAdd, 'pagenav'), ptL(setAttrs, {
				id: id,
				href: '.'
			}), myAnCr(main), utils.always('a'))))('span');
		},
		presenter = (function (inc) {
			return poloAF.Composite(inc);
		}([])),
		stage_one_rpt = (function (inc) {
			return poloAF.Composite(inc);
		}([])),
		stage_one_comp = (function (inc) {
			var comp = poloAF.Composite(inc, Element),
				anCrIn = utils.insert(),
				getDomTargetList = utils.getDomParent(utils.getNodeByTag('li')),
				//all arguments must be functions...hence always
				$thumbs = makeElement(_.debounce(exitGallery, 300), ptL(klasRem, 'gallery'), always(thumbs)),
				$body = makeElement(ptL(klasAdd, 'showtime'), always(utils.getBody)),
				$wrap = makeElement(always($('wrap'))),
				$show = makeElement(ptL(utils.show), getDomTargetList, drill(['target'])),
				exitconf = {
					id: 'exit',
					href: "."
				},
				controlsconf = {
					id: 'controls'
				},
				fixcache = function () {
					stage_one_rpt.remove();
					//remove exit listener from event_cache
					var list = poloAF.Eventing.listEvents(),
						res = _.findIndex(list, function (item) {
							return item.el.match(/exit/i);
						});
					//is res always 1???
					if (!failed(res)) {
						poloAF.Eventing.deleteListeners(res, 1);
					}
				},
				presenter_unrender = ptL(invokemethod, presenter, null, 'unrender'),
				$exit = makeElement(doTwice(utils.getter)('getElement'), utils.addEvent(clicker, _.compose(fixcache, presenter_unrender)), ptL(setAttrs, exitconf), anCrIn(thumbs, main), always('a')),
				$controls = makeElement(ptL(klasAdd, 'static'), ptL(setAttrs, controlsconf), anCr(main), always('div'));
			comp.add(_.extend(poloAF.Composite(), $thumbs, {
				unrender: _.compose(ptL(klasRem, 'portrait'), ptL(klasAdd, 'gallery', thumbs))
			}));
			comp.add(_.extend(poloAF.Composite(), $body, {
				unrender: ptL(klasRem, 'showtime', utils.getBody())
			}));
			comp.add(_.extend(poloAF.Composite(), $wrap, {
				unrender: ptL(klasRem, 'inplay', $('wrap'))
			}));
			comp.add(_.extend(poloAF.Composite(), $show, {
				unrender: hideCurrent
			}));
			comp.add(_.extend(poloAF.Composite(), $exit));
			comp.add(_.extend(poloAF.Composite(), $controls));
			return comp;
		}([]));
	(function () {
		var stage_two_comp = (function (inc) {
				return poloAF.Composite(inc);
			}([])),
			stage_two_rpt = (function (inc) {
				return poloAF.Composite(inc);
			}([])),
			stage_two_persist = (function (inc) {
				return poloAF.Composite(inc);
			}([])),
			allow = !touchevents ? 2 : 0,
			isImg = _.compose(doThrice(invokemethod)('match')(/^img$/i), drill(['target', 'nodeName'])),
			exitShow = function (actions) {
				return function (flag) {
					var f = flag ? ptL(thunk, once(1)) : always(false),
						res = utils.getBest(f, actions)();
					return res;
				};
			},
			fadeNow = function (el, i) {
				var currysetter = doThrice(setter)(i)(cssopacity);
				_.compose(currysetter, drill(['style']))(el);
				//el.style object would be returned from currysetter, need to return acutal element
				return el;
			},
			fade50 = doTwiceDefer(fadeNow)(poloAF.getOpacity(50).getValue()),
			fade100 = doTwiceDefer(fadeNow)(poloAF.getOpacity(100).getValue()),
			dofading = function (myopacity, pred, swapper, counter, i) {
				var currysetter = doThrice(utils.setter)(myopacity.getValue(i))(cssopacity),
					el = getSlide();
				if (el) {
					_.compose(currysetter, ptL(drill(['style']), el))();
					utils.invokeWhen(ptL(pred, i), ptL(swapper.swap, counter), swapper);
				}
			},
			countdown = function countdown(cb, x) {
				var raf = Modernizr.requestanimationframe ? 1 : 11;
				//restarting counter is delegated to an onDone function, passed as an argument here..
				function counter() {
					if (countdown.resume) {
						countdown.resume = null;
					}
					if (countdown.progress === null) {
						window.cancelAnimationFrame(countdown.progress);
						countdown.resume = x;
						return;
					}
					x -= raf;
					//x -= 1;
					utils.invokeWhen(lessOrEqual(100), ptL(cb, counter), x);
					if (isPositive(x)) {
						countdown.progress = window.requestAnimationFrame(counter);
					} else {
						//x = 300;
						//x = 111;
						x = 55;
					}
				}
				return counter;
			},
			setImageSrc = ptL(setterAdapter, 'src'),
			setImageAlt = ptL(setterAdapter, 'alt'),
			setHyperLink = ptL(setterAdapter, 'href'),
			getMyNextBase = function (it) {
				return [_.compose(makePath, it.getNext), _.compose(getDefAlt, it.getCurrent), _.compose(makePath, it.getCurrent)];
			},
			bridgeBase = function (el) {
				return getDomTargetImg(el).src.match(picnum)[1];
			},
			getMyNextSlide = function (base) {
				return [_.compose(getDefAlt, base), _.compose(makePath, bridgeBase, base), _.compose(makePathWrap, bridgeBase, base)];
			},
			baseTrio = function (doSrc, doAlt, doHref, iterator) {
				var headFunctions = getMyNextBase(iterator),
					mysrc = _.compose(doSrc, headFunctions[0]),
					myalt = _.compose(doAlt, headFunctions[1]),
					myhref = _.compose(doHref, headFunctions[2]);
				return _.compose(mysrc, myhref, myalt);
			},
			baserender = function (iterator) {
				return function () {
					var li = $('base'),
						link = getDomTargetLink(li),
						img = getDomTargetImg(li);
					return baseTrio(ptL(setImageSrc, img), ptL(setImageAlt, img), ptL(setHyperLink, link), iterator);
				};
			},
			slideQuartet = function (doSrc, doAlt, doHref, base) {
				var headFunctions = getMyNextSlide(base),
					myalt = _.compose(doAlt, headFunctions[0]),
					myhref = _.compose(doHref, headFunctions[1]),
					mysrc1 = _.compose(doSrc, always('')),
					mysrc2 = _.compose(doSrc, headFunctions[2]);
				_.compose(mysrc2, mysrc1, myhref, myalt)();
			},
			sliderender = function () {
				var li = $('slide'),
					link = getDomTargetLink(li),
					img = getDomTargetImg(li),
					base = always(utils.getPrevious(li));
				//img.onload = fade100(li);
				//slide img gets set to base img src.
				//On first run these are the SAME. So first set src to empty string to trigger onload event
				//_.compose(mysrc2, mysrc1, myhref, myalt)();
				slideQuartet(ptL(setImageSrc, img), ptL(setImageAlt, img), ptL(setHyperLink, link), base);
			},
			//attempted to simplify this using alternate functions, but it's a good example of the state pattern...
			//https://robdodson.me/take-control-of-your-app-with-the-javascript-state-patten/
			controller = function (mycountdown, cb, x) {
				var counter = mycountdown(cb, x),
					klas = 'playing',
					shutdown = _.compose(ptL(setter, mycountdown, 'progress', null), ptL(klasRem, klas, getControls)),
					pauserender = function () {
						var clone = getSlide(),
							pauser = makeElement(ptL(setAttrs, {
								id: 'paused'
							}), anCr(thumbs), always(clone)).render(),
							img = getDomTargetImg(pauser.getElement());
						img.onload = fade50(pauser.getElement());
						img.src = isPortrait(clone) ? '../images/pauseLong.png' : '../images/pause.png';
						return pauser;
					},
					//dummy pause, gets rewitten after first run
					pause = {
						unrender: noOp
					},
					init = function (t) {
						this.target = t;
					},
					ret = {
						state: undefined,
						init: function () {
							this.states.playing.init(this);
							this.states.paused.init(this);
							this.state = this.states.playing;
						},
						render: function () {
							if (!this.state) {
								this.init();
							}
							this.state.render();
						},
						changestates: function (s) {
							this.state = s;
						},
						unrender: function () {
							shutdown();
							pause.unrender();
							this.state = this.states.playing; //reset
						},
						states: {
							playing: {
								init: init,
								render: function () {
									mycountdown.progress = 1;
									counter();
									pause.unrender(); //dummy pause on initial run
									klasAdd(klas, getControls);
									this.target.changestates(this.target.states.paused);
								}
							},
							paused: {
								init: init,
								render: function () {
									shutdown();
									pause = pauserender();
									this.target.changestates(this.target.states.playing);
								}
							}
						}
					};
				return _.extend(poloAF.Composite(), ret);
			},
			myrouter = function (index, reg_def, reg_alt, getVal) {
				var stringmatch = doThrice(invokemethod)('match'),
					passive = _.map(reg_def, function (reg) {
						return _.compose(stringmatch(reg), getVal);
					}),
					active = _.map(reg_alt, function (reg) {
						return _.compose(stringmatch(reg), getVal);
					}),
					coll = [passive, active],
					ret = {
						render: function (arg) {
							index = arg ? Number(!index) : index;
							return coll[index];
						},
						unrender: function () {
							index = 0;
						}
					};
				return makeLeafComp(ret);
			},
			mediator = (function (coll, index) {
				var router = myrouter(0, [/^ba/i, /^For/i], [/^p\w+/i], drill(['target', 'id'])),
					ret = {
						validate: function (e, arg) {
							return _.compose(ptL(_.findIndex, router.render(arg), doTwice(invoke)(e)))();
						},
						add: function (i) {
							coll[i] = [];
							coll[i].push.apply(coll[i], _.rest(arguments));
						},
						render: function (i, arg) {
							index = arg ? Number(!index) : index;
							return coll[index][i];
						},
						unrender: function () {
							index = 0;
							router.unrender();
						}
					};
				return makeLeafComp(ret);
			}([
				[],
				[]
			], 0)),
			addLocator = function (cb) {
				var adapter = adapterFactory();
				_.compose(stage_one_rpt.add, adapter, utils.addEvent(clicker, cb))(thumbs);
			},
			addRouter = function (cb) {
				var adapter = adapterFactory();
				_.compose(stage_one_rpt.add, adapter, utils.addEvent(clicker, cb))($('controls'));
			},
			play = noOp,
			toggle_command = (function (klas, cb) {
				var o = {
						statik: null,
						/*can't use static reserved word*/
						inplay: null
					},
					rem = _.compose(ptL(klasRem, klas), cb),
					wrap = makeElement(ptL(klasAdd, 'inplay'), always($('wrap'))),
					$wrap = _.extend(wrap, {
						unrender: ptL(klasRem, 'inplay', $('wrap'))
					}),
					clear = function () {
						window.clearTimeout(o.statik);
						window.clearTimeout(o.inplay);
						o.statik = o.inplay = null;
						if (countdown.progress) {
							$wrap.render();
						}
					},
					preppedAdd = _.compose(ptL(klasAdd, klas), cb),
					ret = {
						render: function () {
							o.statik = window.setTimeout(rem, 3000);
							o.inplay = window.setTimeout(clear, 3500);
						},
						unrender: function () {
							_.compose(clear, preppedAdd)();
							$wrap.unrender();
						}
					};
				return makeLeafComp(ret);
			}('static', getControls)),
			prepToggler = function (command) {
				var enterHandler = ptL(utils.addHandler, 'mouseover'),
					handler = ptL(klasAdd, 'static', getControls);
				_.compose(stage_two_rpt.add, adapterFactory(), utils.addEvent(enterHandler, handler), getControls)();
				_.compose(stage_two_rpt.add, adapterFactory(), utils.addEvent(enterHandler, ptL(klasRem, 'static', getControls)))(footer);
				stage_two_rpt.add(command);
			},
			makeToolTip = function () {
				return poloAF.Tooltip(thumbs, ["move mouse in and out of footer...", "...to toggle the display of control buttons"], allow);
			},
			enter_slideshow = function () {
				var comp = stage_one_rpt.get(false);
				comp.unrender(); //remove location handler 
				stage_one_rpt.remove(comp); //remove from composite, it will be added again later
				prepToggler(toggle_command);
				stage_two_comp.render();
				//true gets passed to next function, critical: _.compose(a_function_awaiting_flag, always(true))
				return true;
			},
			locator = function (iterator, forward, back) {
				var getLoc = (function (div, subtract, isGreaterEq) {
					var getThreshold = _.compose(div, subtract);
					return function (e) {
						try {
							var box = e.target.getBoundingClientRect();
							return isGreaterEq(ptL(subtract, e.clientX, box.left), ptL(getThreshold, box.right, box.left));
						} catch (er) {
							return true;
						}
					};
				}(divideBy(2), subtract, greaterOrEqual));
				return function (e) {
					return utils.getBest(function (agg) {
						return agg[0](e);
					}, _.zip([getLoc, _.negate(getLoc)], [forward, back]));
				};
			},
			initplay = ptL(invokeWhen, once(1)),
			default_iterator = makeIterator(lis),
			getFileNumber = function (src) {
				var t = src.split('/');
				return Number(t[t.length - 1].split('.')[0].substr(1));
			},
			prepareNavHandlers = function () {
				var iterator = default_iterator(),
					forward = doThriceDefer(invokemethod)('forward')(null)(iterator),
					back = doThriceDefer(invokemethod)('back')(null)(iterator),
					getDirection = locator(iterator, forward, back),
					getNextAction = function (m) {
						var get_src = _.compose(drill(['src']), getDomTargetImg),
							src,
							findCurrent = function (f, li) {
								src = get_src(f());
								return get_src(li).match(get_src(f()));
							},
							expand = function (n, i) {
								var img = getDomTargetImg(lis[i]);
								if (!img) {
									img = _.compose(anCr(thumbs), always(lis[0]))();
									img = getDomTargetImg(img);
								}
								src = img.src.replace(/\d+/, '0' + n);
								img.src = src;
								img.parentNode.href = src;
							},
							cb = function (n, i) {
								var img = getDomTargetImg(lis[i]);
								src = img.src.replace(/\d+/, '0' + n);
								img.src = src;
								img.parentNode.href = src;
							},
							gang,
							fallback = function (result) {
								if (!_.isEmpty(result)) {
									return result[0];
								}
								var coll = getSubGroup(getFileNumber(src)),
									contract = function (li, i) {
                                        if(coll.page[i]){
                                         var img = getDomTargetImg(lis[i]); 
                                            src = img.src.replace(/\d+/, '0' + coll.page[i]);
											img.src = src;
											img.parentNode.href = src;
                                        }
                                        else {
											//utils.removeNodeOnComplete(lis[i]);
										}
									};
								if (coll.page.length > lis.length) {
									gang = coll.page;
									cb = expand;
								} else if (lis.length > coll.page.length) {
									gang = lis;
									cb = contract;
								} else {
									gang = coll.page;
								}
								_.each(gang, cb);
								return lis[coll.index];
							};
						return _.compose(utils.show, utils[m], fallback, ptL(_.filter, lis, ptL(findCurrent, ptL($, 'base'))));
					},
					getPrevEl = getNextAction('getPreviousElement'),
					getNextEl = getNextAction('getNextElement'),
					getAction = doThrice(invokemethod)(1)(null),
					doPrevious = exitShow([getPrevEl, _.compose(doShow, back)]),
					doNext = exitShow([getNextEl, _.compose(doShow, forward)]),
					buttonmatch = doThrice(invokemethod)('match')(/button/i),
					isButton = _.compose(buttonmatch, drill(['target', 'nodeName'])),
					handler = function (e) {
						if (!isButton(e)) {
							return;
						}
						var res = mediator.validate(e);
						if (failed(res)) {
							initplay(play); //move into stage three, happens once per page load
							//render gets wrapped after initplay
							res = mediator.validate(e, true);
							mediator.render(res, true)();
							return;
						}
						mediator.render(res)();
					};
				mediator.add(0, doPrevious, doNext);
				addRouter(handler);
				addLocator(_.compose(doShow, getAction, getDirection));
			},
			tooltip_pairs = [
				['render', 'unrender'],
				['init', 'cancel']
			],
			tooltip_adapter = ptL(utils.simpleAdapter, tooltip_pairs, poloAF.Composite()),
			stage_two_persister = _.compose(stage_two_persist.add, makeLeafComp),
			synchroniserFactory = function (enter, exiter) {
				var doAlt = utils.doAlternate();
				return {
					enter: doAlt([enter, always(true)]),
					exit: doAlt([noOp, exiter])
				};
			},
			get_play_iterator = function () {
				var myint = Number(getDomTargetImg(getCurrentSlide()).src.match(picnum)[1]);
				return getSubGallery(myint);
			},
			$current = {
				render: hideCurrent,
				unrender: function () {}
			},
			makeSwapper = function () {
				var ret = {
					swap: function (counter) {
						//swap image on slide while opacity is zero
						sliderender();
						var base_cb = ret.baserender(),
							slide = getSlide();
						//await load event on image NERVE CENTRE..
						getDomTargetImg(slide).onload = function () {
							//this sequence is critical, make slide opaque BEFORE setting NEXT image on base
							fade100(slide)();
							base_cb();
							counter();
						};
					},
					render: function () {
						//we need a fresh iterator every time we enter into slideshow, index set to clicked image
						//this.baserender = baserender(get_play_iterator()); doesn't work???
						ret.baserender = baserender(get_play_iterator()); //for this relief much thanks
					},
					unrender: noOp
				};
				return ret;
			};
		play = function () {
			var swapper = makeSwapper(),
				makeEl = function (myid) {
					return makeElement(utils.hide, ptL(setAttrs, {
						id: myid
					}), anCr(thumbs), getCurrentSlide);
				},
				$base = makeEl('base'),
				$slide = makeEl('slide'),
				fader = ptL(dofading, poloAF.getOpacity(), _.compose(_.isNumber, lessOrEqual(0)), swapper),
				player = controller(countdown, fader, 101),
				cleanup = function () {
					player.unrender();
					stage_two_comp.unrender();
					stage_one_rpt.remove(stage_one_rpt.get(false)).unrender();
					stage_two_rpt.remove(); //unrendered on line one of function
				},
				exit = _.compose(prepareNavHandlers, cleanup),
				mysync = synchroniserFactory(enter_slideshow, exit),
				syncho = makeLeafComp({
					unrender: function () {
						cleanup();
						//fresh instance required if "forced exit" a result of clicking exit button whilst inplay
						mysync = synchroniserFactory(enter_slideshow, exit);
					},
					render: noOp
				});
			mediator.add(1, _.bind(player.render, player));
			mediator.render = _.wrap(mediator.render, function (med_render, i, bool) {
				return bool ? _.compose(mysync.exit, med_render(i, bool), mysync.enter) : med_render(i);
			});
			stage_two_persister(swapper);
			stage_two_persister($base);
			stage_two_persister($slide);
			stage_two_persister($current);
			_.compose(stage_two_persist.add, adapterFactory(), utils.addEvent(clicker, _.bind(player.render, player)))(thumbs);
			_.compose(stage_two_persist.add, tooltip_adapter, makeToolTip)();
			presenter.addAll(player, mediator, syncho);
		};
		(function () { //init..
			var makeButtons = function (tgt) {
					_.each(['back', 'play', 'forward'], function (str) {
						var conf = {};
						conf.id = str + 'button';
						makeElement(ptL(setAttrs, conf), anCr(getResult(tgt)), always('button')).render();
					});
				},
				handler = _.compose(ptL(makeButtons, ptL($, 'controls')), prepareNavHandlers, stage_one_comp.render);
			try {
				presenter.addAll(stage_one_comp, stage_one_rpt, stage_two_comp);
				stage_two_comp.addAll(stage_two_rpt, stage_two_persist);
				//utils.highLighter.perform();
				_.compose(stage_one_comp.add, myrevadapter, utils.addEvent(clicker, ptL(invokeWhen, isImg, handler)))(thumbs);
			} catch (e) {
				$('report').innerHTML = e;
			}
			/*inserts back/forward buttons, returns a REVERSE adpater around a eventListener object,
    where unrender would restore listener and render would remove listener when entering navigation mode
    HOWEVER events in gallery mode are not propagating to the main element so we can save the bother of that*/
			addPageNav(anCr, 'Enable checkbox to restrict to a single page', 'gal_forward', noOp);
			addPageNav(doInsert, 'Enable checkbox to group pictures by orientation', 'gal_back', addPageNavHandler);
			utils.$('placeholder').innerHTML = 'PHOTOS';
		}());
	}());
}(document, 'show', Modernizr.mq('only all'), '(min-width: 668px)', Modernizr.cssanimations, Modernizr.touchevents, document.getElementsByTagName('main')[0], document.getElementsByTagName('footer')[0], '(min-width: 601px)', /[^\d]+\d(\d+)[^\d]+$/, function (path) {
    "use strict";
	return "images/0" + path + ".jpg";
}, function () {"use strict"; }, poloAF.Util.always('')));