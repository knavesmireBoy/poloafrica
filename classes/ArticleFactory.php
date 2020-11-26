<?php

require_once 'StandardArticle.php';
require_once 'GalleryArticle.php';

class ArticleFactory
{
    public static function createArticle($data = array(), $page = 'photos')
    {
        if($page === 'photos' || $page === 'bond'){
            return new GalleryArticle($data);
        }
        return new StandardArticle($data);
    }    
     public static function getFileName($path)
    {
        return substr(strrchr($path, "/\d+/") , 1);
    }
    
    public static function getById($id)
    {
        $conn = getConn();
        $sql = "SELECT id, title, summary, content, attr_id, page, UNIX_TIMESTAMP(pubDate) AS pubDate FROM articles WHERE id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error fetching data from article');
        $row = $st->fetch(PDO::FETCH_ASSOC);
        $conn = null;
        if ($row)
        {
            return self::createArticle($row, $row['page']);
        }
    }
    /**
     * Returns all (or a range of) Article objects in the DB
     * @param int Optional The number of rows to return (default=all)
     * @return Array|false A two-element array : results => array, a list of Article objects; totalRows => Total number of articles
     */

    public static function getList($numRows = 1000000)
    {
        $conn = getConn();
        $sql = "SELECT SQL_CALC_FOUND_ROWS *, UNIX_TIMESTAMP(pubDate) AS pubDate FROM articles ORDER BY pubDate DESC LIMIT :numRows";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":numRows", $numRows, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error fetching list from articles');
        $list = array();
        while ($row = $st->fetch(PDO::FETCH_ASSOC))
        {
            $article = self::createArticle($row, $row['page']);
            /* AJS assoc array */
            $list[$article->title] = $article;
        }
        // Now get the total number of articles that matched the criteria
        $sql = "SELECT FOUND_ROWS() AS totalRows";
        $totalRows = $conn->query($sql)->fetch();
        $conn = null;
        return (array(
            "results" => $list,
            "totalRows" => $totalRows[0]
        ));
    }

    public static function getTitles($pp, $flag)
    {
        $conn = getConn();
        $sql = "SELECT title FROM articles WHERE page = :pp ORDER BY id ASC";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":pp", $pp, PDO::PARAM_STR);
        doPreparedQuery($st, 'Error retreiving articles for this page');
        $rows = $st->fetchAll(PDO::FETCH_ASSOC);
        //('mya'=>'myarticle', 'you'=>'yourearticle)...dropDown for selecting a target position for insertion of new/updated article
         if($flag){
            return array_combine(array_map(function($str){
                //see myconfig: repeating words
            return strtolower(substr(preg_replace('/'.XDEF.'?'.XACT.'?'.XPOLOAF.'?'.XPOLO.'?'.'(\b)/i', '$5', $str['title']), 0, 3));
        }, $rows), array_map(function($str){
            return strtolower($str['title']);
        }, $rows));        
    }
        return $rows;
    }

    public static function getPages($col/*, $page = ''*/)
    {
        $conn = getConn();
        $n = ACTIVE_PAGES;
        $sql = "SELECT $col FROM pages LIMIT $n";
        /*
        if(!empty($page)){
            $sql = "SELECT $col FROM pages WHERE name = '$page'"; 
            $st = prepSQL($conn, $sql);
            doPreparedQuery($st, 'Error fetching meta content');
            return $st->fetch(PDO::FETCH_NUM)[0];
        }
        */
        $st = prepSQL($conn, $sql);
        doPreparedQuery($st, 'Error fetching list of pages');
        $ret = array();
        while ($row = $st->fetch(PDO::FETCH_NUM))
        {
            $ret[] = $row[0];
        }
        return $ret;
    }

    public static function getListByPage($pp)
    {
        $conn = getConn();
        $list = array();
        $sql = "SELECT articles.id, title, summary, content, attr_id, page, UNIX_TIMESTAMP(pubDate) AS pubDate FROM articles WHERE page = :pp ";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":pp", $pp, PDO::PARAM_STR);
        doPreparedQuery($st, 'Error retreiving articles for this page');
        while ($row = $st->fetch(PDO::FETCH_ASSOC))
        {
            $article = self::createArticle($row, $row['page']);
            $list[$article->title] = $article;
        }
        return $list;
    }    
}