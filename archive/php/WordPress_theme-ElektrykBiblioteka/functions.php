<?php

/* * * Wyświetlanie 2 postów na stronie głównej;
=======================================================================*/
function change_posts_on_homepage( $query ) {
    $posts_on_first = 2;

    if ( $query->is_home() && !is_paged() && $query->is_main_query() ) {
        $query->set( 'posts_per_page', $posts_on_first );
    }

    if ( $query->is_home() && is_paged() && $query->is_main_query() ) {
        $ppp = get_option('posts_per_page');
        $page_offset = $ppp*($query->query_vars['paged']-2) + $posts_on_first;

        $query->set('offset', $page_offset );
    } 
}
add_action( 'pre_get_posts', 'change_posts_on_homepage' );



/* * * Widgety; Okienka z tekstem/linkami;
=======================================================================*/
function widgets_init() {
    register_sidebar( array(
        'name'          => 'Widgety w nagłówku',
        'id'            => 'sidebar-1',
        'before_widget' => '<div class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h1>',
        'after_title'   => '</h1>',
    ) );
    register_sidebar( array(
        'name'          => 'Widgety pod kategoriami',
        'id'            => 'sidebar-2',
        'before_widget' => '<div class="widget widget2 %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h1>',
        'after_title'   => '</h1>',
    ) );
};
add_action( 'widgets_init', 'widgets_init' );


/* * * Menu; Pola z odnośnikami;
=======================================================================*/
function register_my_menus() {
    register_nav_menus( array(
        'header' => __( 'Nagłówek' ),
        'categories' => __( 'Kategorie' ),
    ));
};
add_action( 'init', 'register_my_menus' );


/* * * Załadowanie skryptów admina;
=======================================================================*/
require_once(TEMPLATEPATH.'/functions/admin-menu.php');

?>