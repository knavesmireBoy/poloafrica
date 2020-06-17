<?php
//session_start();
?>
<div id="adminHeader">
        <h2>Poloafrica Admin</h2>
        <p>You are logged in with email: <b><?php htmlout( $_SESSION['email']) ?></b> <a href="?action=logout"?> <strong>Log out</strong></a></p></div>
<h3>Manage Users</h3>

<?php if ( isset( $results['errorMessage'] ) ) { ?>
        <div class="errorMessage"><?php echo $results['errorMessage'] ?></div>
<?php exit(); } ?>
<?php if ( isset( $results['statusMessage'] ) ) { ?>
        <div class="statusMessage"><?php echo $results['statusMessage'] ?></div>
<?php }

if(!isset($_POST['action'])): ?>
<form action="?" method="post" class="manage">
    <p>All Users:</p>
<label for="user"></label><select id="user" name="user"><option value="">Select one</option>
<?php  foreach ($users as $user): ?>
<option value="<?php htmlout($user['id']); ?>"><?php htmlout($user['name']); ?>
</option><?php endforeach; ?></select>
<input type="hidden" name="action" value="selecteduser"/>
<input type="submit" value="Edit"/>
</form>

<?php else : 

//exit(var_dump($users));
?>

<form action="" method="post" class="manage">
<label><?php htmlout($users['name']); ?></label>
<input type="hidden" name="id" value="<?php echo $users['id']; ?>">
<input type="submit" name="action" value="Edit">
<input type="submit" name="action" value="Delete" title="delete on confirm">
</form>

<?php
endif;
if(!isset($_GET['add'])){ ?>
<a href="?add">Add a New User</a>
<?php } ?>
<div><a href="../admin">Admin</a></div>
