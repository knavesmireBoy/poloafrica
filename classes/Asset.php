<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/Michelf/Markdown.inc.php';
use Michelf\MarkdownExtra;
/**
* Class to handle assets
*/
class Asset
{
   /**
    * @var string The filename extension of the article's full-size and thumbnail images (empty string means the article has no image)
    */

   public $articleID = null;
   protected $extension = "";
   protected $article = null;
   protected $alt_text = "";
   protected $dom_id = "";
   public $id = null;
   public $page = null;
   protected $filename = null;
   //protected $misql = "SELECT id, extension, name FROM assets INNER JOIN article_asset ON assets.id = asset_id WHERE article_asset.article_id = :id";
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

   protected function unlinkImages($f1, $f2)
   {
       return function ($id) use ($f1, $f2)
       {
           //NESTED $f1 returns same arg to $f2
           $f2($f1($id));
       };
   }

   protected function unlinkAsset($f1)
   {
       return function ($fname) use ($f1)
       {
           $f1($fname);
       };
   }

   protected function isImage()
   {
       return in_array($this->extension, $this->img_extensions);
   }

   protected function isVideo($ext)
   {
       return in_array($ext, $this->video_extensions);
   }

   protected function getForeignTable(){
         return $this->page === 'photos' ? 'gallery' : 'assets';
     }

   protected function getLinkTable(){
         return $this->page === 'photos' ? 'article_gallery' : 'article_asset';
     }

   protected function getRepo(){
         return $this->page ==='photos' ? ARTICLE_GALLERY_PATH : ARTICLE_IMAGE_PATH;
     }


    protected function storeName(){
         return $this->page == 'photos' ? str_pad($this->id, 3, "0", STR_PAD_LEFT) : $this->id;
     }

   protected function setDomId(){
         return ($this->page == 'photos') ? str_pad($this->id, 3, "0", STR_PAD_LEFT) : 'cc';
     }


