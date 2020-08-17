<?php
require_once '../myconfig.php';
include_once MAGIC;
include DB;
include_once HELPERS;
require_once ACCESS;

$results['errorMessage'] = '';

function findArticle($id){
    return ArticleFactory::getById((int)$id);
}

$action = isset($_GET['action']) ? $_GET['action'] : "";
$display = 10;
$page = null;
$default_placement = "current position";
$results['page_title'] = 'Admin';
$results['heading'] = 'Article List';
$results['nav'] = '<a href="../user/" title="Manage Users" class="icon"><img src="../images/resource/icon_user_edit.png"></a><a href="../page/" title="Edit Page Tags" class="icon"><img src="../images/resource/icon_page_edit.png"></a>';
$results['exclude'] = null;

include "../templates/header.php";
?>
<body class="admin"><main><section>
<?php
$insert_action_plus = "";
//$insert_placeholder = "";
if (isset($_GET['loginError']))
{
    $loginError = $_GET['loginError'];
    $results['heading'] = 'Log In';
    include '../templates/login.html.php';
    header("Location: ?error=$loginError");
    exit();
}

if (!userIsLoggedIn())
{
    $results['heading'] = 'Log In';
    include_once '../templates/admin_header.html.php';
    include '../templates/login.html.php';
    exit();
}

if (!userHasRole('Content Editor'))
{
    $results['errorMessage'] = "Only Content Editor's may access this page!";
    include_once '../templates/admin_header.html.php';
    include (TEMPLATE_PATH . "issue.html.php");
    exit();
}

    
if (isset($_GET['action']) && $_GET['action'] == 'removeArticle')
{
    $remove = 'Are you sure you want to remove the article: ';
    //echo $_COOKIE['articleId'];
    $article = ArticleFactory::getById((int)$_GET['articleId']);
    if(isset($_SESSION["paginator"]->page)){
        //reset page count
        $count = PagePaginator::getPageCount($_SESSION["paginator"]->page);
        $_SESSION["paginator"] = new PagePaginator(10, $count);
    }
}
    
if (isset($_POST['action']) && $_POST['action'] == 'Delete Article')
{
    if (!$article = ArticleFactory::getById((int)$_POST['articleId']))
    {
        redirect(array(array('error', 'articleNotFound')));
    }
    else {
        //setcookie('articleId', $article->id);
    redirect(array(array('action', 'removeArticle'), array('articleId', $article->id)));
    exit();
    }
}

if (isset($_POST['action']) && $_POST['action'] == 'Confirm')
{
    $results['article'] = ArticleFactory::getById((int)$_POST['articleId']);
    $results['article']->delete();
    $page = isset($_GET['page']) ? $_GET['page'] : '';
    $outer = array();    
    $outer[] = array('status', 'articleDeleted');
    $outer[] = array('page', false);//set page so we don't get an undefined index, but set to falsy
    $_SESSION["paginator"]->setStart(0);
    //simulate selecting.. 
    if(!in_array($page, ArticleFactory::getPages('name'))){
       $outer[] = array('action', 'choose');
        }
        redirect($outer);
}

if (isset($_GET['action']) && ($_GET['action'] == 'editArticle' || $_GET['action'] == 'removeArticle'))
{
    $results = array();
    $results['pageTitle'] = "Edit Article";
    $results['formAction'] = "editArticle";
    $results['heading'] = 'Edit Article';
    include_once '../templates/admin_header.html.php';

    if (isset($_POST['saveChanges']))
    {
        // User has posted the article edit form: save the article changes
        if (!$article = ArticleFactory::getById((int)$_POST['articleId']))
        {
           redirect(array(array('error', 'articleNotFound')));
        }

        $article->storeFormValues($_POST);

        if (isset($_POST['deleteAsset']))
        {
            foreach ($_POST['deleteAsset'] as $id)
            {
                $article->deleteAssets($id);
            }
        }
        $article->update($_POST['insert']);
        /* this will always be true due to enctype="multipart/form-data" */
        if (isset($_FILES['asset']))
        {
            /* if the file wasn't an upload (UPLOAD_ERR_OK != 0) Asset will only update the attributes */
            $article->storeUploadedFile($_FILES['asset'], $_POST);
            $page = isset($_GET['page']) ? $_GET['page'] : '';
            redirect(array(array('status', 'changesSaved'), array('page', $page)));
        }
    }
    elseif (isset($_POST['cancel']))
    {
        //User has cancelled their edits: return to the article list
        //preserve page selection when exiting form
        $page = isset($_GET['page']) ? $_GET['page'] : $_POST['page'];
        redirect(array(array('page', $page)));
        exit();
    }
    else
    {
        // User has not posted the article edit form yet: display the form
        $results['article'] = ArticleFactory::getById((int)$_GET['articleId']);
        require "editArticle.html.php";
    }
    exit();
}//edit article

