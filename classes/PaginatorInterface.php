<?php interface PaginatorInterface {
public function setPages($pp);
public function setRecords($r);
public function getRecords();
public function getList($pp = true);
public function setStart($start);
public function doNav();
}