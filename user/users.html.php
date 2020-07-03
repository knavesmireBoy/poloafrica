<?php
//session_start();
?>
<div id="adminHeader">
        <h2>Poloafrica Admin</h2>
        <p>You are logged in with email: <b><?php htmlout( $_SESSION['email']) ?></b> <a href="?action=logout"?> <strong>Log out</strong></a></p></div>
<h3>Manage Users</h3>

<?php if (isset($results['errorMessage'])) { ?>
<h4 class="msg errorMessage"><?php echo $results['errorMessage'] ?></h4>
<nav><a href="../admin" title="Back to Article List"  class="icon" ><img src="../images/resource/icon_list.png"></a>
<a href="../home/" title="live website" class="icon"><img src="../images/resource/home.png"></a>
</nav>
<?php exit(); } ?>
<?php if (isset($results['statusMessage'])) { ?>
        <h4 class="msg statusMessage"><?php echo $results['statusMessage'] ?></h4>
<?php }
//exit(var_dump($users));

if(isset($prompt)){
    include 'prompt.html.php';
}

if(isset($form)){
   include 'form.html.php';
}

if(isset($users) && !isset($form)): ?>
<form action="?" method="post" class="manage">
<label for="user">Users</label><select id="user" name="user"><option value="">Select one</option>
<?php  foreach ($users as $user): ?>
<option value="<?php htmlout($user['id']); ?>"><?php htmlout($user['name']); ?>
</option><?php endforeach; ?></select>
<input type="hidden" name="action" value="selecteduser"/>
<input type="submit" value="Edit"/>
</form>

<?php elseif(isset($user)): ?>

<form action="" method="post" class="manage">
<label><?php htmlout($user['name']); ?></label>
<input type="hidden" name="id" value="<?php echo $user['id']; ?>">
<input type="submit" name="action" value="Edit">
<input type="submit" name="action" value="Delete" title="delete on confirm">
</form>

<?php
endif;
if(!isset($_GET['add'])){ ?>
<nav>
<a href="?add" title="Add a New User" class="icon"><img src="../images/resource/icon_user_add.png"></a>
<?php } 
if(isset($_GET['add']) && !isset($user)){ echo '<nav>'; }?>
<a href="../admin" title="Back to Article List"  class="icon" ><img src="../images/resource/icon_list.png"></a>
</nav>
