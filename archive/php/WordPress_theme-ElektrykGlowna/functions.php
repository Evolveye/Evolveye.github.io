<?php

/* * * Widgety; Okienka z linkami/filmami/itp;
=======================================================================*/
function widgets_init() {
    register_sidebar( array(
        'name'          => 'Widgety w menu',
        'id'            => 'sidebar-0',
        'before_widget' => '<div class="nav_menu %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2>',
        'after_title'   => '</h2>',
    ) );
    register_sidebar( array(
        'name'          => 'Widgety w prawej kolumnie',
        'id'            => 'sidebar-1',
        'before_widget' => '<div class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h1>',
        'after_title'   => '</h1>',
    ) );
    register_sidebar( array(
        'name'          => 'Widgety w stopce',
        'id'            => 'sidebar-2',
        'before_widget' => '<div class="widget footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h1>',
        'after_title'   => '</h1>',
    ) );
}
add_action( 'widgets_init', 'widgets_init' );


/* * * Menu; Pola z odnośnikami;
=======================================================================*/
function register_my_menus() {
    register_nav_menus( array(
        'header_menu'	=> __('Header'),
        'local_menu' 	=> __('Slider'),
        'mobile_menu' 	=> __('Mobile'),
    ));
}
add_action( 'init', 'register_my_menus' );


/* * * Grafika reprezentująca post; Załadowanie skryptów admina;
=======================================================================*/
add_theme_support( 'post-thumbnails' );

require_once(TEMPLATEPATH.'/functions/admin-menu.php');
?>