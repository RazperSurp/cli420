<?php 
    use core\K420;


    K420::$user->authByCredentials(K420::$request->post['username'], K420::$request->post['password']);
?>