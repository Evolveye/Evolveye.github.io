<?php
	session_start();
	if (!isset($_SESSION['username']) || !isset($_GET['x']) || !isset($_GET['q'])){
		die();
	}
	if(strcmp($_GET["x"], 'safepass123!') != 0) die();
	include 'errorlogger.php';
	include 'database.php';
	$q=$_GET["q"];
	$query = $srv->query("UPDATE `views` SET `accepted`='1' WHERE `id`='$q'");
	if (!$query){
		$x ="Blad zapytania";
		Errorlog($x);
		mysqli_close($srv);
		die();
	}
	mysqli_close($srv);
?>