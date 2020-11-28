<?php
require_once 'Asset.php';
include_once '../includes/helpers.inc.php';

/**
 * Class to handle assets
 */
class Image extends Asset implements AssetInterface
{

    protected $queryAttrs = "SELECT assets.id, extension AS ext, alt, assets.attr_id AS dom_id, name, alt AS edit_alt FROM assets WHERE id = :id";
    
    protected function getFilePath($type, $repo)
    {
        return $repo . "/$type/" . $this->id . $this->extension;
    }
    
    protected function setFileSrc($row, $pathtype){
        $row['src'] = ARTICLE_IMAGE_PATH . '/' . $pathtype . '/' . $row['id'] . $row['ext'];
        return $row;
    }
    
    protected function doBind($st, $props){
        
    foreach($props as $prop){
        $st->bindValue(":$prop", $this->$prop, PDO::PARAM_STR);
    }
    }
    
    protected function getStoredProperty($prop)
    {
        $conn = getConn();
        $st = prepSQL($conn, $this->queryAttrs);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
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
        //exit($id .'66');//CURRENTLY image files ar uploaded to two locations, may change, and may to decide to delete from only one location
        $exec = $this->unlinkImages(unlinker(ARTICLE_IMAGE_PATH, IMG_TYPE_FULLSIZE, "Couldn't delete image file."), unlinker(ARTICLE_IMAGE_PATH, IMG_TYPE_THUMB, "Couldn't delete thumbnail file."));
            $exec($id);
            //optional delete/archive?
            $exec = $this->unlinkAsset(unlinker(ARTICLE_UPLOAD_PATH_ARTICLE, IMG_TYPE_FULLSIZE, "Couldn't delete image file."));
            $exec($id);
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
        $st->bindValue(":alt", $this->alt, PDO::PARAM_STR);
        $st->bindValue(":attr", $this->dom_id, PDO::PARAM_STR);
        $st->bindValue(":art", $this->articleID, PDO::PARAM_INT);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error updating asset');
        $conn = null;
    }
    protected function validate($asset)
    {
        $this->doValidate($asset, $this->getFilePath(IMG_TYPE_FULLSIZE, ARTICLE_UPLOAD_PATH_ARTICLE));
    }
    /* https://www.elated.com/add-image-uploading-to-your-cms/ */
    //https://stackoverflow.com/questions/46027710/display-image-from-outside-the-web-root-public-html
    protected function createImage()
    {
        // Get the image size and type
        $source_image = $this->getFilePath(IMG_TYPE_FULLSIZE, ARTICLE_UPLOAD_PATH_ARTICLE);
        buildIMG($source_image, $this->getFilePath(IMG_TYPE_FULLSIZE, ARTICLE_IMAGE_PATH), floatval($this->ratio), floatval($this->offset), intval($this->maxi));
        buildIMG($source_image, $this->getFilePath(IMG_TYPE_THUMB, ARTICLE_IMAGE_PATH), floatval($this->ratio), floatval($this->offset), IMG_THUMB_WIDTH, JPEG_QUALITY);
    }
  
    public function insert()
    {
        // Does the Image object already have an ID?
        if (!empty($this->id))
        {
            trigger_error("Asset::insert(): Attempt to insert an Asset object that already has its ID property set (to $this->id).", E_USER_ERROR);
        }
        // Insert the Image
        $conn = getConn();
        $sql = "INSERT INTO assets (extension, name, alt, attr_id) VALUES (:extension, :name, :alt, :domid)";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":extension", $this->extension, PDO::PARAM_STR);
        $st->bindValue(":alt", $this->alt, PDO::PARAM_STR);
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
    
      public function delete($id)
    {
        $conn = getConn();
        $sql = "SELECT id, attr_id FROM assets WHERE id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retreiving record');
        $row = $st->fetch(PDO::FETCH_NUM);
        $this->removeFile($row[0]);
    }
    
        /*
    public function delete($id)
    {
        $conn = getConn();
        $sql = "SELECT assets.id, assets.attr_id, extension FROM assets INNER JOIN article_asset AS AA ON AA.asset_id = assets.id INNER JOIN articles ON AA.article_id = articles.id WHERE articles.id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->articleID, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retreiving record');
        
        while ($row = $st->fetch(PDO::FETCH_NUM))
        {
            if ($id == $row[0])
            {
             $this->removeFile($id);
            }
        }
    }
    */
    
}