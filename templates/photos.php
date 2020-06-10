   <?php

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

$images = $article->getFilePath();
$paginator = new GalleryPaginator(14, count($images), array('f'=>makeNext([0, 14, 28, 42, 54, 66, 78, 92]), 'b'=>makePrev([0, 14, 28, 42, 54, 66, 78, 92])));

$paginator->setStart(0);
$start = $paginator->getStart();
$limit = $paginator->getDisplay();

if(($limit-$start) % 14){ 
    echo '<main class="override alt">';
 }
else {
    echo '<main class="override">';
}

?>



<a id="gal_back" href=".?b=<?php echo $start; ?>" class="pagenav"><span></span></a>
<ul class="gallery">
<?php
for($start; $start < $limit; $start++): 
    if(isset($images[$start]['src'])){ ?> 
    <li>
        <a href="<?php htmlout($images[$start]['src']); ?>">
        <img src="<?php htmlout($images[$start]['src']); ?>" alt="<?php htmlout($images[$start]['alt']); ?>"></a>
    </li>
    <?php }     
endfor; ?>
</ul>
<a id="gal_forward" href=".?f=<?php echo $limit; ?>" class="pagenav"><span></span></a>

<?php if(($limit-$start) % 14){ ?>
<script type="text/javascript">
    function run(){
        alert("hello world");
    }
    <?php echo "run();";?>
       </script>
<?php } ?>
