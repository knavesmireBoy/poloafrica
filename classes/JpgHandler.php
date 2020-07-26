<?php
include_once 'ResourceHandler.php';
class JpgHandler extends ResourceHandler {
    public $resource = null;
    protected $quality = null;
    protected $filepath = null;
    protected $successor;
    
    public function create($resource){
        imagejpeg($resource, $this->filepath, $this->quality);
    }
    
    public function setSuccessor($next)
    {
        $this->successor=$next;
    }

    public function handleRequest ($src, $filepath, $quality = null)
    {
        $type = strtolower(substr(strrchr($src,"."), 1));
        if ($type == "jpg" || $type == "jpeg") {
            $this->resource = imagecreatefromjpeg($src);
            $this->quality = $quality;
            $this->filepath = $filepath;
        }
        else if ($this->successor != null)
        {
                $this->successor->handleRequest ($src, $filepath, $quality);
        }
    }
    
}

?>
