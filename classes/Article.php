<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/Michelf/MarkdownExtra.inc.php';
use Michelf\MarkdownExtra;

/**
* Class to handle articles
*/

class Article
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

   protected $video_extensions = array('.mp4','.avi');
   protected $reg = "/[^\.\,\-\_\'\"\@\?\!\:\$ a-zA-Z0-9()]/";

   public $id = null;
   public $pubDate = null;
   public $title = null;
   public $summary = null;
   public $content = null;
   public $mdcontent = null;
   public $page = null;
   public $attrID = null;

   protected function doUnlink($f1, $f2){
           return function($id) use($f1, $f2){
               //NESTED $f1 returns same arg to $f2
               $f2($f1($id));
       };
       }

     protected function getForeignTable(){
         return $this->page === 'photos' ? 'gallery' : 'assets';
     }

    protected function getLinkTable(){
         return $this->page === 'photos' ? 'article_gallery' : 'article_asset';
     }

   protected function getRepo(){
         return $this->page === 'photos' ? ARTICLE_GALLERY_PATH : ARTICLE_IMAGE_PATH;
     }

   protected function isImage($ext){
       return in_array($ext, $this->img_extensions);
   }

   protected function isGif($ext){
       return $ext == '.gif';
   }

   protected function isVideo($ext){
       return in_array($ext, $this->video_extensions);
   }

   protected function removeAssets($id = null){
       $conn = getConn();
       $foreign = $this->getForeignTable();
       $linker = $this->getLinkTable();
       $sql = "SELECT id FROM $foreign AS repo INNER JOIN $linker AS AA ON repo.id = AA.asset_id WHERE AA.article_id = :id";
       $st = prepSQL($conn, $sql);
       $st->bindValue(":id", $this->id, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error fetching asset list');
       if($id){
           $asset = new Asset($this->id, $this->page);
           $asset->delete($id);
       }
       else {
           while ($row = $st->fetch(PDO::FETCH_NUM)){
               $asset = new Asset($this->id, $this->page);
               $asset->delete($row[0]);
           }
       }
       $conn = null;
   }

   static public function getFileName($path)
   {
       return substr(strrchr($path, "/\d+/") , 1);
   }

   public function __construct($data = array())
   {
       if (isset($data['id'])) $this->id = (int)$data['id'];
       if (isset($data['pubDate'])) $this->pubDate = (int)$data['pubDate'];
       if (isset($data['title'])) $this->title = preg_replace($this->reg, "", $data['title']);
       if (isset($data['summary'])) $this->summary = preg_replace($this->reg, "", $data['summary']);
       if (isset($data['attr_id'])){ $this->attrID = $data['attr_id']; }

       if (isset($data['content']))
       {
           $this->content = $data['content'];
           $this->mdcontent = MarkdownExtra::defaultTransform($data['content']);
       }
       if(isset($data['page'])){
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
   public static function getById($id)
   {
       $conn = getConn();        
       $sql = "SELECT id, title, summary, content, attr_id, page, UNIX_TIMESTAMP(pubDate) AS pubDate FROM articles WHERE id = :id";
       $st = prepSQL($conn, $sql);
       $st->bindValue(":id", $id, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error fetching data from article');
       $row = $st->fetch(PDO::FETCH_ASSOC);
       $conn = null;
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
        $st = prepSQL($conn, $sql);
       $st->bindValue(":numRows", $numRows, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error fetching list from articles');
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

    public static function getTitles($pp){
        $conn = getConn();
        $sql = "SELECT title FROM articles WHERE page = :pp";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":pp", $pp, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retreiving articles for this page');
        return $st->fetchAll(PDO::FETCH_ASSOC);
    }

   public static function getPages(){
       $conn = getConn();
       $list = array();
       $sql = "SELECT page FROM articles GROUP BY page;";
       $st = prepSQL($conn, $sql);
       doPreparedQuery($st, 'Error fetching list of pages');
       $ret = array();
       while($row = $st->fetch(PDO::FETCH_NUM)){
           $res[] = $row[0];
       }
       return $res;
    }


   public static function getListByPage($pp){
       $conn = getConn();
       $list = array();
       $sql = "SELECT articles.id, title, summary, content, attr_id, page, UNIX_TIMESTAMP(pubDate) AS pubDate FROM articles WHERE page = :pp";
       $st = prepSQL($conn, $sql);
       $st->bindValue(":pp", $pp, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error retreiving articles for this page');
       while ($row = $st->fetch(PDO::FETCH_ASSOC))
       {
           $article = new Article($row);
           $list[$article->title] = $article;
       }
       return $list;
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
   public function update()
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
   }
   public function delete()
   {
       // Does the Article object have an ID?
       if (is_null($this->id))
       {
           trigger_error("Article::delete(): Attempt to delete an Article object that does not have its ID property set", E_USER_ERROR);
       }        
       $this->removeAssets();
       
       $foreign = $this->getForeignTable();
       $linker = $this->getLinkTable();
       $conn = getConn();
       $sql = "DELETE repo FROM articles INNER JOIN $linker AS AA ON articles.id = AA.article_id INNER JOIN $foreign AS repo ON repo.id = AA.asset_id WHERE AA.article_id = :id";
       $st = prepSQL($conn, $sql);  
       $st->bindValue(":id", $this->id, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error deleting asset');

       $sql = "DELETE FROM articles WHERE id = :id";
       $st = prepSQL($conn, $sql);  
       $st->bindValue(":id", $this->id, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error deleting article');
       $conn = null;
   }
   public function getFilePath($flag = false)
   {
       $conn = getConn();
       $foreign = $this->getForeignTable();
       $linker = $this->getLinkTable();
       $sql = "SELECT repo.id, repo.extension, repo.alt, repo.attr_id, repo.name FROM $linker AS AA LEFT JOIN articles ON articles.id = AA.article_id LEFT JOIN $foreign AS repo ON AA.asset_id = repo.id WHERE articles.id = :id";

       $st = prepSQL($conn, $sql);  
       $st->bindValue(":id", $this->id, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error retrieving filepath');
       $paths = [];
       $uber = [];
       $pathtype = $flag ? '/' . IMG_TYPE_THUMB . '/' : '/' . IMG_TYPE_FULLSIZE . '/';
       $assetpath = ARTICLE_ASSETS_PATH . '/' . $this->page . '/';
       //isImage
       while ($row = $st->fetch(PDO::FETCH_NUM))
       {
           $paths = [];
           $paths['id'] = $row[0];
           $paths['alt'] = $row[2];
           $paths['edit_alt'] = $row[2];
           $paths['dom_id'] = $row[3];

           if($this->isImage($row[1])){
               $int = $this->page === 'photos' ? 3 : 0;
               //$paths['src'] = ARTICLE_IMAGE_PATH  . $pathtype . $row[0] . $row[1];
               $paths['src'] = $this->getRepo()  . $pathtype . $row[$int] . $row[1];
           }
           elseif($this->isVideo($row[1])){
               $paths['src'] = ARTICLE_VIDEO_PATH . '/' . $this->page . '/' . $row[4] . $row[1];
           }
           else {
               $paths['path'] = $assetpath . $row[4] . $row[1];
               if($this->isGif($row[1])){
                   $paths['src'] = $assetpath . $row[4] . $row[1];
               }                
           }
           $uber[] = $paths;
       }
       return $uber;
   }
   public function storeUploadedFile($uploaded, $attrs = array())
   {
       $asset = new Asset($this->id, $this->page);
       $asset->storeUploadedFile($uploaded, $attrs);
   }

   public function deleteAssets($id)
   {
       $this->removeAssets($id);
        $foreign = $this->getForeignTable();
       $linker = $this->getLinkTable();
       $conn = getConn();
       $sql = "DELETE repo, AA FROM $foreign AS repo, $linker AS AA WHERE repo.id = AA.asset_id AND repo.id = :id";
       /*USING FOREIGN KEY ON article_asset SO THIS QUERY WILL SUFFICE*/
       //$sql = "DELETE FROM $foreign AS repo WHERE repo.id = :id";
         $st = prepSQL($conn, $sql);  
       $st->bindValue(":id", $this->id, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error deleting asset from tables');
   }
}