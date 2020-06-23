<?php
require_once 'AssetInterface.php';
//require_once $_SERVER['DOCUMENT_ROOT'] . '/Michelf/Markdown.inc.php';
//use Michelf\MarkdownExtra;
/**
* Class to handle assets
*/
abstract class Asset implements AssetInterface
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

     protected function setDomId()
    {
        return $this->id;
    }

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
   protected function doValidate($asset, $repo)
   {
       if (is_uploaded_file(trim($asset['tmp_name'])))
       {           
           if (!(move_uploaded_file(trim($asset['tmp_name']), $repo)))
           {
               $this->deleteAsset($this->id);
               trigger_error("Asset::storeUploadedFile(): Couldn't move uploaded file.", E_USER_ERROR);
           }
           if (!(chmod($repo, 0666)))
           {
               $this->deleteAsset($this->id);
               trigger_error("Asset::storeUploadedFile(): Couldn't set permissions on uploaded file.", E_USER_ERROR);
           }
       }
   }

   public function __construct($articleID, $page, $id)
   {
       $this->articleID = $articleID;
       $this->page = $page;
       $this->id = isset($id) ? $id : null;//only available on update not insert
   }
    
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
    
      protected function queryAttributes($sql)
    {
        $conn = getConn();
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retrieving filepath');
        return $st;
    }
    abstract public function getAttributes($flag = false);
    abstract protected function getFilePath($type, $repo); 
    abstract protected function createImage($asset); 
}