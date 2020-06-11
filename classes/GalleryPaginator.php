<?php
require_once "PaginatorInterface.php";
require_once "Paginator.php";

class GalleryPaginator extends Paginator implements PaginatorInterface {

    protected function setQS($v){
        $url =  "//{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
        return explode('?', setQueryString($url, 's', $v))[1];
    }
    public function setStart($start){
        if(isset($_REQUEST['f'])){
            echo 'uuu';
            $start = $_REQUEST['f'];
            $this->display = $this->looper['f']($start);
            $this->start = $start >= $this->display ? 0 : $start;
        }
        elseif(isset($_REQUEST['b'])){
            $this->display = $_REQUEST['b'];
            $this->start = $this->looper['b']($_REQUEST['b']);
            if($this->start > $this->display){
                $this->display = $this->start;
                $this->start = $this->looper['b']($this->start);
            }
        }
        else {
            $this->start = 0;
            $this->display = ($this->looper['f'](0));
        }
    }
    
    public function setProps($data){
        if (isset($data['id'])) {
            $this->id = (int)$data['id'];
        }
        if (isset($data['src'])) {
            $this->src = (int)$data['src'];
        }
        if (isset($data['alt'])) {
            $this->title = preg_replace($this->reg, "", $data['alt']);
        }
        
        if (isset($data['dom_id'])) {
            $this->fname = preg_replace($this->reg, "", $data['dom_id']);
        }
    }

     public function getList($pp = true){
         $conn = getConn();
         $limit = $this->display - $this->start;
        $sql = "SELECT attr_id AS src, extension AS ext, alt FROM gallery ";
        $sql .= "LIMIT $this->start, $limit";
        $st = prepSQL($conn, $sql);
        doPreparedQuery($st, "Error list of images");
        $data = $st->fetchAll(PDO::FETCH_ASSOC);
        $this->setRecords(count($data));
         $start = $this->start;
         return (array(
             "list" => $data,
             "path" => '../images/gallery/fullsize/',
             "start" => $this->start,
             "limit" => $this->display
       ));
    }
    public function doNav(){
        $images = $this->getList();
 ?>
<a id="gal_back" href=".?b=<?php echo $this->start; ?>" class="pagenav"><span></span></a>
<ul class="gallery">
<?php
foreach($images as $image): 
    $src = $path . $image['src'] . $image['ext']; ?>
    <li>
        <a href="<?php htmlout($src); ?>">
        <img src="<?php htmlout($src); ?>" alt="<?php htmlout($image['alt']); ?>"></a>
    </li>
<?php endforeach; ?>
</ul>
<a id="gal_forward" href=".?f=<?php echo $this->display; ?>" class="pagenav"><span></span></a>
<?php
}
}