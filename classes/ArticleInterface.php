<?php interface ArticleInterface {
    public function deleteAssets($id);
    public function storeUploadedFile($uploaded, $attrs = array());
    public function getFilePath($flag = false);
    public function delete($flag);
    public function update($title);
    public function insert($data = array());
    public function placeArticle($title);
    public function storeFormValues($params);
}