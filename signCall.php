<?
require 'apiDetails.php';
#print $_POST['call'];
print md5($_POST['call'].$secret);
?>
