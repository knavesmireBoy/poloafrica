<?php
$cur = 'post' . $count; ?>
<article id="<?php htmlout($article->attrID); ?>">
    <?php
$imagePaths = $article->getFilePath();
foreach ($imagePaths as $image):
    if (isset($image['src']))
    { ?>
    <img id="<?php htmlout($image['id']); ?>" src="<?php htmlout($image['src']); ?>" alt="<?php htmlout($image['alt']); ?>">
    <?php
    }
endforeach; ?>
    <?php echo $article->mdcontent; ?>
    </article>
<input class="read-more-state" id="<?php echo $cur ?>" type="checkbox">
<label class="read-more-trigger" for="<?php echo $cur ?>"></label>
