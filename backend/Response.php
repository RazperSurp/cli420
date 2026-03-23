<?php namespace core;

class Response {
    private $_headers;
    
    public function __construct() {
    }

    public function setHeader($name, $value) {
        $this->_headers[] = new Header($name, $value);
    }
}