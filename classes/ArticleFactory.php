<?php
require_once 'Asset.php';
require_once 'Image.php';
require_once 'Gallery.php';
require_once 'StandardArticle.php';
require_once 'GalleryArticle.php';

class ArticleFactory
{
    static public function createArticle($data = array(), $page = 'photos')
    {
        if($page === 'photos'){
            return new GalleryArticle($data);
        }
        return new StandardArticle($data);
    }
}