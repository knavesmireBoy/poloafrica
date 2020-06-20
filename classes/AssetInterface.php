<?php interface AssetInterface {
public function storeUploadedFile($asset, $attrs = array());
public function insert();
public function delete($id);
}