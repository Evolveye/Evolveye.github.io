<?php get_header(); ?>

<!-- ====== Część właściwa ====== -->
<main>

    <!-- === Logo === -->
    <div id="section-logo"><a href="http://samorzad.zsp2.net"><div id="logosu"></div></a></div>
    <div id="number-of-happyness">
        <div class="widget">
            <h1>Szczęśliwy numerek na dziś</h1>
            <span>
                <?php $happy_num = get_option('happy_num', 'ZSP2'); echo $happy_num; ?>
            </span>
        </div>
    </div>

    <!-- === Artykuły === -->
    <section id="section-article">
        <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <article class="<?php foreach((get_the_category()) as $category) {echo $category->cat_name . ' ';}?>">
            <p class="meta">|| Data: <?php the_time('j F Y') ?></p>
            <a href="<?php the_permalink(); ?>"><h1><?php the_title(); ?></h1></a>
            <div class="article-content">		
                <?php the_content();?>
            </div>
        </article>
        <?php endwhile; else: ?>
            <p><?php _e('Przepraszamy, lecz nie ma obecnie żadnych postów do wyświetlenia.'); ?></p>
        <?php endif; ?>
        <div id="nav-link">
            <?php posts_nav_link(' ','Poprzednia','Następna'); ?>
        </div>
    </section>
	
     <!-- === Widgety === -->
    <aside class="section-widget">
        <?php dynamic_sidebar( 'sidebar-1' ); ?>
        <button id="archiwe_button" onclick="archShow()">Pokaż/ukryj niebieżące wpisy</button>
        <script>
            let archiwe = document.getElementsByClassName("Archiwum");
            let show = "none"
            function archShow(){
                if(show == "none") show = "block";
                else show = "none";

                for(let i of archiwe){
                    i.style.display = show;
                };
            };
        </script>
    </aside>
</main>
<?php get_footer(); ?>