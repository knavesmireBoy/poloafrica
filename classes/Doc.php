<?php
require_once 'AssetInterface.php';
require_once 'Asset.php';

require_once $_SERVER['DOCUMENT_ROOT'] . '/Michelf/Markdown.inc.php';
use Michelf\MarkdownExtra;
/**
* Class to handle assets
*/
class Doc extends Image implements AssetInterface
{
    
    protected $path2file = ARTICLE_ASSETS_PATH . '/' . $this->page . '/';
    
     public function getAttributes($flag = false){
        $uber = [];
        $st = $this->queryAttributes();
        while ($row = $st->fetch(PDO::FETCH_ASSOC))
        {
            $row['src'] = $this->path2file . $row['name'] . $row['ext'];
            $uber[] = $row;
        }
        return $uber;
    }
    
}