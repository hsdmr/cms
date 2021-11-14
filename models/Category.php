<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Category extends Model
{
    protected $class = __CLASS__;
    protected $table = 'category';
    protected $unique = ['permalink_id'];
    protected $soft_delete = true;
}
