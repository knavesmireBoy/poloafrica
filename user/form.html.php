<form action="?<?php htmlout($results['formaction']); ?>" method="post" class="manage editor">
<div>
<label for="name">Name</label><input type="text" name="name" id="name" value="<?php htmlout($results['name']); ?>" required></div>
<div>
<label for="email">Email</label><input type="email" name="email"
id="email" value="<?php htmlout($results['email']); ?>" required></div>
<div>
<label for="password">Set password</label><input type="password" name="password" id="password" <?php echo $results['required']; ?>></div>
      <fieldset>
        <legend>Roles</legend>
        <?php for ($i = 0; $i < count($roles); $i++): ?>
<div>
<label for="role<?php echo $i; ?>"><?php htmlout($roles[$i]['description']); ?> </label><input type="checkbox" name="roles[]" id="role<?php echo $i; ?>" value="<?php htmlout($roles[$i]['id']); ?>"<?php if ($roles[$i]['selected']){
echo ' checked';
}
?>></div>
<?php endfor; ?> </fieldset>

<input type="hidden" name="id" value="<?php
htmlout($results['id']); ?>">
<input type="submit" value="<?php htmlout($results['button']); ?>">
<input type="submit" name="abort" value="Cancel" formnovalidate>
    </form>