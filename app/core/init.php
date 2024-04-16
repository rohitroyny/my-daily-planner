<?php
define('APP_ROOT', dirname(__FILE__, 2)); // Adjust the level according to your directory structure

spl_autoload_register(function ($classname) {
    $filename = APP_ROOT . '/' . str_replace('\\', '/', $classname) . ".php";
    if (file_exists($filename)) {
        require $filename;
    } else {
        // Optionally handle the error related to file not found or log this event
        error_log("Failed to load class: " . $classname);
    }
});
