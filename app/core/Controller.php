<?php

namespace app\core;

class Controller
{
    // Method to render views. Path should be relative to the views directory.
    public function view($path, $includeBundle = false)
    {
        $fullPath = __DIR__ . '/../views/' . $path . '.php'; // Assumes views are in the 'views' folder relative to this script
        if (file_exists($fullPath)) {
            if ($includeBundle) {
                echo vite('main.js'); // Ensure you have defined what `vite()` does or replace it with appropriate logic
            }
            include $fullPath;
        } else {
            // Optional: handle not found views more gracefully
            include __DIR__ . '/../views/error/notFound.php';
        }
    }
}
