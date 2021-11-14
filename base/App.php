<?php

namespace Hasdemir\Base;

use Exception;
use Hasdemir\Base\DefaultException;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\StoragePdoException;
use Hasdemir\Exception\UnexpectedValueException;
use Throwable;

class App
{
	protected array $config;
    protected array $header = [];
	public Request $request;
	public Session $session;
	public Route $route;

	public function __construct()
	{
		$this->config = System::get('config');
		$this->request = new Request();
		$this->session = new Session();
		$this->route = new Route($this->request);
	}

	public function run()
	{
		try {
			$this->request->checkUri();
			$this->route->run();
		} catch (UnexpectedValueException $e) {
			$this->header['Link'] = $_ENV['APP_URL'] . API_PREFIX . '/helper/' . $e->link;
			return Response::error($e->http_code, $this->header, $e->getMessage(), $e, $e->getPrevious());
		} catch (NotFoundException $e) {
			$this->header['Link'] = $_ENV['APP_URL'] . API_PREFIX . '/helper';
			return Response::error($e->http_code, $this->header, $e->getMessage(), $e, $e->getPrevious());
		} catch (StoragePdoException $e) {
			$this->header['Link'] = $_ENV['APP_URL'] . API_PREFIX . '/helper/storage';
			return Response::error($e->http_code, $this->header, $e->getMessage(), $e, $e->getPrevious());
		} catch (DefaultException $e) {
			$this->header['Link'] = $_ENV['APP_URL'] . API_PREFIX . '/helper';
			return Response::error($e->http_code, $this->header, $e->getMessage(), $e, $e->getPrevious());
		} catch (Throwable $th) {
			$this->header['Link'] = $_ENV['APP_URL'];
			return Response::error(500, $this->header, 'An unknown error has occured.', $th);
		} catch (Exception $e) {
			$this->header['Link'] = $_ENV['APP_URL'];
			return Response::error(500, $this->header, 'An unknown error has occured.', $e);
		}
	}

}
