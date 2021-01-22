<?php
require_once 'Article.php';
require_once 'AssetFactory.php';

class GalleryArticle extends Article implements ArticleInterface
{

    protected $queryExt = "SELECT gallery.id, extension AS ext FROM gallery INNER JOIN articles ON gallery.article_id = articles.id WHERE articles.id = :id";
    
    protected function createAsset($ext, $attrs = array())
    {
        if (empty($ext) && isset($attrs['id']))
        {
            $conn = getConn();
            $sql = "SELECT extension FROM gallery WHERE id = {$attrs['id']}";
            $ext = $conn->query($sql)->fetch(PDO::FETCH_NUM)[0];
            $conn = null;
        }
        return AssetFactory::createAsset($this->id, $this->page, $ext, $attrs);
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
            $sql = "SELECT id FROM gallery WHERE article_id = :id";
            $st = prepSQL($conn, $sql);
            $st->bindValue(":id", $this->id, PDO::PARAM_INT);
            doPreparedQuery($st, 'Error fetching gallery list');            
            while ($row = $st->fetch(PDO::FETCH_NUM))
            {
                $this->doRemoveAsset($row[0]);
            }
        }
        $conn = null;
    }

    public function delete($flag = false)
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
        $sql = "DELETE gallery FROM gallery INNER JOIN articles ON gallery.article_id = articles.id WHERE articles.id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error deleting gallery');
        $sql = "DELETE FROM articles WHERE id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error deleting article');
        $conn = null;
    }

    public function deleteAssets($id)
    {
        $this->removeAssets($id);
        $conn = getConn();
        $sql = "DELETE FROM gallery WHERE gallery.id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error deleting gallery from tables');
    }

    public function placeArticle($title)
    {
    }
}