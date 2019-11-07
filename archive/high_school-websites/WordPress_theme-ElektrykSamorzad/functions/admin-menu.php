<?php
add_action('admin_menu', 'awesome_page_create');
function awesome_page_create() {
    $page_title = 'Opcje motywu';
    $menu_title = 'Opcje motywu';
    $capability = 'edit_posts';
    $menu_slug = 'options_page';
    $function = 'my_awesome_page_display';
    $icon_url = '';
    $position = 24;

    add_menu_page( $page_title, $menu_title, $capability, $menu_slug, $function, $icon_url, $position );
}

function my_awesome_page_display() {
if (isset($_POST['happy_num'])) { update_option('happy_num', $_POST['happy_num']); $value = $_POST['happy_num'];}

$happy_num  =  get_option('happy_num', '0');

echo '
    <style>label {width:200px; display: inline-block;}</style>
    <h1>Opcje redaktorów</h1>
    <div>
        <p>
           <b>Informacja:</b>
           Pamiętaj, aby ukrywać starsze (mało bieżące) wpisy, poprzez ich edycję i dodanie kategorii "archiwum".
        </p>
        <p>
           Zaleca się nie podpisywać się w zakończeniu wpisu. Wychodzą one od samorządu, nie od osoby.
        </p>
    </div>
    <br><br>
    <form method="POST">
	<label for="happy_num">Szczęśliwy numerek</label>
	<input type="text" name="happy_num" id="happy_num" value="'.$happy_num.'">
	<input type="submit" value="Zapisz" class="button button-primary">
    </form>
';
}
?>