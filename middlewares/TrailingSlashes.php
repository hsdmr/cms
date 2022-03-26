<?php

namespace Hasdemir\Middleware;

use Hasdemir\Base\Middleware;
use Hasdemir\Base\Request;

class TrailingSlashes extends Middleware
{
  public function run($request)
  {
    if (!preg_match('/.+\/$/', $request->uri())) {
      $base_url = $_ENV['APP_URL'];
      header('Location: ' . $base_url . $request->uri() . '/');
      die();
    }
  }
}
