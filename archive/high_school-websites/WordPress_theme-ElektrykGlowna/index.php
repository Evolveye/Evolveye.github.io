<?php get_header(); ?>

<!-- ====== Część właściwa ====== -->
<main>

    <!-- === Lokalny nagłówek === -->
    <section id="section_head">
    <nav id="local_menu"><?php wp_nav_menu(array('theme_location'=> 'local_menu' ));?></nav>
    <div id="slider">
        <figure>
            <div style="background-image: url('<?php echo $options['slider1']; ?>')"></div>
            <div style="background-image: url('<?php echo $options['slider2']; ?>')"></div>
            <div style="background-image: url('<?php echo $options['slider3']; ?>')"></div>
            <div style="background-image: url('<?php echo $options['slider4']; ?>')"></div>
            <div style="background-image: url('<?php echo $options['slider1']; ?>')"></div>
	</figure>
    </div>
    </section>

    <!-- === Treść strony === -->
    <section id="section_body" class="floatfix">
        <a id="school" href="http://zsp2.net/?page_id=98">
            <span>Zespół Szkół Ponadgimnazjalnych nr 2</span>
            <span> im. Bohaterskiej Załogi ORP „Orzeł" w Wejherowie</span>
        </a>

        <!-- Artykuły -->
        <section id="section_article">
            <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
            <article class="article_main">
                <a href="<?php the_permalink(); ?>">
                    <div class="article_img">
                        <?php if(has_post_thumbnail()) the_post_thumbnail('post-icon'); ?>
                    </div>
                </a>
                <a href="<?php the_permalink(); ?>">
                    <h1> <?php the_title(); ?> </h1>
                </a>
                <p class="meta">|| Napisano <?php the_time('j F Y') ?> </p>
                <div class="article_content">
                    <a href="<?php the_permalink();?>">		
                        <?php the_excerpt();?>
                    </a>
                </div>
            </article>
            <hr>
            <?php endwhile; else: ?>
                <h1 class="title">Nie znaleziono!</h1>
                <p>Przykro nam, ale szukasz czegoś, czego na tej stronie nie ma.</p>
            <?php endif; ?>
            <div id="nav_link">
                <?php posts_nav_link(' ','Poprzednia','Następna'); ?>
            </div>
        </section>
	
        <!-- Widgety -->
        <aside id="section_widget">
            <?php dynamic_sidebar( 'sidebar-1' ); ?>
        </aside>
    </section>
</main>

<?php get_footer(); ?>