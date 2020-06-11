<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Article.php';
//include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Asset.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/PhotoPaginator.php';
include_once '../myconfig.php';
$results = ['page_title' => 'Gallery!'];
$style = 'photos';
include "../templates/header.php";
$articles = Article::getListByPage($style);
//$count = 0;
include "../templates/nav.php";
?>
<?php
    foreach ($articles as $article){
        if(!$article->summary){
            include '../templates/photos.php';
        }
    } 

include '../templates/footer.php'; ?>
<div id="now"></div>
     <script src="../js/viewportSize.js"></script>
    <script src="../js/underscore.js"></script>
    <script src="../js/eventing.js"></script>
    <script src="../js/classlist.js"></script>
    <script src="../js/global.js"></script>
    <script>
        var element = document.getElementById("now");
        bolt.setContainer(document.querySelector('main'));
        bolt.setCanvas(element);
        bolt.setUrl('../templates/photos.php');
        //bolt.captureData();
    </script>
        
    <!--<script src="../js/hover.js"></script>
    <script src="../js/finder.js"></script>-->

 <?php echo '</body></html>';