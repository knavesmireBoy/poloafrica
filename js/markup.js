/*jslint nomen: true */
/*global window: false */
/*global poloAF: false */
/*global document: false */
/*global _: false */
if (!window.poloAF) {
	window.poloAF = {};
}
var utils = poloAF.Util,
        $ = function (str) {
			return document.getElementById(str);
		},
		ptL = _.partial,
        anCr = utils.append(),
        anCrIn = utils.insert(),
        setAttrs = utils.setAttributes,
        clicker = ptL(utils.addHandler, 'click'),
    doThrice = utils.curryThrice(),
    create = function (ancr, tag, txt) {
		if (!ancr || !txt) {
			return document.createElement('div');
		}
		var el = document.createElement(tag);
		if (txt) {
			el.appendChild(document.createTextNode(txt));
		}
		ancr.appendChild(el);
		return el;
	},
	isEqual = function (char) {
		return function (arg) {
			return arg === char;
		};
	},
    simpleInvoke = function (o, m, arg) {
		return o[m](arg);
	},
    findBoundary  = doThrice(simpleInvoke)(/\b\.?\s[A-Z]+/)('match'),
    findCap  = doThrice(simpleInvoke)(/[A-Z]+/)('match'),

	Maker = function (tx, inp) {
		var endlink = /\[(\d)+\]:.+/g,
			i = 0,
			getReg = function (n) {
				return new RegExp('\\[' + n + '\\]:');
			},
			getCurrent = function () {
				var ret = tx.value.match(endlink);
				return ret ? Number(ret[ret.length - 1].slice(1, 2)) + 1 : 1;
			},
			prepareId = function (str) {
				if (str === inp.value) {
					var ret = '{id=' + str.replace(/\s/g, '').toLowerCase() + '}';
					return ret.replace('the', '');
				}
				return '';
			},
			trimFrom = function (str, from) {
				if (/^\s+.+/.test(str)) {
					return from + 1;
				}
				return from;
			},
			trimTo = function (str, to) {
				if (/\s+$/.test(str)) {
					return to - 1;
				}
				return to;
			},
			fixFrom = function (tx, from, func) {
				var i = 0;
				while (!func(tx.value.slice(from - 1, from))) {
					i++;
					from -= 1;
				}
				return i;
			},
			fixTo = function (tx, to, func) {
				var i = 0;
				while (!func(tx.value.slice(to, to + 1))) {
					i++;
					to += 1;
				}
				return i;
			},
			isSelected = function (a, b) {
				return a != b;
			},
            
            charCount = function(str, char){
                var i = 0;
                if(!char){
                    return;
                }
                while (str.charAt(i) === char){
                    i+=1;
                }
                return i;
            },
            
            fixSelection = function(doFrom, doTo){
                doTo = doTo || doFrom;
                var from = tx.selectionStart,
					to = tx.selectionEnd,
					cur = tx.value.slice(from, to),
					selected = isSelected(from, to);
				if (selected) {
					from = trimFrom(cur, from);
					to = trimTo(cur, to);
					cur = tx.value.slice(from, to);
				}
				//expand selection
				from -= fixFrom(tx, from, doFrom);
				to += fixTo(tx, to, doTo);
                return {from: from, to: to};
            },
            setTextArea = function(from, to, cur){
                tx.value = tx.value.slice(0, from) + cur + tx.value.slice(to);
            },
			hasEmphasis = isEqual('*'),
			isSpace = isEqual(' '),
			isLine = isEqual('\n'),
			isStop = isEqual('.'),
            emphasis = /\**([^\*]+)\**/g,
            header = 0;
		return {
			link: function () {
				var res = window.prompt('Enter hyperlink'),
					mybreak = '\n[',
					from = tx.selectionStart,
					to = tx.selectionEnd,
					cur = tx.value.slice(from, to);
				if (!isSelected(from, to)) {
					return;
				}
				from = trimFrom(cur, from);
				to = trimTo(cur, to);
				if (res) {
					i = getCurrent(cur);
					mybreak = (i === 1) ? '\n\n[' : mybreak;
					tx.value = tx.value.slice(0, from) + '[' + tx.value.slice(from, to) + '][' + i + ']' + tx.value.slice(to) + mybreak + i + ']: ' + res + '{target=blank}' + prepareId(tx.value.slice(from, to));
				}
			},
			unlink: function () {
				tx.focus();
				var n,
					end,
					from = tx.selectionStart,
					to = tx.selectionEnd,
					cur = tx.value.slice(from, to);
				if (!isSelected(from, to)) {
					return;
				}
				from = trimFrom(cur, from);
				to = trimTo(cur, to);
				cur = tx.value.slice(from, to);
				n = cur.slice(-2, -1);
				end = tx.value.search(getReg(n));
				n = n === 1 ? 7 : 6;
				tx.value = tx.value.slice(0, from) + cur.slice(1, -4) + tx.value.slice(to);
                //setTextArea(from, to, cur.slice(1, -4))
				tx.value = tx.value.slice(0, end - n);
			},
            
            img: function(){
                var o = fixSelection(isLine),
                    from = o.from,
                    to = o.to,
                    cur = tx.value.slice(from, to),
                    res = window.prompt('Enter path to image'),
                    sep = /\//;
                if(res){
                    setTextArea(from, to, '!['+cur+']('+res+')');
                }
            },
			list: function () {
                var o = fixSelection(isLine, isLine),
                    from = o.from,
                    to = o.to;
                                
				if (!isSelected(from, to)) {
					return;
				}
				if (tx.value.slice(from, to).charAt(0) === '-') {
                    setTextArea(from, to, tx.value.slice(from-1, to).replace(/\n-\s?/g, '\n'))
				} else {
                    setTextArea(from, to, tx.value.slice(from-1, to).replace(/(\n)/g, '$1- '))
				}
			},
			bold: function () {
				var o = fixSelection(isSpace, isSpace),
                    from = o.from,
                    to = o.to,
                    cur = tx.value.slice(from, to);
                
				if (hasEmphasis(cur.charAt(0))) { //bold, italics, both
					if (!hasEmphasis(cur.charAt(1))) { //italics
                        setTextArea(from, to, cur.replace(emphasis, '***$1***'));
					} else if (hasEmphasis(cur.charAt(2))) { //bold italics
                        setTextArea(from, to, cur.replace(emphasis, '*$1*'));
					} else { //bold
                        setTextArea(from, to, cur.replace(emphasis, '$1'));
					}
				} else { //normal
                    setTextArea(from, to, '**' + cur + '**');
				}
                tx.focus();
			},
            
            ital: function(){
                var o = fixSelection(isSpace, isSpace),
                    from = o.from,
                    to = o.to,
                    cur = tx.value.slice(from, to);
                
               if (hasEmphasis(cur.charAt(0))) { //bold, italics, both
					if (!hasEmphasis(cur.charAt(1))) { //italics
                        setTextArea(from, to, cur.replace(emphasis, '$1'));
					} else if (hasEmphasis(cur.charAt(2))) { //bold italics
                        setTextArea(from, to, cur.replace(emphasis, '*$1*'));
					} else { //bold
                        setTextArea(from, to, cur.replace(emphasis, '***$1***'));
					}
				} else { //normal
                    setTextArea(from, to, '*' + cur + '*');
				}
                tx.focus();
            },
            quote: function(e){
                return;
                var o = fixSelection(isLine, findCap),
                    from = o.from,
                    to = o.to,
                    cur = tx.value.slice(from, to);
                tx.setSelectionRange(from, to);
                
                return;

                var o = fixSelection(isSpace, isSpace),
                    from = o.from,
                    to = o.to,
                    cur = tx.value.slice(from, to);
                setTextArea(from, to, cur.replace(emphasis, '“$1”'));
            },
            para: function(){
               var o,
                   res = window.confirm('Please check that the selected sentence ends with a FULL STOP. PERIOD...');
                if(res){
                o = fixSelection(isSpace, isStop);
                //advance cursor to keep period and space with pre-selected text
                setTextArea(o.from, o.to+2, tx.value.slice(o.from, o.to+2) + '\n\n');
                }
            },
            line: function(){
                var o = fixSelection(isSpace, isStop);
                //console.log(tx.value.slice(o.from, o.to));
                setTextArea(o.from, o.to+2, tx.value.slice(o.from, o.to+2) + '  \n');
            },
            heading: function(){
                var o = fixSelection(isLine);
                header = charCount(tx.value.slice(o.from, o.to), '#');
                header+=1;                
                if(header === 7){
                    setTextArea(o.from, o.to, '#' + tx.value.slice(o.from, o.to).replace(/#/g, '')); 
                    header = 1;
                }
                else {
                setTextArea(o.from, o.to, '#' + tx.value.slice(o.from, o.to));
                }
                tx.focus();
            },
            setCount: function (count) {
				this.count = count;
			},
		}; //ret
	},
	linkeroo = function (maker) {
		return function (e) {
            if(e.target.alt){
			var txt = e.target.alt.toLowerCase(),
				func = maker[txt];
			if (func) {
				func();
			}
            }
		};
	}
window.addEventListener('load', function () {    
        var controlsconf = {
					id: 'controls'
				},
        tags = ['HEADING', 'BOLD', 'ITAL', 'PARA', 'LINE', 'LINK', 'UNLINK', 'LIST'/*, 'QUOTE', 'IMG'*/],
        $el = utils.machElement(utils.addEvent(clicker, linkeroo(Maker($('content'), $('title')))), ptL(setAttrs, controlsconf), anCrIn($('content'), $('content').parentNode), utils.always('ul')),
         func = function(str){
        var mystr = str.toLowerCase(),
            path = '../images/resource/edit_'+mystr+'.png',
            conf = {src: path, alt: mystr},
            makeLI = _.compose(anCr($('controls')), utils.always('li'));
            _.compose(ptL(setAttrs, conf), anCr(makeLI), utils.always('img'))();
    };
    $el.render();
    _.each(tags, func);
});