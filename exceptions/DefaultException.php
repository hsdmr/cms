<?php

namespace Hasdemir\Exception;

class DefaultException extends \Exception
{
    public $http_code = 500;
    public $status_code;

    public function __construct(string $message, array $info, \Exception $previous = null)
    {
        foreach ($info as $key => $value) {
            $this->{$key} = $value;
        }
        parent::__construct($message, $info['statuscode'], $previous);
    }
}
