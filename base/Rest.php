<?php

namespace Hasdemir\Base;

use Hasdemir\Base\Response;
use Hasdemir\Base\Session;

class Rest
{
  protected array $header = [];
  protected ?array $body = null;
  protected ?string $link = null;
  public static $authenticatedUser;

  public function __construct()
  {
    $GLOBALS[Codes::IS_ROUTE_CALLED] = true;
    self::$authenticatedUser = Session::getInstance()->get('user.session');
  }

  public function response($http_code)
  {
    $response = new Response();
    $response->emit($http_code, $this->header, $this->body ?? '');
  }
}
