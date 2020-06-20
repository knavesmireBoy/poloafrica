<?php
require_once 'Asset.php';
require_once 'Image.php';
require_once 'Gallery.php';

class AssetFactory
{
    static public function createAsset($id, $page)
    {
        if($page === 'photos'){
            return new Gallery($id, $page);
        }
        return new Image($id, $page);
    }
}