<?php /*   Template Name: Artykuł   */ ?>
<?php get_header(); ?>

<!-- === Lokalny nagłówek === -->
<section id="banner">
    <div>
        <nav id="local_menu">
            <span></span>
            <?php wp_nav_menu(array('theme_location'=> 'local_menu' ));?>
        </nav>
    </div>
</section>

<!-- === Artykuł === -->
<section id="section_article_single" class="floatfix">
    <?php if(have_posts()) : while(have_posts()) : the_post(); ?>
        <div class="article_img single_img">
            <?php if(has_post_thumbnail()) the_post_thumbnail('post-icon'); ?>
        </div>
        <article class="article_single">	
            <h1> <?php the_title(); ?> </h1>
            <div class="article_content"> <?php the_content();?> </div>
        </article>
    <?php endwhile; else: ?>
        <p> <?php _e('Przepraszamy, lecz nie ma obecnie żadnych postów do wyświetlenia.'); ?> </p>
    <?php endif; ?>
</section>

<?php get_footer(); ?>