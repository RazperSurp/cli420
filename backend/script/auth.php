<?php require_once('autoload.php');
    use core\K420;

    echo '<pre>';
    print_r(K420::$request->post);


    K420::$user->_reg("jopa" , "228");
?>