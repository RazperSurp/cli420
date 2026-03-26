<?php namespace core;

/**
 * Класс, предлагающий инструментарий для взаимодействия с пользователем.
 * 
 * Отвечает за логин пользователя, проверку _identity куки и пр.
 */
class User {
    public $record;

    public function __construct() { }
    // по паролю / по куки
    public function _reg($username, $password) {
        $token = md5("$username".microtime());
        K420::$db->query("insert into users (username , password , showname , auth_token) values ('$username' , '" . password_hash($password , PASSWORD_BCRYPT) ."' , '$username' ,  '$token')")->one();
        setCookie("_identity" , $token , time() + 1000*60*60*24*30);
    }

    private function _auth($record) {
        $this->record = $record;

        $this->record->last_in = time();
        $this->record->is_online = true;

        $this->record->update();
    }

    public function authByCredentials($username, $password) {
        echo '<pre>';
        $user = K420::$db->query("select * from users where username = '$username'")->one();
        if(password_verify( $password , $user->password )){
            print_r($user);
            $token = md5("$username".microtime());
            setCookie("_identity" , $token , time() + 1000*60*60*24*30);
            $user->auth_token = $token;
        } else K420::$response->setCode(401);
    }

    public function authByCookie($token){
        echo '<pre>';
        $user = K420::$db->query("select * from users where auth_token = '$token'")->one();
        if(isset($user)){
            print_r($user);
        }
    }

    private function _logout() {
        $this->record->last_in = time();
        $this->record->is_online = false;
        
        $this->record->update();
    }
}   

?>