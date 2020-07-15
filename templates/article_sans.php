<?php
$cur = 'post' . $count; ?>
<article id="<?php htmlout($article->attrID); ?>">
        <?php echo $article->mdcontent; ?>
    </article>
<input class="read-more-state" id="<?php echo $cur ?>" type="checkbox">
<label class="read-more-trigger" for="<?php echo $cur ?>"></label>
