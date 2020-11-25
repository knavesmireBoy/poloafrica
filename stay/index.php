<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/ArticleFactory.php';
include_once '../myconfig.php';
$results = ['page_title' => 'Your Stay'];
$style = 'stay';
include "../templates/header.php";
?>
<?php
$articles = ArticleFactory::getListByPage($style);
$count = 0;
include "../templates/nav.php";
?>
<main class="override">
    <?php
     foreach($articles as $article){
         $count +=1;
       include '../templates/article.php';  
     }
    
echo '</main></div>';
include '../templates/footer.php';?>
<script src="../js/mover.js"></script>
<?php echo '</body></html>';