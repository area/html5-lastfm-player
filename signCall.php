<?
require 'apiDetails.php';
#Need to strip slashes which have been inserted to the API call.
print md5(stripslashes($_POST['call']).$secret);
?>
