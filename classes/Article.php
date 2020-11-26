<?php
require_once 'ArticleInterface.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/Michelf/MarkdownExtra.inc.php';
use Michelf\MarkdownExtra;

abstract class Article implements ArticleInterface
{
    // Properties
    protected $ext = null;
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
    
    protected function doBind($st){
        $st->bindValue(":pubDate", $this->pubDate, PDO::PARAM_INT);
        $st->bindValue(":title", $this->title, PDO::PARAM_STR);
        $st->bindValue(":summary", $this->summary, PDO::PARAM_STR);
        $st->bindValue(":content", $this->content, PDO::PARAM_STR);
        $st->bindValue(":attr", $this->attrID, PDO::PARAM_STR);
        $st->bindValue(":page", $this->page, PDO::PARAM_STR);
    }

    protected function getIdFromTitle($title)
    {
        $conn = getConn();
        $id = $conn->query("SELECT id FROM articles WHERE title LIKE '%$title%'")->fetch()[0];
        $conn = null;
        return $id;
    }

    protected function doRemoveAsset($id)
    {
        //null: delegate determining extension to subclass
        //on upload an array of attributes is expected so maintain that signature by wrapping id in array
        $asset = $this->createAsset(null, array('id' => $id));
        $asset->delete($id);
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
        $this->doBind($st);
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
        $sql = "UPDATE articles SET pubDate=FROM_UNIXTIME(:pubDate), title=:title, summary=:summary, content=:content, attr_id=:attr, page=:page WHERE articles.id = :id";
        $st = prepSQL($conn, $sql);
        $this->doBind($st);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error updating article');
        $conn = null;
        $this->placeArticle($title);
    }
    public function storeUploadedFile($uploaded, $attrs = array(), $pass = false)
    {        
        if(empty($uploaded['name'])){
            $uploaded = array();
            if($pass){
            $arr = $this->getFilePath()[0];
            $asset = $this->createAsset($arr['name'] . $arr['ext']);
            }
        }
        else {
        $asset = $this->createAsset($uploaded['name']);
        }
        if(isset($asset)){
            $asset->updateFile($uploaded, $attrs);
        }
    }

    public function getFilePath($flag = false)
    {
        $conn = getConn();
        $st = prepSQL($conn, $this->queryExt);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error updating article');
        $rows = $st->fetchAll(PDO::FETCH_ASSOC);
        $uber = array();
        foreach($rows as $row){
            //create an asset object for every asset
            $uber[] = $this->createAsset($row['ext'], array('id' => $row['id']))->getAttributes($flag);
        }
        return isset($uber[0]) ? $uber : array();
    }
}