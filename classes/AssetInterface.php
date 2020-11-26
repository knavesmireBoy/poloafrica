<?php interface AssetInterface {
public function updateFile($asset, $attrs = array());
public function insert();
public function delete($id);
public function getAttributes($flag = false);
}