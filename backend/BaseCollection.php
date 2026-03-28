<?php namespace core;

abstract class BaseCollection {
    protected $_items = [];
    public $items = [];
    protected $_elementClass = "";

    /**
     * конструктор коллекции
     * @param array $items - **ассоциативный** массив (ключ - значение)
     */
    public function __construct(array $items = []) {
        foreach ($items as $name => $value) $this->add($name, $value) ;
    }

    public function add($name, $value) {
        $this->_items[$name] = new $this->_elementClass($name, $value);
        $this->items[$name] = $this->_items[$name];
        $this->$name = &$this->items[$name];
    }

    public function stringify() {
        $stringifiedItems = []; 
        foreach($this->_items as $item) $stringifiedItems[] = $item->stringify();

        return $stringifiedItems;
    }

    public function has($key) { return isset($this->items[$key]); }
}

