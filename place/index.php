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
include "../templates/nav.php";
?>
<main class="override">
    <?php
    foreach ($articles as $article){
        $count += 1;
        if(!$article->summary){
            include '../templates/article.php';
        }
    }
echo '</main></div>';
include '../templates/footer.php';
echo '</body></html>';