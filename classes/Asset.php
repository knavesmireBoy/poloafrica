<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/Michelf/Markdown.inc.php';
use Michelf\Markdown;

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
  public $id = null;
    protected $extensions = array('.gif', '.jpg', '.jpeg', '.pjpeg', '.png', '.x-png');
    
    public function __construct($articleID/*, Article $article*/) {
         $this->articleID = $articleID;
         //$this->article = $article;
     }
    
    protected function getExtension($asset){
       return strtolower(strrchr( $asset['name'], '.'));
    }
    /* https://www.elated.com/add-image-uploading-to-your-cms/ */
    protected function createImage($image){
      // Get the image size and type
    $source_image = $this->getImagePath();
        $attrs = getimagesize ($source_image);
                 /*
        $imageWidth = imagesx($image);
        $imageHeight = imagesy($image);
        $imageType = exif_imagetype($image);
        */
        
    $imageWidth = $attrs[0];
      $imageHeight = $attrs[1];
      $imageType = $attrs[2];
      // Load the image into memory
      switch ($imageType) {
        case IMAGETYPE_GIF:
          $imageResource = imagecreatefromgif ( $this->getImagePath() );
          break;
        case IMAGETYPE_JPEG:
          $imageResource = imagecreatefromjpeg ( $this->getImagePath() );
          break;
        case IMAGETYPE_PNG:
          $imageResource = imagecreatefrompng ( $this->getImagePath() );
          break;
        default:
          trigger_error ( "Asset::storeUploadedFile(): Unhandled or unknown image type ($imageType)", E_USER_ERROR);
      }
      //Copy and resize the image to create the thumbnail
      $thumbHeight = intval ( $imageHeight / $imageWidth * IMG_THUMB_WIDTH );
      $thumbResource = imagecreatetruecolor ( IMG_THUMB_WIDTH, $thumbHeight );
      imagecopyresampled( $thumbResource, $imageResource, 0, 0, 0, 0, IMG_THUMB_WIDTH, $thumbHeight, $imageWidth, $imageHeight);

      //Save the thumbnail
      switch ( $imageType ) {
        case IMAGETYPE_GIF:
          imagegif ($thumbResource, $this->getImagePath( IMG_TYPE_THUMB));
          break;
        case IMAGETYPE_JPEG:
          imagejpeg ( $thumbResource, $this->getImagePath( IMG_TYPE_THUMB ), JPEG_QUALITY );
          break;
        case IMAGETYPE_PNG:
          imagepng ( $thumbResource, $this->getImagePath( IMG_TYPE_THUMB ) );
          break;
        default:
          trigger_error ( "Asset::storeUploadedFile(): Unhandled or unknown image type ($imageType)", E_USER_ERROR );
      }
    }
    
    protected function validate($tempFilename){
        if ( is_uploaded_file(trim($tempFilename))) {
        if ( !( move_uploaded_file($tempFilename, $this->getImagePath()))) {
            trigger_error( "Asset::storeUploadedFile(): Couldn't move uploaded file.", E_USER_ERROR );
        }
        if ( !( chmod( $this->getImagePath(), 0666 ) ) ) {
            trigger_error( "Asset::storeUploadedFile(): Couldn't set permissions on uploaded file.", E_USER_ERROR );
        }
      }
    }    
      /**
  * Stores any image uploaded from the edit form
  *
  * @param assoc The 'image' element from the $_FILES array containing the file upload data
  */
  public function storeUploadedFile($asset) {
    if ( $asset['error'] == UPLOAD_ERR_OK )
    {
      // Does the Image object have an ID?
      if ( is_null($this->articleID) ) {
          trigger_error( "Asset::storeUploadedFile(): Attempt to upload an image for an Article object that does not have its ID property set.", E_USER_ERROR);
          }
        $this->extension = $this->getExtension($asset);
        $this->insert();
        $this->validate($asset['tmp_name']);
       if(in_array($this->extension, $this->extensions)) {
            $this->createImage($asset);
       }
    }
  }
  public function getImagePath($type = IMG_TYPE_FULLSIZE) {
    return ( $this->id && $this->extension ) ?  (ARTICLE_IMAGE_PATH . "/$type/" . $this->id . $this->extension ) : $this->id;
  }
    /* IMAGES CAN EITHER BE INSERTED OR DELETED */
     public function insert() {
    // Does the Image object already have an ID?
    if ( !is_null( $this->id ) ) {
        trigger_error ( "Asset::insert(): Attempt to insert an Asset object that already has its ID property set (to $this->id).", E_USER_ERROR );
    }
    // Insert the Image
    $conn = getConn();
    $sql = "INSERT INTO assets (extension) VALUES (:extension)";
    $st = $conn->prepare ($sql);
    $st->bindValue( ":extension", $this->extension, PDO::PARAM_STR);
    $st->execute();
    $this->id = $conn->lastInsertId();
    $sql = "INSERT INTO article_asset ( article_id, asset_id ) VALUES (:aID, :id)";
    $st = $conn->prepare ( $sql );
    $st->bindValue( ":aID", $this->articleID, PDO::PARAM_INT );
    $st->bindValue( ":id", $this->id, PDO::PARAM_INT );
    $st->execute();
    $conn = null;
  }
      public function update() {}
      public function delete() {}
}