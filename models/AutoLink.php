<?php

namespace Hasdemir\Model;

use Hasdemir\Base\Model;

class AutoLink extends Model
{
  protected string $table = 'auto_link';
  protected bool $unique = ['word'];

  public static function findById(int $id, $with_deleted = null, $only_deleted = null, $with_hidden = null)
  {
    $item = new AutoLink();
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

  public static function findByMeta(string $word)
  {
    $item = new AutoLink();
    return $item->where('word', $word)->first();
  }
}
