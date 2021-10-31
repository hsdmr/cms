<?php

namespace Hasdemir\Route;

class Web
{
    public static $routes = [];

    public static function getRouts()
    {
        global $routes;
        self::addRoutes();
        return $routes;
    }

    public static function addRoutes()
    {
        global $routes;

        $routes['Route'] = [
            ['GET', '/{uri1}/{uri2}/{uri3}/{uri4}', 'route'],
        ];
    }
}
