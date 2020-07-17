<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';

require_once '../includes/db.inc.php';
require_once '../includes/access.inc.php';
require_once '../myconfig.php';

$results['page_title'] = 'Page';
$results['heading'] = 'Page List';

include '../templates/header.php';


if (!userIsLoggedIn())
{
    include '../templates/login.html.php';
    exit();
}

if (!userHasRole('Account Administrator') && !isset($_GET['error'])) {
$error = 'Only Account Administrators may access this page.';
header("Location: ?error=Only Account Administrators may access this page!");
exit();
}

if (!userHasRole('Account Administrator') && !isset($_GET['error'])) {
$error = 'Only Account Administrators may access this page.';
header("Location: ?error=Only Account Administrators may access this page!");
}

if (isset($_GET['error'])) {
    $results['errorMessage'] = isset($_GET['error']) ? getMsg($_GET['error']) : null;
    include 'admin.html.php';
    exit();
}
   

if (isset($_GET['action']) && $_GET['action'] == 'choose')
{
    $results = PageFactory::getById((int)$_GET['page']);
    $results['action'] = 'Edit';
    include 'page.html.php';
    exit();
}

if (isset($_GET['action']) && $_GET['action'] == 'addPage')
{
    $results = array();
    $results['id'] = '';
    $results['name'] = '';
    $results['content'] = '';
    $results['description'] = '';
    $results['title'] = '';
    $results['image'] = '';
    $results['url'] = '';
    $results['action'] = 'Add';
    include 'page.html.php';
    exit();
}

if (isset($_POST['action']) && $_POST['action'] == 'Edit')
{
    if(!$page = PageFactory::createPage($_POST)){
        redirect(array(array('error', 'articleNotFound')));
    }
    else {
    $page->update($_POST);
    header("Location: ?status=changesSaved&page={$_POST['name']}");
    exit();
    }
}

if (isset($_POST['action']) && $_POST['action'] == 'Add')
{
    $page = PageFactory::createPage($_POST);
    $page->insert($_POST);
    header("Location: ?status=changesSaved&page={$_POST['name']}");
    exit();
}

if (isset($_POST['action']) && $_POST['action'] == 'Delete')
{
    $page = PageFactory::createPage($_POST);
    include 'prompt.html.php';
    exit();
}

if (isset($_POST['confirm']) && $_POST['confirm'] == 'Yes')
{

    $page = PageFactory::createPage($_POST);
    $page->delete();
    header("Location: ?status=pageDeleted&page={$_POST['name']}");
}

$results['statusMessage'] = isset($_GET['status']) ? getMsg($_GET['status']) : null;
$results['errorMessage'] = isset($_GET['error']) ? getMsg($_GET['error']) : null;
include 'listPages.html.php';
echo '</section></main></body>';