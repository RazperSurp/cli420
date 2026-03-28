<?php namespace core;

class Request {
    private $_get;
    private $_post;
    private $_remoteAddress;
    private $_headersCollection;
    private $_cookiesCollection;


    private $_router;
    private $_view;

    public $isApi;
    public $controller;
    
    public function __construct() {
        $this->_get = &$_GET;
        $this->_post = &$_POST;
        $this->_remoteAddress = $_SERVER['REMOTE_ADDR'];
        $this->_headersCollection = new HeadersCollection(getallheaders());
        $this->_cookiesCollection = new CookiesCollection($_COOKIE);

        
        $this->_parseScriptPath($this->get['script']);
    }

    private function _parseScriptPath($script) {
        $path = explode('/', $script);

        $pathLength = count($path);
        if ($path[0] !== 'api') {
            switch ($pathLength) {
                case 0:
                    $this->_router = 'site';
                    $this->_view = 'index';
                    break;
                case 1:
                    $this->_router = 'site';
                    $this->_view = $path[0];
                    break;
                default:
                    $this->_router = $path[0];
                    $this->_view = $path[1];
                    break;
            }
        } else {
            $this->_isApi = true;
            $path = array_slice($path, 1, 2);

            switch ($pathLength) {
                case 0:
                    $this->_router = 'site';
                    $this->_view = 'index';
                    break;
                case 1:
                    $this->_router = 'site';
                    $this->_view = $path[0];
                    break;
                default:
                    $this->_router = $path[0];
                    $this->_view = $path[1];
                    break;
            }
        }

        unset($this->_get['script']);
    }

    public function __get($name) {
        switch ($name) {
            case 'get': return $this->_get;
            case 'post': return $this->_post;
            case 'router': return $this->_router;
            case 'view': return $this->_view;
            case 'remoteAddress': return $this->_remoteAddress;
            case 'headersCollection': return $this->_headersCollection;
            case 'cookiesCollection': return $this->_cookiesCollection;
            default: break;
        }
    }
}