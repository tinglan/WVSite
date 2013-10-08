<?php
if ($_GET['randomId'] != "KLjO5Kg2IxIkHhumstCWn_XpjHmi9LgMgCM98Sbc4uasZ78sOdt2EgmcgJJoh5Wp") {
    echo "Access Denied";
    exit();
}

// display the HTML code:
echo stripslashes($_POST['wproPreviewHTML']);

?>  
