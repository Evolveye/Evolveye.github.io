<!-- ====== Stopka ====== -->
<footer>
    <?php dynamic_sidebar( 'sidebar-2' ); ?>
    <p class="copyright">© <?php $options = get_option('plugin_options'); echo $options['copyright']; ?></p>
    <p class="cookies">Korzystamy z plików cookies. 
        <a href="http://domenka.zsp2.net/ciasteczka-pliki-cookies/">Więcej informacji.</a>
    </p>
</footer>

<!-- - - -
=== Motyw wykonał: Paweł Stolarski
=============================================== -->
<?php wp_footer(); ?>
</body>
</html>