/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global poloAF: false */
/*global _: false */
if (!window.poloAF) {
	window.poloAF = {};
}
var dum = {},
    utils = poloAF.Util,
    ptL = _.partial,
    invokemethod = function(o, arg, m) {
        return o[m](arg);
    },
	klasAdd = utils.addClass,
    doTwice = utils.curryTwice(),
    doThrice = utils.curryThrice(),
    headingmatch = doThrice(invokemethod)('match')(/h3/i),
    tgt = !window.addEventListener ? 'srcElement' : 'target',
    getTarget = utils.drillDown([tgt, 'parentNode']),
    isHeading = _.compose(headingmatch, utils.drillDown(['nodeName'])),
    main = document.getElementsByTagName('main')[0],
    articles = document.getElementsByTagName('article'),
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
    };
 utils.addHandler('click', bridge, main);
 dum[tgt] = articles[0].getElementsByTagName('a')[0];
 dum[tgt].parentNode = articles[0].getElementsByTagName('h3')[0];
 bridge(dum);

 var $sections = _.map(document.getElementsByTagName('section'), function(el){
        var $el = utils.machElement(ptL(klasAdd, 'display'), utils.always(el));
        $el.unrender = function(){};
        return $el;
    });

    poloAF.Util.setScrollHandlers($sections, doTwice(poloAF.Util.getScrollThreshold)(0.4), 'display');
    window.setTimeout($sections[0].render, 666);