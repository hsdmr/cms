<?php

namespace Hasdemir\Middleware;

use Hasdemir\Base\Auth as BaseAuth;
use Hasdemir\Base\Middleware;

class Auth extends Middleware
{
  public function run($request)
  {
    BaseAuth::getInstance()->check();
  }
}
