   <figcaption>
       <span title="<?php htmlout($attribute['alt']); ?>">Delete</span>
       <input type="checkbox" title= "<?php htmlout($path); ?>" name="deleteAsset[]" id="<?php htmlout($attribute['id']); ?>" value="<?php htmlout($attribute['id']); ?>"/></figcaption>

<label for="editAsset">Edit</label><input type="checkbox" title= "<?php htmlout($path); ?>" name="editAsset[]" id="<?php htmlout($attribute['id']); ?>" value="<?php htmlout($attribute['id']); ?>"/>
<input type="hidden" name="asset_id" id="asset_id" value="<?php htmlout($attribute['id']); ?>">

<label for="edit_alt"><?php echo $attr; ?></label>
<input name="edit_alt[<?php htmlout($attribute['id']); ?>]" id="edit_alt" value="<?php htmlout($attribute['alt']); ?>">
<label for="edit_dom_id">DOM Id</label>
<input name="edit_dom_id[<?php htmlout($attribute['id']); ?>]" id="edit_dom_id" value="<?php htmlout($attribute['dom_id']); ?>">