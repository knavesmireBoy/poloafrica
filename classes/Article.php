<?php
require_once 'ArticleInterface.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Michelf/MarkdownExtra.inc.php';
use Michelf\MarkdownExtra;

/**
 * Class to handle articles
 */

abstract class Article implements ArticleInterface
{
    // Properties
    protected $ext = null;
    //wanted to exclude animated gifs review
    protected $img_extensions = array(
        //'.gif',
        '.jpg',
        '.jpeg',
        '.pjpeg',
        '.png',
        '.x-png'
    );

    protected $video_extensions = array(
        '.mp4',
        '.avi'
    );
    protected $reg = "/[^\.\,\-\_\'\"\@\?\!\:\$ a-zA-Z0-9()]/";

    public $id = null;
    public $pubDate = null;
    public $title = null;
    public $summary = null;
    public $content = null;
    public $mdcontent = null;
    public $page = null;
    public $attrID = null;

    protected function doUnlink($f1, $f2)
    {
        return function ($id) use ($f1, $f2)
        {
            //NESTED $f1 returns same arg to $f2
            $f2($f1($id));
        };
    }

    protected function isImage($ext)
    {
        return in_array($ext, $this->img_extensions);
    }

    protected function isGif($ext)
    {
        return $ext == '.gif';
    }

    protected function isVideo($ext)
    {
        return in_array($ext, $this->video_extensions);
    }

    protected function getIdFromTitle($title)
    {
        $conn = getConn();
        $id = $conn->query("SELECT id FROM articles WHERE title LIKE '$title%'")->fetch() [0];
        $conn = null;
        return $id;
    }

    abstract protected function removeAssets($id = null);

    public function __construct($data)
    {
        if (isset($data['id'])) $this->id = (int)$data['id'];
        if (isset($data['pubDate'])) $this->pubDate = (int)$data['pubDate'];
        if (isset($data['title'])) $this->title = preg_replace($this->reg, "", $data['title']);
        if (isset($data['summary'])) $this->summary = preg_replace($this->reg, "", $data['summary']);
        if (isset($data['attr_id']))
        {
            $this->attrID = $data['attr_id'];
        }

        if (isset($data['content']))
        {
            $this->content = $data['content'];
            $this->mdcontent = MarkdownExtra::defaultTransform($data['content']);
        }
        if (isset($data['page']))
        {
            $this->page = preg_replace($this->reg, "", $data['page']);
        }
    }
    
    /* direct Article attrs */
    public function storeFormValues($params)
    {
        // Store all the parameters
        $this->__construct($params);
        // Parse and store the publication date
        $this->pubDate = formatDate($params['pubDate']);
    }
        
    public function insert($data = array())
    {
        // Does the Article object already have an ID?
        if (!is_null($this->id))
        {
            trigger_error("Article::insert(): Attempt to insert an Article object that already has its ID property set (to $this->id).", E_USER_ERROR);
        }
        // Insert the Article
        $conn = getConn();
        $sql = "INSERT INTO articles (pubDate, title, summary, content, attr_id, page) VALUES ( FROM_UNIXTIME(:pubDate), :title, :summary, :content, :attr, :page)";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":pubDate", $this->pubDate, PDO::PARAM_INT);
        $st->bindValue(":title", $this->title, PDO::PARAM_STR);
        $st->bindValue(":summary", $this->summary, PDO::PARAM_STR);
        $st->bindValue(":content", $this->content, PDO::PARAM_STR);
        $st->bindValue(":attr", $this->attrID, PDO::PARAM_STR);
        $st->bindValue(":page", $this->page, PDO::PARAM_STR);
        doPreparedQuery($st, 'Error inserting article');
        $this->id = $conn->lastInsertId();
        $conn = null;
    }
    public function update($title)
    {
        // Does the Article object have an ID?
        if (is_null($this->id))
        {
            trigger_error("Article::update(): Attempt to update an Article object that does not have its ID property set.", E_USER_ERROR);
        }
        // Update the Article
        $conn = getConn();
        $sql = "UPDATE articles SET pubDate=FROM_UNIXTIME(:pubDate), title=:title, summary=:summary, content=:content, attr_id=:attr, page=:page WHERE id = :id";

        $st = prepSQL($conn, $sql);
        $st->bindValue(":pubDate", $this->pubDate, PDO::PARAM_INT);
        $st->bindValue(":title", $this->title, PDO::PARAM_STR);
        $st->bindValue(":summary", $this->summary, PDO::PARAM_STR);
        $st->bindValue(":content", $this->content, PDO::PARAM_STR);
        $st->bindValue(":attr", $this->attrID, PDO::PARAM_STR);
        $st->bindValue(":page", $this->page, PDO::PARAM_STR);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error updating article');
        $conn = null;
        $this->placeArticle($title);
    }
    public function storeUploadedFile($uploaded, $attrs = array())
    {
        $asset = AssetFactory::createAsset($this->id, $this->page);
        $asset->storeUploadedFile($uploaded, $attrs);
    }
}