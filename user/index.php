<?php
include $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';

require_once '../../../innocent/poloafricaDB.txt';
require_once '../includes/db.inc.php';
require_once '../includes/access.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Admin.php';
require_once '../myconfig.php';

$results = array();
$results['page_title'] = "Admin | Users";
$results['formaction'] = 'addform';
$results['name'] = '';
$results['id'] = '';
$results['email'] = '';
$results['button'] = 'Add User';
$results['required'] = 'required';
$setstatus = izSet($_GET, 'status');
$seterror = izSet($_GET, 'error');
$onsuccess = 'User was successfully';
$set = doSet($results, 'statusMessage');
$style = 'admin';

include ("../templates/header.php");
?>
<body class="admin">
    <main>
<?php
if (!userIsLoggedIn()){
include '../templates/login.html.php';
exit();
}

if (!userHasRole('Account Administrator') && !isset($_GET['error'])) {
$error = 'Only Account Administrators may access this page.';
header("Location: ?error=Only Account Administrators may access this page!");
}
    
    
if (isset($_POST['action']) and $_POST['action'] == 'Edit') {
    $admin = new Admin();
    $results = $admin->getById($_POST['id']);        
    $results['page_title'] = "Admin | Edit User";
    $results['formaction'] = 'editform';
    $results['button'] = 'Update User';
    $results['required'] = '';
    $roles = $admin->getUserRole($_POST['id']);
    $form = true;
}

if (isset($_POST['confirm']) && $_POST['confirm'] === 'No' || isset($_POST['abort'])) {
    header("Location: . ");
    exit();
}

if (isset($_GET['add'])) {
    $admin = new Admin();
    $tmproles = $admin->getRoles();
    $roles = array();
    /* do this to avoid undefined index warning on the add version of the form */
    foreach($tmproles as $role){
        $role['selected'] = '';
        $roles[] = $role;
    }
    //include form
    $form = true;
}

if (isset($_GET['addform'])) {
    $admin = new Admin();
    $admin->insert();
    header("Location: ?status=added");
    exit();
}

if (isset($_GET['editform'])) {
    $user = new Admin();
    $user->update($_POST);
    header("Location: ?status=updated");
    exit();
}
    
if(isset($_POST['action']) && $_POST['action'] == 'login'){

}

if($arg = $setstatus('deleted')){
    $results['statusMessage'] = "$onsuccess $arg!";
}

if($arg = $setstatus('added')){
    $results['statusMessage'] = "$onsuccess $arg!";
}

if($arg = $setstatus('updated')){
    $results['statusMessage'] = "$onsuccess $arg!";
}

if(isset($_GET['error'])){
    $results['errorMessage'] = $_GET['error'];
}

if (isset($_POST['confirm']) && $_POST['confirm'] === 'Yes'){
    $admin = new Admin();
    $user = $admin->delete($_POST['id']);
    header("Location: ?status=deleted" );
    exit();
}

if(isset($_POST['action']) && $_POST['action'] == 'Delete') {
    $admin = new Admin();
    $user = $admin->getById($_POST['id']);
    $prompt = true;
}

if(isset($_POST['action']) && $_POST['action'] == 'selecteduser') {
        if(empty($_POST['user'])) {
          $results['statusMessage'] = 'Please select a user';  
        }
    else {
        $user = new Admin();
        $user = $user->getById($_POST['user']);
    }
}
    if(!isset($user)){
    $admin = new Admin();
    $users = $admin->getList();
    }

include ("users.html.php");