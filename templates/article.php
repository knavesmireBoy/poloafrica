<?php
$cur = 'post' . $count; ?>
<section <?php htmlout(classify($article->attrID)); ?>>
<input class="read-more-state" id="<?php echo $cur ?>" type="checkbox">
<label class="read-more-trigger" for="<?php echo $cur ?>"></label>
    <?php
//default is just one image per article, polo first article has two
$imagePaths = $article->getFilePath();
//exit(var_dump('article.php'));
foreach ($imagePaths as $image):
    if (isset($image['src']))
    { ?> <img <?php htmlout(classify($image['dom_id'])); ?> src="<?php htmlout($image['src']); ?>" alt="<?php htmlout($image['alt']); ?>">
    <?php
    }
endforeach; ?>
    <article> 
        <?php echo $article->mdcontent; ?>
    </article></section>
