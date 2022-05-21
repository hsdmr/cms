<?php

namespace Hasdemir\Base;

use Hasdemir\Base\Response;
use Hasdemir\Exception\NotAllowedException;

class Controller
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

  public function checkPermission($permission)
  {
    if (!in_array($permission, Auth::User()['permissions'])) {
      throw new NotAllowedException("You do not have permission for this operation", Codes::key(Codes::ERROR_DONT_HAVE_PERMISSION));
    }
  }
}
