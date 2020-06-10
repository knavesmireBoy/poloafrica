   <?php

function setLimitF($cur){
        $displays = [0, 14, 28, 42, 54, 66, 78, 92];
        $i = array_search($cur, $displays);
        $j = $i+1;
    if(!isset($displays[$j])){
        return setLimitF(0);
    }
        return $displays[$j];
    }

function setLimitB($cur){
        $displays = [0, 14, 28, 42, 54, 66, 78, 92];
        $i = array_search($cur, $displays);
        $j = $i-1;
    if(!isset($displays[$j])){
        return $displays[count($displays)-1];
    }
        return $displays[$j];
    }

$images = $article->getFilePath();
    $start = 0;
    $limit = setLimitF($start);

if(isset($_REQUEST['f'])){
    $start = $_REQUEST['f'];
    $limit = setLimitF($start);
    $start = $start >= $limit ? 0 : $start;
}
elseif(isset($_REQUEST['b'])){
    $limit = $_REQUEST['b'];
    $start = setLimitB($limit);
    if($start > $limit){
        $limit = $start;
        $start = setLimitB($start);
    }
}

if(($limit-$start) % 14){}
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
<script>
</script>