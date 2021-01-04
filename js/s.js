/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
(function (mq, query, touchevents, picnum, makePath) {
	"use strict";

	function noOp() {}
    function always(val) {
		return function () {
			return val;
		};
	}
    
    function modulo(n, i) {
		return i % n;
	}

    function partial(f, el) {
		return _.partial(f, el);
	}
    
    function compare(f, a, b, o) {
		return f(o[a], o[b]);
	}
    function curryFactory(i, defer) {}
    
	var utils = poloAF.Util,
		//con = window.console.log.bind(window),
		/*reporter = function (msg, el) {
			el = el || utils.getByTag('h2', document)[0];
			msg = undef(msg) ? document.documentElement.className : msg;
			el.innerHTML = msg;
		},
        */
		$ = function (str) {
			return document.getElementById(str);
		},
		ptL = _.partial,
		anCr = utils.append(),
		anCrIn = utils.insert(),
		setAttrs = utils.setAttributes,
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		klasTog = utils.toggleClass,
        makeElement = utils.machElement,
		clicker = ptL(utils.addHandler, 'click'),
		getNodeName = utils.drillDown(['nodeName']),
		getID = utils.drillDown(['id']),
        getLength = utils.drillDown(['length']),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
        
        
        een = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14],
		twee = _.range(15, 29),
		drie = _.range(29, 43),
		vier = _.range(43, 55),
		vyf = _.range(55, 67),
		ses = _.range(67, 79),
		sewe = _.range(79, 93),
		all = [een, twee, drie, vier, vyf, ses, sewe],
        
        doVier = curryFactory(4),
        
        main = document.getElementsByTagName('main')[0],
        thumbs = utils.getByClass('gallery')[0],
		gallery = utils.getNextElement(main.firstChild),
		footer = document.getElementsByTagName('footer')[0],
		getDefAlt = utils.always(''),
		list_elements = _.toArray(thumbs.getElementsByTagName('li')),
		
		getTarget = utils.drillDown([mytarget]),
        allpics = utils.getByTag('img', main),
		getOrientation = ptL(compare, utils.gtThan, 'offsetHeight', 'offsetWidth'),
		pageInputHandler = function (arg) {
			//stopPropagation
			utils.addEvent(clicker, noOp, 'stop')(arg);
			return arg;
		},
		neg = function (a, b) {
			return getLength(b) !== 14;
		},
		negator = function (cb, a, b) {
			if (neg(a, b)) {
				cb.apply(null, _.rest(arguments, 3));
				neg = _.negate(neg);
			}
			return b;
		},
        makeCrossPageIterator = function (coll) {
            var prepIterator = doVier(window.poloAF.Iterator(false));
            return prepIterator(ptL(modulo, coll.length))(utils.always(true))(coll)(0);
		},
		cross_page_iterator = makeCrossPageIterator(all),
        doPortrait = function (el) {
			var m = getOrientation(el) ? 'addClass' : 'removeClass';
			utils[m]('portrait', utils.getDomParent(utils.getNodeByTag('li'))(el));
		},
        
		fixNoNthChild = _.compose(ptL(utils.doWhen, _.negate(utils.always(Modernizr.nthchild))), ptL(partial, doPortrait)),
		doToggle = ptL(klasTog, 'alt', thumbs),
		doPortraitLoop = ptL(_.each, allpics, fixNoNthChild),
		doPortraitBridge = function (e) {
			fixNoNthChild(e.target);
		},
		doPopulate = function (pagepics) {
			var path = '001';
			_.each(allpics, function (img, i) {
				path = pagepics[i] || path; //? default to avoid null
				img.src = makePath(path);
				img.onload = doPortraitBridge;
			});
		},
		toogleLoop = _.compose(doPortraitLoop, doToggle), //cb
		$LI = (function (options) {
			return {
				exec: function () { //cb
					var action = options[0];
					_.each(_.last(list_elements, 2), this[action]);
					options = options.reverse();
				},
				unrender: function (el) {
					var $el = makeElement(always(el)).render();
					$el.unrender();
				},
				render: function (el) {
					return makeElement(anCr(thumbs), always(el)).render();
				}
			};
		}(['unrender', 'render'])),
		populate = _.compose(doPopulate, ptL(negator, _.compose(toogleLoop, _.bind($LI.exec, $LI)), allpics)),
		advanceRouteBridge = function (e) {
			if (!getNodeName(getTarget(e)).match(/a/i)) {
				return;
			}
			return getID(getTarget(e)).match(/back$/) ? 'back' : 'forward';
		},
		advanceRoute = function (m) {
			return populate(cross_page_iterator[m]());
		},
		advanceRouteListener = _.wrap(advanceRouteBridge, function (orig, e) {
			//sign that event is triggered
			/*if (getTarget(e) === main) {
				var mock = {};
				mock.target = $('gal_forward');
				return advanceRoute(orig(mock));
			}
             */
			return advanceRoute(orig(e));
		}),
		addPageNav = function (myAnCr, title, id, cb) {
			return _.compose(cb, pageInputHandler, anCr(_.compose(ptL(klasAdd, 'pagenav'), ptL(setAttrs, {
				id: id,
				href: '.'
			}), myAnCr(main), utils.always('a'))))('span');
		},
		pageNavHandler = utils.addEvent(clicker, _.debounce(advanceRouteListener, 300)),
		addPageNavHandler = _.compose(pageNavHandler, utils.getDomParent(main)),
		insertBeforeThumbs = ptL(anCrIn, gallery);
	addPageNav(anCr, 'Enable checkbox to restrict to a single page', 'gal_forward', noOp);
	//addPageNavHandler delegaates to main as the listening element, only one handler required, hence noOp above
	addPageNav(insertBeforeThumbs, 'Enable checkbox to group pictures by orientation', 'gal_back', addPageNavHandler);
	utils.$('placeholder').innerHTML = 'PHOTOS';
}(Modernizr.mq('only all'), '(min-width: 668px)', Modernizr.touchevents, /[^\d]+\d(\d+)[^\d]+$/, function (path) {
	"use strict";
	return "images/0" + path + ".jpg";
}));