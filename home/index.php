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
include "../templates/nav.php";
?>
<main class="override">
    <?php
     foreach($articles as $article){
         $count +=1;
       include '../templates/article.php';  
     }
echo '</main></div>';
include '../templates/footer.php'; ?>
<script src="../js/hover.js"></script>
<?php echo '</body></html>';