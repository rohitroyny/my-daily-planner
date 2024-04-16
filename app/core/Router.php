<?php

namespace app\core;

class Router
{
    public $routeList;

    function __construct($routes)
    {
        $this->routeList = $routes;
    }

    public function serveRoute() {
        $uri = trim($_SERVER['REQUEST_URI'], '/');
        $uriParts = explode('/', $uri);
        $path = $uriParts[0] ?? '';
        $method = $_SERVER['REQUEST_METHOD'];

        if (!empty($path) && isset($this->routeList[$path])) {
            $route = $this->routeList[$path];
            if (isset($route[$method])) {
                $controllerName = $route[$method]['controller'];
                $actionName = $route[$method]['action'];
                $controller = new $controllerName();
                if (method_exists($controller, $actionName)) {
                    $controller->$actionName();
                } else {
                    // Method not found in controller
                    $this->handleNotFound();
                }
            } else {
                // Method not allowed
                $this->handleNotAllowed();
            }
        } else {
            // Path not found
            $this->handleNotFound();
        }
    }

    private function handleNotFound() {
        $controller = new MainController();
        $controller->notFound();
    }

    private function handleNotAllowed() {
        // You might want to create a method that specifically handles 405 errors
        header("HTTP/1.1 405 Method Not Allowed");
        exit;
    }
}
