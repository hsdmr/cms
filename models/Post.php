<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Post extends Model
{
  protected string $table = 'post';
  protected array $unique = ['slug_id'];
  protected array $hidden = ['created_at', 'updated_at'];
  protected bool $soft_delete = true;

  public static function find(int $id)
  {
    $item = new Post();
    return $item->findByPrimaryKey($id);
  }

  public static function findBySlugId(int $slug_id)
  {
    $item = new Post();
    return $item->where('slug_id', '=', $slug_id)->first();
  }

  public function categories()
  {
    return $this->belongsToMany('category');
  }

  public function user()
  {
    return $this->belongTo('user');
  }

  public function slug()
  {
    return $this->belongTo('slug');
  }
}
