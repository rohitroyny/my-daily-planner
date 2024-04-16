<?php

namespace app\core;

trait Model
{
    use Database;

    protected $table;

    // Constructor to define the table for each model that uses this trait
    public function __construct($table) {
        $this->table = $table;
    }

    // Generic method to find all records from a specific table
    public function findAll()
    {
        $query = "SELECT * FROM " . $this->table;
        return $this->query($query);
    }

    // Add a method to find a specific record by ID
    public function findById($id)
    {
        $query = "SELECT * FROM " . $this->table . " WHERE id = ?";
        return $this->query($query, [$id]);
    }
}
