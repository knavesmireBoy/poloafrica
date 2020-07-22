<?php

if(isset($prompt)){
    include 'prompt.html.php';
}

if(isset($form)){
   include 'form.html.php';
}

if(isset($users) && !isset($form)): ?>
<form action="?" method="post" class="manage">
<label for="user">Users</label><select id="user" name="user" onchange="this.form.submit()"><option value="">Select one</option>
<?php  foreach ($users as $user): ?>
<option value="<?php htmlout($user['id']); ?>"><?php htmlout($user['name']); ?>
</option><?php endforeach; ?></select>
<input type="hidden" name="action" value="selecteduser">
<input type="submit" class="submitter" value="Edit">
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
<a href="../page/" title="Edit Page Tags" class="icon"><img src="../images/resource/icon_page_edit.png"></a>
<?php }
if(isset($_GET['add']) && !isset($user)){ echo '<nav>'; }
if(!isset($results['exclude'])) { ?>
<a href="../admin" title="Back to Article List"  class="icon"><img src="../images/resource/icon_list.png"></a>
<?php } ?>
<a href="../home/" title="live website" class="icon"><img src="../images/resource/home.png"></a>
</nav>