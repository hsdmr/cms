<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class Permalink extends Model
{
  protected string $table = 'permalink';
  protected array $unique = ['path'];
  protected bool $soft_delete = true;

  public static function findById(int $id, $with_deleted = null, $only_deleted = null, $with_hidden = null)
  {
    $item = new User();
    if ($with_deleted) {
      $item->withDeleted();
    }
    if ($only_deleted) {
      $item->onlyDeleted();
    }
    if ($with_hidden) {
      $item->withHidden();
    }
    return $item->findByPrimaryKey($id);
  }

  public static function findByPath(string $path)
  {
    $item = new User();
    return $item->where('path', $path)->first();
  }
}
