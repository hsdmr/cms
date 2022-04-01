<?php

namespace Hasdemir\Route;

use Hasdemir\Base\Codes;

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

    $routes['Auth'][Codes::MIDDLEWARE] = [];
    $routes['Auth'][Codes::ROUTES] = [
      ['POST', '/login', 'login'],
      ['GET', '/logout', 'logout'],
      ['GET', '/check', 'check'],
      ['POST', '/register', 'register'],
      ['POST', '/forget-password', 'password'],
    ];

    $routes['User'][Codes::MIDDLEWARE] = ['Auth'];
    $routes['User'][Codes::ROUTES] = [
      ['GET', '/user', 'search'],
      ['POST', '/user', 'create'],
      ['GET', '/user/{user_id}', 'read'],
      ['PUT', '/user/{user_id}', 'update'],
      ['DELETE', '/user/{user_id}', 'delete'],
    ];

    $routes['Post'][Codes::MIDDLEWARE] = ['Auth'];
    $routes['Post'][Codes::ROUTES] = [
      ['GET', '/post', 'search'],
      ['POST', '/post', 'create'],
      ['GET', '/post/{post_id}', 'read'],
      ['PUT', '/post/{post_id}', 'update'],
      ['DELETE', '/post/{post_id}', 'delete'],
    ];

    $routes['Category'][Codes::MIDDLEWARE] = ['Auth'];
    $routes['Category'][Codes::ROUTES] = [
      ['GET', '/category', 'search'],
      ['POST', '/category', 'create'],
      ['GET', '/category/{category_id}', 'read'],
      ['PUT', '/category/{category_id}', 'update'],
      ['DELETE', '/category/{category_id}', 'delete'],
    ];

    $routes['AutoLink'][Codes::MIDDLEWARE] = ['Auth'];
    $routes['AutoLink'][Codes::ROUTES] = [
      ['GET', '/auto-link', 'search'],
      ['POST', '/auto-link', 'create'],
      ['GET', '/auto-link/{link_id}', 'read'],
      ['PUT', '/auto-link/{link_id}', 'update'],
      ['DELETE', '/auto-link/{link_id}', 'delete'],
    ];

    $routes['Permalink'][Codes::MIDDLEWARE] = ['Auth'];
    $routes['Permalink'][Codes::ROUTES] = [
      ['GET', '/permalink', 'search'],
      ['POST', '/permalink', 'create'],
      ['GET', '/permalink/{permalink_id}', 'read'],
      ['PUT', '/permalink/{permalink_id}', 'update'],
      ['DELETE', '/permalink/{permalink_id}', 'delete'],
    ];

    $routes['Option'][Codes::MIDDLEWARE] = ['Auth'];
    $routes['Option'][Codes::ROUTES] = [
      ['GET', '/option', 'search'],
      ['POST', '/option', 'create'],
      ['GET', '/option/{option_id}', 'read'],
      ['PUT', '/option/{option_id}', 'update'],
      ['DELETE', '/option/{option_id}', 'delete'],
      ['GET', '/user/{user_id}/option', 'userSearch'],
      ['POST', '/user/{user_id}/option', 'userCreate'],
    ];
  }
}
