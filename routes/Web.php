<?php

namespace Hasdemir\Route;

class Web
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

        $routes['Home']['middleware'] = [];
        $routes['Home']['routes'] = [
            ['GET', '/', 'home'],
        ];

        $routes['Panel']['middleware'] = [];
        $routes['Panel']['routes'] = [
            ['GET', '/admin', 'admin'],
            ['GET', '/commerce', 'commerce'],
            ['GET', '/auth', 'auth'],
            ['GET', '/tutor', 'tutor'],
        ];

        $routes['Route']['middleware'] = ['TrailingSlashes'];
        $routes['Route']['routes'] = [
            ['GET', '/{uri1}/{uri2}/{uri3}/{uri4}', 'route'],
        ];
    }
}
