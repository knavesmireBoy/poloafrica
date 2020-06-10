<?php
function makeLooper($displays){
    
function getPrev($cur) use ($displays) {
        $d = $displays;
        $i = array_search($cur, $d);
        $j = $i-1;
    if(!isset($d[$j])){
        return $d[count($d)-1];
    }
        return $d[$j];
    }
    
function getNext($cur) use ($displays){
        $d = $this->displays;
        $i = array_search($cur, $d);
        $j = $i+1;
    if(!isset($d[$j])){
        return getNext(0);
    }
        return $d[$j];
    }
    
    return array('f'=> 'getNext', 'b'=>'gePrev');
}
