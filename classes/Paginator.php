<?php
class Paginator {
    
    protected $display = null;
    public $pages = null;
    protected $start = null;
    protected $reg = "/[^\.\,\-\_\'\"\@\?\!\:\$ a-zA-Z0-9()]/";
    function __construct($display, $records){
        $this->display = $display;
        $this->records = $records;
        $this->setPages(0)->setStart(0);
    }
    
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
    
    protected function setProps($data){
        if (isset($data['id'])) {
            $this->id = (int)$data['id'];
        }
        if (isset($data['pubDate'])) {
            $this->pubDate = (int)$data['pubDate'];
        }
        if (isset($data['title'])) {
            $this->title = preg_replace($this->reg, "", $data['title']);
        }
    }
    
    public function getList($pp = true){
        //$this->setStart($i);
        $conn = getConn();
        $where = is_string($pp) ? "WHERE page = :pp " : "WHERE true ";
        $sql = "SELECT UNIX_TIMESTAMP(pubDate) AS pubDate, id, title FROM articles ";
        $sql .= $where;
        $sql .= " ORDER BY pubDate ASC ";
        $sql .= "LIMIT $this->start, $this->display";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":pp", $pp, PDO::PARAM_STR);
        doPreparedQuery($st, "Error obtaining results from of articles");
        $data = $st->fetchAll(PDO::FETCH_ASSOC);
        $this->setProps($data);
        if(is_string($pp)){
            $this->setRecords(count($data));
        }
        return $data;
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