<?php

namespace app\controllers;

use app\core\Controller;
use app\models\User;

class UserController extends Controller
{
    public function getUsers()
    {
        $userModel = new User();
        header("Content-Type: application/json");
        $users = $userModel->getAllUsers();
        echo json_encode($users);
        exit();
    }

    public function saveUser() {
        // Assuming a method to save user from registration form
        $userModel = new User();
        $username = $_POST['username'];
        $password = $_POST['password']; // Remember to hash this before saving
        $email = $_POST['email'];

        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $userModel->saveUser($username, $hashed_password, $email);

        // Redirect to login page or somewhere appropriate after registration
        header('Location: /login');
    }

    public function viewUsers() {
        // Load a view that lists all users
        $this->view('user/list');
    }

    // Adding login functionality
    public function loginUser() {
        $userModel = new User();
        $username = $_POST['username'];
        $password = $_POST['password'];

        $user = $userModel->getUserByUsername($username);
        if ($user && password_verify($password, $user['password'])) {
            // Assuming session start has been handled in a core component
            $_SESSION['user_id'] = $user['id'];
            header('Location: /dashboard'); // Redirect to a dashboard after login
        } else {
            header('Location: /login?error=invalid_credentials'); // Redirect back with an error
        }
    }
}
