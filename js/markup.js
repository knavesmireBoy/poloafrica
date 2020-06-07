/*jslint nomen: true */
/*global window: false */
/*global document: false */

var $ = function(str){
    return document.getElementById(str);
},
    create = function(ancr, tag, txt){
        if(!ancr || ! txt){
           return document.createElement('div');
        }
    var el = document.createElement(tag);
        if(txt){
            el.appendChild(document.createTextNode(txt));
        }
        ancr.appendChild(el);
        return el;
    },
    
    Maker = function(tx, inp){
        var endlink = /\[(\d)+\]:.+/g,
            i = 0,
            getReg = function(n){
                return new RegExp('\\[' + n + '\\]:');
            },
            getCurrent = function(){
              var ret = tx.value.match(endlink);
                return ret ? Number(ret[ret.length-1].slice(1,2))+1 : 1;
            },
            prepareId = function(str){
                if(str === inp.value){
                   var ret = '{id=' + str.replace(/\s/g, '').toLowerCase() + '}';
                    return ret.replace('the', '');
                }
                return '';
            },
            fixFrom = function(str, from){
                if(/^\s+.+/.test(str)){
                    return from+1;
                }
                return from;
            },
            fixTo = function(str, to){
                if(/\s+$/.test(str)){
                    return to-1;
                }
                return to;
            },
            isSelected = function(a, b){
                return a != b;
            };
        return {
            link: function(){
                var res = window.prompt('Enter hyperlink'),
                    mybreak = '\n[',
                    from = tx.selectionStart,
                    to = tx.selectionEnd,
                    cur = tx.value.slice(from, to);
                
                 if(!isSelected(from, to)){
                    return;
                }
                
                from = fixFrom(cur, from);
                to = fixTo(cur, to);
                if(res){
                    i = getCurrent(cur);
                    mybreak = (i === 1) ? '\n\n[' : mybreak;
                    tx.value = tx.value.slice(0, from) + '[' + tx.value.slice(from, to) + '][' +i + ']' + tx.value.slice(to) +
                        mybreak + i +']: '+ res + '{target=blank}' +   prepareId(tx.value.slice(from, to));
                }
                
            },
            unlink: function(){
                tx.focus();                
                var n,
                    end,
                    from = tx.selectionStart,
                    to = tx.selectionEnd,
                    cur = tx.value.slice(from, to);
                
                 if(!isSelected(from, to)){
                    return;
                }
                
                
                from = fixFrom(cur, from);
                to = fixTo(cur, to);
                cur = tx.value.slice(from, to);
                n = cur.slice(-2, -1);
                end = tx.value.search(getReg(n));
                n = n === 1 ? 7 : 6;
                tx.value = tx.value.slice(0, from) + cur.slice(1, -4) + tx.value.slice(to);
                tx.value = tx.value.slice(0, end-n);
            },
            ulist: function(){
                var from = tx.selectionStart,
                    to = tx.selectionEnd,
                    cur = tx.value.slice(from, to);
                
                 if(!isSelected(from, to)){
                    return;
                }
                                                
                if(cur.charAt(0) === '-'){
                     tx.value = tx.value.slice(0, from) + tx.value.slice(from, to).replace(/^-/g, '\n') + tx.value.slice(to);
                     tx.value = tx.value.slice(0, from) + tx.value.slice(from, to).replace(/\n-/g, '\n') + tx.value.slice(to);
                }
                else {
                    tx.value = tx.value.slice(0, from) + tx.value.slice(from, to).replace(/(\n)/g, '$1- ') + tx.value.slice(to);
                }
            },
            
            bold: function(){
                var from = tx.selectionStart,
                    to = tx.selectionEnd,
                    cur = tx.value.slice(from, to);
                
                
                 if(!isSelected(from, to)){
                    return;
                }
                
                from = fixFrom(cur, from);
                to = fixTo(cur, to);
                cur = tx.value.slice(from, to);
                                
                if(cur.charAt(0) === '*'){
                     tx.value = tx.value.slice(0, from) + cur.replace(/^\*\*(.+)\*\*$/g, '$1') + tx.value.slice(to);
                }
                else {
                    tx.value = tx.value.slice(0, from) + '**' + cur + '**' + tx.value.slice(to);
                }
            },
            
            italics: function(){
                var lookahead,
                    lookbehind,
                    res,
                    from = tx.selectionStart,
                    to = tx.selectionEnd,
                    cur = tx.value.slice(from, to);
                
                 if(!isSelected(from, to)){
                    return;
                }
                
                from = fixFrom(cur, from);
                to = fixTo(cur, to);
                cur = tx.value.slice(from, to);
               
                //lookahead = tx.value.slice(from, to+1);
                ///lookbehind = tx.value.slice(from-1, to);
                //res = lookahead.match(new RegExp(cur.substr(-1) + '(?=\\*)'))[0];
               //lookbehind.match(new RegExp(cur.substr(1) + '(?<=\\*)'));
                
                
                if(cur.charAt(0) === '_' || cur.charAt(0) === '*'){
                    if(cur.match(/_/)){
                     tx.value = tx.value.slice(0, from) + cur.replace(/^(\**)_(.+)_(\**)$/g, '$1$2$3') + tx.value.slice(to);
                    }
                    else {
                      tx.value = tx.value.slice(0, from) + '_' + cur + '_' + tx.value.slice(to);  
                    }
                }
                else {
                    tx.value = tx.value.slice(0, from) + '_' + cur + '_' + tx.value.slice(to);
                }
                
            },
            
            setCount: function(count){
                this.count = count;
            }
        };//ret
    },
    
    linkeroo = function(maker){
        return function(e){
           var txt = e.target.innerHTML.toLowerCase(),
               func = maker[txt];
            if(func){
                func();
            }
        };
    }

window.addEventListener('load', function(){
    var div = document.createElement('div'),
        tags = ['LINK', 'UNLINK', 'ULIST', 'BOLD', 'ITALICS'],
        prep = function(cb, ancr, tag){
            return function(txt){
                cb(ancr, tag, txt);
        };
        };
            tags.forEach(prep(create, div, 'a'));

div.addEventListener('click', linkeroo(Maker($('content'), $('title'))));
$('content').parentNode.insertBefore(div, $('content'));
});