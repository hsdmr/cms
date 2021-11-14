<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Post extends Model
{
    protected $class = __CLASS__;
    protected $table = 'post';
    protected $unique = ['permalink_id'];
    protected $soft_delete = true;
}
