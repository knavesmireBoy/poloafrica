/*jslint nomen: true */
/*global window: false */
/*global poloAF: false */
/*global document: false */
/*global _: false */

function simpleInvoke(o, m, arg) {
		return o[m](arg);
	}
        function undef(x) {
		return typeof (x) === 'undefined';
	}
    var mq = Modernizr.mq('only all'),
        query = '(min-width: 668px)',
        touch = Modernizr.touchevents,
        utils = poloAF.Util,
        //con = window.console.log.bind(window),
        report = function (msg, el) {
			el = el || utils.getByTag('h2', document)[0];
			msg = undef(msg) ? document.documentElement.className : msg;
			el.innerHTML = msg;
		},
		ptL = _.partial,
		doTwice = utils.curryTwice(),
		doThrice = utils.curryThrice(),
        doMatch = doThrice(simpleInvoke)(/\d\)$/)('match'),
        number_reg = new RegExp('[^\\d]+(\\d+)[^\\d]+'),
		threshold = Number(query.match(number_reg)[1]),
        getEnvironment = (function () {
			if (mq) {
				return _.partial(Modernizr.mq, query);
			} else {
				return _.partial(utils.isDesktop, threshold);
			}
		}()),
        negater = function (alternator) {
			if (!getEnvironment()) {
				alternator();
				getEnvironment = _.negate(getEnvironment);
			}
		},
        command = (function(coll){
            var sub,
                repl = [];
            return {
            render: ptL(_.each, coll, function(a){
            var copy = utils.drillDown(['innerHTML'])(a);
            copy = copy.split('(');
            sub = doMatch(copy[1]) ? 1 : 7;
            a.innerHTML = copy[0];
                    repl.push(' '+copy[1].substring(copy[1].length - sub));
            a.setAttribute('title', copy[1].substring(0, copy[1].length - sub));
        }),
            unrender: function(){
             _.each(coll, function(a, i){
                if(!repl.length){return;}
                    a.innerHTML += ('(' + a.getAttribute('title') + repl[i])
                    a.setAttribute('title', '');
                });
                repl = [];
        }
            };
        }(_.compose(ptL(utils.getByTag, 'a'), utils.getZero, ptL(utils.getByTag, 'nav'))(utils.$('presslinks')))),
        setup = function(){
            var doAlt = utils.doAlternate(),
                toggler = doAlt([command.render, command.unrender]),
                handler = ptL(negater, toggler);
        utils.addHandler('resize', window, _.throttle(handler, 99));
        if(getEnvironment()){
            toggler();
        }
        else {
            getEnvironment = _.negate(getEnvironment);
        } 
        };
        try {
            if(!touch){
            command.render();
        }
        }
        catch(e){
            //report(e);
        }