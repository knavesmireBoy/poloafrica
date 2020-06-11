<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';    
include_once '../includes/db.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/PhotoPaginator.php';
include_once '../myconfig.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/GalleryPaginator.php';

function makePrev($arr){
return function ($cur) use ($arr) {
        $d = $arr;
        $i = array_search($cur, $d);
        $j = $i-1;
    if(!isset($d[$j])){
        return $d[count($d)-1];
    }
        return $d[$j];
    };
}
function makeNext($arr){
return function ($cur) use ($arr){
        $d = $arr;
        $i = array_search($cur, $d);
        $j = $i+1;
    if(!isset($d[$j])){
        return $d[1];
    }
        return $d[$j];
    };
}
if (!isset($_SESSION["gallery_paginator"]))
{
    $_SESSION["gallery_paginator"] = new GalleryPaginator(14, 92, array('f'=>makeNext([0, 14, 28, 42, 54, 66, 78, 92]), 'b'=>makePrev([0, 14, 28, 42, 54, 66, 78, 92])));
    $_SESSION["gallery_paginator"]->setStart(0);
}
else
{
    //$_SESSION["gallery_paginator"]->setRecords($data['totalRows']);
}

$start = $_SESSION["gallery_paginator"]->getStart();
$limit = $_SESSION["gallery_paginator"]->getDisplay();

if(($limit-$start) % 14){ 
    echo '<main class="override alt">';
 }
else {
    echo '<main class="override">';
}

$results = $_SESSION["gallery_paginator"]->getList();
include 'output.php';