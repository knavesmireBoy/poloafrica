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
include "../templates/nav.php";
?>
<main class="override">
    <?php
     $article = $articles['History'];
    $count += 1;
    include '../templates/article.php';
    $article = $articles['Transformation'];
    $count += 1;
    include '../templates/article.php';
    $article = $articles['Development'];
    $count += 1;
    include '../templates/article.php';
    $article = $articles['Economic impact'];
    $count += 1;
    include '../templates/article.php';
    $article = $articles['Social change'];
    $count += 1;
    include '../templates/article.php';
    echo '</main></div>';
include '../templates/footer.php';?>
<script src="../js/finder.js"></script>
<?php echo '</body></html>';