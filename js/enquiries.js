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

function go(ancor) {
	if (!ancor.getElement()) {
		return ancor.render().getElement();
	}
	return ancor.getElement();
}

function helper(ancor, tag, config) {
	var anCr = poloAF.Util.append();
	return makeElement(config, anCr(ancor), utils.always(tag)).render();
}

function reducer(tags) {
    return function (ancor, config, i, gang) {
		if (_.isArray(tags[i])) {
			return _.reduce(gang[i], reducer(tags[i]), ancor);
		}
		return helper(ancor, tags[i], config).getElement();
	};
}

var dum = {},
	utils = poloAF.Util,
	ptL = _.partial,
	comp = _.compose,
	invokemethod = function(o, arg, m) {
		return o[m](arg);
	},
	makeElement = utils.machElement,
	anCr = utils.append(),
	setAttrs = utils.setAttributes,
	klasAdd = utils.addClass,
	doThrice = utils.curryThrice(),
	clicker = ptL(utils.addHandler, 'click'),
	submitter = ptL(utils.addHandler, 'submit'),
	headingmatch = doThrice(invokemethod)('match')(/h3/i),
	tgt = !window.addEventListener ? 'srcElement' : 'target',
	getTarget = utils.drillDown([tgt, 'parentNode']),
	isHeading = _.compose(headingmatch, utils.drillDown(['nodeName'])),
	main = document.getElementsByTagName('main')[0],
	articles = document.getElementsByTagName('article'),
	myform = document.forms[0],
	legend = myform.getElementsByTagName('legend')[0],
	makeLeafComp = function(obj) {
		return _.extend(poloAF.Composite(), obj);
	},
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
	displayLoading = function(ancor) {
		return makeElement(ptL(klasAdd, 'loading'), ptL(setAttrs, {
			alt: 'loading',
			src: "../images/resource/progressbar.gif"
		}), anCr(ancor), utils.always('img'));
	},
	prepareAjax = function() {
		var xhr = poloAF.Hijax();
		xhr.setContainer(document.forms[0]);
		xhr.setCanvas(utils.$('post'));
		xhr.setUrl("action.php");
		/*
        xhr.setLoading(function() {
			displayLoading(utils.$('post')).render();
		});
        
		xhr.setCallback(function() {
			utils.fadeUp(utils.$('post'), 255, 255, 204);
		});
        */
		xhr.captureData();
	},
	relocate = function(e) {
		if (e.target.nodeName.toLowerCase() === 'legend') {
			window.location.assign("../admin");
		}
	},
    obj = {
        email: 'email',
        comments: 'comments'
    },
	//window.onload = prepareAjax;
	//utils.addEvent(clicker, relocate)(legend);
	listener = function(e) {      
		var $tgt = makeElement(ptL(setAttrs, {
				id: 'response'
			}), utils.always(myform.parentNode)),
            //obj = utils.serializeObject(e.target),
			neue_nodes = [['figure', 'img'], ['div', 'h1'], ['p', 'a'],['p', 'p'],  ['figure', 'img']],
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
			email2 = "mailto:"+obj.email,
            fig1 = [ptL(klasAdd, ['dogs', 'bottom']), comp(getParent2, ptL(setAttrs, dogsrc))],
            fig2 = [ptL(klasAdd, ['cat', 'bottom']), comp(getParent2, ptL(setAttrs, catsrc))],
            sub_config = [sent, _.compose(getParent2, ptL(setAttrs, {
				href: email2
			}), email1)],
            post_sub_config = [_.compose(getParent, here), comp(getParent2, ptL(klasAdd, 'msg'), hiya)],
            innerdiv_configs = [getCurrent, _.compose(getParent, thx)],
            children_config = [fig1, innerdiv_configs, sub_config, post_sub_config, fig2],
            response = reducer(neue_nodes);
			_.reduce(children_config, response, $tgt.render().getElement());
	};
listener();
utils.addEvent(submitter, listener)(myform);
utils.addHandler('click', bridge, main);
dum[tgt] = articles[0].getElementsByTagName('a')[0];
dum[tgt].parentNode = articles[0].getElementsByTagName('h3')[0];
bridge(dum);
var $sections = _.map(document.getElementsByTagName('section'), function(el) {
	var $el = utils.machElement(ptL(klasAdd, 'display'), utils.always(el));
	$el.unrender = function() {};
	return $el;
});
//poloAF.Util.setScrollHandlers($sections, doTwice(poloAF.Util.getScrollThreshold)(0.4), 'display');
//window.setTimeout($sections[0].render, 666);