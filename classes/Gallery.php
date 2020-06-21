<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/Michelf/Markdown.inc.php';
use Michelf\MarkdownExtra;
/**
* Class to handle assets
*/
class Gallery extends Asset implements AssetInterface
{
    /*
   protected function getForeignTable(){
         return $this->page === 'photos' ? 'gallery' : 'assets';
     }

   protected function getLinkTable(){
         return $this->page === 'photos' ? 'article_gallery' : 'article_asset';
     }
*/
    protected $onclause = " INNER JOIN articles ON gallery.article_id = articles.id WHERE articles.id = :id";

    protected function storeName(){}

   protected function setDomId(){
          if(strlen($this->id) < 3){
         return str_pad($this->id, 3, "0", STR_PAD_LEFT);
        }
        return $this->id;
     }

   protected function getStoredProperty($prop)
   {
       $conn = getConn();
       $sql = "SELECT extension, name FROM gallery $this->onclause";
       $st = prepSQL($conn, $sql);
       $st->bindValue(":id", $this->articleID, PDO::PARAM_INT);
       doPreparedQuery($st, "Error retreiving $prop for this file");
       $res = $st->fetch(PDO::FETCH_ASSOC);
       return isset($res[$prop]) ? $res[$prop] : "";
   }

   protected function setProperties($asset, $attrs = array())
   {
       $this->filename = !empty($asset) ? strtolower(explode('.', trim($asset['name']))[0]) : $this->getStoredProperty('name');
       $this->extension = !empty($asset) ? strtolower(strrchr(trim($asset['name']) , '.')) : $this->getStoredProperty('extension');
       //for gallery photos we want to be able to swap images BUT maintain order of insertion so decouple id from stored image name
       $this->dom_id = $this->setDomId();

       if (isset($attrs['alt']))
       { //insert
           $this->alt_text = $attrs['alt'];
           $this->dom_id = $attrs['dom_id'];
       }
   }
   protected function getNameFromId()
   {
       $conn = getConn();
       $sql = "SELECT name FROM gallery $this->onclause";
       $st = prepSQL($conn, $sql);
       $st->bindValue(":id", $this->articleID, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error retreiving the name for this file');
       $res = $st->fetch(PDO::FETCH_NUM);
       return $res[0];
   }

   protected function getFilePath($type, $repo)
   {
       if ($this->id && $this->extension && in_array($this->extension, $this->img_extensions))
       {
           return $repo . "/$type/" . $this->setDomId() . $this->extension;
       }
   }
            
       /* https://www.elated.com/add-image-uploading-to-your-cms/ */
   protected function createImage($image)
   {
       // Get the image size and type
       $source_image = $this->getFilePath(IMG_TYPE_FULLSIZE, ARTICLE_UPLOAD_PATH);
       buildIMG($source_image, $this->getFilePath(IMG_TYPE_FULLSIZE, ARTICLE_GALLERY_PATH));
       buildIMG($source_image, $this->getFilePath(IMG_TYPE_THUMB, ARTICLE_GALLERY_PATH), JPEG_QUALITY, IMG_THUMB_WIDTH);
   }

    
    protected function removeFile($id)
   {
        //CURRENTLY image files ar uploaded to two locations, may change, and may to decide to delete from only one location
        $exec = $this->unlinkImages(unlinker(ARTICLE_GALLERY_PATH, IMG_TYPE_FULLSIZE, "Couldn't delete image file."), unlinker(ARTICLE_GALLERY_PATH, IMG_TYPE_THUMB, "Couldn't delete thumbnail file."));
           $exec($id);
           //optional delete?
           $exec = $this->unlinkAsset(unlinker(ARTICLE_UPLOAD_PATH, IMG_TYPE_FULLSIZE, "Couldn't delete image file."));
           $exec($id);
   }
   protected function deleteAsset()
   {
       $conn = getConn();
       $sql = "DELETE FROM gallery WHERE gallery.id = :id LIMIT 1";
       $st = prepSQL($conn, $sql);
       $st->bindValue(":id", $this->id, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error deleting asset from tables');
       $conn = null;
   }

   protected function update()
   {
       //Does the Asset object have an ID?
       if (is_null($this->id)) trigger_error("Asset::update(): Attempt to update an Asset object that does not have its ID property set.", E_USER_ERROR);

       $conn = getConn();
       $sql = "UPDATE gallery SET alt = :alt, attr_id = :attr WHERE gallery.id = :id";
       $st = prepSQL($conn, $sql);
       $st->bindValue(":alt", $this->alt_text, PDO::PARAM_STR);
       $st->bindValue(":attr", $this->dom_id, PDO::PARAM_STR);
       $st->bindValue(":id", $this->id, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error updating asset');
       $conn = null;
   }
    
     protected function validate($asset) {
           $this->doValidate($asset, $this->getFilePath(IMG_TYPE_FULLSIZE, ARTICLE_UPLOAD_PATH));
       }

   public function __construct($articleID, $page)
   {
       $this->articleID = $articleID;
       $this->page = $page;
   }

   public function delete($id)
       
   {
       $conn = getConn();       
       $sql = "SELECT gallery.id, gallery.attr_id, extension FROM gallery $this->onclause";
       $st = prepSQL($conn, $sql);
       $st->bindValue(":id", $this->articleID, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error retreiving record');

       
       while ($row = $st->fetch(PDO::FETCH_NUM))
       {
           //set the extension used in ::isImage to determine delete path
           $this->extension = $row[2];
           if("0$id" == $row[1]){
               //$this->removeFile("0$id");
           }
       }
   }

   public function insert()
   {
       // Does the Image object already have an ID?
       if (!is_null($this->id))
       {
           trigger_error("Asset::insert(): Attempt to insert an Asset object that already has its ID property set (to $this->id).", E_USER_ERROR);
       }
       // Insert the Image
       $conn = getConn();
       $sql = "INSERT INTO gallery (extension, name, alt, attr_id, article_id) VALUES (:extension, :name, :alt, :domid, :articleID)";
       $st = prepSQL($conn, $sql);       
       $st->bindValue(":extension", $this->extension, PDO::PARAM_STR);
       $st->bindValue(":alt", $this->alt_text, PDO::PARAM_STR);
       $st->bindValue(":domid", $this->dom_id, PDO::PARAM_STR);
       $st->bindValue(":name", $this->filename, PDO::PARAM_STR);
       $st->bindValue(":articleID", $this->articleID, PDO::PARAM_STR);
       doPreparedQuery($st, "Error inserting record into $foreign table");
       $this->id = $conn->lastInsertId();
           $this->dom_id = $this->setDomId();
           $sql = "UPDATE gallery SET attr_id = :aID WHERE id = :id"; 
           $st = prepSQL($conn, $sql);     
           $st->bindValue(":aID", $this->dom_id, PDO::PARAM_STR);
           $st->bindValue(":id", $this->id, PDO::PARAM_INT);
           doPreparedQuery($st, "Error updating record in gallery table");
       $conn = null;
   }
}