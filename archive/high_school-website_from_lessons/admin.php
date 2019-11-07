<?php
	session_start();
?>
<head><meta charset="UTF-8"></head>
<?php
	include "php_files/errorlogger.php";
	AdmShowViews();
	function AdmShowViews()
	{
		include 'php_files/database.php';
		$query = $srv->query("SELECT id, username, text, accepted FROM views");
			if (!$query){
				$x ="Blad zapytania";
				Errorlog($x);
				mysqli_close($srv);
				echo "<div class='admin-views'>Błąd z bazą danych<div>";
			}
			if(mysqli_num_rows($query) > 0){
				while ($r = mysqli_fetch_array($query))
				{
					echo "<div class='admin-views'>";
					echo "<p class='admin-views-author'>";
					echo "Dodający ".$r[1]." ";
					echo "</p>";
					echo "<p class='admin-views-content'>";
					echo $r[2]."<br>";
					echo "</p>";
					if (isset($_SESSION['username']))
					{
						echo "<p class='admin-views-status'>";
						$d=$r[0];
						echo "<p><script>
								function DeleteView(id){
									var xmlhttp = new XMLHttpRequest();
									xmlhttp.open('GET', 'viewadd.php?q='+id+'&x=safepass123!', true);
									xmlhttp.send();
								}
								function AddView(id){
									var xmlhttp = new XMLHttpRequest();
									xmlhttp.open('GET', 'viewdelete.php?q='+id+'&x=safepass123!', true);
									xmlhttp.send();
								}
								</script></p>";
						if ($r[3] > 0){
							echo "Zaakceptowana <input type='button' value='del' onclick='DeleteView($d)'>";
						}
						else{
							echo "Oczekująca <input type='button' value='del' onclick='DeleteView($d)'><input type='button' value='Add' onclick='AddView($d)'>";
							echo "</p>";
							echo "<div>";
						}
					}
					else echo "<div>"; 
				}
			}
			else echo "<div class='admin-views'>Brak opinii w systemie<div>";
			mysqli_close($srv);
	}
?>