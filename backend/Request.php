<?php namespace core;

class Request {
    private $_get;
    private $_post;
    private $_remoteAddress;
    private $_headersCollection;
    private $_cookiesCollection;
    
    public function __construct() {

        $this->_get = $_GET;
        $this->_post = $_POST;
        $this->_remoteAddress = $_SERVER['REMOTE_ADDR'];
        $this->_headersCollection = new HeadersCollection(getallheaders());
        $this->_cookiesCollection = new CookiesCollection($_COOKIE);

        // echo '<pre>';
        // print_r($this->_cookiesCollection);
        // exit;
    }

    public function __get($name) {
        switch ($name) {
            case 'get': return $this->_get;
            case 'post': return $this->_post;
            case 'remoteAddress': return $this->_remoteAddress;
            case 'headersCollection': return $this->_headersCollection;
            case 'cookiesCollection': return $this->_cookiesCollection;
            default: break;
        }
    }
}