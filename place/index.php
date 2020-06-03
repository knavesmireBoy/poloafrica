<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Article.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Asset.php';
include_once '../myconfig.php';
$results = ['page_title' => 'The Place'];
$style = 'place';
include "../templates/header.php";
?>
<?php
$articles = Article::getListByPage($style);
$count = 0;
?>
<body id="place">
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
						<li><a href=".">the place</a>
							<ul>
								<li><a href="#setting">the setting</a></li>
								<li><a href="#farm">farm life</a></li>								
								<li><a href="#climate">climate</a></li>
								<li><a href="#connectivity">connectivity</a></li>	
								<li><a href="#location">location</a></li>			
							</ul>
							</li>						
						<li ><a href="../stay">your stay</a></li>												
						<li ><a href="../polo">polo</a></li>										
						<li><a href="../medley">medley</a></li>						
						<li><a href="../enquiries">enquiries</a></li>						
						<li><a href="../photos">photos</a></li>								
				</ul></nav>
        </header>
        <h2><span>the place</span></h2>
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
    <script src="../js/finder.js"></script>
 <?php echo '</body></html>';