<ul class="gallery">
    <?php
$imagePaths = $article->getFilePath();
foreach($imagePaths as $image) : 
    if(isset($image['src'])){ ?>    <li><a href="<?php htmlout($image['src']); ?>"><img id="<?php htmlout($image['dom_id']); ?>" src="<?php htmlout($image['src']); ?>" alt="<?php htmlout($image['alt']); ?>"></a></li>
    <?php }     
endforeach; ?>
</ul>