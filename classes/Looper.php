<?php
class Looper {
    
    protected $collection = array();
    
    public function __construct($c){
        $this->collection = $c;
    }
    
    public function getPrevious($cur) {
        $c = $this->collection;
        $i = array_search($cur, $c);
        $j = $i-1;
    if(!isset($c[$j])){
        return $c[count($c)-1];
    }
        return $c[$j];
    }
    
    public function getNext($cur){
        $c = $this->collection;
        $i = array_search($cur, $c);
        $j = $i+1;
        if(!isset($c[$j])){
            return $this->getNext(0);
        }
        return $c[$j];
    }
}
