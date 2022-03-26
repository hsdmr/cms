<?php

namespace Hasdemir\Base;

class Middleware
{
  public function __construct()
  {
    $GLOBALS[Codes::IS_MIDDLEWARE_CALLED] = true;
  }
}
