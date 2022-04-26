<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Slug extends Model
{
  protected string $table = 'slug';
  protected array $unique = ['path'];
  protected bool $soft_delete = true;

  const OWNER = ['post', 'page', 'product', 'lesson'];

  public static function find(int $id)
  {
    $item = new User();
    return $item->findByPrimaryKey($id);
  }
  
  public static function findByPath(string $path)
  {
    $item = new User();
    return $item->where('path', $path)->first();
  }
}
