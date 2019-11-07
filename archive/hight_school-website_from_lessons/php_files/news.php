<?php 
function MZKNews($x)
{
	if ($x < 1 || $x >10) return;
	$url = 'http://mzkwejherowo.pl/';
	$strona = file_get_contents($url);
	$cut1 = explode( '<section class="section-news section-news-82">' , $strona);
	$cut2 = explode("</section>" , $cut1[1] );
	for($i = 0; $i <= $x-1; $i++)
	{
		echo "<div class='Content_news-news'>";
		echo strip_tags($cut2[$i], "<br><h2><p><a><h>");
		echo "</div>";
	}
}
function PKSnews($x)
{
	if ($x < 1 || $x >10) return;
	$url = 'http://www.pksgdynia.pl/PL/aktualnosci.html';
	$strona = file_get_contents($url);
	$cut1 = explode( '<h2>' , $strona);
	for($i = 3; $i <= $x+2; $i++)
	{
		echo "<div class='Content_news-news'>";
		echo strip_tags($cut1[$i], "<br><img><h><strong><a>");
		echo "</div>";
	}
}
function SKMNews($x)
{
	if ($x < 1 || $x >10) return;
	$url = 'http://www.skm.pkp.pl/dla-pasazera/aktualnosci-skm/';
	$strona = file_get_contents($url);
	$cut1 = explode( '<div class="info-item">' , $strona);
	for($i = 1; $i <= $x; $i++)
	{
		echo "<div class='Content_news-news'>";
		echo strip_tags($cut1[$i], "<br><img><h2><h><a>");
		echo "</div>";
	}
}