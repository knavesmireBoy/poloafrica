<h2>Poloafrica Admin</h2>
<form action="?" method="post" class="page">
<div>
<label for="name">Title</label><input name="name" id="name" value="<?php htmlout($results['name']); ?>" required></div>
<div>
<label for="content">Content</label><input  name="content" id="content" value="<?php htmlout($results['content']); ?>" ></div>
<div><label for="description">Description</label><input  name="description" id="description" value="<?php htmlout($results['description']); ?>"></div>
<div><label for="metatitle">Meta Title</label><input  name="metatitle" id="metatitle" value="<?php htmlout($results['title']); ?>"></div>
<div><label for="path">Image</label><input name="path" id="path" value="<?php htmlout($results['image']); ?>"></div>
<div><label for="url">URL</label><input name="url" id="url" value="<?php htmlout($results['url']); ?>"></div>
<input type="hidden" name="id" value="<?php if(isset($results['id'])) {
    htmlout($results['id']);
}?>">
<input type="submit" name="action" value="<?php htmlout($results['action']); ?>">
<input type="submit" name="action" value="Delete" >
<input type="submit" name="abort" value="Cancel" formnovalidate>
</form>