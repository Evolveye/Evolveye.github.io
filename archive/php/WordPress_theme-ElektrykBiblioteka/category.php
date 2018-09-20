<?php get_header(); ?>
<main>


    <!-- === Lokalny nagłówek === -->
    <section id="section-head">
        <?php dynamic_sidebar( 'sidebar-1' ); ?>
        <div id="exlibris"></div>
    </section>


    <!-- === Lewa kolumna === -->
    <aside id="left_column">
        <?php wp_nav_menu( array( 'theme_location' => 'categories' ) ); ?>
        <?php dynamic_sidebar( 'sidebar-2' ); ?>
    </aside>


    <!-- === Treść strony === -->
    <section id="section-body">
        <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
            <a href="<?php the_permalink(); ?>">
                <article class="category-main">	
                    <h1><?php the_title(); ?></h1>
                    <p class="meta"><b><?php the_category(' / ') ?></b> || Data: <?php the_time('j F Y') ?></p>
                </article>
            </a>
        <?php endwhile; else: ?>
            <h1 class="title">Nie znaleziono!</h1>
            <p>Przykro nam, ale szukasz czegoś, czego tutaj nie ma.</p>
        <?php endif; ?>
        <div id="nav-link">
            <?php posts_nav_link('<div id="nav-link-separator"></div>','Poprzednia','Następna'); ?>
        </div>
    </section>
</main>
<?php get_footer(); ?>