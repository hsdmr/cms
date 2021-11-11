<?php

namespace Hasdemir\Exception;

use Hasdemir\Base\DefaultException;

class StoragePdoException extends DefaultException
{
    public $http_code = 406;

    public function __construct(string $message, array $info = [], \Exception $previous = null)
    {
        foreach ($info as $key => $value) {
            $this->{$key} = $value;
        }
        parent::__construct($message, $info, $previous);
    }
}
