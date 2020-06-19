<?php
require_once "PaginatorInterface.php";
require_once "Paginator.php";

class PagePaginator extends Paginator implements PaginatorInterface {

    public function setProps($data){
        if (isset($data['id'])) {
            $this->id = (int)$data['id'];
        }
        if (isset($data['pubDate'])) {
            $this->pubDate = (int)$data['pubDate'];
        }
        if (isset($data['title'])) {
            $this->title = preg_replace($this->reg, "", $data['title']);
        }
        if (isset($data['page'])) {
            $this->title = preg_replace($this->reg, "", $data['page']);
        }
    }

    public function getList($pp = true){
        $conn = getConn();
        $where = is_string($pp) ? "WHERE page = :pp " : "WHERE true ";
        $sql = "SELECT UNIX_TIMESTAMP(pubDate) AS pubDate, id, title FROM articles ";
        $sql .= $where;
        $sql .= " ORDER BY title ASC ";
        $sql .= "LIMIT $this->start, $this->display";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":pp", $pp, PDO::PARAM_STR);
        doPreparedQuery($st, "Error obtaining results from of articles");
        $data = $st->fetchAll(PDO::FETCH_ASSOC);
        $this->setProps($data);
        if(is_string($pp)){
            $this->page = $pp;
        }
        return $data;
    }
        
    public function doNav(){
        if($this->records <= $this->display){
            return;
        }
         echo '<nav id="pp">';
        if($this->getCurrentPage() != 1){
           echo '<a href=".?s=' . ($this->start - $this->display) . '&pp=' . $this->pages .'">Previous</a>';
        }
        
        for($i = 1; $i <= $this->pages; $i++){
            if($i != $this->getCurrentPage()){
            echo '<a href=".?s=' . (($this->display * ($i - 1))) . '&pp=' . $this->pages .'">' . $i . '</a>';
        }
            else {
                echo '<span>' . $i . '</span>';
            }
        }
        if($this->getCurrentPage() != $this->pages){
            echo '<a href=".?s=' . ($this->start + $this->display) . '&pp=' . $this->pages .'">Next</a>';
        }
        echo '</nav>';
    }
}