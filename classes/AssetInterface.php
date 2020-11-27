<?php interface AssetInterface {
public function updateFile($attrs = array());
public function insert();
public function delete($id);
public function getAttributes($flag = false);
}