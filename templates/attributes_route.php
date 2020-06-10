<?php if(isset($attribute['src'])){
    $path = Article::getFileName($attribute['src']);
    $attr = 'Alt Text';
?>
<img src="<?php htmlout($attribute['src']); ?>" alt="<?php htmlout($attribute['alt']); ?>" id="<?php htmlout($attribute['dom_id']); ?>">
<?php }
else if(isset($attribute['path'])){
    $path = Article::getFileName($attribute['path']);
    $attr = 'Title'; ?>
<img src="../images/pdf.png" alt="" class="pdf_icon" title="<?php htmlout($path); ?>">
<?php } ?>