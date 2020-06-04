<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Article.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Asset.php';
include_once '../myconfig.php';
$results = ['page_title' => 'Welcome'];
$style = 'home';
include "../templates/header.php";
$articles = Article::getListByPage($style);
$count = 0;
?>
<body id="home">
	<div id="wrap">
		 <header>
            <a href=".">
			<h1>POLOAFRICA<img src="../images/logo_alt.png"></h1></a>
			<nav id="main_nav">
                <label class="menu" for="menu-toggle"></label>
                <input id="menu-toggle" type="checkbox">
                <ul id="nav">
				<li><a href=".">home</a>
					<ul>
						<li><a href="#come">the poloafrica development trust</a>
						<li><a href="#ufarm">the uitgedacht experience</a>
						<li><a href="#tour">the polo 150 tour</a>
					</ul>
				<li><a href="trust">the trust</a>
				<li><a href="scholars">the scholars</a>
				<li><a href="place">the place</a>				
				<li><a href="stay">your stay</a>		
				<li><a href="polo">polo</a>				
				<li><a href="medley">medley</a>
				<li><a href="enquiries">enquiries</a>
				<li><a href="photos">photos</a>
			</ul></nav>
            </header>
		<h2><span>polo in africa</span></h2>
        <main class="override">
			    <?php
            foreach ($articles as $article){
                $count += 1;
                if(!$article->summary){
                include '../templates/article.php';
                }
            }
                ?>
		</main></div>
    <?php include '../templates/footer.php'; ?>
     <script src="../js/viewportSize.js"></script>
    <script src="../js/underscore.js"></script>
    <script src="../js/eventing.js"></script>
    <script src="../js/classlist.js"></script>
    <script src="../js/global.js"></script>
    <script src="../js/hover.js"></script>
    <script src="../js/finder.js"></script>
 <?php echo '</body></html>';