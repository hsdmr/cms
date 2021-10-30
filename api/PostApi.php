<?php

namespace Hasdemir\Rest;

use Hasdemir\Core\Post as CorePost;
use Hasdemir\Exception\DefaultException;

class PostApi extends Base {

    public static $endPoints = [
        ['GET', 'post', 'search'],
        ['POST', 'post', 'create'],
        ['GET', 'post/{id}', 'read'],
        ['PUT', 'post/{id}', 'update'],
        ['DELETE', 'post/{id}', 'delete'],
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
        echo 'Post search';
    }
    
    public function create($request, $args)
    {
        echo 'Post create';
    }
    
    public function read($request, $args)
    {
        echo 'Post read ' . $args[0];
    }
    
    public function update($request, $args)
    {
        try {
            $_PUT = json_decode($request->getBody(), true);
            $response = [
                'id' => $_PUT['data']['id'],
                'sehir' => $_PUT['data']['title']
            ];
            $this->body = $response;
            return $this->response(200);
        } finally {
            
        }
    }
    
    public function delete($args)
    {
        echo 'Post delete ' . $args[0];
    }
}