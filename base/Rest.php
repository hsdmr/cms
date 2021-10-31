<?php

namespace Hasdemir\Base;

use Hasdemir\Base\Response;

class Rest
{
    protected array $header = [];
    protected ?array $body = null;
    protected ?string $link = null;

    public function response($http_code)
    {
        Response::emit($http_code, $this->header, $this->body ?? '');
    }
}
