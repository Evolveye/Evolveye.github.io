<?php
	$srv = mysqli_connect('sql306.jcom.pl', 'jcom_15930022', 'jb1my3cp', 'jcom_15930022_wia');
	if (!$srv){
		$x ="Blad hosta";
		Errorlog($x);
		header("Location: http://antrio.jcom.pl/WiA/");
	}
?>