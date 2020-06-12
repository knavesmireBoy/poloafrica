<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once '../myconfig.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Article.php';
$results = ['page_title' => 'Gallery!'];
$style = 'photos';
include "../templates/header.php";
include "../templates/nav.php"; ?>
<main class="override">
<?php
include "../templates/photos.php";
echo '</main></div>'; ?>
<?php include '../templates/footer.php'; 

    //$iOne = array_combine(range(1, count($arr)), array_values($arr));
    
    function greaterThan($a, $b){
        return $a > $b;
    }
    
     function lesserThan($a, $b){
        return $a < $b;
    }
    
    function createWhiteImage($w, $h, $name){
        $img = imagecreatetruecolor($w, $h);
        $bg = imagecolorallocate($img, 255, 255, 255);
        imagefilledrectangle($img,0,0,$w,$h,$bg);
        imagejpeg($img, $name);
    }
        
    function filterArray($func){
        return function($str) use($func){
        $img = imagecreatefromjpeg("../images/gallery/fullsize/$str");
        if($func(imagesx($img), imagesy($img))){
            return $str;
        }
    };
    }
    //$lscp = array_filter($iZero, filterArray('greaterThan'));
    //$ptrt = array_filter($iZero, filterArray('lesserThan'));
    function trimString($coll, $start, $count){
        return array_map(function($str) use($start, $count){
            return substr($str, $start, $count);
        }, $coll);
    }
    
    function sortArray($coll){
        $slicers = array(14,14,14,12,12,12,14);
        $gang = array();
        while(isset($slicers[0])){
            $ints = array_splice($slicers, 0,1)[0];
            $gang[] = array_splice($coll, 0, $ints);
        }
        return $gang;
    }
    
    $iZero = array_values(preg_grep("/\..{3,4}$/", scandir('../images/gallery/fullsize/')));
    
?>
    
    <script src="../js/viewportSize.js"></script>
    <script src="../js/shims.js"></script>
    <script src="../js/intaface.js"></script>
    <script src="../js/underscore.js"></script>
    <script src="../js/eventing.js"></script>
    <script src="../js/classlist.js"></script>
    <script src="../js/global.js"></script>
    <script src="../js/basicIterator.js"></script>
    <script src="../js/tooltips.js"></script>
    <script>
        bolt.setContainer(document.querySelector('main'));
        bolt.setCanvas(document.querySelector('main'));
        bolt.setUrl('../templates/photos.php');
        //document.getElementsByTagName('h2')[0].setAttribute
        bolt.captureData();    
        var all = <?php echo json_encode(sortArray(trimString($iZero, 1, 2))); ?>;
    </script>
 
    

    
<script src="../js/gallery.js"></script>


 <?php echo '</body></html>';