<?php
require_once 'AssetInterface.php';
require_once 'Doc.php';

require_once $_SERVER['DOCUMENT_ROOT'] . '/Michelf/Markdown.inc.php';
use Michelf\MarkdownExtra;
/**
* Class to handle assets
*/
class Video extends Doc implements AssetInterface
{
    protected $path2file = ARTICLE_VIDEO_PATH . '/' ;
    
      protected function getFilePath($type, $repo)
      {
          return $this->path2file . $this->filename . $this->extension;
       }
    
       public function getAttributes($flag = false){
        $uber = [];
        $st = $this->queryAttributes();
        while ($row = $st->fetch(PDO::FETCH_ASSOC))
        {
            $row['src'] = $this->path2file . $this->page . '/' . $row['name'] . $row['ext'];
            $uber[] = $row;
        }
        return $uber;
    }

}