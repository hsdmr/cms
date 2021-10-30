<?php

namespace Hasdemir\Base;

class Route
{
    public static $hasRoute;
	public Request $request;

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

    public function run($routes)
    {
        if ($this->request->getPath() === '/') {
            echo 'Hello World';
            exit;
        }
        foreach ($routes as $route) {
            $method = $route[0];
            $uri = API_PREFIX . $route[1];
            $function = $route[2];
            $class = $route[3];
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
