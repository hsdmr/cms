<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Category extends Model
{
    protected $table = 'category';
    protected $unique = ['permalink_id'];
    protected $soft_delete = false;

    public static function findById(int $id)
    {
        $item = new Category();
        return $item->find($id);
    }
    
    public function posts()
    {
        return $this->belongsToMany('post');
    }
}
