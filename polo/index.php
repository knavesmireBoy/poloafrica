<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Article.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Asset.php';
include_once '../myconfig.php';
$results = ['page_title' => 'Polo'];
$style = 'polo';
include "../templates/header.php";
?>
<?php
$articles = Article::getListByPage('polo');
$count = 0;
include "../templates/nav.php";
?>
<main class="override">
    <?php
   $article = $articles['Facilities'];
    $count += 1;
    include '../templates/article.php';
    $article = $articles['Ponies'];
    $count += 1;
    include '../templates/article.php';
    $article = $articles['Our team'];
    $count += 1;
    include '../templates/article.php';
    $article = $articles['Your polo day'];
    $count += 1;
    include '../templates/article.php';
echo '</main></div>';
include '../templates/footer.php';?>
<script src="../js/finder.js"></script>
<?php echo '</body></html>';