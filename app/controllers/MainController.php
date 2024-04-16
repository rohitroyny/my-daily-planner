<?php

namespace app\controllers;

use app\core\Controller;

class MainController extends Controller
{
    public function homepage()
    {
        // Correct the path to ensure the view is loaded properly
        $this->view('main/homepage'); // Simplifying the view loading method
    }

    public function notFound()
    {
        // Load a 404 not found page
        $this->view('main/notFound'); // Assuming there's a view for not found errors
    }
}
