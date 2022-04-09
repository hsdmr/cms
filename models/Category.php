<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Category extends Model
{
  protected string $table = 'category';
  protected array $unique = ['slug_id'];
  protected bool $soft_delete = false;

  public static function find(int $id)
  {
    $item = new Category();
    return $item->findByPrimaryKey($id);
  }

  public function posts()
  {
    return $this->belongsToMany('post');
  }
}
