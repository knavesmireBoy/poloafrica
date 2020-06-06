var $ = function(str){
    return document.getElementById(str);
},
    $$ = function(tag, el, i){
        el = el || document;
        return el.getElementsByTagName(tag);
    };
window.addEventListener('load', function(e){
    var d = document.createElement('div');
    d.appendChild(document.createTextNode('div'));
    $('content').parentNode.insertBefore(d, $('content'));
});