<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once '../myconfig.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/GalleryPaginator.php';
session_start();

function threshold($n){
    if($n % GALLERY_DISPLAY_COUNT){
       return '<ul class="gallery alt">' ;
    }
    else {
        return '<ul class="gallery">';
    }
}

if (!isset($_SESSION["gallery_paginator"]))
{
    $_SESSION["gallery_paginator"] = new GalleryPaginator(GALLERY_DISPLAY_COUNT, GALLERY_TOTAL_COUNT, new Looper(getGalleryPageBreaks()));
}

$_SESSION["gallery_paginator"]->setStart(0);
$start = $_SESSION["gallery_paginator"]->getStart();
$limit = $_SESSION["gallery_paginator"]->getDisplay();
$results = $_SESSION["gallery_paginator"]->getList(); ?>

<a id="gal_back" href="?b=<?php echo $results['start']; ?>" class="pagenav"><span></span></a>
<?php
echo threshold($limit-$start);
foreach($results['list'] as $image): 
    $src = $results['path'] . $image['src'] . $image['ext']; ?>
    <li>
        <a href="<?php htmlout($src); ?>">
        <img src="<?php htmlout($src); ?>" alt="<?php htmlout($image['alt']); ?>"></a>
    </li>
<?php endforeach; echo '</ul>';?>
<a id="gal_forward" href="?f=<?php echo $results['limit']; ?>" class="pagenav"><span></span></a>