<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class AccessToken extends Model
{
    protected $class = __CLASS__;
    protected $table = 'access_token';
    protected $unique = ['token'];
    protected $soft_delete = false;
}
