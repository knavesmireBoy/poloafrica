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
            ws1 = /^\s+.+/,
            ws2 = /\s+$/,
            wrap = /.+\n+(.+)/g,
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
            }
        return {
            link: function(){
                var res = window.prompt('Enter hyperlink'),
                    mybreak = '\n[',
                    from = tx.selectionStart,
                    to = tx.selectionEnd,
                    cur = tx.value.slice(from, to);
                from = ws1.test(cur) ? from+=1 : from;
                to = ws2.test(cur) ? to-=1 : to;
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
                from = ws1.test(cur) ? from+=1 : from;
                to = ws2.test(cur) ? to-=1 : to;
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
                
                                                
                if(cur.charAt(0) === '-'){
                     tx.value = tx.value.slice(0, from) + tx.value.slice(from, to).replace(/^-/g, '\n') + tx.value.slice(to);
                     tx.value = tx.value.slice(0, from) + tx.value.slice(from, to).replace(/\n-/g, '\n') + tx.value.slice(to);
                }
                else {
                    tx.value = tx.value.slice(0, from) + tx.value.slice(from, to).replace(/(\n)/g, '$1- ') + tx.value.slice(to);
                }
            },
            setCount: function(count){
                this.count = count;
            }
        }
    },
    
    linkeroo = function(maker){
        return function(e){
            maker[e.target.innerHTML.toLowerCase()]();
        };
    }

window.addEventListener('load', function(){
    var div = document.createElement('div'),
        tags = ['LINK', 'UNLINK', 'ULIST', 'B'],
        prep = function(cb, ancr, tag){
            return function(txt){
                cb(ancr, tag, txt);
        };
        };
            tags.forEach(prep(create, div, 'a'));

div.addEventListener('click', linkeroo(Maker($('content'), $('title'))));
$('content').parentNode.insertBefore(div, $('content'));
});