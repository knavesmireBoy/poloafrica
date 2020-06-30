<form action="" method="post" class="manage prompt">
    <fieldset><legend>Remove 
    <?php
echo $user['name']; ?> from the database?&nbsp;</legend>
<input type="hidden" name="id" value="<?php
echo $user['id']; ?>">
<input type="submit" name="confirm" value="Yes">
<input type="submit" name="confirm" value="No">
        </fieldset>
</form>