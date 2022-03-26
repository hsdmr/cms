<?php

namespace Hasdemir\Base;

use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\NotImplementException;
use Hasdemir\Route\Api;
use Hasdemir\Route\Web;

class Route
{
  public static $hasRoute = false;
  public static $args_keys = [];
  public Request $request;

  public function __construct($request)
  {
    $this->request = $request;
  }

  public static function pattern($uri)
  {
    $patterns = [];
    self::$args_keys = [];

    foreach (explode('/', $uri) as $item) {
      if (str_contains($item, '{')) {
        $patterns[$item] = '([0-9a-z-]+)';
        self::$args_keys[] = trim($item, '{}');
      }
    }
    return $patterns;
  }

  public function run()
  {
    if ($this->isApi()) {
      $this->handle(Api::getRoutes(), Codes::NAMESPACE_API, API_PREFIX, 'Api');
    }

    if (!$this->isApi()) {
      $this->handle(Web::getRoutes(), Codes::NAMESPACE_CONTROLLER, '', 'Controller');
    }

    self::hasRoute();
  }

  public static function hasRoute()
  {
    if (self::$hasRoute === false) {
      throw new NotFoundException('Url does not exists');
    }
  }

  public function isApi(): bool
  {
    return '/' . explode('/', $this->request->path())[1] === API_PREFIX;
  }

  public function handle(array $routes = [], string $namespase = '', string $prefix = '', string $class_suffix = '')
  {
    foreach ($routes as $key => $value) {
      foreach ($value[Codes::ROUTES] as $route) {
        $class = $key . $class_suffix;
        if (!class_exists($class)) {
          $class = $namespase . $class;
        }
        $method = $route[0];
        $uri = $prefix . $route[1];
        $function = $route[2];
        $uri = str_replace(array_keys(self::pattern($uri)), array_values(self::pattern($uri)), $uri);

        if ((preg_match('@^' . $uri . '$@', $this->request->path(), $matches) || preg_match('@^' . $uri . '$@', $this->request->path() . '/', $matches)) && $method == $this->request->method()) {
          self::$hasRoute = true;
          foreach ($value[Codes::MIDDLEWARE] as $middleware) {
            if (!class_exists($middleware)) {
              $middleware = Codes::NAMESPACE_MIDDLEWARE . $middleware;
            }
            if (method_exists($middleware, 'run')) {
              call_user_func_array([new $middleware, 'run'], [$this->request]);
              if (!$GLOBALS[Codes::IS_MIDDLEWARE_CALLED]) {
                throw new NotImplementException('Called middle function not implemented');
              }
            }
          }

          if (method_exists($class, $function)) {
            call_user_func_array([new $class, $function], [$this->request, $this->prepareArgs($matches)]);
            if (!$GLOBALS[Codes::IS_ROUTE_CALLED]) {
              throw new NotImplementException('Called function not implemented');
            }
          }
          break;
        }
      }
    }
  }

  private function prepareArgs($args)
  {
    unset($args[0]);
    return array_combine(self::$args_keys, $args);
  }
}
