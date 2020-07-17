<?php
$pp = PageFactory::getPages();
$mypage = 'home';
$page = isset($_REQUEST['page']) ? $_REQUEST['page'] : '';
?>
<h2>Poloafrica Admin</h2>
<p>You are logged in with email: <b><?php htmlout($_SESSION['email']); ?></b> <a href="?action=logout"?> <strong>Log out</strong></a></p>
<h3><?php echo $results['heading']; ?></h3>

<?php if (isset($results['statusMessage'])){ ?>
<div></div>
<div class="msg statusMessage"><?php htmlout($results['statusMessage']); ?></div>
<?php } 
if (isset($results['errorMessage'])){ ?>
<div></div>
<div class="msg errorMessage"><?php htmlout($results['errorMessage']); ?></div>
<?php } ?>

<form action="?" method="get" class="page_select">
<select id="page" name="page">
<option value="">Select Page</option>
<?php  foreach ($pp as $p): ?>
<option value="<?php htmlout($p['id']); ?>"
    <?php
if($page && $page == $p){ echo ' selected'; }
    ?>
><?php htmlout($p['name']); ?></option>
    <?php endforeach; ?>
</select>
<input type="submit" name="action" value="choose">
</form>

<nav>
<a href="?action=addPage" title="Add a New Page" class="icon"><img src="../images/resource/icon_page_add.png"></a>
<?php  $mypage = isset($_GET['page']) ? $_GET['page'] : $mypage; ?>
<a href="../admin/?page=<?php echo $mypage; ?>" title="Back to Article List" class="icon"><img src="../images/resource/icon_list.png"></a>
<a href="../<?php echo $mypage; ?>" title="go to <?php echo $mypage; ?> page" class="icon"><img src="../images/resource/home.png"></a>
</nav>
<?php echo '</section></main></body>';