<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Article.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Asset.php';
include_once '../myconfig.php';
$results = ['page_title' => 'Medley'];
$style = 'medley';
include "../templates/header.php";
?>
<?php
$articles = Article::getListByPage(7);
$count = 0;
?>
<body id="medley">
	<div id="wrap">
         <header>
             <a href=".">
			<h1>POLOAFRICA<img src="../images/logo_alt.png"></h1></a>
                <nav id="main_nav">
                    <label class="menu" for="menu-toggle"></label>
                <input id="menu-toggle" type="checkbox">
			<ul id="nav">
				<li><a href="..">home</a></li>				
				<li><a href="../trust">the trust</a></li>
				<li><a href="../scholars">the scholars</a></li>				
				<li><a href="../place">the place</a></li>				
				<li><a href="../stay">your stay</a></li>		
				<li><a href="../polo">polo</a></li>
				<li><a href=".">medley</a>
					<ul id="med"> 
						<li><a href="#laureus">laureus</a></li>					
						<li><a href="#community">community</a></li>
						<li><a href="#beekeeping">beekeeping</a></li>
						<li><a href="#onfarm">activities on the farm</a></li>
						<li><a href="#offfarm">activities around the farm</a></li>
						<li><a href="#press">press</a></li>
						<li><a href="#TV">TV</a></li>	
						<li><a href="#useful_links">links</a></li>
					</ul></li>					
				<li><a href="../enquiries">enquiries</a></li>					
				<li><a href="../photos" target="_top">photos</a></li>
			</ul></nav></header>
		<h2><span>medley</span></h2>
		<main class="override">
            <?php
            foreach ($articles as $article){
                $count += 1;
                include '../templates/article.php';
            } ?>
			
		</main></div>
   <?php include '../templates/footer.php'; ?>
    <script src="../js/viewportSize.js"></script>
    <script src="../js/underscore.js"></script>
    <script src="../js/eventing.js"></script>
    <script src="../js/classlist.js"></script>
    <script src="../js/global.js"></script>
    <script src="../js/finder.js"></script>
    <script>
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
            report(e);
        }        
    </script>
    <?php echo '</body></html>';