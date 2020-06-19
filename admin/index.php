<?php
//session_start();
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Article.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Asset.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/PagePaginator.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/PhotoPaginator.php';

require_once '../../../innocent/poloafricaDB.txt';
require_once '../includes/db.inc.php';
require_once '../includes/access.inc.php';
require_once '../myconfig.php';

$results['errorMessage'] = '';

function findArticle($id){
    return Article::getById((int)$id);
}

function getMsg($str){
    $lookup = array('articleNotFound' => 'Article not found', 'changesSaved' => "Your changes have been saved.", 'articleDeleted' => "Article deleted.");
    return isset($lookup[$str]) ?  $lookup[$str] : $str;
}

function redirect($arr){
    $str = '?';
    for($i=0; $i < count($arr); $i++){
        if($i !== 0){
           $str .= '&'; 
        }
        $str .= implode('=', $arr[$i]);
    }
    header("Location: $str");
}

$action = isset($_GET['action']) ? $_GET['action'] : "";
$display = 10;
$default_placement = "current position";
$results['page_title'] = 'Admin';
$results['heading'] = 'Article List';
include "../templates/header.php"; ?>
<body class="admin"><main><section>
<?php
$insert_action_plus = "";
//$insert_placeholder = "";

if (isset($_GET['loginError']))
{
    $loginError = $_GET['loginError'];
    include 'admin.html.php';
    include '../templates/login.html.php';
    header("Location: ?error=$loginError");
    exit();
}
    
if (!userIsLoggedIn())
{
    include '../templates/login.html.php';
    exit();
}
    
if (!userHasRole('Content Editor'))
{
    $results['errorMessage'] = "Only Content Editor's may access this page.";
    include 'admin.html.php';
    exit();
}
    
if (isset($_GET['action']) && $_GET['action'] == 'removeArticle')
{
    $remove = 'Are you sure you want to remove the article: ';
    $article = Article::getById((int)$_GET['articleId']);
}
    
if (isset($_POST['action']) && $_POST['action'] == 'Delete Article')
{
    if (!$article = Article::getById((int)$_POST['articleId']))
    {
        redirect(array(array('error', 'articleNotFound')));
    }
    else {
    redirect(array(array('action', 'removeArticle'), array('articleId', $article->id)));
    exit();
    }
}

if (isset($_POST['action']) && $_POST['action'] == 'Confirm')
{
    $results['article'] = Article::getById((int)$_POST['articleId']);
    $results['article']->delete();
    redirect(array(array('status', 'articleDeleted')));
    exit();
}

if (isset($_REQUEST['action']) && ($_REQUEST['action'] == 'editArticle' || $_REQUEST['action'] == 'removeArticle'))
{
    $results = array();
    $results['pageTitle'] = "Edit Article";
    $results['formAction'] = "editArticle";

    if (isset($_POST['saveChanges']))
    {
        // User has posted the article edit form: save the article changes
        if (!$article = Article::getById((int)$_POST['articleId']))
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
            $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : '';
            redirect(array(array('status', 'changesSaved'), array('page', $page)));
        }
    }
    elseif (isset($_POST['cancel']))
    {
        // User has cancelled their edits: return to the article list
        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : '';
        redirect(array(array('page', $page)));
        exit();
    }
    else
    {
        // User has not posted the article edit form yet: display the form
        $results['article'] = Article::getById((int)$_REQUEST['articleId']);
        require ("editArticle.html.php");
    }
    exit();
}//edit article

//newArticle present in queryString
if (isset($_GET['action']) && $_GET['action'] == 'newArticle')
{
    $results = array();
    $results['pageTitle'] = "New Article";
    $results['formAction'] = "newArticle";
    $default_placement = "select position";

    //form action
    if (isset($_POST['saveChanges']))
    {
        // User has posted the article edit form: save the new article
        $article = new Article();
        $article->storeFormValues($_POST);
        $article->insert();
        $article->placeArticle($_POST['insert']);

        if (isset($_FILES['asset']))
        {
            $article->storeUploadedFile($_FILES['asset'], $_POST);
            $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : '';
            redirect(array(array('status', 'changesSaved'), array('page', $page)));
            //header("Location: ?status=changesSaved");
            exit();
        }
        //header("connection: close");
        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : '';
            redirect(array(array('status', 'changesSaved'), array('page', $page)));
        //header("Location: ?status=changesSaved");
    }
    elseif (isset($_POST['cancel']))
    {
        // User has cancelled their edits: return to the article list
        $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : '';
        redirect(array(array('page', $page)));
        exit();
    }
    else
    {
        // User has not posted the article edit form yet: display the form
        $results['article'] = new Article;
        require "editArticle.html.php";
    }
    exit();
}//new article

$results = array();
$data = Article::getList();
    
$results['articles'] = $data['results'];
$results['totalRows'] = $data['totalRows'];
$results['pageTitle'] = "All Articles";

if (!isset($_SESSION["paginator"]))
{
    $_SESSION["paginator"] = new PagePaginator(10, $data['totalRows']);
}
else
{
    $_SESSION["paginator"]->setRecords($data['totalRows']);
}
    
    if (isset($_GET['s']) and is_numeric($_GET['s']))
{
    $_SESSION["paginator"]->setStart($_GET['s']);
}
      
$results['errorMessage'] = isset($_GET['error']) ? getMsg($_GET['error']) : null;
$results['statusMessage'] = isset($_GET['status']) ? getMsg($_GET['status']) : null;
    
$results['heading'] = 'Article List';   
include 'admin.html.php'; 
require "listArticles.html.php";
echo '</section></main>';
?>
<script>
    function prepareNavLinks(){
        var hijax = window.poloAF.Hijax();
        hijax.setContainer(document.querySelector('section'));
        hijax.setCanvas(document.querySelector('section'));
        hijax.setUrl('.');
        hijax.captureData();
        
         hijax.validate = function(tgt){
           if(tgt.parentNode.id === "pp"){
                return true;
            }
            return false;
        };
    }
    
    function prepareDropDown(){
        var hijax = window.poloAF.Hijax();
        hijax.setContainer(document.querySelector('main'));
        hijax.setCanvas(document.querySelector('main'));
        hijax.setUrl('.');
        
        hijax.validate = function(tgt){
           if(tgt.id === "page_select"){
                return true;
            }
            return false;
        };
        
        hijax.captureData();
    }
    prepareNavLinks();
    prepareDropDown();
    /*
    document.getElementById('page').addEventListener('change',  function(e){
        //e.preventDefault();
        this.form.submit();
    });
    */    
    
    </script>
    <?php echo '</body>';