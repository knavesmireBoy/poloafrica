<!DOCTYPE html>
<html class="no-js" lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    </head>
<body>
	
<?php
$greeting = 'Thankyou';

function userIsLoggedIn(){
if (!isset($_POST['contactEmail']) or $_POST['contactEmail'] == ''){ 
$GLOBALS['loginError'] = 'Please supply an email address!';
global $greeting;
$greeting = "There's a Problem";
return FALSE;
}
return TRUE;
}
?>
<p id='now'>
<?php
if (userIsLoggedIn()){
echo '<p>Email: ' . $_POST['contactEmail'] . '<p/>';
}
else { echo'<p>Email:' . $loginError . '<p/>'; }
echo '<p>Name: ' . $_POST['contactName'] . '<p/>';
echo '<p>Telephone: ' . $_POST['contactTel'] . '<p/>';
echo '<p>Address1: ' . $_POST['AddressLine1'] . '<p/>';
echo '<p>Address2: ' . $_POST['AddressLine2'] . '<p/>';
echo '<h2>' . $greeting . '</h2>';
?>
</p>
</body>
</html>


