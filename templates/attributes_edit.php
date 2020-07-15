<figcaption>
       <label for="<?php htmlout($attribute['id']); ?>" title="<?php htmlout($attribute['alt']); ?>">delete</label><input type="checkbox" title= "<?php htmlout($path); ?>" name="deleteAsset[]" id="<?php htmlout($attribute['id']); ?>" value="<?php htmlout($attribute['id']); ?>"/></figcaption>

<label for="editAsset[]">edit</label><input type="checkbox" title= "<?php htmlout($path); ?>" name="editAsset[]" id="<?php htmlout($attribute['id']); ?>" value="<?php htmlout($attribute['id']); ?>"/>
<input type="hidden" name="asset_id" id="asset_id" value="<?php htmlout($attribute['id']); ?>">
<label for="edit_dom_id">id</label><input name="edit_dom_id[<?php htmlout($attribute['id']); ?>]" id="edit_dom_id" value="<?php htmlout($attribute['dom_id']); ?>">
<label for="edit_alt"><?php echo strtolower($attr); ?></label><?php $output = isset($attribute['path']) ? $path : $attribute['alt']; ?><input name="edit_alt[<?php htmlout($attribute['id']); ?>]" id="edit_alt" value="<?php htmlout($output); ?>">
