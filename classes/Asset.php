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
    public $id = null;
    public $page = null;
    protected $extension = "";
    protected $filename = null;
    protected $article = null;
    protected $alt = "";
    protected $dom_id = "";
    protected $table = 'assets';
    protected $ratio = null;
    protected $offset = .5;
    protected $maxi = 0;
    protected function setDomId($arg = false)
    {
        return $arg;
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
        $this->articleID = $articleID;
        $this->page = $page;
        $this->id = isset($id) ? $id : null; //only available on update not insert
    }
        
    protected function sortProps($k, $v, $id = null){
        if(preg_match('/^edit_/', $k)){
            $k = substr($k, 5);
        }
            $this->$k =  $id ? $v[$id] : $v;
    }
    
    protected function setAssetProperties($attrs, $update = false){
        $allowed = ['alt', 'dom_id', 'ratio', 'offset', 'maxi'];       
        if($update){
          $allowed = array_map(function($v){
              return "edit_$v";
          }, $allowed);
            $inter = array_filter(array_map(retWhen('isArray'), $attrs), 'notNull');
            return array_filter($inter, function ($key) use ($allowed) { return in_array($key, $allowed); }, ARRAY_FILTER_USE_KEY);
        }
        $inter = array_filter(array_map(retWhen(negate('isArray')), $attrs), 'notNull');
        $filtered = array_filter($inter, function ($key) use ($allowed) { return in_array($key, $allowed); }, ARRAY_FILTER_USE_KEY);
        foreach($filtered as $k => $v){
            $this->sortProps($k, $v);
        }
    }
    
    //receives uploaded either
    protected function setProperties($asset, $attrs = array())
    {
        $this->filename = empty($asset) ? $this->getStoredProperty('name') : extractString($asset['name'], true);
        $this->extension = empty($asset) ?  $this->getStoredProperty('ext') : extractString($asset['name']);
        //for gallery photos we want to be able to swap images BUT maintain order of insertion so decouple id from stored image name
        $this->setAssetProperties($attrs);
        //template pattern, only required for Gallery, as already set on above line
        $this->dom_id = $this->setDomId($attrs['dom_id']);
    }
    
    //Always gets called by Article:storeUploadedFile
    public function storeUploadedFile($asset, $attrs = array())
    {
            // Does the Image object have an articleID?
            if (is_null($this->articleID))
            {
                trigger_error("Asset::storeUploadedFile(): Attempt to upload an image for an Asset object that does not have its articleID property set.", E_USER_ERROR);
            }
            $this->setProperties($asset, $attrs);
            $this->insert();
            $this->validate($asset);
            $this->createImage();
    }
    
    public function updateFile($attrs = array())
    {
        $asset_props = $this->setAssetProperties($attrs, true);
                foreach ($attrs['editAsset'] as $id)
                {
                    $this->id = $id;
                    $this->extension = $this->getStoredProperty('ext');
                    $this->filename = $this->getStoredProperty('name');
                      foreach($asset_props as $k => $v){
                          $this->sortProps($k, $v, $id);
                      }
                    $this->createImage();
                    $this->update();
                }
    }

        public function getAttributes($flag = false)
    {
        $conn = getConn();
        $st = prepSQL($conn, $this->queryAttrs);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retrieving filepath');
        $pathtype = $flag ? IMG_TYPE_THUMB : IMG_TYPE_FULLSIZE;
        $row = $st->fetch(PDO::FETCH_ASSOC);
        return $this->setFileSrc($row, $pathtype);
    }
    abstract protected function getFilePath($type, $repo);
    abstract protected function createImage();
}