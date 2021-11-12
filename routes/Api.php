<?php
namespace Hasdemir\Route;

class Api
{
    public static $routes = [];

    public static function getRoutes()
    {
        global $routes;
        self::addRoutes();
        return $routes;
    }

    public static function addRoutes()
    {
        global $routes;

        $routes['Auth'] = [
            ['POST', '/login', 'login'],
        ];

        $routes['User'] = [
            ['GET', '/user', 'search'],
            ['POST', '/user', 'create'],
            ['GET', '/user/{id}', 'read'],
            ['PUT', '/user/{id}', 'update'],
            ['DELETE', '/user/{id}', 'delete'],
        ];

        $routes['Post'] = [
            ['GET', '/post', 'search'],
            ['POST', '/post', 'create'],
            ['GET', '/post/{id}', 'read'],
            ['PUT', '/post/{id}', 'update'],
            ['DELETE', '/post/{id}', 'delete'],
        ];

        $routes['Category'] = [
            ['GET', '/category', 'search'],
            ['POST', '/category', 'create'],
            ['GET', '/category/{id}', 'read'],
            ['PUT', '/category/{id}', 'update'],
            ['DELETE', '/category/{id}', 'delete'],
        ];
    }
}