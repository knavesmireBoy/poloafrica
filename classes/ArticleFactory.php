<?php
require_once 'Asset.php';
require_once 'Image.php';
require_once 'Gallery.php';

class ArticleFactory
{
    static public function createAsset($data = array(), $page)
    {
        if($page === 'photos'){
            return new GalleryArticle($data);
        }
        return new StandardArticle($data);
    }
}