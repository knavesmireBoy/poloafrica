<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Article.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Asset.php';
include_once '../myconfig.php';
$results = ['page_title' => 'The Poloafrica Trust'];
$style = 'trust';
include "../templates/header.php";
?>
<?php
$articles = Article::getListByPage($style);
$count = 0;
?>
<body id="trust">
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
				<li><a href=".">your stay</a>
					<ul>
						<li><a href="#timing">timing</a></li>					
						<li><a href="#living">living</a></li>
						<li><a href="#relaxing">relaxing</a></li>
						<li><a href="#dining">dining</a></li>
						<li><a href="#dayvisit">day visiting</a></li>
					</ul></li>
				<li><a href="../polo">polo</a></li>				
				<li><a href="../medley">medley</a></li>
				<li><a href="../enquiries">enquiries</a></li>
				<li><a href="../photos">photos</a></li>
			</ul>
                </nav></header>
            <h2>
				<span>your stay</span>
			</h2>
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