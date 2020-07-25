<form action="" method="post">
    <fieldset><legend>Are you sure you want to remove 
    <?php
echo $article->title; ?> from the database?&nbsp;</legend>
<input type="hidden" name="id" value="<?php
echo $article->id; ?>">
<input type="submit" name="confirm" value="Yes">
<input type="submit" name="confirm" value="No">
        </fieldset>
</form>