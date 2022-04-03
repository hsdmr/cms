<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Permalink extends Model
{
  protected string $table = 'permalink';
  protected array $unique = ['path'];
  protected bool $soft_delete = true;

  public static function findById(int $id)
  {
    $item = new User();
    return $item->find($id);
  }

  public static function findByPath(string $path)
  {
    $item = new User();
    return $item->where('path', $path)->first();
  }
}
