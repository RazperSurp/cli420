<?php namespace core;

class Controller {
    public function render() {
        $root = $_SERVER['SCRIPT_NAME'] == '/cli420/index.php' ? '/cli420' : '';
        $file = $_SERVER['DOCUMENT_ROOT']. $root .'/frontend/'. K420::$request->router. '/'. K420::$request->view .'.php';

        if (is_file($file)) {
            require($file);
        } else K420::$response->setCode(404); 

        $this->_prepareResponse();
    }

    private function _prepareResponse() {
        if (K420::$response->getCode() === null) K420::$response->setCode(200);
    }
}
