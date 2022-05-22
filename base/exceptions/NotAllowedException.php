<?php

namespace Hasdemir\Exception;

use Hasdemir\Base\DefaultException;

class NotAllowedException extends DefaultException
{
  public $http_code = 405;

  public function __construct(string $message, array $info = [], $previous = null)
  {
    parent::__construct($message, $info, $previous);
  }
}
