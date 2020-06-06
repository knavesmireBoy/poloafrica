<?php
//session_start();

include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Article.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Asset.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Paginator.php';
require_once '../includes/db.inc.php';
require_once '../includes/access.inc.php';
require_once '../myconfig.php';

$action = isset($_GET['action']) ? $_GET['action'] : "";
$display = 10;

$results['page_title'] = 'Admin';
include "../templates/header.php"; ?>
<body id="admin">
    <?php
if (!userIsLoggedIn()){
include '../templates/login.html.php';
exit();
}

if (!userHasRole('Account Administrator') && !isset($_GET['error'])) {
$error = 'Only Account Administrators may access this page.';
header("Location: ?error='Only Account Administrators may access this page.'");
}
        if(isset($_GET['action']) && $_GET['action'] == 'removeArticle'){
        $remove = 'Are you sure you want to remove the article: ';
        $article = Article::getById((int)$_GET['articleId']);
        }
    
    if(isset($_POST['action']) && $_POST['action'] == 'Delete Article'){
    
    if (!$article = Article::getById((int)$_POST['articleId'])) {
        header("Location: ?error=articleNotFound");
        return;
    }
    header("Location: ?action=removeArticle&articleId=" . $article->id);
    exit();
}
    
    if(isset($_POST['action']) && $_POST['action'] == 'Confirm'){
    if (!$article = Article::getById((int)$_POST['articleId'])) {
        header("Location: ?error=articleNotFound");
        return;
    }
    $article->delete();
    header("Location: ?status=articleDeleted");
    exit();
}
    
    if (isset($_GET['s']) and is_numeric($_GET['s'])){
        //exit(999);
        $_SESSION["paginator"]->setStart($_GET['s']);
    }
    
    if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'choose'){
        if(!empty($_REQUEST['page'])){
        require ( "../templates/listArticles.php");
        exit();
        }
    }

if(isset($_REQUEST['action']) && ($_REQUEST['action'] == 'editArticle' || $_REQUEST['action'] == 'removeArticle')){
    $results = array();
    $results['pageTitle'] = "Edit Article";
    $results['formAction'] = "editArticle";

    if (isset($_POST['saveChanges'])) {
        // User has posted the article edit form: save the article changes
        if (!$article = Article::getById((int)$_POST['articleId'])) {
            header("Location: ?error=articleNotFound");
        }
        
        $article->storeFormValues($_POST);
        
        if (isset($_POST['deleteAsset'])) {
            foreach ($_POST['deleteAsset'] as $id) {
                $article->deleteAssets($id);
            }
        }
                
        $article->update();
        /* this will always be true due to enctype="multipart/form-data" */
        if (isset($_FILES['asset'])) {
            /* if the file wasn't an upload (UPLOAD_ERR_OK != 0) Asset will only update the attributes */
            $article->storeUploadedFile($_FILES['asset'], $_POST);
            $page = isset($_REQUEST['page']) ? $_REQUEST['page'] : ''; 
            header( "Location: ?status=changesSaved&page=$page" );
        }
    }
    elseif (isset($_POST['cancel'])) {
        // User has cancelled their edits: return to the article list
         header('Location: .');
        exit(); 
    }
    else {
        // User has not posted the article edit form yet: display the form
        $results['article'] = Article::getById((int)$_GET['articleId']);
        require ("../templates/editArticle.php");
    }
    exit();
}
    

    //newArticle present in queryString
if(isset($_GET['action']) && $_GET['action'] == 'newArticle'){
        $results = array();
    $results['pageTitle'] = "New Article";
    $results['formAction'] = "newArticle";
    
    //form action
    if (isset($_POST['saveChanges'])) {
        // User has posted the article edit form: save the new article
        $article = new Article();
        $article->storeFormValues($_POST);
        $article->insert();

        if (isset($_FILES['asset']))
        {
            $article->storeUploadedFile($_FILES['asset'], $_POST);
            header("Location: ?status=changesSaved");
            exit();
        }
        header( "Location: ?status=changesSaved" );
    }
    elseif (isset($_POST['cancel'])) {
        // User has cancelled their edits: return to the article list
        header("Location: .");
        exit();
    }
    else {
        // User has not posted the article edit form yet: display the form
        $results['article'] = new Article;
        //require (TEMPLATE_PATH . "/admin/editArticle.php");
         require ("../templates/editArticle.php");
    }
        exit();
}


if(isset($_POST['useraction']) && $_POST['useraction'] == 'Delete') {
exit('bolt');
}

if(isset($_POST['action']) && $_POST['action'] == 'selectuser') {
    $user = new Admin();
    $users = $user->getId($_POST['user']);
    include ("../templates/admin/users.html.php");
}

if(isset($_GET['action']) && $_GET['action'] == 'newUser'){
    $user = new Admin();
    $users = $user->getList();
    include ("../templates/admin/users.html.php");
    exit();
}

$results = array();
$data = Article::getList();

    $results['articles'] = $data['results'];
    $results['totalRows'] = $data['totalRows'];
    $results['pageTitle'] = "All Articles";
    
    if (!isset($_SESSION["paginator"])) {
        $_SESSION["paginator"] = new Paginator(10, $data['totalRows']);
    }
    else {
        $_SESSION["paginator"]->setRecords($data['totalRows']);
    }

 if ( isset( $_GET['error'] ) ) {
    if ( $_GET['error'] == "articleNotFound" ) {
        $results['errorMessage'] = "Error: Article not found.";
    }
     else {
         $results['errorMessage'] = $_GET['error'];
     }
  }
    if (isset($_GET['status'])) {
        if ($_GET['status'] == "changesSaved") $results['statusMessage'] = "Your changes have been saved.";
        if ($_GET['status'] == "articleDeleted") $results['statusMessage'] = "Article deleted.";
    }
?>    

    <?php
require ( "../templates/listArticles.php");
    ?>
    </body>