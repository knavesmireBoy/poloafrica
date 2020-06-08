<form action="?<?php htmlout($results['formaction']); ?>" method="post" class="manage editor">
<div id="names">
<label for="fname">First Name:</label><input type="text" name="fname" id="fname" value="<?php htmlout($results['fname']); ?>" required>
    <label for="lastname">First Name:</label><input type="text" name="lastname" id="lastname" value="<?php htmlout($results['lastname']); ?>" required>
    </div>
    <div id="address">
        <label for="address1">Address 1:</label><input type="text" name="address1" id="address1" required/>
        <label for="address2">Address 2:</label><input type="text" name="address2" id="address2" />
        <label for="address3">Address 3:</label><input type="text" name="address3" id="address3"/>
        <label for="place">Place:</label><input type="text" name="place" id="place" required title="City, Town, Village"/>
        <label for="postcode">Postcode:</label><input type="text" name="postcode" id="postcode" required/>
    </div>
    <div>
<label for="email">Email:</label><input type="email" name="email"
id="email" value="<?php htmlout($results['email']); ?>" required></div>
<div><label for="password">Set password:</label><input type="password" name="password" id="password" <?php echo $results['required']; ?>></div>
<input type="hidden" name="id" value="<?php htmlout($results['id']); ?>">
<input type="submit" value="<?php htmlout($results['button']); ?>">
<input type="submit" name="abort" value="Cancel" formnovalidate>
    </form>