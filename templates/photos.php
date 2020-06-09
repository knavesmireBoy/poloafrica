<a id="gal_back" href="." class="pagenav"><span></span></a>
<ul class="gallery">
    <?php
$imagePaths = $article->getFilePath();
foreach($imagePaths as $image) : 
    if(isset($image['src'])){ ?> 
    <li>
        <a href="<?php htmlout($image['src']); ?>">
        <img src="<?php htmlout($image['src']); ?>" alt="<?php htmlout($image['alt']); ?>"></a>
    </li>
    <?php }     
endforeach; ?>
</ul>
<a id="gal_forward" href="." class="pagenav"><span></span></a>