/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
if (!window.poloAF) {
	window.poloAF = {};
}
(function (thequery, mq, touchevents) {
	"use strict";

	function modulo(n, i) {
		return i % n;
	}

	function undef(x) {
		return typeof (x) === 'undefined';
	}

	function partial(f, el) {
		return _.partial(f, el);
	}

	function noOp() {
		//return function (){};
	}
    
     function compare(f, a, b, o){
        return f(o[a], o[b]);
    }
	var utils = window.poloAF.Util,
		con = window.console.log.bind(window),
		$ = utils.$,
		ptL = _.partial,
		report = function (msg, el) {
			el = el || utils.getByTag('h2', document)[0];
			msg = undef(msg) ? document.documentElement.className : msg;
			el.innerHTML = msg;
		},
        anCr = utils.append(),
        anCrIn = utils.insert(),
        setAttrs = utils.setAttributes,
        klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		doVier = utils.curryFourFold(),
		klasTog = utils.toggleClass,
        getOrientation = ptL(compare, utils.gtThan, 'offsetHeight', 'offsetWidth'),
        mytarget = !window.addEventListener ? 'srcElement' : 'target',
		main = _.compose(utils.getZero, _.partial(utils.getByTag, 'main', document))(),
        gallery = utils.getNextElement(main.firstChild),
		doToggle = ptL(klasTog, 'alt', main),
		makeIterator = function (coll) {
			var prepIterator = doVier(window.poloAF.Iterator(false));
			return prepIterator(ptL(modulo, coll.length))(utils.always(true))(coll)(0);
		},
        adaptHandlers = function (subject, adapter, allpairs, override) {
			adapter = adapter || {};
			subject = subject || {};
			adapter = utils.simpleAdapter(allpairs, adapter, subject);
			adapter[override] = function () {
				subject.deleteListeners(subject);
			};
			return adapter;
		},
		handlerpair = ['addListener', 'deleteListeners'],
		renderpair = ['render', 'unrender'],
		makeElement = utils.machElement,
		adapterFactory = function () {
			//fresh instance of curried function per adapter
			//return doVier(adaptHandlers)('unrender')([renderpair, handlerpair.slice(0)])(poloAF.Composite());
            return doVier(adaptHandlers)('render')([renderpair, handlerpair.slice(0).reverse()])(poloAF.Composite());
		},
        //myrevadapter = doVier(adaptHandlers)('render')([renderpair, handlerpair.slice(0).reverse()])(poloAF.Composite()),
		getNodeName = utils.drillDown(['nodeName']),
		getID = utils.drillDown(['id']),
		getTarget = utils.drillDown([mytarget]),
		getLength = utils.drillDown(['length']),
        //getOrient = _.compose(utils.gtThan(getHeight, getWidth)
		allpics = utils.getByTag('img', main),
		neg = function (a, b) {
			return getLength(a) !== getLength(b);
		},
		negator = function (cb, a, b) {
			if (neg(a, b)) {
				cb();
				neg = _.negate(neg);
			}
		},
		doPortrait = function (el) {
			var m = getOrientation(el) ? 'addClass' : 'removeClass';
			utils[m]('portrait', utils.getDomParent(utils.getNodeByTag('li'))(el));
		},
		fixNoNthChild = _.compose(ptL(utils.doWhen, _.negate(utils.always(Modernizr.nthchild))), ptL(partial, doPortrait)),
		doPortraitLoop = ptL(_.each, allpics, fixNoNthChild),
		doPortraitBridge = function (e) {
			fixNoNthChild(e.target);
		},
		toogleLoop = _.compose(doPortraitLoop, doToggle),
        //clicker = touchevents ? ptL(utils.addHandler, 'touchend') : ptL(utils.addHandler, 'click'),
        clicker = ptL(utils.addHandler, 'click'),
		een = ['01', '02', '03', '09', '04', '05', '06', '07', '08', 24, 10, 11, 12, 13],
		advance = function () {
			var twee = [14, 15, 16, 17, 28, 33, 34, 35, 36, 43, 18, 19, 20, 21],/*mid six portrait*/
				drie = [22, 23, 25, 26, 47, 70, 82, 60, 67, 69, 27, 29, 30, 31],/*mid six portrait*/
				vyf = [50, 51, 53, 54, 55, 56, 57, 58, 59, 61, 62, 63],
				vier = [32, 37, 38, 39, 40, 41, 42, 44, 45, 46, 48, 49],
				ses = [64, 65, 66, 68, 71, 72, 73, 74, 75, 76, 77, 78],
				sewe = _.range(83, 97),/*mid six portrait*/
				iterator = makeIterator([een, twee, drie, vier, vyf, ses, sewe]),
				doNeg = ptL(negator, toogleLoop);
			return function (e) {
                var tgt = getTarget(e);
                if (!getNodeName(tgt).match(/a/i)) {
                    return;
                }      
					var m = getID(tgt).match(/back$/) ? 'back' : 'forward',
						gang = iterator[m](),
						allpics = utils.getByTag('img', main),
						path = '001';
					doNeg(allpics, gang);
					allpics = utils.getByTag('img', main);
					_.each(allpics, function (img, j) {
						path = gang[j] || path;
						img.src = "images/0" + path + ".jpg";
						img.onload = doPortraitBridge;
					});
			};
		},
<<<<<<< HEAD
		myadvance = advance();
    //report();
    //main.addEventListener('click', _.debounce(myadvance, 300));
	utils.addEvent(clicker, _.debounce(myadvance, 300))(main);
}('(min-width: 601px)', Modernizr.mq('only all'), Modernizr.touchevents));
=======
		myadvance = advance(),
        doInsert = ptL(anCrIn, gallery),
        addPageNavHandler = _.compose(utils.addEvent(clicker, _.debounce(myadvance, 300)), utils.getDomParent(utils.getNodeByTag('main'))),
        addPageNav = function(myAnCr, id, cb){
            return _.compose(adapterFactory(), cb, anCr(_.compose(ptL(klasAdd, 'pagenav'), ptL(setAttrs, {id: id, href: '.'}), myAnCr(main), utils.always('a'))), utils.always('span'))();  
        };
    /*inserts back/forward buttons, returns an REVERSE adpater around a eventListener object,
    where unrender would restore listener and render would remove listener when entering navigation mode
    HOWEVER events in gallery mode are not propagating to the main element so we can save the bother of that*/
        addPageNav(anCr, 'gal_forward', noOp),
        addPageNav(doInsert, 'gal_back', addPageNavHandler);
    utils.$('placeholder').innerHTML = 'PHOTOS'
}('(min-width: 601px)', Modernizr.mq('only all'), Modernizr.touchevents));

>>>>>>> gh-pages
