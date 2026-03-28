<?php namespace core;

/**
 * Класс, позволяющий осуществить подключение к БД.
 * 
 * Хранит в себе данные для входа, ресурс с подключением. Конструктор класса 
 * записывает в статическую переменную `self::$connection` ресурс с самим 
 * подключением к базе данных.
 * 
 * @property resource $connection - **static**, ресурс с подключением к СУБД
 * 
 * @method connect():bool - Формирование и вызов строки подключения к СУБД
 * @method query():QueryBuilder - Формирование экз. `core\QueryBuilder` по raw sql
 */
class Database { 
    public static $connection;

    private const CREDENTIALS = [
        "host" => "192.168.65.19",
        "port" => "5432",
        "user" => "prod",
        "password" => '148841'
    ];

    public function __construct() {
        self::connect();
    }

    static private function connect(): bool {
        if (!self::$connection) {
            self::$connection = pg_connect('host='. self::CREDENTIALS['host'] .' port='. self::CREDENTIALS['port'] .' dbname=text420 user='. self::CREDENTIALS['user'] .' password='. self::CREDENTIALS['password']);
            return true;
        } else return false;
    }

    public function query($sql, $params = []): QueryBuilder {
        return new QueryBuilder($sql, $params);
    }
}
