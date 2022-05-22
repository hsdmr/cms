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
      ['GET', '/user/constants', 'constants'],
      ['GET', '/user', 'search'],
      ['POST', '/user', 'create'],
      ['GET', '/user/{user_id}', 'read'],
      ['PUT', '/user/{user_id}', 'update'],
      ['PATCH', '/user/{user_id}', 'restore'],
      ['DELETE', '/user/{user_id}', 'delete'],
      ['DELETE', '/user/{user_id}/permanent', 'permanentDelete'],
    ];

    $routes['Post'][Codes::MIDDLEWARE] = ['Auth'];
    $routes['Post'][Codes::ROUTES] = [
      ['GET', '/post/constants', 'constants'],
      ['GET', '/post', 'search'],
      ['POST', '/post', 'create'],
      ['GET', '/post/{post_id}', 'read'],
      ['PUT', '/post/{post_id}', 'update'],
      ['DELETE', '/post/{post_id}', 'delete'],
    ];

    $routes['Category'][Codes::MIDDLEWARE] = ['Auth'];
    $routes['Category'][Codes::ROUTES] = [
      ['GET', '/category/constants', 'constants'],
      ['GET', '/category', 'search'],
      ['POST', '/category', 'create'],
      ['GET', '/category/{category_id}', 'read'],
      ['PUT', '/category/{category_id}', 'update'],
      ['DELETE', '/category/{category_id}', 'delete'],
    ];

    $routes['Layout'][Codes::MIDDLEWARE] = ['Auth'];
    $routes['Layout'][Codes::ROUTES] = [
      ['GET', '/layout/constants', 'constants'],
      ['GET', '/layout', 'search'],
      ['POST', '/layout', 'create'],
      ['GET', '/layout/{layout_id}', 'read'],
      ['PUT', '/layout/{layout_id}', 'update'],
      ['PATCH', '/layout/{layout_id}', 'restore'],
      ['DELETE', '/layout/{layout_id}', 'delete'],
    ];

    $routes['Role'][Codes::MIDDLEWARE] = ['Auth'];
    $routes['Role'][Codes::ROUTES] = [
      ['GET', '/role', 'search'],
      ['POST', '/role', 'create'],
      ['GET', '/role/{role_id}', 'read'],
      ['PUT', '/role/{role_id}', 'update'],
      ['DELETE', '/role/{role_id}', 'delete'],
    ];

    $routes['AutoLink'][Codes::MIDDLEWARE] = ['Auth'];
    $routes['AutoLink'][Codes::ROUTES] = [
      ['GET', '/auto-link', 'search'],
      ['POST', '/auto-link', 'create'],
      ['GET', '/auto-link/{link_id}', 'read'],
      ['PUT', '/auto-link/{link_id}', 'update'],
      ['DELETE', '/auto-link/{link_id}', 'delete'],
    ];

    $routes['Slug'][Codes::MIDDLEWARE] = ['Auth'];
    $routes['Slug'][Codes::ROUTES] = [
      ['GET', '/slug', 'search'],
      ['POST', '/slug', 'create'],
      ['GET', '/slug/{slug_id}', 'read'],
      ['PUT', '/slug/{slug_id}', 'update'],
      ['DELETE', '/slug/{slug_id}', 'delete'],
    ];

    $routes['Option'][Codes::MIDDLEWARE] = ['Auth'];
    $routes['Option'][Codes::ROUTES] = [
      ['GET', '/option', 'search'],
      ['POST', '/option', 'create'],
      ['DELETE', '/option', 'delete'],
    ];
  }
}
