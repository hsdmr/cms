<?php

namespace Hasdemir\Base;

use Hasdemir\Base\DefaultException;

class Request
{
  protected static string $dir;
  protected static string $base;

  public function __construct()
  {
    self::$dir = dirname($_SERVER['SCRIPT_NAME']);
    self::$base = basename($_SERVER['SCRIPT_NAME']);
    Log::request(self::uri(), self::method());
  }

  public static function uri()
  {
    return str_replace([self::$dir, self::$base], [null], $_SERVER['REQUEST_URI']);
  }

  public static function path()
  {
    return explode('?', self::uri())[0];
  }

  public static function method()
  {
    return strtoupper($_SERVER['REQUEST_METHOD']);
  }

  public static function body()
  {
    $body = [];
    if (self::method() === 'POST' || self::method() === 'PUT') {
      $body = file_get_contents('php://input');
    }
    return $body;
  }

  public static function params()
  {
    $params = [];
    if (self::method() === 'GET') {
      foreach ($_GET as $key => $value) {
        $params[$key] = filter_input(INPUT_GET, $key, FILTER_SANITIZE_SPECIAL_CHARS);
      }
    }
    if (self::method() === 'POST' || self::method() === 'PUT') {
      foreach ($_POST as $key => $value) {
        $params[$key] = filter_input(INPUT_POST, $key, FILTER_SANITIZE_SPECIAL_CHARS);
      }
    }
    return $params;
  }

  public static function isValid(): bool
  {
    return preg_match('@^([-a-z0-9%.=#?&//]*)$@', self::uri());
  }

  public static function checkUri()
  {
    if (!self::isValid()) {
      throw new DefaultException('Url does not valid', ['http_code' => 403]);
    }
  }
}
