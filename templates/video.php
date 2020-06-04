<?php
$cur = 'post' . $count;
$head = null;
if($count == 7){ ?>
<section id="tvcoverage">
<input class="read-more-state" id="<?php echo $cur?>" type="checkbox">
<label class="read-more-trigger" for="<?php echo $cur?>"></label>
    <?php 
        $head = '<a href="#" id="TV"><h3>TV and video coverage</h3></a>';      
               }
$video = $article->getFilePath()[0];
    if($video) { ?>
    <article id="<?php htmlout($video['dom_id']); ?>">
        <?php if(isset($head)){  echo $head; } ?>
    <video width="320" height="180" controls auto preload="metadata">
    <source src="<?php htmlout($video['src']) . htmlout($video['alt']); ?>" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'></video>
       
    <?php }
echo $article->mdcontent; ?>
</article>
    <?php
    if($count == 9){ ?>
    </section>
<?php }
    //$count = 7;