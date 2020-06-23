<?php
require_once 'AssetInterface.php';
require_once 'Doc.php';

//require_once $_SERVER['DOCUMENT_ROOT'] . '/Michelf/Markdown.inc.php';
//use Michelf\MarkdownExtra;
/**
* Class to handle assets
*/
class Video extends Doc implements AssetInterface
{
    protected $path2file = ARTICLE_VIDEO_PATH . '/' ;

     public function getAttributes($flag = false){
        $st = $this->queryAttributes($this->queryAttrs);
        $pathtype = $flag ?  IMG_TYPE_THUMB  :  IMG_TYPE_FULLSIZE;
        $row = $st->fetch(PDO::FETCH_ASSOC);
        $row['src'] = $this->path2file . $this->page . '/' . $row['name'] . $row['ext'];
        return $row;
    }
    
    
      protected function removeFile($id)
     {
         $exec = $this->unlinkAsset(unlinker(ARTICLE_VIDEO_PATH, $this->page, "Couldn't delete the asset."));
         $exec($this->getStoredProperty('name'));
    }

}