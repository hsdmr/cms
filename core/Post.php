<?php

namespace Hasdemir\Core;

class Post extends Model
{
    private $conn;
    
    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function search()
    {
        echo 'Post search';
    }
    
    public function create()
    {
        echo 'Post create';
    }
    
    public function read()
    {
        echo 'Post read';
    }
    
    public function update()
    {
        echo 'Post update';
    }
    
    public function delete()
    {
        echo 'Post delete';
    }
}
