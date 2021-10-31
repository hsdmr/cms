<?php

namespace Hasdemir\Base;

use Hasdemir\Route\Api;
use Hasdemir\Route\Web;

class Route
{
    public static $hasRoute;
	public Request $request;
	const API_NAMESPACE = 'Hasdemir\\Rest\\';
	const CONTROLLER_NAMESPACE = 'Hasdemir\\Controller\\';

    public function __construct($request)
    {
		$this->request = $request;
    }

    public static function pattern($uri)
    {
        $patterns = [
            '{id}' => '([0-9]+)'
        ];

        foreach (explode('/', $uri) as $item) {
            if ($item != '{id}' && str_contains($item, '{')) {
                $patterns[$item] = '([0-9a-zA-Z]+)';
            }
        }
        return $patterns;
    }

    public function run()
    {
        if ($this->request->getPath() === '/') {
            echo 'Hello World';
            exit;
        }
        
        if ($this->isApi()) {
            foreach (Api::getRoutes() as $key => $value) {
                foreach ($value as $route) {
                    $class = $key . 'Api';
                    if (!class_exists($class)) {
                        $class = self::API_NAMESPACE . $class;
                    }
                    $method = $route[0];
                    $uri = API_PREFIX . '/' . $route[1];
                    $function = $route[2];
                    $uri = str_replace(array_keys(self::pattern($uri)), array_values(self::pattern($uri)), $uri);
                    
                    if (preg_match('@^/' . $uri . '$@', $this->request->getPath(), $args) && $method == $this->request->getMethod()) {
                        unset($args[0]);
                        self::$hasRoute = true;
                        if (method_exists($class, $function)) {
                            call_user_func_array([new $class, $function], [$this->request, array_values($args)]);
                        }
                        break;
                    }
                }
            }
        }

        if (!$this->isApi()) {
            $this->routes = Web::getRouts();
        }

        self::hasRoute();

    }

    public static function hasRoute()
    {
        if (self::$hasRoute === false) {
            die('Hatalı Url');
        }
    }

    public function isApi(): bool
    {
        return explode('/', $this->request->getPath())[1] === API_PREFIX;
    }

}
