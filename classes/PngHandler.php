<?php
include_once 'ResourceHandler.php';
class PngHandler extends ResourceHandler {
    public $resource = null;
    protected $quality = null;
    protected $filepath = null;
    protected $successor;
    
    public function create($resource){
        imagepng($resource, $this->filepath, $this->quality);
    }
    
    public function setSuccessor($next)
    {
        $this->successor=$next;
    }

    public function handleRequest ($src, $filepath, $quality = null)
    {
        $type = strtolower(substr(strrchr($src,"."), 1));
        if ($type == "png") {
            $this->resource = imagecreatefrompng($src);
            $this->quality = null;
            $this->filepath = $filepath;
            
        }
        else if ($this->successor != null)
        {
            $this->successor->handleRequest ($src, $filepath, $quality);
        }
    }
    
}

?>
