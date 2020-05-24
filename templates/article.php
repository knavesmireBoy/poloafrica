<?php
if($article->summary):
$cur = 'post' . $count; ?>
<article id="<?php htmlout($article->summary); ?>">
<input class="read-more-state" id="<?php echo $cur?>" type="checkbox">
<label class="read-more-trigger" for="<?php echo $cur?>"></label>
               <?php $imagePaths = $article->getImagePath();
            foreach($imagePaths as $image) : ?>
            <img id="<?php htmlout($image['id']); ?>" src="<?php htmlout($image['src']); ?>" alt="<?php htmlout($image['alt']); ?>">
            <?php endforeach; ?>
<section> 
            <?php echo $article->mdcontent; ?>
                </section></article>
            <?php endif; ?>