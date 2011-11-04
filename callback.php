<?php
session_start();
require './php/lastfmapi.php';
require 'apiDetails.php';
if ( !empty($_GET['token']) ) {
	$vars = array(
		'apiKey' => $apikey,
		'secret' => $secret,
		'token' => $_GET['token']
	);
	#Create session key from token. This is the only call that
	#the server will be making to the last.fm API servers;
	#This means that we can have 1500 people login every 5 
	#minutes, and then all subsequent API calls from them will
	#come from their IPs.

	$auth = new lastfmApiAuth('getsession', $vars);

	#$contents = $auth->apiKey."\n".$auth->secret."\n".$auth->username."\n".$auth->sessionKey."\n".$auth->subscriber;
	#echo $contents;
	#echo '<a href="'.$_SERVER['PHP_SELF'].'">Reload</a>';
	$_SESSION['sessionKey'] = $auth->sessionKey;
	header("Location: ./radio.php");
}
?>
