<?php
require_once 'AssetInterface.php';
require_once 'Image.php';

require_once $_SERVER['DOCUMENT_ROOT'] . '/Michelf/Markdown.inc.php';
use Michelf\MarkdownExtra;
/**
* Class to handle assets
*/
class Doc extends Image implements AssetInterface
{
    
    protected $path2file = ARTICLE_ASSETS_PATH . '/';
    
    
      protected function getFilePath($type, $repo)
   {
       return $path2file . $this->page . '/' . $this->filename . $this->extension;
   }
    
     public function getAttributes($flag = false){
        $uber = [];
        $st = $this->queryAttributes();
        while ($row = $st->fetch(PDO::FETCH_ASSOC))
        {
            $row['path'] = $this->path2file . $this->page . '/' . $row['name'] . $row['ext'];
            $uber[] = $row;
        }
         //var_dump($uber);
        return $uber;
    }
    
}