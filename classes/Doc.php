<?php
require_once 'AssetInterface.php';
require_once 'Image.php';
class Doc extends Image implements AssetInterface
{
    
    protected $path2file = ARTICLE_ASSETS_PATH . '/';
    
      protected function getFilePath($type, $repo)
   {
       return $this->path2file . $this->page . '/' . $this->filename . $this->extension;
   }    
   
    protected function createImage(){
        exit('blast');
    }
    
    public function getAttributes($flag = false){
        $st = $this->queryAttributes($this->queryAttrs);
        $pathtype = $flag ?  IMG_TYPE_THUMB  :  IMG_TYPE_FULLSIZE;
        $row = $st->fetch(PDO::FETCH_ASSOC);
        $row['path'] = $this->path2file . $this->page . '/' . $row['name'] . $row['ext'];
        return $row;
    }
    
     protected function removeFile($id)
     {
         $exec = $this->unlinkAsset(unlinker(ARTICLE_ASSETS_PATH, $this->page, "Couldn't delete the asset."));
         $exec($this->getStoredProperty('name'));
    }
    
}