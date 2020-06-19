<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Article.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/PagePaginator.php';
require_once '../../../innocent/poloafricaDB.txt';
require_once '../includes/db.inc.php';


if(!isset($_SESSION['email'])){
session_start();
}

$pp = array_reverse(Article::getPages());
    $tmp = array_splice($pp, 0, 1);
    $pp = array_merge($pp, $tmp);
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

<p><?php htmlout($paginator->getRecords()); ?> article<?php htmlout(doPlural($paginator->getRecords())); ?> in total</p>

<p><a href="?action=newArticle&page=<?php if(isset($_REQUEST['page'])){
    htmlout($_REQUEST['page']);
}?>">Add a New Article</a></p>
<p><a href="../user/?action=manageUsers">Manage Users</a></p>
<p><a href="../enquiries/">Home</a></p>