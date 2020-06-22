<?php
require_once 'Asset.php';
require_once 'Image.php';
require_once 'Gallery.php';

class AssetFactory
{

    static public function createAsset($id, $page, $filename = null)
    {
        
        $img = array(
       //'.gif',
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
        
        if($page === 'photos'){
            return new Gallery($id, $page);
        }
        if(in_array(strrchr($filename,'.'), $img)){
            return new Image($id, $page);
        }
        
        elseif(in_array(strrchr($filename,'.'), $video)){
            return new Video($id, $page);
        }
        else return new Doc($id, $page);        
        }

}