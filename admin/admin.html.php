<h2>Poloafrica Admin</h2>
<p>You are logged in with email: <b><?php htmlout($_SESSION['email']); ?></b> <a href="?action=logout"?> <strong>Log out</strong></a></p>
<h3><?php echo $results['heading']; ?></h3>
<?php
if (isset($results['errorMessage'])){ ?>
<div class="msg errorMessage"><?php htmlout($results['errorMessage']); ?></div>
<nav>
<a href="../user/" title="Manage Users" class="icon"><img src="../images/resource/icon_user_edit.png"></a>
<a href="../home/" title="live website" class="icon"><img src="../images/resource/home.png"></a>
</nav>
<?php } 
if (isset($results['statusMessage'])){ ?>
<div class="msg statusMessage"><?php htmlout($results['statusMessage']); ?></div>
<?php }
