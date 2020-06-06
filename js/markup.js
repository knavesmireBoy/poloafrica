/*jslint nomen: true */
/*global window: false */
/*global document: false */

var $ = function(str){
    return document.getElementById(str);
},
    
    Maker = function(tx, inp){
        var regex = /\[[^\]]+\]\[\d+\]/,
            endlink = /\[(\d)+\]:.+/g,
            i = 0,
            ws1 = /^\s+.+/,
            ws2 = /\s+$/,
            getReg = function(n){
                return new RegExp('\\[' + n + '\\]:');
            },
            getCurrent = function(){
              var ret = tx.value.match(endlink);
                return ret ? Number(ret[ret.length-1].slice(1,2))+1 : 1;
            },
            prepareId = function(str){
                if(str === inp.value){
                    return '{id=' + str.replace(/\s/g, '').toLowerCase() + '}';
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
        a = document.createElement('a');
    a.appendChild(document.createTextNode('LINK'));
    div.appendChild(a);
    a = document.createElement('a');
     a.appendChild(document.createTextNode('UNLINK'));
    div.addEventListener('click', linkeroo(Maker($('content'), $('title'))));
    div.appendChild(a);
    $('content').parentNode.insertBefore(div, $('content'));
});