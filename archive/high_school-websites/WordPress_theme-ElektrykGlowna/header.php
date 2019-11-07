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
    <?php wp_nav_menu( array('theme_location' => 'header_menu') ); ?>
    <div id="search">
        <div class="search_icon"></div>
        <form role="search" method="get" class="search_form" action="<?php echo home_url('/');?>">
            <input type="search" class="search" placeholder="Szukaj" autocomplete="off" name="s"/>
            <input type="submit" class="search_icon search_submit" value=">>"/>
        </form>
    </div>
    <nav id="menu_nav">
        <div id="nav_button">Rozwiń menu</div>
        <div id="nav_table_parent">
            <div id="nav_table" class="floatfix">
                <?php dynamic_sidebar('sidebar-0');?>
            </div>
        </div>
    </nav>
    <a href="https://www.facebook.com/elektryk.wejherowo/?fref=ts" class="facebook"></a>
    <nav id="menu_mobile">
        <div id="nav_button">Rozwiń menu</div>
        <div id="mobile_table_parent">
            <div id="mobile_table_parent2">
                <form role="search" method="get" class="search_form" action="<?php echo home_url('/');?>">
                    <input type="search" class="search" placeholder="Szukaj" autocomplete="off" name="s"/>
                    <input type="submit" class="search_icon search_submit" value=">>"/>
                </form>
                <?php wp_nav_menu( array( 'theme_location' => 'mobile_menu' ) ); ?>
            </div>
        </div>
    </nav>
</header>
<script>
window.onload = () =>{resize()}
window.onresize = ()=>{resize()}
function resize(){
    let navWidgets = document.getElementsByClassName("nav_menu");
    let _WIDTH = document.body.clientWidth;
    let width = _WIDTH / navWidgets.length
    for(let i of navWidgets){
        i.style.width = width +"px"
    }
}
</script>