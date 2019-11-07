<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="theme-color" content="#DB3A3A">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <title>Przemyt ludzi</title>

  <link rel="stylesheet" href="./main.css">
  <link rel="stylesheet" href="./1000.css" media="screen and (max-width: 1000px)">
  <link rel="icon" href="./favicon.ico">

	<?php session_start(); ?>
</head>
<body class="is-subpage">
  <nav class="Nav">
    <a class="Nav-item" href="./index.php">Strona główna</a>
    <a class="Nav-item" href="./opinie.php">Opinie</a>
	<?php if(isset($_SESSION['username']))echo "<a class='Nav-item' href='./php_files/logout.php'>Wyloguj</a>";?>
  </nav>

	<main class="Opinions">
		<h1>Opinie użytkowników</h1>
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
					if(mysqli_num_rows($query) > 0) {
						echo '<article>';
						while ($r = mysqli_fetch_array($query)) : ?>
							<?php if( ($r[3] > 0 && !isset($_SESSION['username']) || isset($_SESSION['username'])) ) { ?>
								<hr class="Opinions_separator">
								<div class="Opinions_opinion">
									<div class="Opinions_opinion_author">
										<span class="Opinions_opinion_author-prefix">Dodający:</span>
										<span class="Opinions_opinion_author-nick"><?=$r[1]?></span>
									</div>
									<p class='Opinions_opinion-text'><?=$r[2]?></p>

									<?php if (isset($_SESSION['username'])) : ?>
										<p class='Opinions_opinion-status'>
											<?php if($r[3] > 0) : ?>
												Zaakceptowana
												<input type='button' value='del' onclick='DeleteView(<?=$r[0]?>)'>
											<?php else : ?>
												Oczekująca
												<input type='button' value='del' onclick='DeleteView(<?=$r[0]?>)'>
												<input type='button' value='Add' onclick='AddView(<?=$r[0]?>)'>
											<?php endif ?>
										</p>
									<?php endif ?>
								</div>
							<?php } ?>
						<?php endwhile;
						echo '</article>';

						if (isset($_SESSION['username'])) : ?>
							<p><script>
								function DeleteView(id){
									var xmlhttp = new XMLHttpRequest();
									xmlhttp.open('GET', './php_files/viewadd.php?q='+id+'&x=safepass123!', true);
									xmlhttp.send();
								}
								function AddView(id){
									var xmlhttp = new XMLHttpRequest();
									xmlhttp.open('GET', './php_files/viewdelete.php?q='+id+'&x=safepass123!', true);
									xmlhttp.send();
								}
							</script></p>
						<?php endif;

					} else { ?> <div class='admin-views'>Brak opinii w systemie<div> <?php }
					mysqli_close($srv);
			}
		?>
	</main>