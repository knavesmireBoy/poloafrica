<?php
require_once 'Article.php';
require_once 'AssetFactory.php';

class GalleryArticle extends Article implements ArticleInterface
{
    
    protected function removeAssets($id = null)
    {
        $conn = getConn();
        //temp limit to 1
        $sql = "SELECT id FROM gallery WHERE gallery.article_id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error fetching gallery list');
        if ($id)
        {
            $asset = AssetFactory::createAsset($this->id, $this->page);
            $asset->delete($id);
        }
        else
        {
            while ($row = $st->fetch(PDO::FETCH_NUM))
            {
                $asset = AssetFactory::createAsset($this->id, $this->page);
                $asset->delete($row[0]);
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
    public function getFilePath1($flag = false)
    {
        $conn = getConn();
        $sql = "SELECT gallery.id, extension AS ext, alt, gallery.attr_id AS dom_id, name, alt AS edit_alt FROM gallery WHERE gallery.article_id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retrieving filepath');
        $uber = [];
        $pathtype = $flag ? '/' . IMG_TYPE_THUMB . '/' : '/' . IMG_TYPE_FULLSIZE . '/';
        while ($row = $st->fetch(PDO::FETCH_ASSOC))
        {
            $row['src'] = ARTICLE_GALLERY_PATH . $pathtype . $row['dom_id'] . $row['ext'];
            $uber[] = $row;
        }
        return $uber;
    }
    
    public function getFilePath($flag = false){
        $asset = AssetFactory::createAsset($this->id, $this->page);
        return $asset->getAttributes($flag);
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
    
    public function placeArticle($title){}
}