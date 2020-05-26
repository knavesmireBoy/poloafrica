<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Article.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Asset.php';
require_once '../includes/db.inc.php';
require_once '../includes/access.inc.php';
require_once '../myconfig.php';

$action = isset($_GET['action']) ? $_GET['action'] : "";

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
    
if(isset($_POST['action']) && $_POST['action'] == 'Delete Article'){
    if (!$article = Article::getById((int)$_POST['articleId'])) {
        header("Location: ?error=articleNotFound");
        return;
    }
    $article->delete();
    header("Location: ?status=articleDeleted");
}

if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'editArticle'){
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
        if (isset($_FILES['asset'])) {
            $article->storeUploadedFile($_FILES['asset']);
            header( "Location: ?status=changesSaved" );
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

if(isset($_GET['action']) && $_GET['action'] == 'newArticle'){
        $results = array();
    $results['pageTitle'] = "New Article";
    $results['formAction'] = "newArticle";

    if (isset($_POST['saveChanges'])) {
        // User has posted the article edit form: save the new article
        $article = new Article();
        $article->storeFormValues($_POST);
        $article->insert();

        if (isset($_FILES['image']))
        {
            $img = new Asset($article->id);
            $img->storeUploadedFile($_FILES['image']);
            header("Location: ?status=changesSaved");
        }
    }
    elseif (isset($_POST['cancel'])) {
        // User has cancelled their edits: return to the article list
        header("Location: ");
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