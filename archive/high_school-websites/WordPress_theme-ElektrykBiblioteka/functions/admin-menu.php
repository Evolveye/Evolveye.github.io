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
if (isset($_POST['mainPost'])) { update_option('mainPost', $_POST['mainPost']); $value = $_POST['mainPost'];}

$mainPost =  get_option('mainPost', '0');

echo '
    <style>label {width:200px; display: inline-block;}</style>
    <h1>Opcje motywu</h1>
    <br>
    <form method="POST">
	<h3>Post powitalny <input type="submit" value="Zapisz" class="button-primary"> </h3>
        <span>Aby tekst w poście przeszedł do następnej linii, wpisz &lt;br&gt;
	<br>
        <textarea name="mainPost" rows="5" cols="100">'.$mainPost.'</textarea>
    </form>
';
}
?>