<?php

namespace Hasdemir\Exception;

use Hasdemir\Base\DefaultException;

/**
 * Http code 503
 */
class StoragePdoException extends DefaultException
{
  public $http_code = 503;

  public function __construct(string $message, array $info = [], $previous = null)
  {
    parent::__construct($message, $info, $previous);
  }
}
