<?php
//https://css-tricks.com/essential-meta-tags-social-media/
class Page
{
    // Properties
    public $id = null;
    public $title = null;
    public $content = null;
    public $description = null;
    public $meta_title = null;
    public $path = null;
    public $url = null;
    protected $reg = "/[^\.\,\-\_\'\"\@\?\!\:\$ a-zA-Z0-9()]/";

    
    protected function doBind($st){
        $st->bindValue(":name", $this->title, PDO::PARAM_STR);
        $st->bindValue(":content", $this->content, PDO::PARAM_STR);
        $st->bindValue(":description", $this->description, PDO::PARAM_STR);
        $st->bindValue(":title", $this->meta_title, PDO::PARAM_STR);
        $st->bindValue(":path", $this->path, PDO::PARAM_STR);
        $st->bindValue(":url", $this->url, PDO::PARAM_STR);
    }
    
     public function __construct($data)
    {
        if (isset($data['id']) && !empty($data['id'])) {
            //only set on update
            $this->id = (int)$data['id'];
        }
        if (isset($data['name'])) $this->title = preg_replace($this->reg, "", $data['name']);
        if (isset($data['content'])) $this->content = preg_replace($this->reg, "", $data['content']);
        if (isset($data['description'])) $this->description = preg_replace($this->reg, "", $data['description']);
        if (isset($data['metatitle'])) $this->meta_title = preg_replace($this->reg, "", $data['metatitle']);
        if (isset($data['path'])) $this->path = preg_replace($this->reg, "", $data['path']);
        if (isset($data['url'])) $this->url = preg_replace($this->reg, "", $data['url']);
    }
    
    public function insert($data = array())
    {
        // Does the Page object already have an ID?
        if (!is_null($this->id))
        {
            trigger_error("Page::insert(): Attempt to insert a Page object that already has its ID property set (to $this->id).", E_USER_ERROR);
        }
        // Insert the Article
        $conn = getConn();
        $sql = "INSERT INTO pages (name, content, description, title, image, url) VALUES ( :name,  :content,  :description, :title, :path, :url)";
        $st = prepSQL($conn, $sql);
        $this->doBind($st);
        doPreparedQuery($st, 'Error inserting page');
        $this->id = $conn->lastInsertId();
        $conn = null;
    }
    public function update()
    {
        // Does the Page object have an ID?
        if (is_null($this->id))
        {
            trigger_error("Page::update(): Attempt to update a Page object that does not have its ID property set.", E_USER_ERROR);
        }
        // Update the Page
        $conn = getConn();
        $sql = "UPDATE pages SET name = :name, content= :content, description=:description, title=:title, image = :path, url = :url WHERE name = :name";
        $st = prepSQL($conn, $sql);
        $this->doBind($st);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error updating page');
        $conn = null;
    }
    
    public function delete(){
        // Does the Page object have an ID?
        if (is_null($this->id))
        {
            trigger_error("Page::delete(): Attempt to delete an Page object that does not have its ID property set", E_USER_ERROR);
        }
        $conn = getConn();
        $sql = "DELETE FROM pages WHERE id = :id LIMIT 1";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error deleting page');
        $conn = null;
    }
    

}