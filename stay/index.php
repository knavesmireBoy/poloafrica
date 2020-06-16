<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Article.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Asset.php';
include_once '../myconfig.php';
$results = ['page_title' => 'Your Stay'];
$style = 'stay';
include "../templates/header.php";
?>
<?php
$articles = Article::getListByPage($style);
$count = 0;
include "../templates/nav.php";
?>
<main class="override">
    <?php
     $article = $articles['Timing'];
    $count += 1;
    include '../templates/article.php';
    $article = $articles['Living'];
    $count += 1;
    include '../templates/article.php';
    $article = $articles['Relaxing'];
    $count += 1;
    include '../templates/article.php';
    $article = $articles['Dining'];
    $count += 1;
    include '../templates/article.php';
    $article = $articles['Day visiting'];
    $count += 1;
    include '../templates/article.php';
    
echo '</main></div>';
include '../templates/footer.php';
    echo '</body></html>';