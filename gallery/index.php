<?php 
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once '../myconfig.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/ArticleFactory.php';
$img = $_GET['img'];
$results = ['page_title' => $img];
$style = 'photos';
include "../templates/header.php";
include "../templates/nav.php"; ?>
<main id="sans_js">
<a><img src="<?php htmlout('../images/gallery/fullsize/' . $img); ?>" alt="<?php htmlout($_GET['alt']); ?>"></a>
<?php
echo '</main></div>'; ?>
<?php include '../templates/footer.php'; 
echo '</body></html>';