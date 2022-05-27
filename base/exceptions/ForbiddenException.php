<?php

namespace Hasdemir\Exception;

use Hasdemir\Base\DefaultException;

/**
 * Http code 403
 */
class ForbiddenException extends DefaultException
{
  public $http_code = 403;

  public function __construct(string $message, array $info = [], $previous = null)
  {
    parent::__construct($message, $info, $previous);
  }
}
