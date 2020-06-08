<?php
function getConn(){
try {
//$pdo = new PDO('mysql:host=localhost; dbname=polafrica', 'root', 'covid19@krauq');
$pdo = new PDO(DB_DSN, DB_USERNAME, DB_PASSWORD);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec('SET NAMES "utf8"');
}
catch(PDOException $e){
$output = 'Unable to connect to the database server: ' . $e->getMessage();
include 'error.html.php';
exit();
}
return $pdo;
}