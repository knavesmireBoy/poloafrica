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

    
     static public function getFileName($path)
    {
        return substr(strrchr($path, "/\d+/") , 1);
    }
    
    public static function getById($id)
    {
        $conn = getConn();
        $sql = "SELECT id, title, summary, content, attr_id, page, UNIX_TIMESTAMP(pubDate) AS pubDate FROM articles WHERE id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error fetching data from article');
        $row = $st->fetch(PDO::FETCH_ASSOC);
        $conn = null;
        if ($row)
        {
            return ArticleFactory::createArticle($row, $row['page']);
        }
    }
    /**
     * Returns all (or a range of) Article objects in the DB
     *
     * @param int Optional The number of rows to return (default=all)
     * @return Array|false A two-element array : results => array, a list of Article objects; totalRows => Total number of articles
     */

    public static function getList($numRows = 1000000)
    {
        $conn = getConn();
        $sql = "SELECT SQL_CALC_FOUND_ROWS *, UNIX_TIMESTAMP(pubDate) AS pubDate FROM articles ORDER BY pubDate DESC LIMIT :numRows";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":numRows", $numRows, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error fetching list from articles');
        $list = array();
        while ($row = $st->fetch(PDO::FETCH_ASSOC))
        {
            $article = ArticleFactory::createArticle($row, $row['page']);
            /* AJS assoc array */
            $list[$article->title] = $article;
        }
        // Now get the total number of articles that matched the criteria
        $sql = "SELECT FOUND_ROWS() AS totalRows";
        $totalRows = $conn->query($sql)->fetch();
        $conn = null;
        return (array(
            "results" => $list,
            "totalRows" => $totalRows[0]
        ));
    }

    public static function getTitles($pp, $flag)
    {
        $conn = getConn();
        $sql = "SELECT title FROM articles WHERE page = :pp ORDER BY id ASC";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":pp", $pp, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retreiving articles for this page');
        $rows = $st->fetchAll(PDO::FETCH_ASSOC);
        //('mya'=>'myarticle', 'you'=>'yourearticle)...dropDown for selecting a target position for insertion of new/updated article
        if($flag){
            return array_combine(array_map(function($str){
            return strtolower(substr($str['title'], 0, 3));
        }, $rows), array_map(function($str){
            return strtolower($str['title']);
        }, $rows));
        }
        return $rows;
    }

    public static function getPages()
    {
        $conn = getConn();
        $sql = "SELECT name FROM pages;";
        $st = prepSQL($conn, $sql);
        doPreparedQuery($st, 'Error fetching list of pages');
        $ret = array();
        while ($row = $st->fetch(PDO::FETCH_NUM))
        {
            $ret[] = $row[0];
        }
        return $ret;
    }

    public static function getListByPage($pp)
    {
        $conn = getConn();
        $list = array();
        $sql = "SELECT articles.id, title, summary, content, attr_id, page, UNIX_TIMESTAMP(pubDate) AS pubDate FROM articles WHERE page = :pp";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":pp", $pp, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retreiving articles for this page');
        while ($row = $st->fetch(PDO::FETCH_ASSOC))
        {
            $article = ArticleFactory::createArticle($row, $row['page']);
            $list[$article->title] = $article;
        }
        return $list;
    }

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

    /*
            AT ONE POINT ATTEMPTED TO CLONE AN ARTICLE THE SOURCE OF WHICH WAS IN THE DESIRED POSITION ON THE PAGE
            BECAUSE OF FOREIGN KEY CONSTRAINTS THIS IS THE ORDER IN WHICH THINGS WERE DONE KEEP FOR REF?
            //CLONE
            $sql = "INSERT INTO articles (pubDate, title, summary, content, attr_id, page) SELECT pubDate, CONCAT('_', title), summary, content, attr_id, page FROM articles WHERE id= :id";
             //GET ID
             $sql = "SELECT asset_id FROM article_asset WHERE article_id = :id";
            //:words insertID, :pics $id from line above
             $sql = "INSERT INTO article_asset VALUES(:words, :pics)";
             //currentAssetID
              $sql = "DELETE FROM article_asset WHERE article_asset.article_id = :id";
              //current article id
              $sql = "DELETE FROM articles WHERE id = :id";*/


    public function storeUploadedFile($uploaded, $attrs = array())
    {
        $asset = AssetFactory::createAsset($this->id, $this->page);
        $asset->storeUploadedFile($uploaded, $attrs);
    }
}