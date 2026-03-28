<?php 

error_reporting(E_ALL); // Report all errors
ini_set('display_errors', '1'); // Display errors on screen
ini_set('display_startup_errors', '1'); // Display startup errors
ini_set('log_errors', '1'); // Log errors (optional, but good practice)

include_once(__DIR__.'\backend\Application.php');

use core\K420;
(new K420())->process();