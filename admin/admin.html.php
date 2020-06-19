<?php
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/magicquotes.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/includes/helpers.inc.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/Article.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/PagePaginator.php';
include_once $_SERVER['DOCUMENT_ROOT'] . '/poloafrica/classes/PhotoPaginator.php';

require_once '../myconfig.php';
require_once '../includes/db.inc.php';
require_once '../includes/access.inc.php'; 
if(!isset($_SESSION["email"])){
session_start();
} ?>

<div id="adminHeader">
        <h2>Poloafrica Admin</h2>
        <p>You are logged in with email: <b><?php htmlout($_SESSION['email']); ?></b> <a href="?action=logout"?> <strong>Log out</strong></a></p></div>
<h3><?php echo $results['heading']; ?></h3>

<?php
if (isset($results['errorMessage'])){ ?>
<div class="errorMessage"><?php htmlout($results['errorMessage']); ?></div>
<div><a href="../user">User</a></div>
<?php } 
if (isset($results['statusMessage'])){ ?>
<div class="statusMessage"><?php htmlout($results['statusMessage']); ?></div>
<?php }

