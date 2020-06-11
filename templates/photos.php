<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once '../includes/db.inc.php';
include_once '../myconfig.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/GalleryPaginator.php';
session_start();

function threshold($n){
    if($n % GALLERY_DISPLAY_COUNT){
       return '<main class="override alt">'; 
    }
    return '<main class="override">';
}

if (!isset($_SESSION["gallery_paginator"]))
{
    $_SESSION["gallery_paginator"] = new GalleryPaginator(GALLERY_DISPLAY_COUNT, GALLERY_TOTAL_COUNT, new Looper(array(0, 14, 28, 42, 54, 66, 78, 92)));
}
$_SESSION["gallery_paginator"]->setStart(0);
$start = $_SESSION["gallery_paginator"]->getStart();
$limit = $_SESSION["gallery_paginator"]->getDisplay();

echo threshold($limit-$start);

$results = $_SESSION["gallery_paginator"]->getList(); ?>

<a id="gal_back" href="?b=<?php echo $results['start']; ?>" class="pagenav"><span></span></a>
<ul class="gallery">
<?php
foreach($results['list'] as $image): 
    $src = $results['path'] . $image['src'] . $image['ext']; ?>
    <li>
        <a href="<?php htmlout($src); ?>">
        <img src="<?php htmlout($src); ?>" alt="<?php htmlout($image['alt']); ?>"></a>
    </li>
<?php endforeach; ?>
</ul>
<a id="gal_forward" href="?f=<?php echo $results['limit']; ?>" class="pagenav"><span></span></a>

