<?php

namespace Hasdemir\Base;

use Exception;
use Hasdemir\Exception\DefaultException;
use Throwable;

class App
{
	protected array $config;
    protected array $header = [];
	public Request $request;
	public Response $response;
	public Session $session;
	public Route $route;

	public function __construct()
	{
		$this->config = System::get('config');
		$this->request = new Request();
		$this->response = new Response();
		$this->session = new Session();
		$this->route = new Route($this->request);
	}

	public function run()
	{
		try {
			$this->request->checkUri();
			$this->route->run();
		} catch (DefaultException $e) {
			$this->header['Link'] = $_ENV['APP_URL'] . API_PREFIX . '/' . 'helper';
			return $this->response->error($e->http_code, $this->header, $e->status_code, $e->getMessage(), $e);
		} catch (Throwable $th) {
			$this->header['Link'] = $_ENV['APP_URL'];
			return $this->response->error(500, $this->header, 500, 'An unknown error has occured.', $th);
		} catch (Exception $e) {
			$this->header['Link'] = $_ENV['APP_URL'];
			return $this->response->error(500, $this->header, 500, 'An unknown error has occured.', $e);
		}
	}

}
