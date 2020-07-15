<?php
require_once "PaginatorInterface.php";
require_once "Paginator.php";

class PhotoPaginator extends Paginator implements PaginatorInterface {

    protected function setQS($v){
        $url =  "//{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
        return explode('?', setQueryString($url, 's', $v))[1];
    }

    public function setProps($data){
        if (isset($data['id'])) {
            $this->id = (int)$data['id'];
        }
        if (isset($data['src'])) {
            $this->src = (int)$data['src'];
        }
        if (isset($data['alt'])) {
            $this->title = preg_replace($this->reg, "", $data['alt']);
        }
        
        if (isset($data['dom_id'])) {
            $this->fname = preg_replace($this->reg, "", $data['dom_id']);
        }
    }

    public function getList($pp = true){}
    public function doNav(){
        if($this->records <= $this->display){
            return;
        }
         echo '<nav class="pp">';
        if($this->getCurrentPage() != 1){
           echo '<a href=".?' . $this->setQS($this->start - $this->display) . '">Previous</a>';
        }
        
        for($i = 1; $i <= $this->pages; $i++){
            if($i != $this->getCurrentPage()){
            echo '<a href=".?' .  $this->setQS(($this->display * ($i - 1))) . '">' . $i . '</a>';
        }
            else {
                echo '<span>' . $i . '</span>';
            }
        }
        if($this->getCurrentPage() != $this->pages){
            echo '<a href=".?' . $this->setQS($this->start + $this->display) . '">Next</a>';
        }
        echo '</nav>';
    }
    
}