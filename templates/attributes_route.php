<?php if(isset($attribute['src'])){
    $path = ArticleFactory::getFileName($attribute['src']);
    $attr = 'Alt Text';
?>
<img src="<?php htmlout($attribute['src']); ?>" alt="<?php htmlout($attribute['alt']); ?>" id="<?php htmlout($attribute['dom_id']); ?>">
<?php }
else if(isset($attribute['path'])){
    $path = ArticleFactory::getFileName($attribute['path']);
    $attr = 'Title'; ?>
<img src="../images/resource/pdf.png" alt="" class="pdf_icon" title="<?php htmlout($path); ?>">
<?php } ?>