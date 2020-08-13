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

function simpleInvoke(o, m, arg) {
	return o[m](arg);
}

function getter(o, k) {
	return o && o[k];
}

function isEqual(x, y) {
	return getResult(x) === getResult(y);
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
		return !(v.match(/Use this area for comments or questions/));
	},
	clear = function() {//listener on textarea
		this.value = "";
		undoWarning(this);
	},
	//Use this area for comments or questions
	isNotEmptyComment = utils.validator('this is a required field', preCon(isComment, notEmpty)),
	isNewMessage = utils.validator('please supply your comment or question', preCon(isComment, comment_name)),
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
				if (label) {
					doWarning(label);
				}
			}
		};
	}(legend)),
	listener = function(e) {
		var $tgt = makeElement(ptL(setAttrs, {
				id: 'response'
			}), utils.always(myform.parentNode)),
			obj = utils.serializeObject(e.target),
			neue_nodes = [
				['figure', 'img'],
				['div', 'h1'],
				['p', 'a'],
				['p', 'p'],
				['figure', 'img']
			],
			thx = utils.setText('Thankyou for your enquiry'),
			here = utils.setText('Here is your message:'),
			sent = utils.setText('An email has been sent to '),
			hiya = utils.setText(obj.comments),
			email1 = utils.setText(obj.email),
			dogsrc = {
				alt: "",
				src: "../images/resource/dog_gone.jpg"
			},
			catsrc = {
				alt: "",
				src: "../images/resource/cat_real_gone.jpg"
			},
			getParent = utils.drillDown(['parentNode']),
			getParent2 = utils.drillDown(['parentNode', 'parentNode']),
			getCurrent = utils.drillDown(),
			email2 = "mailto:" + obj.email,
			fig1 = [ptL(klasAdd, ['dogs', 'bottom']), comp(getParent2, ptL(setAttrs, dogsrc))],
			fig2 = [ptL(klasAdd, ['cat', 'bottom']), comp(getParent2, ptL(setAttrs, catsrc))],
			sub_config = [sent, _.compose(getParent2, ptL(setAttrs, {
				href: email2
			}), email1)],
			post_sub_config = [_.compose(getParent, here), comp(getParent2, ptL(klasAdd, 'msg'), hiya)],
			innerdiv_configs = [getCurrent, _.compose(getParent, thx)],
			children_config = [fig1, innerdiv_configs, sub_config, post_sub_config, fig2],
			response = reducer(neue_nodes),
			checker = utils.simple_conditional(isEmptyName, isProperName, isEmptyEmail, isEmailAddress, isNotEmptyComment, isNewMessage),
			res = _.filter(_.map(obj, checker), function(ar) {
				return notEmpty(ar);
			});
		if (_.isEmpty(res)) {
			_.reduce(children_config, response, $tgt.render().getElement());
		} else {
			doAlert(res);
		}
	};
utils.addEvent(clicker, relocate)(legend);
utils.addEvent(submitter, listener)(myform);
utils.addHandler('click', bridge, main);
utils.addHandler('focus', clear, utils.getByTag('textarea', myform)[0]);
dum[tgt] = articles[0].getElementsByTagName('a')[0];
dum[tgt].parentNode = articles[0].getElementsByTagName('h3')[0];
bridge(dum);