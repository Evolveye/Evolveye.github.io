<?php

/* * * Informacje dla admina; Spoiler strony opcji;
=======================================================================*/
$adminInfo ='
<tr><th>Edycja kodu</th>
<td>
Edycja kodu jak najbardziej jest dozwolona. Jeśli zajdzie potrzeba lub chęć na zmiany w motywie szybko powinieneś zrozumieć jego kod, co pozwoli n a jego szybką modyfikację. Uprzednio zalecam zrobić kopię edytowanych plików.
</td>
</tr>

<tr><th>Popup</th>
<td>
Popup - czyli takie wyskakujące okienko - może okazać się przydatne. Najlepszy efekt uzyskasz używając gotowej grafiki.<br>
(Tekst to tylko tekst, a rzucające się na oczy okno, z tekstem chyba nigdzie nie wygląda profesjonalnie)<br>
<b style="color:red;">UWAGA:</b> Aby prawidłowo wyświetlić popup jako:
<br><b>"tekst"</b> musisz ten tekst wstawić w tzw div z języka HTML, gdzie w otwarciu umieścisz class="popup"
<br><b>"grafikę"</b> musisz napisać znacznik grafiki z języka HTML (img), gdzie w otwarciu umieścisz src="ścieżka/link_do_grafiki" alt="tekst_alternatywny"
</td>
</tr>

<tr><th>Slajdy</th>
<td>
Pokaz slajdów dalej zwany sliderem, to oczywiście przewijające się grafiki. Wspominam tutaj o nim, ponieważ często jest tak, ze ładowane grafiki nie są kompresowane pod strony internetowe. Pamiętaj - KOMPRESUJ GRAFIKI (możesz o tym poczytać w <a href="https://www.google.pl/search?q=kompresja+grafiki+na+strone&gws_rd=ssl">goglach</a>
</td>
</tr>

<tr><th>Pliki w motywie</th>
<td>
O ile wiadomo jak funkcjonuje szablon główny, nagłówka i stopki wraz ze stylami, o tyle może być trudniej zrozumieć pozostałą prozę.
<br><br><b>Funckje motywu</b> to podstawowy plik WordPressa z funckjami.
<br><br><b>admin-menu</b> posiada w sobie kod strony na której właśnie się znajdujesz. Folder functions w którym się on znajduje powstał abyś w przyszłości właśnie tam dodawał kolejne pliki z funkcjami (Pamiętaj aby go dodać w zwykłych funkcjach).
<br><br><b>Pojedynczy wpis oraz szablon artykułów</b> to jak nazwy wskazują - szablony odpowiadające za wygląd 1 wpisu. Dlaczego istnieją dwa szablony? Ponieważ "Szablon strony Artykuł" jest używany podczas dodawania stron.
</td>
</tr>
';

/* * * Tworzenie strony z opcjami motywu;
=======================================================================*/
function create_theme_options_page() {
    add_menu_page('Opcje admina', 'Opcje admina', 'administrator', __FILE__, 'build_options_page');
}
add_action('admin_menu', 'create_theme_options_page');

function build_options_page() { ?>
<div id="theme-options-wrap">
    <h1>Opcje motywu Elektryka</h1>
    <button id="spoiler_button" class="button">Informacje</button>
    <div id="spoiler" class="notice" style="display:none;">
        <h2>Witaj adminie!</h2>
        <p>Informacje tutaj zawarte, mogą okazać się przydatne podczas edytowania motywu.</p>
        <hr>
        <table class="form-table">
            <?php global $adminInfo; echo $adminInfo ?>
        </table>      
    </div>
    <br><br>
    <hr>
    <form method="post" action="options.php" enctype="multipart/form-data">
        <?php settings_fields('plugin_options'); ?>
        <?php do_settings_sections(__FILE__); ?>

	<p class="submit">
	<input name="Submit" type="submit" class="button-primary" value="<?php esc_attr_e('Save Changes'); ?>" />
	</p>
    </form>
</div>
<script>
    let spoilerB = document.getElementById("spoiler_button");
    let spoiler = document.getElementById("spoiler");
    spoilerB.onclick = function(){
        if( spoiler.style.display == "none") spoiler.style.display = "block";
        else spoiler.style.display = "none";
    }
</script>
<?php }


/* * * Rejestrowanie opcji;
=======================================================================*/
function register_and_build_fields() {

    /* * *|   Rejestracja sekcji   |* * */
    add_settings_section('main_section', '<br>Elementy podstawowe:', 'section_cb', __FILE__);
    add_settings_section('slider_section', '<br>Pokaz slajdów w nagłówku:', 'section_cb', __FILE__);

    /* * *|   Rejestracja opcji   |* * */
        //*| Okno informacyjne; Popup;
        add_settings_field('info_box_s', 'Popup:', 'popup_setting', __FILE__, 'main_section');

        //*| Informacja copyright;
        add_settings_field('copyright', 'Copyright:', 'copyright_setting', __FILE__, 'main_section');

        //*| Slajdy
        add_settings_field('slider', '', 'slider_setting', __FILE__, 'slider_section');

    register_setting('plugin_options', 'plugin_options', 'validate_setting');
}
add_action('admin_init', 'register_and_build_fields');
$options = get_option('plugin_options');


/* * * Ładowanie opcji;
=======================================================================*/
    //*| Popup;
    function popup_setting() { global $options;
        echo '<input type="checkbox" name="plugin_options[info_box_s]" value="true"';
                if( $options['info_box_s'] ){ echo 'checked="checked"'; };
        echo '/> <span>Jeżeli jesteś tu 1 raz - przeczytaj pole "popup" w infomacjach powyżej</span><br><br>
                <textarea name="plugin_options[info_box]" rows="5" cols="100">'.$options['info_box'].'</textarea>
        ';
    }

    //*| Copyright
    function copyright_setting() { global $options;
        echo "<input name='plugin_options[copyright]' type='text' size='100' maxlength='40'
              value='{$options['copyright']}' />";
    }

    //*| Slider
    function slider_setting() { global $options;
        echo '<input type="file" name="slider1" />
              <br><img src="'.$options['slider1'].'" style="max-height:200px;">
              <hr>
              <input type="file" name="slider2" />
              <br><img src="'.$options['slider2'].'" style="max-height:200px;">
              <hr>
              <input type="file" name="slider3" />
              <br><img src="'.$options['slider3'].'" style="max-height:200px;">
              <hr>
              <input type="file" name="slider4" />
              <br><img src="'.$options['slider4'].'" style="max-height:200px;">
        ';
    }


/* * * Walidacja;
=======================================================================*/
function section_cb() {}
function validate_setting($plugin_options) {
    $keys = array_keys($_FILES); $i = 0; foreach ( $_FILES as $image ) {
        // Pobrany plik
        if ($image['size']) {
            // Jeżeli plik jest grafiką
            if ( preg_match('/(jpg|jpeg|png|gif)$/', $image['type']) ) {
                $override = array('test_form' => false);
                // Zapisanie
                $file = wp_handle_upload( $image, $override );
                $plugin_options[$keys[$i]] = $file['url'];
            } else {
            // Jeżeli nie jest grafiką
                $options = get_option('plugin_options');
                $plugin_options[$keys[$i]] = $options[$slider1];
                // Informacja o złym pliku
                wp_die('No image was uploaded.');
            }
        } else {
            // Jeżeli nic nie pobrano
            $options = get_option('plugin_options');
            $plugin_options[$keys[$i]] = $options[$keys[$i]];
        }
        $i++;
    }
    return $plugin_options;
}

?>