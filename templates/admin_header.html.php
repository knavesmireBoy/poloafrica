<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
} ?>
<h1 id="admin_head"><a href="?">Poloafrica Admin</a></h1>
<?php
if(isset($_SESSION['email'])){ ?>
<p>You are logged in with email: <b><?php htmlout($_SESSION['email']); ?></b> <a href="?action=logout"?> <strong>Log out</strong></a></p>
<?php }
echo '<h2>' . $results['heading'] . '</h2>';