<figcaption>
       <label for="<?php htmlout($attribute['id']); ?>" title="<?php htmlout($attribute['alt']); ?>"></label><input type="checkbox" title= "<?php htmlout($path); ?>" name="deleteAsset[]" id="<?php htmlout($attribute['id']); ?>" value="<?php htmlout($attribute['id']); ?>"/></figcaption>

<label for="editAsset[]">edit</label><input type="checkbox" title= "<?php htmlout($path); ?>" name="editAsset[]" id="<?php htmlout($attribute['id']); ?>" value="<?php htmlout($attribute['id']); ?>"/>
<input type="hidden" name="asset_id" id="asset_id" value="<?php htmlout($attribute['id']); ?>">
<label for="edit_dom_id[<?php htmlout($attribute['id']); ?>]">id</label><input name="edit_dom_id[<?php htmlout($attribute['id']); ?>]" id="edit_dom_id[<?php htmlout($attribute['id']); ?>]" value="<?php htmlout($attribute['dom_id']); ?>">

<label for="edit_alt[<?php htmlout($attribute['id']); ?>]"><?php echo strtolower($attr); ?></label><?php $output = isset($attribute['path']) ? $path : $attribute['alt']; ?><input name="edit_alt[<?php htmlout($attribute['id']); ?>]" id="edit_alt[<?php htmlout($attribute['id']); ?>]" value="<?php htmlout($output); ?>">

<div>
<p><label for="edit_ratio[<?php htmlout($attribute['id']); ?>]">ratio</label>
    <input title="enter any positive number up to 9.9" name="edit_ratio[<?php htmlout($attribute['id']); ?>]" id="edit_ratio[<?php htmlout($attribute['id']); ?>]" pattern="([0-9]?\.[1-9])|([1-9])">
<label for="edit_offset[<?php htmlout($attribute['id']); ?>]">offset</label>
    <input title="enter any number between 0 & 1" name="edit_offset[<?php htmlout($attribute['id']); ?>]" value=".5" id="edit_offset[<?php htmlout($attribute['id']); ?>]" pattern="(\.[0-9]{1,2})|([01])">
<label for="edit_maxi[<?php htmlout($attribute['id']); ?>]">dpi</label>
    <input title="enter a number between 100 and 1999" name="edit_maxi[<?php htmlout($attribute['id']); ?>]" id="edit_maxi[<?php htmlout($attribute['id']); ?>]" pattern="([0-9]{3})|(1[0-9]{3})"></p>
</div>