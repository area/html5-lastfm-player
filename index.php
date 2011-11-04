<?

#If not logged in, redirect to lastfm login page.
session_start();
if (!isset($_SESSION['sessionKey'])){
	#Not sure if this is a strong enough constraint, but good enough for now.
	header("Location: http://www.last.fm/api/auth/?api_key=a93b385d81161eb5ed308da9d734a7a5&cb=http://" . $_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF'])."/callback.php");

}else{

	header("Location: http://127.0.0.1/html5-lastfm-player/radio.php");
}
?>
