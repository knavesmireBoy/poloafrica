<?php
require_once 'Image.php';

class Gallery extends Image implements AssetInterface
{
    protected $onclause = " INNER JOIN articles ON gallery.article_id = articles.id WHERE articles.id = :id";
    protected $table = "gallery";

    protected function setDomId()
    {
        if (strlen($this->id) < 3)
        {
            return str_pad($this->id, 3, "0", STR_PAD_LEFT);
        }
        return $this->id;
    }

    protected $path2file = ARTICLE_GALLERY_PATH . '/';
    protected $queryAttrs = "SELECT id, extension AS ext, alt, attr_id AS dom_id, name, alt AS edit_alt FROM gallery WHERE id = :id";

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
        $this->filename = !empty($asset) ? strtolower(explode('.', trim($asset['name'])) [0]) : $this->getStoredProperty('name');
        $this->extension = !empty($asset) ? strtolower(strrchr(trim($asset['name']) , '.')) : $this->getStoredProperty('extension');
        //for gallery photos we want to be able to swap images BUT maintain order of insertion so decouple id from stored image name
        $this->dom_id = $this->setDomId();

        if (isset($attrs['alt']))
        { //insert
            $this->alt_text = $attrs['alt'];
            $this->dom_id = $attrs['dom_id'];
        }
        $this->ratio = isset($attrs['ratio'])  ? (float)$attrs['ratio'] : null;
        $this->offset = !empty($attrs['offset']) ? (float)$attrs['offset'] : 0.5;
        $this->maxi = !empty($attrs['maxi']) ? (int)$attrs['maxi'] : 0;
    }
    protected function getFilePath($type, $repo)
    {
        //currently storing images in root folder of site and out of root folder $repo refers to one or other locations
        return $repo . "/$type/" . $this->setDomId() . $this->extension;
    }

    /* https://www.elated.com/add-image-uploading-to-your-cms/ */
    protected function createImage()
    {
        // Get the image size and type
        $source_image = $this->getFilePath(IMG_TYPE_FULLSIZE, ARTICLE_UPLOAD_PATH);
        buildIMG($source_image, $this->getFilePath(IMG_TYPE_FULLSIZE, ARTICLE_GALLERY_PATH), 1.5, $this->offset, 1600, 100);
        buildIMG($source_image, $this->getFilePath(IMG_TYPE_THUMB, ARTICLE_GALLERY_PATH), 1.5, $this->offset, IMG_THUMB_WIDTH, JPEG_QUALITY);
    }
    
    protected function removeFile($id)
    {
        //CURRENTLY image files ar uploaded to two locations, may change, and may to decide to delete from only one location
        $exec = $this->unlinkImages(unlinker(ARTICLE_GALLERY_PATH, IMG_TYPE_FULLSIZE, "Couldn't delete image file.") , unlinker(ARTICLE_GALLERY_PATH, IMG_TYPE_THUMB, "Couldn't delete thumbnail file."));
        $exec($id);
        //optional delete?
        //$exec = $this->unlinkAsset(unlinker(ARTICLE_UPLOAD_PATH, IMG_TYPE_FULLSIZE, "Couldn't delete image file."));
        //$exec($id);
    }
      
     protected function deleteAsset()
    {
        $conn = getConn();
        $sql = "DELETE FROM gallery WHERE gallery.id = :id";
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

    protected function validate($asset)
    {
        $this->doValidate($asset, $this->getFilePath(IMG_TYPE_FULLSIZE, ARTICLE_UPLOAD_PATH));
    }
    
     public function delete($id)
    {
        $conn = getConn();
        $sql = "SELECT id, attr_id FROM gallery WHERE id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retreiving record');
        $row = $st->fetch(PDO::FETCH_NUM);
        $this->removeFile($row[0]);
        $this->removeFile($row[1]);        
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
        $sql = "INSERT INTO gallery (extension, name, alt, attr_id, article_id) VALUES (:extension, :name, :alt, :domid, :articleID)";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":extension", $this->extension, PDO::PARAM_STR);
        $st->bindValue(":alt", $this->alt_text, PDO::PARAM_STR);
        $st->bindValue(":domid", $this->dom_id, PDO::PARAM_STR);
        $st->bindValue(":name", $this->filename, PDO::PARAM_STR);
        $st->bindValue(":articleID", $this->articleID, PDO::PARAM_STR);
        doPreparedQuery($st, "Error inserting record into gallery table");
        $this->id = $conn->lastInsertId();
        $this->dom_id = $this->setDomId();
        $sql = "UPDATE gallery SET attr_id = :aID WHERE id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":aID", $this->dom_id, PDO::PARAM_STR);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, "Error updating record in gallery table");
        $conn = null;
    }
    
    public function getAttributes($flag = false)
    {
        $st = $this->queryAttributes($this->queryAttrs);
        $pathtype = $flag ? IMG_TYPE_THUMB : IMG_TYPE_FULLSIZE;
        $row = $st->fetch(PDO::FETCH_ASSOC);
        $row['src'] = $this->path2file . $pathtype . '/' . $row['dom_id'] . $row['ext'];
        return $row;
    }
}