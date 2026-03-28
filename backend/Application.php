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
require_once('Controller.php');
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
    static public Response $response;

    static public $version = '0.0.1';
    static public $name = 'text420';

    public $dbInstance;
    public $userInstance;
    public $requestInstance;
    public $responseInstance;

    public function __construct() {
        self::$app = &$this;
        self::$db = new Database();
        $this->dbInstance = &self::$db;
        self::$user = new User();
        $this->userInstance = &self::$user;

        self::$request = new Request();
        $this->requestInstance = &self::$request;
        self::$response = new Response();
        $this->responseInstance = &self::$response;
    }

    public function process() {
        if (K420::$request->cookiesCollection->has('_identity')){
            $this->userInstance->authByCookie(K420::$request->cookiesCollection['_identity']);
        } 
        // else $this-> authByCredentials($_POST['username'], $_POST['password']);


        if (!self::$request->isApi) {
            self::$request->controller = new Controller();
            self::$request->controller->render();
        }

        self::$response->send();
    }
}
