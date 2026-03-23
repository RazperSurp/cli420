<?php namespace core;

/**
 * Подготовка запросов или выполнение пресетных
 * 
 * @property string $_rawSql - текст plain-sql
 * @property resource $_params - знанчения полей для подготовленного запроса
 * @property resource $_resource - ресурс с ответом СУБД
 * @property array|RecordManager $_response - см. `core\RecordManager`
 * @property string $_tableName - название таблицы (только при Select)
 * 
 * @method getSql():string - геттер для `$this->_rawSql`
 * @method one():RecordManager - выполнение запроса в `$this->_rawSql` с `limit 1`
 * @method all():array - выполнение запроса в `$this->_rawSql` без `limit`
 * @method _execute():resource - выполнение `$this->_rawSql` в СУБД
 * @method _parse():array|ResourceManager - парс ресурса в `core\ResourceManager`
 */
class QueryBuilder {
    private $_rawSql;
    private $_params;
    private $_resource;
    private $_response;
    private $_tableName;

    public function __construct($sql, $params = []) {
        $this->_rawSql = $sql;
        $this->_params = $params;

        if (str_starts_with(strtolower($this->_rawSql), "select")) {
            $this->_isSelect = true;
            
            $tablePart = mb_substr($this->_rawSql, mb_stripos($this->_rawSql, 'from') + 5);
            if (!str_contains($tablePart, ' ')) $this->_tableName = $tablePart;
            else $this->_tableName = mb_substr($tablePart, 0, mb_stripos($tablePart, ' '));
        } else {
            $this->_dbg = true;
        }
    }

    public function getSql():string {
        return $this->_rawSql;
    }

    public function one():RecordManager {
        $this->_execute();

        return $this->_parse(true);
    }

    public function all():array {
        $this->_execute();

        return $this->_parse(false);
    }

    private function _execute() {
        if (count($this->_params)) {
            $this->_resource = pg_query_params(K420::$db::$connection, $this->_rawSql, $this->_params);
        } else $this->_resource = pg_query(K420::$db::$connection, $this->_rawSql);

        return $this->_resource;
    }

    private function _parse(bool $getOne = true): array|RecordManager {
        while ($row = pg_fetch_assoc($this->_resource)) {
            if ($getOne) $this->_response = new RecordManager($row, $row['id'], $this->_tableName);
            else $this->_response[] = new RecordManager($row, $row['id'], $this->_tableName);
        }
        
        return $this->_response;
    }
}

?>