/*jslint nomen: true */
/*global window: false */
/*global poloAF: false */
/*global _: false */
if (!window.poloAF) {
	window.poloAF = {};
}
poloAF.Iterator = function (rev) {
	"use strict";
	return function (index, coll, validate, doAdvance) {
		var loop = function (bool) {
				if (!bool) {
					index = poloAF.Util.doWhen(validate, _.partial(doAdvance, index += 1));
				}
				//document.getElementsByTagName('h2')[0].innerHTML = index;
				return index;
			},
			switchDirection = function () {
				//console.log('sw..')
				coll = poloAF.Util.reverse(coll);
				//coll.reverse();
				index = coll.length - 1 - index;
				rev = !rev;
			},
			isReversed = function () {
				return (rev === true);
			},
			getnext = function (isRev, bool) {
				//console.log('next..', isRev())
				poloAF.Util.doWhen(isRev(), switchDirection);
				return coll[loop(bool)];
			},
			getNow = function (bool) {
				return coll[loop(bool)];
			},
			forward = _.partial(getnext, isReversed),
			back = _.partial(getnext, _.negate(isReversed)),
			invoke = function (bool) {
				//console.log('invoke..')
				return poloAF.Util.getBest(isReversed, [_.bind(back, null, bool), _.bind(forward, null, bool)])();
			},
			ret = {
				forward: forward,
				back: back,
				getCurrent: _.partial(getNow, true),
				getNext: invoke,
				getIndex: function () {
					return index;
				},
				setIndex: function (i) {
					index = i;
				},
				getLength: function () {
					return coll.length;
				},
				getCollection: function () {
					return coll;
				},
				setCollection: function (coll) {
					this.coll = coll;
				}
			};
		if (rev) {
			switchDirection();
		}
		return ret;
	};
};
poloAF.Composite = (function () {
	"use strict";

	function noOp() {}

	function isFalse(i) {
		return !i && _.isBoolean(i);
	}

	function isTrue(i) {
		return i && _.isBoolean(i);
	}
	return function (included) {
		var intafaces = _.rest(arguments),
			/*, intafaces..*/
			j,
			k,
			comp_intaface = poloAF.Intaface('Composite', ['add', 'remove', 'get', 'find']),
			leaf = {
				add: noOp,
				remove: noOp,
				get: noOp,
				find: noOp,
				render: noOp,
				unrender: noOp
			},
			composite,
			tmp,
			comp_add = function (comp) {
				intafaces.unshift(comp);
				poloAF.Intaface.ensures.apply(poloAF.Intaface, intafaces);
				var m = comp.head ? 'unshift' : 'push';
				included[m](intafaces.shift(comp));
				comp.parent = this;
			},
			comp_remove = function (comp) {
				if (!comp) {
					_.each(included, function (comp) {
						comp.remove();
					});
					included = [];
					return this;
				} else {
					included = _.filter(included, function (n_comp) {
						if (n_comp !== comp) {
							return n_comp;
						}
					});
					return comp;
				}
			},
			comp_get = function (i) {
				//console.log('recent', i)
				if (_.isNull(i) && !isNaN(k)) {
					return included[k];
				}
				if (_.isNull(i)) {
					return included;
				}
				var j = isTrue(i) ? 0 : isFalse(i) ? included.length - 1 : !isNaN(i) ? i : undefined,
					ret = !isNaN(j) ? included[j] : included;
				k = !isNaN(j) ? j : k; //store current
				return ret;
			},
			comp_find = function (m, e) {
				return _[m](included, function (member) {
					return member.find && member.find(e);
				});
			},
			doAdd = function (comp) {
				try {
					comp_add.call(composite, comp);
				} catch (er) {
					try {
						comp_add(_.extend(leaf, comp));
					} catch (error) {
						noOp();
					}
				}
				return comp;
			},
			render = function () {
				var args = _.toArray(arguments);
				_.each(included, function (member) {
                    if(member.render){
                       member.render.apply(member, args.concat(_.rest(arguments)));
                       }
				});
			},
			unrender = function () {
				var args = _.toArray(arguments);
				_.each(included, function (member) {
					if(member.unrender){
                       member.unrender.apply(member, args.concat(_.rest(arguments)));
                       }
				});
			};
		intafaces.unshift(comp_intaface);
		if (included && _.isArray(included)) {
			composite = {
				add: doAdd,
				addAll: function () {
					_.each(_.toArray(arguments), doAdd);
				},
				remove: comp_remove,
				get: comp_get,
				find: comp_find,
				included: included,
				render: render,
				unrender: unrender,
				current: function () {
					return included[j] || included;
				}
			};
			if (included.length) {
				//copy and empty included; establish contents conform to interface
				tmp = included.slice();
				included = [];
				_.each(tmp, function (comp) {
					doAdd(comp);
				});
			}
		}
		return composite || leaf;
	}; //ret func
}());