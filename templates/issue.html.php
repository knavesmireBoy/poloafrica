<?php
if (isset($results['errorMessage'])){ ?>
<div class="msg errorMessage"><?php htmlout($results['errorMessage']); ?></div>
<nav>
<?php echo $results['nav']; ?>
<a href="../home/" title="live website" class="icon"><img src="../images/resource/home.png"></a>
</nav>
<?php } 
if (isset($results['statusMessage'])){ ?>
<div class="msg statusMessage"><?php htmlout($results['statusMessage']); ?></div>
<?php }

