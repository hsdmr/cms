<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Post extends Model
{
  protected string $table = 'post';
  protected array $unique = ['permalink_id'];
  protected array $hidden = ['created_at', 'updated_at'];
  protected bool $soft_delete = true;

  public static function find(int $id)
  {
    $item = new Post();
    return $item->findByPrimaryKey($id);
  }

  public static function findByPermalinkId(int $permalink_id)
  {
    $item = new Post();
    return $item->where('permalink_id', '=', $permalink_id)->first();
  }

  public function categories()
  {
    return $this->belongsToMany('category');
  }

  public function user()
  {
    return $this->belongTo('user');
  }

  public function permalink()
  {
    return $this->belongTo('permalink');
  }
}
