<?php

namespace app\models;
use app\core\Model;

class User
{
    use Model;

    protected $table = 'users';

    public function getAllUsers() {
        return $this->findAll();
    }

    // Method to save a new user to the database
    public function saveUser($username, $password, $email) {
        $sql = "INSERT INTO $this->table (username, password, email) VALUES (?, ?, ?)";
        return $this->query($sql, [$username, $password, $email]);
    }

    // Method to get a user by username, useful for login validation
    public function getUserByUsername($username) {
        $sql = "SELECT * FROM $this->table WHERE username = ?";
        $result = $this->query($sql, [$username]);
        return $result ? $result[0] : null; // Return the first user found or null if no user found
    }

    // Optionally, add methods to update and delete users if needed
    public function updateUser($id, $username, $email) {
        $sql = "UPDATE $this->table SET username = ?, email = ? WHERE id = ?";
        return $this->query($sql, [$username, $email, $id]);
    }

    public function deleteUser($id) {
        $sql = "DELETE FROM $this->table WHERE id = ?";
        return $this->query($sql, [$id]);
    }
}
<?php

namespace app\models;
use app\core\Model;

class User
{
    use Model;

    protected $table = 'users';

    public function getAllUsers() {
        return $this->findAll();
    }

    // Method to save a new user to the database
    public function saveUser($username, $password, $email) {
        $sql = "INSERT INTO $this->table (username, password, email) VALUES (?, ?, ?)";
        return $this->query($sql, [$username, $password, $email]);
    }

    // Method to get a user by username, useful for login validation
    public function getUserByUsername($username) {
        $sql = "SELECT * FROM $this->table WHERE username = ?";
        $result = $this->query($sql, [$username]);
        return $result ? $result[0] : null; // Return the first user found or null if no user found
    }

    // Optionally, add methods to update and delete users if needed
    public function updateUser($id, $username, $email) {
        $sql = "UPDATE $this->table SET username = ?, email = ? WHERE id = ?";
        return $this->query($sql, [$username, $email, $id]);
    }

    public function deleteUser($id) {
        $sql = "DELETE FROM $this->table WHERE id = ?";
        return $this->query($sql, [$id]);
    }
}