   protected function getStoredProperty($prop)
   {
       $conn = getConn();
       $foreign = $this->getForeignTable();
       //$sql = "SELECT extension, name FROM assets INNER JOIN article_asset ON assets.id = asset_id WHERE article_asset.article_id = :id";
       $linker = $this->getLinkTable();
       $onclause = $this->page === 'photos' ? 'AA.gallery_id' : 'AA.asset_id';
       $sql = "SELECT extension, name FROM $foreign AS repo INNER JOIN $linker AS AA ON repo.id = $onclause WHERE AA.article_id = :id";
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
       $foreign = $this->getForeignTable();
       $linker = $this->getLinkTable();
       $onclause = $this->page === 'photos' ? 'AA.gallery_id' : 'AA.asset_id';
       //$sql = "SELECT name FROM assets INNER JOIN article_asset ON assets.id = asset_id WHERE article_asset.article_id = :id";
       $sql = "SELECT name FROM $foreign AS repo INNER JOIN $linker AS AA ON repo.id = $onclause WHERE AA.article_id = :id";
       $st = prepSQL($conn, $sql);
       $st->bindValue(":id", $this->articleID, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error retreiving the name for this file');
       $res = $st->fetch(PDO::FETCH_NUM);
       return $res[0];
   }

   protected function getFilePath($type = IMG_TYPE_FULLSIZE)
   {
       if ($this->id && $this->extension && in_array($this->extension, $this->img_extensions))
       {
           //return ARTICLE_IMAGE_PATH . "/$type/" . $this->id . $this->extension;
           return $this->getRepo() . "/$type/" . $this->storeName() . $this->extension;
       }
       elseif ($this->id && $this->extension && in_array($this->extension, $this->video_extensions))
       {
           return ARTICLE_VIDEO_PATH . "/$this->page/" . $this->filename . $this->extension;
       }
       return ARTICLE_ASSETS_PATH . "/$this->page/" . $this->filename . $this->extension;
   }

   /* https://www.elated.com/add-image-uploading-to-your-cms/ */
   protected function createImage($image)
   {
       if (!$this->isImage())
       {
           return $this->getFilePath();
       }
       // Get the image size and type
       $source_image = $this->getFilePath();
       $attrs = getimagesize($source_image);
       /*
       $imageWidth = imagesx($image);
       $imageHeight = imagesy($image);
       $imageType = exif_imagetype($image);
       */

       $imageWidth = $attrs[0];
       $imageHeight = $attrs[1];
       $imageType = $attrs[2];
       // Load the image into memory
       switch ($imageType)
       {
           case IMAGETYPE_GIF:
               $imageResource = imagecreatefromgif($this->getFilePath());
           break;
           case IMAGETYPE_JPEG:
               $imageResource = imagecreatefromjpeg($this->getFilePath());
           break;
           case IMAGETYPE_PNG:
               $imageResource = imagecreatefrompng($this->getFilePath());
           break;
           default:
               trigger_error("Asset::storeUploadedFile(): Unhandled or unknown image type ($imageType)", E_USER_ERROR);
       }
       //Copy and resize the image to create the thumbnail
       $thumbHeight = intval($imageHeight / $imageWidth * IMG_THUMB_WIDTH);
       $thumbResource = imagecreatetruecolor(IMG_THUMB_WIDTH, $thumbHeight);
       imagecopyresampled($thumbResource, $imageResource, 0, 0, 0, 0, IMG_THUMB_WIDTH, $thumbHeight, $imageWidth, $imageHeight);

       //Save the thumbnail
       switch ($imageType)
       {
           case IMAGETYPE_GIF:
               imagegif($thumbResource, $this->getFilePath(IMG_TYPE_THUMB));
           break;
           case IMAGETYPE_JPEG:
               imagejpeg($thumbResource, $this->getFilePath(IMG_TYPE_THUMB) , JPEG_QUALITY);
           break;
           case IMAGETYPE_PNG:
               imagepng($thumbResource, $this->getFilePath(IMG_TYPE_THUMB));
           break;
           default:
               trigger_error("Asset::storeUploadedFile(): Unhandled or unknown image type ($imageType)", E_USER_ERROR);
       }
   }

   protected function validate($asset)
   {
       if (is_uploaded_file(trim($asset['tmp_name'])))
       {
           if (!(move_uploaded_file(trim($asset['tmp_name']) , $this->getFilePath())))
           {
               $this->deleteAsset($this->id);
               trigger_error("Asset::storeUploadedFile(): Couldn't move uploaded file.", E_USER_ERROR);
           }
           if (!(chmod($this->getFilePath(), 0666)))
           {
               $this->deleteAsset($this->id);
               trigger_error("Asset::storeUploadedFile(): Couldn't set permissions on uploaded file.", E_USER_ERROR);
           }
       }
   }

   protected function deleteAsset()
   {
       $conn = getConn();
       $foreign = $this->getForeignTable();
       $linker = $this->getLinkTable();
       $onclause = $this->page === 'photos' ? 'AA.gallery_id' : 'AA.asset_id';
       //$sql = "DELETE assets, article_asset FROM assets, article_asset WHERE assets.id = article_asset.asset_id AND assets.id = :id";
       //$sql = "DELETE $foreign AS repo, $linker AS AA FROM $foreign, AA WHERE repo.id = $onclause AND repo.id = :id";
       $sql = "DELETE gallery, article_gallery FROM gallery, article_gallery WHERE gallery.id = article_gallery.gallery_id AND gallery.id = :id";
       $st = $conn->prepare($sql);
       $st->bindValue(":id", $this->id, PDO::PARAM_INT);
       $st->execute();
   }

   protected function removeFile($id)
   {
       if ($this->isImage())
       {
           /*$exec = $this->unlinkImages(unlinker(ARTICLE_IMAGE_PATH, IMG_TYPE_FULLSIZE, "Couldn't delete image file.") , unlinker(ARTICLE_IMAGE_PATH, IMG_TYPE_THUMB, "Couldn't delete thumbnail file."));
           $exec($id);
           */

           $exec = $this->unlinkImages(unlinker($this->getRepo(), IMG_TYPE_FULLSIZE, "Couldn't delete image file.") , unlinker($this->getRepo(), IMG_TYPE_THUMB, "Couldn't delete thumbnail file."));
           $exec($id);
       }
       else
       {
           $exec = $this->unlinkAsset(unlinker(ARTICLE_ASSETS_PATH, $this->page, "Couldn't delete the asset."));
           $exec($this->getNameFromId($id));
       }
   }

   protected function update()
   {
       //Does the Asset object have an ID?
       if (is_null($this->id)) trigger_error("Asset::update(): Attempt to update an Asset object that does not have its ID property set.", E_USER_ERROR);

       $conn = getConn();
       $foreign = $this->getForeignTable();
       $linker = $this->getLinkTable();
       $onclause = $this->page === 'photos' ? 'AA.gallery_id' : 'AA.asset_id';
       //$sql = "UPDATE assets INNER JOIN article_asset ON article_asset.asset_id = assets.id SET alt=:alt, attr_id=:attr WHERE article_asset.article_id = :art AND assets.id = :id";
       $sql = "UPDATE $foreign AS repo INNER JOIN $linker AS AA ON $onclause = repo.id SET alt=:alt, attr_id=:attr WHERE AA.article_id = :art AND repo.id = :id";
       $st = $conn->prepare($sql);
       $st->bindValue(":alt", $this->alt_text, PDO::PARAM_STR);
       $st->bindValue(":attr", $this->dom_id, PDO::PARAM_STR);
       $st->bindValue(":art", $this->articleID, PDO::PARAM_INT);
       $st->bindValue(":id", $this->id, PDO::PARAM_INT);
       $st->execute();
       $conn = null;
   }

   public function __construct($articleID, $page)
   {
       $this->articleID = $articleID;
       $this->page = $page;
   }

   public function delete($id)
   {
       $conn = getConn();
       $st = prepSQL($conn, $this->misql);
       $st->bindValue(":id", $this->articleID, PDO::PARAM_INT);
       doPreparedQuery($st, 'Error retreiving record');

       while ($row = $st->fetch(PDO::FETCH_NUM))
       {
           //$this->id = $row[0];
           //set the extension used in ::isImage to determine delete path
           $this->extension = $row[1];
           if ($id == $row[0])
           {
               $this->removeFile($id);
           }
       }
   }

   /**
    * Stores any image uploaded from the edit form
    *
    * @param assoc The 'image' element from the $_FILES array containing the file upload data
    */
   public function storeUploadedFile($asset, $attrs = array())
   {
       if ($asset['error'] == UPLOAD_ERR_OK)
       { //fresh upload, inserting
           // Does the Image object have an articleID?
           if (is_null($this->articleID))
           {
               trigger_error("Asset::storeUploadedFile(): Attempt to upload an image for an Asset object that does not have its articleID property set.", E_USER_ERROR);
           }
           $this->setProperties($asset, $attrs);
           $this->insert();
           $this->validate($asset);
           $this->createImage($asset);
           
       }
       else if (!empty($attrs))
       { //modify img attributes, updating
           $this->setProperties(array() , $attrs);

           if (isset($attrs['edit_alt']) && isset($attrs['editAsset']))
           {
               foreach ($attrs['editAsset'] as $id)
               {
                   $this->alt_text = $attrs['edit_alt'][$id];
                   $this->dom_id = $attrs['edit_dom_id'][$id];
                   $this->id = $id;
                   $this->update();
               }
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
       $foreign = $this->getForeignTable();
       $sql = "INSERT INTO $foreign (extension, name, alt, attr_id) VALUES (:extension, :name, :alt, :domid)";
       $st = $conn->prepare($sql);
       $st->bindValue(":extension", $this->extension, PDO::PARAM_STR);
       $st->bindValue(":alt", $this->alt_text, PDO::PARAM_STR);
       $st->bindValue(":domid", $this->dom_id, PDO::PARAM_STR);
       $st->bindValue(":name", $this->filename, PDO::PARAM_STR);
       $st->execute();
       $this->id = $conn->lastInsertId();
       $linker = $this->getLinkTable();
       $col = $this->page === 'photos' ? 'gallery_id' : 'asset_id';

       $sql = "INSERT INTO $linker (article_id, $col) VALUES (:aID, :id)";
       $st = $conn->prepare($sql);
       $st->bindValue(":aID", $this->articleID, PDO::PARAM_INT);
       $st->bindValue(":id", $this->id, PDO::PARAM_INT);
       $st->execute();
       if($this->page == 'photos'){
           $this->dom_id = $this->setDomId();
           $sql = "UPDATE gallery SET attr_id = :aID WHERE id = :id"; 
           $st = $conn->prepare($sql);
           
       $st->bindValue(":aID", $this->dom_id, PDO::PARAM_STR);
       $st->bindValue(":id", $this->id, PDO::PARAM_INT);
           $st->execute();
       }
       $conn = null;
   }
}