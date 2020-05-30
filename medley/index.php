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
$articles = Article::getListByPage('medley');
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
                if(!$article->summary){
                include '../templates/article.php';
                        }
            else {
            include '../templates/video.php';
            }
            }?>
		</main></div>
   <?php include '../templates/footer.php'; ?>
    <script src="../js/viewportSize.js"></script>
    <script src="../js/underscore.js"></script>
    <script src="../js/eventing.js"></script>
    <script src="../js/classlist.js"></script>
    <script src="../js/global.js"></script>
    <script src="../js/finder.js"></script>
    <script src="../js/medley.js"></script>
    <?php echo '</body></html>';