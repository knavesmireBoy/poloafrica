<?php
require_once "PaginatorInterface.php";
require_once "Paginator.php";
require_once "Looper.php";

class GalleryPaginator extends Paginator implements PaginatorInterface {

    protected function setQS($v){
        $url =  "//{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
        return explode('?', setQueryString($url, 's', $v))[1];
    }
    
    /*instances of class Paginator expect a display property (the extent of items to display)
    but this property is not fixed, display in GalleryPaginator an end value
    the display is calculated from subtracting start value from end value
    eg start 15, display 28
    so display is an end value LIMIT 15, (28-15)
    */
    //signature expects an integer
    public function setStart($start){
        if(isset($_REQUEST['f'])){
            $start = $_REQUEST['f'];
            $this->display = $this->looper->getNext($start);
            $this->start = $start >= $this->display ? 0 : $start;
        }
        elseif(isset($_REQUEST['b'])){
            $this->display = $_REQUEST['b'];
            $this->start = $this->looper->getPrevious($_REQUEST['b']);
            if($this->start > $this->display){
                $this->display = $this->start;
                $this->start = $this->looper->getPrevious($this->start);
            }
        }
        else {
            $this->start = 0;
            $this->display = $this->looper->getNext($start);
        }
    }
    
    public function setProps($data){}

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