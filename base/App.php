<?php

namespace Hasdemir\Base;

use Exception;
use Hasdemir\Base\DefaultException;
use Hasdemir\Exception\NotFoundException;
use Hasdemir\Exception\NotImplementException;
use Hasdemir\Exception\StoragePdoException;
use Hasdemir\Exception\UnexpectedValueException;
use Throwable;

class App
{
  protected array $config;
  protected array $header = [];
  public Request $request;
  public Response $response;
  public Session $session;
  public Route $route;
  public $GLOBALS;

  public function __construct()
  {
    define('HTTP_OK', 200);
    define('HTTP_CREATED', 201);
    define('HTTP_NO_CONTENT', 204);
    $GLOBALS[Codes::IS_ROUTE_CALLED] = false;
    $GLOBALS[Codes::IS_MIDDLEWARE_CALLED] = false;
    $this->config = System::getConfig();
    $this->request = new Request();
    $this->response = new Response();
    $this->session = new Session();
    $this->route = new Route($this->request);
  }

  public function run()
  {
    try {
      $this->route->run();
    } catch (UnexpectedValueException $e) {
      $this->header['Link'] = $_ENV['APP_URL'] . API_PREFIX . '/helper/' . $e->link;
      return $this->response->error($e->http_code, $this->header, $e->getMessage(), $e, $e->getPrevious());
    } catch (NotFoundException $e) {
      $this->header['Link'] = $_ENV['APP_URL'] . API_PREFIX . '/helper';
      return $this->response->error($e->http_code, $this->header, $e->getMessage(), $e, $e->getPrevious());
    } catch (StoragePdoException $e) {
      $this->header['Link'] = $_ENV['APP_URL'] . API_PREFIX . '/helper/storage';
      return $this->response->error($e->http_code, $this->header, $e->getMessage(), $e, $e->getPrevious());
    } catch (NotImplementException $e) {
      $this->header['Link'] = $_ENV['APP_URL'] . API_PREFIX . '/helper';
      return $this->response->error($e->http_code, $this->header, $e->getMessage(), $e, $e->getPrevious());
    } catch (DefaultException $e) {
      $this->header['Link'] = $_ENV['APP_URL'] . API_PREFIX . '/helper';
      return $this->response->error($e->http_code, $this->header, $e->getMessage(), $e, $e->getPrevious());
    } catch (Throwable $th) {
      $this->header['Link'] = $_ENV['APP_URL'];
      return $this->response->error(500, $this->header, 'An unknown error has occured.', $th);
    } catch (Exception $e) {
      $this->header['Link'] = $_ENV['APP_URL'];
      return $this->response->error(500, $this->header, 'An unknown error has occured.', $e);
    }
  }
}
