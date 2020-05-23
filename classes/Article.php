<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/Michelf/MarkdownExtra.inc.php';
use Michelf\MarkdownExtra;

/**
 * Class to handle articles
 */

class Article
{
    // Properties
    /**
     * @var int The article ID from the database
     */
    public $id = null;

    /**
     * @var int When the article is to be / was first published
     */
    public $pubDate = null;

    /**
     * @var string Full title of the article
     */
    public $title = null;

    /**
     * @var string A short summary of the article
     */
    public $summary = null;

    /**
     * @var string The HTML content of the article
     */
    public $content = null;
    public $mdcontent = null;

    //public static $assets = self::$assets ? self::$assets  : array();
    
    /**
     * Sets the object's properties using the values in the supplied array
     *
     * @param assoc The property values
     */
    protected $reg = "/[^\.\,\-\_\'\"\@\?\!\:\$ a-zA-Z0-9()]/";
    
    protected function doUnlink($f1, $f2){
            return function($id) use($f1, $f2){
                //NESTED $f1 returns same arg to $f2
                $f2($f1($id));
        };
        }
    
    protected function removeAssets(){
        
        $remove = $this->doUnlink(unlinker(IMG_TYPE_FULLSIZE, "Couldn't delete image file."), unlinker(IMG_TYPE_THUMB, "Couldn't delete thumbnail file."));
        
        //$conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
         $conn = getConn();
        $sql = "SELECT asset_id FROM article_asset LEFT JOIN articles ON articles.id = article_asset.article_id WHERE articles.id = :id";
        $st = $conn->prepare($sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        $st->execute();
        while($row = $st->fetch(PDO::FETCH_NUM)){
           array_map($remove, $row); 
        }
        $conn = null;
    }

    public function __construct($data = array())
    {
        //echo($i);
        if (isset($data['id'])) $this->id = (int)$data['id'];
        if (isset($data['pubDate'])) $this->pubDate = (int)$data['pubDate'];
        if (isset($data['title'])) $this->title = preg_replace("/[^\.\,\-\_\'\"\@\?\!\:\$ a-zA-Z0-9()]/", "", $data['title']);
        if (isset($data['summary'])) $this->summary = preg_replace("/[^\.\,\-\_\'\"\@\?\!\:\$ a-zA-Z0-9()]/", "", $data['summary']);
        if (isset($data['content']))
        {
            $this->content = $data['content'];
            $this->mdcontent = MarkdownExtra::defaultTransform($data['content']);
        }
    }

    /**
     * Sets the object's properties using the edit form post values in the supplied array
     *
     * @param assoc The form post values
     */

    public function storeFormValues($params)
    {
        // Store all the parameters
        $this->__construct($params);
        // Parse and store the publication date
        $this->pubDate = formatDate($params['pubDate']);
    }

    /**
     * Returns an Article object matching the given article ID
     *
     * @param int The article ID
     * @return Article|false The article object, or false if the record was not found or there was a problem
     */

    public static function getById($id)
    {
        //$conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
         $conn = getConn();
        $sql = "SELECT *, UNIX_TIMESTAMP(pubDate) AS pubDate FROM articles WHERE id = :id";
        $st = $conn->prepare($sql);
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        $st->execute();
        $row = $st->fetch(PDO::FETCH_ASSOC);
        $conn = null;
        /*AJS: note returns a fresh instance, I was attemting to keep a reference to the series of images an article would deploy 
        but no mechanism would work when the previous instance is destroyed the persistance is in the database 
        The class is but a convenient wrapper around SQL queries*/
        if ($row) {
            return new Article($row);
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
        //$conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
        $conn = getConn();
        $sql = "SELECT SQL_CALC_FOUND_ROWS *, UNIX_TIMESTAMP(pubDate) AS pubDate FROM articles ORDER BY pubDate DESC LIMIT :numRows";

        $st = $conn->prepare($sql);
        $st->bindValue(":numRows", $numRows, PDO::PARAM_INT);
        $st->execute();
        $list = array();

        while ($row = $st->fetch(PDO::FETCH_ASSOC))
        {
            $article = new Article($row);
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
    /**
     * Inserts the current Article object into the database, and sets its ID property.
     */

    public function insert()
    {
        // Does the Article object already have an ID?
        if (!is_null($this->id))
        {
            trigger_error("Article::insert(): Attempt to insert an Article object that already has its ID property set (to $this->id).", E_USER_ERROR);
        }

        // Insert the Article
        //$conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
         $conn = getConn();
        $sql = "INSERT INTO articles ( pubDate, title, summary, content) VALUES ( FROM_UNIXTIME(:pubDate), :title, :summary, :content)";
        $st = $conn->prepare($sql);
        $st->bindValue(":pubDate", $this->pubDate, PDO::PARAM_INT);
        $st->bindValue(":title", $this->title, PDO::PARAM_STR);
        $st->bindValue(":summary", $this->summary, PDO::PARAM_STR);
        $st->bindValue(":content", $this->content, PDO::PARAM_STR);
        $st->execute();
        $this->id = $conn->lastInsertId();
        $conn = null;
    }
    /**
     * Updates the current Article object in the database.
     */

    public function update()
    {

        // Does the Article object have an ID?
        if (is_null($this->id))
        {
            trigger_error("Article::update(): Attempt to update an Article object that does not have its ID property set.", E_USER_ERROR);
        }

        // Update the Article
        //$conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
         $conn = getConn();
        $sql = "UPDATE articles SET pubDate=FROM_UNIXTIME(:pubDate), title=:title, summary=:summary, content=:content WHERE id = :id";
        $st = $conn->prepare($sql);
        $st->bindValue(":pubDate", $this->pubDate, PDO::PARAM_INT);
        $st->bindValue(":title", $this->title, PDO::PARAM_STR);
        $st->bindValue(":summary", $this->summary, PDO::PARAM_STR);
        $st->bindValue(":content", $this->content, PDO::PARAM_STR);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        $st->execute();
        $conn = null;
    }
    /**
     * Deletes the current Article object from the database.
     */

    public function delete()
    {
        // Does the Article object have an ID?
        if (is_null($this->id))
        {
            trigger_error("Article::delete(): Attempt to delete an Article object that does not have its ID property set", E_USER_ERROR);
        }        
        $this->removeAssets();
        $conn = getConn();
        $sql = "DELETE articles, assets, article_asset FROM articles LEFT JOIN article_asset ON articles.id = article_asset.article_id LEFT JOIN assets ON assets.id = article_asset.asset_id WHERE articles.id = :id";
        $st = $conn->prepare($sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        $st->execute();
        $conn = null;
    }
    public function getImagePath($flag = false)
    {
        //$conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
         $conn = getConn();
        $sql = "SELECT assets.id, assets.extension, assets.alt, assets.attr_id FROM article_asset LEFT JOIN articles ON articles.id = article_asset.article_id LEFT JOIN assets ON article_asset.asset_id = assets.id WHERE articles.id = :id";
        $st = $conn->prepare($sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        $st->execute();
        $paths = [];
        $uber = [];
        $pathtype = $flag ? IMG_TYPE_THUMB : IMG_TYPE_FULLSIZE;
        while ($row = $st->fetch(PDO::FETCH_NUM))
        {
            $paths['src'] = ARTICLE_IMAGE_PATH . '/' . $pathtype . '/' . $row[0] . $row[1];
            $paths['alt'] = $row[2];
            $paths['id'] = $row[3];
            $uber[] = $paths;
        }
        return $uber;
    }
    public function storeUploadedFile($image)
    {
        $img = new Asset($this->id);
        $img->storeUploadedFile($image);
    }

    static public function getFileName($path)
    {
        return substr(strrchr($path, "/\d+/") , 1);
    }
    public function deleteAssets($id)
    {
        $conn = getConn();
        $sql = "DELETE assets, article_image FROM assets, article_image WHERE assets.id = article_image.imageID AND assets.id = :id";
        $st = $conn->prepare($sql);
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        $st->execute();
        $remove = $this->doUnlink(unlinker(IMG_TYPE_FULLSIZE, "Couldn't delete image file."), unlinker(IMG_TYPE_THUMB, "Couldn't delete thumbnail file."));
        $remove($id);
    }
}