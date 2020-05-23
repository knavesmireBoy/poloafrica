<?php
$GLOBALS['loginError'] = '';

function userIsLoggedIn() {
if (isset($_POST['action']) and $_POST['action'] == 'login') {
if (!isset($_POST['email']) or $_POST['email'] == '' or !isset($_POST['password']) or $_POST['password'] == '') {
$GLOBALS['loginError'] = 'Please fill in both fields';
return FALSE;
}
$password = md5($_POST['password'] . 'poloafrica');
    
if (databaseContainsUser($_POST['email'], $password)) {
    //andrewsykes@btinternet.com
session_start();
$_SESSION['loggedIn'] = TRUE;
$_SESSION['email'] = $_POST['email'];
$_SESSION['password'] = $password;
return TRUE;
}
else {
session_start();
unset($_SESSION['loggedIn']);
unset($_SESSION['email']);
unset($_SESSION['password']);
$GLOBALS['loginError'] = 'The specified email address or password was incorrect.';
//$results['pageTitle'] = 'crumbs';
return FALSE;
}
}//loggedin
//else if (isset($_POST['action']) and $_POST['action'] == 'logout') {
else if (isset($_GET['action']) and $_GET['action'] == 'logout') {
session_start();
unset($_SESSION['loggedIn']);
unset($_SESSION['email']);
unset($_SESSION['password']);
header('Location: .');
exit();
}//logout
else {
session_start();
if (isset($_SESSION['loggedIn'])) {
return databaseContainsUser($_SESSION['email'], $_SESSION['password']);
}
}//default
}//userLogged

function databaseContainsUser($email, $password) {
$pdo = getConn();
try {
$sql = 'SELECT COUNT(*) FROM user
WHERE email = :email AND password = :password';    
$s = $pdo->prepare($sql);
$s->bindValue(':email', $email);
$s->bindValue(':password', $password);
$s->execute();
}
catch (PDOException $e){
$error = 'Error searching for user1.' . $e;
$results = 'Error searching for user2.' . $e;
$GLOBALS['loginError'] =  'Error searching for user3.' . $e;
header('Location: . ');
exit();
}
$row = $s->fetch();
if ($row[0] > 0){
return TRUE;
}
else {
return FALSE;
}
}

function userHasRole($role) {
//include 'db.inc.php';
    $pdo = getConn();
try {    
$sql = "SELECT COUNT(*) FROM user
INNER JOIN userrole ON user.id = userrole.user_id
INNER JOIN role ON userrole.role_id = role.id
WHERE email = :email AND role.description = :roleId";    
$s = $pdo->prepare($sql);
$s->bindValue(':email', $_SESSION['email']);
$s->bindValue(':roleId', $role);
$s->execute();
}
catch (PDOException $e) {
$error = 'Error searching for user innit';
include 'error.html.php';
exit();
}
$row = $s->fetch();
if ($row[0] > 0) {
return TRUE;
}
else {
return FALSE;
}
}