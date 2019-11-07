<?php session_start(); ?>
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
</head>
<body>
  <header class="Header">
    <canvas class="Header_canvas" id="ele_canvas"></canvas>
    <div class="Header_text">
      <h1 class="Header_text-title">Główne środki transportu w Wejherowie</h1>
    </div>
  </header>

  <nav class="Nav">
    <a class="Nav-item" href="./index.php">Strona główna</a>
    <a class="Nav-item" href="./opinie.php">Opinie</a>
	<?php if(isset($_SESSION['username']))echo "<a class='Nav-item' href='./php_files/logout.php'>Wyloguj</a>";?>
  </nav>

  <main class="Content">
    <header class="Content_header">
      <h2>Główne informacje w 1 miejscu</h2>
      <p class="Content_header-text">
        Zebralismy tutaj najnowsze inforamcje z głównych stron internetowych
        najważniejszych przeowźników poruszajacych się po Wejherowie.<br>
        Dzięki temu, zawsze będziesz mieć pod ręką najnowsze artykuły,
        jak i informacje na temat wszelkich zmian.
      </p>
    </header>

    <?php include './php_files/news.php' ?>
    <article class="Content_section">
      <h2 class="Content_section-title">Co nowego?</h2>
      <div class="Content_section-wrapper">
        <section class="communication is-mzk">
          <h3 class="communication-title">MZK</h3>
          <div class="communication_box">
           <?php
				MZKNews(3);
			?>
          </div>
        </section>
        <section class="communication is-pks">
          <h3 class="communication-title">PKS</h3>
		  <div class="communication_box">
         <?php
				PKSNews(3);
			?>
			</div>
        </section>
        <section class="communication is-skm">
          <h3 class="communication-title">SKM</h3>
          <div class="communication_box">
            <?php
				SKMNews(3);
			?>
          </div>
        </section>
      </div>
    </article>

    <form class="Content_form" method="post">
      <h2 class="Content_form-title">Napisz do nas</h2>
      <textarea class="Content_form-textarea" name="view" placeholder="Piszu, piszu..."></textarea>
	    <input class="Content_form-nickname" name="nickname" placeholder="Nick">
      <button class="Content_form-button" type="submit" name="submit" value="1">Wyślij</button>
      <?php
        if (isset($_POST['submit'])){
          include 'php_files/errorlogger.php';
          function AddAnonimousView($text, $nick){
            include 'php_files/database.php';
            $query = $srv->query("INSERT INTO `views`(`username`, `text`, `accepted`) VALUES ('$nick','$text','0')");
            if (!$query){
              $x ="Blad zapytania";
              Errorlog($x);
              mysqli_close($srv);
            }
            mysqli_close($srv);
          }
          if ($_POST['nickname'] != 'admin') AddAnonimousView($_POST['view'], $_POST['nickname']);
        }
      ?>
    </form>
  </main>

  <footer class="Footer">
    <script src="./header.js"></script>
    <a href="./login.php">Logowanie dla administratora</a>
  </footer>
</body>
</html>