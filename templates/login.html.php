<?php
if (isset($loginError)): ?>
<h1><?php htmlout($loginError); ?></h1> <?php endif; ?>

<form action="." method="post" id="loginform">
        <ul>
            <li>
                <label for="email">Email</label><input type="email" name="email" id="email" autofocus maxlength="50" required></li>
          <li>
            <label for="password">Password</label><input type="password" name="password" id="password"  maxlength="20" required/>
          </li>
            <input type="hidden" name="action" value="login">
        </ul>
        <div class="buttons">
            <input type="submit" value="Log In">
        </div>
      </form>