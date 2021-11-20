<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Post extends Model
{
    protected $table = 'post';
    protected $unique = ['permalink_id'];
    protected $soft_delete = true;

    public static function findById(int $id)
    {
        $item = new Post();
        return $item->find($id);
    }

    public static function findByPermalinkId(int $permalink_id)
    {
        $item = new Post();
        return $item->where([['permalink_id', '=', $permalink_id]])->first();
    }

    public function categories()
    {
        return $this->belongsToMany('category');
    }

    public function user()
    {
        return $this->belongTo('user'); //kendi user_id sini user tablosunda arayacak
    }

    public function permalink()
    {
        return $this->belongTo('permalink');
    }
}
