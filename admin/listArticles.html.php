<?php
$pp = ArticleFactory::getPages();
include 'pages_dropdown.php'; 
?>
 <table>
        <tr>
          <th>Publication Date</th>
          <th>Article</th>
        </tr>
        <?php foreach ( $articles as $article ) { ?>
        <tr>
            <td><?php htmlout(date('j M Y', $article['pubDate'])); ?></td>
          <td>
              <?php $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : ''; ?>
            <a href="?action=editArticle&amp;articleId=<?php htmlout($article['id']); ?>&amp;page=<?php htmlout($page)?>"><?php htmlout($article['title']); ?></a>
          </td>
        </tr>
<?php } ?>
</table>
<?php 
$paginator->doNav(); ?>
<p>Total Article<?php htmlout(doPlural($paginator->getRecords())); ?>: <strong><?php htmlout($paginator->getRecords()); ?></strong></p>
<nav>
<a href="?action=newArticle&amp;page=<?php if(isset($_REQUEST['page'])){
    htmlout($_REQUEST['page']);
}?>" title="Add a New Article" class="icon"><img src="../images/resource/icon_list_add.png"></a>
<a href="../user/?action=manageUsers" title="Manage Users" class="icon"><img src="../images/resource/icon_user_edit.png"></a><a href="../home/" title="live website" class="icon"><img src="../images/resource/home.png"></a></nav>
