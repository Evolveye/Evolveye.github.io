<?php

/* * * Wyświetlanie 5 postów na stronie głównej;
=======================================================================*/
function posts_on_homepage( $query ) {
    if ( $query->is_home() && $query->is_main_query() ) {
        $query->set( 'posts_per_page', 5);
    }
}
add_action( 'pre_get_posts', 'posts_on_homepage' );


/* * * Widgety; Okienka z linkami/filmami/itp;
=======================================================================*/
function widgets_init() {
    register_sidebar( array(
        'name'          => 'Widgety w prawej kolumnie',
        'id'            => 'sidebar-1',
        'before_widget' => '<div class="widget %2$s">',
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
        'header' => __( 'Nagłówek' ),
        'informacje' => __( 'Informacje' ),
    ));
}
add_action( 'init', 'register_my_menus' );


/* * * Załadowanie skryptów admina;
=======================================================================*/
require_once(TEMPLATEPATH.'/functions/admin-menu.php');

?>