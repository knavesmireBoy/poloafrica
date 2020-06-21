<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/ArticleFactory.php';
include_once '../myconfig.php';
$results = ['page_title' => 'Medley'];
$style = 'medley';
include "../templates/header.php";
$articles = ArticleFactory::getListByPage('medley');
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
        else {
            include '../templates/video.php';
        }
    }   
echo '</main></div>';
include '../templates/footer.php'; ?>
    <script src="../js/finder.js"></script>
    <script src="../js/medley.js"></script>
<?php echo '</body></html>';