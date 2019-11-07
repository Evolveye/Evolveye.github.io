<?php
	session_start();
	if (isset($_SESSION['username'])){
		header("Location: ./opinie.php");
	}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="theme-color" content="#DB3A3A">

  <title>Przemyt ludzi</title>

  <link rel="stylesheet" href="./main.css">
  <link rel="stylesheet" href="./1000.css" media="screen and (max-width: 1000px)">
  <link rel="icon" href="./favicon.ico">

<?php
	if (isset($_POST['submit'])){
		include 'php_files/errorlogger.php';
		function CheckPassword($password, $username){
			include 'php_files/database.php';
			$query = $srv->query("SELECT password, active FROM users WHERE `username`='$username'");
			if (!$query){
				$x ="Blad zapytania";
				Errorlog($x);
				mysqli_close($srv);
				header("Location: ./index.php");
			}
			if(mysqli_num_rows($query) > 0){
					$r = mysqli_fetch_array($query);
					if (strcmp($r[0],md5($password)) == 0 && $r[1] > 0){
						$_SESSION['username'] = $username;
						mysqli_close($srv);
						header("Location: ./opinie.php");
					}
				}
			else {
				$x ="Próba zalogowania na nieistniejącego użytkownika $username";
				Errorlog($x);
				mysqli_close($srv);
				header("Location: ./login.php");
			}
		}
		CheckPassword($_POST['username'], $_POST['password']);
	}
?>

</head>
<body class="is-subpage">

  <nav class="Nav">
    <a class="Nav-item" href="./index.htm">Strona główna</a>
	<a class="Nav-item" href="./opinie.php">Opinie</a>
  </nav>

  <main class="Content">
    <form class="Content_login" method='post'>
      <h1 class="Content_login-title">Logowanie</h1>
      <label class="Content_login-field">Login<input class="Content_login-input" name="username"></label>
      <label class="Content_login-field">Hasło<input class="Content_login-input" name="password"></label>
      <button class="Content_form-button" type="submit" name="submit" value="1">Wyślij</button>
    </form>
  </main>

  <footer class="Footer">
  </footer>
</body>
</html>