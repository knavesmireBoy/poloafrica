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
<?php include '../templates/footer.php'; ?>
    <script src="../js/viewportSize.js"></script>
    <script src="../js/shims.js"></script>
    <script src="../js/intaface.js"></script>
    <script src="../js/underscore.js"></script>
    <script src="../js/eventing.js"></script>
    <script src="../js/classlist.js"></script>
    <script src="../js/global.js"></script>
    <script src="../js/basicIterator.js"></script>
    <script src="../js/tooltips.js"></script>
    <script src="../js/gallery.js"></script>
    <script>
        bolt.setContainer(document.querySelector('main'));
        bolt.setCanvas(document.querySelector('main'));
        bolt.setUrl('../templates/photos.php');
        //document.getElementsByTagName('h2')[0].setAttribute
        bolt.captureData();
    </script>
<!--<script src="../js/hover.js"></script>
<script src="../js/finder.js"></script>-->

 <?php echo '</body></html>';