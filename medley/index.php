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
$articles = Article::getListByPage('medley');
$count = 0;
include "../templates/nav.php";
?>
<main class="override">
    <?php
    $count += 1;
    $article = $articles['Laureus'];
    include '../templates/article.php';
    $count += 1;
     $article = $articles['Community'];
    include '../templates/article.php';
    $count += 1;
    $article = $articles['Beekeeping'];
    include '../templates/article.php';
    $count += 1;
     $article = $articles['Activities on the farm'];
    include '../templates/article.php';
    $count += 1;
    $article = $articles['Activities around the farm'];
    include '../templates/article.php';
    $count += 1;
    $article = $articles['Press coverage'];
    include '../templates/article.php';
     foreach ($articles as $article){
        $count += 1;
        if($article->summary){
            include '../templates/video.php';
        }
    }
     $count += 1;
    $article = $articles['Links'];
    include '../templates/article.php';
    
   
echo '</main></div>';
include '../templates/footer.php'; ?>
<script src="../js/medley.js"></script>
<?php echo '</body></html>';