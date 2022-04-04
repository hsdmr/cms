<?php

namespace Hasdemir\Base;

use Hasdemir\Base\Response;

class Rest
{
  protected array $header = [];
  protected ?array $body = null;
  protected ?string $link = null;

  public function __construct()
  {
    $GLOBALS[Codes::IS_ROUTE_CALLED] = true;
  }

  public function response($http_code)
  {
    $response = new Response();
    $response->emit($http_code, $this->header, $this->body ?? '');
  }
}
