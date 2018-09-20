<style>
a {
 display: block;
 margin: 5px;
 padding: 3px;
 font-size: 16px;
}
a:hover {
 background: rgba(0,0,0,0.05)
}
</style>
<?php
if($handle = opendir('.')){
  while(false !== ($entry = readdir($handle)))
    if ($entry != "." && $entry != ".." && $entry != "cgi-bin" && $entry != "index.php" && $entry != ".well-known" && $entry != "php.ini" && $entry != ".user.ini")
      echo '<a href="'.$entry.'">'.$entry.'</a>';

  closedir($handle);
}