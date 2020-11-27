<?php
	abstract class ResourceHandler
	{
		abstract public function handleRequest($src, $filepath, $quality = null); 
		abstract public function setSuccessor($next);	
        public function getResource(){
        if(isset($this->resource)){
            return $this->resource;
        }
        else if ($this->successor != null){
            return $this->successor->getResource();
        }
    }
        public function output($resource){
            if(isset($this->resource)){
            return $this->create($resource);
        }
            else if ($this->successor != null){
            return $this->successor->output($resource);
        }
    }
	}
