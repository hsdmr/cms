<?php

namespace Hasdemir\Rest;

class CategoryApi extends Base {

    public static $endPoints = [
        ['GET', 'v1/category', 'search'],
        ['POST', 'v1/category', 'create'],
        ['GET', 'v1/category/{id}', 'read'],
        ['PUT', 'v1/category/{id}', 'update'],
        ['DELETE', 'v1/category/{id}', 'delete'],
    ];

    public function __construct()
    {
        
    }

    public static function getEndPoints()
    {
        return self::$endPoints;
    }
    
    public function search($request, $args)
    {
        echo 'Category search';
    }
    
    public function create($request, $args)
    {
        echo 'Category create';
    }
    
    public function read($request, $args)
    {
        echo 'Category read ' . $args[0];
    }
    
    public function update($request, $args)
    {
        echo 'Category update ' . $args[0];
    }
    
    public function delete($request, $args)
    {
        echo 'Category delete ' . $args[0];
    }
}