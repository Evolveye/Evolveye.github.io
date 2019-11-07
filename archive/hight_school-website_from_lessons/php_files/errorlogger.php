<?php 
	function Errorlog($x){
			$logs = fopen("./php_files/logi.txt", "r");
			$oldlogs = fread($logs, filesize("logi.txt"));
			fclose($logs);
			$logs = fopen("./php_files/logi.txt", "w");
			fwrite($logs, $oldlogs."\n".$x." ".date('r'));
			fclose($logs);
		}
?>