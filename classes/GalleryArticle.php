<?php
require_once 'Article.php';
require_once 'AssetFactory.php';

class GalleryArticle extends Article implements ArticleInterface
{

    protected function removeAssets($id = null)
    {
        $conn = getConn();
        $foreign = $this->getForeignTable();
        $linker = $this->getLinkTable();
        //temp limit to 1
        $sql = "SELECT id FROM gallery WHERE gallery.article_id = :id LIMIT 1";
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
        $foreign = $this->getForeignTable();
        $linker = $this->getLinkTable();
        $conn = getConn();
        $sql = "DELETE FROM gallery WHERE articles.id = :id LIMIT 1";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error deleting gallery');
        $sql = "DELETE FROM articles WHERE id = :id LIMIT 1";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error deleting article');
        $conn = null;
    }
    public function getFilePath($flag = false)
    {
        $conn = getConn();
        $foreign = $this->getForeignTable();
        $linker = $this->getLinkTable();
        $sql = "SELECT gallery.id, gallery.extension, gallery.alt, gallery.attr_id, gallery.name FROM gallery WHERE gallery.article_id = :id";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $this->id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error retrieving filepath');
        $paths = [];
        $uber = [];
        $pathtype = $flag ? '/' . IMG_TYPE_THUMB . '/' : '/' . IMG_TYPE_FULLSIZE . '/';
        while ($row = $st->fetch(PDO::FETCH_NUM))
        {
            $paths = [];
            $paths['id'] = $row[0];
            $paths['alt'] = $row[2];
            $paths['edit_alt'] = $row[2];
            $paths['dom_id'] = $row[3];
            $paths['src'] = $this->getRepo() . $pathtype . $row[3] . $row[1];
            $uber[] = $paths;
        }
        return $uber;
    }
    public function deleteAssets($id)
    {
        $this->removeAssets($id);
        $foreign = $this->getForeignTable();
        $linker = $this->getLinkTable();
        $conn = getConn();
        $sql = "DELETE FROM gallery WHERE gallery.id = :id LIMIT 1";
        $st = prepSQL($conn, $sql);
        $st->bindValue(":id", $id, PDO::PARAM_INT);
        doPreparedQuery($st, 'Error deleting gallery from tables');
    }
}