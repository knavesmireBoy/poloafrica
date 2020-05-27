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
    public $page = null;
    public $attrID = null;
    protected $ext = null;
    protected $img_extensions = array('.gif', '.jpg', '.jpeg', '.pjpeg', '.png', '.x-png');

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
    
    protected function isImage($ext){
        return in_array($ext, $this->img_extensions);
    }
    
     protected function getPageName(){
        $conn = getConn();
        $sql = "SELECT name FROM pages INNER JOIN page_article ON page_article.page_id = pages.id INNER JOIN articles ON articles.id = page_article.article_id WHERE articles.id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retreiving the name for this page');
        return $st->fetch()[0];
    }
    
    protected function getPageProp($i){
        $conn = getConn();
        $sql = "SELECT PP.id, PP.name FROM pages AS PP, page_article AS PA, articles AS A WHERE PA.page_id = PP.id AND A.id = PA.article_id AND A.id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retreiving page id');
        return $st->fetch()[$i];
    }
    
     protected function getPageId(){
        $conn = getConn();
        $sql = "SELECT pages.id FROM pages WHERE pages.name = :page";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":page", $this->page, PDO::PARAM_STR);
        doPreparedQuery($st, 'Error retreiving page id');
        return $st->fetch()[0];
    }
    
    protected function setPageName($pagename){
        $conn = getConn();
        $sql = "UPDATE pages, page_article, articles SET pages.name = :name WHERE pages.id = page_article.page_id AND page_article.article_id = articles.id AND articles.id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        $st->bindValue(":name", $pagename, PDO::PARAM_STR);
        doPreparedQuery($st, 'Error setting page name');
    }

    public function __construct($data = array())
    {
        //echo($i);
        if (isset($data['id'])) $this->id = (int)$data['id'];
        if (isset($data['pubDate'])) $this->pubDate = (int)$data['pubDate'];
        if (isset($data['title'])) $this->title = preg_replace($this->reg, "", $data['title']);
        if (isset($data['summary'])) $this->summary = preg_replace($this->reg, "", $data['summary']);
        if (isset($data['content']))
        {
            $this->content = $data['content'];
            $this->mdcontent = MarkdownExtra::defaultTransform($data['content']);
        }
        if(isset($data['page'])){
            $this->page = preg_replace($this->reg, "", $data['page']);
            //$this->setPageName(preg_replace($this->reg, "", $data['page']));
            //$this->page = $this->getPageName();
        }
        if (isset($data['asset'])){
        $asset = new Asset($this->id);
        $asset->update($data);
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
         $conn = getConn();
        $sql = "SELECT id, title, summary, pubDate, content, attr_id, UNIX_TIMESTAMP(pubDate) AS pubDate FROM articles WHERE id = :id";
        
        $sql = "SELECT articles.id, title, summary, pubDate, content, attr_id, UNIX_TIMESTAMP(pubDate) AS pubDate, name AS page FROM articles, page_article AS PA, pages AS PP WHERE articles.id = PA.article_id AND PA.page_id = PP.id AND articles.id = :id";
        
        $st = $conn->prepare($sql);
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        $st->execute();
        $row = $st->fetch(PDO::FETCH_ASSOC);
        $conn = null;
        /*AJS: note returns a fresh instance, I was attemting to keep a reference to the series of images an article would deploy 
        but no mechanism would work when the previous instance is destroyed the persistance is in the database 
        Turns out this class is but a convenient wrapper around SQL queries*/
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
    
    public static function getListByPage($id){
        $conn = getConn();
        $list = array();
        $sql = "SELECT articles.id, title, summary, content, attr_id, UNIX_TIMESTAMP(pubDate) AS pubDate, pages.name AS page FROM articles INNER JOIN page_article ON articles.id = page_article.article_id INNER JOIN pages ON pages.id = page_article.page_id WHERE page_id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retreiving articles for this page');
        while ($row = $st->fetch(PDO::FETCH_ASSOC))
        {
            $article = new Article($row);
            $list[$article->title] = $article;
        }
        return $list;
    }
    /**
     * Inserts the current Article object into the database, and sets its ID property.
     */

    public function insert($data = array())
    {
        // Does the Article object already have an ID?
        if (!is_null($this->id))
        {
            trigger_error("Article::insert(): Attempt to insert an Article object that already has its ID property set (to $this->id).", E_USER_ERROR);
        }
        // Insert the Article
        //$conn = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
         $conn = getConn();
        $sql = "INSERT INTO articles (pubDate, title, summary, content, attr_id) VALUES ( FROM_UNIXTIME(:pubDate), :title, :summary, :content, :attr)";
        $st = $conn->prepare($sql);
        $st->bindValue(":pubDate", $this->pubDate, PDO::PARAM_INT);
        $st->bindValue(":title", $this->title, PDO::PARAM_STR);
        $st->bindValue(":summary", $this->summary, PDO::PARAM_STR);
        $st->bindValue(":content", $this->content, PDO::PARAM_STR);
        $st->bindValue(":attr", $this->attrID, PDO::PARAM_STR);
        $st->execute();
        $this->id = $conn->lastInsertId();
        //$this->setPageName(preg_replace($this->reg, "", $data['page']));
        //$this->page = $this->getPageProp(1);
        $sql = "INSERT INTO page_article (page_id, article_id) VALUES (:page, :article)";
        $st = $conn->prepare($sql);
        $st->bindValue(":page", $this->getPageId(), PDO::PARAM_INT);
        $st->bindValue(":article", $this->id, PDO::PARAM_INT);
        $st->execute();
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
         $conn = getConn();
        
        $sql = "UPDATE articles SET pubDate=FROM_UNIXTIME(:pubDate), title=:title, summary=:summary, content=:content, attr_id=:attr WHERE id = :id";
        
        $st = prepSQL($conn, $sql);        
        $st->bindValue(":pubDate", $this->pubDate, PDO::PARAM_INT);
        $st->bindValue(":title", $this->title, PDO::PARAM_STR);
        $st->bindValue(":summary", $this->summary, PDO::PARAM_STR);
        $st->bindValue(":content", $this->content, PDO::PARAM_STR);
        $st->bindValue(":attr", $this->attrID, PDO::PARAM_STR);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error updating article');
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
        $sql = "DELETE assets FROM articles INNER JOIN article_asset AS AA ON articles.id = AA.article_id INNER JOIN assets ON assets.id = AA.asset_id WHERE AA.article_id = :id";
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        $st->execute();
                
        $sql = "DELETE FROM articles WHERE id = :id";
        $st = $conn->prepare($sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        $st->execute();
        $conn = null;
    }
    public function getFilePath($flag = false)
    {
        $conn = getConn();
        $sql = "SELECT assets.id, assets.extension, assets.alt, assets.attr_id, assets.name FROM article_asset LEFT JOIN articles ON articles.id = article_asset.article_id LEFT JOIN assets ON article_asset.asset_id = assets.id WHERE articles.id = :id";
        $st = $conn->prepare($sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        $st->execute();
        $paths = [];
        $uber = [];
        $pathtype = $flag ? IMG_TYPE_THUMB : IMG_TYPE_FULLSIZE;
        $src = ARTICLE_IMAGE_PATH . '/' . $pathtype . '/';        
        //isImage
        while ($row = $st->fetch(PDO::FETCH_NUM))
        {
            if($this->isImage($row[1])){
                $paths['src'] = ARTICLE_IMAGE_PATH . '/' . $pathtype . '/' . $row[0] . $row[1];
                $paths['alt'] = $row[2];
                $paths['id'] = $row[0];
                $paths['dom_id'] = $row[3];
            }
            else {
                $paths['path'] = ARTICLE_ASSETS_PATH . '/' . $this->getPageProp(1) . '/' . $row[4] . $row[1];
                $paths['id'] = $row[0];
                $paths['alt'] = $row[2];
                $paths['dom_id'] = $row[3];
            }
            $uber[] = $paths;
        }
        return $uber;
    }
    public function storeUploadedFile($image, $extra = array())
    {
        $asset = new Asset($this->id);
        $asset->storeUploadedFile($image, $extra);
    }

    static public function getFileName($path)
    {
        return substr(strrchr($path, "/\d+/") , 1);
    }
    
    protected function removeAssets($id = null){
        $conn = getConn();
        $sql = "SELECT id FROM assets INNER JOIN article_asset ON assets.id = asset_id WHERE article_asset.article_id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error fetching asset list');
        if($id){
            $asset = new Asset($this->id);
            $asset->delete($id);
        }
        else {
            while ($row = $st->fetch(PDO::FETCH_NUM)){
                $asset = new Asset($this->id);
                $asset->delete($row[0]);
            }
        }
        $conn = null;
    }
    
    public function deleteAssets($id)
    {
        $this->removeAssets($id);
        $conn = getConn();
        $sql = "DELETE assets, article_asset FROM assets, article_asset WHERE assets.id = article_asset.asset_id AND assets.id = :id";
        $st = $conn->prepare($sql);
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        $st->execute();
    }
}