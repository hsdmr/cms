<?php

namespace Hasdemir\Base;

abstract class Middleware
{
  public function __construct()
  {
    $GLOBALS[Codes::IS_MIDDLEWARE_CALLED] = true;
  }

  abstract public function run($request);
}
