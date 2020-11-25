<?php
require_once 'Asset.php';
require_once 'Image.php';
require_once 'Gallery.php';
require_once 'Doc.php';
require_once 'Video.php';

class AssetFactory
{
    static public function createAsset($articleId, $page, $filename = null, $attrs = array())
    {
        $img = array(
       '.gif',
       '.jpg',
       '.jpeg',
       '.pjpeg',
       '.png',
       '.x-png'
   );
        $video = array(
       '.mp4',
       '.avi'
   );
        //allow for uppercase extension
        $img = array_merge($img, array_map('strtoupper', $img));
        $video = array_merge($video, array_map('strtoupper', $img));
        
        //exit(var_dump(strrchr($filename,'.')));
        $id = isset($attrs['id']) ? $attrs['id'] : '';
        if($page === 'photos' || $page === 'bond'){
            return new Gallery($articleId, $page, $id);
        }
        if(in_array(strrchr($filename,'.'), $img)){
            return new Image($articleId, $page, $id);
        }
        
        elseif(in_array(strrchr($filename,'.'), $video)){
            return new Video($articleId, $page, $id);
        }
        else return new Doc($articleId, $page, $id);        
        }    
}