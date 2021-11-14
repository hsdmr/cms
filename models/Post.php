<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Post extends Model
{
    protected $class = __CLASS__;
    protected $table = 'post';
    protected $unique = ['permalink_id'];
    protected $soft_delete = true;

    public static function getWithId(int $id, bool $as_array = false)
    {
        $item = new Post();
        if ($as_array) {
            return $item->find($id)->toArray();
        }
        return $item->find($id);
    }

    public static function getWithPermalinkId(int $permalink_id, bool $as_array = false)
    {
        $item = new Post();
        if ($as_array) {
            return $item->where([['permalink_id', '=', $permalink_id]])->first()->toArray();
        }
        return $item->where([['permalink_id', '=', $permalink_id]])->first();
    }
}
