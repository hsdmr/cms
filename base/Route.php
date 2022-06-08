<?php

namespace Hasdemir\Base;

use Hasdemir\Exception\ForbiddenException;
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
        $patterns[$item] = '([0-9A-Za-z-]+)';
        self::$args_keys[] = trim($item, '{}');
      }
    }
    return $patterns;
  }

  public function run()
  {
    if ($this->request->method() === 'OPTIONS') {
      Response::emit(HTTP_NO_CONTENT, [], '');
      die;
    }

    if (!$this->request->isValid()) {
      if ($this->isApi()) {
        throw new ForbiddenException('Url does not valid', Codes::key(Codes::ERROR_URL_NOT_VALID));
      } else {
        self::redirect($_ENV['APP_URL'] . '/403');
      }
    }

    if ($this->isApi()) {
      $this->handle(Api::getRoutes(), Codes::NAMESPACE_CONTROLLER, API_PREFIX);
    }

    if (!$this->isApi()) {
      $this->handle(Web::getRoutes(), Codes::NAMESPACE_CONTROLLER, '');
    }

    self::hasRoute($this->isApi());
  }

  public static function hasRoute($is_api)
  {
    if (self::$hasRoute === false) {
      if ($is_api) {
        throw new NotFoundException('Url does not exists', Codes::key(Codes::ERROR_GENERIC_NOT_FOUND, ['generic' => 'Url']));
      } else {
        self::redirect($_ENV['APP_URL'] . '/404');
      }
    }
  }

  public function isApi(): bool
  {
    $exploded = explode('/', $this->request->path());
    if (isset($exploded[1])) {
      return '/' . explode('/', $this->request->path())[1] === API_PREFIX;
    }
    return false;
  }

  public function handle(array $routes = [], string $namespase = '', string $prefix = '', string $class_suffix = 'Controller')
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
            }
            if (!$GLOBALS[Codes::IS_MIDDLEWARE_CALLED] && $this->isApi()) {
              throw new NotImplementException('Called middle function not implemented', Codes::key(Codes::ERROR_CALLED_MIDDLE_FUNCTION_NOT_IMPLEMENTED));
            }
          }

          if (method_exists($class, $function)) {
            call_user_func_array([new $class, $function], [$this->request, $this->prepareArgs($matches)]);
          }
          if (!$GLOBALS[Codes::IS_ROUTE_CALLED] && $this->isApi()) {
            throw new NotImplementException('Called function not implemented', Codes::key(Codes::ERROR_CALLED_FUNCTION_NOT_IMPLEMENTED));
          }
          if (!$GLOBALS[Codes::IS_ROUTE_CALLED] && !$this->isApi()) {
            return view('404.php');
          }
          break 2;
        }
      }
    }
  }

  public static function redirect($url)
  {
    header('Location: ' . $url);
    die();
  }

  private function prepareArgs($args)
  {
    unset($args[0]);
    return array_combine(self::$args_keys, $args);
  }
}
