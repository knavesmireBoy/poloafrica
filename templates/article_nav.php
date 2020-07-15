<?php
$cur = 'post' . $count; ?>
<article title="oo" id="<?php htmlout($article->summary); ?>">
<input class="read-more-state" id="<?php echo $cur ?>" type="checkbox">
<label class="read-more-trigger" for="<?php echo $cur ?>"></label>
    <?php $imagePaths = $article->getFilePath()[0];
//exit(var_dump($imagePaths));
foreach ($imagePaths as $image):
    if (isset($image['src'])): ?>
    <img id="<?php htmlout($image['id']); ?>" src="<?php htmlout($image['src']); ?>" alt="<?php htmlout($image['alt']); ?>">
    <?php
    endif; ?>
            <?php
endforeach; ?>
    <section> 
            <?php echo $article->mdcontent; ?>
                </section></article>
