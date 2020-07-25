<?php
require_once 'Article.php';
require_once 'AssetFactory.php';

class StandardArticle extends Article implements ArticleInterface
{
    
     protected $queryExt = "SELECT assets.id, extension AS ext FROM article_asset AS AA INNER JOIN articles ON articles.id = AA.article_id INNER JOIN assets ON AA.asset_id = assets.id WHERE articles.id = :id";
    
         protected function createAsset($ext, $attrs = array())
    {        
             if(empty($ext) && isset($attrs['id'])){
            $conn = getConn();
            $sql = "SELECT extension FROM assets WHERE id = {$attrs['id']}";
            $ext = $conn->query($sql)->fetch(PDO::FETCH_NUM)[0];
            $conn = null;
        }
        
        return AssetFactory::createAsset($this->id, $this->page, $ext, $attrs);
    }
    
    protected function move($id)
    {
        $conn = getConn();
        $max = $conn->query("SELECT MAX(id) FROM articles")
            ->fetch() [0] + 1;
        $sql = "UPDATE articles SET id = :max WHERE id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        $st->bindValue(":max", $max, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error updating article');
        $conn = null;
        return $max;
    }

    protected function shuffleArticles($title)
    {
        $conn = getConn();
        $max = $this->move($this->id);
        $min = $this->getIdFromTitle($title);
        $sql = "SELECT id FROM articles WHERE page = :page";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":page", $this->page, PDO::PARAM_STR);
        doPreparedQuery($st, 'Error updating article innit');

        while ($row = $st->fetch(PDO::FETCH_NUM))
        {
            if ($row[0] >= $min && $row[0] < $max)
            {
                $this->move($row[0]);
            }
        }
    }

    protected function removeAssets($id = null)
    {
        
        if ($id)
        {
            $this->doRemoveAsset($id);
        }
        else
        {
        $conn = getConn();
        $sql = "SELECT id FROM assets INNER JOIN article_asset AS AA ON assets.id = AA.asset_id WHERE AA.article_id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error fetching asset list');
            while ($row = $st->fetch(PDO::FETCH_NUM))
            {
                $this->doRemoveAsset($row[0]);
            }
        }
        $conn = null;
    }

    public function delete($flag)
    {
        // Does the Article object have an ID?
        if (is_null($this->id))
        {
            trigger_error("Article::delete(): Attempt to delete an Article object that does not have its ID property set", E_USER_ERROR);
        }
        if (!$flag)
        {
            $this->removeAssets();
        }

        $conn = getConn();
        /* IF NOT USING FOREIGN KEY ON article_asset */
        //$sql = "DELETE repo, AA FROM assets INNER JOIN article_asset AS AA ON AA.asset_id = assets.id INNER JOIN articles ON articles.id = AA.article_id WHERE articles.id = :id AND assets.id = :repo";
        $sql = "DELETE assets FROM assets INNER JOIN article_asset AS AA ON assets.id = AA.asset_id INNER JOIN articles ON articles.id = AA.article_id WHERE articles.id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error deleting asset');
        $sql = "DELETE FROM articles WHERE id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error deleting article');
        $conn = null;
    }
  
    public function deleteAssets($id)
    {
        //exit($id . ':92');
        $this->removeAssets($id);
        $conn = getConn();
        //$sql = "DELETE repo, AA FROM assets INNER JOIN article_asset AS AA ON AA.asset_id = assets.id INNER JOIN articles ON articles.id = AA.article_id WHERE articles.id = :id AND assets.id = :id";
        /*USING FOREIGN KEY ON article_asset SO THIS QUERY WILL DELETE FROM BOTH TABLES HOWEVER THE ABOVE IS A GOOD EXAMPLE OF THE USE OF ALIAS*/
        $sql = "DELETE FROM assets WHERE assets.id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error deleting asset from tables');
    }
    
    public function placeArticle($title)
    {
        if ($title && strlen($title) < 3)
        {
            $this->move($this->id);//append <option value=".">default</option>
        }
        elseif ($title)
        {
            $this->shuffleArticles($title);//insert eg <option value="uit">uitgedacht</option>
        }
    }
}