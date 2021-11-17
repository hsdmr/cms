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

        $routes['Route']['middleware'] = [];
        $routes['Route']['routes'] = [
            ['GET', '/', 'home'],
            ['GET', '/{uri1}/{uri2}/{uri3}/{uri4}', 'route'],
        ];
    }
}
