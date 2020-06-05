<label for="edit_alt">Alt Text/Title</label>
<input name="edit_alt[<?php htmlout($attribute['id']); ?>]" id="edit_alt" value="<?php htmlout($attribute['alt']); ?>">
<label for="edit_dom_id">DOM Id</label>
<input name="edit_dom_id[<?php htmlout($attribute['id']); ?>]" id="edit_dom_id" value="<?php htmlout($attribute['dom_id']); ?>">

<label for="edit_src">IMG SRC</label>
<input name="edit_src[<?php htmlout($attribute['id']); ?>]" id="edit_src" value="<?php htmlout($attribute['src']); ?>">

<label for="editAsset">Edit</label><input type="checkbox" title= "<?php htmlout($path); ?>" name="editAsset[]" id="<?php htmlout($attribute['id']); ?>" value="<?php htmlout($attribute['id']); ?>"/>
<input type="hidden" name="asset_id" id="asset_id" value="<?php htmlout($attribute['id']); ?>">