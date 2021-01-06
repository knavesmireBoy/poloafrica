/*jslint nomen: true */
/*global window: false */
/*global document: false */
/*global Modernizr: false */
/*global poloAF: false */
/*global _: false */
(function (mq, query, touchevents, picnum, dummy, makePath) {
	"use strict";
    
     function LoopIterator() {
      this.group = group;
      this.position = 0;
      this.rev = false;
    }
    
    LoopIterator.prototype = {
    
    forward: function (flag) {
      if (!flag && this.rev) {
        return this.previous(true);
      }
      this.position++;
      this.position = this.position % this.group.members.length;
      let result = {
        value: this.group.members[this.position],
        index: this.position
      };
      return result;
    },
    back: function(flag) {
      if (!this.rev || flag) {
        this.group.members = this.group.members.reverse();
        this.position = this.group.members.length - 1 - (this.position);
        this.position = this.position % this.group.members.length;
        this.rev = !this.rev;
        return this.forward(this.rev);
      } else {
        return this.forward(this.rev);
      }
    },

    play: function() {
      return this.forward(true).value;
    },
        
    find: function(tgt) {
      this.position = this.group.members.findIndex(m => m === tgt);
      let result = {
        value: this.group.members[this.position],
        index: this.position
      };
      return result;
    }
  };

	function noOp() {}
    function always(val) {
		return function () {
			return val;
		};
	}
    
    function getResult(arg) {
		return _.isFunction(arg) ? arg() : arg;
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
    //https://medium.com/@dtipson/creating-an-es6ish-compose-in-javascript-ac580b95104a
    function eventing(type, actions, fn, el) {
        actions = actions || ['preventDefault'];
        
        function preventer(wrapped, e) {
            actions.forEach(function (a) {
                e[a]();
            });
            return wrapped(e);
        }
                
        fn = _.wrap(fn, preventer);
        el = getResult(el);
        return {
            render: function () {
                el.addEventListener(type, fn, false);
                return this;
            },
            unrender: function () {
                el.removeEventListener(type, fn, false);
                return this;
            },
            getEl: function(){
                return el;
            }
        };
    }
    
	var een = ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12, 13, 14],
		twee = _.range(15, 29),
		drie = _.range(29, 43),
		vier = _.range(43, 55),
		vyf = _.range(55, 67),
		ses = _.range(67, 79),
		sewe = _.range(79, 93),
		all = [een, twee, drie, vier, vyf, ses, sewe],
        
        utils = poloAF.Util,
		//con = window.console.log.bind(window),
		/*reporter = function (msg, el) {
			el = el || utils.getByTag('h2', document)[0];
			msg = undef(msg) ? document.documentElement.className : msg;
			el.innerHTML = msg;
		},
        */
		ptL = _.partial,
		anCr = utils.append(),
		anCrIn = utils.insert(),
		setAttrs = utils.setAttributes,
		klasAdd = utils.addClass,
		klasTog = utils.toggleClass,
        makeElement = utils.machElement,
		clicker = ptL(utils.addHandler, 'click'),
		getNodeName = utils.drillDown(['nodeName']),
		getID = utils.drillDown(['id']),
        getLength = utils.drillDown(['length']),
		mytarget = !window.addEventListener ? 'srcElement' : 'target',
        doVier = utils.curryFactory(4),
        main = document.getElementsByTagName('main')[0],
        thumbs = utils.getByClass('gallery')[0],
		gallery = utils.getNextElement(main.firstChild),
		//list_elements = thumbs.getElementsByTagName('li'),//needs to be a LIVE collection
		getTarget = utils.drillDown([mytarget]),
        allpics = utils.getByTag('img', main),
		getOrientation = ptL(compare, utils.gtThan, 'offsetHeight', 'offsetWidth'),
		
		negator = (function () {
           var neg = function (a, b) {
			return getLength(b) !== 14;
		}; 
            return function(cb, a, b){
			if (neg(a, b)) {
                cb();
				neg = _.negate(neg);
			}
			return b;
		};
        }()),
        doPortrait = function (el) {
			var m = getOrientation(el) ? 'addClass' : 'removeClass';
			utils[m]('portrait', utils.getDomParent(utils.getNodeByTag('li'))(el));
		},
        
		fixNoNthChild = _.compose(ptL(utils.doWhen, _.negate(utils.always(Modernizr.nthchild))), ptL(partial, doPortrait)),
		doPopulate = function (pagepics) {
			var path = '001';
			_.each(allpics, function (img, i) {
				path = pagepics[i] || path; //? default to avoid null
				img.src = makePath(path);
                //adds portrait class on browsers that don't support nth-child
				img.onload = function (e) {
                    fixNoNthChild(this);
                }
			});
		},
		$LI = (function (options) {
			return {
				exec: function () { //cb
					var action = options[0];
					_.each(_.last(thumbs.getElementsByTagName('li'), 2), this[action]);
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
        makeCrossPageIterator = function (coll) {
            var prepIterator = doVier(window.poloAF.Iterator(false));
            return prepIterator(ptL(modulo, coll.length))(utils.always(true))(coll)(0);
		},
		cross_page_iterator = makeCrossPageIterator(all),
		populate = _.compose(doPopulate, ptL(negator, _.compose(ptL(klasTog, 'alt', thumbs), _.bind($LI.exec, $LI)), allpics)),
		advanceRouteBridge = function (e) {
			if (!getNodeName(getTarget(e)).match(/a/i)) {
				return;
			}
			return getID(getTarget(e)).match(/back$/) ? 'back' : 'forward';
		},
		advanceRoute = function (m) {
			return m && populate(cross_page_iterator[m]());
		},
		advanceRouteListener = _.wrap(advanceRouteBridge, function (orig, e) {
			return advanceRoute(orig(e));
		}),
        addPageNav = function (myAnCr, id, cb) {
			var el = _.compose(cb, anCr(_.compose(ptL(klasAdd, 'pagenav'), ptL(setAttrs, {
				id: id,
				href: '.'
			}), myAnCr(main), utils.always('a'))))('span');
         //el.render();
            return el;
		},
		pageNavHandler = _.compose(ptL(eventing, 'click', null, _.debounce(advanceRouteListener, 300)), utils.getDomParent(utils.getNodeByTag('main'))),
        $nav = addPageNav(ptL(anCrIn, gallery), 'gal_back', pageNavHandler);
        addPageNav(anCr, 'gal_forward', function(){ return dummy; });
    $nav.render();
    _.each(allpics, fixNoNthChild);
	utils.$('placeholder').innerHTML = 'PHOTOS';
    
}(Modernizr.mq('only all'), '(min-width: 668px)', Modernizr.touchevents, new RegExp('[^\\d]+\\d(\\d+)[^\\d]+$'), {
            render: function(){},
            unrender: function(){}
        }, function (path) {
	"use strict";
    path = ''+path;
    var mypath = path.length < 3 ? "images/0"+path : "images/"+path;
	return mypath + ".jpg";
}));