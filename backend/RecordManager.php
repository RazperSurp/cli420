<?php namespace core;

/**
 * Объектное представление кортежа из результата запроса в СУБД.
 * 
 * Класс представляет собой инструментарий, позволяющий взаимодействовать со строками результата запроса 
 * в объектно-ориентированном стиле. При создании нового экземпляра класса, с помощью сеттера создаются
 * свойства, хранящие в себе ссылку на ключи ассоциативного массива `$this->attributes`, позволяющие получать 
 * значения полей кортежа напрямую, без вызова этого свойства. Изменение значений свойств автоматически
 * отражается на значениях соответствующих ключей в массиве аттрибутов.
 * 
 * @property ?int $_id - код кортежа (pk)
 * @property ?string $_tableName - название таблицы, из которой получены данные
 * @property array $_oldAttributes - данные кортежа, защищенные от изменений
 * @property array $attributes - данные кортежа, доступные для изменений
 * 
 * @method 
 */
class RecordManager {
    private $_id;
    private $_tableName;
    private $_oldAttributes;
    public $attributes;

    public function __construct($resultRow, $id = null, $table = null) {
        $this->_id = $id;
        $this->_tableName = $table;
        $this->_oldAttributes = $resultRow;

        foreach ($this->_oldAttributes as $key => $value) $this->$key = $value;
    }

    public function __set($name, $value) {
        if (array_key_exists($name, $this->_oldAttributes)) {
            if ($name !== 'id') {
                $this->attributes[$name] = $value;
                $this->$name = &$this->attributes[$name];

                return $value;
            } else return false;
        } else return false;
    }

    /**
     * Обновление данных кортежа в таблице с помощью вызова SQL-инструкции *UPDATE*,
     * опираясь на название таблицы в `$this->_tableName` и значение `$this->_id`.
     * 
     * Метод перебирает защищённое свойство `$this->_oldAttributes` чтобы исключить внесение изменений 
     * в несуществующие поля таблицы, использует ключи массива для получения измененных  значений 
     * в массиве `$this->attributes`. Формирует SQL-запрос и выполняет его. **Возвращает false**, 
     * если запрос не `$this->_id === null`.
     * 
     * @return false|RecordManager
     */
    public function update(): false|RecordManager {
        $sql = "UPDATE \"{$this->_tableName}\" SET";
        $newValues = [];

        if (!isset($this->_id)) return false;
        else {
            foreach ($this->_oldAttributes as $key => $value) $newValues[] = " \"{$key}\" = '{$this->attributes[$key]}'";
            $sql .= implode(",", $newValues) ." WHERE \"id\" = '{$this->_id}'";
        }

        return (new QueryBuilder($sql))->one();
    }
}