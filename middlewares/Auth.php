<?php

namespace Hasdemir\Middleware;

use Hasdemir\Base\Auth as BaseAuth;

class Auth
{
  public function run($request)
  {
    BaseAuth::check();
  }
}
