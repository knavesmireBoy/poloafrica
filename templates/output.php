<a id="gal_back" href=".?b=<?php echo $results['start']; ?>" class="pagenav"><span></span></a>
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
<a id="gal_forward" href=".?f=<?php echo $results['limit']; ?>" class="pagenav"><span></span></a>
</main></div>

