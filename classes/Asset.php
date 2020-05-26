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
    public $extension = "";
    public $articleID = null;
    protected $article = null;
    protected $alt_text = "";
    protected $dom_id = "";
    public $id = null;
    protected $filename = null;
    protected $img_extensions = array(
        '.gif',
        '.jpg',
        '.jpeg',
        '.pjpeg',
        '.png',
        '.x-png'
    );

    public function __construct($articleID /*, Article $article*/)
    {
        $this->articleID = $articleID;
        $this->setPropertiesFromQuery();
    }

    protected function setPropertiesFromUpload($asset, $extra)
    {
        $this->filename = strtolower(explode('.', trim($asset['name'])) [0]);
        $this->extension = strtolower(strrchr($asset['name'], '.'));
        $this->alt_text = isset($extra['alt']) ? $extra['alt'] : '';
        $this->dom_id = isset($extra['dom_id']) ? $extra['dom_id'] : '';
    }

    protected function setPropertiesFromQuery()
    {
        $conn = getConn();
        $sql = "SELECT id, extension FROM assets INNER JOIN article_asset ON assets.id = asset_id WHERE article_asset.article_id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->articleID, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retreiving the name for this page');
        $res = $st->fetch(PDO::FETCH_NUM);
        $this->id = $res[0];
        $this->extension = $res[1];
    }

    protected function getNameFromId()
    {
        $conn = getConn();
        $sql = "SELECT name FROM assets INNER JOIN article_asset ON assets.id = asset_id WHERE article_asset.article_id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->articleID, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retreiving the name for this file');
        $res = $st->fetch(PDO::FETCH_NUM);
        return $res[0];
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
        return function () use ($f1)
        {
            $f1($this->filename);
        };
    }

    protected function isImage()
    {
        return in_array($this->extension, $this->img_extensions);
    }

    /* https://www.elated.com/add-image-uploading-to-your-cms/ */
    protected function createImage($image)
    {
        if (!$this->isImage())
        {
            return;
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
            if (!(move_uploaded_file($asset['tmp_name'], $this->getFilePath())))
            {
                trigger_error("Asset::storeUploadedFile(): Couldn't move uploaded file.", E_USER_ERROR);
            }
            if (!(chmod($this->getFilePath() , 0666)))
            {
                trigger_error("Asset::storeUploadedFile(): Couldn't set permissions on uploaded file.", E_USER_ERROR);
            }
        }
    }
    /**
     * Stores any image uploaded from the edit form
     *
     * @param assoc The 'image' element from the $_FILES array containing the file upload data
     */
    public function storeUploadedFile($asset, $extra = array())
    {
        if ($asset['error'] == UPLOAD_ERR_OK)
        {
            // Does the Image object have an ID?
            if (is_null($this->articleID))
            {
                trigger_error("Asset::storeUploadedFile(): Attempt to upload an image for an Article object that does not have its ID property set.", E_USER_ERROR);
            }
            $this->setPropertiesFromUpload($asset, $extra);
            $this->insert();
            $this->validate($asset);
            $this->createImage($asset);
        }
    }
    public function getFilePath($type = IMG_TYPE_FULLSIZE)
    {

        if ($this->id && $this->extension && !in_array($this->extension, $this->img_extensions))
        {
            $page = $this->getPageName();
            return ARTICLE_ASSETS_PATH . "/$page/" . $this->filename . $this->extension;
        }
        return ($this->id && $this->extension) ? (ARTICLE_IMAGE_PATH . "/$type/" . $this->id . $this->extension) : $this->id;
    }

    protected function getPageName()
    {
        $conn = getConn();
        $sql = "SELECT name FROM pages INNER JOIN page_article ON page_article.page_id = pages.id INNER JOIN articles ON articles.id = page_article.article_id WHERE articles.id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->articleID, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retreiving the name for this page');
        return $st->fetch() [0];
    }
    /* IMAGES CAN EITHER BE INSERTED OR DELETED */
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
        $st = $conn->prepare($sql);
        $st->bindValue(":extension", $this->extension, PDO::PARAM_STR);
        $st->bindValue(":name", $this->filename, PDO::PARAM_STR);
        $st->bindValue(":alt", $this->alt_text, PDO::PARAM_STR);
        $st->bindValue(":domid", $this->dom_id, PDO::PARAM_STR);
        $st->execute();
        $this->id = $conn->lastInsertId();
        $sql = "INSERT INTO article_asset (article_id, asset_id) VALUES (:aID, :id)";
        $st = $conn->prepare($sql);
        $st->bindValue(":aID", $this->articleID, PDO::PARAM_INT);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        $st->execute();
        $conn = null;
    }
    public function update()
    {
    }
    public function delete($id)
    {
        if ($this->isImage())
        {
            $exec = $this->unlinkImages(unlinker(ARTICLE_IMAGE_PATH, IMG_TYPE_FULLSIZE, "Couldn't delete image file.") , unlinker(ARTICLE_IMAGE_PATH, IMG_TYPE_THUMB, "Couldn't delete thumbnail file."));
            $exec($id);
        }
        else
        {
            $exec = $this->unlinkAsset(unlinker(ARTICLE_ASSETS_PATH, $this->getPageName() , "Couldn't delete the asset."));
            $exec($this->getNameFromId());
        }
    }
}