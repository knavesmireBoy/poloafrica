<?php
$pp = ArticleFactory::getPages('name');
$myp = 'home';
include 'pages_dropdown_onsubmit.php'; 
include 'table.html.php'; 
$paginator->doNav(); ?>
<p>Total Article<?php htmlout(doPlural($paginator->getRecords())); ?>: <strong><?php htmlout($paginator->getRecords()); ?></strong></p>
<nav>
    <?php
    $myp = isset($_REQUEST['page']) ? html($_REQUEST['page']) : $p;
    $myp = isset($myp) ?  $myp : 'home';
    ?>
    
<a href="?action=newArticle&amp;page=<?php if(isset($_REQUEST['page'])){
    htmlout($_REQUEST['page']);
}?>" title="Add a New Article" class="icon"><img src="../images/resource/icon_list_add.png"></a>
    <?php if(!isset($results['exclude'])) { ?>
    <a href="../page/" title="Edit Page Tags" class="icon"><img src="../images/resource/icon_page_edit.png"></a>
    <a href="../user/?action=manageUsers" title="Manage Users" class="icon"><img src="../images/resource/icon_user_edit.png"></a>
    <?php } ?>
<a href="../<?php echo $myp; ?>" title="go to <?php echo $myp; ?> page" class="icon"><img src="../images/resource/home.png"></a></nav>