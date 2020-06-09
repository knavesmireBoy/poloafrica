<div id="adminHeader">
        <h2>Poloafrica Admin</h2>
        <p>You are logged in with email: <b><?php htmlout( $_SESSION['email']) ?></b> <a href="?action=logout"?> <strong>Log out</strong></a></p></div>
<h3>Article List</h3>

<?php if ( isset( $results['errorMessage'] ) ) { ?>
        <div class="errorMessage"><?php echo $results['errorMessage'] ?></div>
<?php exit(); } ?>
<?php if ( isset( $results['statusMessage'] ) ) { ?>
        <div class="statusMessage"><?php echo $results['statusMessage'] ?></div>
<?php } 

$paginator = $_SESSION["paginator"];
$page = (isset($_REQUEST['page']) && !empty($_REQUEST['page'])) ? $_REQUEST['page'] : true;
$start = isset($_REQUEST['s']) ? $_REQUEST['s'] :  0;
$articles = $paginator->setStart($start);
$articles = $paginator->getList($page);

$pp = array_reverse(Article::getPages());
include "pages_dropdown.php";
?>
 <table>
        <tr>
          <th>Publication Date</th>
          <th>Article</th>
        </tr>
        <?php foreach ( $articles as $article ) { ?>
        <tr>
            <td><?php echo date('j M Y', $article['pubDate']); ?></td>
          <td>
              <?php $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : ''; ?>
            <a href="?action=editArticle&amp;articleId=<?php htmlout($article['id']); ?>&amp;page=<?php htmlout($page)?>"><?php htmlout($article['title']); ?></a>
          </td>
        </tr>
<?php } ?>
</table>

<?php $paginator->doNav(); ?>

<p><?php echo $paginator->getRecords(); ?> article<?php echo doPlural($paginator->getRecords()); ?> in total</p>

<p><a href="?action=newArticle">Add a New Article</a></p>

<p><a href="../user/?action=manageUsers">Manage Users</a></p>
<p><a href="../enquiries/">Home</a></p>
    
   