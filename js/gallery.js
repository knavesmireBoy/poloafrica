/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
(function (mq, query, touchevents, pausepath, imagepath, picnum, tooltip_msg, makePath) {
	"use strict";

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
    
       function viewBoxDims(s){
        var a = s.split(' ').slice(-2);
        return {width: a[0], height: a[1]};
    }
    
    function doSvg(svg){
           return function(str){
               if(svg && str){
                   utils.setAttributes({viewBox: str}, svg);
                   //ipod ios(6.1.6) requires height, arbitrary choice of unsupported feature
                   if(!Modernizr.objectfit){
                       utils.setAttributes(viewBoxDims(str), svg);
                   }
               }
           }
       }
    
    
     function doSVGview() {
            var mq  = window.matchMedia("(max-width: 667px)"),
                setViewBox = doSvg(document.getElementById('logo')),
                doMobile = _.compose(execMobile, undoDesktop, ptL(setViewBox, "0 0 155 125")),
                doDesktop = _.compose(undoMobile, execDesktop, ptL(setViewBox, "2 0 340 75"));
         return function(){
                    if(mq.matches){//onload
                        doMobile();
                    }
                    return doAltSVG([doMobile, doDesktop]);
        };
     }

	function makeDummy() {
		return {
			render: function () {},
			undo: function () {}
		};
	}

	function invokeMethod(o) {
		return function (m) {
			return o[m] && o[m].apply(null, _.rest(arguments));
		};
	}
    
    function applyArg(f, arg) {
		arg = _.isArray(arg) ? arg : [arg];
		return f.apply(null, arg);
	}

	function doPartial(flag, f) {
		var F = _.partial(flag, f);
		if (flag && _.isBoolean(flag)) {
			F = function (elem) {
				return _.partial(f, elem);
			};
		}
		return F;
	}

	function doubleGet(o, sub, v, p) {
		return o[sub][p](v);
	}

	function greater(a, b) {
		return a > b;
	}

	function greaterBridge(o, p1, p2) {
		return greater(o[p1], o[p2]);
	}

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function equals(a, b) {
		return a === b;
	}

	function add(a, b) {
		return a + b;
	}

	function modulo(n, i) {
		return i % n;
	}

	function increment(i) {
		return i + 1;
	}

	function equalNum(tgt, cur) {
		return cur === tgt || parseFloat(cur) === parseFloat(tgt);
	}

	function invoke(f, arg) {
		arg = _.isArray(arg) ? arg : [arg];
		return f.apply(null, arg);
	}

	function invokeCB(arg, cb) {
		arg = _.isArray(arg) ? arg : [arg];
		return cb.apply(null, arg);
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

	function doCallbacks(cb, coll, p) {
		return _[p](coll, cb);
	}

	function spread(f, j, group) {
		if (!group || !group[j]) {
			return [
				[],
				[]
			];
		}
		//allow for partial
		if (j) {
			return f(group[0], group[j]);
		}
		//or curry
		return f(group[1])(group[0]);
	}
	var utils = poloAF.Util,
		con = window.console.log.bind(window),
		ptL = _.partial,
		doComp = _.compose,
		Looper = poloAF.LoopIterator,
        //creates an object that wraps an iterator, allows setting new instance of iterator ($looper.build) and forwards all requests
		$looper = poloAF.Looper(),
		curryFactory = utils.curryFactory,
		event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
		eventing = utils.eventer,
		once = utils.doOnce(),
		defer_once = curryFactory(1, true),
		twice = curryFactory(2),
		twicedefer = curryFactory(2, true),
		thrice = curryFactory(3),
		thricedefer = curryFactory(3, true),
		deferEach = thricedefer(doCallbacks)('each'),
		deferEvery = thrice(doCallbacks)('every'),
		anCr = utils.append(),
		anCrIn = utils.insert(),
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		klasTog = utils.toggleClass,
		cssopacity = getNativeOpacity(!window.addEventListener),
		$ = thrice(lazyVal)('getElementById')(document),
		$$ = thricedefer(lazyVal)('getElementById')(document),
		main = document.getElementsByTagName('main')[0],
		getThumbs = doComp(utils.getZero, ptL(utils.getByTag, 'ul', main)),
		getAllPics = doComp(ptL(utils.getByTag, 'img'), getThumbs),
		doAltSVG = utils.doAlternate(),
        getSvgPath = utils.getDomChildDefer(utils.getNodeByTag('path'))(document.getElementsByTagName('svg')[0]),
		execMobile = _.compose(ptL(utils.removeClass, 'invisible'), getSvgPath),
		execDesktop = _.compose(ptL(utils.removeClass, 'invisible'), utils.getNext, getSvgPath),
		undoMobile = _.compose(ptL(utils.addClass, 'invisible'), getSvgPath),
		undoDesktop = _.compose(ptL(utils.addClass, 'invisible'), utils.getNext, getSvgPath),
		parser = thrice(doMethod)('match')(/images[a-z\/]+\d+\.jpe?g$/),
		doMap = utils.doMap,
		doGet = twice(utils.getter),
		doVal = doGet('value'),
		doParse = doComp(ptL(add, '../'), doGet(0), parser),
		doAlt = doComp(twice(invoke)(null), utils.getZero, thrice(doMethod)('reverse')()),
		unsetPortrait = ptL(klasRem, 'portrait', getThumbs),
		setPortrait = ptL(klasAdd, 'portrait', getThumbs),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
		getTarget = utils.drillDown([mytarget]),
		text_from_target = doComp(doGet('id'), getTarget),
		node_from_target = doComp(doGet('nodeName'), getTarget),
		id_from_target = doComp(doGet('id'), getTarget),
		queryOrientation = thrice(greaterBridge)('clientWidth')('clientHeight'),
		getLI = utils.getDomParent(utils.getNodeByTag('li')),
		getDomTargetImg = utils.getDomChild(utils.getNodeByTag('img')),
		getLength = doGet('length'),
		doClass = ptL(utils.getBest, queryOrientation, ['addClass', 'removeClass']),
		getSlideChild = doComp(utils.getChild, utils.getChild, $$('slide')),
		getBaseChild = doComp(utils.getChild, utils.getChild, $$('base')),
		getBaseSrc = doComp(utils.drillDown(['src']), getBaseChild),
        getSRC = twice(utils.getter)('src'),
        $slide_swapper = utils.makeContext(),
		$setup = utils.makeContext(),
		$toggler = utils.makeContext(),
		$controlbar = utils.makeContext(),
		addElements = function () {
			return doComp(twice(invoke)('img'), anCr, twice(invoke)('a'), anCr, anCr(getThumbs))('li');
		},
		//height and width of image are compared BUT a) must invoke the comparison AFTER image loaded
		//b) must remove load listener or will intefere with slideshow
		onBase = function (img, path, promise) {
			var ev = eventing('load', event_actions.slice(0, 1), function (e) {
				promise.then(e[mytarget]);
				ev.undo();
			}, img).execute();
            
            img.src = path;
		},
		
		doMapLateVal = function (v, el, k) {
			return doMap(el, [
				[k, v]
			]);
		},
		//slide and pause 
		onLoad = function (img, path, promise) {
			var ret;
			if (promise) {
				ret = promise.then(getLI(img));
			}
			img.src = path;
			return ret;
		},
		doMapBridge = function (el, v, k) {
			return doMap(el, [
				[k, v]
			]);
		},
		getPausePath = ptL(utils.getBest, doComp(ptL(utils.hasClass, 'portrait'), getThumbs), [pausepath + 'pauseLong.png', pausepath + 'pause.png']),
		doMakeBase = function (source, target) {
			var img = addElements();
			doMap(img.parentNode, [
				['href', doParse(source)]
			]);
			doMap(img.parentNode.parentNode, [
				['id', target]
			]);
			return onBase(img, doParse(img.parentNode.href), new utils.FauxPromise(_.rest(arguments, 2)));
		},
		doMakeSlide = function (source, target) {
			var img = addElements();
			doMap(img.parentNode, [
				['href', doParse(getBaseSrc())]
			]);
			doMap(img.parentNode.parentNode, [
				['id', target]
			]);
			return onLoad(img, doParse(img.parentNode.href), new utils.FauxPromise(_.rest(arguments, 2)));
		},
		doMakePause = function (path) {
			var img = addElements();
			doMap(img.parentNode.parentNode, [
				['id', 'paused']
			]);
			doMap(img.parentNode.parentNode, [
				[
					[cssopacity.getKey(), cssopacity.getValue(0.5)]
				]
			]);
			return onLoad(img, path);
		},
        loadImage = function (getnexturl, id, promise) {
			var img = getDomTargetImg($(id)),
				next;
			if (img) {
				img.onload = function (e) {
					promise.then(e[mytarget]);
				};
				next = getnexturl();
				if (!next) {
					return;
				}
				img.src = doParse(next);
				img.parentNode.href = doParse(img.src);
			}
		},
		loadImageBridge = function () {
			var args = _.rest(arguments, 2);
			args = args.length ? args : [function () {}];
			loadImage.apply(null, _.first(arguments, 2).concat(new utils.FauxPromise(args)));
		},        
		addPageNav = function (myAnCr, id, cb) {
			return doComp(cb, anCr(doComp(ptL(klasAdd, 'pagenav'), doComp(thrice(doMapBridge)('href')('.'), thrice(doMapBridge)('id')(id)), myAnCr(main), utils.always('a'))))('span');
		},
		makeToolTip = doComp(thrice(doMethod)('init')(null), ptL(poloAF.Tooltip, getThumbs, tooltip_msg, touchevents ? 0 : 2)),
		//getValue = doComp(doVal, ptL(doubleGet, Looper, 'onpage')),
        getValue = doComp(doVal, ptL(doMethod, $looper)),
		showtime = doComp(ptL(klasRem, ['gallery'], getThumbs), ptL(klasAdd, ['showtime'], utils.getBody())),
		playtime = ptL(klasAdd, 'inplay', $('wrap')),
		playing = doComp(ptL(utils.doWhen, once(2), ptL(makeToolTip, true)), ptL(klasAdd, 'playing', main)),
		unplayin = ptL(klasRem, 'playing', main),
		exit_inplay = ptL(klasRem, 'inplay', $('wrap')),
		exitswap = ptL(klasRem, 'swap', utils.getBody()),
		exitshow = doComp(ptL(klasAdd, 'gallery', getThumbs), exitswap, ptL(klasRem, 'showtime', utils.getBody()), exit_inplay),
        
        exitshowtime = doComp(ptL(klasAdd, 'gallery', getThumbs), exitswap, ptL(klasRem, 'showtime', utils.getBody()), exit_inplay, unplayin),
        
		undostatic = ptL(klasRem, 'static', $$('controls')),
		doOrient = doComp(ptL(invoke), ptL(utils.getBest, queryOrientation, [setPortrait, unsetPortrait])),
		galleryCount = doComp(twice(equals)(12), getLength),
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		getEnvironment = ptL(utils.isDesktop, threshold),
		svg_resizer = function (alternator) {
			if (!getEnvironment()) {
				alternator();
				getEnvironment = _.negate(getEnvironment);
			}
		},
		pages = (function () {
			var een = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14],
				twee = _.range(15, 29),
				drie = _.range(29, 43),
				vier = _.range(43, 55),
				vyf = _.range(55, 67),
				ses = _.range(67, 79),
				sewe = _.range(79, 93),
				all = [een, twee, drie, vier, vyf, ses, sewe],
				getAspectPriority = function (bool, coll) {
					if (coll[13]) {
						var copy = coll.slice(0),
							res = copy.splice(4, 6);
						return bool ? res : copy;
					}
					return bool ? [] : coll;
				},
				doMatch = function (str) {
					return str.match(imagepath);
				},
				getLeadingGroup = function (portrait, landscape, flag) {
					var leader = flag ? portrait : landscape,
						trailer = flag ? landscape : portrait;
					return [leader, trailer];
				},
				fixPageOrder = function (group, i) {
					var leader = group[0],
						tmp = leader[0],
						start = _.findIndex(tmp, ptL(equalNum, i));
					leader[0] = poloAF.Util.shuffleArray(tmp)(start); //fix on page order
					return group;
				},
				bookEnd = function (count, zipped) {
					return _.map(zipped, function (nested, idx, zip) {
						//a = [[1,2,3], [456]] || a = [[], [4,5,6]]
						if (nested[0].length && nested[1].length) {
							count = idx && zip[idx - 1][1].length;
							//ensures leading array of pp2 is same aspect as trailing array of pp1 
							if (count && (nested[0].length !== count)) {
								nested = nested.reverse();
							}
						}
						return nested;
					});
				},
				//bookEnd is a strategy for ordering an array, can be easily swapped on client request
				desktop = _.compose(_.flatten, ptL(bookEnd, 0), ptL(spread, _.zip, 1)),
				mobile = _.compose(_.flatten, ptL(spread, thrice(doMethod)('concat'), 0));
			return {
				getList: function () {
					//crucial slice, remember arrays passed as reference, so if we interfere with above we're in trubble
					return _.map(all, thrice(doMethod)('slice')(0)).slice(0);
				},
				findInt: function (finder) {
					var str = doMatch(getResult(finder));
					str = str && str[0];
					return str && parseFloat(str.match(picnum)[1]);
				},
				findIndex: function (finder) {
					return _.findIndex(_.map(this.getList(), twice(_.filter)(ptL(equalNum, this.findInt(finder)))), _.negate(_.isEmpty));
				},
				getPortraitPics: ptL(getAspectPriority, true),
				getLscpPics: ptL(getAspectPriority, false),
				getLeadingGroup: getLeadingGroup,
				fixPageOrder: fixPageOrder,
				doGroup: Modernizr.touchevents ? mobile : desktop
			};
		}()),
		$LI = (function (options) {
			function getColl() {
				return _.filter(getThumbs().getElementsByTagName('li'), function (li) {
					return !li.id;
				});
			}

			function sync(coll) {
				if (galleryCount(coll)) {
					galleryCount = _.negate(galleryCount);
					options = options.reverse();
				}
			}
			var addAlt = doComp(ptL(klasAdd, 'alt'), getThumbs),
				remAlt = doComp(ptL(klasRem, 'alt'), getThumbs);
			return {
				exec: function () {
					//used ONLY by negator swaps actions on failing predicate
					var action = options[0];
					_.each(_.last(getColl(), 2), this[action]);
					options = options.reverse();
				},
				undo: function (el) {
					//var $el = utils.machElement(utils.always(el)).execute();
                     return utils.removeNodeOnComplete(el);
					//$el.undo();
				},
				execute: function (el) {
					var base = $('base'),
						ancr = base ? anCrIn(base, getThumbs) : anCr(getThumbs);
					//doesn't really matter where #base is placed as all other LIS are hidden when it is present. But tidier to append
                    return ancr(el);
					//return utils.machElement(ancr, utils.always(el)).execute();
				},
				query: function (coll) {
					var lis = getColl(),
						L = getColl().length;
					if (L > coll.length) {
						_.each(_.last(lis, 2), this.undo);
						addAlt();
						sync(getColl());
					} else if (L < coll.length) {
						_.each(_.last(lis, 2), this.execute);
						remAlt();
						//12 to 14
						sync(getColl());
					}
					//else 14 === 14 || 12 === 12
				}
			};
		}(['undo', 'execute'])),
		negator = function (cb, page_coll) {
			if (galleryCount(page_coll.value)) {
				cb();
				galleryCount = _.negate(galleryCount);
			}
			return page_coll.value;
		},
		sortClass = invokeMethod(utils),
		pathMaker = doComp(thrice(doMapBridge)('src'), makePath),
		//awaits an img element, maps functions that are invoked with the incoming element argument
		doPortrait = doComp(ptL(invoke, sortClass), ptL(_.map, [doClass, utils.always('portrait'), getLI]), twice(invoke)),
		fixNoNthChild = ptL(utils.invokeWhen, utils.always(!Modernizr.nthchild), doPortrait),
		populatePage = function (img, path) {
			img.src = path;
			img.onload = function (e) {
				fixNoNthChild(e[mytarget]);
			};
		},
		/*invokeBridge expects a two element array of [function, arguments], zip expects two arrays, one delivered on the fly one obtained querying the dom(getAllpics), the on-the-fly is a collection of curried functions expecting the last argument from the dom collection, getAllPics is preloaded, we need to reverse the [img, function] to [function, img] passed to invokeBridge.
		The big idea is to avoid using the function keyword as much as possible making the transition to ES6 a little easier*/
		populate = doComp(twice(_.each)(invokeBridge), twice(_.map)(thrice(doMethod)('reverse')(null)), ptL(invokeArgs, _.zip, getAllPics), twice(_.map)(pathMaker), ptL(negator, doComp(ptL(klasTog, 'alt', getThumbs), _.bind($LI.exec, $LI)))),
		notMain = doComp(_.negate(doComp(ptL(equals, main), getTarget))),
		notExit = _.negate(doComp(ptL(equals, 'exit'), id_from_target)),
		advance_validators = [doComp(thrice(doMethod)('match')(/a/i), node_from_target), notExit, notMain],
		get_back = doComp(thrice(doMethod)('match')(/back$/), text_from_target),
		doValidate = deferEvery(advance_validators),
		getDirection = ptL(utils.getBest, get_back, ['back', 'forward']),
		every = doComp(doValidate, doPartial(true, invokeCB)),
		advanceRouteBridge = ptL(utils.invokeWhen, every, getDirection),
        doInc = function (n) {
			return doComp(ptL(modulo, n), increment);
		},
       incrementer = doComp(doInc, getLength),
		advanceRoute = function (m) {
            $looper.build(pages.getList(), incrementer);
			if (!Looper.cross_page) {
                $looper.build(pages.getList(), incrementer);
				Looper.cross_page = true;
			}
			return populate($looper[m]());
		},
		advanceRouteListener = ptL(utils.invokeThen, advanceRouteBridge, advanceRoute),
		pageNavHandler = doComp(ptL(eventing, 'click', event_actions.slice(0, 1), _.debounce(advanceRouteListener, 300)), utils.getDomParent(utils.getNodeByTag('main'))),
		$nav = addPageNav(ptL(anCrIn, getThumbs), 'gal_back', pageNavHandler),        
        slide_player_factory = function (flag) {
            
            if(flag){
			return {
				/*remember because images are a mix of landscape and portrait we re-order collection for the slideshow
				so landscapes follow portraits or vice-versa (depending what is the leading pic), this requires undoing when reverting to manual navigation which is invoked by clicking forward/back button, a fresh slideplayer is created on entering slideshow */
				execute: function (page_index, picsrc) {
				var reordered = utils.shuffleArray(pages.getList())(page_index),
					mylscp = _.map(reordered, pages.getLscpPics),
					myptrt = _.map(reordered, pages.getPortraitPics),
					is_portrait = _.filter(myptrt, function (arr) {
						return _.find(arr, ptL(equalNum, picsrc));
					}),
                    group = pages.doGroup(pages.fixPageOrder(pages.getLeadingGroup(myptrt, mylscp, !!is_portrait[0]), picsrc));
				//Looper.onpage = Looper.from(_.map(group, makePath), doInc(getLength(group)));
                $looper.build(_.map(group, makePath), incrementer);
			},
				undo1: _.once(_.wrap(do_page_iterator, function (orig, coll) {
					/*gets called on exiting slideshow, doesn't need to run again (ie forward/back in manual slideshow) until fresh slide_player*/
					orig(coll);
					//fulfills the duty of clicking an image when entering showtime 
					$looper.find(getBaseSrc());
				})),
                
                undo: function (page_index) {
				/*restores on page iterator post slideshow
				if omitted manual navigation would cross page boundaries*/
				var page,
					gallery_pics;
                $looper.build(pages.getList(), incrementer);
                $looper.set(page_index);
				page = $looper.get();
				$LI.query(page);
                    
				gallery_pics = _.filter(getAllPics(), function (img) {
					return !getLI(img).id;
				});
                    
				_.each(gallery_pics, function (img, i) {
					populatePage(img, makePath(page[i]), 'src');
				});
                    
                    $looper.build(_.map(gallery_pics, function (img) {
					return img.src;
                    }), incrementer);  
                    $looper.find(getBaseSrc());
			}
			};
            }
            return makeDummy();
        },
		do_static_factory = function () {
			return {
				/* the class of static should be removed from #control on entering slideshow but should run only once PER slideshow session a fresh instance is set up on exiting slideshow */
				execute: _.once(undostatic),
				undo: function () {}
			};
		},
        
        
		in_play = thricedefer(doMethod)('findByClass')('inplay')(utils),
		//could find a none dom dependent predicate
		//get_player = ptL(utils.getBest, _.negate(in_play), [slide_player, makeDummy()]),
		get_play_iterator1 = function (flag) {
			//if we are inplay (ie pause or playing) we neither want to call enter or exit so a dummy object is returned
			var myint = pages.findInt(getBaseSrc),
				page_index = pages.findIndex(getBaseSrc),
				m = flag ? 'execute' : 'undo',
				slider = get_player();
			slider[m](page_index, myint);
		},
        ///slideshow..., must run to determine start index for EITHER collection
		get_play_iterator = function (flag) {
			var coll,
                filter = function (coll, pred1) {
                    var tmp = _.filter(coll, pred1),
                        arr = _.reject(coll, pred1);
                    return arr.concat(tmp);
                },
                myint = pages.findInt(getBaseSrc),
                page_index = pages.findIndex(getBaseSrc),
				index = $looper.get('index'),
                slider = get_player(),
				outcomes = [_.negate(queryOrientation), queryOrientation],
				provisional = _.map(_.filter(_.map(getAllPics(), getLI), function (li) {
					return !li.id;
				}), getDomTargetImg),
				i = outcomes[0](provisional[index]) ? 0 : 1,
				m = 'undo';
			if (flag) {
				m = 'execute';
				//re-order
				coll = utils.shuffleArray(provisional)(index);
				//split and join again
				coll = i ? filter(coll, outcomes[0]) : filter(coll, outcomes[1]);
				$slide_swapper.set(slide_player_factory(true));
			} else {
				//sends original dom-ordered collection when exiting slideshow
				coll = provisional;
			}
            slider[m](page_index, myint);
            $slide_swapper[m](coll);
		},
        do_page_iterator = function (coll) {
			if (coll && typeof coll.length !== 'undefined') {
				$looper.build(_.map(coll, getSRC), incrementer);
			}
		},
		setindex = function (arg) {
			do_page_iterator(getAllPics());
			return $looper.find(arg);
		},
        
		nextcaller = twicedefer(getValue)('forward')('value'),
		prevcaller = twicedefer(getValue)('back')('value'),
		locator = function (forward, back) {
			var getLoc = function (e) {
				var box = e[mytarget].getBoundingClientRect();
				return e.clientX - box.left > box.width / 2;
			};
			return function (e) {
				return utils.getBest(function (agg) {
					return agg[0](e);
				}, [
					[getLoc, forward],
					[utils.always(true), back]
				]);
			};
		},
		$locate = eventing('click', event_actions.slice(0), function (e) {
			locator(twicedefer(loadImageBridge)('base')(nextcaller), twicedefer(loadImageBridge)('base')(prevcaller))(e)[1]();
			doOrient(e[mytarget]);
		}, getThumbs()),
		///slideshow...
		$recur = (function (player) {
			function test() {
				return _.map([getBaseChild(), getSlideChild()], function (img) {
					return img && img.width > img.height;
				});
			}

			function doSwap() {
				var coll = test(),
					bool = coll[0] === coll[1],
					body = utils.getClassList(utils.getBody()),
					m = bool ? 'remove' : 'add';
				body[m]('swap');
				return !bool;
			}

			function doRecur() {
				player.inc();
				$recur.t = window.requestAnimationFrame($recur.execute);
			}

			function doOpacity(flag) {
				var slide = $('slide'),
					val;
				if (slide) {
					val = flag ? 1 : $recur.i / 100;
					val = cssopacity.getValue(val);
					doMap(slide, [
						[
							[cssopacity.getKey(), val]
						]
					]);
				}
			}
			var playmaker = (function () {
				var setPlayer = function (arg) {
						player = playmaker(arg);
						$recur.execute();
					},
                    doPlay = doComp(doVal, _.bind($looper.forward, $looper, true)),
                    doBase = ptL(invoke, loadImageBridge, doPlay, 'base', setPlayer, doSwap),
					doSlide = ptL(invoke, loadImageBridge, doComp(utils.drillDown(['src']), utils.getChild, utils.getChild, $$('base')), 'slide', doOrient),
                    /*
					doBase = function () {
						return loadImageBridge(_.bind(Looper.onpage.play, Looper.onpage), 'base', setPlayer, doSwap);
					},
                    */
					fadeOut = {
						validate: function () {
							return $recur.i <= -15.5;
						},
						inc: function () {
							$recur.i -= 1;
						},
						reset: function () {
							doSlide();
							var body = utils.getClassList(utils.getBody());
							setPlayer(body.contains('swap'));
						}
					},
					fadeIn = {
						validate: function () {
							return $recur.i >= 134.5;
						},
						inc: function () {
							$recur.i += 1;
						},
						reset: function () {
							doBase();
						}
					},
					fade = {
						validate: function () {
							return $recur.i <= -1;
						},
						inc: function () {
							$recur.i -= 1;
						},
						reset: function () {
							$recur.i = 150;
							doSlide();
							doOpacity();
							doBase();
                            $controlbar.execute();
						}
					},
					actions = [fadeIn, fadeOut];
				return function (flag) {
					return flag ? actions.reverse()[0] : fade;
				};
			}());
			player = playmaker();
			return {
                
                execute: function () {
					if (!$recur.t) {
                        /*returns true if undefined, false if null which it will be as a result of pausing
                        ensures we only get a fresh collection when initiating a slideshow*/
                        if (isNaN($recur.t)) {
                            get_play_iterator(true);
                        }
						$controlbar.set(do_static_factory());
					}
					if (player.validate()) {
						player.reset();
					} else {
						doOpacity();
						doRecur();
					}
				},
				undo: function (flag) {
					doOpacity(flag);
					window.cancelAnimationFrame($recur.t);
					$controlbar.set(do_static_factory());
					$recur.t = flag; //either set to undefined(forward/back/exit) or null(pause)
                    if (!isNaN(flag)) {//is null
                        doMakePause(); //checks path to pause pic
                    }

				}
                
			};
		}({})),
		clear = _.bind($recur.undo, $recur),
		doplay = _.bind($recur.execute, $recur),
		go_execute = thrice(doMethod)('execute')(null),
		go_undo = thrice(doMethod)('undo')(),
        go_set = thrice(lazyVal)('set')($toggler),
		undo_toggler = thricedefer(doMethod)('undo')()($toggler),
		//doExitShow = doComp(thrice(lazyVal)('undo')(slide_player), thricedefer(lazyVal)('findIndex')(pages)(getBaseSrc)),
		doExitShow = thricedefer(lazyVal)('findIndex')(pages)(getBaseSrc),
		factory = function () {
			var remPause = doComp(utils.removeNodeOnComplete, $$('paused')),
				remSlide = doComp(utils.removeNodeOnComplete, $$('slide')),
				defer = defer_once(doAlt),
				doSlide = defer([clear, doplay]),
				doPlaying = defer([unplayin, playing]),
				doDisplay = defer([function () {}, playtime]),
				unlocate = thricedefer(doMethod)('undo')(null)($locate),
				invoke_player = deferEach([doSlide, doPlaying, doDisplay])(getResult),
				do_invoke_player = doComp(ptL(eventing, 'click', event_actions.slice(0, 2), invoke_player), getThumbs),
				relocate = ptL(lazyVal, null, $locate, 'execute'),
				doReLocate = ptL(utils.doWhen, $$('base'), relocate),
                
                /*
				farewell = [unplayin, exit_inplay, exitswap, doComp(go_undo, utils.always($controller)), doReLocate, doExitShow, doComp(doOrient, $$('base')), deferEach([remPause, remSlide])(getResult)],
                */

                farewell = [unplayin, exit_inplay, exitswap, undo_toggler, doReLocate, doExitShow, doComp(doOrient, $$('base')), deferEach([remPause, remSlide])(getResult)],
                
                exit_slideshow = ptL(utils.doWhen, $$('slide'), doComp(get_play_iterator, defer_once(clear)())),                
                next_driver = deferEach([exit_slideshow, twicedefer(loadImageBridge)('base')(nextcaller)].concat(farewell))(getResult),
				prev_driver = deferEach([exit_slideshow, twicedefer(loadImageBridge)('base')(prevcaller)].concat(farewell))(getResult),
                toggler = function () {
					//make BOTH slide and pause but only make pause visible on NOT playing
					if (!$('slide')) {
						doMakeSlide('base', 'slide', thricedefer(doMethod)('execute')(null)($toggler), go_set, do_invoke_player, unlocate);
						doMakePause(getPausePath());
					}
				},
				COR = function (predicate, action) {
                    var test = _.negate(ptL(equals, 'playbutton'));
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
                            if (in_play() && $recur.t && test(str)) {
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
					toggler();
					return true;
				}, invoke_player);
			myplayer.validate = function () {
				return this;
			};
			mynext.setSuccessor(myprev);
			myprev.setSuccessor(myplayer);
			$recur.i = 47; //slide is clone of base initially, so fade can start quickly
			return mynext;
		}, //factory        
        mock = {
            target: {
                nodeName: 'IMG',
                src: "http://81.131.244.169/Alpacas/gal/big/Sancho.jpg"
            }
        },
		setup_val = doComp(thrice(doMethod)('match')(/img/i), node_from_target),
		//setup_val = utils.always(mock),
        
		svg_handler = ptL(svg_resizer, doSVGview()()),
		setup = function (e) {
            
            doComp(setindex, utils.drillDown([mytarget, 'src']))(e);
			doComp(ptL(klasAdd, 'static'), thrice(doMapBridge)('id')('controls'), anCr(main))('section');
			doMakeBase(e[mytarget].src, 'base', doOrient, getBaseChild, showtime);
			//doMakeBase("../gal/big/Sancho.jpg", 'base', doOrient, getBaseChild, showtime);
            
			var buttons = ['backbutton', 'playbutton', 'forwardbutton'],
				aButton = anCr($('controls')),
				close_cb = ptL(doComp(utils.getDomParent(utils.getNodeByTag('main')), thrice(doMapBridge)('href')('.'), thrice(doMapBridge)('id')('exit'), anCrIn(getThumbs, main)), 'a'),
				dombuttons = _.map(buttons, doComp(thrice(doMapLateVal)('id'), aButton, thrice(doMethod)('slice')(-6))),
				dostatic = ptL(klasAdd, 'static', $$('controls')),
				chain = factory(),
				$controls = eventing('click', event_actions.slice(0, 1), function (e) {
					var str = text_from_target(e),
						node = node_from_target(e);
					if (node.match(/button/i)) {
						//!!REPLACE the original chain reference, validate will return either the original or brand new instance
						chain = chain.validate(str);
						chain.handle(str);
					}
				}, $('controls')),
				$controls_undostat = eventing('mouseover', [], undostatic, utils.getByTag('footer', document)[0]),
				$controls_dostat = eventing('mouseover', [], dostatic, $('controls')),
                /*
				exit1 = eventing('click', event_actions.slice(0, 1), function (e) {
					//con(event_actions.slice(1, 2))
					if (e[mytarget].id === 'exit') {
						chain = chain.validate();
						doExitShow();
						_.each([$('exit'), $('tooltip'), $('controls'), $('paused'), $('base'), $('slide')], utils.removeNodeOnComplete);
						exitshow();
						locate.undo();
						$setup.execute();
					}
				}, close_cb),
                */
                $exit = eventing('click', event_actions.slice(0, 1), function (e) {
                    var go_undo = thrice(doMethod)('undo')();

					if (e[mytarget].id === 'exit') {
						chain = chain.validate();
						exitshowtime();
						unsetPortrait();
						_.each([$recur, $locate, $toggler], go_undo);
						_.each([$('exit'), $('tooltip'), $('controls'), $('paused'), $('base'), $('slide')], utils.removeNodeOnComplete);
						$setup.execute();
					}
				}, close_cb);
            
			//listeners...
			_.each(_.zip(dombuttons, buttons), invokeBridge);
			_.each([$controls, $exit, $locate, $controls_undostat, $controls_dostat], go_execute);
			$setup.undo();
		};
    $setup = eventing('click', event_actions.slice(0, 2), ptL(utils.invokeWhen, setup_val, setup), main);
	$setup.execute();
	addPageNav(anCr, 'gal_forward', makeDummy);
	$nav.execute();
	utils.$('placeholder').innerHTML = 'PHOTOS';
	_.each(getAllPics(), fixNoNthChild);
	svg_handler();
	utils.addHandler('resize', window, _.throttle(svg_handler, 99));
}(Modernizr.mq('only all'), '(min-width: 668px)', Modernizr.touchevents, '../images/resource/', /images[a-z\/]+\d+\.jpe?g$/, new RegExp('[^\\d]+\\d(\\d+)[^\\d]+$'), ["move mouse in and out of footer...", "...to toggle the display of control buttons"], function (path) {
	"use strict";
	if (path) {
		var mypath,
			gal = '../images/gallery/fullsize/';
		path = path.toString();
		mypath = path.length < 3 ? gal + '0' + path : gal + path;
		return mypath + ".jpg";
	}
}));