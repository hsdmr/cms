<?php

namespace Hasdemir\Exception;

use Hasdemir\Base\DefaultException;

class AuthenticationException extends DefaultException
{
    public $http_code = 401;

    public function __construct(string $message, array $info = [], $previous = null)
    {
        parent::__construct($message, $info, $previous);
    }
}
