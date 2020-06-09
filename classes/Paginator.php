<?php
require_once "PaginatorInterface.php";

abstract class Paginator implements PaginatorInterface {
    
    protected $display = null;
    protected $property = null;
    protected $start = null;
    public $page = null;
    protected $reg = "/[^\.\,\-\_\'\"\@\?\!\:\$ a-zA-Z0-9()]/";
    public $pages = null;

  protected function determine($property, $prop){
          if(isset($prop) && is_numeric($prop)){
            $this->$property = $prop;
              return true;
        }
        else {
            return false;
        }
    }
    
    protected function getCurrentPage(){
        return ($this->start/$this->display) + 1;
    }    
        
    function __construct($display, $records){
        $this->display = $display;
        $this->records = $records;
        $this->setPages(0)->setStart(0);
    }
    
     public function setPages($pp){
        $this->determine('pages', $pp);
            if($this->records > $this->display){
                $this->pages = ceil($this->records/$this->display);
            }
        else {
            $this->pages = 1;
        }
        return $this;
    }
    
    public function setRecords($r){
        $this->records = $r;
        $this->setPages(1);
    }
    
    public function getRecords(){
        return $this->records;
    }    
    
    public function setStart($start){
        $this->determine('start', $start);
        if(!isset($this->start)){
            $this->start = 0;
        }
    }    
    
    public function doNav(){
        if($this->records <= $this->display){
            return;
        }
         echo '<nav id="pp">';
        if($this->getCurrentPage() != 1){
           echo '<a href=".?s=' . ($this->start - $this->display) . '">Previous</a>';
        }
        
        for($i = 1; $i <= $this->pages; $i++){
            if($i != $this->getCurrentPage()){
            echo '<a href=".?s=' . (($this->display * ($i - 1))) . '">' . $i . '</a>';
        }
            else {
                echo '<span>' . $i . '</span>';
            }
        }
        if($this->getCurrentPage() != $this->pages){
            echo '<a href=".?s=' . ($this->start + $this->display) . '">Next</a>';
        }
        echo '</nav>';
    }
}