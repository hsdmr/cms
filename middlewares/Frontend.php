<?php

namespace Hasdemir\Middleware;

use Hasdemir\Base\Auth;
use Hasdemir\Base\Middleware;

class Frontend extends Middleware
{
  public function run($request)
  {
    //Auth::getInstance()->check();
  }
}
