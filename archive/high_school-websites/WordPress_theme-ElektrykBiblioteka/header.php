<!DOCTYPE html>
<html>
<head>
    <title><?php wp_title(); ?> <?php bloginfo('name'); ?></title>
    <meta charset="UTF-8">
    <meta name="theme-color" content="#0B327D">
    <link rel="icon" href="http://zsp2.net/wp-content/themes/ElektrykGlowna/grafika/logo.png" sizes="16x16">
    <link rel="stylesheet" href="<?php bloginfo( 'stylesheet_url' ); ?>" type="text/css">
    <meta name="description" content="zsp2.net, Strona główna">

    <?php wp_head(); ?>
</head>
<body>

<!-- ====== Globalny nagłówek ====== -->
<header>
    <a id="logo" href="http://zsp2.net/"></a>
    <?php wp_nav_menu( array('theme_location' => 'header') ); ?>
    <form role="search" method="get" class="search-form" action="<?php echo home_url( '/' ); ?>">
        <input type="search" class="search-field" placeholder="Szukaj" autocomplete="off" name="s"/>
        <input type="submit" class="search-submit" value=" "/>
    </form>
    <a href="https://www.facebook.com/elektryk.wejherowo/?fref=ts" class="facebook"></a>
</header>