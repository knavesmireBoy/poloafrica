<?php
require_once 'AssetInterface.php';
require_once 'Asset.php';

require_once $_SERVER['DOCUMENT_ROOT'] . '/Michelf/Markdown.inc.php';
use Michelf\MarkdownExtra;
/**
* Class to handle assets
*/
class Image extends Asset implements AssetInterface
{
   protected function setDomId(){
         return $this->id;
     }

   protected function getStoredProperty($prop)
   {
       $conn = getConn();
       $sql = "SELECT extension, name FROM assets INNER JOIN article_asset AS AA ON assets.id = AA.asset_id WHERE AA.article_id = :id";
       $st = prepSQL($conn, $sql);
       $st->bindValue(":id", $this->articleID, PDO::PARAM_INT);
       doPreparedQuery($st, "Error retreiving $prop for this file");
       $res = $st->fetch(PDO::FETCH_ASSOC);
       return isset($res[$prop]) ? $res[$prop] : "";
   }

   protected function getNameFromId()
   {
       $conn = getConn();
       $sql = "SELECT name FROM assets INNER JOIN article_asset AS AA ON assets.id = AA.asset_id WHERE AA.article_id = :id";
       $st = prepSQL($conn, $sql);
       $st->bindValue(":id", $this->articleID, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error retreiving the name for this file');
       $res = $st->fetch(PDO::FETCH_NUM);
       return $res[0];
   }

    protected function removeFile($id)
   {
       //CURRENTLY image files ar uploaded to two locations, may change, and may to decide to delete from only one location
       if ($this->isImage())
       {
           $exec = $this->unlinkImages(unlinker(ARTICLE_IMAGE_PATH, IMG_TYPE_FULLSIZE, "Couldn't delete image file.") , unlinker(ARTICLE_IMAGE_PATH, IMG_TYPE_THUMB, "Couldn't delete thumbnail file."));
           $exec($id);
           //optional delete?
           $exec = $this->unlinkAsset(unlinker(ARTICLE_IMAGE_PATH, IMG_TYPE_FULLSIZE, "Couldn't delete image file."));
           $exec($id);
       }
       else
       {
           $exec = $this->unlinkAsset(unlinker(ARTICLE_ASSETS_PATH, $this->page, "Couldn't delete the asset."));
           $exec($this->getNameFromId($id));
       }
   }
   protected function deleteAsset()
   {
       $conn = getConn();
       $sql = "DELETE assets, AA FROM assets, article_asset AS AA WHERE assets.id = AA.asset_id AND assets.id = :id";
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
       $sql = "UPDATE assets INNER JOIN article_asset AS AA ON AA.asset_id = assets.id SET alt=:alt, attr_id=:attr WHERE AA.article_id = :art AND assets.id = :id";
        $st = prepSQL($conn, $sql);
       $st->bindValue(":alt", $this->alt_text, PDO::PARAM_STR);
       $st->bindValue(":attr", $this->dom_id, PDO::PARAM_STR);
       $st->bindValue(":art", $this->articleID, PDO::PARAM_INT);
       $st->bindValue(":id", $this->id, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error updating asset');
       $conn = null;
   }
    
       protected function validate($asset) {
           $this->doValidate($asset, $this->getFilePath(IMG_TYPE_FULLSIZE, ARTICLE_IMAGE_PATH));
       }
       /* https://www.elated.com/add-image-uploading-to-your-cms/ */
    protected function createImage($image)
   {
       if (!$this->isImage())
       {
           return $this->getFilePath(IMG_TYPE_FULLSIZE, ARTICLE_ASSETS_PATH);
       }
       // Get the image size and type
       $source_image = $this->getFilePath(IMG_TYPE_FULLSIZE, ARTICLE_IMAGE_PATH);
       buildIMG($source_image, $this->getFilePath(IMG_TYPE_FULLSIZE, ARTICLE_IMAGE_PATH));
       buildIMG($source_image, $this->getFilePath(IMG_TYPE_THUMB, ARTICLE_IMAGE_PATH), JPEG_QUALITY, IMG_THUMB_WIDTH);
   }

   public function __construct($articleID, $page)
   {
       $this->articleID = $articleID;
       $this->page = $page;
   }

   public function delete($id)
       
   {
       $conn = getConn();
       $sql = "SELECT assets.id, assets.attr_id, extension FROM assets INNER JOIN article_asset AS AA ON AA.asset_id = assets.id INNER JOIN articles ON AA.article_id = articles.id WHERE articles.id = :id";
       $st = prepSQL($conn, $sql);
       $st->bindValue(":id", $this->articleID, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error retreiving record');

       while ($row = $st->fetch(PDO::FETCH_NUM))
       {
           //set the extension used in ::isImage to determine delete path
           $this->extension = $row[2];
           if ($id == $row[0])
           {
               $this->removeFile($id);
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
       $sql = "INSERT INTO assets (extension, name, alt, attr_id) VALUES (:extension, :name, :alt, :domid)";
       $st = prepSQL($conn, $sql);       
       $st->bindValue(":extension", $this->extension, PDO::PARAM_STR);
       $st->bindValue(":alt", $this->alt_text, PDO::PARAM_STR);
       $st->bindValue(":domid", $this->dom_id, PDO::PARAM_STR);
       $st->bindValue(":name", $this->filename, PDO::PARAM_STR);
       doPreparedQuery($st, "Error inserting record into assets table");
       $this->id = $conn->lastInsertId();

       $sql = "INSERT INTO article_asset (article_id, asset_id) VALUES (:aID, :id)";
       $st = prepSQL($conn, $sql);   
       $st->bindValue(":aID", $this->articleID, PDO::PARAM_INT);
       $st->bindValue(":id", $this->id, PDO::PARAM_INT);
       doPreparedQuery($st, "Error inserting record into article_asset table");
       $conn = null;
   }
}