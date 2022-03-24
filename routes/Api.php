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

    $routes['Auth']['middleware'] = [];
    $routes['Auth']['routes'] = [
      ['POST', '/login', 'login'],
    ];

    $routes['User']['middleware'] = ['Auth'];
    $routes['User']['routes'] = [
      ['GET', '/user', 'search'],
      ['POST', '/user', 'create'],
      ['GET', '/user/{user_id}', 'read'],
      ['PUT', '/user/{user_id}', 'update'],
      ['DELETE', '/user/{user_id}', 'delete'],
    ];

    $routes['Post']['middleware'] = ['Auth'];
    $routes['Post']['routes'] = [
      ['GET', '/post', 'search'],
      ['POST', '/post', 'create'],
      ['GET', '/post/{post_id}', 'read'],
      ['PUT', '/post/{post_id}', 'update'],
      ['DELETE', '/post/{post_id}', 'delete'],
    ];

    $routes['Category']['middleware'] = ['Auth'];
    $routes['Category']['routes'] = [
      ['GET', '/category', 'search'],
      ['POST', '/category', 'create'],
      ['GET', '/category/{category_id}', 'read'],
      ['PUT', '/category/{category_id}', 'update'],
      ['DELETE', '/category/{category_id}', 'delete'],
    ];

    $routes['AutoLink']['middleware'] = ['Auth'];
    $routes['AutoLink']['routes'] = [
      ['GET', '/auto-link', 'search'],
      ['POST', '/auto-link', 'create'],
      ['GET', '/auto-link/{link_id}', 'read'],
      ['PUT', '/auto-link/{link_id}', 'update'],
      ['DELETE', '/auto-link/{link_id}', 'delete'],
    ];

    $routes['Permalink']['middleware'] = ['Auth'];
    $routes['Permalink']['routes'] = [
      ['GET', '/permalink', 'search'],
      ['POST', '/permalink', 'create'],
      ['GET', '/permalink/{permalink_id}', 'read'],
      ['PUT', '/permalink/{permalink_id}', 'update'],
      ['DELETE', '/permalink/{permalink_id}', 'delete'],
    ];

    $routes['Option']['middleware'] = ['Auth'];
    $routes['Option']['routes'] = [
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
