<?php
require_once 'Page.php';
class PageFactory
{
    
      public static function createPage($data = array())
      {
        return new Page($data);
      }    
    
    public static function getPages()
    {
        $conn = getConn();
        $sql = "SELECT id, name FROM pages";
        $st = prepSQL($conn, $sql);
        doPreparedQuery($st, 'Error fetching list of pages');
        $ret = array();
        return $st->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public static function getById($id)
    {
        $conn = getConn();
        $sql = "SELECT * FROM pages WHERE id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error fetching page');
        return $st->fetch(PDO::FETCH_ASSOC);
        
    }
     public static function getByName($name)
    {
        $conn = getConn();
        $sql = "SELECT * FROM pages WHERE name = :name";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":name", $name, PDO::PARAM_STR);
        doPreparedQuery($st, 'Error fetching page');
        return self::createPage($st->fetch(PDO::FETCH_ASSOC));
        
    }
    
}