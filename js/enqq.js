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

function helper(ancor, tag, config){
    var anCr = poloAF.Util.append();
    return makeElement(config, anCr(ancor), utils.always(tag)).render();
}


function reducer(tags){
    return function (ancor, config, i) {
        return helper(ancor, tags[i], config).getElement();
};
    }


function reducer(tags, confs){
    return function (ancor, config, i) {
         if(_.isArray(tags[i])){
                return _.reduce(confs, reducer(tags[i], confs), ancor);
            }
        return helper(ancor, tags[i], config).getElement();
};
    }



function appender(ancor, flag){
    return function(tags){
        return function (config, i) {
            return helper(ancor, tags[i], config);
};
    };
}


function appender(ancor){
    return function(tags, confs, subconfs){
        return function (config, i) {
            if(_.isArray(tags[i])){
                return _.reduce(confs, reducer(tags[i], subconfs), ancor);
            }
            return helper(ancor, tags[i], config);
        };
    };
}

var dum = {},
    utils = poloAF.Util,
    ptL = _.partial,
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
    makeLeafComp = function (obj) {
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
	};
//window.onload = prepareAjax;
//utils.addEvent(clicker, relocate)(legend);
//utils.addEvent(submitter, ptL(addParaPlus, anCr(document.forms[0].parentNode)))(document.forms[0]);
var outerdiv = ['img', ['div', 'h1', 'p', ['p', 'em'], 'p'], 'img'],
    thx = utils.setText('Thankyou for your enquiry'),
    here = utils.setText('Here is your message:'),
    sent = utils.setText('A message has been sent to'),
    children_config = [ptL(setAttrs, {alt:"", src: "../images/dogsform.gif"}), null, ptL(setAttrs, {alt:"", src: "../images/cat.jpg"})],
    //configs = [utils.drillDown(), ptL(klasAdd, 'msg'), ptL(setAttrs, {href: 'mailto:andrewsykes@btinternet.com'})],
    innerdiv_configs = [utils.drillDown(), _.compose(utils.drillDown(['parentNode']), thx), _.compose(utils.drillDown(['parentNode']), here), null, _.compose(ptL(klasAdd, 'msg'), utils.setText('hello'))],
    sub_config = [utils.drillDown(), _.compose(utils.drillDown(['parentNode']), ptL(utils.createTextNode, ':'), utils.drillDown(['parentNode']), sent)], 
    f = appender(myform.parentNode)(outerdiv, innerdiv_configs, sub_config);

_.each(children_config, f);
//_.reduce(configs, f, myform.parentNode);
//utils.addEvent(submitter, ptL(FFF(, myform.parentNode), ))(document.forms[0]);

utils.addHandler('click', bridge, main);
dum[tgt] = articles[0].getElementsByTagName('a')[0];
dum[tgt].parentNode = articles[0].getElementsByTagName('h3')[0];
bridge(dum);

 var $sections = _.map(document.getElementsByTagName('section'), function(el){
        var $el = utils.machElement(ptL(klasAdd, 'display'), utils.always(el));
        $el.unrender = function(){};
        return $el;
    });

//poloAF.Util.setScrollHandlers($sections, doTwice(poloAF.Util.getScrollThreshold)(0.4), 'display');
//window.setTimeout($sections[0].render, 666);