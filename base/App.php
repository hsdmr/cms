<?php

namespace Hasdemir\Base;

use Hasdemir\Exception\DefaultException;
use Throwable;

class App
{
	protected array $config;
    protected array $header = [];
	protected array $routes = [];
	public Request $request;
	public Route $route;
	const NAMESPACE = 'Hasdemir\\Rest\\';

	public function __construct()
	{
		$this->config = System::get('config');
		$this->request = new Request();
		$this->route = new Route($this->request);
	}

	public function add($class)
	{
		$class = $class . 'Api';
		if (!class_exists($class)) {
			$class = self::NAMESPACE . $class;
		}
		if (method_exists($class, 'getEndPoints')) {
			foreach (call_user_func([$class, 'getEndPoints']) as $route) {
				$route[] = $class;
				$this->routes[] = $route;
			}
		}
	}

	public function run()
	{
		try {
			$this->route->run($this->routes);
		} catch (DefaultException $e) {
			$this->header['Link'] = $_ENV['APP_URL'] . '/v1/helper/';
			return $this->response->error($e->http_code, $this->header, $e->status_code, $e->getMessage(), $e);
		} catch (Throwable $th) {
			$this->header['Link'] = $_ENV['APP_URL'];
			return $this->response->error(500, $this->header, 500, 'An unknown error has occured.', $th);
		}
	}

}
