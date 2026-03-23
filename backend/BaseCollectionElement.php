<?php namespace core;

abstract class BaseCollectionElement {
    protected $name;
    protected $value;

    public function __construct($name, $value) {
        $this->name = $name;
        $this->value = $value;
    }

    public function getValue() {
        return is_array($this->value) ? implode('; ', $this->value) : $this->value;
    }

    public function setValue($value) {
        $this->value = $value;
    }

    public function getName() {
        return $this->name;
    }

    public function stringify() {
        return "{$this->name}: {$this->getValue()}";
    }
}