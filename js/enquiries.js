/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global poloAF: false */
/*global _: false */
if (!window.poloAF) {
	window.poloAF = {};
}

function getResult(arg) {
	return _.isFunction(arg) ? arg() : arg;
}

function helper(ancor, tag, config) {
	var anCr = poloAF.Util.append();
	return makeElement(config, anCr(ancor), utils.always(tag)).render();
}

function reducer(tags) {
	return function(ancor, config, i, gang) {
		if (_.isArray(tags[i])) {
			return _.reduce(gang[i], reducer(tags[i]), ancor);
		}
		return helper(ancor, tags[i], config).getElement();
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

function existy(x) {
	return x != null;
}

function cat() {
	var head = _.first(arguments);
	if (existy(head)) {
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
	return function(v, k) {
		var errors = mapcat(function(isValid) {
			return isValid(k, v) ? [] : [k, isValid.message];
			//return isValid(k, v) ? [] : [new Message(k, v)];
		}, validators);
		return errors;
	};
}
var dum = {},
	utils = poloAF.Util,
	ptL = _.partial,
	comp = _.compose,
	invokemethod = function(o, arg, m) {
		return o[m] && o[m](arg);
	},
	makeElement = utils.machElement,
	setAttrs = utils.setAttributes,
	klasAdd = utils.addClass,
	klasRem = utils.removeClass,
	doWarning = ptL(klasAdd, 'warning'),
	undoWarning = ptL(klasRem, 'warning'),
	doTwice = utils.curryTwice(),
	doThrice = utils.curryThrice(),
	clicker = ptL(utils.addHandler, 'click'),
	submitter = ptL(utils.addHandler, 'submit'),
	headingmatch = doThrice(invokemethod)('match')(/h3/i),
	tgt = !window.addEventListener ? 'srcElement' : 'target',
	getTarget = utils.drillDown([tgt, 'parentNode']),
	getNext = ptL(simpleInvoke, utils, 'getNextElement'),
	getId = doThrice(invokemethod)('getAttribute')('id'),
	getFor = doThrice(invokemethod)('getAttribute')('for'),
	getNodeName = doTwice(getter)('nodeName'),
	isHeading = _.compose(headingmatch, getNodeName),
	main = document.getElementsByTagName('main')[0],
	articles = document.getElementsByTagName('article'),
	myform = document.forms[0],
	legend = myform.getElementsByTagName('legend')[0],
	isEmail = ptL(isEqual, 'email'),
	isName = ptL(isEqual, 'name'),
	isComment = ptL(isEqual, 'comments'),
	isLabel = ptL(isEqual, 'LABEL'),
	levelup = function(leveller) {
		return comp.apply(null, construct(leveller, _.rest(arguments)));
	},
	levelONE = ptL(levelup, utils.drillDown(['parentNode'])),
	levelTWO = ptL(levelup, utils.drillDown(['parentNode', 'parentNode'])),
	bridge = function(e) {
		var el = getTarget(e),
			myarticles = utils.getDomParent(utils.getNodeByTag('article'))(el),
			hit = myarticles && utils.getClassList(myarticles).contains('show');
		if (!isHeading(el)) {
			return;
		}
		_.each(articles, function(article) {
			utils.hide(article);
		});
		if (!hit) {
			utils.show(myarticles);
		}
	},
	relocate = function(e) {
		if (e.target.nodeName.toLowerCase() === 'legend') {
			window.location.assign("../admin");
		}
	},
	notEmpty = _.negate(_.isEmpty),
	preCon = function(pre, post) {
		return function(k, v) {
			return pre(k) ? post(v) : true;
		}
	},
	email_address = function(v) {
		return v.match(/^[\w][\w.-]+@[\w][\w.-]+\.[A-Za-z]{2,6}$/);
	},
	form_name = function(v) {
		return v.match(/\S+\s\S{2,}/);
	},
	comment_name = function(v) {
		return !(v.match(/Please use this area .*/i));
	},
	string_min = function(v) {
		return v.length > 15;
	},
	string_max = function(v) {
		return v.length < 1000;
	},
	clear = function() { //listener on textarea
		this.value = "";
		undoWarning(this);
	},
	//Use this area for comments or questions
	isNotEmptyComment = utils.validator('this is a required field', preCon(isComment, notEmpty)),
	isNewMessage = utils.validator('Please use this area for comments or questions', preCon(isComment, comment_name)),
	isSmallMessage = utils.validator('Message is very small, please elaborate', preCon(isComment, string_min)),
	isLargeMessage = utils.validator('Word count of your message is too great. Reduce word count or please email instead', preCon(isComment, string_max)),
	isProperName = utils.validator('please supply a first name and a last name', preCon(isName, form_name)),
	isEmptyName = utils.validator('this is a required field', preCon(isName, notEmpty)),
	isEmptyEmail = utils.validator('this is a required field', preCon(isEmail, notEmpty)),
	isEmailAddress = utils.validator('please supply an email address', preCon(isEmail, email_address)),
	doAlert = (function(el) {
		var orig = el.innerHTML,
			labels = _.filter(el.parentNode.childNodes, comp(isLabel, getNodeName)),
			sib = utils.drillDown(['parentNode', 'nextSibling']),
			fKid = utils.drillDown(['firstChild']);
		labels.push(comp(getNext, fKid, getNext, sib)(el));
		return function(msgs) {
			el.innerHTML = orig;
			_.each(labels, undoWarning);
			undoWarning(utils.$('warning'));
			if (msgs) {
				el.innerHTML = msgs[0][1];
				doWarning(el.parentNode.parentNode);
				var label = _.find(labels, function(node) {
					return (getFor(node) === msgs[0][0]) || (getId(node) === msgs[0][0]);
				});
				utils.doWhen(label, ptL(doWarning, label));
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
	dogsrc = {
		alt: "",
		src: "../images/resource/dog_gone.jpg"
	},
	catsrc = {
		alt: "",
		src: "../images/resource/cat_real_gone.jpg"
	},
	opt_dogsrc = {
		alt: "",
		src: "../images/resource/016.jpg"
	},
	opt_catsrc = {
		alt: "",
		src: "../images/resource/cat_gone.jpg"
	},
	fig1 = [ptL(klasAdd, ['dogs', 'bottom']), levelTWO(ptL(setAttrs, dogsrc))],
	fig2 = [ptL(klasAdd, ['cat', 'bottom']), levelTWO(ptL(setAttrs, catsrc))],
	opt_fig1 = [ptL(klasAdd, ['dogs', 'top']), levelTWO(ptL(setAttrs, opt_dogsrc))],
	opt_fig2 = [ptL(klasAdd, ['cat', 'top']), levelTWO(ptL(setAttrs, opt_catsrc))],
	mod = false,
    obj = {
        email: 'email',
        comments: 'comments'
    },
	listener = function(e) {
		
		if(Modernizr.cssgrid && Modernizr.cssanimations){
            getNodes(neue_nodes, ['figure', 'img'], 0);
            getNodes(neue_nodes, ['figure', 'img'], -1);
            mod = true;
		}
		
		var $tgt = makeElement(ptL(setAttrs, {
				id: 'response'
			}), utils.always(myform.parentNode)),
			//obj = utils.serializeObject(e.target),
			thx = utils.setText('Thankyou for your enquiry'),
			here = utils.setText('Here is your message:'),
			sent = utils.setText('An email has been sent to '),
			mailto = {
				href: "mailto:" + obj.email,
			},
			sender = [sent, levelTWO(ptL(setAttrs, mailto), utils.setText(obj.email))],
			messenger = [levelONE(here), levelTWO(ptL(klasAdd, 'msg'), utils.setText(obj.comments))],
			thanker = [_.identity, levelONE(thx)],
			response = reducer(neue_nodes),
			checker = validateForm(isEmptyName, isProperName, isEmptyEmail, isEmailAddress, isNotEmptyComment, isNewMessage, isSmallMessage, isLargeMessage),
			res = _.filter(_.map(obj, checker), function(ar) {
				return notEmpty(ar);
			}),
			config = [fig1, thanker, sender, messenger, fig2];
		if (mod) {
			config.splice(1, 0, opt_fig1);
			config.splice(6, 0, opt_fig2);
		}
		if (_.isEmpty(res)) {
			_.reduce(config, response, $tgt.render().getElement());
		} else {
            _.reduce(config, response, $tgt.render().getElement());
			//doAlert(res);
		}
	};
listener();
utils.addEvent(clicker, relocate)(legend);
utils.addEvent(submitter, listener)(myform);
utils.addHandler('click', bridge, main);
utils.addHandler('focus', clear, utils.getByTag('textarea', myform)[0]);
dum[tgt] = articles[0].getElementsByTagName('a')[0];
dum[tgt].parentNode = articles[0].getElementsByTagName('h3')[0];
bridge(dum);