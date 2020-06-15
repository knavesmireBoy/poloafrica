<form action="." method="post" id="page_select" >
<select id="page" name="page">
<option value="">Select Page</option>
<?php  foreach ($pp as $p): ?>
<option value="<?php htmlout($p); ?>"
    <?php
    if(isset($_REQUEST['page']) && $_REQUEST['page'] == $p){
        echo ' selected';
    }
    ?>
><?php htmlout($p); ?></option>
    <?php endforeach; ?>
</select>
    <input type="submit" name="action" value="choose">
    </form>