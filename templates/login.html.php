<div id="adminHeader"><h2>Poloafrica Admin</h2></div>
<h3>Log In</h3>

<form action="." method="post" id="loginform">
 <label for="email">Email</label>
    <input type="email" name="email" id="email" autofocus maxlength="50" required value="<?php if(isset($myemail)){ htmlout($myemail); } ?>">
    <label for="password">Password</label>
    <input type="password" name="password" id="password"  maxlength="20" required/>
    <input type="hidden" name="action" value="login">
        <div class="buttons">
            <input type="submit" value="Log In">
        </div>
      </form>
<?php
if (isset($loginError)): ?>
<p><?php htmlout($loginError); ?></p>
<?php endif; ?>