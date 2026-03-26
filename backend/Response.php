<?php namespace core;

class Response {
    private $_headersCollection;
    private $_code;
    
    public function __construct() {
        $this->_headersCollection = new HeadersCollection();
    }

    public function setHeader($name, $value) {
        $this->_headersCollection->add($name, $value);
    }

    public function setCode($code = 200) {
        $this->_code = $code;
    } 

    public function getCode() {
        return $this->_code;
    } 

    public function send() {
        http_response_code($this->_code);
        foreach ($this->_headersCollection->stringify() as $header) header($header);
    }
}