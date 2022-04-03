<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Category extends Model
{
  protected string $table = 'category';
  protected array $unique = ['permalink_id'];
  protected bool $soft_delete = false;

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
