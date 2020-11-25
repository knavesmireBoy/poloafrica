<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once '../myconfig.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/ArticleFactory.php';
$results = ['page_title' => '!Gallery!'];
$style = 'photos';
include "../templates/header.php";
include "../templates/nav.php"; ?>
<main class="override">
<?php
include "../templates/photos.php";
echo '</main></div>'; ?>
<?php include '../templates/footer.php'; 
    
    function trimString($coll, $start, $count){
        return array_map(function($str) use($start, $count){
            return substr($str, $start, $count);
        }, $coll);
    }
    function sortArray($coll){
        $slicers = getGalleryPageSets();
        $gang = array();
        while(isset($slicers[0])){
            $ints = array_splice($slicers, 0,1)[0];
            $gang[] = array_splice($coll, 0, $ints);
        }
        return $gang;
    }
    $iZero = array_values(preg_grep("/\..{3,4}$/", scandir('../images/gallery/fullsize/')));
?>
    <script src="../js/intaface.js"></script>
    <script src="../js/basicIterator.js"></script>
    <script src="../js/tooltips.js"></script>
    <script>
        var hijax = window.poloAF.Hijax(),
            main = document.getElementsByTagName('main')[0];
        hijax.setContainer(main);
        hijax.setCanvas(main);
        hijax.setUrl('../templates/photos.php');
        hijax.captureData(true);
        //preload images
        var all,
            imgs = <?php echo json_encode($iZero) ?>;
        //preload
        _.each(imgs, function(path){
            new Image().src = '../images/gallery/fullsize/'+path;
        });
       
        all = <?php echo json_encode(sortArray(trimString($iZero, 1, 2))) ?>;
    </script>
    <script src="../js/gallery.js"></script>
 <?php echo '</body></html>';