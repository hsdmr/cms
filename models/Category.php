<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Category extends Model
{
    protected $class = __CLASS__;
    protected $table = 'category';
    protected $unique = ['permalink_id'];
    protected $soft_delete = true;

    public static function getWithId(int $id, bool $as_array = false)
    {
        $item = new Category();
        if ($as_array) {
            return $item->find($id)->toArray();
        }
        return $item->find($id);
    }
}
