    <label for="edit_alt">Alt Text/Title</label>
    <input name="edit_alt" id="edit_alt" value="<?php htmlout($filepath['alt']); ?>">
    <label for="edit_dom_id">DOM Id</label>
    <input name="edit_dom_id" id="edit_dom_id" value="<?php htmlout($filepath['dom_id']); ?>">
<label for="editAsset">Edit</label><input type="checkbox" title= "<?php htmlout($path); ?>" name="editAsset[]" id="<?php htmlout($filepath['id']); ?>" value="<?php htmlout($filepath['id']); ?>"/>
    <input type="hidden" name="asset_id" id="asset_id" value="<?php htmlout($filepath['id']); ?>">