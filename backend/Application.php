<?php namespace core;

require_once('Database.php');
require_once('QueryBuilder.php');
require_once('RecordManager.php');
require_once('BaseCollectionElement.php');
require_once('BaseCollection.php');
require_once('Cookie.php');
require_once('CookiesCollection.php');
require_once('Header.php');
require_once('HeadersCollection.php');
require_once('Request.php');
require_once('Response.php');
require_once('User.php');


/**
 * Ядро приложения, entry-point.
 * 
 * @property K420 $app - **static**, экземпляр приложения
 * @property Database $db - **static**, объект `core\Database`
 * @property User $user - **static**, объект `core\User`
 * @property Request $request - **static**, объект `core\Request`
 * @property Response $response - **static**, объект `core\Response`
 * @property string $version - **static**, версия приложения
 * @property string $name - **static**, название приложения
 */
class K420 {
    static public K420 $app;
    static public Database $db;
    static public User $user;
    static public Request $request;
    // static public Response $response;

    static public $version = '0.0.1';
    static public $name = 'text420';

    public function __construct() {
        self::$app = &$this;
        self::$db = new Database();
        self::$user = new User();

        self::$request = new Request();
        // self::$response = new Response();
    }
}
