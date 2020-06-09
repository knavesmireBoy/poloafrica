<?php
require_once "PaginatorInterface.php";
require_once "Paginator.php";

class PhotoPaginator extends Paginator implements PaginatorInterface {

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
            $this->setRecords(count($data));
        }
        return $data;
    }
}