<?php namespace core;

/**
 * Класс, предлагающий инструментарий для взаимодействия с пользователем.
 * 
 * Отвечает за логин пользователя, проверку _identity куки и пр.
 */
class User {
    public $record;

    public function __construct() {
        // if (K420::$app->request->cookiesCollection->has('_identity'));
    }

    private function _auth($record) {
        $this->record = $record;

        $this->record->last_in = time();
        $this->record->is_online = true;

        $this->record->update();
    }

    private function _logout() {
        $this->record->last_in = time();
        $this->record->is_online = false;
        
        $this->record->update();
    }
}   

?>