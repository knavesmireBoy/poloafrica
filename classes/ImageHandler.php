<?php
include_once 'ResourceHandler.php';
class ImageHandler extends ResourceHandler {
    public $resource = null;
    protected $quality = null;
    protected $filepath = null;
    protected $successor;
        
    public function setSuccessor($next) {}

    public function handleRequest ($src, $filepath, $quality = null)
    {
        $type = strtolower(substr(strrchr($src,"."), 1));
        trigger_error("buildIMG: Unhandled or unknown image type ($type)", E_USER_ERROR);
    }
    public function output($resource){}
    public function create($resource){}
}

?>
