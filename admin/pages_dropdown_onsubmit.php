<form action="?" method="get" class="page_select">
<select id="page" name="page" onchange="this.form.submit()">
<option value="">Select Page</option>
<?php  foreach ($pp as $p): ?>
<option value="<?php htmlout($p); ?>"
    <?php
if($page && $page == $p){ echo ' selected'; }
    ?>
><?php htmlout($p); ?></option>
    <?php endforeach; ?>
</select>
<input type="submit" name="action" value="choose" class="submitter">
<input type="hidden" name="action" value="selectedpage">
</form>