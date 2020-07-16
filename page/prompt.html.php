<h2>Poloafrica Admin</h2>
<form action="" method="post">
<fieldset><legend>Remove 
<?php
echo $page->title; ?> page from the database?&nbsp;</legend>
<input type="hidden" name="id" value="<?php echo $page->id; ?>">
<input type="submit" name="confirm" value="Yes">
<input type="submit" name="confirm" value="No">
</fieldset>
</form>
<?php echo '</body>';