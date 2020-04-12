/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
(function (doc, visiblity, mq, query, cssanimations, touchevents, report, main, footer) {
	"use strict";

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function noOp() {}

	function undef(x) {
		return typeof (x) === 'undefined';
	}

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

	function modulo(n, i) {
		return i % n;
	}

	function setter(o, k, v) {
		o[k] = v;
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
     function compare(f, a, b, o){
        return f(o[a], o[b]);
    }
	var utils = poloAF.Util,
		//con = window.console.log.bind(window),
		$ = function (str) {
			return document.getElementById(str);
		},
		ptL = _.partial,
		once = doOnce(),
		doTwice = utils.curryTwice(),
		doThrice = utils.curryThrice(),
		doQuart = utils.curryFourFold(),
		doTwiceDefer = utils.curryTwice(true),
		doThriceDefer = utils.curryThrice(true),
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		drill = utils.drillDown,
		invokeWhen = utils.invokeWhen,
		setAttrs = utils.setAttributes,
		cssopacity = poloAF.getOpacity().getKey(),
		anCr = utils.append(),
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		isDesktop = (function () {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return _.partial(utils.isDesktop, threshold);
			}
		}()),
		clicker = ptL(utils.addHandler, 'click'),
		makeElement = utils.machElement,
        getOrientation = ptL(compare, utils.gtThan, 'offsetHeight', 'offsetWidth'),
		getDomTargetLink = utils.getDomChild(utils.getNodeByTag('a')),
		getDomTargetImg = utils.getDomChild(utils.getNodeByTag('img')),
		getControls = ptL($, 'controls'),
		getSlide = ptL($, 'slide'),
		//thumbs = $('thumbnails'),
		thumbs = utils.getByClass('gallery')[0],
		//main = _.compose(utils.getZero, _.partial(utils.getByTag, 'main', document))(),
		lis = _.toArray(thumbs.getElementsByTagName('li')),
		getCurrentSlide = _.compose(utils.getZero, ptL(utils.getByClass, 'show', thumbs, 'li')),
		isPortrait = ptL(function (el) {
			var img = getDomTargetImg(el);
			return img.offsetHeight > img.offsetWidth;
			//return utils.getClassList(el).contains('portrait');
		}),
        getCurrentImage = _.compose(getDomTargetImg, getCurrentSlide),
		exitCurrentImage = function (img) {
			var math = getOrientation(img),
				m = math && isDesktop() ? 'addClass' : 'removeClass';
				m = math ? 'addClass' : 'removeClass';
			utils[m]('portrait', thumbs);
			utils[m]('portrait', $('wrap'));
            return img;
		},
        exitGallery = _.compose(exitCurrentImage, getCurrentImage),
        hideCurrent = _.compose(utils.hide, getCurrentSlide),
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
				//$thumbs2 = makeElement(ptL(klasAdd, 'portrait'), always(thumbs)),
				/*
             comp.add(_.extend(poloAF.Composite(), $thumbs2, {
				unrender: ptL(klasRem, 'portrait', thumbs)
			}));
            */
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
                            console.log(item.el)
                            return item.el.match(/exit/i);
							//return item.el.match(/a/i);
						});
					//is res always 1???
					if (!failed(res)) {
						poloAF.Eventing.deleteListeners(res, 1);
					}
				},
				presenter_unrender = ptL(invokemethod, presenter, null, 'unrender'),
				$exit = makeElement(doTwice(utils.getter)('getElement'), ptL(clicker, _.compose(fixcache, presenter_unrender)), ptL(setAttrs, exitconf), anCrIn(thumbs, main), always('a')),
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
			getsrc = _.compose(drill(['src']), getDomTargetImg),
			getalt = _.compose(drill(['alt']), getDomTargetImg),
			gethref = _.compose(drill(['href']), getDomTargetLink),
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
					utils.invokeWhen(lessOrEqual(100), ptL(cb, counter), x);
					if (isPositive(x)) {
						countdown.progress = window.requestAnimationFrame(counter);
					} else {
						x = 300;
					}
				}
				return counter;
			},
			baserender = function (it) {
				return function () {
					var li = $('base'),
						link = getDomTargetLink(li),
						img = getDomTargetImg(li),
						//mysrc1 = _.compose(ptL(setter, img, 'src'), always('')),
						mysrc2 = _.compose(ptL(setter, img, 'src'), getsrc, it.getNext),
						myalt = _.compose(ptL(setter, img, 'alt'), getalt, it.getCurrent),
						myhref = _.compose(ptL(setter, link, 'href'), gethref, it.getCurrent);
					return _.compose(mysrc2, myhref, myalt);
				};
			},
			sliderender = function () {
				var li = $('slide'),
					link = getDomTargetLink(li),
					img = getDomTargetImg(li),
					base = always(utils.getPrevious(li)),
					mysrc1 = _.compose(ptL(setter, img, 'src'), always('')),
					mysrc2 = _.compose(ptL(setter, img, 'src'), getsrc, base),
					myalt = _.compose(ptL(setter, img, 'alt'), getalt, base),
					myhref = _.compose(ptL(setter, link, 'href'), gethref, base);
				//img.onload = fade100(li);
				//slide img gets set to base img src.
				//On first run these are the SAME. So first set src to empty string to trigger onload event
				_.compose(mysrc2, mysrc1, myhref, myalt)();
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
                                    console.log('playing..')
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
                                    console.log('pausing..')
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
						timer: null
					},
					rem = _.compose(ptL(klasRem, klas), cb),
					wrap = makeElement(ptL(klasAdd, 'inplay'), always($('wrap'))),
					$wrap = _.extend(wrap, {
						unrender: ptL(klasRem, 'inplay', $('wrap'))
					}),
					clear = function () {
						window.clearTimeout(o.timer);
						o.timer = null;
						$wrap.render();
					},
					preppedAdd = _.compose(ptL(klasAdd, klas), cb),
					ret = {
						render: function () {
							o.timer = window.setTimeout(rem, 3000);
							window.setTimeout(clear, 3500);
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
			prepareNavHandlers = function () {
				var iterator = default_iterator(),
					forward = doThriceDefer(invokemethod)('forward')(null)(iterator),
					back = doThriceDefer(invokemethod)('back')(null)(iterator),
					getDirection = locator(iterator, forward, back),
					getNextAction = function (m) {
						var get_src = _.compose(drill(['src']), getDomTargetImg),
							findCurrent = function (f, li) {
								return get_src(li).match(get_src(f()));
							};
						return _.compose(utils.show, utils[m], utils.getZero, ptL(_.filter, lis, ptL(findCurrent, ptL($, 'base'))));
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
				var predicate = utils.getPredicate(getCurrentSlide(), isPortrait);
				return makeIterator(_.filter(lis, predicate))();
			},
			$current = {
				render: hideCurrent,
				unrender: noOp
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
            window.presenter = presenter;
		}());
	}());
}(document, 'show', Modernizr.mq('only all'), '(min-width: 668px)', Modernizr.cssanimations, Modernizr.touchevents, document.getElementsByTagName('h2')[0], document.getElementsByTagName('main')[0], document.getElementsByTagName('footer')[0]));