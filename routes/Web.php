<?php

namespace Hasdemir\Route;

use Hasdemir\Base\Codes;

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

    $routes['Home'][Codes::MIDDLEWARE] = [];
    $routes['Home'][Codes::ROUTES] = [
      ['GET', '/', 'home'],
    ];

    $routes['AdminPanel'][Codes::MIDDLEWARE] = [];
    $routes['AdminPanel'][Codes::ROUTES] = [
      ['GET', '/admin', 'admin'],
    ];

    $routes['Route'][Codes::MIDDLEWARE] = ['TrailingSlashes'];
    $routes['Route'][Codes::ROUTES] = [
      ['GET', '/{uri1}/{uri2}/{uri3}/{uri4}', 'route'],
    ];
  }
}
