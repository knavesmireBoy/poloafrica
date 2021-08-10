/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
if (!window.poloAF) {
	window.poloAF = {};
}
(function (mq, query) {
	"use strict";

	function viewBoxDims(s) {
		var a = s.split(' ').slice(-2);
		return [
			['width', a[0]],
			['height', a[1]]
		];
	}
    
    function spaceCount(str) {
        return _.isString(str) ? str.trim().split(" ").length - 1 : 1; 
    }

	function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
	}

	function reducer(tags) {
		return function (ancor, config, i, gang) {
			var anCr = poloAF.Util.append();
			if (_.isArray(tags[i])) {
				return _.reduce(gang[i], reducer(tags[i]), ancor);
			}
			return _.compose(config, anCr(ancor))(tags[i]);
		};
	}

	function getNodes(nodes, newnode, pos) {
		return newnode ? nodes.splice(pos, 0, newnode) : nodes;
	}

	function simpleInvoke(o, m, arg) {
		return o[m](arg);
	}

	function getter(o, k) {
		return o && o[k];
	}

	function isEqual(x, y) {
		return getResult(x) === getResult(y);
	}
    
    function gtThan(x, y) {
		return getResult(x) > getResult(y);
	}

	function cat() {
		var head = _.first(arguments);
		if (poloAF.Util.existy(head)) {
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

	function validateForm() {
		var validators = _.toArray(arguments);
		return function (v, k) {
			var errors = mapcat(function (isValid) {
				return isValid(k, v) ? [] : [k, getResult(isValid.message)];
				//return isValid(k, v) ? [] : [new Message(k, v)];
			}, validators);
			return errors;
		};
	}
	var dum = {},
		utils = poloAF.Util,
		PTL = _.partial,
		COMP = _.compose,
		invokemethod = function (o, arg, m) {
			return o[m] && o[m](arg);
		},
		klasAdd = utils.addClass,
		klasRem = utils.removeClass,
		doWarning = PTL(klasAdd, 'warning'),
		undoWarning = PTL(klasRem, 'warning'),
		doTwice = utils.curryFactory(2),
		doThrice = utils.curryFactory(3),
		doAlt = utils.doAlternate(),
		doMap = doTwice(utils.doMap),
        gtThanOne = doTwice(gtThan)(1),
        gtThanTwo = doTwice(gtThan)(2),
		event_actions = ['preventDefault', 'stopPropagation', 'stopImmediatePropagation'],
		eventer = utils.eventer,
		headingmatch = doThrice(invokemethod)('match')(/h3/i),
		tgt = !window.addEventListener ? 'srcElement' : 'target',
		getTarget = utils.drillDown([tgt, 'parentNode']),
		getNext = PTL(simpleInvoke, utils, 'getNextElement'),
		getId = doThrice(invokemethod)('getAttribute')('id'),
		getFor = doThrice(invokemethod)('getAttribute')('for'),
		getNodeName = doTwice(getter)('nodeName'),
		isHeading = COMP(headingmatch, getNodeName),
		main = document.getElementsByTagName('main')[0],
		articles = document.getElementsByTagName('article'),
		number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
		getEnvironment = PTL(utils.isDesktop, threshold),
		getSvgPath = utils.getDomChildDefer(utils.getNodeByTag('path'))(document.getElementsByTagName('svg')[0]),
		execMobile = COMP(PTL(klasRem, 'invisible'), getSvgPath),
		execDesktop = COMP(PTL(klasRem, 'invisible'), utils.getNext, getSvgPath),
		undoMobile = COMP(PTL(klasAdd, 'invisible'), getSvgPath),
		undoDesktop = COMP(PTL(klasAdd, 'invisible'), utils.getNext, getSvgPath),
		removeLabels = function (node) {
			utils.removeNodeOnComplete(utils.getNext(node));
			utils.removeNodeOnComplete(node);
		},
		doSvg = function (svg) {
			return function (str) {
				if (svg && str) {
					utils.doMap(svg, [
						['viewBox', str]
					]);
					//ipod ios(6.1.6) requires height
					if (!Modernizr.objectfit) {
						utils.doMap(svg, viewBoxDims(str));
					}
				}
			};
		},
		doSVGview = function () {
			var mq = window.matchMedia("(max-width: 667px)"),
				setViewBox = doSvg(document.getElementById('logo')),
				doMobile = COMP(execMobile, undoDesktop, _.partial(setViewBox, "0 0 155 130")),
				doDesktop = COMP(undoMobile, execDesktop, _.partial(setViewBox, "2 0 340 75"));
			return function () {
				if (mq.matches) { //onload
					doMobile();
				}
				return doAlt([doMobile, doDesktop]);
			};
		},
		negater = function (alternator) {
			//report();
			/*NOTE netrenderer reports window.width AS ZERO*/
			if (!getEnvironment()) {
				alternator();
				getEnvironment = _.negate(getEnvironment);
			}
		},
		myform = document.forms[0],
		legend = myform.getElementsByTagName('legend')[0],
		textarea = utils.findByTag(0)('textarea', myform),
		isEmail = PTL(isEqual, 'email'),
		isName = PTL(isEqual, 'name'),
		isComment = PTL(isEqual, 'comments'),
		isLabel = PTL(isEqual, 'LABEL'),
		levelup = function (leveller) {
			return COMP.apply(null, construct(leveller, _.rest(arguments)));
		},
		levelONE = PTL(levelup, PTL(utils.climbDom, 1)),
		levelTWO = PTL(levelup, PTL(utils.climbDom, 2)),
		mobileToggler = function (e) {
			var el = getTarget(e),
				myarticles = utils.getDomParent(utils.getNodeByTag('article'))(el),
				hit = myarticles && utils.getClassList(myarticles).contains('show');
			if (!isHeading(el)) {
				return;
			}
			_.each(articles, function (article) {
				utils.hide(article);
			});
			if (!hit) {
				utils.show(myarticles);
			}
		},
		notEmpty = _.negate(_.isEmpty),
        preCon = function (pre, post) {
			return function (k, v) {
                if (!pre(k)) {
                    return true;
                }
                /* we may need to determine the algorithm on the fly for instance a name could consist of two parts or three parts and each part must conform to certain rules we use utils.getBest to partially apply the argument (input string) to the predicate and action functions so post(v) could be a value or a function hence getResult*/
                return getResult(post(v));
			};
		},
		email_address = function (v) {
			return v.match(/^[\w][\w.\-]+@[\w][\w.\-]+\.[A-Za-z]{2,6}$/);
		},
		form_name = function (v) {
			return v.match(/[a-zA-Z]{2,}\.?\s[a-zA-Z]{2,}/);
		},
        form_name_three = function (v) {
			return v.match(/[a-zA-Z\.]{2,}\.?\s[a-zA-Z]+\s[a-zA-Z]{2,}/);
		},
        form_name_strict = function (v) {
			return v.match(/[A-Z][a-zA-Z]+\.*\s[A-Z][a-zA-Z]+/);
		},
        form_name_strict_three = function (v) {
			return v.match(/[A-Z][a-zA-Z]+\.?\s[A-Z][a-z]*\s[A-Z][a-zA-Z]{1,}/);
		},
		comment_name = function (v) {
			return !(v.match(/Please use this area \w*/i));
		},
		is_suspect = function (v) {
			return !new RegExp('<[^>]+>').test(v);
		},
		string_min = function (v) {
			return v.trim().length > 15;
		},
		string_max = function (v) {
			return v.trim().length < 1000;
		},
		clear = function () { //listener on textarea
			if (!utils.findByClass('warning')) {
				this.value = "";
			} else {
				undoWarning(this);
			}
		},
        checkSpacesStrict = PTL(utils.getBest, COMP(gtThanOne, spaceCount), [form_name_strict_three, form_name_strict]),
        checkSpaces = PTL(utils.getBest, COMP(gtThanOne, spaceCount), [form_name_three, form_name]),
		//Use this area for comments or questions
		isSuspect = utils.validator('suspicious angled brackets found', preCon(utils.always(true), is_suspect)),
		isNotEmptyComment = utils.validator('this is a required field', preCon(isComment, notEmpty)),
		isNewMessage = utils.validator('Please write your own message', preCon(isComment, comment_name)),
		isSmallMessage = utils.validator('Message is very small, please elaborate', preCon(isComment, string_min)),
		isLargeMessage = utils.validator('Word count of your message is too great. Reduce word count or please email instead', preCon(isComment, string_max)),
        atLeastFourWords = utils.validator('message shoud consist of at least four words', preCon(isComment, COMP(gtThanTwo, spaceCount))),
		isProperName = utils.validator('Expect at least 2 characters for first and last names', preCon(isName, checkSpaces)),
		isProperNameStrict = utils.validator('please Capitalise your individual name parts', preCon(isName, checkSpacesStrict)),
		isEmptyName = utils.validator('this is a required field', preCon(isName, notEmpty)),
		isEmptyEmail = utils.validator('this is a required field', preCon(isEmail, notEmpty)),
		isEmailAddress = utils.validator('please supply an email address', preCon(isEmail, email_address)),
		
		doAlert = (function (el) {
			var orig = el.innerHTML,
				labels = _.filter(el.parentNode.childNodes, COMP(isLabel, getNodeName)),
				sib = utils.drillDown(['parentNode', 'nextSibling']),
				fKid = utils.drillDown(['firstChild']);
			labels.push(COMP(getNext, fKid, getNext, sib)(el));
			return function (msgs) {
				el.innerHTML = orig;
				_.each(labels, undoWarning);
				undoWarning(utils.$('warning'));
                //console.log(msgs[0], msgs[1]);
				if (msgs) {
					el.innerHTML = msgs[0][1];
					doWarning(el.parentNode.parentNode);
					var label = _.find(labels, function (node) {
						return (getFor(node) === msgs[0][0]) || (getId(node) === msgs[0][0]);
					});
					utils.doWhen(label, PTL(doWarning, label));
				}
			};
		}(legend)),
		neue_nodes = [
			['figure', 'img'],
			['div', 'h1'],
			['p', 'a'],
			['p', 'p'],
			['figure', 'img']
		],
		myalt = ['alt', ''],
		mysrc = ['src'],
		dogsrc = mysrc.slice().concat("../images/resource/dog_gone.jpg"),
		catsrc = mysrc.slice().concat("../images/resource/cat_real_gone.jpg"),
		opt_dogsrc = mysrc.slice().concat("../images/resource/dogs.jpg"),
		opt_catsrc = mysrc.slice().concat("../images/resource/cat_gone.jpg"),
		fig1 = [PTL(klasAdd, ['dogs', 'bottom']), levelTWO(doMap([myalt, dogsrc]))],
		fig2 = [PTL(klasAdd, ['cat', 'bottom']), levelTWO(doMap([myalt, catsrc]))],
		opt_fig1 = [PTL(klasAdd, ['dogs', 'top']), levelTWO(doMap([myalt, opt_dogsrc]))],
		opt_fig2 = [PTL(klasAdd, ['cat', 'top']), levelTWO(doMap([myalt, opt_catsrc]))],
		/*
		obj = {
			email: 'email',
			comments: 'comments'
		},
        */
		listener = function (e) {
			//splice ino neue_nodes
			var $tgt = PTL(utils.doMap, myform.parentNode, [
					['id', 'response']
				]),
				obj = utils.serializeObject(e[tgt]),
				thx = doMap([
					['txt', 'Thankyou for your enquiry']
				]),
				here = doMap([
					['txt', 'Here is your message:']
				]),
				sent = doMap([
					['txt', 'An email has been sent to ']
				]),
				sender = [sent, levelTWO(doMap([
					['txt', obj.email],
					['href', "mailto:" + obj.email]
				]))],
				messenger = [levelONE(here), levelTWO(PTL(klasAdd, 'msg'), doMap([
					['txt', obj.comments]
				]))],
				thanker = [_.identity, levelONE(thx)],
				response = reducer(neue_nodes),
				checker = validateForm(isSuspect, isEmptyName, isProperName, isProperNameStrict, isEmptyEmail, isEmailAddress, isNotEmptyComment, isNewMessage, isSmallMessage, isLargeMessage, atLeastFourWords),
                res = _.filter(_.map(obj, checker), function (ar) {
                    return notEmpty(ar);
				}),
                config = [fig1, thanker, sender, messenger, fig2];
			if (_.isEmpty(res)) {
				if (Modernizr.cssgrid && Modernizr.cssanimations) {
					getNodes(neue_nodes, ['figure', 'img'], 0);
					getNodes(neue_nodes, ['figure', 'img'], -1);
					config.splice(1, 0, opt_fig1);
					config.splice(6, 0, opt_fig2);
				}
				_.reduce(config, response, $tgt());
				utils.removeNodeOnComplete(myform);
				utils.removeNodeOnComplete(utils.$('cat').parentNode);
			} else {
				doAlert(res);
			}
		},
		svg_handler = PTL(negater, doSVGview()());
	//listener();
	eventer('submit', event_actions.slice(0, 1), listener, myform).execute();
	eventer('click', [], mobileToggler, main).execute();
	eventer('focus', [], _.bind(clear, textarea), textarea).execute();
	dum[tgt] = articles[0].getElementsByTagName('a')[0];
	svg_handler();
	eventer('resize', [], _.throttle(svg_handler, 99), window).execute();
	_.each(_.toArray(utils.getByClass('read-more-state')), removeLabels);
	mobileToggler(dum); //can run in "desktop" environment with no ill effects, toggles display of sections for mobile devices    
    _.compose(PTL(utils.removeClass, 'nojs'), PTL(utils.findByClass, 'no-js'))();
    //utils.report();
}(Modernizr.mq('only all'), '(min-width: 667px)'));