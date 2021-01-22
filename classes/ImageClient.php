<?php
include 'GifHandler.php';
include 'JpgHandler.php';
include 'PngHandler.php';
include 'ImageHandler.php';
class ImageClient
{
    public function __construct()
    {
        $Gif = new GifHandler();
        $Jpeg = new JpgHandler();
        $Png = new PngHandler();        
        $Image = new ImageHandler();        
        $Gif->setSuccessor($Jpeg);
        $Jpeg->setSuccessor($Png);
        $Png->setSuccessor($Image);
        $this->head = $Gif;
    }
    
    public function getHandler(){
        return $this->head;
    }
}
?>
