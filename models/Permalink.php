<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Permalink extends Model
{
  protected string $table = 'permalink';
  protected array $unique = ['path'];
  protected bool $soft_delete = true;

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
