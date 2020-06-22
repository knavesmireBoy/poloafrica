<?php
require_once 'AssetInterface.php';
require_once 'Asset.php';

require_once $_SERVER['DOCUMENT_ROOT'] . '/Michelf/Markdown.inc.php';
use Michelf\MarkdownExtra;
/**
* Class to handle assets
*/
class Video extends Doc implements AssetInterface
{
    protected $path2file = ARTICLE_VIDEO_PATH . '/' . $this->page . '/';

}