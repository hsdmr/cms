<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Permalink extends Model
{
  protected $table = 'permalink';
  protected $unique = ['path'];
  protected $soft_delete = true;

  public static function findById(int $id)
  {
    $item = new User();
    return $item->find($id);
  }

  public static function findByPath(string $path)
  {
    $item = new User();
    return $item->where([['path', '=', $path]])->first();
  }
}
