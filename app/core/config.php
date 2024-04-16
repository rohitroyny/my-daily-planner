<?php

// Load environment variables from a file in development
if ($_SERVER['SERVER_NAME'] == 'localhost') {
    $env = parse_ini_file(APP_ROOT . '/.env');

    define('DBNAME', $env['DBNAME']);
    define('DBHOST', $env['DBHOST']);
    define('DBUSER', $env['DBUSER']);
    define('DBPASS', $env['DBPASS']);
    define('DBDRIVER', 'pdo_mysql'); // Assuming PDO MySQL driver

    define('ROOT', 'http://localhost:8888/'); // Adjust if your local server uses a different port
} else {
    // Production database config
    define('DBNAME', 'my_db');
    define('DBHOST', 'localhost');
    define('DBUSER', 'root');
    define('DBPASS', '');
    define('DBDRIVER', 'pdo_mysql');

    define('ROOT', 'https://www.yourwebsite.com');
}

define('APP_NAME', "My Website"); // Fixed a typo here
define('APP_DESC', "Best website on the planet");

/** true means show errors **/
define('DEBUG', true);

// Error reporting based on DEBUG flag
if (DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
}
