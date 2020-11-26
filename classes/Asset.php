<?php
require_once 'AssetInterface.php';
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
    protected $table = 'assets';
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
            if (!(move_uploaded_file(trim($asset['tmp_name']) , $repo)))
            {
                $this->deleteAsset($this->id);
                trigger_error("Asset::storeUploadedFile(): Couldn't move uploaded file.", E_USER_ERROR);
            }
            if (!(chmod($repo, octdec("0777"))))
            {
                $this->deleteAsset($this->id);
                trigger_error("Asset::storeUploadedFile(): Couldn't set permissions on uploaded file.", E_USER_ERROR);
            }
        }
    }

    public function __construct($articleID, $page, $id)
    {
        //var_dump(func_get_args());
        $this->articleID = $articleID;
        $this->page = $page;
        $this->id = isset($id) ? $id : null; //only available on update not insert
        
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
        $this->ratio = isset($attrs['ratio'])  ? floatval($attrs['ratio']) : null;
        $this->offset = isset($attrs['edit_offset']) ? floatval($attrs['edit_offset']) : 0.5;
        $this->maxi = !empty($attrs['maxi']) ? intval($attrs['maxi']) : 0;
    }
    
    //Always ges called by Article:storeUploadedFile
    public function updateFile($asset, $attrs = array())
    {
        //exit(var_dump($asset));
        if (!empty($asset))
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
            $this->setProperties(array(), $attrs);
            exit(isset($attrs['edit_alt']));

            if (isset($attrs['edit_alt']) && isset($attrs['editAsset']))
            {
                foreach ($attrs['editAsset'] as $id)
                {
                    $this->alt_text = $attrs['edit_alt'][$id];
                    $this->dom_id = $attrs['edit_dom_id'][$id];
                    $this->id = $id;
                    $this->extension = $this->getStoredProperty('extension');
                    $this->filename = $this->getStoredProperty('name');
                    $this->ratio = isset($attrs['edit_ratio'])  ? (float)$attrs['edit_ratio'][$id] : null;
                    $this->offset = isset($attrs['edit_offset']) ? (float)$attrs['edit_offset'][$id] : 0.5;
                    $this->maxi = !empty($attrs['edit_maxi']) ? (int)$attrs['edit_maxi'][$id] : 0;
                    //exit(var_dump($this));
                    $this->createImage();
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
    abstract protected function createImage();
}