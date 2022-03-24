<?php

namespace Hasdemir\Exception;

use Hasdemir\Base\DefaultException;

class UnexpectedValueException extends DefaultException
{
  public $http_code = 406;

  public function __construct(string $message, array $info = [], $previous = null)
  {
    parent::__construct($message, $info, $previous);
  }
}
