<?php
$GLOBALS['loginError'] = '';

function doUnset($required)
{
       if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
    foreach ($required as $r)
    {
        unset($_SESSION[$r]);
    }
    $_SESSION = array();
    session_destroy();
}

//a kindness if email is correct but password is forgotten
function databaseHasEmail($email)
{
    $conn = getConn();
    $sql = 'SELECT email FROM user WHERE email = :email';
    $st = prepSQL($conn, $sql);
    $st->bindValue(':email', $email);
    doPreparedQuery($st, 'Error retreiving user details');
    $row = $st->fetch();
    return $row[0];
}

function databaseContainsUser($email, $password)
{
    $conn = getConn();
    $sql = 'SELECT COUNT(*) FROM user WHERE email = :email AND password = :password';
    $st = prepSQL($conn, $sql);
    $st->bindValue(':email', $email);
    $st->bindValue(':password', $password);
    doPreparedQuery($st, 'Error retreiving user details');
    $row = $st->fetch();
    return $row[0] > 0 ? true : databaseHasEmail($email);
}

function userHasRole($role)
{
    $conn = getConn();
    $sql = "SELECT COUNT(*), user.id, user.name FROM user
INNER JOIN userrole ON user.id = userrole.user_id
INNER JOIN role ON userrole.role_id = role.id
WHERE email = :email AND role.description = :roleId";
        $st = prepSQL($conn, $sql);
        $st->bindValue(':email', $_SESSION['email']);
        $st->bindValue(':roleId', $role);
        doPreparedQuery($st, 'Error retreiving information');
    $row = $st->fetch(PDO::FETCH_NUM);
    return $row[0] > 0 ? true : false;
}

function userIsLoggedIn()
{
    if (isset($_POST['action']) and $_POST['action'] == 'login')
    {
        if (!isset($_POST['email']) or $_POST['email'] == '' or !isset($_POST['password']) or $_POST['password'] == '')
        {
            $GLOBALS['loginError'] = 'Please fill in both fields';
            return false;
        }
        $password = md5($_POST['password'] . DB_SALT);

        if (databaseContainsUser($_POST['email'], $password))
        {
            $myemail = databaseContainsUser($_POST['email'], $password);
            if(!is_bool($myemail)){
                doUnset(array(
                'loggedIn',
                'email',
                'password',
                'agent'
            ));
                if($myemail){
                    $GLOBALS['myemail'] = $myemail;  
                    $GLOBALS['loginError'] = 'The specified password was incorrect.';
                }
                else {
                    $GLOBALS['loginError'] = 'The specified email address or password was incorrect.';
                }
            return false;
            }
           if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
            $_SESSION['loggedIn'] = true;
            $_SESSION['email'] = $_POST['email'];
            $_SESSION['password'] = $password;
            $_SESSION['agent'] = md5($_SERVER['HTTP_USER_AGENT']);
            return true;
        }
        else
        {
            doUnset(array(
                'loggedIn',
                'email',
                'password',
                'agent'
            ));
            //used in login.html
            $GLOBALS['loginError'] = 'The specified email address or password was incorrect.';
            return false;
        }
    } //loggedin
    else if (isset($_GET['action']) and $_GET['action'] == 'logout')
    {
        doUnset(array(
            'loggedIn',
            'email',
            'password',
            'agent'
        ));
        header('Location: .');
        exit();
    } //logout
    else
    {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        if (isset($_SESSION['loggedIn']))
        {
            return databaseContainsUser($_SESSION['email'], $_SESSION['password']);
        }
    } //default
    
} //userLogged
