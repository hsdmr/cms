<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Controller;

class RouteController extends Controller
{
  public function route($request, $args)
  {
    var_dump($args);
  }
}