//newArticle present in queryString
if (isset($_GET['action']) && $_GET['action'] == 'newArticle')
{
    $results = array();
    $results['pageTitle'] = "New Article";
    $results['formAction'] = "newArticle";
    $results['heading'] = 'Add Article';

    $default_placement = "select position";
    
    include_once '../templates/admin_header.html.php';

    //form action
    if (isset($_POST['saveChanges']))
    {
        // User has posted the article edit form: save the new article
        $article = ArticleFactory::createArticle(array(), $_GET['page']);
        $article->storeFormValues($_POST);
        $article->insert();
        $article->placeArticle($_POST['insert']);

        if (isset($_FILES['asset']))
        {
            $article->storeUploadedFile($_FILES['asset'], $_POST);
            $page = isset($_GET['page']) ? $_GET['page'] : '';
            redirect(array(array('status', 'changesSaved'), array('page', $page)));
            //header("Location: ?status=changesSaved");
            exit();
        }
        //header("connection: close");
        $page = isset($_GET['page']) ? $_GET['page'] : '';
        redirect(array(array('status', 'changesSaved'), array('page', $page)));
        //header("Location: ?status=changesSaved");
    }
    elseif (isset($_POST['cancel']))
    {
        // User has cancelled their edits: return to the article list
        $page = isset($_GET['page']) ? $_GET['page'] : '';
        redirect(array(array('page', $page)));
        exit();
    }
    else
    {
        // User has not posted the article edit form yet: display the form
        $results['article'] = ArticleFactory::createArticle(array(), null);
        require "editArticle.html.php";
    }
    exit();
}//new article

$results = array();
$data = ArticleFactory::getList();
$count = null;
    
$results['articles'] = $data['results'];
$results['totalRows'] = $data['totalRows'];
$results['pageTitle'] = "All Articles";  
$count = $data['totalRows'];

if (!isset($_SESSION["paginator"]))
{
    $_SESSION["paginator"] = new PagePaginator(10, $data['totalRows']);
}
else
{
    if(isset($_SESSION["paginator"]->page)){
        //echo 'existingpp : ';
        $count = $_SESSION["paginator"]->getRecords();
        $page = $_SESSION["paginator"]->page;
        
    }
    //override if new page. NOTE form.page_select method is GET
    if(!empty($_GET['page'])){
        //echo 'newpp : ';
        $count = PagePaginator::getPageCount($_GET['page']);
        $_SESSION["paginator"] = new PagePaginator(10, $count);
        $page = $_GET['page'];
        $_SESSION["paginator"]->setPage($page);
        //echo $_SERVER['REQUEST_URI']$_SERVER['QUERY_STRING'];
    }
    //or clearing page selection
    if(isset($_GET['action']) && $_GET['action'] == 'selectedpage' && !$_GET['page']){
        $count = $data['totalRows'];
        $page = null;
        $_SESSION["paginator"] = new PagePaginator(10, $count);
    }
}
    
if (isset($_GET['s']) and is_numeric($_GET['s']))
{
    $_SESSION["paginator"]->setStart($_GET['s']);
}
$paginator = $_SESSION["paginator"]; 
    //has to follow setStart
$articles = $paginator->getList($page);
      
$results['errorMessage'] = isset($_GET['error']) ? getMsg($_GET['error']) : null;
$results['statusMessage'] = isset($_GET['status']) ? getMsg($_GET['status']) : null;
$results['heading'] = 'Article List';
    
    if (!userHasRole('Account Administrator')) {
        $results['exclude'] = true;
    }
    
include_once '../templates/admin_header.html.php';
require "listArticles.html.php";
echo '</section></main>';
?>
    <script src="../js/viewportSize.js"></script>
    <script src="../js/shims.js"></script>
    <script src="../js/underscore.js"></script>
    <script src="../js/eventing.js"></script>
    <script src="../js/classlist.js"></script>
    <script src="../js/global.js"></script>

<script>
    
    function prepareNavLinks(){
        var hijax = window.poloAF.Hijax();
        hijax.setContainer(document.querySelector('section'));
        hijax.setCanvas(document.querySelector('section'));
        hijax.setUrl('.');
        hijax.captureData();
        
         hijax.validate = function(tgt){
           if(poloAF.Util.getClassList(tgt.parentNode).contains("pp")){
                return true;
            }
            return false;
        };
    }
    
    function prepareDropDown(){
        var hijax = window.poloAF.Hijax();
        hijax.setCanvas(document.querySelector('main'));
        hijax.setContainer(document.querySelector('main'));
        //hijax.setContainer(document.forms[0]);
        //hijax.setCanvas(document.getElementById('pagelist'));
        hijax.setUrl('.');
        hijax.setCallback(function(){
            //console.log(document.querySelector('.statusMessage'));
        });
        
        hijax.validate = function(tgt){
           if(poloAF.Util.hasClass("page_select", tgt)){
                return true;
            }
            return false;
        };
        
        hijax.captureData();
    }
    prepareNavLinks();
    //prepareDropDown();
    
    </script>
    <?php echo '</body>';