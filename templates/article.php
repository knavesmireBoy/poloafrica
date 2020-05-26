<?php
$cur = 'post' . $count; ?>
<section id="<?php htmlout($article->attrID); ?>">
<input class="read-more-state" id="<?php echo $cur?>" type="checkbox">
<label class="read-more-trigger" for="<?php echo $cur?>"></label>
    <?php $imagePaths = $article->getFilePath();
       foreach($imagePaths as $image) : ?>
    <img id="<?php htmlout($image['id']); ?>" src="<?php htmlout($image['src']); ?>" alt="<?php htmlout($image['alt']); ?>">
    <?php endforeach; ?>
    <article> 
        <?php echo $article->mdcontent; ?>
    </article></section>
