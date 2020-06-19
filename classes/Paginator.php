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
    static public function getPageCount($pp = true){
        $conn = getConn();
        $where = is_string($pp) ? "WHERE page = '$pp' " : "WHERE true ";
        $sql = "SELECT COUNT(id) FROM articles ";
        $sql .= $where;
        return $conn->query($sql)->fetch()[0];
    }
    
    protected function getCurrentPage(){
        return ($this->start/$this->display) + 1;
    }    
        
    function __construct($display, $records, $looper = null){
        $this->display = $display;
        $this->records = $records;
        $this->looper = $looper;
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
    
    public function setDisplay($d){
        $this->display = $d;
    }
    public function getDisplay(){
        return $this->display;
    }
    
    public function getRecords(){
        return $this->records;
    }
    
    public function getStart(){
        return $this->start;
    }    
    
    public function setStart($start){
        $this->determine('start', $start);
        if(!isset($this->start)){
            $this->start = 0;
        }
    } 
    
    public function setPage($page){
        $this->page = $page;
    } 
    public function getPage(){
        return $this->page;
    } 

    abstract public function doNav();
}